const LearningPath = require('../models/LearningPath');

// @desc    Get all learning paths
// @route   GET /api/paths
// @access  Public
const getLearningPaths = async (req, res) => {
  try {
    const paths = await LearningPath.find({});
    res.json(paths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get learning path by ID
// @route   GET /api/paths/:id
// @access  Public
const getLearningPathById = async (req, res) => {
  try {
    const path = await LearningPath.findOne({ id: req.params.id });
    if (path) {
      res.json(path);
    } else {
      res.status(404).json({ message: 'Learning Path not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLearningPaths,
  getLearningPathById,
};
