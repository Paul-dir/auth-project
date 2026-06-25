package com.example.authbackend.application.dto;

import com.example.authbackend.domain.model.Employee;
import java.time.LocalDate;

public class EmployeeResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String position;
    private Long departmentId;
    private String departmentName;
    private LocalDate hireDate;
    private String status;
    private Double salary;
    private String avatarUrl;
    private String address;
    private LocalDate dateOfBirth;

    public EmployeeResponse() {}

    public static EmployeeResponse from(Employee e) {
        EmployeeResponse r = new EmployeeResponse();
        r.id = e.getId();
        r.firstName = e.getFirstName();
        r.lastName = e.getLastName();
        r.fullName = e.getFullName();
        r.email = e.getEmail();
        r.phone = e.getPhone();
        r.position = e.getPosition();
        r.departmentId = e.getDepartmentId();
        r.departmentName = e.getDepartmentName();
        r.hireDate = e.getHireDate();
        r.status = e.getStatus();
        r.salary = e.getSalary();
        r.avatarUrl = e.getAvatarUrl();
        r.address = e.getAddress();
        r.dateOfBirth = e.getDateOfBirth();
        return r;
    }

    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getPosition() { return position; }
    public Long getDepartmentId() { return departmentId; }
    public String getDepartmentName() { return departmentName; }
    public LocalDate getHireDate() { return hireDate; }
    public String getStatus() { return status; }
    public Double getSalary() { return salary; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getAddress() { return address; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
}
