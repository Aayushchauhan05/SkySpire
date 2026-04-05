"""
PDF → DB-Ready JSON Converter for Language Learning Grammar App
Produces chapter-wise structured JSON suitable for direct import into a database.

Schema:
  book            – top-level metadata
  parts           – major sections (Part A: Structures, Part B: Functions)
  chapters        – numbered chapters with title, part, topic tags
  sections        – sub-sections (e.g. 1.1, 1.2) with content
  examples        – Spanish/English sentence pairs extracted from content
"""

import json, re, sys, os
from dataclasses import dataclass, field, asdict
from typing import List, Optional

# ── helpers ──────────────────────────────────────────────────────────────────

def slug(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '_', text.lower()).strip('_')

def extract_example_pairs(text: str) -> List[dict]:
    """Extract Spanish/English example pairs (heuristic)."""
    pairs = []
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    i = 0
    while i < len(lines) - 1:
        es = lines[i]
        en = lines[i + 1]
        # Spanish line: contains ≥1 Spanish char or typical sentence shape
        # English line: starts with capital, no accented chars from Spanish
        is_spanish = bool(re.search(r'[áéíóúüñ¿¡]', es)) or (
            re.match(r'^[A-ZÁÉÍÓÚÜÑa-z]', es) and len(es.split()) >= 2
        )
        is_english = bool(re.match(r'^[A-Z\(]', en)) and not re.search(r'[áéíóúüñ¿¡]', en)
        if is_spanish and is_english and len(es) < 200 and len(en) < 200:
            pairs.append({"es": es, "en": en})
            i += 2
            continue
        i += 1
    return pairs[:20]  # cap per section

# ── TOC / chapter map ─────────────────────────────────────────────────────────

