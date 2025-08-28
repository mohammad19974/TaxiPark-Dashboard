# 🚀 Deployment Guide

This guide covers deploying TaxiPark Pro to various production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Database Setup](#database-setup)
- [Domain & SSL](#domain--ssl)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Node.js**: 18.0 or higher
- **npm**: 8.0 or higher
- **Git**: Latest version
- **Domain**: For production deployment
- **SSL Certificate**: For HTTPS (recommended)

### Hosting Requirements
- **Frontend**: Static hosting (Vercel, Netlify, AWS S3)
- **Backend**: Node.js hosting (Railway, Heroku, DigitalOcean)
- **Database**: SQLite (included) or PostgreSQL/MySQL
- **Email**: SMTP service (Gmail, SendGrid, AWS SES)

## Environment Setup

### 1. Production Environment Variables

#### Backend (.env)
```env
# Production Configuration
NODE_ENV=production
PORT=3001
API_PREFIX=api

# Database Configuration
DATABASE_TYPE=sqlite
DATABASE_PATH=./production.sqlite
# For PostgreSQL:
# DATABASE_TYPE=postgres
# DATABASE_HOST=your-db-host
# DATABASE_PORT=5432
# DATABASE_USERNAME=your-username
# DATABASE_PASSWORD=your-password
# DATABASE_NAME=taxipark_prod

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@your-domain.com

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DEST=./uploads

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Security
HELMET_ENABLED=true
CSRF_ENABLED=true
```

#### Frontend (.env)
```env
# Production API URL
VITE_API_URL=https://your-backend-domain.com/api

# App Configuration
VITE_APP_NAME=TaxiPark Pro
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Complete Taxi Fleet Management System

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_PWA=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Sentry (Optional)
VITE_SENTRY_DSN=your-sentry-dsn
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from frontend directory
   cd frontend
   vercel
   ```

2. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables**
   Add environment variables in Vercel dashboard:
   - `VITE_API_URL`
   - `VITE_APP_NAME`
   - Other frontend environment variables

4. **Custom Domain**
   - Add your domain in Vercel dashboard
   - Configure DNS records
   - SSL is automatically provided

### Option 2: Netlify

1. **Build Configuration**
   Create `netlify.toml` in frontend directory:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**
   - Connect GitHub repository
   - Configure build settings
   - Add environment variables
   - Deploy automatically on push

### Option 3: AWS S3 + CloudFront

1. **Build Application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-app-bucket
   aws s3 website s3://your-app-bucket --index-document index.html
   ```

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-app-bucket --delete
   ```

4. **Configure CloudFront**
   - Create CloudFront distribution
   - Set S3 bucket as origin
   - Configure custom error pages
   - Add SSL certificate

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Prepare for Deployment**
   ```bash
   cd backend
   npm run build
   ```

2. **Create railway.json**
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm run start:prod",
       "healthcheckPath": "/api/health"
     }
   }
   ```

3. **Deploy to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

4. **Configure Environment Variables**
   Add all backend environment variables in Railway dashboard

### Option 2: Heroku

1. **Create Heroku App**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login and create app
   heroku login
   heroku create your-app-name
   ```

2. **Configure Build**
   Add to `package.json`:
   ```json
   {
     "scripts": {
       "heroku-postbuild": "npm run build"
     },
     "engines": {
       "node": "18.x",
       "npm": "8.x"
     }
   }
   ```

3. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

4. **Configure Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   # Add other environment variables
   ```

### Option 3: DigitalOcean Droplet

1. **Create Droplet**
   - Choose Ubuntu 22.04 LTS
   - Select appropriate size (2GB RAM minimum)
   - Add SSH key

2. **Setup Server**
   ```bash
   # Connect to server
   ssh root@your-server-ip
   
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs
   
   # Install PM2
   npm install -g pm2
   
   # Install Nginx
   apt install nginx -y
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/taxipark-pro.git
   cd taxipark-pro/backend
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start dist/main.js --name "taxipark-api"
   pm2 startup
   pm2 save
   ```

4. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/taxipark
   server {
       listen 80;
       server_name your-domain.com;
   
       location / {
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

   ```bash
   # Enable site
   ln -s /etc/nginx/sites-available/taxipark /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

## Database Setup

### SQLite (Default)
- No additional setup required
- Database file created automatically
- Suitable for small to medium applications

### PostgreSQL (Recommended for Production)

1. **Create Database**
   ```sql
   CREATE DATABASE taxipark_prod;
   CREATE USER taxipark_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE taxipark_prod TO taxipark_user;
   ```

