# 下载部署脚本 Download deployment script
wget https://raw.githubusercontent.com/your-repo/deploy.sh
chmod +x deploy.sh

# 运行部署脚本 Run deployment script
./deploy.sh
```

## 2. 手动部署步骤 Manual Deployment Steps

### Node.js安装 Node.js Installation
```bash 
# 添加NodeSource仓库 Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 安装Node.js Install Node.js
sudo apt install -y nodejs

# 验证Node.js安装 Verify Node.js installation
node --version
npm --version
```

### PostgreSQL安装（可选）PostgreSQL Installation (Optional)
```bash
# 安装PostgreSQL Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 启动PostgreSQL服务 Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 配置数据库 Configure database
sudo -u postgres createuser --interactive
sudo -u postgres createdb darkroom_guide
```

## 2. 应用程序部署 Application Deployment

### 2.1 准备应用程序 Prepare Application
```bash
# 创建应用目录 Create application directory
sudo mkdir -p /opt/darkroom-guide
sudo chown -R $USER:$USER /opt/darkroom-guide

# 创建日志目录 Create log directory
sudo mkdir -p /opt/darkroom-guide/logs
sudo chown -R $USER:$USER /opt/darkroom-guide/logs

# 复制应用文件 Copy application files
cd /opt/darkroom-guide
git clone <your-repository-url> .
npm install
npm run build
```

### 2.2 配置环境变量 Configure Environment Variables
创建环境变量文件 Create environment file:
```bash
cat > /opt/darkroom-guide/.env << EOL
NODE_ENV=production
PORT=8080
DATABASE_URL=postgres://username:password@localhost:5432/darkroom-guide
EOL
```

## 3. Nginx配置 Nginx Configuration

### 3.1 安装Nginx Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3.2 配置Nginx Configure Nginx
创建Nginx配置文件 Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/darkroom-guide
```

添加以下配置 Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 添加HTTP安全头 Add HTTP security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # 设置客户端最大body大小 Set client max body size
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 添加超时设置 Add timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 启用Gzip压缩 Enable Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 静态文件缓存 Static file caching
    location /assets {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

启用站点配置 Enable site configuration:
```bash
sudo ln -s /etc/nginx/sites-available/darkroom-guide /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. 进程管理 Process Management

### 4.1 安装PM2 Install PM2
```bash
sudo npm install -g pm2
```

### 4.2 配置PM2 Configure PM2
创建PM2配置文件 Create PM2 configuration:
```bash
cat > /opt/darkroom-guide/ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'darkroom-guide',
    script: 'npm',
    args: 'run start',
    cwd: '/opt/darkroom-guide',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: "/opt/darkroom-guide/logs/err.log",
    out_file: "/opt/darkroom-guide/logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true,
    log_type: "json",
    exp_backoff_restart_delay: 100,
    max_restarts: 10,
    kill_timeout: 5000,
    wait_ready: true
  }]
}
EOL
```

### 4.3 启动应用 Start Application
```bash
cd /opt/darkroom-guide
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 5. 监控和维护 Monitoring and Maintenance

### 5.1 日志管理 Log Management
```bash
# 查看应用日志 View application logs
pm2 logs darkroom-guide

# 实时监控 Real-time monitoring
pm2 monit
```

### 5.2 性能监控 Performance Monitoring
```bash
# 查看应用状态 View application status
pm2 status

# 查看详细统计信息 View detailed statistics
pm2 show darkroom-guide
```

### 5.3 自动重启 Automatic Restart
PM2已配置为在应用崩溃时自动重启。您可以通过以下命令查看重启历史：
PM2 is configured to automatically restart the application on crashes. You can view restart history with:
```bash
pm2 show darkroom-guide
```

### 5.4 更新应用 Update Application
```bash
cd /opt/darkroom-guide
git pull
npm install
npm run build
pm2 restart darkroom-guide
```

### 5.5 系统监控 System Monitoring
建议安装基本的系统监控工具：
It's recommended to install basic system monitoring tools:
```bash
# 安装监控工具 Install monitoring tools
sudo apt install htop iotop -y

# 使用htop监控系统资源 Monitor system resources with htop
htop

# 监控磁盘I/O Monitor disk I/O
iotop
```

## 6. 安全配置 Security Configuration

### 6.1 防火墙设置 Firewall Settings
```bash
# 安装UFW Install UFW
sudo apt install ufw -y

# 配置防火墙规则 Configure firewall rules
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# 启用防火墙 Enable firewall
sudo ufw enable
```

### 6.2 自动安全更新 Automatic Security Updates
```bash
# 安装自动更新工具 Install automatic update tools
sudo apt install unattended-upgrades -y

# 启用自动安全更新 Enable automatic security updates
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 6.3 SSL配置（推荐）SSL Configuration (Recommended)
使用Let's Encrypt获取免费SSL证书：
Get free SSL certificate from Let's Encrypt:
```bash
# 安装Certbot Install Certbot
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# 获取并安装证书 Get and install certificate
sudo certbot --nginx -d your-domain.com
```

## 7. 备份策略 Backup Strategy

### 7.1 应用数据备份 Application Data Backup
创建定时备份脚本 Create scheduled backup script:
```bash
sudo mkdir -p /var/backups/darkroom-guide
sudo chown -R $USER:$USER /var/backups/darkroom-guide

cat > /opt/darkroom-guide/backup.sh << EOL
#!/bin/bash
BACKUP_DIR="/var/backups/darkroom-guide"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 备份应用文件 Backup application files
tar -czf $BACKUP_DIR/app_$TIMESTAMP.tar.gz /opt/darkroom-guide

# 保留最近30天的备份 Keep backups for last 30 days
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +30 -delete
EOL

chmod +x /opt/darkroom-guide/backup.sh

# 添加到crontab Add to crontab
(crontab -l 2>/dev/null; echo "0 1 * * * /opt/darkroom-guide/backup.sh") | crontab -
```

## 8. 故障排除 Troubleshooting

### 8.1 常见问题 Common Issues
1. 应用无法启动 Application won't start:
```bash
# 检查错误日志 Check error logs
pm2 logs darkroom-guide --err

# 检查端口占用 Check port usage
sudo lsof -i :8080
```

2. Nginx代理错误 Nginx proxy errors:
```bash
# 检查Nginx错误日志 Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# 检查Nginx配置 Check Nginx configuration
sudo nginx -t
```

### 8.2 性能优化 Performance Optimization
1. 调整Node.js内存限制 Adjust Node.js memory limit:
```bash
# 在生产环境中设置更大的内存限制 Set larger memory limit in production
export NODE_OPTIONS="--max-old-space-size=4096"
```

2. Nginx调优 Nginx tuning:
```bash
# 编辑Nginx配置 Edit Nginx configuration
sudo nano /etc/nginx/nginx.conf

# 添加以下配置 Add the following configuration
worker_processes auto;
worker_rlimit_nofile 65535;
events {
    worker_connections 65535;
    multi_accept on;
}