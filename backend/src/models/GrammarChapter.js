const mongoose = require('mongoose');

const grammarChapterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  book_id: { type: String, ref: 'GrammarBook', required: true },
  part_id: { type: String, ref: 'GrammarPart', required: true },
  chapter_number: { type: Number, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  tags: { type: [String], required: true },
  page_start: { type: Number },
  page_end: { type: Number },
  total_pages: { type: Number },
  word_count: { type: Number },
  section_count: { type: Number },
  example_count: { type: Number },
  summary: { type: String },
});

grammarChapterSchema.index({ book_id: 1 });
grammarChapterSchema.index({ part_id: 1 });
grammarChapterSchema.index({ chapter_number: 1 });
grammarChapterSchema.index({ difficulty: 1 });
grammarChapterSchema.index({ tags: 1 });

module.exports = mongoose.model('GrammarChapter', grammarChapterSchema);
