package com.example.authbackend.application.dto;

import com.example.authbackend.domain.model.User;

public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String role;

    public UserProfileDto() {}

    public static UserProfileDto from(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.id = user.getId();
        dto.username = user.getUsername();
        dto.email = user.getEmail();
        dto.role = user.getRole();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
