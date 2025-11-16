const mongoose = require('mongoose');
const { MONGODB_URI, NODE_ENV } = require('./config');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // Mongoose 6+ 不再需要这些选项
    });
    
    logger.info(`📊 MongoDB连接成功: ${conn.connection.host}`);
    
    // 监听连接事件
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose已连接到MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose连接错误:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose已断开连接');
    });
    
    // 优雅关闭
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB连接已关闭');
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('MongoDB连接失败:', error);
    process.exit(1);
  }
};

module.exports = connectDB;