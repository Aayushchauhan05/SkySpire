const mongoose = require('mongoose');

const grammarPartSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  chapter_range: { type: [Number], required: true },
});

module.exports = mongoose.model('GrammarPart', grammarPartSchema);
