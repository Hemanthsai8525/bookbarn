# Email OTP Verification Setup Guide

## Overview
This system provides email-based OTP (One-Time Password) verification for:
- User Registration
- Vendor Registration  
- Delivery Agent Registration
- Password Reset (all user types)
- Forgot Password (all user types)

## Backend Setup

### 1. Dependencies Added
- `spring-boot-starter-mail` - For sending emails via SMTP

### 2. Email Configuration

#### Option A: Using Gmail (Recommended for Testing)

1. **Enable 2-Step Verification** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update `application.properties`**:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-char-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

#### Option B: Using Other Email Providers

**Outlook/Hotmail:**
```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password
```

**Yahoo:**
```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
spring.mail.username=your-email@yahoo.com
spring.mail.password=your-app-password
```

### 3. Backend Components Created

#### EmailService.java
- Generates 6-digit OTP codes
- Sends OTP via email
- Stores OTPs with 10-minute expiry
- Verifies OTP codes

#### OTPController.java
Endpoints:
- `POST /otp/send-registration` - Send OTP for registration
- `POST /otp/send-reset` - Send OTP for password reset
- `POST /otp/verify` - Verify OTP code
- `POST /otp/resend` - Resend OTP

### 4. API Endpoints

#### Send Registration OTP
```http
POST http://localhost:8080/otp/send-registration
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Send Password Reset OTP
```http
POST http://localhost:8080/otp/send-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Verify OTP
```http
POST http://localhost:8080/otp/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Resend OTP
```http
POST http://localhost:8080/otp/resend
Content-Type: application/json

{
  "email": "user@example.com",
  "purpose": "Registration"
}
```

## Frontend Integration

### Registration Flow with OTP

1. User enters email and other details
2. Click "Send OTP" button
3. System sends OTP to email
4. User enters OTP code
5. System verifies OTP
6. If valid, complete registration

### Password Reset Flow with OTP

1. User enters email on forgot password page
2. System sends OTP to email
3. User enters OTP code
4. If valid, allow password reset
5. User sets new password

## Testing Without Email

For development/testing, the system prints OTP codes to the console even if email sending fails:

```
OTP (not emailed, stored only) for user@example.com: 123456
```

## Security Features

✅ **6-digit random OTP** - Secure and user-friendly
✅ **10-minute expiry** - Prevents replay attacks
✅ **One-time use** - OTP is deleted after verification
✅ **In-memory storage** - Fast and secure (ConcurrentHashMap)
✅ **Email validation** - Ensures valid email format

## Production Recommendations

1. **Use environment variables** for email credentials:
```properties
spring.mail.username=${EMAIL_USERNAME}
spring.mail.password=${EMAIL_PASSWORD}
```

2. **Use Redis** for OTP storage in production (for scalability)

3. **Add rate limiting** to prevent OTP spam

4. **Use HTML email templates** for better UX

5. **Add email verification** before allowing login

## Troubleshooting

### Email not sending?
- Check Gmail App Password is correct
- Verify 2-Step Verification is enabled
- Check firewall/antivirus blocking port 587
- Look for OTP in console logs

### OTP verification failing?
- Check OTP hasn't expired (10 minutes)
- Ensure email matches exactly
- OTP is case-sensitive

### Connection timeout?
- Check internet connection
- Try port 465 with SSL instead of 587 with TLS

## Next Steps

To fully integrate OTP verification, you would need to:

1. ✅ Backend OTP service created
2. ✅ OTP endpoints exposed
3. ✅ Security configuration updated
4. ⏳ Frontend OTP input components (next step)
5. ⏳ Update registration flows to require OTP
6. ⏳ Update password reset flows to require OTP

---

**Note:** The current implementation stores OTPs in memory. For production with multiple servers, use Redis or a database for distributed OTP storage.
