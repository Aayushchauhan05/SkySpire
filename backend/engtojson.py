"""
pdf_to_json_grammar.py
======================
Converts "Free English Grammar" PDF (Mary Ansell) into structured JSON
suitable for seeding a language-learning database.

The PDF uses a broken CID custom font encoding, so ALL text extraction is
done via Claude Vision API (page images → structured JSON).

USAGE
-----
    python3 pdf_to_json_grammar.py \
        --pdf path/to/grammar.pdf \
        --output grammar_db.json \
        [--start-page 25] \
        [--end-page 488] \
        [--dpi 150] \
        [--resume]

REQUIREMENTS
------------
    pip install anthropic pillow pypdf

OUTPUT JSON SCHEMA
------------------
{
  "book": {
    "title": "Free English Grammar",
    "author": "Mary Ansell",
    "edition": "Second Edition"
  },
  "chapters": [
    {
      "chapter_number": 1,
      "chapter_title": "The simple present of the verb to be",
      "slug": "ch01-simple-present-verb-to-be",
      "topics": [
        {
          "topic_number": "1",
          "topic_title": "Grammar",
          "slug": "grammar",
          "subtopics": [
            {
              "subtopic_label": "a",
              "subtopic_title": "Affirmative statements",
              "slug": "affirmative-statements",
              "content": "...",
              "examples": ["I am a student.", "She is happy."],
              "notes": []
            }
          ],
          "content": "The grammar of a language is an analysis...",
          "examples": [],
          "notes": []
        }
      ],
      "exercises": [
        {
          "exercise_number": 1,
          "instructions": "Fill in the blank...",
          "questions": [
            {"number": 1, "question": "She ___ a teacher.", "answer": "is"}
          ]
        }
      ],
      "start_page": 25,
      "end_page": 42
    }
  ]
}

CHAPTER MAP  (PDF page numbers where each chapter starts)
----------------------------------------------------------
These are approximate; the script detects chapter boundaries automatically
from the page content. Update if your PDF pagination differs.
"""

import argparse
import base64
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from pathlib import Path

# ── third-party ──────────────────────────────────────────────────────────────
try:
    import anthropic
except ImportError:
    sys.exit("Missing dependency: pip install anthropic")

try:
    from PIL import Image
except ImportError:
    sys.exit("Missing dependency: pip install pillow")

# ─────────────────────────────────────────────────────────────────────────────
#  CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

# Approximate first page of each chapter (0-indexed PDF page numbers).
# These are used only as hints — chapter detection is content-driven.
CHAPTER_START_PAGES = {
    1: 25,   # The simple present of the verb to be
    2: 42,   # The simple present of verbs other than to be
    3: 58,   # The present continuous
    4: 75,   # The present perfect and present perfect continuous
    5: 100,  # The simple past
    6: 115,  # The past continuous, past perfect...
    7: 135,  # The future tenses
    8: 160,  # Conjugations with would
    9: 178,  # The subjunctive
    10: 200, # Modal verbs
    11: 225, # Transitive and intransitive verbs
    12: 240, # The passive voice
    13: 265, # Nouns: formation of plurals
    14: 280, # Singular countable nouns
    15: 295, # Plural countable nouns
    16: 310, # Uncountable nouns
    17: 330, # Nouns indicating possession
    18: 345, # Personal pronouns
    19: 365, # Other pronouns
    20: 385, # Determiners
    21: 400, # Adjectives: position in a sentence
    22: 415, # Adjectives in comparisons: Part 1
    23: 430, # Adjectives in comparisons: Part 2
    24: 440, # Adverbs: position in a sentence
    25: 450, # Adverbs of manner and adverbs in comparisons
    26: 460, # Prepositions
    27: 470, # Phrasal verbs
    28: 480, # Conjunctions
}

# Pages before chapter 1 (TOC, verb tables, etc.)
FRONT_MATTER_END_PAGE = 24  # last 0-indexed page of front matter

MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 4096

# Delay between API calls (seconds) — respect rate limits
API_DELAY = 1.0

# ─────────────────────────────────────────────────────────────────────────────
#  PROMPTS
# ─────────────────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an expert at extracting structured educational content from grammar textbook pages.
Your job is to analyze page images and return ONLY valid JSON — no markdown, no explanation, no backticks.

