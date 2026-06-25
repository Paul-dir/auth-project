package com.example.authbackend.domain.model;

import java.time.LocalDateTime;

public class Ticket {
    private Long id;
    private String customerUsername;
    private String customerEmail;
    private String subject;
    private String description;
    private Long departmentId;
    private String departmentName;
    private String status; // PENDING, IN_PROGRESS, RESOLVED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String resolvedBy;
    private String resolutionNotes;

    public Ticket() {}

    private Ticket(Builder builder) {
        this.id = builder.id;
        this.customerUsername = builder.customerUsername;
        this.customerEmail = builder.customerEmail;
        this.subject = builder.subject;
        this.description = builder.description;
        this.departmentId = builder.departmentId;
        this.departmentName = builder.departmentName;
        this.status = builder.status;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
        this.resolvedBy = builder.resolvedBy;
        this.resolutionNotes = builder.resolutionNotes;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerUsername() { return customerUsername; }
    public void setCustomerUsername(String customerUsername) { this.customerUsername = customerUsername; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public static class Builder {
        private Long id;
        private String customerUsername;
        private String customerEmail;
        private String subject;
        private String description;
        private Long departmentId;
        private String departmentName;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String resolvedBy;
        private String resolutionNotes;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder customerUsername(String customerUsername) { this.customerUsername = customerUsername; return this; }
        public Builder customerEmail(String customerEmail) { this.customerEmail = customerEmail; return this; }
        public Builder subject(String subject) { this.subject = subject; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder resolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; return this; }
        public Builder resolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; return this; }

        public Ticket build() {
            return new Ticket(this);
        }
    }
}
