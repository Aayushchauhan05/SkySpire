const mongoose = require('mongoose');

const chapterRatingSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  chapter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, default: '' },
}, { timestamps: true });

chapterRatingSchema.index({ user_id: 1, chapter_id: 1 }, { unique: true });

module.exports = mongoose.model('ChapterRating', chapterRatingSchema);
