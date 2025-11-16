'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, User, Gamepad2, Video, FileText, MessageCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

const navItems = [
  {
    name: '首页',
    href: '/',
    icon: Home,
  },
  {
    name: '关于我',
    href: '/about',
    icon: User,
  },
  {
    name: '游戏世界',
    href: '/games',
    icon: Gamepad2,
  },
  {
    name: '视频中心',
    href: '/videos',
    icon: Video,
  },
  {
    name: '博客文章',
    href: '/articles',
    icon: FileText,
  },
  {
    name: '交流互动',
    href: '/contact',
    icon: MessageCircle,
  },
];

export function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 关闭移动端菜单
  const closeMobileMenu = () => setIsOpen(false);

  // 切换菜单状态
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 桌面端导航栏 */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg'
            : 'bg-transparent',
          className
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">游戏主播</span>
            </Link>

            {/* 桌面端菜单 */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground',
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground/80 hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* 用户区域 */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                登录
              </Button>
              <Button variant="gaming" size="sm">
                关注我
              </Button>
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="p-2"
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
            
            {/* 菜单面板 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-background border-l border-border md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* 菜单头部 */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <span className="text-lg font-semibold">菜单</span>
                  <Button variant="ghost" size="sm" onClick={closeMobileMenu}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* 用户信息 */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src="/images/avatar.jpg"
                      size="lg"
                      fallback="用户"
                      online
                    />
                    <div>
                      <div className="font-medium">游戏大神</div>
                      <div className="text-sm text-muted-foreground">@GamerPro</div>
                    </div>
                  </div>
                </div>

                {/* 菜单项 */}
                <div className="flex-1 p-6">
                  <nav className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                            isActive
                              ? 'text-primary bg-primary/10'
                              : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* 菜单底部 */}
                <div className="p-6 border-t border-border">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full" onClick={closeMobileMenu}>
                      登录
                    </Button>
                    <Button variant="gaming" className="w-full" onClick={closeMobileMenu}>
                      关注我
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// 页面内导航组件（用于长页面内跳转）
export function PageNavigation() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'schedule', 'games', 'videos', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="bg-background/80 backdrop-blur-sm rounded-full p-2 border border-border shadow-lg">
        <nav className="space-y-2">
          {[
            { id: 'hero', name: '顶部', href: '#hero' },
            { id: 'schedule', name: '直播', href: '#schedule' },
            { id: 'games', name: '游戏', href: '#games' },
            { id: 'videos', name: '视频', href: '#videos' },
            { id: 'contact', name: '联系', href: '#contact' },
          ].map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                'block w-3 h-3 rounded-full transition-all duration-200',
                activeSection === item.id
                  ? 'bg-primary scale-125'
                  : 'bg-muted hover:bg-primary/50'
              )}
              title={item.name}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

// 底部导航栏（移动端）
export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs transition-all duration-200',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}