package com.example.book.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Store OTPs temporarily (email -> OTP data)
    private final ConcurrentHashMap<String, OTPData> otpStore = new ConcurrentHashMap<>();

    // Generate 6-digit OTP
    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    // Send OTP email
    public void sendOTP(String toEmail, String otp, String purpose) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@bookbarn.com");
            message.setTo(toEmail);
            message.setSubject("BookBarn - Your OTP Code");

            String emailBody = String.format(
                    "Hello,\n\n" +
                            "Your OTP for %s is: %s\n\n" +
                            "This code will expire in 10 minutes.\n\n" +
                            "If you didn't request this, please ignore this email.\n\n" +
                            "Best regards,\n" +
                            "BookBarn Team",
                    purpose, otp);

            message.setText(emailBody);
            mailSender.send(message);

            // Store OTP with expiry (10 minutes)
            otpStore.put(toEmail, new OTPData(otp, LocalDateTime.now().plusMinutes(10)));

            System.out.println("OTP sent to " + toEmail + ": " + otp); // For development/testing
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Store OTP anyway for testing
            otpStore.put(toEmail, new OTPData(otp, LocalDateTime.now().plusMinutes(10)));
            System.out.println("OTP (not emailed, stored only) for " + toEmail + ": " + otp);
        }
    }

    // Verify OTP
    public boolean verifyOTP(String email, String otp) {
        OTPData data = otpStore.get(email);
        if (data == null) {
            return false;
        }

        // Check if expired
        if (LocalDateTime.now().isAfter(data.getExpiryTime())) {
            otpStore.remove(email);
            return false;
        }

        // Check if OTP matches
        if (data.getOtp().equals(otp)) {
            otpStore.remove(email); // Remove after successful verification
            return true;
        }

        return false;
    }

    // Clear OTP for an email
    public void clearOTP(String email) {
        otpStore.remove(email);
    }

    // Inner class to store OTP with expiry
    private static class OTPData {
        private final String otp;
        private final LocalDateTime expiryTime;

        public OTPData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }
}
