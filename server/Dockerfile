# 多阶段构建的Dockerfile - 后端服务
# 阶段1: 依赖安装
FROM node:18-alpine AS dependencies

WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache \
    ffmpeg \
    imagemagick \
    curl \
    && rm -rf /var/cache/apk/*

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 阶段2: 构建应用
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm ci

# 复制源代码
COPY . .

# 阶段3: 生产环境
FROM node:18-alpine AS production

# 安装系统依赖
RUN apk add --no-cache \
    ffmpeg \
    imagemagick \
    curl \
    && rm -rf /var/cache/apk/*

# 创建应用用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeapp -u 1001

# 创建应用目录
WORKDIR /app

# 复制依赖
COPY --from=dependencies --chown=nodeapp:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodejs /app/src ./src
COPY --from=builder --chown=nodeapp:nodejs /app/package*.json ./

# 创建日志目录
RUN mkdir -p logs uploads && \
    chown -R nodeapp:nodejs logs uploads

# 切换到应用用户
USER nodeapp

# 暴露端口
EXPOSE 5000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/v1/system/health || exit 1

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=5000

# 启动应用
CMD ["node", "src/index.js"]