package com.example.authbackend.infrastructure.adapter.in.web;

import com.example.authbackend.application.dto.LeaveRequestDto;
import com.example.authbackend.application.port.in.LeaveRequestUseCase;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
            @RequestParam(required = false) Long employeeId,
            Principal principal) {
        return ResponseEntity.ok(leaveRequestUseCase.getAllLeaveRequests(employeeId, principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequestDto> getById(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(leaveRequestUseCase.getLeaveRequestById(id, principal.getName()));
    }

    @PostMapping
    public ResponseEntity<LeaveRequestDto> create(@Valid @RequestBody LeaveRequestDto request, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveRequestUseCase.createLeaveRequest(request, principal.getName()));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveRequestDto> approve(@PathVariable Long id,
                                                    @RequestBody(required = false) Map<String, String> body,
                                                    Principal principal) {
        String notes = body != null ? body.getOrDefault("notes", "") : "";
        return ResponseEntity.ok(leaveRequestUseCase.approveLeaveRequest(id, principal.getName(), notes));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveRequestDto> reject(@PathVariable Long id,
                                                   @RequestBody(required = false) Map<String, String> body,
                                                   Principal principal) {
        String notes = body != null ? body.getOrDefault("notes", "") : "";
        return ResponseEntity.ok(leaveRequestUseCase.rejectLeaveRequest(id, principal.getName(), notes));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        leaveRequestUseCase.deleteLeaveRequest(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
