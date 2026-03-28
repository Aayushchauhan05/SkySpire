const Chapter = require('../models/Chapter');

// @desc    Get chapter by id
// @route   GET /api/chapters/:id
// @access  Public
const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findOne({ id: req.params.id }).populate('quizId');
    if (chapter) {
      res.json(chapter);
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChapterById,
};
