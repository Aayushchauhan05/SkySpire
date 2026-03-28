const express = require('express');
const { getQuizById } = require('../controllers/quizController');
const router = express.Router();

router.get('/:id', getQuizById);

module.exports = router;
