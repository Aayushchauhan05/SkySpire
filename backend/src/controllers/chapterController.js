const Chapter = require('../models/Chapter');

// @desc    Get all chapters (optional path filter)
// @route   GET /api/chapters
// @access  Public
const getChapters = async (req, res) => {
  try {
    const filter = {};
    if (req.query.pathId) {
      filter.pathId = req.query.pathId;
    }

    const chapters = await Chapter.find(filter).populate('quizId');
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

// @desc    Create a chapter
// @route   POST /api/chapters
// @access  Public
const createChapter = async (req, res) => {
  try {
    const newChapter = new Chapter(req.body);
    const createdChapter = await newChapter.save();
    res.status(201).json(createdChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update chapter
// @route   PUT /api/chapters/:id
// @access  Public
const updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (chapter) {
      res.json(chapter);
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete chapter
// @route   DELETE /api/chapters/:id
// @access  Public
const deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findOneAndDelete({ id: req.params.id });
    if (chapter) {
      res.json({ message: 'Chapter deleted' });
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
};
