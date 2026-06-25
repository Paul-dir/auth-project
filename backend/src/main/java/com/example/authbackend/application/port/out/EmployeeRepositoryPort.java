package com.example.authbackend.application.port.out;

import com.example.authbackend.domain.model.Employee;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepositoryPort {
    Employee save(Employee employee);
    Optional<Employee> findById(Long id);
    List<Employee> findAll();
    List<Employee> search(String query, Long departmentId, String status);
    void deleteById(Long id);
    boolean existsByEmail(String email);
    Optional<Employee> findByEmail(String email);
    long countByStatus(String status);
    long countByDepartmentId(Long departmentId);
}
