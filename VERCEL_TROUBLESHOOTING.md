# Vercel Deployment Troubleshooting

## Common Issues & Solutions

### ❌ Build Fails: "Cannot find module '@nestjs/core'"

**Cause**: Missing `node_modules` or dependency installation failed

**Solution**:
1. In Vercel Dashboard → Settings → Build & Development
2. Set **Install Command**: `npm install --legacy-peer-deps`
3. Redeploy

---

### ❌ Build Fails: "DATABASE_URL is not defined"

**Cause**: Environment variable not set

**Solution**:
1. Go to Project → Settings → Environment Variables
2. Verify `DATABASE_URL` exists
3. Make sure it's set for **Production** environment
4. Redeploy

---

### ❌ Function Returns 500 Error

**Cause**: Cold start initialization failed

**Solution**:
1. Check Vercel Logs: Deployments → Latest → Logs
2. Look for errors about:
   - Prisma Client missing
   - Database connection timeout
   - Missing environment variables

**If Prisma error**:
```bash
# Check prisma was generated during build
# In vercel.json, build command should be:
"buildCommand": "prisma generate && npm run build"
```

**If Database connection timeout**:
- Check if PostgreSQL server is accessible from Vercel
- Test connection string locally
- Verify firewall allows connections

---

### ❌ CORS Errors on Frontend

**Cause**: Frontend URL not in allowed origins

**Solution**:
1. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://glovia.com.np,https://www.glovia.com.np
   ```
2. Redeploy
3. In frontend, check API calls use correct URL:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL;
   // Should be: https://your-deployment.vercel.app/api/v1
   ```

---

### ⚠️ Slow First Request (5+ seconds)

**Cause**: Cold start - NestJS takes time to bootstrap

**Solution**: This is **normal** on serverless. Options:
1. Accept it (most users won't notice)
2. Upgrade to Vercel Pro ($20/month) for more resources
3. Deploy to traditional server (Railway, Render) instead

---

### ❌ "Too many connections" Error

**Cause**: PostgreSQL connection pool exhausted

**Solution**:

**Option 1**: Use connection pooling (recommended)
```env
# Update DATABASE_URL to include pool options
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connection_limit=5"
```

**Option 2**: Use PgBouncer
- Deploy PgBouncer as middleware
- Update DATABASE_URL to use PgBouncer endpoint

---

### ❌ Prisma Errors: "Unknown field 'xyz'"

**Cause**: Prisma Client not generated with latest schema

**Solution**:
1. Ensure build command includes: `prisma generate`
2. Verify `node_modules/.prisma` is included in deployment
3. In `vercel.json`:
   ```json
   {
     "config": {
       "includeFiles": ["dist/**", "node_modules/.prisma/**"]
     }
   }
   ```
4. Redeploy

---

### ❌ Payment Gateway Errors

**Cause**: Invalid merchant credentials in production

**Solution**:
1. Verify production credentials are in environment variables:
   - ESEWA_MERCHANT_ID
   - KHALTI_SECRET_KEY
   - IME_MERCHANT_CODE
2. Use production URLs (not test/UAT):
   ```
   ESEWA_GATEWAY_URL=https://esewa.com.np/api/payment  (production)
   # NOT https://uat.esewa.com.np (test)
   ```
3. Redeploy

---

### ❌ Email Sending Fails

**Cause**: SMTP credentials incorrect

**Solution**:
1. Verify SMTP credentials:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=noreply@glovia.com.np
   SMTP_PASSWORD=your-app-specific-password
   ```
2. For Gmail: Use [App Password](https://myaccount.google.com/apppasswords)
3. Test with: `curl -X POST https://your-api.vercel.app/api/v1/auth/register`
4. Check Vercel logs for SMTP errors

---

### ❌ Redis Connection Fails

**Cause**: Redis host/credentials wrong or Redis not running

**Solution**:
1. Verify Redis is running and accessible from Vercel
2. Update credentials:
   ```
   REDIS_HOST=your-redis-host.redis.cloud.com
   REDIS_PORT=6379
   REDIS_PASSWORD=your-password
   ```
3. If using local Redis: Won't work on Vercel (use Cloud Redis)
   - Recommended: [Redis Cloud](https://redis.com/cloud/) (free tier)

---

## Testing Deployed API

### Test Without Authentication
```bash
VERCEL_URL="https://your-deployment.vercel.app"

# Get products
curl "$VERCEL_URL/api/v1/products"

# Get categories
curl "$VERCEL_URL/api/v1/categories"

# Get brands
curl "$VERCEL_URL/api/v1/brands"
```

### Test With Authentication
```bash
# 1. Register
curl -X POST "$VERCEL_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test@123",
    "phone":"9800000000",
    "firstName":"Test",
    "lastName":"User"
  }'

# Response should include accessToken
# {"accessToken":"eyJhbGc...", "user": {...}}

# 2. Use token to access protected routes
TOKEN="your-access-token"
curl "$VERCEL_URL/api/v1/users/profile" \
  -H "Authorization: Bearer $TOKEN"
```

---

## View Deployment Logs

### Method 1: Vercel Dashboard
1. https://vercel.com/dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. Click "Logs" tab

### Method 2: Vercel CLI
```bash
npm install -g vercel

# Login
vercel login

# View logs
vercel logs your-project-name --follow
```

### Method 3: Check Function Logs
1. Dashboard → Deployments → Latest
2. Scroll down to "Functions" section
3. Click the function to see execution logs

---

## Rollback to Previous Version

If deployment breaks:
1. Dashboard → Deployments
2. Find previous working version
3. Click "..."
4. Select "Promote to Production"

---

## Performance Tips

### Reduce Cold Start Time
1. **Use fewer dependencies**: Each adds startup time
2. **Enable caching**: Redis for frequently accessed data
3. **Optimize Prisma**: Use select() to fetch only needed fields
4. **Minify code**: Already done by NestJS build

### Monitor Performance
1. Vercel Dashboard → Analytics
2. Check: Request count, response times, errors
3. Identify slow endpoints

### CDN for Static Assets
1. Upload images to Cloudinary (already configured)
2. Images served from Cloudinary CDN (fast globally)
3. Don't store images in Vercel function (increases bundle size)

---

## Keep It Running

### Set Up Alerts
1. Dashboard → Settings → Integrations
2. Connect Slack
3. Get notifications for failed deployments

### Monitor Uptime
Use free service like:
- https://uptimerobot.com
- https://pingdom.com
- Set to ping: `https://your-api.vercel.app/api/v1/products` every 5 minutes

### Regular Checks
- Test login flow weekly
- Monitor error logs daily (first week)
- Check payment integration monthly

---

## When to Consider Alternatives

**Switch to Docker/Railway if:**
- Cold starts unacceptable (>3s)
- Frequent WebSocket connections needed
- Need in-memory caching across requests
- Budget: $5/month vs $0 free tier

**Switch to Firebase if:**
- Want fully managed backend
- Willing to use Firestore instead of PostgreSQL
- Simple CRUD operations

**Stick with Vercel if:**
- Traffic is variable (good auto-scaling)
- Don't mind cold starts
- Want simplicity + free tier
- Like Vercel's developer experience

---

## Still Having Issues?

1. **Check this guide**: VERCEL_DEPLOYMENT.md
2. **Search Vercel docs**: https://vercel.com/docs
3. **Ask in Vercel Community**: https://discord.gg/vercel
4. **Check NestJS docs**: https://docs.nestjs.com

---

**Last Updated**: February 5, 2026
