const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const Lexicon = require('../models/Lexicon');

// GET /api/revision/due?userId=...
router.get('/due', async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });

    const now = new Date();
    
    // Find due progress records for lexicon
    const dueProgress = await UserProgress.find({
      user_id: userId,
      lexiconEntryId: { $ne: null },
      'srs.nextReviewDate': { $lte: now }
    }).lean();

    // If none are due, we might just return empty
    // But what if the user just started and has never reviewed?
    // In our app logic, saving a word to vault OR passing a lesson can create an initial UserProgress with nextReviewDate = Date.now().
    
    const entryIds = dueProgress.map(p => p.lexiconEntryId);
    
    // Fetch associated lexicon terms
    const entries = await Lexicon.find({ _id: { $in: entryIds } }).lean();
    
    // Merge
    const dueItems = entries.map(entry => {
      const p = dueProgress.find(p => p.lexiconEntryId.toString() === entry._id.toString());
      return { ...entry, srsProgress: p };
    });

    res.json({ success: true, data: dueItems });
  } catch (error) {
    next(error);
  }
});

// POST /api/revision/grade
router.post('/grade', async (req, res, next) => {
  try {
    const { userId, lexiconEntryId, grade } = req.body;
    // Grade mapping:
    // 1 = Again (failed)
    // 3 = Hard
    // 4 = Good
    // 5 = Easy
    
    if (!userId || !lexiconEntryId || grade === undefined) {
       return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    let progress = await UserProgress.findOne({ user_id: userId, lexiconEntryId });
    if (!progress) {
       progress = new UserProgress({ user_id: userId, lexiconEntryId });
    }
    
    if (!progress.srs) {
      progress.srs = { repetitionCount: 0, easeFactor: 2.5, interval: 0, nextReviewDate: new Date() };
    }

    let { repetitionCount, easeFactor, interval } = progress.srs;
    
    // SuperMemo-2 Algorithm
    if (grade >= 3) {
      if (repetitionCount === 0) {
        interval = 1;
      } else if (repetitionCount === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitionCount += 1;
    } else {
      repetitionCount = 0;
      interval = 1; // 1 day if failed
    }

    easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    progress.srs = {
      repetitionCount,
      easeFactor,
      interval,
      nextReviewDate: new Date(Date.now() + interval * 24 * 60 * 60 * 1000)
    };
    
    progress.status = 'in_progress';

    await progress.save();

    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
