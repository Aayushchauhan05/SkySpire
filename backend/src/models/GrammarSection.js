const mongoose = require('mongoose');

const grammarSectionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  chapter_id: { type: String, ref: 'GrammarChapter', required: true },
  section_number: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  word_count: { type: Number },
  example_count: { type: Number },
});

grammarSectionSchema.index({ chapter_id: 1 });

module.exports = mongoose.model('GrammarSection', grammarSectionSchema);
