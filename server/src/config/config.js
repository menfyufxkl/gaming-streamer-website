require('dotenv').config();

module.exports = {
  // 服务器配置
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // 数据库配置
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-streamer',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'gaming-streamer',
  
  // Redis配置
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // JWT配置
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || 7,
  
  // 文件上传配置
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  
  // 允许的CORS源
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001'],
  
  // 邮件配置
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  
  // AList配置
  ALIST_HOST: process.env.ALIST_HOST || 'http://localhost:5244',
  ALIST_API_KEY: process.env.ALIST_API_KEY,
  
  // 日志配置
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || './logs/app.log',
  
  // 安全配置
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-change-this',
  
  // 第三方服务
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
  SENTRY_DSN: process.env.SENTRY_DSN,
};