# 游戏主播个人网站部署指南

本文档将详细介绍如何部署游戏主播个人网站，包含完整的环境配置、服务部署和优化建议。

## 📋 系统要求

### 最低配置
- **CPU**: 2核心
- **内存**: 4GB RAM
- **存储**: 40GB 可用空间
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### 推荐配置
- **CPU**: 4核心
- **内存**: 8GB RAM  
- **存储**: 100GB SSD
- **带宽**: 10Mbps
- **操作系统**: Ubuntu 22.04 LTS

## 🚀 快速部署

### 一键安装（推荐）

```bash
# 克隆项目
git clone https://github.com/your-username/gaming-streamer-website.git
cd gaming-streamer-website

# 添加执行权限
chmod +x install.sh

# 执行安装脚本
./install.sh install
```

### 手动部署

```bash
# 1. 安装Docker和Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 2. 配置环境变量
cp .env.example .env
nano .env  # 编辑配置文件

# 3. 启动服务
docker-compose up -d --build
```

## 📁 项目结构

```
gaming-streamer-website/
├── src/                    # 前端源代码
│   ├── app/               # Next.js 14 App Router
│   ├── components/        # React组件
│   ├── lib/              # 工具函数和配置
│   └── styles/           # 样式文件
├── server/               # 后端API服务
│   ├── src/
│   │   ├── routes/       # API路由
│   │   ├── models/       # 数据模型
│   │   ├── middleware/   # 中间件
│   │   └── config/       # 配置文件
│   └── package.json
├── public/               # 静态资源
├── docs/                # 文档
├── nginx/               # Nginx配置
├── monitoring/          # 监控配置
└── docker-compose.yml   # Docker编排文件
```

## ⚙️ 环境配置

### 必需配置

编辑 `.env` 文件：

```bash
# 网站基础配置
SITE_URL=https://your-domain.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# 数据库配置
MONGO_ROOT_USERNAME=gamer
MONGO_ROOT_PASSWORD=your-secure-mongodb-password
MONGO_DATABASE=gaming-streamer

# Redis配置
REDIS_PASSWORD=your-redis-password

# AList配置
ALIST_HOST=http://localhost:5244
ALIST_API_KEY=your-alist-api-key
```

### 可选配置

```bash
# 邮件服务配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SSL证书配置 (Let's Encrypt)
SSL_DOMAIN=your-domain.com
SSL_EMAIL=your-email@domain.com

# 监控配置
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your-grafana-password
```

## 🔧 服务组件

### 核心服务

| 服务 | 端口 | 描述 |
|------|------|------|
| 前端 (Next.js) | 3000 | React应用入口 |
| 后端 (Express) | 5000 | API服务 |
| MongoDB | 27017 | 主数据库 |
| Redis | 6379 | 缓存和会话 |
| AList | 5244 | 网盘聚合播放器 |
| Nginx | 80/443 | 反向代理和SSL |

### 监控服务 (可选)

| 服务 | 端口 | 描述 |
|------|------|------|
| Prometheus | 9090 | 指标收集 |
| Grafana | 3001 | 监控仪表板 |

## 🌐 域名和SSL配置

### 使用Let's Encrypt (推荐)

```bash
# 1. 修改nginx配置中的域名
sed -i 's/your-domain.com/your-actual-domain.com/g' nginx/nginx.conf

# 2. 启动服务
docker-compose up -d

# 3. 申请SSL证书
certbot --nginx -d your-domain.com -d www.your-domain.com

# 4. 自动续期
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### 自签名证书

```bash
# 生成自签名证书 (仅用于测试)
./install.sh install-ssl
```

## 📦 AList网盘配置

### 1. 访问AList管理界面

打开浏览器访问：`http://your-domain.com/alist`

### 2. 初始化设置

- 设置管理员密码
- 配置初始管理员账号

### 3. 添加存储源

#### 阿里云盘配置

```yaml
存储类型: 阿里云盘
驱动: Aliyundrive
刷新令牌: 获取方式见下方链接
客户端ID: 客户端密钥:
```

获取阿里云盘刷新令牌：
1. 访问 https://alist.nn.ci/zh/guide/drivers/aliyundrive.html
2. 按照文档获取refresh_token
3. 填写到AList配置中

#### 夸克网盘配置

```yaml
存储类型: 夸克网盘
驱动: Quark
Cookie: 登录后获取
```

### 4. 测试连接

在AList管理界面测试各存储源连接，确保正常工作。

