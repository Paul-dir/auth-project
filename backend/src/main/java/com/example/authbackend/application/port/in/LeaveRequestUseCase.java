package com.example.authbackend.application.port.in;

import com.example.authbackend.application.dto.LeaveRequestDto;
import java.util.List;

public interface LeaveRequestUseCase {
    List<LeaveRequestDto> getAllLeaveRequests(Long employeeId, String username);
    LeaveRequestDto getLeaveRequestById(Long id, String username);
    LeaveRequestDto createLeaveRequest(LeaveRequestDto request, String username);
    LeaveRequestDto approveLeaveRequest(Long id, String reviewedBy, String notes);
    LeaveRequestDto rejectLeaveRequest(Long id, String reviewedBy, String notes);
    void deleteLeaveRequest(Long id, String username);
}
