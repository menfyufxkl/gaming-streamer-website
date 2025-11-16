#!/bin/bash

# 游戏主播网站一键部署脚本
# 版本: 1.0.0
# 作者: wbxz-king
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "${PURPLE}[HEADER]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 未安装，请先安装 $1"
        exit 1
    fi
}

# 检查端口是否被占用
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        log_warn "端口 $1 已被占用"
        read -p "是否继续部署? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# 创建必要目录
create_directories() {
    log_info "创建必要目录..."
    mkdir -p public/uploads/{images,videos,audio,files}
    mkdir -p server/logs
    mkdir -p nginx/ssl
    mkdir -p monitoring/{grafana/{dashboards,provisioning},prometheus}
}

# 生成随机密码
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

# 配置环境变量
configure_env() {
    log_info "配置环境变量..."
    
    if [ ! -f ".env" ]; then
        log_info "创建 .env 文件..."
        cp .env.example .env
        
        # 生成随机密码
        MONGO_PASSWORD=$(generate_password)
        REDIS_PASSWORD=$(generate_password)
        JWT_SECRET=$(generate_password)
        
        # 更新.env文件
        sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/g" .env
        sed -i "s/mongodb:\/\/localhost:27017\/gaming-streamer/mongodb:\/\/gamer:$MONGO_PASSWORD@mongo:27017\/gaming-streamer/g" .env
        sed -i "s/redis:\/\/localhost:6379/redis:\/\/:$REDIS_PASSWORD@redis:6379/g" .env
        
        log_info "环境变量已配置"
        log_warn "请检查 .env 文件中的其他配置"
    else
        log_warn ".env 文件已存在，跳过配置"
    fi
}

# 初始化数据库
init_database() {
    log_info "初始化数据库..."
    
    # 创建MongoDB初始化脚本
    cat > mongo-init/init-mongo.js << 'EOF'
db = db.getSiblingDB('gaming-streamer');

// 创建管理员用户
db.createUser({
  user: 'gamer',
  pwd: process.env.MONGO_ROOT_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: 'gaming-streamer'
    }
  ]
});

// 创建索引
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });

// 插入示例数据
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7mQ8xQZ9mK", // password: admin123
  displayName: "管理员",
  role: "admin",
  isVerified: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('数据库初始化完成');
EOF

    log_info "数据库初始化脚本已创建"
}

# 启动服务
start_services() {
    log_info "启动服务..."
    
    # 停止现有服务
    docker-compose down
    
    # 构建并启动服务
    docker-compose up -d --build
    
    log_info "等待服务启动..."
    sleep 30
    
    # 检查服务状态
    check_services_status
}

# 检查服务状态
check_services_status() {
    log_info "检查服务状态..."
    
    services=("frontend" "backend" "mongo" "redis" "alist" "nginx")
    
    for service in "${services[@]}"; do
        if docker-compose ps $service | grep -q "Up"; then
            log_info "$service: 运行正常"
        else
            log_error "$service: 启动失败"
            docker-compose logs $service
        fi
    done
    
    # 检查端口
    log_info "检查端口状态..."
    netstat -tulpn 2>/dev/null | grep -E ':(3000|5000|27017|6379|5244|80|443)' || log_warn "端口检查失败"
}

# 创建SSL证书
setup_ssl() {
    if [ "$1" = "letsencrypt" ]; then
        log_info "设置Let's Encrypt SSL证书..."
        
        # 安装certbot
        check_command certbot
        
        # 获取证书
        read -p "请输入您的域名: " domain_name
        
        certbot certonly --standalone -d $domain_name
        
        # 复制证书到nginx目录
        sudo cp /etc/letsencrypt/live/$domain_name/fullchain.pem nginx/ssl/
        sudo cp /etc/letsencrypt/live/$domain_name/privkey.pem nginx/ssl/
        
        log_info "SSL证书已配置"
    elif [ "$1" = "self-signed" ]; then
        log_info "生成自签名证书..."
        
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/privkey.pem \
            -out nginx/ssl/fullchain.pem \
            -subj "/C=CN/ST=State/L=City/O=Organization/CN=localhost"
            
        log_info "自签名证书已生成"
    else
        log_info "跳过SSL证书配置"
    fi
}

