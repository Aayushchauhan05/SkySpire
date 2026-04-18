const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
const Profile = require('../models/Profile');
const LearningPath = require('../models/LearningPath');
const Chapter = require('../models/Chapter');

// Get user's overall progress stats
exports.getUserStats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Get all progress records for user
    const allProgress = await UserProgress.find({ user_id: userId });
    const completedItems = allProgress.filter(p => p.status === 'completed').length;
    const inProgressItems = allProgress.filter(p => p.status === 'in_progress').length;
    const totalItems = allProgress.length;

    // Calculate streak and other stats
    const stats = {
      totalXP: completedItems * 50, // 50 XP per completed item
      streakCount: profile.streakCount || 0,
      completedLessons: completedItems,
      inProgressLessons: inProgressItems,
      totalLessons: totalItems,
      completionPercentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
      dailyGoalMinutes: profile.dailyGoalMinutes,
      targetLanguage: profile.targetLanguage,
      proficiencyLevel: profile.proficiencyLevel,
      achievements: profile.achievements || []
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// Get next lesson for user
exports.getNextLesson = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Get learning path for user's proficiency level
    const path = await LearningPath.findOne({
      language: profile.targetLanguage,
      level: profile.proficiencyLevel
    }).populate('chapters');

    if (!path) {
      return res.status(404).json({ success: false, message: 'No learning path found for user level' });
    }

    // Find first incomplete chapter
    let nextChapter = null;
    for (const chapId of path.chapters) {
      const progress = await UserProgress.findOne({
        user_id: userId,
        module_chapter_id: chapId
      });

      if (!progress || progress.status !== 'completed') {
        nextChapter = await Chapter.findById(chapId);
        break;
      }
    }

    if (!nextChapter) {
      return res.json({ success: true, data: { message: 'All lessons completed!' } });
    }

    res.json({ success: true, data: {
      chapterId: nextChapter._id,
      title: nextChapter.title,
      description: nextChapter.description,
      estimatedTime: 15
    }});
  } catch (error) {
    next(error);
  }
};

// Update chapter progress
exports.updateChapterProgress = async (req, res, next) => {
  try {
    const { userId, chapterId, tab } = req.body;

    if (!userId || !chapterId) {
      return res.status(400).json({ success: false, message: 'User ID and Chapter ID required' });
    }

    let progress = await UserProgress.findOne({
      user_id: userId,
      module_chapter_id: chapterId
    });

    if (!progress) {
      progress = new UserProgress({
        user_id: userId,
        module_chapter_id: chapterId,
        status: 'in_progress',
        completedTabs: []
      });
    }

    if (tab && !progress.completedTabs.includes(tab)) {
      progress.completedTabs.push(tab);
    }

    // Check if all tabs completed
    const allTabs = ['read', 'listen', 'speak', 'write'];
    const allCompleted = allTabs.every(t => progress.completedTabs.includes(t));

    if (allCompleted) {
      progress.status = 'completed';
      progress.completed_at = new Date();
      progress.score = 100; // Default score, can be updated from quiz

      // Update user profile stats
      const profile = await Profile.findOne({ user: userId });
      if (profile) {
        profile.lastLearnedAt = new Date();
        profile.streakCount = (profile.streakCount || 0) + 1;
        await profile.save();
      }
    }

    progress.last_visited_at = new Date();
    await progress.save();

    res.json({ success: true, data: {
      progress,
      allCompleted,
      completionPercent: (progress.completedTabs.length / 4) * 100
    }});
  } catch (error) {
    next(error);
  }
};

// Update module progress
exports.updateModuleProgress = async (req, res, next) => {
  try {
    const { userId, moduleId, status } = req.body;

    if (!userId || !moduleId || !status) {
      return res.status(400).json({ success: false, message: 'User ID, Module ID, and Status required' });
    }

    let progress = await UserProgress.findOne({
      user_id: userId,
      path_id: moduleId
    });

    if (!progress) {
      progress = new UserProgress({
        user_id: userId,
        path_id: moduleId,
        status: status
      });
    } else {
      progress.status = status;
    }

    if (status === 'completed') {
      progress.completed_at = new Date();
      progress.score = 100;
    }

    progress.last_visited_at = new Date();
    await progress.save();

    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

// Get user's progress by language
exports.getProgressByLanguage = async (req, res, next) => {
  try {
    const { userId, language } = req.params;

    const progress = await UserProgress.find({ user_id: userId })
      .populate({
        path: 'module_chapter_id',
        select: 'title language'
      });

    const languageProgress = progress.filter(p =>
      p.module_chapter_id?.language === language
    );

    const stats = {
      language,
      total: languageProgress.length,
      completed: languageProgress.filter(p => p.status === 'completed').length,
      inProgress: languageProgress.filter(p => p.status === 'in_progress').length,
      notStarted: languageProgress.filter(p => p.status === 'not_started').length,
      progress: languageProgress
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// Mark chapters/modules as complete
exports.markComplete = async (req, res, next) => {
  try {
    const { userId, itemType, itemId } = req.body;

    if (!userId || !itemType || !itemId) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const query = { user_id: userId };
    if (itemType === 'chapter') {
      query.module_chapter_id = itemId;
    } else if (itemType === 'module') {
      query.path_id = itemId;
    }

    let progress = await UserProgress.findOne(query);
    if (!progress) {
      progress = new UserProgress({
        ...query,
        status: 'completed',
        completed_at: new Date(),
        completedTabs: ['read', 'listen', 'speak', 'write']
      });
    } else {
      progress.status = 'completed';
      progress.completed_at = new Date();
      if (!progress.completedTabs || progress.completedTabs.length === 0) {
        progress.completedTabs = ['read', 'listen', 'speak', 'write'];
      }
    }

    await progress.save();

    // Update profile
    const profile = await Profile.findOne({ user: userId });
    if (profile) {
      profile.lastLearnedAt = new Date();
      profile.streakCount = (profile.streakCount || 0) + 1;
      await profile.save();
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

// Get all chapters/modules with progress
exports.getProgressWithItems = async (req, res, next) => {
  try {
    const { userId, itemType } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID required' });
    }

    let items;
    if (itemType === 'chapters') {
      items = await UserProgress.find({ user_id: userId, module_chapter_id: { $exists: true } })
        .populate('module_chapter_id');
    } else if (itemType === 'modules') {
      items = await UserProgress.find({ user_id: userId, path_id: { $exists: true } })
        .populate('path_id');
    } else {
      items = await UserProgress.find({ user_id: userId });
    }

    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};
