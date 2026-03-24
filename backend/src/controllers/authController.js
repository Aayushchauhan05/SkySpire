const User = require('../models/User');
const Profile = require('../models/Profile');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { email, password, name, targetLanguage, proficiencyLevel, dailyGoalMinutes, motivation } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
    });

    if (user) {
      // Create associated profile during registration/onboarding
      const profile = await Profile.create({
        user: user._id,
        name: name || 'User',
        targetLanguage: targetLanguage || 'Spanish',
        proficiencyLevel: proficiencyLevel || 'Beginner',
        dailyGoalMinutes: dailyGoalMinutes || 15,
        motivation: motivation || '',
      });

      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
        profile,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const profile = await Profile.findOne({ user: user._id });
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
        profile,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
