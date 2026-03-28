const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., 'SURVIVAL', 'CONFIDENCE'
  title: { type: String, required: true },
  color: { type: String, required: true },
  lessons: [{ type: String }], // Array of lesson names/ids
});

module.exports = mongoose.model('LearningPath', learningPathSchema);
