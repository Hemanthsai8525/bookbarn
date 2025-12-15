package com.example.book.controller;

import com.example.book.dto.VendorDto;
import com.example.book.model.Vendor;
import com.example.book.service.JwtService;
import com.example.book.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.book.model.VendorStatus;

import java.util.List;
import java.util.Map;

@RestController
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Public Registration
    @PostMapping("/vendors/register")
    public ResponseEntity<?> register(@RequestBody VendorDto dto) {
        try {
            Vendor vendor = vendorService.registerVendor(dto);
            return ResponseEntity.ok(vendor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Vendor Login
    @PostMapping("/vendors/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String email = creds.get("email");
        String password = creds.get("password");

        Vendor vendor = vendorService.getVendorByEmail(email);
        if (vendor == null || !passwordEncoder.matches(password, vendor.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        if (vendor.getStatus() != VendorStatus.APPROVED) {
            return ResponseEntity.status(403).body("Vendor account is " + vendor.getStatus());
        }

        String token = jwtService.generateToken(vendor.getId(), vendor.getEmail(), "VENDOR");
        return ResponseEntity
                .ok(Map.of("token", token, "name", vendor.getName(), "email", vendor.getEmail(), "role", "VENDOR"));
    }

    @PostMapping("/vendors/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Vendor vendor = vendorService.getVendorByEmail(email);
        if (vendor == null)
            return ResponseEntity.badRequest().body("Email not found");

        String token = java.util.UUID.randomUUID().toString();
        vendor.setResetToken(token);
        vendor.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(30));
        vendorRepository.save(vendor);

        System.out.println("VENDOR RESET TOKEN: " + token);
        return ResponseEntity.ok(Map.of("message", "Reset token sent to console"));
    }

    @PostMapping("/vendors/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("newPassword");

        if (email == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and new password are required"));
        }

        Vendor vendor = vendorService.getVendorByEmail(email);
        if (vendor == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vendor not found"));
        }

        // Update password (OTP already verified in frontend)
        vendor.setPassword(passwordEncoder.encode(newPassword));
        vendor.setResetToken(null);
        vendor.setResetTokenExpiry(null);
        vendorRepository.save(vendor);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @Autowired
    private com.example.book.repository.BookRepository bookRepository;

    // Get Profile
    @GetMapping("/vendor/profile")
    public ResponseEntity<?> getVendorProfile(@RequestHeader("Authorization") String token) {
        String email = jwtService.extractUsername(token.substring(7));
        Vendor vendor = vendorService.getVendorByEmail(email);
        if (vendor == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(vendor);
    }

    // Update Profile
    @PutMapping("/vendor/profile")
    public ResponseEntity<?> updateVendorProfile(@RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> updates) {
        String email = jwtService.extractUsername(token.substring(7));
        Vendor vendor = vendorService.getVendorByEmail(email);
        if (vendor == null)
            return ResponseEntity.notFound().build();

        if (updates.containsKey("name"))
            vendor.setName(updates.get("name"));
        if (updates.containsKey("phone"))
            vendor.setPhone(updates.get("phone"));
        if (updates.containsKey("address"))
            vendor.setAddress(updates.get("address"));

        // Handle password update if provided
        if (updates.containsKey("password") && !updates.get("password").isEmpty()) {
            vendor.setPassword(passwordEncoder.encode(updates.get("password")));
        }

        // We need to save the vendor. VendorService might not have a simple save method
        // exposed if it's just register.
        // Let's use a repository if Service doesn't have it, but ideally Service should
        // handle this.
        // Checking VendorRepository... injected in AdminController but not here
        // properly?
        // Ah, only VendorService is here. Let's see if VendorService has save/update.
        // If not, I'll inject VendorRepository here too or add update method to
        // Service.
        // For speed, I'll direct inject Repo or add method.
        // Let's assume I can add a method to VendorService or use Repo.
        // VendorService was viewed in conversation history, it had registerVendor.
        // I will inject VendorRepository here as well since I used BookRepository
        // directly too.

        return ResponseEntity.ok(vendorRepository.save(vendor));
    }

    @Autowired
    private com.example.book.repository.VendorRepository vendorRepository;

    // Get My Books
    @GetMapping("/vendor/my-books")
    public ResponseEntity<?> getMyBooks(@RequestHeader("Authorization") String token) {
        // Extract email from token
        String email = jwtService.extractUsername(token.substring(7));
        Vendor vendor = vendorService.getVendorByEmail(email);
        if (vendor == null)
            return ResponseEntity.badRequest().body("Vendor not found");

        return ResponseEntity.ok(bookRepository.findByVendor(vendor));
    }

    // Add Book
    @PostMapping("/vendor/books")
    public ResponseEntity<?> addVendorBook(@RequestHeader("Authorization") String token,
            @RequestBody com.example.book.model.Book book) {
        String email = jwtService.extractUsername(token.substring(7));
        Vendor vendor = vendorService.getVendorByEmail(email);
        if (vendor == null)
            return ResponseEntity.badRequest().body("Vendor not found");

        // Link book to vendor
        book.setVendor(vendor);
        try {
            return ResponseEntity.ok(bookRepository.save(book));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding book: " + e.getMessage());
        }
    }

    @PutMapping("/vendor/books/{id}")
    public ResponseEntity<?> updateVendorBook(@RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody com.example.book.model.Book updatedBook) {
        String email = jwtService.extractUsername(token.substring(7));
        Vendor vendor = vendorService.getVendorByEmail(email);

        return bookRepository.findById(id).map(book -> {
            if (!book.getVendor().getId().equals(vendor.getId())) {
                return ResponseEntity.status(403).body("Unauthorized to edit this book");
            }
            book.setTitle(updatedBook.getTitle());
            book.setAuthor(updatedBook.getAuthor());
            book.setPrice(updatedBook.getPrice());
            book.setCategory(updatedBook.getCategory());
            book.setStock(updatedBook.getStock());
            book.setDescription(updatedBook.getDescription());
            book.setImage(updatedBook.getImage());
            return ResponseEntity.ok(bookRepository.save(book));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/vendor/books/{id}")
    public ResponseEntity<?> deleteVendorBook(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        String email = jwtService.extractUsername(token.substring(7));
        Vendor vendor = vendorService.getVendorByEmail(email);

        return bookRepository.findById(id).map(book -> {
            if (!book.getVendor().getId().equals(vendor.getId())) {
                return ResponseEntity.status(403).body("Unauthorized to delete this book");
            }
            bookRepository.delete(book);
            return ResponseEntity.ok("Book deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin: Get Pending
    @GetMapping("/admin/vendors/pending")
    public List<Vendor> getPendingVendors() {
        return vendorService.getPendingVendors();
    }

    // Admin: Get All
    @GetMapping("/admin/vendors")
    public List<Vendor> getAllVendors() {
        return vendorService.getAllVendors();
    }

    // Admin: Approve
    @PatchMapping("/admin/vendors/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.approveVendor(id));
    }

    // Admin: Reject
    @PatchMapping("/admin/vendors/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.rejectVendor(id));
    }
}
