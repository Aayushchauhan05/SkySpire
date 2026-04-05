const app = require('./app');
const logger = require('./utils/logger');
const connectDB = async () => {
  const dbConfig = require('./config/db');
  await dbConfig();
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
