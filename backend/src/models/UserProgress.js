const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  
  // Grammar progress fields
  chapter_id: { type: String, ref: 'GrammarChapter' },
  section_id: { type: String, ref: 'GrammarSection' },
  
  // Module / Course path progress fields
  path_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath' },
  module_chapter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  completedTabs: [{ type: String }], // 'read', 'listen', 'speak', 'write'

  // SRS / Lexicon progress fields
  lexiconEntryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lexicon' },
  srs: {
    repetitionCount: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
    nextReviewDate: { type: Date }
  },

  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  score: { type: Number, default: 0 },
  last_visited_at: { type: Date, default: Date.now },
  completed_at: { type: Date },
}, { timestamps: true });

userProgressSchema.index({ user_id: 1, chapter_id: 1, section_id: 1 });
userProgressSchema.index({ user_id: 1, module_chapter_id: 1 });
userProgressSchema.index({ user_id: 1, status: 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);