# Hand-coded from the actual TOC (parsed above).
# Maps chapter_number → (title, part_id, section_tags)
CHAPTER_MAP = {
    # Part A: Structures
    1:  ("Pronunciation and spelling",            "part_a", ["pronunciation","spelling","alphabet"]),
    2:  ("Gender and gender agreements",           "part_a", ["gender","nouns","adjectives"]),
    3:  ("Plurals and number agreement",           "part_a", ["plurals","number","nouns"]),
    4:  ("The articles",                           "part_a", ["articles","definite","indefinite"]),
    5:  ("Adjectives",                             "part_a", ["adjectives","position"]),
    6:  ("Comparative forms of adjectives and adverbs", "part_a", ["comparatives","adjectives","adverbs"]),
    7:  ("Numbers",                                "part_a", ["numbers","cardinal","ordinal"]),
    8:  ("Personal pronouns",                      "part_a", ["pronouns","personal"]),
    9:  ("Demonstratives",                         "part_a", ["demonstratives","pronouns"]),
    10: ("Possessives",                            "part_a", ["possessives","pronouns"]),
    11: ("Relative pronouns",                      "part_a", ["relative_pronouns","que","quien"]),
    12: ("Interrogative and exclamatory forms",    "part_a", ["interrogatives","exclamations","questions"]),
    13: ("Indefinite and negative pronouns and adjectives", "part_a", ["indefinites","negation","pronouns"]),
    14: ("Adverbs",                                "part_a", ["adverbs","formation"]),
    15: ("Negation",                               "part_a", ["negation","no"]),
    16: ("Verb forms",                             "part_a", ["verbs","conjugation","tenses"]),
    17: ("Use of the verb forms",                  "part_a", ["verbs","tenses","indicative"]),
    18: ("Use of the subjunctive",                 "part_a", ["subjunctive","mood","verbs"]),
    19: ("Sequence of tense",                      "part_a", ["tense","sequence","reported_speech"]),
    20: ("Other forms of the verb and their uses", "part_a", ["verbs","periphrasis","gerund","infinitive"]),
    21: ("Modal auxiliary verbs and expressions",  "part_a", ["modals","poder","deber","querer"]),
    22: ("Ser and estar",                          "part_a", ["ser","estar","copulas"]),
    23: ("The reflexive",                          "part_a", ["reflexive","verbs","pronouns"]),
    24: ("The passive",                            "part_a", ["passive","voice","ser","estar"]),
    25: ("Prepositions",                           "part_a", ["prepositions","a","de","en","por","para"]),
    26: ("Complementation",                        "part_a", ["complementation","infinitive","subjunctive"]),
    27: ("Conjunctions",                           "part_a", ["conjunctions","y","pero","sino"]),
    28: ("Word order",                             "part_a", ["word_order","syntax"]),
    # Part B: Functions
    29: ("Making social contacts",                 "part_b", ["social","greetings","introductions","phone","letters"]),
    30: ("Basic strategies for communication",     "part_b", ["communication","conversation","fillers"]),
    31: ("Asking questions and responding",        "part_b", ["questions","responses","information"]),
    32: ("Negating",                               "part_b", ["negation","no","functional"]),
    33: ("Reporting",                              "part_b", ["reported_speech","indirect_speech"]),
    34: ("Asking and giving personal information", "part_b", ["personal_info","identity","nationality"]),
    35: ("Identifying people, places and things",  "part_b", ["identification","description"]),
    36: ("Describing",                             "part_b", ["describing","ser","estar","weather"]),
    37: ("Making comparisons",                     "part_b", ["comparisons","inequality","equality"]),
    38: ("Expressing existence and availability",  "part_b", ["existence","hay","availability"]),
    39: ("Expressing location and distance",       "part_b", ["location","distance","place"]),
    40: ("Expressing possessive relations",        "part_b", ["possession","ownership","body_parts"]),
    41: ("Expressing changes",                     "part_b", ["changes","ponerse","hacerse","volverse"]),
    42: ("Describing processes and results",       "part_b", ["processes","results","passive"]),
    43: ("Expressing cause, effect and purpose",   "part_b", ["cause","effect","purpose","porque","para"]),
    44: ("Expressing knowledge",                   "part_b", ["knowledge","saber","conocer"]),
    45: ("Remembering and forgetting",             "part_b", ["memory","recordar","olvidar"]),
    46: ("Expressing obligation and duty",         "part_b", ["obligation","duty","tener_que","deber"]),
    47: ("Expressing needs",                       "part_b", ["needs","necessity","necesitar"]),
    48: ("Expressing possibility and probability", "part_b", ["possibility","probability","puede_que"]),
    49: ("Expressing certainty and uncertainty",   "part_b", ["certainty","uncertainty","seguro"]),
    50: ("Expressing supposition",                 "part_b", ["supposition","suponer","deber"]),
    51: ("Expressing conditions",                  "part_b", ["conditions","si","conditional"]),
    52: ("Expressing contrast or opposition",      "part_b", ["contrast","pero","sino","aunque"]),
    53: ("Expressing capability and incapability", "part_b", ["capability","poder","saber"]),
    54: ("Seeking and giving permission",          "part_b", ["permission","poder","dejar"]),
    55: ("Asking and giving opinions",             "part_b", ["opinions","creer","pensar","parecer"]),
    56: ("Expressing agreement, disagreement and indifference", "part_b", ["agreement","disagreement","indifference"]),
    57: ("Expressing desires and preferences",     "part_b", ["desires","preferences","querer","preferir"]),
    58: ("Expressing likes and dislikes",          "part_b", ["likes","dislikes","gustar","encantar"]),
    59: ("Expressing surprise",                    "part_b", ["surprise","exclamations","qué"]),
    60: ("Expressing satisfaction and dissatisfaction", "part_b", ["satisfaction","dissatisfaction"]),
    61: ("Expressing approval and disapproval",    "part_b", ["approval","disapproval"]),
    62: ("Expressing hope",                        "part_b", ["hope","esperar","ojalá"]),
    63: ("Expressing sympathy",                    "part_b", ["sympathy","sentir","alegrarse"]),
    64: ("Apologizing and expressing forgiveness", "part_b", ["apology","forgiveness","perdon"]),
    65: ("Expressing fear or worry",               "part_b", ["fear","worry","temer","preocupar"]),
    66: ("Expressing gratitude",                   "part_b", ["gratitude","thanks","agradecer"]),
    67: ("Giving advice and making suggestions",   "part_b", ["advice","suggestions","deber","poder"]),
    68: ("Making requests",                        "part_b", ["requests","pedir","imperativo"]),
    69: ("Giving directions, instructions and orders", "part_b", ["directions","instructions","orders","imperative"]),
    70: ("Making an offer or invitation",          "part_b", ["offers","invitations","accepting","declining"]),
    71: ("Talking about the present",              "part_b", ["present_tense","present","habitual"]),
    72: ("Talking about the future",               "part_b", ["future_tense","plans","intentions","future"]),
    73: ("Talking about the past",                 "part_b", ["past_tense","preterite","imperfect","perfect"]),
}

