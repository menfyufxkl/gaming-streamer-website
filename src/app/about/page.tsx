'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Clock, Heart, Trophy, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

const achievements = [
  {
    id: '1',
    title: '英雄联盟钻石段位',
    description: '长期保持在钻石段位，擅长上单位置',
    icon: Trophy,
    color: 'text-yellow-500',
  },
  {
    id: '2',
    title: '绝地求生王牌段位',
    description: '单人双排多次成功吃鸡，KDA保持在3.5以上',
    icon: Star,
    color: 'text-blue-500',
  },
  {
    id: '3',
    title: '人气主播认证',
    description: '抖音平台认证游戏主播，粉丝超过10万',
    icon: Award,
    color: 'text-purple-500',
  },
  {
    id: '4',
    title: '直播时长1000+小时',
    description: '累计直播超过1000小时，分享游戏技巧',
    icon: Clock,
    color: 'text-green-500',
  },
];

const timeline = [
  {
    year: '2020',
    title: '开始游戏直播',
    description: '在抖音平台开始发布游戏内容',
  },
  {
    year: '2021',
    title: '获得认证',
    description: '成为抖音认证游戏主播',
  },
  {
    year: '2022',
    title: '粉丝突破5万',
    description: '粉丝数量突破5万，开始团队合作',
  },
  {
    year: '2023',
    title: '全平台发展',
    description: '在B站、YouTube等平台同步发展',
  },
  {
    year: '2024',
    title: '粉丝突破10万',
    description: '全平台粉丝总数超过10万',
  },
  {
    year: '2025',
    title: '网站上线',
    description: '建立个人网站，提供更多内容',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
      {/* 英雄区域 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
                关于我
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                我是一名专业的游戏主播，专注于分享游戏技巧和精彩内容。
                从2020年开始在各大平台分享游戏知识，至今已积累超过10万粉丝。
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">10万+</div>
                  <div className="text-gray-400">粉丝数量</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">1000+</div>
                  <div className="text-gray-400">直播小时</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
                  <div className="text-gray-400">视频作品</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">5年</div>
                  <div className="text-gray-400">从业经验</div>
                </div>
              </div>

              <Button variant="gaming" size="lg">
                关注我
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl"></div>
                <Avatar 
                  src="/images/avatar.jpg"
                  size="2xl"
                  fallback="游戏大神"
                  className="relative ring-4 ring-blue-500/30 shadow-glow mx-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 成就展示 */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">游戏成就</h2>
            <p className="text-gray-400">多年的游戏经验和技术积累</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center h-full">
                    <CardHeader>
                      <div className="mx-auto">
                        <Icon className={`w-12 h-12 ${achievement.color} mx-auto mb-4`} />
                      </div>
                      <CardTitle className="text-white">{achievement.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm">{achievement.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 成长历程 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">成长历程</h2>
            <p className="text-gray-400">从新手到专业主播的成长之路</p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* 时间线 */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-8 mb-12"
                >
                  {/* 时间点 */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold relative z-10">
                    {item.year}
                  </div>
                  
                  {/* 内容 */}
                  <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 理念信念 */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">直播理念</h2>
            <p className="text-gray-400">用真心和专业为每一位观众带来价值</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">用心分享</h3>
              <p className="text-gray-300">
                每一场直播都用心准备，分享真实的游戏心得和技术技巧。
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">团队精神</h3>
              <p className="text-gray-300">
                与粉丝建立温暖的互动关系，营造积极向上的游戏氛围。
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">精益求精</h3>
              <p className="text-gray-300">
                持续学习新技术，不断提升直播质量，为观众带来更好的体验。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">让我们一起游戏吧！</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              如果你也热爱游戏，欢迎关注我的各大平台账号。我们可以在游戏中交流心得，分享快乐时光！
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gaming" size="lg">
                <Heart className="w-5 h-5 mr-2" />
                关注我
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                私信交流
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}