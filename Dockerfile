# 使用 Node.js 作为构建环境
FROM node:20-alpine AS builder

# 接收构建环境参数（默认为 prod）
ARG BUILD_ENV=prod
ENV BUILD_ENV=${BUILD_ENV}

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖
RUN npm install

# 根据传入的 BUILD_ENV 参数执行对应构建命令
RUN npm run build:$BUILD_ENV

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
