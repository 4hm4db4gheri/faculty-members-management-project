# Server Deployment Guide

## 🚀 Quick Start

### 1. Local Testing
```bash
# Build the project
npm run build

# Start simple server
node server.cjs

# Or use npm script
npm run serve
```

Your app will be available at: http://localhost:3000

### 2. Production Deployment

#### Option A: Simple Node.js Server
```bash
# On your server:
git clone <your-repo>
cd faculty-members-management-project
npm install
npm run build
node server.cjs
```

#### Option B: Using PM2 (Recommended for Production)
```bash
# Install PM2 globally
npm install -g pm2

# Build and start with PM2
npm run build
pm2 start server.cjs --name faculty-dashboard
pm2 save
pm2 startup
```

## 📁 Files Created for Deployment

1. **server.cjs** - Simple HTTP server (CommonJS)
2. **server-express.js** - Express.js server (more features)
3. **deploy.sh** - Linux deployment script
4. **deploy.ps1** - Windows deployment script
5. **nginx.conf** - Nginx configuration

## 🖥️ Server Options

### Simple Node.js Server (server.cjs)
- ✅ No dependencies
- ✅ Built-in SPA routing
- ✅ Security headers
- ✅ File caching
- Port: 3000 (configurable via PORT env var)

### Express.js Server (server-express.js)
- ✅ Compression middleware
- ✅ Security with Helmet
- ✅ Health check endpoint (/health)
- ✅ Better error handling
- Requires: `npm install express compression helmet`

## 🌐 Production Server Setup

### Linux/Ubuntu Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <your-repo>
cd faculty-members-management-project
npm install
npm run build

# Start with PM2
npm install -g pm2
pm2 start server.cjs --name faculty-dashboard
pm2 startup
pm2 save

# Setup firewall
sudo ufw allow 3000
```

### Nginx Reverse Proxy (Optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
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

## 🔧 Environment Variables

```bash
# Port configuration
export PORT=3000

# For production
export NODE_ENV=production
```

## 📊 Monitoring

### Health Check
```bash
curl http://your-server:3000/health
```

### PM2 Commands
```bash
pm2 status          # Check status
pm2 logs             # View logs
pm2 restart all      # Restart
pm2 stop all         # Stop
pm2 delete all       # Remove
```

## 🔒 Security Considerations

1. **Firewall**: Only open necessary ports
2. **HTTPS**: Use SSL certificate in production
3. **Updates**: Keep Node.js and dependencies updated
4. **User**: Run as non-root user
5. **Logs**: Monitor application logs

## 🚀 Deployment Commands

### Local Development
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview build locally
npm start            # Start production server
```

### Server Deployment
```bash
./deploy.sh          # Linux deployment
./deploy.ps1         # Windows deployment
npm run serve        # Build and start
```

## 📋 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -ti:3000        # Find process using port 3000
   kill -9 <PID>        # Kill the process
   ```

2. **Permission denied**
   ```bash
   sudo chown -R $USER:$USER .
   chmod +x deploy.sh
   ```

3. **Build fails**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

4. **Module not found**
   ```bash
   npm install          # Install dependencies
   node --version       # Check Node.js version (need 18+)
   ```

## 🎯 Performance Tips

1. **Gzip Compression**: Enabled in Express server
2. **Static File Caching**: Configured in server
3. **CDN**: Consider using CDN for assets
4. **Load Balancer**: Use for high traffic
5. **Database**: Optimize backend queries

## 📱 Testing Checklist

- [ ] Application loads without errors
- [ ] All routes work correctly (SPA routing)
- [ ] Static assets load properly
- [ ] API endpoints respond correctly
- [ ] Mobile responsive design works
- [ ] Performance is acceptable
- [ ] Security headers are present
