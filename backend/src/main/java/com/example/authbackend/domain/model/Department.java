package com.example.authbackend.domain.model;

public class Department {
    private Long id;
    private String name;
    private String description;
    private String managerId;

    public Department() {}

    private Department(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.managerId = builder.managerId;
    }

    public static Builder builder() { return new Builder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getManagerId() { return managerId; }
    public void setManagerId(String managerId) { this.managerId = managerId; }

    public static class Builder {
        private Long id;
        private String name, description, managerId;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder managerId(String managerId) { this.managerId = managerId; return this; }
        public Department build() { return new Department(this); }
    }
}
