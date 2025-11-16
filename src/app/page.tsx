'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, User, MessageCircle, Heart, Share, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

// 模拟数据
const mockData = {
  profile: {
    id: '1',
    username: 'GamerPro',
    displayName: '游戏大神',
    avatar: '/images/avatar.jpg',
    bio: '专业游戏主播，擅长MOBA和FPS游戏。每日20:00-22:00直播，分享游戏技巧和精彩操作！',
    followers: 128500,
    following: 234,
    level: 45,
    badges: ['认证主播', '游戏导师', '人气主播'],
    online: true,
  },
  streamSchedule: [
    {
      id: '1',
      day: '周一',
      time: '20:00 - 22:00',
      game: '英雄联盟',
      status: 'live' as const,
    },
    {
      id: '2',
      day: '周二',
      time: '20:00 - 22:00',
      game: '绝地求生',
      status: 'scheduled' as const,
    },
    {
      id: '3',
      day: '周三',
      time: '20:00 - 22:00',
      game: '原神',
      status: 'scheduled' as const,
    },
  ],
  games: [
    {
      id: '1',
      name: '英雄联盟',
      cover: '/images/games/lol.jpg',
      rank: '钻石段位',
      experience: '3000+小时',
      mainGame: true,
    },
    {
      id: '2',
      name: '绝地求生',
      cover: '/images/games/pubg.jpg',
      rank: '王牌段位',
      experience: '2000+小时',
      mainGame: false,
    },
    {
      id: '3',
      name: '原神',
      cover: '/images/games/genshin.jpg',
      rank: '冒险等级60',
      experience: '1500+小时',
      mainGame: false,
    },
  ],
  latestVideos: [
    {
      id: '1',
      title: '英雄联盟新英雄操作技巧教学',
      thumbnail: '/images/videos/1.jpg',
      duration: '15:30',
      views: '12.5万',
      publishedAt: '2025-11-15',
    },
    {
      id: '2',
      title: '绝地求生单人四排成功吃鸡',
      thumbnail: '/images/videos/2.jpg',
      duration: '25:15',
      views: '8.7万',
      publishedAt: '2025-11-14',
    },
    {
      id: '3',
      title: '原神新版本深度解析',
      thumbnail: '/images/videos/3.jpg',
      duration: '20:45',
      views: '15.2万',
      publishedAt: '2025-11-13',
    },
  ],
  stats: {
    totalViews: '1.2亿',
    followers: '12.8万',
    videos: '356',
    streamHours: '2800+',
  }
};

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockData.latestVideos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleFollow = () => {
    // 模拟关注操作
    console.log('关注主播');
  };

  const handlePlayVideo = (videoId: string) => {
    setIsPlaying(!isPlaying);
    // 模拟播放视频
    console.log('播放视频:', videoId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 英雄区域 */}
      <section className="relative overflow-hidden">
        {/* 背景动效 */}
        <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* 个人信息 */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="mb-6">
                <Avatar 
                  src={mockData.profile.avatar} 
                  size="2xl" 
                  fallback={mockData.profile.displayName}
                  online={mockData.profile.online}
                  className="mx-auto lg:mx-0 ring-4 ring-blue-500/30 shadow-glow"
                />
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                {mockData.profile.displayName}
              </h1>
              
              <p className="text-xl text-gray-300 mb-6 max-w-2xl">
                {mockData.profile.bio}
              </p>
              
              {/* 数据统计 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {Object.entries(mockData.stats).map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + Object.keys(mockData.stats).indexOf(key) * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-blue-400">{value}</div>
                    <div className="text-sm text-gray-400">
                      {key === 'totalViews' && '总观看量'}
                      {key === 'followers' && '粉丝数'}
                      {key === 'videos' && '视频数'}
                      {key === 'streamHours' && '直播时长'}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* 行动按钮 */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button 
                  variant="gaming" 
                  size="lg"
                  onClick={handleFollow}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  关注主播
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  私信交流
                </Button>
              </div>
            </motion.div>
            
            {/* 直播状态 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 max-w-md"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-white">正在直播</span>
                    </div>
                    <Button size="sm" variant="gaming">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      观看直播
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    英雄联盟 - 上分冲分局
                  </h3>
                  <p className="text-gray-300 text-sm">
                    正在使用峡谷之巅账号冲击宗师段位，感兴趣的朋友可以来学习技巧！
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 直播时间表 */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">直播时间表</h2>
            <p className="text-gray-400">每周固定时间直播，不见不散！</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockData.streamSchedule.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={cn(
                  "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all",
                  schedule.status === 'live' && "ring-2 ring-red-500/50"
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-white">{schedule.day}</div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        schedule.status === 'live' && "bg-red-500 text-white",
                        schedule.status === 'scheduled' && "bg-blue-500 text-white"
                      )}>
                        {schedule.status === 'live' ? '正在直播' : '计划直播'}
                      </div>
                    </div>
                    <div className="text-blue-400 font-medium mb-2">{schedule.time}</div>
                    <div className="text-gray-300">{schedule.game}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 主玩游戏 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">主玩游戏</h2>
            <p className="text-gray-400">擅长各类游戏，专业技巧分享</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockData.games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden group">
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={game.cover} 
                      alt={game.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {game.mainGame && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        主玩游戏
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{game.rank}</span>
                      <span>{game.experience}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 最新视频 */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">最新视频</h2>
            <p className="text-gray-400">精彩内容，持续更新</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockData.latestVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden group hover:bg-white/15 transition-all">
                  <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={() => handlePlayVideo(video.id)}>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{video.views} 观看</span>
                      <span>{video.publishedAt}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              查看更多视频
              <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 社交媒体 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">关注我</h2>
            <p className="text-gray-400">在各大平台关注我，获取最新动态</p>
          </motion.div>
          
          <div className="flex justify-center space-x-6">
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-.04-.1z"/>
              </svg>
              抖音
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.574 3.76v5.36c-.05 1.51-.57 2.762-1.574 3.757s-2.262 1.52-3.773 1.574H8.693c-1.51-.054-2.769-.578-3.773-1.574S3.396 16.896 3.346 15.386v-5.36c.05-1.511.57-2.765 1.574-3.76C6.42 4.688 7.68 4.163 9.187 4.108h.832v1.778h-.854c-1.28.044-2.354.495-3.226 1.351-.871.857-1.322 1.952-1.357 3.288v5.426c.035 1.336.486 2.431 1.357 3.288.872.856 1.946 1.307 3.226 1.351h.854v1.778H8.693C7.185 21.926 6.695 20.772 6.651 19.26v-5.426c-.044-1.336.407-2.431 1.357-3.288.872-.856 1.946-1.307 3.226-1.351h.854V4.108z"/>
              </svg>
              B站
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a2.997 2.997 0 0 0-2.111-2.12C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.387.521A2.997 2.997 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.997 2.997 0 0 0 2.111 2.12C4.495 20.455 12 20.455 12 20.455s7.505 0 9.387-.521a2.997 2.997 0 0 0 2.111-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <Share className="w-6 h-6 mr-2" />
              更多平台
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}