PARTS = {
    "part_a": {
        "id": "part_a",
        "title": "Part A: Structures",
        "description": "Grammatical structures of Spanish — forms, rules, and patterns.",
        "order": 1,
        "chapter_range": [1, 28],
    },
    "part_b": {
        "id": "part_b",
        "title": "Part B: Functions",
        "description": "Functional use of Spanish — how grammar is applied in real communication.",
        "order": 2,
        "chapter_range": [29, 73],
    },
}

PART_B_SECTIONS = {
    "I":   "Social contacts and communication strategies",
    "II":  "Giving and seeking factual information",
    "III": "Putting events into a wider context",
    "IV":  "Expressing emotional attitudes",
    "V":   "The language of persuasion",
    "VI":  "Expressing temporal relations",
}

# difficulty heuristic: Part A = intermediate, early Part B = beginner-friendly
def difficulty(ch_num: int) -> str:
    if ch_num <= 7:   return "beginner"
    if ch_num <= 20:  return "intermediate"
    if ch_num <= 28:  return "advanced"
    if ch_num <= 45:  return "beginner"
    return "intermediate"

# ── page → chapter assignment ─────────────────────────────────────────────────

def build_chapter_page_ranges(pages: list) -> dict:
    """
    Scan pages for chapter-start patterns like '^N\n<Title>' or '^N\n'
    and return {chapter_num: (start_page, end_page)}.
    """
    chapter_starts = {}  # ch_num → pdf_page_index (0-based)

    for i, page in enumerate(pages):
        text = page["text"]
        if not text.strip():
            continue
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        if not lines:
            continue
        first = lines[0]
        # Pattern: page starts with just a chapter number (1-73)
        m = re.match(r'^(\d{1,2})$', first)
        if m:
            ch = int(m.group(1))
            if ch in CHAPTER_MAP and ch not in chapter_starts:
                # verify second line somewhat matches title
                chapter_starts[ch] = i

    # Also detect by section header style "^N\nCHAPTER TITLE" on first line
    for i, page in enumerate(pages):
        text = page["text"]
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        if len(lines) < 2:
            continue
        m = re.match(r'^(\d{1,2})$', lines[0])
        if m:
            ch = int(m.group(1))
            if ch in CHAPTER_MAP and ch not in chapter_starts:
                chapter_starts[ch] = i

    # Build ranges
    sorted_chs = sorted(chapter_starts.items(), key=lambda x: x[1])
    ranges = {}
    for idx, (ch, start) in enumerate(sorted_chs):
        end = sorted_chs[idx + 1][1] - 1 if idx + 1 < len(sorted_chs) else len(pages) - 1
        ranges[ch] = (start, end)
    return ranges

def build_section_entries(pages: list, start_idx: int, end_idx: int, ch_num: int) -> list:
    """
    Within a chapter's pages, find sub-sections (e.g. '1.1', '2.3') and
    collect their text + examples.
    """
    sections = []
    section_pattern = re.compile(rf'^{ch_num}\.\d{{1,2}}$')
    current_sec = None
    current_text_lines = []
    current_sec_num = None

    def flush(sec_label, sec_num, lines):
        if not sec_label:
            return
        body = "\n".join(lines).strip()
        # derive title from TOC section label or first meaningful line
        title = sec_label
        for l in lines[:5]:
            if l and not re.match(r'^\d', l) and len(l) > 5:
                title = l[:120]
                break
        examples = extract_example_pairs(body)
        sections.append({
            "id": f"ch{ch_num:02d}_sec_{slug(sec_label)}",
            "chapter_id": f"chapter_{ch_num:02d}",
            "section_number": sec_label,
            "title": title,
            "content": body[:4000],  # cap for DB storage
            "word_count": len(body.split()),
            "examples": examples,
            "example_count": len(examples),
        })

    for page in pages[start_idx:end_idx + 1]:
        for line in page["text"].splitlines():
            stripped = line.strip()
            if section_pattern.match(stripped):
                flush(current_sec, current_sec_num, current_text_lines)
                current_sec = stripped
                current_sec_num = stripped
                current_text_lines = []
            else:
                current_text_lines.append(stripped)

    flush(current_sec, current_sec_num, current_text_lines)
    return sections

# ── main ──────────────────────────────────────────────────────────────────────

