package com.example.authbackend.infrastructure.adapter.out.persistence;

import com.example.authbackend.application.port.out.LeaveRequestRepositoryPort;
import com.example.authbackend.domain.model.LeaveRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class LeaveRequestPersistenceAdapter implements LeaveRequestRepositoryPort {

    private final LeaveRequestJpaRepository jpaRepository;

    @Autowired
    public LeaveRequestPersistenceAdapter(LeaveRequestJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public LeaveRequest save(LeaveRequest lr) {
        LeaveRequestEntity entity = new LeaveRequestEntity();
        entity.setId(lr.getId());
        entity.setEmployeeId(lr.getEmployeeId());
        entity.setEmployeeName(lr.getEmployeeName());
        entity.setLeaveType(lr.getLeaveType());
        entity.setStartDate(lr.getStartDate());
        entity.setEndDate(lr.getEndDate());
        entity.setReason(lr.getReason());
        entity.setStatus(lr.getStatus());
        entity.setCreatedAt(lr.getCreatedAt());
        entity.setUpdatedAt(lr.getUpdatedAt());
        entity.setReviewedBy(lr.getReviewedBy());
        entity.setReviewNotes(lr.getReviewNotes());
        return mapToDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<LeaveRequest> findById(Long id) {
        return jpaRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<LeaveRequest> findAll() {
        return jpaRepository.findAll().stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    @Override
    public List<LeaveRequest> findByEmployeeId(Long employeeId) {
        return jpaRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public long countByStatus(String status) {
        return jpaRepository.countByStatus(status);
    }

    private LeaveRequest mapToDomain(LeaveRequestEntity entity) {
        return LeaveRequest.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployeeId())
                .employeeName(entity.getEmployeeName())
                .leaveType(entity.getLeaveType())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .reason(entity.getReason())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .reviewedBy(entity.getReviewedBy())
                .reviewNotes(entity.getReviewNotes())
                .build();
    }
}
