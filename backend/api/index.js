const app = require('../src/app');
const connectDB = require('../src/config/db');

// Ensure database connection for serverless
module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed in serverless handler:', error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
  
  // Hand over to Express app
  return app(req, res);
};