def convert(input_json: str, output_json: str):
    print(f"\n📖  Loading '{input_json}' …")
    with open(input_json, encoding="utf-8") as f:
        raw = json.load(f)

    book_meta = raw["metadata"]
    pages = raw["pages"]
    total = len(pages)
    print(f"    {total} pages loaded.")

    # 1. Book record
    book = {
        "id": "book_modern_spanish_grammar",
        "title": book_meta.get("title", "Modern Spanish Grammar"),
        "authors": book_meta.get("author", ""),
        "edition": "2nd Edition",
        "language": "es",
        "target_language": "en",
        "total_pages": total,
        "total_chapters": len(CHAPTER_MAP),
        "source_file": raw["source_file"],
        "converted_at": raw["converted_at"],
    }

    # 2. Detect chapter page ranges
    print("🔍  Detecting chapter boundaries …")
    ranges = build_chapter_page_ranges(pages)
    print(f"    Found {len(ranges)} chapters with page boundaries.")

    # 3. Build chapters + sections
    chapters = []
    all_sections = []
    all_examples = []

    print("✂️   Building chapters and sections …")
    for ch_num in sorted(CHAPTER_MAP.keys()):
        title, part_id, tags = CHAPTER_MAP[ch_num]
        ch_id = f"chapter_{ch_num:02d}"

        start_idx, end_idx = ranges.get(ch_num, (0, 0))
        page_start = pages[start_idx]["page_number"] if start_idx < total else 0
        page_end   = pages[end_idx]["page_number"]   if end_idx < total else 0

        # Full chapter text
        full_text = "\n".join(
            pages[i]["text"] for i in range(start_idx, min(end_idx + 1, total))
        ).strip()

        # Sub-sections
        sections = build_section_entries(pages, start_idx, end_idx, ch_num)

        # Chapter-level examples (from whole text, fallback)
        ch_examples = extract_example_pairs(full_text)

        # Collect all examples with lineage
        for ex in ch_examples:
            ex_id = f"ex_{ch_id}_{len(all_examples):04d}"
            all_examples.append({
                "id": ex_id,
                "chapter_id": ch_id,
                "section_id": None,
                "spanish": ex["es"],
                "english": ex["en"],
                "tags": tags,
            })
        for sec in sections:
            for ex in sec.get("examples", []):
                ex_id = f"ex_{sec['id']}_{len(all_examples):04d}"
                all_examples.append({
                    "id": ex_id,
                    "chapter_id": ch_id,
                    "section_id": sec["id"],
                    "spanish": ex["es"],
                    "english": ex["en"],
                    "tags": tags,
                })
            sec.pop("examples", None)  # stored separately

        all_sections.extend(sections)

        chapters.append({
            "id": ch_id,
            "book_id": book["id"],
            "part_id": part_id,
            "chapter_number": ch_num,
            "title": title,
            "slug": slug(title),
            "difficulty": difficulty(ch_num),
            "tags": tags,
            "page_start": page_start,
            "page_end": page_end,
            "total_pages": max(0, page_end - page_start + 1),
            "word_count": len(full_text.split()),
            "section_count": len(sections),
            "example_count": len(ch_examples),
            "summary": full_text[:500].replace("\n", " ").strip(),
        })
        print(f"    Ch {ch_num:02d}  '{title[:50]}'  "
              f"pp {page_start}–{page_end}  "
              f"{len(sections)} secs  {len(ch_examples)} examples")

    # 4. Assemble final DB document
    db = {
        "_schema_version": "1.0",
        "_description": (
            "DB-ready grammar module for a language learning app. "
            "Import each top-level key as a separate collection/table."
        ),
        "tables": {
            "book":     [book],
            "parts":    list(PARTS.values()),
            "chapters": chapters,
            "sections": all_sections,
            "examples": all_examples,
        },
        "stats": {
            "total_chapters": len(chapters),
            "total_sections": len(all_sections),
            "total_examples": len(all_examples),
            "parts": len(PARTS),
        },
    }

    print(f"\n💾  Writing '{output_json}' …")
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    size_kb = os.path.getsize(output_json) / 1024
    print(f"\n✅  Done!")
    print(f"   File size     : {size_kb:.1f} KB")
    print(f"   Chapters      : {db['stats']['total_chapters']}")
    print(f"   Sections      : {db['stats']['total_sections']}")
    print(f"   Examples      : {db['stats']['total_examples']}")


if __name__ == "__main__":
    inp = sys.argv[1] if len(sys.argv) > 1 else "/mnt/user-data/outputs/modern-spanish-grammar.json"
    out = sys.argv[2] if len(sys.argv) > 2 else "/home/claude/spanish_grammar_db.json"
    convert(inp, out)
