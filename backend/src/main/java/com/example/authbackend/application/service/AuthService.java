package com.example.authbackend.application.service;

import com.example.authbackend.application.dto.AuthResponse;
import com.example.authbackend.application.dto.LoginRequest;
import com.example.authbackend.application.dto.RegisterRequest;
import com.example.authbackend.application.port.in.AuthUseCase;
import com.example.authbackend.application.port.out.TokenServicePort;
import com.example.authbackend.application.port.out.UserRepositoryPort;
import com.example.authbackend.domain.exception.InvalidCredentialsException;
import com.example.authbackend.domain.exception.UserAlreadyExistsException;
import com.example.authbackend.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements AuthUseCase {

    private final UserRepositoryPort userRepository;
    private final TokenServicePort tokenService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepositoryPort userRepository, TokenServicePort tokenService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }
        String token = tokenService.generateToken(user);
        return AuthResponse.builder()
                .token(token).username(user.getUsername()).email(user.getEmail())
                .message("Login successful").build();
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }
        String role = request.getRole();
        if (role == null || (!role.equalsIgnoreCase("EMPLOYEE") && !role.equalsIgnoreCase("CUSTOMER"))) {
            role = "CUSTOMER";
        } else {
            role = role.toUpperCase();
        }

        User user = User.builder()
                .username(request.getUsername()).email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())).role(role).build();
        User savedUser = userRepository.save(user);
        String token = tokenService.generateToken(savedUser);
        return AuthResponse.builder()
                .token(token).username(savedUser.getUsername()).email(savedUser.getEmail())
                .message("Registration successful").build();
    }
}
