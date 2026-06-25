package com.example.authbackend.application.port.out;

import com.example.authbackend.domain.model.LeaveRequest;
import java.util.List;
import java.util.Optional;

public interface LeaveRequestRepositoryPort {
    LeaveRequest save(LeaveRequest leaveRequest);
    Optional<LeaveRequest> findById(Long id);
    List<LeaveRequest> findAll();
    List<LeaveRequest> findByEmployeeId(Long employeeId);
    void deleteById(Long id);
    long countByStatus(String status);
}