# 配置Nginx
configure_nginx() {
    log_info "配置Nginx..."
    
    # 创建nginx配置
    cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/xml+rss 
               application/json application/xml;
    
    # 上游服务器
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server backend:5000;
    }
    
    upstream alist {
        server alist:5244;
    }
    
    # HTTP服务器 (重定向到HTTPS)
    server {
        listen 80;
        server_name your-domain.com;  # 请修改为您的域名
        
        # Let's Encrypt验证
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$server_name$request_uri;
        }
    }
    
    # HTTPS服务器
    server {
        listen 443 ssl http2;
        server_name your-domain.com;  # 请修改为您的域名
        
        # SSL配置
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;
        ssl_session_tickets off;
        
        # 现代SSL配置
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
        # HSTS
        add_header Strict-Transport-Security "max-age=63072000" always;
        
        # 根路径
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
        
        # API接口
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # CORS headers
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
            add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
            
            if ($request_method = 'OPTIONS') {
                add_header Access-Control-Allow-Origin *;
                add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
                add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
                add_header Access-Control-Max-Age 1728000;
                add_header Content-Type 'text/plain; charset=utf-8';
                add_header Content-Length 0;
                return 204;
            }
        }
        
        # AList播放器
        location /alist/ {
            proxy_pass http://alist/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # 文件上传
        location /uploads/ {
            alias /var/www/uploads/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # 健康检查
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

    log_info "Nginx配置已创建"
}

# 配置监控
setup_monitoring() {
    log_info "配置监控服务..."
    
    # Prometheus配置
    cat > monitoring/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  
  - job_name: 'frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/api/metrics'
  
  - job_name: 'backend'
    static_configs:
      - targets: ['backend:5000']
    metrics_path: '/api/metrics'
  
  - job_name: 'mongodb'
    static_configs:
      - targets: ['mongo:27017']
  
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
EOF

    log_info "监控配置已创建"
}

# 显示使用指南
show_usage_guide() {
    log_header "部署完成！"
    echo
    log_info "访问地址："
    echo "  前端网站: https://your-domain.com"
    echo "  API接口: https://your-domain.com/api/v1"
    echo "  AList播放器: https://your-domain.com/alist"
    echo "  监控面板: http://your-domain.com:3001 (Grafana)"
    echo "  数据收集: http://your-domain.com:9090 (Prometheus)"
    echo
    log_info "默认管理员账号："
    echo "  邮箱: admin@example.com"
    echo "  密码: admin123"
    echo
    log_warn "请立即修改默认密码！"
    echo
    log_info "常用命令："
    echo "  查看服务状态: docker-compose ps"
    echo "  查看日志: docker-compose logs -f [service_name]"
    echo "  重启服务: docker-compose restart [service_name]"
    echo "  停止服务: docker-compose down"
    echo "  更新代码: git pull && docker-compose up -d --build"
    echo
}

# 主函数
main() {
    log_header "游戏主播网站一键部署脚本"
    echo
    
    # 检查Docker
    check_command docker
    check_command docker-compose
    
    # 检查端口
    check_port 3000
    check_port 5000
    
    # 创建目录
    create_directories
    
    # 配置环境变量
    configure_env
    
    # 初始化数据库
    init_database
    
    # 配置Nginx
    configure_nginx
    
    # 设置监控
    setup_monitoring
    
    # SSL证书设置
    if [ "$1" = "ssl" ]; then
        if [ "$2" = "letsencrypt" ]; then
            setup_ssl letsencrypt
        elif [ "$2" = "self-signed" ]; then
            setup_ssl self-signed
        fi
    fi
    
    # 启动服务
    start_services
    
    # 显示使用指南
    show_usage_guide
}

# 检查参数
case "${1:-}" in
    "install")
        main ssl letsencrypt
        ;;
    "install-ssl")
        setup_ssl self-signed
        ;;
    "update")
        log_info "更新服务..."
        docker-compose pull
        docker-compose up -d --build
        ;;
    "restart")
        log_info "重启服务..."
        docker-compose restart
        ;;
    "stop")
        log_info "停止服务..."
        docker-compose down
        ;;
    "status")
        docker-compose ps
        ;;
    "logs")
        docker-compose logs -f "${2:-}"
        ;;
    "help"|"-h"|"--help")
        echo "游戏主播网站部署脚本"
        echo
        echo "用法: $0 [命令]"
        echo
        echo "命令:"
        echo "  install     完整安装部署 (需要域名)"
        echo "  install-ssl 安装并生成自签名证书"
        echo "  update      更新服务"
        echo "  restart     重启所有服务"
        echo "  stop        停止所有服务"
        echo "  status      查看服务状态"
        echo "  logs        查看日志 (可指定服务名)"
        echo "  help        显示帮助信息"
        echo
        ;;
    *)
        main
        ;;
esac