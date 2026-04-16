const express = require('express');
const router = express.Router();
const LearningPath = require('../models/LearningPath');
const Chapter = require('../models/Chapter');
const UserProgress = require('../models/UserProgress');

// GET /api/paths?language=fr&userId=...
router.get('/', async (req, res, next) => {
  try {
    const { language, userId } = req.query;
    if (!language) return res.status(400).json({ success: false, message: 'Language is required' });

    let paths = await LearningPath.find({ language }).sort({ order: 1 }).lean();
    
    // Check lock status based on UserProgress if userId provided
    if (userId) {
      const progresses = await UserProgress.find({ user_id: userId, status: 'completed', path_id: { $exists: true } });
      const completedPathIds = progresses.map(p => p.path_id.toString());
      
      paths = paths.map(path => {
        if (path.prerequisitePathId) {
           path.isLocked = !completedPathIds.includes(path.prerequisitePathId.toString());
        }
        return path;
      });
    }

    // append chapter data
    for (let path of paths) {
      const chapters = await Chapter.find({ pathId: path._id }).sort({ order: 1 }).lean();
      
      // Map completion state to chapters
      if (userId) {
        const chapterIds = chapters.map(c => c._id.toString());
        const chapterProgresses = await UserProgress.find({ user_id: userId, module_chapter_id: { $in: chapterIds } });
        
        path.chapters = chapters.map(c => {
          const p = chapterProgresses.find(p => p.module_chapter_id.toString() === c._id.toString());
          c.isCompleted = p ? p.status === 'completed' : false;
          c.completedTabs = p ? p.completedTabs : [];
          return c;
        });
      } else {
        path.chapters = chapters;
      }
    }

    res.json({ success: true, data: paths });
  } catch (error) {
    next(error);
  }
});

// GET /api/paths/:id/chapters
router.get('/:id/chapters', async (req, res, next) => {
  try {
    const chapters = await Chapter.find({ pathId: req.params.id }).sort({ order: 1 });
    res.json({ success: true, data: chapters });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
