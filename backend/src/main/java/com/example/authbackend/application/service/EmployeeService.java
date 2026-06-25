package com.example.authbackend.application.service;

import com.example.authbackend.application.dto.EmployeeRequest;
import com.example.authbackend.application.dto.EmployeeResponse;
import com.example.authbackend.application.port.in.EmployeeUseCase;
import com.example.authbackend.application.port.out.DepartmentRepositoryPort;
import com.example.authbackend.application.port.out.EmployeeRepositoryPort;
import com.example.authbackend.application.port.out.UserRepositoryPort;
import com.example.authbackend.domain.exception.ResourceNotFoundException;
import com.example.authbackend.domain.model.Department;
import com.example.authbackend.domain.model.Employee;
import com.example.authbackend.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService implements EmployeeUseCase {

    private final EmployeeRepositoryPort employeeRepository;
    private final DepartmentRepositoryPort departmentRepository;
    private final UserRepositoryPort userRepository;

    @Autowired
    public EmployeeService(EmployeeRepositoryPort employeeRepository,
                           DepartmentRepositoryPort departmentRepository,
                           UserRepositoryPort userRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(EmployeeResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeResponse> searchEmployees(String query, Long departmentId, String status) {
        return employeeRepository.search(query, departmentId, status).stream()
                .map(EmployeeResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return EmployeeResponse.from(employee);
    }

    @Override
    public EmployeeResponse getEmployeeByEmail(String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with email: " + email));
        return EmployeeResponse.from(employee);
    }

    @Override
    public EmployeeResponse getEmployeeByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Employee employee = employeeRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Employee record not found for email: " + user.getEmail()));
        return EmployeeResponse.from(employee);
    }

    @Override
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Employee employee = Employee.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .position(request.getPosition())
                .departmentId(dept.getId())
                .departmentName(dept.getName())
                .hireDate(request.getHireDate() != null ? request.getHireDate() : LocalDate.now())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .salary(request.getSalary())
                .avatarUrl(request.getAvatarUrl())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .build();

        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Employee updated = Employee.builder()
                .id(existing.getId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .position(request.getPosition())
                .departmentId(dept.getId())
                .departmentName(dept.getName())
                .hireDate(request.getHireDate() != null ? request.getHireDate() : existing.getHireDate())
                .status(request.getStatus() != null ? request.getStatus() : existing.getStatus())
                .salary(request.getSalary())
                .avatarUrl(request.getAvatarUrl())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .build();

        return EmployeeResponse.from(employeeRepository.save(updated));
    }

    @Override
    public void deleteEmployee(Long id) {
        if (!employeeRepository.findById(id).isPresent()) {
            throw new ResourceNotFoundException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }
}