## 🔐 安全管理

### 默认账号

部署完成后可使用以下默认管理员账号：

- **邮箱**: admin@example.com
- **密码**: admin123

### 安全措施

1. **立即修改默认密码**
2. **更新JWT密钥**
3. **配置防火墙规则**
4. **启用SSL证书**
5. **定期更新依赖**

### 防火墙配置

```bash
# Ubuntu/Debian
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 📊 监控和维护

### 查看服务状态

```bash
# 查看所有服务状态
docker-compose ps

# 查看特定服务日志
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mongo

# 实时查看日志
docker-compose logs -f [service_name]
```

### 性能监控

访问监控面板：
- **Grafana**: http://your-domain.com:3001
- **Prometheus**: http://your-domain.com:9090

### 备份策略

```bash
# 创建备份脚本
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
docker exec gaming-streamer-mongo mongodump --out /backup
docker cp gaming-streamer-mongo:/backup $BACKUP_DIR/mongodb_$DATE

# 备份上传文件
docker cp gaming-streamer-frontend:/app/public/uploads $BACKUP_DIR/uploads_$DATE

# 压缩备份
tar -czf $BACKUP_DIR/website_backup_$DATE.tar.gz \
    $BACKUP_DIR/mongodb_$DATE \
    $BACKUP_DIR/uploads_$DATE

# 清理临时文件
rm -rf $BACKUP_DIR/mongodb_$DATE $BACKUP_DIR/uploads_$DATE

echo "备份完成: $BACKUP_DIR/website_backup_$DATE.tar.gz"
EOF

chmod +x backup.sh

# 设置定时备份 (每天凌晨2点)
echo "0 2 * * * /path/to/backup.sh" | crontab -
```

## 🐛 故障排除

### 常见问题

#### 1. 端口被占用

```bash
# 查看端口占用
sudo netstat -tulpn | grep :80

# 杀死占用进程
sudo kill -9 $(lsof -ti:80)
```

#### 2. 权限问题

```bash
# 修复文件权限
sudo chown -R $USER:$USER .
sudo chmod +x install.sh

# Docker权限问题
sudo usermod -aG docker $USER
# 重新登录或执行
newgrp docker
```

#### 3. 数据库连接失败

```bash
# 检查MongoDB状态
docker-compose logs mongo

# 重置数据库
docker-compose down
docker volume rm $(docker volume ls -q | grep mongo)
docker-compose up -d
```

#### 4. SSL证书问题

```bash
# 检查证书状态
sudo certbot certificates

# 手动续期
sudo certbot renew

# 测试Nginx配置
docker exec gaming-streamer-nginx nginx -t
```

### 日志分析

```bash
# 查看错误日志
docker-compose logs --tail=100 | grep ERROR

# 分析访问日志
docker exec gaming-streamer-nginx tail -f /var/log/nginx/access.log

# 监控实时日志
docker-compose logs -f --tail=50
```

## 🔄 更新和维护

### 代码更新

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建和启动
docker-compose up -d --build

# 3. 清理旧镜像
docker system prune -f
```

### 数据库迁移

```bash
# 运行数据库迁移脚本
docker-compose exec backend npm run migrate

# 或手动连接数据库
docker exec -it gaming-streamer-mongo mongo
use gaming-streamer
db.users.updateMany({}, {$set: {updatedAt: new Date()}})
```

### 定期维护

每周执行：

```bash
#!/bin/bash
# 维护脚本 weekly_maintenance.sh

# 更新系统包
sudo apt update && sudo apt upgrade -y

# 清理Docker资源
docker system prune -f

# 更新SSL证书
sudo certbot renew --quiet

# 监控服务状态
docker-compose ps

# 检查磁盘空间
df -h

echo "周维护完成"
```

## 📞 技术支持

### 获取帮助

1. **检查文档**: 查看 `docs/` 目录下的详细文档
2. **查看日志**: 使用 `docker-compose logs` 查看错误信息
3. **社区支持**: GitHub Issues
4. **技术交流**: 加入技术群组

### 联系信息

- **项目地址**: https://github.com/your-username/gaming-streamer-website
- **文档地址**: https://your-domain.com/docs
- **技术支持**: support@your-domain.com

---

**重要提示**: 
1. 生产环境请务必修改所有默认密码和密钥
2. 定期备份数据和更新系统
3. 监控服务器资源使用情况
4. 保持SSL证书有效

祝您使用愉快！🎮✨