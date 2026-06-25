package com.example.authbackend.application.port.in;

import com.example.authbackend.application.dto.LeaveRequestDto;
import java.util.List;

public interface LeaveRequestUseCase {
    List<LeaveRequestDto> getAllLeaveRequests();
    List<LeaveRequestDto> getLeaveRequestsByEmployee(Long employeeId);
    LeaveRequestDto getLeaveRequestById(Long id);
    LeaveRequestDto createLeaveRequest(LeaveRequestDto request);
    LeaveRequestDto approveLeaveRequest(Long id, String reviewedBy, String notes);
    LeaveRequestDto rejectLeaveRequest(Long id, String reviewedBy, String notes);
    void deleteLeaveRequest(Long id);
}
