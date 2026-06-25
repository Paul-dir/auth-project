package com.example.authbackend.infrastructure.adapter.out.persistence;

import com.example.authbackend.application.port.out.DepartmentRepositoryPort;
import com.example.authbackend.domain.model.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class DepartmentPersistenceAdapter implements DepartmentRepositoryPort {

    private final DepartmentJpaRepository jpaRepository;

    @Autowired
    public DepartmentPersistenceAdapter(DepartmentJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Department save(Department department) {
        DepartmentEntity entity = new DepartmentEntity();
        entity.setId(department.getId());
        entity.setName(department.getName());
        entity.setDescription(department.getDescription());
        entity.setManagerId(department.getManagerId());
        return mapToDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<Department> findById(Long id) {
        return jpaRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Department> findAll() {
        return jpaRepository.findAll().stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return jpaRepository.existsByName(name);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }

    private Department mapToDomain(DepartmentEntity entity) {
        return Department.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .managerId(entity.getManagerId())
                .build();
    }
}
