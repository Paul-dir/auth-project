package com.example.authbackend.application.dto;

import com.example.authbackend.domain.model.Ticket;
import java.time.LocalDateTime;

public class TicketResponse {
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

    public TicketResponse() {}

    public static TicketResponse from(Ticket ticket) {
        TicketResponse res = new TicketResponse();
        res.setId(ticket.getId());
        res.setCustomerUsername(ticket.getCustomerUsername());
        res.setCustomerEmail(ticket.getCustomerEmail());
        res.setSubject(ticket.getSubject());
        res.setDescription(ticket.getDescription());
        res.setDepartmentId(ticket.getDepartmentId());
        res.setDepartmentName(ticket.getDepartmentName());
        res.setStatus(ticket.getStatus());
        res.setCreatedAt(ticket.getCreatedAt());
        res.setUpdatedAt(ticket.getUpdatedAt());
        res.setResolvedBy(ticket.getResolvedBy());
        res.setResolutionNotes(ticket.getResolutionNotes());
        return res;
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
}