Always identify:
- Chapter headings (bold, large, all-caps banner)
- Section/topic numbers (1., 2., 3. etc.)
- Sub-topic labels (a., b., c. etc.)
- Sub-sub-topic labels (i., ii., iii. etc.)
- Explanatory content (paragraph text)
- Examples (indented or italic sentences)
- Grammar tables (verb conjugations, etc.)
- Exercise instructions and questions
- Answer keys

Preserve ALL content faithfully. For tables, represent rows as arrays."""

PAGE_EXTRACTION_PROMPT = """Analyze this grammar textbook page image and extract ALL content into JSON.

Return a JSON object with this exact schema:
{
  "page_number": <integer>,
  "page_type": "<one of: front_matter | chapter_start | content | exercise | answer_key | verb_table | index>",
  "chapter_number": <integer or null>,
  "chapter_title": "<string or null>",
  "elements": [
    {
      "type": "<heading | topic | subtopic | sub_subtopic | paragraph | example | table | exercise_instruction | exercise_question | answer | note>",
      "level": <1|2|3|4>,
      "number": "<e.g. '1', 'a', 'i' or null>",
      "title": "<heading text or null>",
      "content": "<main text content>",
      "examples": ["<example sentence>"],
      "rows": [["col1","col2"]] // for tables only
    }
  ]
}

Rules:
- page_type 'chapter_start' only when you see the large dark banner with CHAPTER N
- Include ALL text visible on the page — nothing skipped
- For exercise questions include both question text and blank indicators
- Bold text in examples should be noted as-is (no markup needed)
- Return ONLY the JSON object, nothing else."""


BATCH_ASSEMBLY_PROMPT = """You are assembling raw per-page JSON extractions into a single structured chapter object.

Given a list of page extraction objects for one chapter, produce a single chapter JSON:
{
  "chapter_number": <int>,
  "chapter_title": "<string>",
  "slug": "<kebab-case-slug>",
  "start_page": <int>,
  "end_page": <int>,
  "topics": [
    {
      "topic_number": "<string>",
      "topic_title": "<string>",
      "slug": "<kebab-case-slug>",
      "content": "<concatenated paragraph text>",
      "examples": ["<example>"],
      "notes": ["<note>"],
      "subtopics": [
        {
          "subtopic_label": "<a/b/c>",
          "subtopic_title": "<string>",
          "slug": "<kebab-case-slug>",
          "content": "<text>",
          "examples": ["<example>"],
          "notes": [],
          "sub_subtopics": [
            {
              "label": "<i/ii/iii>",
              "title": "<string>",
              "content": "<text>",
              "examples": []
            }
          ]
        }
      ]
    }
  ],
  "exercises": [
    {
      "exercise_number": <int>,
      "instructions": "<string>",
      "questions": [
        {"number": <int>, "question": "<string>", "answer": "<string or null>"}
      ]
    }
  ]
}

