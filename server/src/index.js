const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// 数据库连接
const connectDB = require('./config/database');

// 日志配置
const logger = require('./config/logger');

// 路由导入
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/games');
const articleRoutes = require('./routes/articles');
const videoRoutes = require('./routes/videos');
const playlistRoutes = require('./routes/playlists');
const commentRoutes = require('./routes/comments');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/upload');
const systemRoutes = require('./routes/system');

// 中间件
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

// 配置
const { PORT, NODE_ENV, ALLOWED_ORIGINS } = require('./config/config');

const app = express();

// 数据库连接
connectDB();

// 信任代理
app.set('trust proxy', 1);

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https:", "wss:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS配置
app.use(cors({
  origin: (origin, callback) => {
    // 允许没有origin的请求（如移动应用）
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的CORS策略'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// 压缩中间件
app.use(compression());

// 基础中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 日志中间件
if (NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// API版本控制
const apiVersion = '/api/v1';

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: NODE_ENV === 'production' ? 100 : 1000, // 限制每个IP的请求数
  message: {
    error: '请求过于频繁，请稍后再试',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 应用速率限制
app.use('/api/', limiter);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API路由
app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/users`, userRoutes);
app.use(`${apiVersion}/games`, gameRoutes);
app.use(`${apiVersion}/articles`, articleRoutes);
app.use(`${apiVersion}/videos`, videoRoutes);
app.use(`${apiVersion}/playlists`, playlistRoutes);
app.use(`${apiVersion}/comments`, commentRoutes);
app.use(`${apiVersion}/analytics`, analyticsRoutes);
app.use(`${apiVersion}/upload`, uploadRoutes);
app.use(`${apiVersion}/system`, systemRoutes);

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    error: 'NOT_FOUND',
    path: req.originalUrl
  });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const server = app.listen(PORT, () => {
  logger.info(`🚀 服务器运行在 ${NODE_ENV} 环境，端口: ${PORT}`);
  logger.info(`📊 API文档: http://localhost:${PORT}${apiVersion}`);
  logger.info(`❤️  健康检查: http://localhost:${PORT}/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('收到SIGTERM信号，开始优雅关闭...');
  server.close(() => {
    logger.info('HTTP服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('收到SIGINT信号，开始优雅关闭...');
  server.close(() => {
    logger.info('HTTP服务器已关闭');
    process.exit(0);
  });
});

// 捕获未处理的异常
process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的Promise拒绝:', reason);
  logger.error('Promise:', promise);
});

process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常:', error);
  process.exit(1);
});

module.exports = app;