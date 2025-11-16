/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 启用最新的React特性
    serverComponentsExternalPackages: ['mongoose'],
  },
  
  // 图片优化配置
  images: {
    domains: [
      'localhost',
      'your-domain.com',
      'pan.aliyun.com',
      'drive-pc.quark.cn',
      '115.com',
      'via.placeholder.com'
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 环境变量配置
  env: {
    CUSTOM_KEY: 'your-value',
  },

  // 编译优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 安全配置
  poweredByHeader: false,
  reactStrictMode: true,
  
  // API路由配置
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },

  // 静态导出配置 (可选)
  // output: 'export',
  // trailingSlash: true,
  // images: {
  //   unoptimized: true
  // }
};

module.exports = nextConfig;