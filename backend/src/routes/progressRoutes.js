const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// GET user stats
router.get('/stats/:userId', progressController.getUserStats);

// GET next lesson for user
router.get('/next-lesson/:userId', progressController.getNextLesson);

// POST update chapter progress
router.post('/chapter', progressController.updateChapterProgress);

// POST update module progress
router.post('/module', progressController.updateModuleProgress);

// GET progress by language
router.get('/language/:userId/:language', progressController.getProgressByLanguage);

// POST mark item as complete
router.post('/mark-complete', progressController.markComplete);

// GET progress with items
router.get('/items', progressController.getProgressWithItems);

module.exports = router;
