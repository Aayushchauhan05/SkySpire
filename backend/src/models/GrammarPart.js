const mongoose = require('mongoose');

const grammarPartSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  book_id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  chapter_range: { type: [Number], required: true },
});

grammarPartSchema.index({ book_id: 1 });
grammarPartSchema.index({ order: 1 });

module.exports = mongoose.model('GrammarPart', grammarPartSchema);
