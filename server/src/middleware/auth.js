const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/User');

// 验证JWT令牌
const authenticate = async (req, res, next) => {
  try {
    let token;

    // 从请求头获取令牌
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 从Cookie获取令牌
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未授权，请提供有效令牌'
      });
    }

    try {
      // 验证令牌
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // 查找用户
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '用户不存在'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: '账户已被禁用'
        });
      }

      // 更新用户最后在线时间
      user.lastSeen = new Date();
      await user.save();

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '无效的令牌'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 角色验证中间件
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未授权访问'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '权限不足，无法访问此资源'
      });
    }

    next();
  };
};

// 可选认证中间件（不强制要求登录）
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // 忽略令牌错误，继续执行
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// 验证用户是否为资源拥有者
const verifyOwnership = (Model, paramName = 'id', userField = 'userId') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const userId = req.user._id;

      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: '资源不存在'
        });
      }

      // 检查是否是资源拥有者或管理员
      if (resource[userField]?.toString() !== userId.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '权限不足，无法访问此资源'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// 验证令牌刷新
const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: '刷新令牌缺失'
      });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已禁用'
      });
    }

    // 检查刷新令牌是否在用户的令牌列表中
    const isValidRefreshToken = user.refreshTokens.some(
      token => token.token === refreshToken && token.expiresAt > new Date()
    );

    if (!isValidRefreshToken) {
      return res.status(401).json({
        success: false,
        message: '无效的刷新令牌'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '无效的刷新令牌'
    });
  }
};

// 生成令牌
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// 生成刷新令牌
const generateRefreshToken = () => {
  return jwt.sign({}, JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  verifyOwnership,
  verifyRefreshToken,
  generateToken,
  generateRefreshToken
};