package com.example.authbackend.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentJpaRepository extends JpaRepository<DepartmentEntity, Long> {
    boolean existsByName(String name);
}
