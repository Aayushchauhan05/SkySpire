const GrammarBook = require('../models/GrammarBook');
const GrammarPart = require('../models/GrammarPart');
const GrammarChapter = require('../models/GrammarChapter');
const GrammarSection = require('../models/GrammarSection');
const GrammarExample = require('../models/GrammarExample');
const UserProgress = require('../models/UserProgress');

// GET /api/grammar/books
exports.getBooks = async (req, res) => {
  try {
    const books = await GrammarBook.find().sort({ title: 1 }).lean();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/grammar/parts
exports.getParts = async (req, res) => {
  try {
    const { bookId } = req.query;
    const query = bookId ? { book_id: bookId } : {};
    const parts = await GrammarPart.find(query).sort({ order: 1 }).lean();
    res.json(parts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/grammar/parts/:partId/chapters
exports.getChaptersByPart = async (req, res) => {
  try {
    const { partId } = req.params;
    const { difficulty, tag, search } = req.query;

    const query = { part_id: partId };
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty.toLowerCase();
    if (tag && tag !== 'All') query.tags = { $in: [tag] };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const chapters = await GrammarChapter.find(query).sort({ chapter_number: 1 }).lean();
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/grammar/chapters/:chapterId
exports.getChapterById = async (req, res) => {
  try {
    const chapter = await GrammarChapter.findById(req.params.chapterId).lean();
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/grammar/chapters/:chapterId/sections
exports.getSectionsByChapter = async (req, res) => {
  try {
    const sections = await GrammarSection.find({ chapter_id: req.params.chapterId }).sort({ section_number: 1 }).lean();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/grammar/sections/:sectionId
exports.getSectionById = async (req, res) => {
  try {
    const section = await GrammarSection.findById(req.params.sectionId).lean();
    if (!section) return res.status(404).json({ error: 'Section not found' });

    // Also fetch context examples locally to frontload them easily if desired
    const examples = await GrammarExample.find({ section_id: req.params.sectionId }).lean();
    res.json({ section, examples });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/grammar/chapters/:chapterId/examples
exports.getExamplesByChapter = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const examples = await GrammarExample.find({ chapter_id: req.params.chapterId })
      .skip(Number(offset))
      .limit(Number(limit))
      .lean();
    res.json(examples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/grammar/examples/random
exports.getRandomExamples = async (req, res) => {
  try {
    const { tags, count = 10 } = req.query;
    const matchStage = {};
    
    if (tags) {
      matchStage.tags = { $in: tags.split(',') };
    }

    const examples = await GrammarExample.aggregate([
      { $match: matchStage },
      { $sample: { size: Number(count) } }
    ]);
    
    res.json(examples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/grammar/search
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ chapters: [], sections: [] });

    const regex = new RegExp(q, 'i');
    
    const chapters = await GrammarChapter.find({
      $or: [
        { title: regex },
        { summary: regex },
        { tags: { $in: [regex] } }
      ]
    }).limit(10).lean();
    
    const sections = await GrammarSection.find({
      $or: [
        { title: regex },
        { content: regex }
      ]
    }).limit(10).lean();

    res.json({ chapters, sections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/grammar/progress
exports.saveUserProgress = async (req, res) => {
  try {
    const { userId, chapterId, sectionId, status, score } = req.body;
    if (!userId || !chapterId) return res.status(400).json({ error: 'Missing userId or chapterId' });

    let progress = await UserProgress.findOne({ user_id: userId, chapter_id: chapterId, section_id: sectionId || null });
    
    if (progress) {
      progress.status = status || progress.status;
      if (score !== undefined) progress.score = score;
      progress.last_visited_at = Date.now();
      if (status === 'completed' && !progress.completed_at) {
        progress.completed_at = Date.now();
      }
      await progress.save();
    } else {
      progress = await UserProgress.create({
        user_id: userId,
        chapter_id: chapterId,
        section_id: sectionId || null,
        status: status || 'in_progress',
        score: score || 0,
        completed_at: status === 'completed' ? Date.now() : null
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/grammar/progress/:userId
exports.getUserProgressAll = async (req, res) => {
  try {
    const progressList = await UserProgress.find({ user_id: req.params.userId });
    res.json(progressList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/grammar/progress/:userId/chapters/:chapterId
exports.getUserProgressByChapter = async (req, res) => {
  try {
    const progresses = await UserProgress.find({ 
      user_id: req.params.userId, 
      chapter_id: req.params.chapterId 
    });
    res.json(progresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
