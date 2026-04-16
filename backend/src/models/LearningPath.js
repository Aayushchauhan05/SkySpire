const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  language: { type: String, required: true, enum: ['fr', 'es', 'en'], index: true },
  level: { type: String, required: true, enum: ['survival', 'confidence', 'fluency', 'mastery'] },
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  isLocked: { type: Boolean, default: false },
  prerequisitePathId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath', default: null }
}, { timestamps: true });

learningPathSchema.index({ language: 1, order: 1 });

module.exports = mongoose.model('LearningPath', learningPathSchema);
