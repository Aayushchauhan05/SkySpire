const Profile = require('../models/Profile');
const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ user: userId }).populate('user', 'email');
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// Create/update profile (called after onboarding)
exports.createOrUpdateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, targetLanguage, proficiencyLevel, dailyGoalMinutes, motivation } = req.body;

    if (!name || !targetLanguage) {
      return res.status(400).json({ success: false, message: 'Name and target language required' });
    }

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({
        user: userId,
        name,
        targetLanguage,
        proficiencyLevel: proficiencyLevel || 'Beginner',
        dailyGoalMinutes: dailyGoalMinutes || 15,
        motivation: motivation || 'Personal',
        streakCount: 0,
        achievements: []
      });
    } else {
      profile.name = name || profile.name;
      profile.targetLanguage = targetLanguage || profile.targetLanguage;
      profile.proficiencyLevel = proficiencyLevel || profile.proficiencyLevel;
      profile.dailyGoalMinutes = dailyGoalMinutes || profile.dailyGoalMinutes;
      profile.motivation = motivation || profile.motivation;
    }

    await profile.save();

    res.json({ success: true, data: profile, message: 'Profile saved successfully' });
  } catch (error) {
    next(error);
  }
};

// Update proficiency level
exports.updateProficiencyLevel = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { proficiencyLevel } = req.body;

    if (!proficiencyLevel) {
      return res.status(400).json({ success: false, message: 'Proficiency level required' });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    profile.proficiencyLevel = proficiencyLevel;
    await profile.save();

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// Update daily goal
exports.updateDailyGoal = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { dailyGoalMinutes } = req.body;

    if (!dailyGoalMinutes) {
      return res.status(400).json({ success: false, message: 'Daily goal minutes required' });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    profile.dailyGoalMinutes = dailyGoalMinutes;
    await profile.save();

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// Get achievements
exports.getAchievements = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({ success: true, data: {
      achievements: profile.achievements || [],
      totalBadges: profile.achievements?.length || 0
    }});
  } catch (error) {
    next(error);
  }
};

// Add achievement
exports.addAchievement = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { badgeId } = req.body;

    if (!badgeId) {
      return res.status(400).json({ success: false, message: 'Badge ID required' });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Check if already earned
    if (profile.achievements.some(a => a.badgeId === badgeId)) {
      return res.json({ success: true, data: profile, message: 'Badge already earned' });
    }

    profile.achievements.push({
      badgeId,
      earnedAt: new Date()
    });

    await profile.save();

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// Update streak
exports.updateStreak = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { increment, useShield } = req.body;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    if (increment) {
      profile.streakCount = (profile.streakCount || 0) + 1;
    } else if (useShield && profile.streakShieldCount > 0) {
      profile.streakShieldCount -= 1;
    } else {
      profile.streakCount = 0;
    }

    profile.lastLearnedAt = new Date();
    await profile.save();

    res.json({ success: true, data: {
      streakCount: profile.streakCount,
      streakShieldCount: profile.streakShieldCount
    }});
  } catch (error) {
    next(error);
  }
};
