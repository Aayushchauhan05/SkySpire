const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    targetLanguage: {
      type: String,
      required: [true, 'Please add a target language'],
    },
    proficiencyLevel: {
      type: String,
      enum: ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Proficient'],
      default: 'Beginner',
    },
    dailyGoalMinutes: {
      type: Number,
      default: 15,
    },
    motivation: {
      type: String,
    },
    streakCount: {
      type: Number,
      default: 0,
    },
    streakShieldCount: {
      type: Number,
      default: 0,
    },
    achievements: [
      {
        badgeId: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    lastLearnedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
