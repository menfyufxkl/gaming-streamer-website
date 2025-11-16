import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import '@/styles/globals.css';

// 字体配置
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: {
    default: '游戏主播个人网站 - 专业游戏内容平台',
    template: '%s | 游戏主播个人网站'
  },
  description: '专业的游戏主播个人网站，提供游戏攻略、视频内容、直播信息等。关注我获取最新游戏资讯和精彩内容！',
  keywords: ['游戏', '直播', '主播', '攻略', '视频', '游戏解说', '游戏教程'],
  authors: [{ name: 'MiniMax Agent' }],
  creator: 'MiniMax Agent',
  publisher: 'MiniMax Agent',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    title: '游戏主播个人网站 - 专业游戏内容平台',
    description: '专业的游戏主播个人网站，提供游戏攻略、视频内容、直播信息等。',
    siteName: '游戏主播个人网站',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '游戏主播个人网站',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '游戏主播个人网站 - 专业游戏内容平台',
    description: '专业的游戏主播个人网站，提供游戏攻略、视频内容、直播信息等。',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="zh-CN" 
      suppressHydrationWarning
      className={cn(
        inter.variable,
        orbitron.variable,
        'font-sans'
      )}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="color-scheme" content="light dark" />
        
        {/* PWA 支持 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="游戏主播网站" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="游戏主播网站" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* 预加载关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: '游戏主播',
              url: process.env.NEXT_PUBLIC_SITE_URL,
              sameAs: [
                process.env.NEXT_PUBLIC_DOUYIN_URL,
                process.env.NEXT_PUBLIC_BILIBILI_URL,
                process.env.NEXT_PUBLIC_WEIBO_URL,
              ].filter(Boolean),
              jobTitle: '游戏主播',
              worksFor: {
                '@type': 'Organization',
                name: '游戏直播',
              },
              description: '专业的游戏主播，提供游戏攻略、视频内容、直播信息等。',
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          {/* 主内容区域 */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* 全局加载指示器 */}
          <div id="global-loading" className="hidden">
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            </div>
          </div>
          
          {/* 通知容器 */}
          <div id="notification-container" />
          
          {/* 模态框容器 */}
          <div id="modal-container" />
          
          {/* 工具提示容器 */}
          <div id="tooltip-container" />
        </div>
        
        {/* 全局脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 主题初始化
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const root = document.documentElement;
                  
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    root.classList.add('dark');
                  } else {
                    root.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('主题初始化失败:', e);
                }
              })();
              
              // 全局加载状态管理
              window.showGlobalLoading = function() {
                const loading = document.getElementById('global-loading');
                if (loading) loading.classList.remove('hidden');
              };
              
              window.hideGlobalLoading = function() {
                const loading = document.getElementById('global-loading');
                if (loading) loading.classList.add('hidden');
              };
            `,
          }}
        />
      </body>
    </html>
  );
}