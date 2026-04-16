const mongoose = require('mongoose');

const LexiconSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['fr', 'es', 'en'],
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'words', 'idioms', 'phrasal_verbs', 'slangs', 'proverbs',
      'collocations', 'expressions', 'false_friends', 'connectors', 'abbreviations'
    ],
    index: true
  },
  level: {
    type: String,
    required: true,
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    index: true
  },
  topic: {
    type: String,
    required: true,
    index: true
  },
  term: {
    type: String,
    required: true
  },
  definition: {
    type: String,
    required: true
  },
  example: {
    type: String
  },
  translation: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  audioUrl: {
    type: String
  },
  isFree: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Compound indexes for common query patterns
LexiconSchema.index({ language: 1, category: 1, level: 1, topic: 1 });

module.exports = mongoose.model('Lexicon', LexiconSchema);
