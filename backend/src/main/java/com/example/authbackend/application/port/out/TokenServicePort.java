package com.example.authbackend.application.port.out;

import com.example.authbackend.domain.model.User;

public interface TokenServicePort {
    String generateToken(User user);
    String extractUsername(String token);
    boolean validateToken(String token, User user);
}
