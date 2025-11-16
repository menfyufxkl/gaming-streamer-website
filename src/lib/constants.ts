// API 配置
export const API_CONFIG = {
  // 基础URL配置
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  
  // 请求超时时间（毫秒）
  TIMEOUT: 10000,
  
  // 默认分页大小
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // 文件上传配置
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
    ALLOWED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  }
};

// API 端点配置
export const ENDPOINTS = {
  // 用户相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
  },
  
  USER: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    FOLLOW: (id: string) => `/users/${id}/follow`,
    UNFOLLOW: (id: string) => `/users/${id}/unfollow`,
    FOLLOWERS: (id: string) => `/users/${id}/followers`,
    FOLLOWING: (id: string) => `/users/${id}/following`,
  },
  
  // 游戏相关
  GAMES: {
    LIST: '/games',
    DETAIL: (id: string) => `/games/${id}`,
    CREATE: '/games',
    UPDATE: (id: string) => `/games/${id}`,
    DELETE: (id: string) => `/games/${id}`,
    MY_GAMES: '/games/me',
  },
  
  // 文章相关
  ARTICLES: {
    LIST: '/articles',
    DETAIL: (slug: string) => `/articles/${slug}`,
    CREATE: '/articles',
    UPDATE: (id: string) => `/articles/${id}`,
    DELETE: (id: string) => `/articles/${id}`,
    LIKE: (id: string) => `/articles/${id}/like`,
    UNLIKE: (id: string) => `/articles/${id}/unlike`,
    MY_ARTICLES: '/articles/me',
    CATEGORIES: '/articles/categories',
    SEARCH: '/articles/search',
  },
  
  // 视频相关
  VIDEOS: {
    LIST: '/videos',
    DETAIL: (id: string) => `/videos/${id}`,
    CREATE: '/videos',
    UPDATE: (id: string) => `/videos/${id}`,
    DELETE: (id: string) => `/videos/${id}`,
    VIEW: (id: string) => `/videos/${id}/view`,
    LIKE: (id: string) => `/videos/${id}/like`,
    UNLIKE: (id: string) => `/videos/${id}/unlike`,
    MY_VIDEOS: '/videos/me',
    CATEGORIES: '/videos/categories',
    SEARCH: '/videos/search',
    NETDISK_DIRECT: '/videos/netdisk/direct-link',
  },
  
  // 播放列表相关
  PLAYLISTS: {
    LIST: '/playlists',
    DETAIL: (id: string) => `/playlists/${id}`,
    CREATE: '/playlists',
    UPDATE: (id: string) => `/playlists/${id}`,
    DELETE: (id: string) => `/playlists/${id}`,
    ADD_VIDEO: (id: string) => `/playlists/${id}/videos`,
    REMOVE_VIDEO: (id: string, videoId: string) => `/playlists/${id}/videos/${videoId}`,
    MY_PLAYLISTS: '/playlists/me',
  },
  
  // 评论相关
  COMMENTS: {
    LIST: '/comments',
    CREATE: '/comments',
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
    LIKE: (id: string) => `/comments/${id}/like`,
    UNLIKE: (id: string) => `/comments/${id}/unlike`,
    REPLIES: (id: string) => `/comments/${id}/replies`,
  },
  
  // 统计数据
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    PAGE_VIEWS: '/analytics/pages',
    VIDEO_VIEWS: '/analytics/videos',
    VISITORS: '/analytics/visitors',
    DEVICES: '/analytics/devices',
    REFERRERS: '/analytics/referrers',
  },
  
  // 文件上传
  UPLOAD: {
    IMAGE: '/upload/image',
    VIDEO: '/upload/video',
    AUDIO: '/upload/audio',
    FILE: '/upload/file',
  },
  
  // 系统配置
  SYSTEM: {
    CONFIG: '/system/config',
    HEALTH: '/system/health',
    STATUS: '/system/status',
  }
};

// 状态码映射
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 错误消息映射
export const ERROR_MESSAGES = {
  [HTTP_STATUS.UNAUTHORIZED]: '未授权，请重新登录',
  [HTTP_STATUS.FORBIDDEN]: '没有权限访问此资源',
  [HTTP_STATUS.NOT_FOUND]: '资源不存在',
  [HTTP_STATUS.CONFLICT]: '资源冲突',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  NETWORK_ERROR: '网络连接失败',
  TIMEOUT_ERROR: '请求超时',
  UNKNOWN_ERROR: '未知错误',
} as const;

// 成功消息映射
export const SUCCESS_MESSAGES = {
  LOGIN: '登录成功',
  LOGOUT: '退出登录成功',
  REGISTER: '注册成功',
  PROFILE_UPDATE: '个人资料更新成功',
  PASSWORD_CHANGE: '密码修改成功',
  ARTICLE_CREATE: '文章发布成功',
  ARTICLE_UPDATE: '文章更新成功',
  ARTICLE_DELETE: '文章删除成功',
  VIDEO_UPLOAD: '视频上传成功',
  VIDEO_UPDATE: '视频更新成功',
  VIDEO_DELETE: '视频删除成功',
  LIKE: '点赞成功',
  UNLIKE: '取消点赞成功',
  FOLLOW: '关注成功',
  UNFOLLOW: '取消关注成功',
  UPLOAD: '文件上传成功',
} as const;

// 验证规则
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  DISPLAY_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  BIO: {
    MAX_LENGTH: 500,
  },
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  CONTENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 10000,
  },
  EXCERPT: {
    MAX_LENGTH: 300,
  },
  TAGS: {
    MAX_COUNT: 10,
    MAX_LENGTH: 20,
  },
} as const;

// 默认头像
export const DEFAULT_AVATAR = '/images/default-avatar.png';

// 默认封面
export const DEFAULT_COVER = '/images/default-cover.png';

// 游戏分类
export const GAME_CATEGORIES = [
  'MOBA',
  'FPS',
  'RPG',
  'Action',
  'Strategy',
  'Sports',
  'Racing',
  'Fighting',
  'Puzzle',
  'Simulation',
  'Adventure',
  'Horror',
] as const;

// 视频分类
export const VIDEO_CATEGORIES = [
  '游戏攻略',
  '游戏解说',
  '精彩剪辑',
  '教学视频',
  '直播回放',
  '游戏评测',
  '新手入门',
  '高光时刻',
  '搞笑集锦',
  '其他',
] as const;

// 文章分类
export const ARTICLE_CATEGORIES = [
  '游戏心得',
  '攻略教程',
  '游戏评测',
  '行业动态',
  '技术分享',
  '生活随笔',
  '直播日记',
  '其他',
] as const;