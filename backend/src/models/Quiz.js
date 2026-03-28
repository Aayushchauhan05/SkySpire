const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  id: { type: String, required: true }, // e.g., 'spanish-basics-quiz'
  title: { type: String, required: true },
  questions: [{
    id: { type: Number },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
