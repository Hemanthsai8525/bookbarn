package com.example.book.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.book.model.Subscriber;
import com.example.book.repository.SubscriberRepository;

@RestController
@RequestMapping("/newsletter")
public class NewsletterController {

    private final SubscriberRepository repo;

    public NewsletterController(SubscriberRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || !email.contains("@")) {
            return ResponseEntity.badRequest().body("Invalid email address");
        }

        if (repo.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Email already subscribed");
        }

        Subscriber sub = new Subscriber(email);
        repo.save(sub);

        return ResponseEntity.ok("Subscribed successfully!");
    }
}
