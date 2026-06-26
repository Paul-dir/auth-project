package com.example.authbackend.application.service;

import com.example.authbackend.application.dto.LeaveRequestDto;
import com.example.authbackend.application.port.in.LeaveRequestUseCase;
import com.example.authbackend.application.port.out.EmployeeRepositoryPort;
import com.example.authbackend.application.port.out.LeaveRequestRepositoryPort;
import com.example.authbackend.application.port.out.UserRepositoryPort;
import com.example.authbackend.domain.exception.ResourceNotFoundException;
import com.example.authbackend.domain.model.Employee;
import com.example.authbackend.domain.model.LeaveRequest;
import com.example.authbackend.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveRequestService implements LeaveRequestUseCase {

    private final LeaveRequestRepositoryPort leaveRequestRepository;
    private final EmployeeRepositoryPort employeeRepository;
    private final UserRepositoryPort userRepository;

    @Autowired
    public LeaveRequestService(LeaveRequestRepositoryPort leaveRequestRepository,
                                EmployeeRepositoryPort employeeRepository,
                                UserRepositoryPort userRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<LeaveRequestDto> getAllLeaveRequests(Long employeeId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (user.getRole().equalsIgnoreCase("ADMIN")) {
            if (employeeId != null) {
                return leaveRequestRepository.findByEmployeeId(employeeId).stream()
                        .map(LeaveRequestDto::from)
                        .collect(Collectors.toList());
            }
            return leaveRequestRepository.findAll().stream()
                    .map(LeaveRequestDto::from)
                    .collect(Collectors.toList());
        } else if (user.getRole().equalsIgnoreCase("EMPLOYEE")) {
            Employee employee = employeeRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee record not found for email: " + user.getEmail()));
            return leaveRequestRepository.findByEmployeeId(employee.getId()).stream()
                    .map(LeaveRequestDto::from)
                    .collect(Collectors.toList());
        } else {
            throw new ResourceNotFoundException("Access denied for customers");
        }
    }

    @Override
    public LeaveRequestDto getLeaveRequestById(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        LeaveRequest lr = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        if (user.getRole().equalsIgnoreCase("EMPLOYEE")) {
            Employee employee = employeeRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee record not found for email: " + user.getEmail()));
            if (!lr.getEmployeeId().equals(employee.getId())) {
                throw new ResourceNotFoundException("Leave request not found or access denied");
            }
        } else if (!user.getRole().equalsIgnoreCase("ADMIN")) {
            throw new ResourceNotFoundException("Access denied");
        }

        return LeaveRequestDto.from(lr);
    }

    @Override
    public LeaveRequestDto createLeaveRequest(LeaveRequestDto request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Long targetEmployeeId;
        String employeeName;

        if (user.getRole().equalsIgnoreCase("EMPLOYEE")) {
            Employee employee = employeeRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee record not found for email: " + user.getEmail()));
            targetEmployeeId = employee.getId();
            employeeName = employee.getFullName();
        } else if (user.getRole().equalsIgnoreCase("ADMIN")) {
            Employee employee = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            targetEmployeeId = employee.getId();
            employeeName = employee.getFullName();
        } else {
            throw new ResourceNotFoundException("Access denied for customers");
        }

        LeaveRequest lr = LeaveRequest.builder()
                .employeeId(targetEmployeeId)
                .employeeName(employeeName)
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
    public void deleteLeaveRequest(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        LeaveRequest lr = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        if (user.getRole().equalsIgnoreCase("EMPLOYEE")) {
            Employee employee = employeeRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee record not found for email: " + user.getEmail()));
            if (!lr.getEmployeeId().equals(employee.getId())) {
                throw new ResourceNotFoundException("Leave request not found or access denied");
            }
            if (!lr.getStatus().equalsIgnoreCase("PENDING")) {
                throw new IllegalStateException("Only pending leave requests can be deleted");
            }
        } else if (!user.getRole().equalsIgnoreCase("ADMIN")) {
            throw new ResourceNotFoundException("Access denied");
        }

        leaveRequestRepository.deleteById(id);
    }
}
