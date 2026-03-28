const Quiz = require('../models/Quiz');

// @desc    Get quiz by id
// @route   GET /api/quizzes/:id
// @access  Public
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ id: req.params.id });
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuizById,
};
