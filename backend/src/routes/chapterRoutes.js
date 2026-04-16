const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const UserProgress = require('../models/UserProgress');

// GET /api/chapters/:id
router.get('/:id', async (req, res, next) => {
  try {
    // Optionally exclude quizQuestions from the full chapter payload if we want to guard it, 
    // but the spec just says "full chapter content including all 4 tabs"
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' });
    
    // Check progress if userId is provided
    let completedTabs = [];
    if (req.query.userId) {
      const progress = await UserProgress.findOne({ user_id: req.query.userId, module_chapter_id: req.params.id });
      if (progress && progress.completedTabs) {
        completedTabs = progress.completedTabs;
      }
    }

    res.json({ success: true, data: { ...chapter.toObject(), completedTabs } });
  } catch (error) {
    next(error);
  }
});

// GET /api/chapters/:id/quiz
router.get('/:id/quiz', async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' });
    res.json({ success: true, data: chapter.quizQuestions });
  } catch (error) {
    next(error);
  }
});

// POST /api/chapters/:id/complete
router.post('/:id/complete', async (req, res, next) => {
  try {
    const { userId, tab } = req.body;
    if (!userId || !tab) return res.status(400).json({ success: false, message: 'User ID and tab are required' });
    
    let progress = await UserProgress.findOne({ user_id: userId, module_chapter_id: req.params.id });
    if (!progress) {
       progress = new UserProgress({ user_id: userId, module_chapter_id: req.params.id, completedTabs: [], status: 'in_progress' });
    }
    
    if (!progress.completedTabs) progress.completedTabs = [];
    if (!progress.completedTabs.includes(tab)) progress.completedTabs.push(tab);
    
    const allTabs = ['read', 'listen', 'speak', 'write'];
    const tabsDone = allTabs.every(t => progress.completedTabs.includes(t));
    
    if (tabsDone) {
      progress.status = 'completed'; // Trigger quiz unlock
      progress.completed_at = new Date();
    }
    
    await progress.save();
    
    res.json({ success: true, data: { tabsDone, progress } });
  } catch (error) {
    next(error);
  }
});
// POST /api/chapters/:id/rate
router.post('/:id/rate', async (req, res, next) => {
  try {
    const { userId, rating, feedback } = req.body;
    if (!userId || !rating) return res.status(400).json({ success: false, message: 'User ID and rating are required' });
    
    // We expect ChapterRating to be imported
    const ChapterRating = require('../models/ChapterRating');
    
    let doc = await ChapterRating.findOne({ user_id: userId, chapter_id: req.params.id });
    if (doc) {
      doc.rating = rating;
      doc.feedback = feedback || doc.feedback;
      await doc.save();
    } else {
      doc = await ChapterRating.create({ user_id: userId, chapter_id: req.params.id, rating, feedback });
    }
    
    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
