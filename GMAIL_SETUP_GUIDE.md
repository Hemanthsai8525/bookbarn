# Gmail SMTP Setup for OTP Email Service

## ⚠️ IMPORTANT: You're using a regular password, but Gmail requires an App Password!

### Step-by-Step Guide to Generate Gmail App Password:

#### 1. Enable 2-Step Verification (if not already enabled)
   - Go to: https://myaccount.google.com/security
   - Click on "2-Step Verification"
   - Follow the steps to enable it

#### 2. Generate App Password
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
   - Select app: "Mail"
   - Select device: "Windows Computer" (or Other)
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

#### 3. Update application.properties
   ```properties
   spring.mail.username=saibittu594@gmail.com
   spring.mail.password=abcdefghijklmnop  # Use the 16-char app password (no spaces)
   ```

### Alternative: Use Less Secure App Access (NOT RECOMMENDED)

If you don't want to use 2-Step Verification:
1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Use your regular Gmail password

**Note:** Google is phasing out this option, so App Passwords are recommended.

### Testing the Configuration:

After updating the password, restart your Spring Boot application and try sending OTP again.

### Troubleshooting:

**Error: "Username and Password not accepted"**
- You're using regular password instead of App Password
- Generate App Password as described above

**Error: "Connection timeout"**
- Check your firewall/antivirus
- Try port 465 with SSL instead:
  ```properties
  spring.mail.port=465
  spring.mail.properties.mail.smtp.ssl.enable=true
  ```

**Error: "Authentication failed"**
- Double-check the App Password (no spaces)
- Make sure 2-Step Verification is enabled
- Try regenerating the App Password

### Current Configuration Status:
✅ Email: saibittu594@gmail.com
❌ Password: Regular password (needs to be App Password)
✅ SMTP Host: smtp.gmail.com
✅ Port: 587 (TLS)

### What to do now:
1. Generate App Password from Google Account
2. Update `spring.mail.password` in application.properties
3. Restart Spring Boot application
4. Test OTP sending

---

**Quick Link:** https://myaccount.google.com/apppasswords
