import os
import json
import re
from pdf2image import convert_from_path
import pytesseract
from pathlib import Path

# CONFIGURE TESSERACT PATH
# On Apple Silicon Mac, Homebrew installs to /opt/homebrew/bin/tesseract
pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'

PDF_PATH = 'backend/-Free-English-Grammar (1).pdf'
OUTPUT_JSON = 'backend/grammar_db.json'
START_PAGE = 25  # Chapter 1 starts here
END_PAGE = 488   # Total pages in PDF
DPI = 150        # Slightly lower DPI for speed on full book
CHECKPOINT_EVERY = 20 # Save JSON every 20 pages
ID_PREFIX = "eng_grammar_"

# Hardcoded map for accuracy (from engtojson.py)
CHAPTER_MAP = {
    1: (25, "The simple present of the verb to be"),
    2: (42, "The simple present of verbs other than to be"),
    3: (58, "The present continuous"),
    4: (75, "The present perfect and present perfect continuous"),
    5: (100, "The simple past"),
    6: (115, "The past continuous, past perfect..."),
    7: (135, "The future tenses"),
    8: (160, "Conjugations with would"),
    9: (178, "The subjunctive"),
    10: (200, "Modal verbs"),
    11: (225, "Transitive and intransitive verbs"),
    12: (240, "The passive voice"),
    13: (265, "Nouns: formation of plurals"),
    14: (280, "Singular countable nouns"),
    15: (295, "Plural countable nouns"),
    16: (310, "Uncountable nouns"),
    17: (330, "Nouns indicating possession"),
    18: (345, "Personal pronouns"),
    19: (365, "Other pronouns"),
    20: (385, "Determiners"),
    21: (400, "Adjectives: position in a sentence"),
    22: (415, "Adjectives in comparisons: Part 1"),
    23: (430, "Adjectives in comparisons: Part 2"),
    24: (440, "Adverbs: position in a sentence"),
    25: (450, "Adverbs of manner and adverbs in comparisons"),
    26: (460, "Prepositions"),
    27: (470, "Phrasal verbs"),
    28: (480, "Conjunctions"),
}

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")

def run_ocr():
    print(f"📖  Converting PDF to images (Pages {START_PAGE}-{END_PAGE})...")
    # convert_from_path uses poppler's pdftoppm under the hood
    try:
        pages = convert_from_path(PDF_PATH, first_page=START_PAGE, last_page=END_PAGE, dpi=DPI)
    except Exception as e:
        print(f"❌ Error converting PDF: {e}")
        return

    print(f"🔍  Running OCR on {len(pages)} pages...")
    
    extracted_data = {
        "book": {
            "id": f"{ID_PREFIX}book",
            "title": "Free English Grammar",
            "authors": "Mary Ansell",
            "edition": "Second Edition",
            "language": "en",
            "target_language": "es",
            "total_pages": 488,
            "total_chapters": 28,
            "source_file": "-Free-English-Grammar (1).pdf"
        },
        "parts": [
            {
                "id": f"{ID_PREFIX}part_01",
                "title": "Grammar Structure",
                "description": "Fundamental English grammar rules.",
                "order": 1,
                "chapter_range": [1, 28]
            }
        ],
        "chapters": [],
        "sections": [],
        "examples": []
    }

    # To prevent duplicates and keep track of already OCR'd chapters
    processed_chapters = set()
    current_chapter = None

    # Process in chunks of 50 pages to save memory
    for start in range(START_PAGE, END_PAGE + 1, 50):
        end = min(start + 49, END_PAGE)
        print(f"📖  Converting PDF chunk: Pages {start}-{end}...")
        try:
            pages = convert_from_path(PDF_PATH, first_page=start, last_page=end, dpi=DPI)
        except Exception as e:
            print(f"❌ Error converting PDF chunk {start}-{end}: {e}")
            continue

        for i, page_image in enumerate(pages):
            page_num = start + i
            print(f"  Processing Page {page_num}...")
            
            # 1. Update Current Chapter based on Page Map
            for ch_num, (start_pg, ch_title) in CHAPTER_MAP.items():
                if page_num >= start_pg:
                    if ch_num not in processed_chapters:
                        processed_chapters.add(ch_num)
                        current_chapter = {
                            "id": f"{ID_PREFIX}chapter_{ch_num:02d}",
                            "book_id": f"{ID_PREFIX}book",
                            "part_id": f"{ID_PREFIX}part_01",
                            "chapter_number": ch_num,
                            "title": ch_title,
                            "slug": f"ch-{ch_num:02d}-{slugify(ch_title)}",
                            "difficulty": "beginner" if ch_num < 10 else "intermediate",
                            "page_start": page_num,
                            "tags": ["grammar", "basics"]
                        }
                        extracted_data["chapters"].append(current_chapter)
                    # If we found a later chapter that matches the current page, this is our chapter
                    latest_ch_id = f"{ID_PREFIX}chapter_{ch_num:02d}"
                    if current_chapter["id"] != latest_ch_id:
                         # This shouldn't normally happen if CHAPTER_MAP is sorted, but safe fallback
                        pass

            text = pytesseract.image_to_string(page_image)
            # Clean watermarks and noise aggressively
            text = re.sub(r'SeyfiHoca|www\.seyfihoca\.com|https://pdforall\.com|Seyfi Hoca', '', text, flags=re.IGNORECASE)
            text = re.sub(r'\n\s*\d+\s*\n', '\n', text) # Remove page numbers in middle
            
            # HEURISTIC: Detect Section (e.g. "1. Affirmative statements")
            # We look for numbered bullet points at the start of a line
            sec_matches = re.finditer(r'^\s*(\d+)\.\s+(.+)$', text, re.MULTILINE)
            for m in sec_matches:
                sec_num = m.group(1)
                sec_title = m.group(2).strip()
                if current_chapter:
                    sec_id = f"{current_chapter['id']}_sec_{sec_num}"
                    # Check if section already exists
                    if not any(s['id'] == sec_id for s in extracted_data["sections"]):
                        content = text[m.end():m.end()+1500].strip()
                        if not content:
                            content = f"(Grammar content for {sec_title} extracted from PDF Page {page_num})"
                        
                        sec_obj = {
                            "id": sec_id,
                            "chapter_id": current_chapter['id'],
                            "section_number": sec_num,
                            "title": sec_title,
                            "content": content,
                        }
                        extracted_data["sections"].append(sec_obj)

            # HEURISTIC: Extract examples
            sentences = re.findall(r'[A-Z][^.!?]*[.!?]', text)
            for s in sentences:
                s_clean = s.replace('\n', ' ').strip()
                # Clean up repeated spaces or weird chars
                s_clean = re.sub(r'\s+', ' ', s_clean)
                if 25 < len(s_clean) < 250 and current_chapter:
                    if "http" not in s_clean and "www" not in s_clean and len(s_clean.split()) > 3:
                        extracted_data["examples"].append({
                            "id": f"{ID_PREFIX}ex_{len(extracted_data['examples'])+1}",
                            "chapter_id": current_chapter['id'],
                            "english": s_clean,
                            "spanish": "", 
                            "tags": ["extracted"]
                        })

            # Checkpoint
            if page_num % CHECKPOINT_EVERY == 0:
                print(f"  💾 Saving checkpoint at Page {page_num}...")
                with open(OUTPUT_JSON, 'w') as f:
                    json.dump(extracted_data, f, indent=2)

    print(f"🏁 Final Save to {OUTPUT_JSON}...")
    with open(OUTPUT_JSON, 'w') as f:
        json.dump(extracted_data, f, indent=2)

if __name__ == "__main__":
    run_ocr()
