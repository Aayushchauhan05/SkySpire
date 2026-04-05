const mongoose = require('mongoose');

const grammarExampleSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  chapter_id: { type: String, ref: 'GrammarChapter', required: true },
  section_id: { type: String, ref: 'GrammarSection' },
  spanish: { type: String, required: true },
  english: { type: String, required: true },
  tags: { type: [String], required: true },
});

grammarExampleSchema.index({ chapter_id: 1 });
grammarExampleSchema.index({ tags: 1 });
grammarExampleSchema.index({ section_id: 1 });

module.exports = mongoose.model('GrammarExample', grammarExampleSchema);
