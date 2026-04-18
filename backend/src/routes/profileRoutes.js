const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// GET user profile
router.get('/:userId', profileController.getProfile);

// POST create/update profile
router.post('/:userId', profileController.createOrUpdateProfile);

// PUT update proficiency level
router.put('/:userId/proficiency', profileController.updateProficiencyLevel);

// PUT update daily goal
router.put('/:userId/daily-goal', profileController.updateDailyGoal);

// GET achievements
router.get('/:userId/achievements', profileController.getAchievements);

// POST add achievement
router.post('/:userId/achievements', profileController.addAchievement);

// PUT update streak
router.put('/:userId/streak', profileController.updateStreak);

module.exports = router;
