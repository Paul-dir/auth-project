package com.example.authbackend.application.dto;

import com.example.authbackend.domain.model.Department;

public class DepartmentResponse {
    private Long id;
    private String name;
    private String description;
    private String managerId;
    private long employeeCount;

    public DepartmentResponse() {}

    public static DepartmentResponse from(Department d) {
        DepartmentResponse r = new DepartmentResponse();
        r.id = d.getId();
        r.name = d.getName();
        r.description = d.getDescription();
        r.managerId = d.getManagerId();
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getManagerId() { return managerId; }
    public void setManagerId(String managerId) { this.managerId = managerId; }
    public long getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(long employeeCount) { this.employeeCount = employeeCount; }
}
