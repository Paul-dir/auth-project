package com.example.authbackend.application.port.in;

import com.example.authbackend.application.dto.EmployeeRequest;
import com.example.authbackend.application.dto.EmployeeResponse;
import java.util.List;

public interface EmployeeUseCase {
    List<EmployeeResponse> getAllEmployees();
    List<EmployeeResponse> searchEmployees(String query, Long departmentId, String status);
    EmployeeResponse getEmployeeById(Long id);
    EmployeeResponse getEmployeeByEmail(String email);
    EmployeeResponse getEmployeeByUsername(String username);
    EmployeeResponse createEmployee(EmployeeRequest request);
    EmployeeResponse updateEmployee(Long id, EmployeeRequest request);
    void deleteEmployee(Long id);
}
