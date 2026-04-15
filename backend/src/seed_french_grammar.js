/**
 * seed_french_grammar.js
 *
 * Seeder for french_grammar.json into the existing grammar collections.
 *
 * French JSON structure: book → units[] → chapters[] → sections[] / examples[] / quiz{}
 * DB structure expected: GrammarBook / GrammarPart / GrammarChapter / GrammarSection / GrammarExample
 *
 * Mapping applied:
 *   book           → GrammarBook  (with defaults for missing required fields)
 *   units          → GrammarPart  (derived chapter_range from nested chapters)
 *   chapters       → GrammarChapter
 *   sections       → GrammarSection
 *   examples       → GrammarExample  (uses `french` field instead of `spanish`)
 *   quiz questions → stored inline on chapter (optional future extension)
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Models
const GrammarBook    = require('./models/GrammarBook');
const GrammarPart    = require('./models/GrammarPart');
const GrammarChapter = require('./models/GrammarChapter');
const GrammarSection = require('./models/GrammarSection');
const GrammarExample = require('./models/GrammarExample');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Derive chapter_range from an array of chapter objects.
 * Returns [minOrder, maxOrder] using the chapter.order field.
 */
function deriveChapterRange(chapters) {
  const orders = chapters.map(c => c.order).filter(Boolean);
  if (!orders.length) return [0, 0];
  return [Math.min(...orders), Math.max(...orders)];
}

/**
 * Map a French chapter level string to the GrammarChapter difficulty enum.
 * GrammarChapter allows: 'beginner' | 'intermediate' | 'advanced'
 */
function mapDifficulty(level) {
  if (!level) return 'beginner';
  const l = level.toLowerCase();
  if (l.includes('pre-a1') || l.includes('a1'))  return 'beginner';
  if (l.includes('a2') || l.includes('b1'))       return 'intermediate';
  return 'advanced'; // B2, C1, C2 etc.
}

/**
 * Upsert a single document by _id.
 * Avoids E11000 duplicate-key errors on repeated runs.
 */
async function upsert(Model, id, data) {
  return Model.findOneAndUpdate(
    { _id: id },
    { $set: { ...data, _id: id } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/language-app';
  console.log(`Connecting to MongoDB…`);
  await mongoose.connect(uri);
  console.log('Connected ✓\n');

  // Read JSON
  const jsonPath = path.join(__dirname, '../french_grammar.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌  File not found: ${jsonPath}`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const { book, units } = raw;

  // ── 1. Seed GrammarBook ──────────────────────────────────────────────────
  console.log('📖  Seeding GrammarBook…');

  // Count total chapters across all units
  const allChapters = units.flatMap(u => u.chapters || []);
  const totalChapters = allChapters.length;

  const bookData = {
    title:          book.title,
    authors:        'French Grammar Master Team',    // default — not in source JSON
    edition:        book.version || '1.0',
    language:       book.language || 'fr',
    target_language: book.targetLanguage || 'French',
    total_pages:    0,                               // French JSON has no page data
    total_chapters: totalChapters,
    source_file:    'french_grammar.json',
    converted_at:   new Date(),
  };

  await upsert(GrammarBook, book.id, bookData);
  console.log(`  ✅  Book: ${book.id} (${book.title})\n`);

  // ── 2. Seed GrammarPart (units) ──────────────────────────────────────────
  console.log('📂  Seeding GrammarParts (units)…');
  for (const unit of units) {
    const unitChapters = unit.chapters || [];
    const chapterRange = deriveChapterRange(unitChapters);

    const partData = {
      book_id:       book.id,
      title:         `${unit.level}: ${unit.levelName}`,
      description:   `${unit.levelName} — ${unit.totalTopics || unitChapters.length} topics`,
      order:         unit.unitNumber,
      chapter_range: chapterRange,
    };

    await upsert(GrammarPart, unit.id, partData);
    console.log(`  ✅  Part: ${unit.id} — ${unit.levelName}`);
  }
  console.log();

  // ── 3–5. Seed GrammarChapter, GrammarSection, GrammarExample ────────────
  console.log('📑  Seeding chapters, sections, examples…');
  let chapterCount = 0, sectionCount = 0, exampleCount = 0;

  for (const unit of units) {
    for (const chapter of (unit.chapters || [])) {
      const sections = chapter.sections || [];
      const examples = chapter.examples || [];

      // 3. GrammarChapter
      const chapterData = {
        book_id:        book.id,
        part_id:        unit.id,
        chapter_number: chapter.order,
        title:          chapter.title,
        slug:           chapter.slug,
        difficulty:     mapDifficulty(chapter.level),
        tags:           chapter.tags || [],
        section_count:  sections.length,
        example_count:  examples.length,
        summary:        chapter.summary || null,
      };

      await upsert(GrammarChapter, chapter.id, chapterData);
      chapterCount++;

      // 4. Sections
      for (const sec of sections) {
        const secData = {
          chapter_id:     chapter.id,
          section_number: String(sec.sectionNumber),
          title:          sec.title,
          content:        sec.content,
        };
        await upsert(GrammarSection, sec.id, secData);
        sectionCount++;
      }

      // 5. Examples — French text stored in `french` field
      for (const ex of examples) {
        const exData = {
          chapter_id: chapter.id,
          section_id: ex.sectionId || null,
          french:     ex.french,
          english:    ex.english,
          phonetics:  ex.phonetics || null,
          tags:       chapter.tags || [],
        };
        await upsert(GrammarExample, ex.id, exData);
        exampleCount++;
      }
    }
  }

  console.log(`  ✅  Chapters : ${chapterCount}`);
  console.log(`  ✅  Sections : ${sectionCount}`);
  console.log(`  ✅  Examples : ${exampleCount}`);
  console.log();

  console.log('🎉  French grammar data seeded successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌  Seeding error:', err.message || err);
  process.exit(1);
});
