# 游戏主播个人网站

一个专为游戏直播主播设计的现代化个人网站，支持内容管理、视频播放、粉丝互动等功能。

## 🎮 功能特性

- **个人展示页面** - 专业的个人形象展示和简介
- **游戏内容管理** - 展示主玩游戏、成就和经验
- **博客系统** - 发布游戏攻略、心得分享
- **视频播放中心** - 支持网盘直链播放
- **社交媒体整合** - 引导用户关注抖音等平台
- **用户互动系统** - 留言、评论、订阅功能
- **移动端优化** - 响应式设计，完美适配移动设备
- **SEO优化** - 搜索引擎优化，提升流量

## 🛠 技术栈

- **前端**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **后端**: Node.js, Express, MongoDB
- **认证**: JWT Token
- **文件上传**: Multer
- **播放器**: APlayer (支持网盘直链)
- **部署**: Docker, Nginx

## 🚀 快速部署

### 一键部署脚本
```bash
chmod +x install.sh
./install.sh
```

### 手动部署
1. 克隆项目到服务器
2. 安装依赖: `npm install`
3. 配置环境变量
4. 启动开发服务器: `npm run dev`
5. 构建生产版本: `npm run build`
6. 启动生产服务器: `npm start`

## 📁 项目结构

```
gaming-streamer-website/
├── src/                    # 源代码
│   ├── app/               # Next.js 14 App Router
│   ├── components/        # React组件
│   ├── lib/              # 工具函数
│   └── styles/           # 样式文件
├── public/               # 静态资源
├── server/              # 后端服务
├── docs/                # 文档
└── deployment/          # 部署配置
```

## 🌐 在线演示

- 网站首页: http://your-domain.com
- 管理后台: http://your-domain.com/admin
- 视频播放器: http://your-domain.com/videos

## 📝 详细文档

请参考 `docs/` 目录下的详细文档：
- [安装指南](docs/installation.md)
- [配置说明](docs/configuration.md)
- [功能介绍](docs/features.md)
- [API文档](docs/api.md)
- [部署指南](docs/deployment.md)

## 🎯 网盘视频播放配置

### AList集成
本项目集成了AList网盘聚合播放器，支持：
- 阿里云盘
- 夸克网盘
- 115网盘
- 本地存储

详细配置请参考 [视频播放配置](docs/video-player.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 📄 许可证

MIT License

---

**开发者**: wbxz-king  
**版本**: 1.0.0  
**更新时间**: 2025-11-16