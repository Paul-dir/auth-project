package com.example.authbackend.application.port.in;

import com.example.authbackend.application.dto.AuthResponse;
import com.example.authbackend.application.dto.LoginRequest;
import com.example.authbackend.application.dto.RegisterRequest;

public interface AuthUseCase {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
