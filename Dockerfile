# 使用多阶段构建
FROM node:20-alpine AS builder

WORKDIR /app

# 1. 先复制 package.json 并安装依赖（利用缓存层）
COPY package*.json ./
RUN npm install

# 2. 复制所有文件（包括 .env.test）
COPY . .

# 3. 根据构建参数选择环境文件
ARG BUILD_ENV=test
ENV VITE_MODE=$BUILD_ENV

# 4. 显式复制对应的 .env 文件（重要！）
COPY .env.${BUILD_ENV} .env

#打印命令
RUN echo "Using environment file: .env.${BUILD_ENV}"

# 5. 构建应用（使用对应的模式）
RUN npm run build:${BUILD_ENV}

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置（如果有）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]