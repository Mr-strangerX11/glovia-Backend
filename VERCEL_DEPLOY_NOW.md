# 🚀 Deploy to Vercel RIGHT NOW - Step by Step

## This will take 15 minutes max

---

## STEP 1: Create Free Vercel Account (2 min)

1. Open: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel
4. You're done! You now have a free Vercel account

---

## STEP 2: Import Your GitHub Repository (3 min)

1. Go to: https://vercel.com/new
2. You'll see "Import Git Repository" section
3. Paste your repo URL or search for "glovia-Backend"
4. Select: `Mr-strangerX11/glovia-Backend`
5. Click the blue "Import" button

---

## STEP 3: Add Environment Variables (5 min)

After clicking Import, you'll see a form with 3 fields:

### 3.1 Project Name
Leave default or change to: `glovia-backend`

### 3.2 Environment Variables
You'll see a section titled "Environment Variables"

**Copy-paste these** (replace XXX with your actual values):

```
NODE_ENV=production
PORT=3001
API_PREFIX=api/v1
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
REDIS_HOST=your-redis-host.redis.cloud.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
JWT_SECRET=your-super-secret-key-12345
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-12345
JWT_REFRESH_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ESEWA_MERCHANT_ID=xxx
ESEWA_SECRET_KEY=xxx
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SUCCESS_URL=https://glovia.com.np/payment/success
ESEWA_FAILURE_URL=https://glovia.com.np/payment/failure
ESEWA_GATEWAY_URL=https://uat.esewa.com.np/epay/main
KHALTI_SECRET_KEY=xxx
KHALTI_PUBLIC_KEY=xxx
KHALTI_GATEWAY_URL=https://khalti.com/api/v2/payment/verify/
KHALTI_RETURN_URL=https://glovia.com.np/payment/khalti/callback
IME_MERCHANT_CODE=xxx
IME_MERCHANT_NAME=Glovia Nepal
IME_MERCHANT_PASSWORD=xxx
IME_GATEWAY_URL=https://stg.imepay.com.np:7979/api/Web/
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@glovia.com.np
SMTP_PASSWORD=your-app-password
SMTP_FROM_NAME=Glovia Nepal
SMTP_FROM_EMAIL=noreply@glovia.com.np
FRONTEND_URL=https://glovia.com.np,https://www.glovia.com.np
SMS_GATEWAY=mock
SPARROW_SMS_TOKEN=your-token
DEFAULT_ADMIN_EMAIL=admin@glovia.com.np
DEFAULT_ADMIN_PASSWORD=Admin@123456
```

**IMPORTANT**: 
- Replace values marked with `xxx` or `your-*` with actual values
- You can skip optional ones for now (like SMS_GATEWAY=mock)

### 3.3 Framework (Skip this section)
Leave blank or select "Other"

---

## STEP 4: Deploy! (2 min)

1. Click the big blue **"Deploy"** button
2. You'll see a progress screen
3. Wait 2-3 minutes while it builds
4. You'll see: "Congratulations! Your project has been deployed"

---

## STEP 5: Get Your URL (1 min)

After deployment completes:
1. You'll see a URL like: `https://glovia-backend-abc123.vercel.app`
2. **Save this URL** - you'll need it for your frontend
3. Click the URL to test

---

## STEP 6: Test It Works (2 min)

In your browser, visit:
```
https://your-url.vercel.app/api/v1/products
```

You should see JSON with products. If you see an error:
- Check "Deployments" → "Logs" tab in Vercel dashboard
- See VERCEL_TROUBLESHOOTING.md for solutions

---

## STEP 7: Update Your Frontend (1 min)

In your frontend `.env` file, add:
```
REACT_APP_API_URL=https://your-deployment.vercel.app/api/v1
```

Then restart frontend and test login!

---

## ✅ YOU'RE DONE!

Your backend is now live on the internet!

### Next Steps:
1. Test all features thoroughly
2. Test payment gateways
3. Test email sending
4. Monitor logs for errors

### Deployment URL Reference:
```
API Base URL: https://your-deployment.vercel.app/api/v1

Example endpoints:
- GET  /api/v1/products
- GET  /api/v1/categories
- POST /api/v1/auth/login
- POST /api/v1/auth/register
```

---

## 🆘 Something Went Wrong?

1. Check Vercel Dashboard → Deployments → Latest → Logs
2. Common issues:
   - Missing DATABASE_URL → Add to Environment Variables
   - Build fails → Check npm run build locally first
   - CORS errors → Update FRONTEND_URL env variable

See VERCEL_TROUBLESHOOTING.md for detailed solutions.

---

**That's it! You did it! 🎉**

Questions? Read: VERCEL_DEPLOYMENT.md (full guide)
