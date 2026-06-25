package com.example.authbackend.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeJpaRepository extends JpaRepository<EmployeeEntity, Long> {
    boolean existsByEmail(String email);
    Optional<EmployeeEntity> findByEmail(String email);
    long countByStatus(String status);
    long countByDepartmentId(Long departmentId);

    @Query("SELECT e FROM EmployeeEntity e WHERE " +
           "(:query IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(e.email) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(e.position) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:departmentId IS NULL OR e.departmentId = :departmentId) " +
           "AND (:status IS NULL OR e.status = :status)")
    List<EmployeeEntity> search(@Param("query") String query,
                                 @Param("departmentId") Long departmentId,
                                 @Param("status") String status);
}
