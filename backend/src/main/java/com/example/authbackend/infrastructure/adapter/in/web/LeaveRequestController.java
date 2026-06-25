package com.example.authbackend.infrastructure.adapter.in.web;

import com.example.authbackend.application.dto.LeaveRequestDto;
import com.example.authbackend.application.port.in.LeaveRequestUseCase;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    private final LeaveRequestUseCase leaveRequestUseCase;

    @Autowired
    public LeaveRequestController(LeaveRequestUseCase leaveRequestUseCase) {
        this.leaveRequestUseCase = leaveRequestUseCase;
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequestDto>> getAll(
            @RequestParam(required = false) Long employeeId) {
        if (employeeId != null) {
            return ResponseEntity.ok(leaveRequestUseCase.getLeaveRequestsByEmployee(employeeId));
        }
        return ResponseEntity.ok(leaveRequestUseCase.getAllLeaveRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequestDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestUseCase.getLeaveRequestById(id));
    }

    @PostMapping
    public ResponseEntity<LeaveRequestDto> create(@Valid @RequestBody LeaveRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveRequestUseCase.createLeaveRequest(request));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveRequestDto> approve(@PathVariable Long id,
                                                    @RequestBody(required = false) Map<String, String> body) {
        String reviewedBy = body != null ? body.getOrDefault("reviewedBy", "Admin") : "Admin";
        String notes = body != null ? body.getOrDefault("notes", "") : "";
        return ResponseEntity.ok(leaveRequestUseCase.approveLeaveRequest(id, reviewedBy, notes));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveRequestDto> reject(@PathVariable Long id,
                                                   @RequestBody(required = false) Map<String, String> body) {
        String reviewedBy = body != null ? body.getOrDefault("reviewedBy", "Admin") : "Admin";
        String notes = body != null ? body.getOrDefault("notes", "") : "";
        return ResponseEntity.ok(leaveRequestUseCase.rejectLeaveRequest(id, reviewedBy, notes));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leaveRequestUseCase.deleteLeaveRequest(id);
        return ResponseEntity.noContent().build();
    }
}
