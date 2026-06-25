package com.example.authbackend.application.service;

import com.example.authbackend.application.dto.LeaveRequestDto;
import com.example.authbackend.application.port.in.LeaveRequestUseCase;
import com.example.authbackend.application.port.out.EmployeeRepositoryPort;
import com.example.authbackend.application.port.out.LeaveRequestRepositoryPort;
import com.example.authbackend.domain.exception.ResourceNotFoundException;
import com.example.authbackend.domain.model.Employee;
import com.example.authbackend.domain.model.LeaveRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveRequestService implements LeaveRequestUseCase {

    private final LeaveRequestRepositoryPort leaveRequestRepository;
    private final EmployeeRepositoryPort employeeRepository;

    @Autowired
    public LeaveRequestService(LeaveRequestRepositoryPort leaveRequestRepository,
                                EmployeeRepositoryPort employeeRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<LeaveRequestDto> getAllLeaveRequests() {
        return leaveRequestRepository.findAll().stream()
                .map(LeaveRequestDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveRequestDto> getLeaveRequestsByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId).stream()
                .map(LeaveRequestDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public LeaveRequestDto getLeaveRequestById(Long id) {
        LeaveRequest lr = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        return LeaveRequestDto.from(lr);
    }

    @Override
    public LeaveRequestDto createLeaveRequest(LeaveRequestDto request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LeaveRequest lr = LeaveRequest.builder()
                .employeeId(request.getEmployeeId())
                .employeeName(employee.getFullName())
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return LeaveRequestDto.from(leaveRequestRepository.save(lr));
    }

    @Override
    public LeaveRequestDto approveLeaveRequest(Long id, String reviewedBy, String notes) {
        LeaveRequest lr = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        LeaveRequest updated = LeaveRequest.builder()
                .id(lr.getId())
                .employeeId(lr.getEmployeeId())
                .employeeName(lr.getEmployeeName())
                .leaveType(lr.getLeaveType())
                .startDate(lr.getStartDate())
                .endDate(lr.getEndDate())
                .reason(lr.getReason())
                .status("APPROVED")
                .createdAt(lr.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .reviewedBy(reviewedBy)
                .reviewNotes(notes)
                .build();

        return LeaveRequestDto.from(leaveRequestRepository.save(updated));
    }

    @Override
    public LeaveRequestDto rejectLeaveRequest(Long id, String reviewedBy, String notes) {
        LeaveRequest lr = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        LeaveRequest updated = LeaveRequest.builder()
                .id(lr.getId())
                .employeeId(lr.getEmployeeId())
                .employeeName(lr.getEmployeeName())
                .leaveType(lr.getLeaveType())
                .startDate(lr.getStartDate())
                .endDate(lr.getEndDate())
                .reason(lr.getReason())
                .status("REJECTED")
                .createdAt(lr.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .reviewedBy(reviewedBy)
                .reviewNotes(notes)
                .build();

        return LeaveRequestDto.from(leaveRequestRepository.save(updated));
    }

    @Override
    public void deleteLeaveRequest(Long id) {
        leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        leaveRequestRepository.deleteById(id);
    }
}
