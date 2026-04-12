const express = require('express');
const router = express.Router();
const grammarController = require('../controllers/grammarController');

// Get all grammar books
router.get('/books', grammarController.getBooks);

// Get both parts with chapter counts
router.get('/parts', grammarController.getParts);

// Get all chapters in a part
router.get('/parts/:partId/chapters', grammarController.getChaptersByPart);

// Get full chapter overview array/single
router.get('/chapters/:chapterId', grammarController.getChapterById);

// Get sections for a chapter
router.get('/chapters/:chapterId/sections', grammarController.getSectionsByChapter);

// Get a single section
router.get('/sections/:sectionId', grammarController.getSectionById);

// Get examples for a chapter
router.get('/chapters/:chapterId/examples', grammarController.getExamplesByChapter);

// Get random examples for daily practice
router.get('/examples/random', grammarController.getRandomExamples);

// Search across chapters, sections, tags
router.get('/search', grammarController.search);

// Get full progress map for a user (NOTE: expecting ?userId in query)
router.get('/progress/:userId', grammarController.getUserProgressAll);

// Get progress for specific chapter (NOTE: expecting params)
router.get('/progress/:userId/chapters/:chapterId', grammarController.getUserProgressByChapter);

// Save user's progress for a chapter/section
router.post('/progress', grammarController.saveUserProgress);

module.exports = router;
