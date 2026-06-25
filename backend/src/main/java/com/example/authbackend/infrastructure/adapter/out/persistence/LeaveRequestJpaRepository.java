package com.example.authbackend.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestJpaRepository extends JpaRepository<LeaveRequestEntity, Long> {
    List<LeaveRequestEntity> findByEmployeeId(Long employeeId);
    long countByStatus(String status);
}
