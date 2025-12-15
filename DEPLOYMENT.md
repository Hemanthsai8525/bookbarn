# GitHub Push & Deployment Guide

## 📦 Step 1: Prepare for GitHub

### Remove Sensitive Data

Before pushing, ensure sensitive data is not in the code:

1. **Update `application.properties`** - Use environment variables:

```properties
# Database
spring.datasource.url=${DATABASE_URL:jdbc:mysql://localhost:3306/bookstore?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}

# Email
spring.mail.username=${EMAIL_USERNAME:your-email@gmail.com}
spring.mail.password=${EMAIL_PASSWORD:your-app-password}

# JWT
app.jwt.secret=${JWT_SECRET:nLkPvZ3CJMb2pZVZ6oWRqF2u3Tt0tV8J5c71v0Z5XgA=}
```

2. **Create `.env.example`** in frontend:

```env
VITE_API_URL=http://localhost:8080
```

## 🚀 Step 2: Push to GitHub

### Initialize Git Repository

```bash
cd c:\Users\heman\Downloads\project

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: BookBarn - Online Bookstore Platform with OTP Email Verification"
```

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `bookbarn` (or your choice)
3. Description: "Full-stack online bookstore with OTP email verification"
4. Choose Public or Private
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### Push to GitHub

```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/bookbarn.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Step 3: Deploy Backend

### Option A: Railway (Recommended - Free Tier)

1. **Sign up:** https://railway.app/
2. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

3. **Login:**
   ```bash
   railway login
   ```

4. **Deploy Backend:**
   ```bash
   cd bookapp
   railway init
   railway up
   ```

5. **Add Environment Variables** in Railway Dashboard:
   - `DATABASE_URL` - Railway will provide MySQL
   - `EMAIL_USERNAME` - Your Gmail
   - `EMAIL_PASSWORD` - Gmail App Password
   - `JWT_SECRET` - Generate new secret

6. **Get Backend URL:** Copy from Railway dashboard

### Option B: Render (Free Tier)

1. **Sign up:** https://render.com/
2. **New Web Service** → Connect GitHub repo
3. **Settings:**
   - Build Command: `cd bookapp && mvn clean install`
   - Start Command: `cd bookapp && java -jar target/book-0.0.1-SNAPSHOT.jar`
   - Environment: Java 17

4. **Add Environment Variables** (same as Railway)

### Option C: Heroku

1. **Install Heroku CLI:** https://devcenter.heroku.com/articles/heroku-cli
2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   cd bookapp
   heroku create bookbarn-backend
   ```

4. **Add MySQL:**
   ```bash
   heroku addons:create jawsdb:kitefin
   ```

5. **Deploy:**
   ```bash
   git subtree push --prefix bookapp heroku main
   ```

## 🎨 Step 4: Deploy Frontend

### Option A: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend_bookapp
   vercel --prod
   ```

3. **Add Environment Variable:**
   - `VITE_API_URL` = Your backend URL from Railway/Render

### Option B: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build:**
   ```bash
   cd frontend_bookapp
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Add Environment Variable** in Netlify dashboard

### Option C: GitHub Pages (Static only)

```bash
cd frontend_bookapp
npm run build
npx gh-pages -d dist
```

## 🔧 Step 5: Update Frontend API URL

After deploying backend, update frontend to use production API:

**In `frontend_bookapp/src/services/api.js`:**

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.railway.app';
```

**Redeploy frontend:**
```bash
vercel --prod
```

## ✅ Step 6: Test Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend-url.railway.app/otp/test
   ```

2. **Test Frontend:**
   - Open: https://your-frontend-url.vercel.app
   - Try registration with OTP
   - Test login
   - Test all features

## 📊 Monitoring

### Backend Logs (Railway)
```bash
railway logs
```

### Frontend Logs (Vercel)
- Check Vercel dashboard → Deployments → Logs

## 🔐 Security Checklist

Before going live:

- [ ] Change JWT secret to a strong random value
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Railway/Vercel)
- [ ] Set up proper CORS origins
- [ ] Configure email SPF/DKIM records
- [ ] Add rate limiting for OTP endpoints
- [ ] Set up database backups
- [ ] Configure proper logging
- [ ] Add monitoring (Sentry, LogRocket)
- [ ] Test all OTP flows in production

## 🎯 Quick Deploy Commands

```bash
# Backend (Railway)
cd bookapp
railway up

# Frontend (Vercel)
cd frontend_bookapp
vercel --prod
```

## 🆘 Troubleshooting

### Issue: Database connection failed
**Solution:** Check DATABASE_URL environment variable

### Issue: Email not sending
**Solution:** Verify EMAIL_USERNAME and EMAIL_PASSWORD

### Issue: CORS errors
**Solution:** Update SecurityConfig with production frontend URL

### Issue: 404 on frontend routes
**Solution:** Add `vercel.json` with rewrites:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test locally first
4. Check GitHub Issues

---

**Deployment Status:**
- [ ] Code pushed to GitHub
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Environment variables configured
- [ ] Database connected
- [ ] Email OTP tested
- [ ] All features working

**Live URLs:**
- Backend: `https://your-backend-url.railway.app`
- Frontend: `https://your-frontend-url.vercel.app`
