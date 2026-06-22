package com.example.authbackend.domain.model;

public class User {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String role;

    public User() {}
    private User(Builder builder) {
        this.id = builder.id; this.username = builder.username;
        this.email = builder.email; this.password = builder.password; this.role = builder.role;
    }
    public static Builder builder() { return new Builder(); }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public static class Builder {
        private Long id;
        private String username, email, password, role;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public User build() { return new User(this); }
    }
}
