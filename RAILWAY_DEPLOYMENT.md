# Railway Deployment Guide for BookBarn Backend

## 🚂 Quick Railway Deployment

Your BookBarn Spring Boot backend is now configured for Railway deployment!

### Prerequisites
- Railway account (sign up at https://railway.app)
- Railway CLI installed
- Git repository initialized

### Configuration Files Created
✅ `nixpacks.toml` - Tells Railway how to build the Java app
✅ `railway.json` - Railway-specific deployment configuration  
✅ `Procfile` - Alternative process configuration
✅ `pom.xml` - Updated with Spring Boot Maven plugin

---

## 📦 Deployment Steps

### Option 1: Deploy via Railway CLI (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize Railway project:**
   ```bash
   railway init
   ```
   - Select "Create new project"
   - Give it a name like "bookbarn-backend"

4. **Deploy:**
   ```bash
   railway up
   ```

5. **Add MySQL Database:**
   ```bash
   railway add
   ```
   - Select "MySQL"
   - Railway will automatically provision a database

6. **Set Environment Variables:**
   ```bash
   railway variables set EMAIL_USERNAME=your-email@gmail.com
   railway variables set EMAIL_PASSWORD=your-app-password
   railway variables set JWT_SECRET=nLkPvZ3CJMb2pZVZ6oWRqF2u3Tt0tV8J5c71v0Z5XgA=
   ```

7. **Get your deployment URL:**
   ```bash
   railway domain
   ```

### Option 2: Deploy via Railway Dashboard

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the configuration
5. Add environment variables in the dashboard:
   - `EMAIL_USERNAME`
   - `EMAIL_PASSWORD`
   - `JWT_SECRET`
6. Add MySQL database from the dashboard
7. Deploy!

---

## 🔧 Environment Variables Required

Set these in Railway dashboard or via CLI:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | Auto-set by Railway MySQL |
| `DB_USERNAME` | Database username | Auto-set by Railway MySQL |
| `DB_PASSWORD` | Database password | Auto-set by Railway MySQL |
| `EMAIL_USERNAME` | Gmail address for OTP | your-email@gmail.com |
| `EMAIL_PASSWORD` | Gmail App Password | xxxx xxxx xxxx xxxx |
| `JWT_SECRET` | Secret key for JWT tokens | (generate a new one) |
| `PORT` | Server port | Auto-set by Railway |

### Railway MySQL Auto-Configuration

When you add MySQL via Railway, it automatically sets:
- `MYSQL_URL`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`

Update your `application.properties` to use these:
```properties
spring.datasource.url=${MYSQL_URL:jdbc:mysql://localhost:3306/bookstore}
spring.datasource.username=${MYSQL_USER:root}
spring.datasource.password=${MYSQL_PASSWORD:root}
```

---

## 🧪 Testing Your Deployment

1. **Check deployment logs:**
   ```bash
   railway logs
   ```

2. **Test the API:**
   ```bash
   curl https://your-app.railway.app/otp/test
   ```

3. **Test OTP endpoint:**
   ```bash
   curl -X POST https://your-app.railway.app/otp/send \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

---

## 🔍 Troubleshooting

### Build Fails
- Check logs: `railway logs`
- Ensure Java 17 is specified in `nixpacks.toml`
- Verify Maven build works locally: `cd bookapp && mvn clean package`

### Database Connection Issues
- Verify `MYSQL_URL` is set correctly
- Check if Railway MySQL service is running
- Ensure `application.properties` uses environment variables

### Email Not Sending
- Verify `EMAIL_USERNAME` and `EMAIL_PASSWORD` are set
- Check Gmail App Password is correct
- Review logs for SMTP errors

### Port Binding Issues
- Railway sets `$PORT` automatically
- Ensure your app uses: `-Dserver.port=$PORT`
- Default Spring Boot port (8080) won't work on Railway

---

## 📊 Monitoring

### View Logs
```bash
railway logs --follow
```

### Check Service Status
```bash
railway status
```

### View Environment Variables
```bash
railway variables
```

---

## 🔐 Security Best Practices

Before going live:

- [ ] Generate a new strong JWT secret (don't use the default)
- [ ] Use Railway's built-in secrets management
- [ ] Enable HTTPS (automatic on Railway)
- [ ] Configure CORS with your frontend URL
- [ ] Set up database backups
- [ ] Add rate limiting for OTP endpoints
- [ ] Review and rotate Gmail App Password regularly

### Generate New JWT Secret
```bash
openssl rand -base64 32
```

---

## 💰 Railway Pricing

- **Hobby Plan**: $5/month
  - 500 hours of usage
  - Perfect for development and small projects
  
- **Pro Plan**: $20/month
  - Unlimited usage
  - Better for production

---

## 🚀 Next Steps

After backend deployment:

1. ✅ Note your Railway backend URL
2. ✅ Update frontend `VITE_API_URL` environment variable
3. ✅ Deploy frontend to Vercel/Netlify
4. ✅ Test complete OTP flow
5. ✅ Update CORS configuration with frontend URL

---

## 📞 Support Resources

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Spring Boot on Railway: https://docs.railway.app/guides/spring-boot

---

**Deployment Checklist:**
- [ ] Railway CLI installed
- [ ] Project initialized on Railway
- [ ] MySQL database added
- [ ] Environment variables configured
- [ ] Application deployed successfully
- [ ] Database migrations run
- [ ] Email OTP tested
- [ ] Frontend connected to backend
- [ ] All endpoints working

**Your Railway URL:** `https://your-app-name.railway.app`
