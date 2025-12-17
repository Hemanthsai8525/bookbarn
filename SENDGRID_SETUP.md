# SendGrid Email Setup Guide

## Why SendGrid?
- ✅ Works through firewalls (unlike Gmail SMTP)
- ✅ Free tier: 100 emails/day
- ✅ More reliable for production
- ✅ Better deliverability
- ✅ No "less secure apps" issues

## Step-by-Step Setup

### 1. Create SendGrid Account
1. Go to: https://signup.sendgrid.com/
2. Sign up with your email
3. Verify your email address
4. Complete the onboarding

### 2. Create API Key
1. Log in to SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it: `BookBarn-Production`
5. Select **Full Access** (or at minimum: Mail Send)
6. Click **Create & View**
7. **COPY THE API KEY** (you won't see it again!)

### 3. Verify Sender Identity
1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details:
   - From Name: `BookBarn`
   - From Email: `saibittu594@gmail.com` (or your preferred email)
   - Reply To: Same as above
4. Check your email and click the verification link

### 4. Update application.properties

Replace the email configuration section with:

```properties
# Email Configuration (SendGrid)
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=YOUR_SENDGRID_API_KEY_HERE
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=10000
spring.mail.properties.mail.smtp.timeout=10000
spring.mail.properties.mail.smtp.writetimeout=10000
```

### 5. Update EmailService.java

Change the "From" email to match your verified sender:

```java
message.setFrom("saibittu594@gmail.com"); // Must match verified sender
```

### 6. Update Railway Environment Variables

In Railway dashboard, add/update these variables:

```
SPRING_MAIL_HOST=smtp.sendgrid.net
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=apikey
SPRING_MAIL_PASSWORD=YOUR_SENDGRID_API_KEY_HERE
SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_REQUIRED=true
```

### 7. Test Locally

After setup, restart your Spring Boot app and test:
- Registration flow
- Password reset flow
- Vendor registration

## Troubleshooting

### "Sender address rejected"
- Make sure you verified the sender email in SendGrid
- The "From" email in code must match the verified sender

### "Authentication failed"
- Double-check the API key is correct
- Username must be exactly: `apikey` (not your email)

### Still not working?
- Check SendGrid Activity Feed for delivery status
- Check spam folder
- Verify API key has "Mail Send" permission

## Testing

Once configured, you should see:
1. ✅ No more "MailConnectException" errors
2. ✅ Emails actually sent (check SendGrid Activity Feed)
3. ✅ OTPs delivered to inbox (or spam folder initially)

## Free Tier Limits

- 100 emails/day (forever free)
- Perfect for development and small apps
- Upgrade if you need more

## Next Steps After Setup

1. Copy your API key
2. Update `application.properties`
3. Update `EmailService.java` 
4. Test locally
5. Push to Railway
6. Update Railway environment variables
7. Test from production