2. **Update Environment Variables**
   ```env
   DATABASE_TYPE=postgres
   DATABASE_HOST=your-db-host
   DATABASE_PORT=5432
   DATABASE_USERNAME=taxipark_user
   DATABASE_PASSWORD=secure_password
   DATABASE_NAME=taxipark_prod
   DATABASE_SSL=true
   ```

3. **Run Migrations**
   ```bash
   npm run migration:run
   npm run seed
   ```

### MySQL

1. **Create Database**
   ```sql
   CREATE DATABASE taxipark_prod;
   CREATE USER 'taxipark_user'@'%' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON taxipark_prod.* TO 'taxipark_user'@'%';
   FLUSH PRIVILEGES;
   ```

2. **Update Environment Variables**
   ```env
   DATABASE_TYPE=mysql
   DATABASE_HOST=your-db-host
   DATABASE_PORT=3306
   DATABASE_USERNAME=taxipark_user
   DATABASE_PASSWORD=secure_password
   DATABASE_NAME=taxipark_prod
   ```

## Domain & SSL

### Configure DNS
```
# A Records
www.yourdomain.com -> Frontend IP/CNAME
api.yourdomain.com -> Backend IP

# CNAME Records (if using hosting services)
www.yourdomain.com -> your-app.vercel.app
api.yourdomain.com -> your-app.railway.app
```

### SSL Certificate

#### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### CloudFlare (Recommended)
- Add domain to CloudFlare
- Enable SSL/TLS encryption
- Configure DNS records
- Enable security features

## Monitoring & Maintenance

### Health Checks

1. **Backend Health Endpoint**
   ```typescript
   // Add to backend
   @Get('health')
   health() {
     return {
       status: 'ok',
       timestamp: new Date().toISOString(),
       uptime: process.uptime()
     };
   }
   ```

2. **Frontend Health Check**
   ```javascript
   // Add to frontend
   const healthCheck = async () => {
     try {
       const response = await fetch('/api/health');
       return response.ok;
     } catch {
       return false;
     }
   };
   ```

### Logging

1. **Backend Logging**
   ```bash
   # PM2 logs
   pm2 logs taxipark-api
   
   # Application logs
   tail -f logs/application.log
   ```

2. **Error Tracking**
   - Integrate Sentry for error tracking
   - Set up log aggregation (ELK stack)
   - Configure alerts for critical errors

### Backup Strategy

1. **Database Backup**
   ```bash
   # SQLite
   cp database.sqlite backup-$(date +%Y%m%d).sqlite
   
   # PostgreSQL
   pg_dump taxipark_prod > backup-$(date +%Y%m%d).sql
   
   # MySQL
   mysqldump taxipark_prod > backup-$(date +%Y%m%d).sql
   ```

2. **File Backup**
   ```bash
   # Backup uploads
   tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
   
   # Sync to cloud storage
   aws s3 sync uploads/ s3://your-backup-bucket/uploads/
   ```

### Performance Monitoring

1. **Application Metrics**
   - Response times
   - Error rates
   - Database query performance
   - Memory and CPU usage

2. **Tools**
   - New Relic
   - DataDog
   - Prometheus + Grafana
   - PM2 monitoring

## Troubleshooting

### Common Issues

#### 1. CORS Errors
```javascript
// Backend: Update CORS configuration
app.enableCors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
});
```

#### 2. Environment Variables Not Loading
```bash
# Check if .env file exists
ls -la .env

# Verify environment variables
echo $NODE_ENV
echo $DATABASE_URL
```

#### 3. Database Connection Issues
```bash
# Test database connection
npm run migration:show

# Check database logs
tail -f /var/log/postgresql/postgresql.log
```

#### 4. Build Failures
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
npm --version
```

#### 5. SSL Certificate Issues
```bash
# Check certificate status
ssl-cert-check -c /etc/ssl/certs/your-cert.pem

# Renew Let's Encrypt certificate
sudo certbot renew
```

### Performance Issues

1. **Slow API Responses**
   - Check database query performance
   - Add database indexes
   - Implement caching
   - Optimize API endpoints

2. **High Memory Usage**
   - Monitor memory leaks
   - Optimize database connections
   - Implement connection pooling
   - Scale horizontally

3. **Frontend Loading Issues**
   - Optimize bundle size
   - Implement code splitting
   - Use CDN for static assets
   - Enable compression

### Getting Help

- **Documentation**: Check README and API docs
- **Logs**: Always check application and server logs
- **Community**: Join our Discord server
- **Support**: Email support@taxipark-pro.com

---

**Deployment Checklist:**

- [ ] Environment variables configured
- [ ] Database setup and migrated
- [ ] Frontend built and deployed
- [ ] Backend built and deployed
- [ ] Domain and SSL configured
- [ ] Health checks working
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Performance optimized
- [ ] Security measures in place

**Last Updated: January 15, 2025**