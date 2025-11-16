// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  bio: string;
  level: number;
  followers: number;
  following: number;
  createdAt: Date;
  updatedAt: Date;
  socialLinks: SocialLinks;
  streamSchedule: StreamSchedule[];
  achievements: Achievement[];
}

export interface SocialLinks {
  douyin?: string;
  bilibili?: string;
  weibo?: string;
  qq?: string;
  wechat?: string;
  website?: string;
}

// 游戏相关类型
export interface Game {
  id: string;
  name: string;
  genre: string;
  platform: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  experience: number; // 游戏时长（小时）
  achievements: GameAchievement[];
  rank?: string;
  mainGame: boolean;
  cover: string;
  screenshots: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

// 直播相关类型
export interface StreamSchedule {
  id: string;
  day: string; // Monday, Tuesday, etc.
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  game?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  title?: string;
  description?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streaming' | 'gaming' | 'social' | 'milestone';
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// 文章/博客类型
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover?: string;
  authorId: string;
  author: User;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  likes: number;
  comments: Comment[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seo: SEOData;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  articleId: string;
  parentId?: string;
  replies?: Comment[];
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// 视频相关类型
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  fileSize: number;
  resolution: string;
  source: 'upload' | 'netdisk' | 'youtube' | 'bilibili';
  netdiskUrl?: string; // 网盘链接
  netdiskType?: 'aliyun' | 'quark' | '115' | 'local';
  category: string;
  tags: string[];
  views: number;
  likes: number;
  downloadCount: number;
  uploaderId: string;
  uploader: User;
  status: 'processing' | 'published' | 'private';
  createdAt: Date;
  updatedAt: Date;
  metadata: VideoMetadata;
}

export interface VideoMetadata {
  codec: string;
  bitrate: number;
  fps: number;
  format: string;
  thumbnailGenerated: boolean;
  subtitles?: SubtitleTrack[];
}

export interface SubtitleTrack {
  language: string;
  url: string;
  label: string;
}

// 播放列表类型
export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  videos: Video[];
  isPublic: boolean;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

// 统计数据类型
export interface Analytics {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: number;
  topPages: PageView[];
  topVideos: VideoView[];
  referrers: Referrer[];
  devices: DeviceStats[];
  timeRange: DateRange;
}

export interface PageView {
  path: string;
  views: number;
  uniqueViews: number;
  averageTime: number;
}

export interface VideoView {
  videoId: string;
  videoTitle: string;
  views: number;
  uniqueViews: number;
  averageWatchTime: number;
  completionRate: number;
}

export interface Referrer {
  source: string;
  views: number;
  percentage: number;
}

export interface DeviceStats {
  type: 'desktop' | 'mobile' | 'tablet';
  views: number;
  percentage: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// SEO 相关类型
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
}

// API 响应类型
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 表单类型
export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export interface ProfileForm {
  displayName: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLinks;
}

export interface ArticleForm {
  title: string;
  content: string;
  excerpt: string;
  cover?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  seo: SEOData;
}

export interface VideoForm {
  title: string;
  description: string;
  category: string;
  tags: string[];
  source: 'upload' | 'netdisk';
  netdiskUrl?: string;
  netdiskType?: 'aliyun' | 'quark' | '115' | 'local';
}

// 组件 Props 类型
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system';

// 语言类型
export type Language = 'zh-CN' | 'en-US' | 'ja-JP';

// APlayer 配置类型
export interface APlayerConfig {
  container: HTMLElement;
  audio: {
    title: string;
    author: string;
    url: string;
    cover?: string;
    lrc?: string;
    theme?: string;
    mutex: boolean;
    preload: 'none' | 'metadata' | 'auto';
    volume: number;
  };
  autoplay?: boolean;
  loop?: 'none' | 'one' | 'all';
  order?: 'list' | 'random';
  preload?: 'none' | 'metadata' | 'auto';
  volume?: number;
  audio?: any;
  fixed?: boolean;
  autoplay?: boolean;
  listFolded?: boolean;
  listMaxHeight?: string;
  storageName?: string;
}