package com.example.authbackend.application.port.out;

import com.example.authbackend.domain.model.Department;
import java.util.List;
import java.util.Optional;

public interface DepartmentRepositoryPort {
    Department save(Department department);
    Optional<Department> findById(Long id);
    List<Department> findAll();
    void deleteById(Long id);
    boolean existsByName(String name);
    long count();
}
