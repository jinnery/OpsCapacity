# 部署指南

## 开发环境部署

### 1. 环境准备
```bash
# 确保已安装 Node.js 16+ 和 npm
node --version
npm --version

# 克隆项目（如果从Git仓库）
git clone <repository-url>
cd capacity-multirole-diagnosis-report
```

### 2. 安装依赖
```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
cd ..
```

### 3. 环境配置
```bash
# 复制环境配置文件
cp .env.example .env
cp client/.env.example client/.env

# 编辑配置文件
nano .env
nano client/.env
```

### 4. 数据库设置（可选）
```bash
# 如果使用MySQL，创建数据库并导入schema
mysql -u root -p < database/schema.sql
```

### 5. 启动开发服务器
```bash
# 方式1：同时启动前后端
npm run dev

# 方式2：分别启动
npm run server  # 后端 (端口 3001)
npm run client  # 前端 (端口 3000)
```

### 6. 访问应用
- 前端应用: http://localhost:3000
- 后端API: http://localhost:3001

## 生产环境部署

### 1. 服务器准备
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2 (进程管理器)
sudo npm install -g pm2

# 安装Nginx (反向代理)
sudo apt install nginx -y
```

### 2. 代码部署
```bash
# 克隆代码到服务器
git clone <repository-url> /var/www/capacity-report
cd /var/www/capacity-report

# 安装依赖
npm install
cd client
npm install
cd ..
```

### 3. 构建前端
```bash
cd client
npm run build
cd ..
```

### 4. 环境配置
```bash
# 生产环境配置
nano .env
```

生产环境 `.env` 示例：
```env
NODE_ENV=production
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_USER=capacity_user
DB_PASSWORD=your_secure_password
DB_NAME=capacity_monitoring
```

### 5. 数据库设置
```bash
# 创建数据库用户和数据库
mysql -u root -p -e "
CREATE DATABASE capacity_monitoring;
CREATE USER 'capacity_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON capacity_monitoring.* TO 'capacity_user'@'localhost';
FLUSH PRIVILEGES;
"

# 导入数据库结构
mysql -u capacity_user -p capacity_monitoring < database/schema.sql
```

### 6. PM2 配置
创建 PM2 配置文件 `ecosystem.config.js`：
```javascript
module.exports = {
  apps: [{
    name: 'capacity-report-api',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

启动应用：
```bash
# 创建日志目录
mkdir logs

# 启动应用
pm2 start ecosystem.config.js

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
```

### 7. Nginx 配置
创建 Nginx 配置文件 `/etc/nginx/sites-available/capacity-report`：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/capacity-report/client/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：
```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/capacity-report /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 8. SSL证书配置（推荐）
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d your-domain.com

# 设置自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## Docker 部署

### 1. 创建 Dockerfile
后端 Dockerfile `server/Dockerfile`：
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

前端 Dockerfile `client/Dockerfile`：
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. 创建 docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: ./server
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=capacity_user
      - DB_PASSWORD=password
      - DB_NAME=capacity_monitoring
    depends_on:
      - mysql
    restart: unless-stopped

  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - api
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=capacity_monitoring
      - MYSQL_USER=capacity_user
      - MYSQL_PASSWORD=password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    restart: unless-stopped

volumes:
  mysql_data:
```

### 3. 启动 Docker 容器
```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 监控和维护

### 1. 应用监控
```bash
# PM2监控
pm2 monit

# 查看进程状态
pm2 status

# 查看日志
pm2 logs capacity-report-api
```

### 2. 日志管理
```bash
# 配置日志轮转
sudo nano /etc/logrotate.d/capacity-report
```

### 3. 备份策略
```bash
# 数据库备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u capacity_user -p capacity_monitoring > backup_$DATE.sql

# 设置定时备份
crontab -e
# 添加：0 2 * * * /path/to/backup-script.sh
```

### 4. 性能优化
- 启用 Gzip 压缩
- 配置 CDN
- 数据库索引优化
- 缓存策略

## 故障排除

### 常见问题

1. **端口占用**
   ```bash
   # 查看端口占用
   sudo netstat -tlnp | grep :3001
   # 杀死进程
   sudo kill -9 <PID>
   ```

2. **数据库连接失败**
   ```bash
   # 检查MySQL状态
   sudo systemctl status mysql
   # 重启MySQL
   sudo systemctl restart mysql
   ```

3. **前端构建失败**
   ```bash
   # 清除缓存
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **权限问题**
   ```bash
   # 修改文件权限
   sudo chown -R www-data:www-data /var/www/capacity-report
   sudo chmod -R 755 /var/www/capacity-report
   ```

### 日志位置
- 应用日志: `./logs/`
- Nginx日志: `/var/log/nginx/`
- PM2日志: `~/.pm2/logs/`
- MySQL日志: `/var/log/mysql/`

## 更新部署

### 1. 代码更新
```bash
cd /var/www/capacity-report
git pull origin main

# 重新构建前端
cd client
npm run build
cd ..

# 重启应用
pm2 restart capacity-report-api
```

### 2. 数据库迁移
```bash
# 如果有数据库结构更新
mysql -u capacity_user -p capacity_monitoring < database/migration.sql
```

### 3. 回滚策略
```bash
# Git回滚
git checkout <previous-commit>

# PM2回滚
pm2 reload capacity-report-api
```