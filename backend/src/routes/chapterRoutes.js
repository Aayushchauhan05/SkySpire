const express = require('express');
const { getChapterById } = require('../controllers/chapterController');
const router = express.Router();

router.get('/:id', getChapterById);

module.exports = router;
