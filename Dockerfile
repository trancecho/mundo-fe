# 使用 Node.js 作为构建环境
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package.json package-lock.json* ./

# 安装依赖并构建项目
RUN npm install && npm run build:prod && npm cache clean --force

# 复制项目文件
COPY . .

# 检查构建输出
RUN ls -l /app/dist

# 使用 Nginx 作为生产环境
FROM nginx:alpine

# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建好的静态文件到 Nginx 的默认静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]