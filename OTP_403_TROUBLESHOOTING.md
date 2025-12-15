# OTP 403 Forbidden - Troubleshooting Guide

## Current Status
❌ **Still getting 403 Forbidden on `/otp/send-registration`**

## What We've Done So Far

### ✅ Backend Changes Made:
1. ✅ Added `spring-boot-starter-mail` dependency
2. ✅ Created `EmailService.java` for OTP generation/verification
3. ✅ Created `OTPController.java` with endpoints
4. ✅ Added `/otp/**` to SecurityConfig permitAll()
5. ✅ Added `/otp/` to JwtFilter whitelist
6. ✅ Added CORS configuration to SecurityConfig
7. ✅ Added `@CrossOrigin` to OTPController
8. ✅ Configured Gmail SMTP with App Password

### 📝 Current Configuration:

**SecurityConfig.java** - Line 36-42:
```java
.requestMatchers("/user/login", "/user/register", "/user/refresh", "/user/forgot-password",
        "/user/reset-password",
        "/delivery/login", "/delivery/register", "/delivery/refresh", "/delivery/forgot-password",
        "/delivery/reset-password",
        "/vendors/register", "/vendors/login", "/vendors/forgot-password", "/vendors/reset-password",
        "/otp/**")
.permitAll()
```

**JwtFilter.java** - Line 29-46:
```java
if (path.startsWith("/user/login") ||
        path.startsWith("/user/register") ||
        path.startsWith("/user/refresh") ||
        path.startsWith("/user/forgot-password") ||
        path.startsWith("/user/reset-password") ||
        path.startsWith("/delivery/login") ||
        path.startsWith("/delivery/register") ||
        path.startsWith("/delivery/forgot-password") ||
        path.startsWith("/delivery/reset-password") ||
        path.startsWith("/vendors/login") ||
        path.startsWith("/vendors/register") ||
        path.startsWith("/vendors/forgot-password") ||
        path.startsWith("/vendors/reset-password") ||
        path.startsWith("/otp/") ||
        path.startsWith("/books") ||
        path.startsWith("/uploads/")) {
    chain.doFilter(request, response);
    return;
}
```

**OTPController.java**:
```java
@RestController
@RequestMapping("/otp")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class OTPController {
    @PostMapping("/send-registration")
    public ResponseEntity<?> sendRegistrationOTP(@RequestBody Map<String, String> request) {
        // ... implementation
    }
}
```

## 🔍 Debugging Steps

### Step 1: Verify Server Restarted with New Code
**Test in browser or Postman:**
```
GET http://localhost:8080/otp/test
```
Expected: `{"message": "OTP Controller is working!", "timestamp": ...}`

If this returns 403 → Server didn't reload the new code
If this returns 200 → Controller is accessible, issue is with POST endpoint

### Step 2: Test OTP Endpoint Directly
**Using Postman or curl:**
```bash
curl -X POST http://localhost:8080/otp/send-registration \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com"}'
```

Expected: `{"message": "OTP sent to your email", "email": "test@gmail.com"}`

### Step 3: Check Browser Console
Open browser DevTools → Network tab → Try registration → Check:
- Request URL: Should be `http://localhost:8080/otp/send-registration`
- Request Method: Should be POST
- Request Headers: Should include `Content-Type: application/json`
- Response Status: Currently showing 403

### Step 4: Check Spring Boot Console
Look for:
- "OTP sent to..." message (means controller was hit)
- Any security-related errors
- CORS errors

## 🚨 Possible Issues

### Issue 1: Server Not Restarted Properly
**Solution:** 
1. Stop Spring Boot completely (Ctrl+C or kill process)
2. Clean build: `mvn clean install` (if using Maven)
3. Restart: Run BookApplication.java from IDE

### Issue 2: IDE Not Reloading Changes
**Solution:**
- If using IntelliJ: Build → Rebuild Project
- If using Eclipse: Project → Clean
- Then restart the application

### Issue 3: Port Conflict
**Check if 8080 is in use:**
```powershell
netstat -ano | findstr :8080
```
If another process is using it, kill it or change Spring Boot port

### Issue 4: CSRF Still Enabled
**Verify in SecurityConfig:**
```java
http.csrf(csrf -> csrf.disable());  // Should be present
```

### Issue 5: Filter Order
The JwtFilter runs BEFORE SecurityConfig. If JwtFilter doesn't bypass the path, SecurityConfig never gets a chance.

**Verify JwtFilter has:**
```java
path.startsWith("/otp/")  // Note the trailing slash!
```

## ✅ Quick Fix Checklist

- [ ] Stop Spring Boot application completely
- [ ] Verify `JwtFilter.java` has `/otp/` in whitelist
- [ ] Verify `SecurityConfig.java` has `/otp/**` in permitAll
- [ ] Verify `OTPController.java` has `@CrossOrigin` annotation
- [ ] Clean and rebuild project
- [ ] Start Spring Boot application
- [ ] Check console for "SecurityConfig loaded!" message
- [ ] Test `GET http://localhost:8080/otp/test` in browser
- [ ] If test works, try POST from frontend

## 🔧 Alternative: Temporary Bypass

If still not working, temporarily make ALL endpoints public to test:

**In SecurityConfig.java:**
```java
http.authorizeHttpRequests(auth -> auth
    .anyRequest().permitAll()  // TEMPORARY - allows everything
);
```

If this works → Problem is in SecurityConfig/JwtFilter configuration
If this still fails → Problem is elsewhere (CORS, network, etc.)

## 📞 Next Steps

1. **Restart Spring Boot** - This is CRITICAL
2. **Test the `/otp/test` endpoint** - Verify controller is accessible
3. **Check Spring Boot console** - Look for errors
4. **Test with Postman** - Isolate frontend vs backend issue
5. **Share console output** - If still failing, share the Spring Boot startup logs

---

**Most Likely Issue:** Server hasn't been restarted with the new code changes.
**Quick Test:** Try `http://localhost:8080/otp/test` in your browser right now.
