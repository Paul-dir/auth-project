package com.example.authbackend.infrastructure.adapter.out.persistence;

import com.example.authbackend.application.port.out.EmployeeRepositoryPort;
import com.example.authbackend.domain.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class EmployeePersistenceAdapter implements EmployeeRepositoryPort {

    private final EmployeeJpaRepository jpaRepository;

    @Autowired
    public EmployeePersistenceAdapter(EmployeeJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Employee save(Employee employee) {
        EmployeeEntity entity = new EmployeeEntity();
        entity.setId(employee.getId());
        entity.setFirstName(employee.getFirstName());
        entity.setLastName(employee.getLastName());
        entity.setEmail(employee.getEmail());
        entity.setPhone(employee.getPhone());
        entity.setPosition(employee.getPosition());
        entity.setDepartmentId(employee.getDepartmentId());
        entity.setDepartmentName(employee.getDepartmentName());
        entity.setHireDate(employee.getHireDate());
        entity.setStatus(employee.getStatus());
        entity.setSalary(employee.getSalary());
        entity.setAvatarUrl(employee.getAvatarUrl());
        entity.setAddress(employee.getAddress());
        entity.setDateOfBirth(employee.getDateOfBirth());
        return mapToDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<Employee> findById(Long id) {
        return jpaRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Employee> findAll() {
        return jpaRepository.findAll().stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    @Override
    public List<Employee> search(String query, Long departmentId, String status) {
        return jpaRepository.search(query, departmentId, status).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    @Override
    public Optional<Employee> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(this::mapToDomain);
    }

    @Override
    public long countByStatus(String status) {
        return jpaRepository.countByStatus(status);
    }

    @Override
    public long countByDepartmentId(Long departmentId) {
        return jpaRepository.countByDepartmentId(departmentId);
    }

    private Employee mapToDomain(EmployeeEntity entity) {
        return Employee.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .position(entity.getPosition())
                .departmentId(entity.getDepartmentId())
                .departmentName(entity.getDepartmentName())
                .hireDate(entity.getHireDate())
                .status(entity.getStatus())
                .salary(entity.getSalary())
                .avatarUrl(entity.getAvatarUrl())
                .address(entity.getAddress())
                .dateOfBirth(entity.getDateOfBirth())
                .build();
    }
}
