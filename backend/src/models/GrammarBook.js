const mongoose = require('mongoose');

const grammarBookSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  authors: { type: String, required: true },
  edition: { type: String, required: true },
  language: { type: String, required: true },
  target_language: { type: String, required: true },
  total_pages: { type: Number, required: true },
  total_chapters: { type: Number, required: true },
  source_file: { type: String, required: true },
  converted_at: { type: Date, required: true },
});

module.exports = mongoose.model('GrammarBook', grammarBookSchema);
