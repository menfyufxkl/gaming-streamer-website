const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { BCRYPT_ROUNDS } = require('../config/config');

const SocialLinksSchema = new mongoose.Schema({
  douyin: { type: String, default: '' },
  bilibili: { type: String, default: '' },
  weibo: { type: String, default: '' },
  qq: { type: String, default: '' },
  wechat: { type: String, default: '' },
  website: { type: String, default: '' },
});

const StreamScheduleSchema = new mongoose.Schema({
  day: { 
    type: String, 
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  game: { type: String },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  title: { type: String },
  description: { type: String }
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  avatar: {
    type: String,
    default: '/images/default-avatar.png'
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  followers: {
    type: Number,
    default: 0,
    min: 0
  },
  following: {
    type: Number,
    default: 0,
    min: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  socialLinks: {
    type: SocialLinksSchema,
    default: {}
  },
  streamSchedule: {
    type: [StreamScheduleSchema],
    default: []
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
  }]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.passwordResetToken;
      delete ret.refreshTokens;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// 索引
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ isActive: 1 });

// 虚拟字段
UserSchema.virtual('fullName').get(function() {
  return this.displayName;
});

UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// 预保存中间件 - 密码加密
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 实例方法 - 密码比较
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// 实例方法 - 登录尝试处理
UserSchema.methods.incLoginAttempts = function() {
  // 如果有锁定时间且已过期，重置尝试次数
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { loginAttempts: 1, lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // 如果尝试次数达到阈值且未锁定，锁定账户
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 锁定2小时
  }
  
  return this.updateOne(updates);
};

// 实例方法 - 重置登录尝试
UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// 静态方法 - 查找用户
UserSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: new RegExp(`^${username}$`, 'i') });
};

UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// 创建模型
const User = mongoose.model('User', UserSchema);

module.exports = User;