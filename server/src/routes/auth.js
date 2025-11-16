const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken, generateRefreshToken, authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../config/logger');

const router = express.Router();

// 注册验证规则
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('用户名长度必须在3-30个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('请提供有效的邮箱地址')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('密码长度至少8个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('密码必须包含大小写字母和数字'),
  body('displayName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('显示名称长度必须在1-50个字符之间'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('密码确认不匹配');
      }
      return true;
    })
];

// 登录验证规则
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('请提供有效的邮箱地址')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('请提供密码')
];

// @route   POST /api/v1/auth/register
// @desc    用户注册
// @access  Public
router.post('/register', registerValidation, asyncHandler(async (req, res) => {
  // 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '验证失败',
      errors: errors.array()
    });
  }

  const { username, email, password, displayName } = req.body;

  // 检查用户是否已存在
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: existingUser.email === email ? '邮箱已被注册' : '用户名已存在'
    });
  }

  // 创建用户
  const user = new User({
    username,
    email,
    password,
    displayName
  });

  await user.save();

  // 生成令牌
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken();

  // 保存刷新令牌
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天
  });
  await user.save();

  logger.info(`新用户注册: ${email}`);

  res.status(201).json({
    success: true,
    message: '注册成功',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        level: user.level,
        isVerified: user.isVerified
      },
      token,
      refreshToken
    }
  });
}));

// @route   POST /api/v1/auth/login
// @desc    用户登录
// @access  Public
router.post('/login', loginValidation, asyncHandler(async (req, res) => {
  // 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '验证失败',
      errors: errors.array()
    });
  }

  const { email, password, remember } = req.body;

  // 查找用户
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: '邮箱或密码错误'
    });
  }

  // 检查账户是否被锁定
  if (user.isLocked) {
    return res.status(423).json({
      success: false,
      message: '账户已被锁定，请稍后再试'
    });
  }

  // 检查密码
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    // 增加登录尝试次数
    await user.incLoginAttempts();
    return res.status(401).json({
      success: false,
      message: '邮箱或密码错误'
    });
  }

  // 重置登录尝试
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // 更新在线状态
  user.isOnline = true;
  user.lastSeen = new Date();
  await user.save();

  // 生成令牌
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken();

  // 保存刷新令牌
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天
  });

  // 清理过期的刷新令牌
  user.refreshTokens = user.refreshTokens.filter(
    token => token.expiresAt > new Date()
  );

  await user.save();

  logger.info(`用户登录: ${email}`);

  // 设置Cookie选项
  const cookieOptions = {
    expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  if (remember) {
    cookieOptions.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30天
  }

  res.cookie('token', token, cookieOptions);

  res.json({
    success: true,
    message: '登录成功',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        level: user.level,
        isVerified: user.isVerified,
        isOnline: user.isOnline
      },
      token,
      refreshToken
    }
  });
}));

// @route   POST /api/v1/auth/refresh
// @desc    刷新令牌
// @access  Public
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: '刷新令牌缺失'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: '无效的刷新令牌'
      });
    }

    // 检查刷新令牌是否有效
    const isValidRefreshToken = user.refreshTokens.some(
      token => token.token === refreshToken && token.expiresAt > new Date()
    );

    if (!isValidRefreshToken) {
      return res.status(401).json({
        success: false,
        message: '无效的刷新令牌'
      });
    }

    // 生成新令牌
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken();

    // 删除旧的刷新令牌
    user.refreshTokens = user.refreshTokens.filter(
      token => token.token !== refreshToken
    );

    // 添加新的刷新令牌
    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await user.save();

    res.json({
      success: true,
      message: '令牌刷新成功',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '无效的刷新令牌'
    });
  }
}));

// @route   POST /api/v1/auth/logout
// @desc    用户退出登录
// @access  Private
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  // 如果提供了刷新令牌，删除它
  if (refreshToken && req.user.refreshTokens) {
    req.user.refreshTokens = req.user.refreshTokens.filter(
      token => token.token !== refreshToken
    );
  }

  // 更新离线状态
  req.user.isOnline = false;
  await req.user.save();

  // 清除Cookie
  res.clearCookie('token');

  logger.info(`用户退出登录: ${req.user.email}`);

  res.json({
    success: true,
    message: '退出登录成功'
  });
}));

// @route   GET /api/v1/auth/profile
// @desc    获取用户资料
// @access  Private
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -refreshTokens -passwordResetToken -emailVerificationToken');

  res.json({
    success: true,
    data: { user }
  });
}));

// @route   PUT /api/v1/auth/profile
// @desc    更新用户资料
// @access  Private
router.put('/profile', authenticate, [
  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('显示名称长度必须在1-50个字符之间'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('个人简介不能超过500个字符')
], asyncHandler(async (req, res) => {
  // 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '验证失败',
      errors: errors.array()
    });
  }

  const { displayName, bio, socialLinks } = req.body;

  const updateData = {};
  if (displayName !== undefined) updateData.displayName = displayName;
  if (bio !== undefined) updateData.bio = bio;
  if (socialLinks !== undefined) updateData.socialLinks = socialLinks;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password -refreshTokens -passwordResetToken -emailVerificationToken');

  res.json({
    success: true,
    message: '资料更新成功',
    data: { user }
  });
}));

module.exports = router;