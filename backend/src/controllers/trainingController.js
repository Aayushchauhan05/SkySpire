const TrainingModule = require('../models/TrainingModule');

// @desc    Get all training modules
// @route   GET /api/training
// @access  Public
const getTrainingModules = async (req, res) => {
  try {
    const modules = await TrainingModule.find({});
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrainingModules,
};
