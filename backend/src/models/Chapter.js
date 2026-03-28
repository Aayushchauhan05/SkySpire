const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  id: { type: String, required: true }, // e.g., 'basices-of-greetings'
  pathId: { type: String, required: true }, // e.g., 'SURVIVAL'
  title: { type: String, required: true },
  videoTitle: { type: String },
  videoDuration: { type: String },
  lectures: [{
    id: { type: Number },
    title: { type: String },
    duration: { type: String },
    completed: { type: Boolean, default: false },
  }],
  studyNote: {
    tag: { type: String, default: 'STUDY NOTE' },
    title: { type: String },
    body: { type: String },
  },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
