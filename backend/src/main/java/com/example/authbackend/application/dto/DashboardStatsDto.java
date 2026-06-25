package com.example.authbackend.application.dto;

import java.util.Map;

public class DashboardStatsDto {
    private long totalEmployees;
    private long activeEmployees;
    private long onLeaveEmployees;
    private long totalDepartments;
    private long pendingLeaveRequests;
    private Map<String, Long> employeesByDepartment;
    private Map<String, Long> employeesByStatus;

    public DashboardStatsDto() {}

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }
    public long getActiveEmployees() { return activeEmployees; }
    public void setActiveEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; }
    public long getOnLeaveEmployees() { return onLeaveEmployees; }
    public void setOnLeaveEmployees(long onLeaveEmployees) { this.onLeaveEmployees = onLeaveEmployees; }
    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }
    public long getPendingLeaveRequests() { return pendingLeaveRequests; }
    public void setPendingLeaveRequests(long pendingLeaveRequests) { this.pendingLeaveRequests = pendingLeaveRequests; }
    public Map<String, Long> getEmployeesByDepartment() { return employeesByDepartment; }
    public void setEmployeesByDepartment(Map<String, Long> employeesByDepartment) { this.employeesByDepartment = employeesByDepartment; }
    public Map<String, Long> getEmployeesByStatus() { return employeesByStatus; }
    public void setEmployeesByStatus(Map<String, Long> employeesByStatus) { this.employeesByStatus = employeesByStatus; }
}
