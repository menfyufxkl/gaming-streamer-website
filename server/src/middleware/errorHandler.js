const logger = require('../config/logger');

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 记录错误日志
  logger.error(err.stack);

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Mongoose 重复键错误
  if (err.code === 11000) {
    const message = '字段值已存在';
    error = { message, statusCode: 400 };
  }

  // Mongoose 转换错误
  if (err.name === 'CastError') {
    const message = '资源未找到';
    error = { message, statusCode: 404 };
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    const message = '无效的令牌';
    error = { message, statusCode: 401 };
  }

  // JWT 过期错误
  if (err.name === 'TokenExpiredError') {
    const message = '令牌已过期';
    error = { message, statusCode: 401 };
  }

  // 文件上传错误
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = '文件大小超出限制';
    error = { message, statusCode: 400 };
  }

  // 速率限制错误
  if (err.type === 'entity.too.large') {
    const message: '请求体过大';
    error = { message, statusCode: 413 };
  }

  // 默认服务器错误
  const statusCode = error.statusCode || 500;
  const message = error.message || '服务器内部错误';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

// 异步错误包装器
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404错误处理器
const notFound = (req, res, next) => {
  const error = new Error(`未找到路径 - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFound
};