const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  chapter_id: { type: String, ref: 'GrammarChapter', required: true },
  section_id: { type: String, ref: 'GrammarSection' },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  score: { type: Number, default: 0 },
  last_visited_at: { type: Date, default: Date.now },
  completed_at: { type: Date },
}, { timestamps: true });

userProgressSchema.index({ user_id: 1, chapter_id: 1, section_id: 1 });
userProgressSchema.index({ user_id: 1, status: 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);
