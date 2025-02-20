#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Error handling
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo -e "${RED}错误: 命令 \"${last_command}\" 失败，退出码 $?.${NC}"' EXIT

echo -e "${GREEN}开始部署暗房指南应用...${NC}"

# 1. Check required software
echo "检查必要的软件..."
for cmd in node npm; do
    if ! command -v $cmd &> /dev/null; then
        echo -e "${RED}错误: 需要 $cmd 但未安装${NC}" >&2
        exit 1
    fi
done

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 未安装，正在安装...${NC}"
    sudo npm install -g pm2
fi

# 2. Create necessary directories
echo "创建应用目录..."
sudo mkdir -p /opt/darkroom-guide/logs
sudo chown -R $USER:$USER /opt/darkroom-guide

# 3. Install dependencies
echo "安装依赖..."
cd /opt/darkroom-guide
npm install

# 4. Build application
echo "构建应用..."
npm run build

# 5. Configure environment variables
echo "配置环境变量..."
cat > .env << EOL
NODE_ENV=production
PORT=8080
DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/darkroom-guide}
EOL

# 6. Configure PM2
echo "配置 PM2..."
if [ ! -f ecosystem.config.js ]; then
    cp ./ecosystem.config.js /opt/darkroom-guide/
fi

# 7. Configure Nginx
echo "配置 Nginx..."
sudo tee /etc/nginx/sites-available/darkroom-guide << EOL
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static file caching
    location /assets {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
EOL

# Create symbolic link if it doesn't exist
if [ ! -f /etc/nginx/sites-enabled/darkroom-guide ]; then
    sudo ln -s /etc/nginx/sites-available/darkroom-guide /etc/nginx/sites-enabled/
fi

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# 8. Start application
echo "使用 PM2 启动应用..."
pm2 start ecosystem.config.js
pm2 save

# Remove error trap
trap - EXIT

echo -e "${GREEN}部署完成！${NC}"
echo "应用现在可以通过 http://localhost:8080 访问"
echo "请确保防火墙允许80和8080端口的访问"