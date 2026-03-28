const express = require('express');
const { getTrainingModules } = require('../controllers/trainingController');
const router = express.Router();

router.get('/', getTrainingModules);

module.exports = router;
