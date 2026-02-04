# Glovia Nepal Backend - Vercel Deployment Guide

## ✅ Pre-Deployment Checklist (COMPLETED)

- ✅ Fixed TypeScript errors (latitude/longitude types)
- ✅ Created Vercel serverless handler (`api/index.js`)
- ✅ Configured `vercel.json` with proper build settings
- ✅ Added error handling to handler
- ✅ Created `.gitignore` for production
- ✅ Created `vercel.env.example` template

## 📋 STEP 1: Create Vercel Account & Connect GitHub

### 1.1 Create Account
1. Go to https://vercel.com/signup
2. Sign up using GitHub account
3. Authorize Vercel to access your GitHub repositories

### 1.2 Import Your Repository
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Search for `glovia-Backend` 
4. Click "Import"

```
Project Name: glovia-backend
Framework: Other
Root Directory: ./ (default)
```

## 🔑 STEP 2: Add Environment Variables

### 2.1 In Vercel Dashboard
1. Navigate to: **Project → Settings → Environment Variables**
2. Add these variables (copy values from your `.env` file):

```
# Core Settings
NODE_ENV=production
PORT=3001
API_PREFIX=api/v1

# Database (PostgreSQL)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public

# Redis
REDIS_HOST=your-redis-host.redis.cloud.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Gateways
ESEWA_MERCHANT_ID=your-esewa-merchant-id
ESEWA_SECRET_KEY=your-esewa-secret-key
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SUCCESS_URL=https://glovia.com.np/payment/success
ESEWA_FAILURE_URL=https://glovia.com.np/payment/failure
ESEWA_GATEWAY_URL=https://uat.esewa.com.np/epay/main

KHALTI_SECRET_KEY=your-khalti-secret-key
KHALTI_PUBLIC_KEY=your-khalti-public-key
KHALTI_GATEWAY_URL=https://khalti.com/api/v2/payment/verify/
KHALTI_RETURN_URL=https://glovia.com.np/payment/khalti/callback

IME_MERCHANT_CODE=your-ime-merchant-code
IME_MERCHANT_NAME=Glovia Nepal
IME_MERCHANT_PASSWORD=your-ime-password
IME_GATEWAY_URL=https://stg.imepay.com.np:7979/api/Web/

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@glovia.com.np
SMTP_PASSWORD=your-app-password
SMTP_FROM_NAME=Glovia Nepal
SMTP_FROM_EMAIL=noreply@glovia.com.np

# Frontend
FRONTEND_URL=https://glovia.com.np,https://www.glovia.com.np

# SMS Gateway
SMS_GATEWAY=mock
SPARROW_SMS_TOKEN=your-sparrow-token-here
SPARROW_SMS_FROM=GloviaNepal

# Admin Defaults
DEFAULT_ADMIN_EMAIL=admin@glovia.com.np
DEFAULT_ADMIN_PASSWORD=Admin@123456
```

### 2.2 Set Environment for Specific Deployment
- Select: **Production** (top right dropdown)
- This ensures these variables are used in production builds

## 🚀 STEP 3: Configure Build & Deploy

Vercel should auto-detect your settings from `vercel.json`, but verify:

### 3.1 In Project Settings
1. **Settings → Build & Development Settings**
2. Verify:
   - **Build Command**: `prisma generate && npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.2 Deploy
1. Click "Deploy" button (or auto-deployed if connected)
2. Wait for build to complete (~2-3 minutes)
3. You'll get a deployment URL like: `https://glovia-backend-xyz.vercel.app`

## ✅ STEP 4: Verify Deployment

### 4.1 Test API Health
```bash
# Get your deployment URL from Vercel dashboard
VERCEL_URL="https://your-deployment.vercel.app"

# Test API health
curl "$VERCEL_URL/api/v1/products"

# Expected response:
# {"data": [...], "total": N, "page": 1}
```

### 4.2 Check Logs
1. In Vercel Dashboard: **Deployments → Click latest → Logs**
2. Look for:
   - ✅ "Build completed"
   - ✅ "Function initialized"
   - ❌ "Error" messages (if any)

### 4.3 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Build fails: "Cannot find module"** | Check `includeFiles` in `vercel.json` |
| **DATABASE_URL is undefined** | Add `DATABASE_URL` to Environment Variables |
| **CORS errors on frontend** | Update `FRONTEND_URL` env var |
| **Cold start takes 5+ seconds** | Normal for NestJS. Can't be avoided on serverless |
| **Prisma connection fails** | Verify PostgreSQL connection string is correct |

## 🔗 STEP 5: Connect to Frontend

### 5.1 Update Frontend API URL
In your frontend `.env`:
```
REACT_APP_API_URL=https://your-deployment.vercel.app/api/v1
```

### 5.2 Test Login Flow
1. Try to register: `POST /api/v1/auth/register`
2. Try to login: `POST /api/v1/auth/login`
3. Check if JWT tokens are issued correctly

## 📊 STEP 6: Monitor & Maintain

### 6.1 Set Up Monitoring
1. **Settings → Integrations**
2. Connect: Slack / Email for deployment notifications

### 6.2 View Usage
- **Analytics tab**: Request counts, response times, errors
- **Free tier**: 100GB-hours/month bandwidth

### 6.3 Custom Domain
1. **Settings → Domains**
2. Add your custom domain (e.g., `api.glovia.com.np`)
3. Update DNS records as shown

## ⚙️ ADVANCED: Database Connection Pooling

If you experience "too many connections" errors:

### Option 1: Use PgBouncer (Free)
```bash
# Install locally via Heroku
# Then update DATABASE_URL to use PgBouncer endpoint
DATABASE_URL=postgresql://user:pass@pgbouncer-host:6432/db
```

### Option 2: Use Prisma Data Proxy (Paid)
Update `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["dataProxy"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then in env:
```
# Use Prisma Data Proxy URL instead of direct connection
DATABASE_URL=prisma://YOUR_API_KEY@us-east-1.prisma.io/glovia?schema=public
```

## 🎯 Next Steps

1. **Test thoroughly** in production-like environment
2. **Monitor logs** for first 24 hours
3. **Set up error tracking**: https://sentry.io (optional)
4. **Configure CDN** for static assets (images, etc.)
5. **Plan scaling** if traffic increases

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **NestJS on Serverless**: https://docs.nestjs.com/deployment
- **Prisma Serverless Guide**: https://www.prisma.io/docs/guides/databases/postgresql#deploy-to-serverless-environments

---

**Last Updated**: February 5, 2026
**Status**: Ready for Production ✅
