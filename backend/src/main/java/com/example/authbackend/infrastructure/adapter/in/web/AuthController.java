package com.example.authbackend.infrastructure.adapter.in.web;

import com.example.authbackend.application.dto.AuthResponse;
import com.example.authbackend.application.dto.LoginRequest;
import com.example.authbackend.application.dto.RegisterRequest;
import com.example.authbackend.application.dto.UserProfileDto;
import com.example.authbackend.application.port.in.AuthUseCase;
import com.example.authbackend.application.port.out.UserRepositoryPort;
import com.example.authbackend.domain.model.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthUseCase authUseCase;
    private final UserRepositoryPort userRepository;

    @Autowired
    public AuthController(AuthUseCase authUseCase, UserRepositoryPort userRepository) {
        this.authUseCase = authUseCase;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authUseCase.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authUseCase.register(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> me(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(UserProfileDto.from(user));
    }
}
