# Faculty Management Dashboard - Production Deployment Guide

## 🚀 Quick Start (Recommended)

### Local Build + Server
```bash
# 1. Build the project
npm run build

# 2. Serve built files (choose one):
npx serve dist -p 3000                    # Using serve package
python -m http.server 3000 --directory dist  # Using Python
npm run preview                            # Using Vite preview

# 3. Access application
http://localhost:3000
```

## 🐳 Docker Deployment Options

### Option 1: Microsoft Container Registry (Recommended)
```bash
# Uses Microsoft mirrors to avoid Docker Hub rate limits
docker compose up -d
# Access: http://localhost:3000
```

### Option 2: Simple Docker (Pre-built files)
```bash
# 1. Build locally first
npm run build

# 2. Use simple Docker
docker compose --profile simple up -d
# Access: http://localhost:3001
```

### Option 3: Local + Copy to Server
```bash
# 1. Build locally
npm run build

# 2. Copy dist folder to your server
scp -r dist/ user@server:/var/www/html/

# 3. Configure web server (nginx/apache) to serve from that folder
```

## 🌐 Production Server Deployment

### Method 1: Direct Build on Server
```bash
# On your server:
git clone <repo-url>
cd faculty-members-management-project
npm install
npm run build

# Serve with any web server:
npx serve dist -p 3000
# or configure nginx/apache to serve 'dist' folder
```

### Method 2: CI/CD Pipeline
```bash
# In your CI/CD:
npm install
npm run build
# Deploy 'dist' folder to your web server
```

## 📋 What's Built

After `npm run build`, you get:
- **dist/index.html** - Main HTML file
- **dist/assets/** - CSS, JS, images, fonts
- **dist/vite.svg** - Favicon

## 🔧 Web Server Configuration

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache Configuration
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/dist
    
    <Directory /path/to/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Handle React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## 🎯 Recommended Deployment Flow

1. **Development**: `npm run dev`
2. **Build**: `npm run build`
3. **Local Test**: `npm run preview` or `npx serve dist`
4. **Deploy**: Copy `dist` folder to server or use Docker

## 🔍 Troubleshooting

### Build Issues
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Docker Issues
```bash
# If Docker Hub is blocked, use local build
npm run build
docker compose --profile simple up -d
```

### Server Issues
- Ensure your web server serves `index.html` for unknown routes (SPA support)
- Check file permissions on the `dist` folder
- Verify port 3000 (or your chosen port) is open

## 📊 Performance Notes

- Built bundle size: ~1.2MB (383KB gzipped)
- Consider code splitting for better performance
- Enable gzip compression on your web server
- Use CDN for static assets in production
