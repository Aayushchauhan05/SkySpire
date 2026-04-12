const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

// Database connection middleware
const connectDB = require('./config/db');
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup morgan for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
} else {
  // Production logging
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'Language API is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/training', require('./routes/trainingRoutes'));
app.use('/api/paths', require('./routes/pathRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/grammar', require('./routes/grammarRoutes'));
// Error Handling Middleware (Custom error handler will be added later)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  
  // Log error using Winston
  logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (err.stack) {
    logger.error(err.stack);
  }

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
