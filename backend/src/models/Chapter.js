const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  pathId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath', required: true, index: true },
  order: { type: Number, required: true },
  title: { type: String, required: true },
  topic: { type: String },
  tabs: {
    read: {
      passage: String,
      vocabulary: [{
        word: String,
        definition: String,
        lexiconEntryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lexicon' }
      }],
      comprehensionQuestions: [{
        question: String,
        options: [String],
        correctAnswer: String,
        explanation: String
      }]
    },
    listen: {
      audioUrl: String,
      transcript: String,
      mode: String // e.g. 'dialogue', 'monologue'
    },
    speak: {
      dialogue: [{
        speaker: String,
        target: String, // original text
        translation: String,
        phonetics: String
      }],
      keyPhrases: [{ phrase: String, phonetics: String, translation: String }],
      commonMistakes: [{ mistake: String, correction: String, explanation: String }],
      culturalNote: String,
      rolePlayPrompt: String,
      rolePlayModelAnswer: String
    },
    write: {
      task: String,
      exampleResponse: String,
      options: [{ prompt: String, correctAnswer: String, distractors: [String] }]
    }
  },
  quizQuestions: [{
    question: String,
    type: { type: String, enum: ['multiple_choice', 'true_false', 'translation'] },
    options: [String],
    correctAnswer: String,
    explanation: String
  }]
}, { timestamps: true });

chapterSchema.index({ pathId: 1, order: 1 });

module.exports = mongoose.model('Chapter', chapterSchema);