Merge content logically. Group paragraphs under the nearest preceding heading.
Return ONLY the JSON object."""

# ─────────────────────────────────────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    """Convert a heading string to a URL-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def pdf_page_to_base64(pdf_path: str, page_number: int, dpi: int = 150) -> str:
    """
    Rasterize a single PDF page (0-indexed) to JPEG and return base64.
    Uses pdftoppm (from poppler-utils) which is fast and accurate.
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        prefix = os.path.join(tmpdir, "page")
        one_based = page_number + 1
        result = subprocess.run(
            [
                "pdftoppm",
                "-jpeg",
                "-r", str(dpi),
                "-f", str(one_based),
                "-l", str(one_based),
                pdf_path,
                prefix,
            ],
            capture_output=True,
            check=True,
        )
        # pdftoppm zero-pads based on total page count
        output_files = sorted(Path(tmpdir).glob("page-*.jpg"))
        if not output_files:
            raise RuntimeError(f"pdftoppm produced no output for page {one_based}")
        with open(output_files[0], "rb") as f:
            return base64.standard_b64encode(f.read()).decode("utf-8")


def extract_page_content(client: anthropic.Anthropic, pdf_path: str,
                          page_number: int, dpi: int) -> dict:
    """Send one page image to Claude and get structured JSON back."""
    image_data = pdf_page_to_base64(pdf_path, page_number, dpi)

    response = client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": PAGE_EXTRACTION_PROMPT,
                    },
                ],
            }
        ],
    )

    raw = response.content[0].text.strip()
    # Strip accidental markdown fences
    raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.MULTILINE)
    raw = re.sub(r"\s*```$", "", raw, flags=re.MULTILINE)
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"  ⚠ JSON parse error on page {page_number + 1}: {e}")
        return {
            "page_number": page_number + 1,
            "page_type": "unknown",
            "chapter_number": None,
            "chapter_title": None,
            "elements": [],
            "_raw": raw,
        }


def assemble_chapter(client: anthropic.Anthropic, pages: list[dict],
                     chapter_number: int) -> dict:
    """Use Claude to assemble per-page extractions into one chapter object."""
    pages_json = json.dumps(pages, ensure_ascii=False)

    response = client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Here are the per-page extractions for Chapter {chapter_number}:\n\n"
                    f"{pages_json}\n\n"
                    f"{BATCH_ASSEMBLY_PROMPT}"
                ),
            }
        ],
    )

    raw = response.content[0].text.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.MULTILINE)
    raw = re.sub(r"\s*```$", "", raw, flags=re.MULTILINE)
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"  ⚠ Chapter assembly JSON error for ch{chapter_number}: {e}")
        return {
            "chapter_number": chapter_number,
            "chapter_title": f"Chapter {chapter_number}",
            "slug": f"ch{chapter_number:02d}",
            "start_page": pages[0].get("page_number"),
            "end_page": pages[-1].get("page_number"),
            "topics": [],
            "exercises": [],
            "_pages_raw": pages,
        }


def detect_chapter_boundaries(page_extractions: list[dict]) -> dict[int, list[int]]:
    """
    Group page extractions by chapter number.
    Returns {chapter_number: [page_extraction, ...]}
    """
    chapters: dict[int, list[dict]] = {}
    current_chapter = None

    for page in page_extractions:
        ch = page.get("chapter_number")
        if ch is not None:
            current_chapter = ch
        if current_chapter is not None:
            chapters.setdefault(current_chapter, []).append(page)

    return chapters


def load_checkpoint(checkpoint_path: str) -> dict:
    if os.path.exists(checkpoint_path):
        with open(checkpoint_path) as f:
            return json.load(f)
    return {"completed_pages": [], "page_extractions": []}


def save_checkpoint(checkpoint_path: str, data: dict):
    with open(checkpoint_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ─────────────────────────────────────────────────────────────────────────────
#  MAIN PIPELINE
# ─────────────────────────────────────────────────────────────────────────────

def get_pdf_page_count(pdf_path: str) -> int:
    result = subprocess.run(
        ["pdfinfo", pdf_path], capture_output=True, text=True, check=True
    )
    for line in result.stdout.splitlines():
        if line.startswith("Pages:"):
            return int(line.split(":")[1].strip())
    raise RuntimeError("Could not determine PDF page count")


def run_extraction(
    pdf_path: str,
    output_path: str,
    start_page: int,   # 1-indexed
    end_page: int,     # 1-indexed
    dpi: int,
    resume: bool,
):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit(
            "Set your ANTHROPIC_API_KEY environment variable:\n"
            "  export ANTHROPIC_API_KEY=sk-ant-..."
        )

    client = anthropic.Anthropic(api_key=api_key)

    total_pages = get_pdf_page_count(pdf_path)
    end_page = min(end_page, total_pages)
    print(f"📖  PDF: {pdf_path}  ({total_pages} pages total)")
    print(f"📄  Extracting pages {start_page}–{end_page} at {dpi} DPI")

    # ── Checkpoint / resume ──────────────────────────────────────────────────
    checkpoint_path = output_path.replace(".json", "_checkpoint.json")
    state = load_checkpoint(checkpoint_path) if resume else {"completed_pages": [], "page_extractions": []}
    completed = set(state["completed_pages"])
    page_extractions: list[dict] = state["page_extractions"]

    # ── Phase 1: Per-page extraction ─────────────────────────────────────────
    pages_to_process = [
        p for p in range(start_page - 1, end_page)  # convert to 0-indexed
        if (p + 1) not in completed
    ]

    print(f"\n{'─'*60}")
    print(f"PHASE 1: Extracting {len(pages_to_process)} pages via Claude Vision")
    print(f"{'─'*60}")

    for i, page_idx in enumerate(pages_to_process):
        page_num = page_idx + 1  # 1-indexed for display
        print(f"  [{i+1}/{len(pages_to_process)}] Page {page_num} ...", end=" ", flush=True)

        try:
            extraction = extract_page_content(client, pdf_path, page_idx, dpi)
            extraction["page_number"] = page_num  # ensure correct
            page_extractions.append(extraction)
            completed.add(page_num)

            ptype = extraction.get("page_type", "?")
            ch = extraction.get("chapter_number")
            ch_str = f"Ch.{ch}" if ch else "     "
            print(f"✓  {ch_str}  [{ptype}]")

            # Save checkpoint every 5 pages
            if (i + 1) % 5 == 0:
                state = {"completed_pages": list(completed), "page_extractions": page_extractions}
                save_checkpoint(checkpoint_path, state)
                print(f"  💾  Checkpoint saved ({len(completed)} pages done)")

            time.sleep(API_DELAY)

        except anthropic.RateLimitError:
            print("⚠ Rate limited — waiting 30s")
            time.sleep(30)
            # Retry once
            extraction = extract_page_content(client, pdf_path, page_idx, dpi)
            page_extractions.append(extraction)
            completed.add(page_num)
            time.sleep(API_DELAY)

        except Exception as e:
            print(f"✗  ERROR: {e}")
            page_extractions.append({
                "page_number": page_num,
                "page_type": "error",
                "chapter_number": None,
                "chapter_title": None,
                "elements": [],
                "_error": str(e),
            })
            completed.add(page_num)
            time.sleep(API_DELAY)

    # Final checkpoint after phase 1
    state = {"completed_pages": list(completed), "page_extractions": page_extractions}
    save_checkpoint(checkpoint_path, state)
    print(f"\n✅  Phase 1 complete. {len(page_extractions)} pages extracted.\n")

    # ── Phase 2: Group pages into chapters ───────────────────────────────────
    print(f"{'─'*60}")
    print("PHASE 2: Grouping pages into chapters")
    print(f"{'─'*60}")

    # Sort by page number before grouping
    page_extractions.sort(key=lambda x: x.get("page_number", 0))
    chapter_pages = detect_chapter_boundaries(page_extractions)

    print(f"  Detected {len(chapter_pages)} chapters: {sorted(chapter_pages.keys())}")

    # ── Phase 3: Chapter assembly ─────────────────────────────────────────────
    print(f"\n{'─'*60}")
    print("PHASE 3: Assembling chapters with Claude")
    print(f"{'─'*60}")

    chapters = []
    for ch_num in sorted(chapter_pages.keys()):
        pages = chapter_pages[ch_num]
        print(f"  Assembling Chapter {ch_num} ({len(pages)} pages) ...", end=" ", flush=True)
        try:
            chapter_obj = assemble_chapter(client, pages, ch_num)
            # Add slug if missing
            if "slug" not in chapter_obj or not chapter_obj["slug"]:
                chapter_obj["slug"] = f"ch{ch_num:02d}-{slugify(chapter_obj.get('chapter_title', ''))}"
            chapters.append(chapter_obj)
            print(f"✓  {chapter_obj.get('chapter_title', '?')[:60]}")
            time.sleep(API_DELAY)
        except Exception as e:
            print(f"✗  ERROR: {e}")
            chapters.append({
                "chapter_number": ch_num,
                "chapter_title": f"Chapter {ch_num}",
                "slug": f"ch{ch_num:02d}",
                "error": str(e),
                "_pages_raw": pages,
            })

    # ── Build final output ────────────────────────────────────────────────────
    output = {
        "book": {
            "title": "Free English Grammar",
            "author": "Mary Ansell",
            "edition": "Second Edition",
            "copyright": "2000",
            "total_chapters": len(chapters),
            "extraction_metadata": {
                "pdf_pages_processed": len(completed),
                "dpi": dpi,
                "model": MODEL,
            },
        },
        "chapters": chapters,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    size_kb = os.path.getsize(output_path) // 1024
    print(f"\n🎉  Done! Output saved to: {output_path}  ({size_kb} KB)")
    print(f"    Chapters: {len(chapters)}")
    print(f"    Topics total: {sum(len(c.get('topics', [])) for c in chapters)}")

    # Clean up checkpoint on success
    if os.path.exists(checkpoint_path):
        os.remove(checkpoint_path)
        print(f"    Checkpoint removed.")


# ─────────────────────────────────────────────────────────────────────────────
#  BONUS: DATABASE SEEDING HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def flatten_for_db(grammar_json_path: str, output_csv_path: str):
    """
    Flatten the JSON into a CSV ready for direct DB import.
    Columns: chapter_number, chapter_title, topic_number, topic_title,
             subtopic_label, subtopic_title, content, examples, level
    """
    import csv

    with open(grammar_json_path, encoding="utf-8") as f:
        data = json.load(f)

    rows = []
    for ch in data.get("chapters", []):
        ch_num = ch.get("chapter_number")
        ch_title = ch.get("chapter_title", "")
        for topic in ch.get("topics", []):
            t_num = topic.get("topic_number", "")
            t_title = topic.get("topic_title", "")
            # Top-level topic row
            rows.append({
                "chapter_number": ch_num,
                "chapter_title": ch_title,
                "topic_number": t_num,
                "topic_title": t_title,
                "subtopic_label": "",
                "subtopic_title": "",
                "sub_subtopic_label": "",
                "sub_subtopic_title": "",
                "content": topic.get("content", ""),
                "examples": " | ".join(topic.get("examples", [])),
                "level": 2,
            })
            for sub in topic.get("subtopics", []):
                rows.append({
                    "chapter_number": ch_num,
                    "chapter_title": ch_title,
                    "topic_number": t_num,
                    "topic_title": t_title,
                    "subtopic_label": sub.get("subtopic_label", ""),
                    "subtopic_title": sub.get("subtopic_title", ""),
                    "sub_subtopic_label": "",
                    "sub_subtopic_title": "",
                    "content": sub.get("content", ""),
                    "examples": " | ".join(sub.get("examples", [])),
                    "level": 3,
                })
                for ssub in sub.get("sub_subtopics", []):
                    rows.append({
                        "chapter_number": ch_num,
                        "chapter_title": ch_title,
                        "topic_number": t_num,
                        "topic_title": t_title,
                        "subtopic_label": sub.get("subtopic_label", ""),
                        "subtopic_title": sub.get("subtopic_title", ""),
                        "sub_subtopic_label": ssub.get("label", ""),
                        "sub_subtopic_title": ssub.get("title", ""),
                        "content": ssub.get("content", ""),
                        "examples": " | ".join(ssub.get("examples", [])),
                        "level": 4,
                    })

    fieldnames = [
        "chapter_number", "chapter_title",
        "topic_number", "topic_title",
        "subtopic_label", "subtopic_title",
        "sub_subtopic_label", "sub_subtopic_title",
        "content", "examples", "level",
    ]

    with open(output_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"📊  Flattened CSV written: {output_csv_path}  ({len(rows)} rows)")


def generate_sql_seed(grammar_json_path: str, output_sql_path: str):
    """
    Generate SQL INSERT statements for a typical language-learning schema.
    Tables assumed: chapters, topics, subtopics, examples, exercises, questions
    """

    with open(grammar_json_path, encoding="utf-8") as f:
        data = json.load(f)

    def esc(s):
        if s is None:
            return "NULL"
        return "'" + str(s).replace("'", "''") + "'"

    lines = [
        "-- Auto-generated SQL seed from Free English Grammar",
        "-- Run against your language-learning database",
        "",
        "BEGIN TRANSACTION;",
        "",
        "-- ── CHAPTERS ──────────────────────────────────────────────",
    ]

    for ch in data.get("chapters", []):
        lines.append(
            f"INSERT INTO chapters (chapter_number, title, slug, start_page, end_page) VALUES "
            f"({ch.get('chapter_number')}, {esc(ch.get('chapter_title'))}, "
            f"{esc(ch.get('slug'))}, {ch.get('start_page') or 'NULL'}, "
            f"{ch.get('end_page') or 'NULL'});"
        )

    lines += ["", "-- ── TOPICS ────────────────────────────────────────────────"]

    topic_id = 1
    subtopic_id = 1
    example_id = 1
    exercise_id = 1
    question_id = 1

    for ch in data.get("chapters", []):
        ch_num = ch.get("chapter_number")
        for topic in ch.get("topics", []):
            lines.append(
                f"INSERT INTO topics (id, chapter_number, topic_number, title, slug, content) VALUES "
                f"({topic_id}, {ch_num}, {esc(topic.get('topic_number'))}, "
                f"{esc(topic.get('topic_title'))}, {esc(topic.get('slug'))}, "
                f"{esc(topic.get('content'))});"
            )
            for ex in topic.get("examples", []):
                lines.append(
                    f"INSERT INTO examples (id, topic_id, subtopic_id, sentence) VALUES "
                    f"({example_id}, {topic_id}, NULL, {esc(ex)});"
                )
                example_id += 1

            for sub in topic.get("subtopics", []):
                lines.append(
                    f"INSERT INTO subtopics (id, topic_id, label, title, slug, content) VALUES "
                    f"({subtopic_id}, {topic_id}, {esc(sub.get('subtopic_label'))}, "
                    f"{esc(sub.get('subtopic_title'))}, {esc(sub.get('slug'))}, "
                    f"{esc(sub.get('content'))});"
                )
                for ex in sub.get("examples", []):
                    lines.append(
                        f"INSERT INTO examples (id, topic_id, subtopic_id, sentence) VALUES "
                        f"({example_id}, {topic_id}, {subtopic_id}, {esc(ex)});"
                    )
                    example_id += 1
                subtopic_id += 1
            topic_id += 1

        lines += ["", f"-- ── EXERCISES for Chapter {ch_num} ────────────────────────────"]
        for ex in ch.get("exercises", []):
            lines.append(
                f"INSERT INTO exercises (id, chapter_number, exercise_number, instructions) VALUES "
                f"({exercise_id}, {ch_num}, {ex.get('exercise_number') or 'NULL'}, "
                f"{esc(ex.get('instructions'))});"
            )
            for q in ex.get("questions", []):
                lines.append(
                    f"INSERT INTO exercise_questions (id, exercise_id, question_number, question, answer) VALUES "
                    f"({question_id}, {exercise_id}, {q.get('number') or 'NULL'}, "
                    f"{esc(q.get('question'))}, {esc(q.get('answer'))});"
                )
                question_id += 1
            exercise_id += 1

    lines += ["", "COMMIT;", ""]

    with open(output_sql_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"🗄   SQL seed written: {output_sql_path}")


# ─────────────────────────────────────────────────────────────────────────────
#  CLI
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Extract Free English Grammar PDF into structured JSON for DB seeding."
    )
    parser.add_argument("--pdf", required=True, help="Path to the PDF file")
    parser.add_argument("--output", default="grammar_db.json", help="Output JSON path")
    parser.add_argument("--start-page", type=int, default=25,
                        help="First PDF page to extract (1-indexed, default: 25 = Chapter 1 start)")
    parser.add_argument("--end-page", type=int, default=488,
                        help="Last PDF page to extract (1-indexed, default: 488 = end of book)")
    parser.add_argument("--dpi", type=int, default=150,
                        help="Image resolution for page rasterization (default: 150)")
    parser.add_argument("--resume", action="store_true",
                        help="Resume from checkpoint if extraction was interrupted")
    parser.add_argument("--flatten-csv", metavar="OUTPUT.csv",
                        help="Flatten existing JSON to CSV (skips extraction)")
    parser.add_argument("--generate-sql", metavar="OUTPUT.sql",
                        help="Generate SQL INSERT statements from existing JSON")

    args = parser.parse_args()

    # Post-processing modes (no API calls needed)
    if args.flatten_csv:
        flatten_for_db(args.output, args.flatten_csv)
        return

    if args.generate_sql:
        generate_sql_seed(args.output, args.generate_sql)
        return

    # Main extraction
    if not os.path.exists(args.pdf):
        sys.exit(f"PDF not found: {args.pdf}")

    run_extraction(
        pdf_path=args.pdf,
        output_path=args.output,
        start_page=args.start_page,
        end_page=args.end_page,
        dpi=args.dpi,
        resume=args.resume,
    )


if __name__ == "__main__":
    main()