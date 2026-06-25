package com.example.authbackend.infrastructure.adapter.in.web;

import com.example.authbackend.application.dto.EmployeeRequest;
import com.example.authbackend.application.dto.EmployeeResponse;
import com.example.authbackend.application.port.in.EmployeeUseCase;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeUseCase employeeUseCase;

    @Autowired
    public EmployeeController(EmployeeUseCase employeeUseCase) {
        this.employeeUseCase = employeeUseCase;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAll(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status) {
        if (query != null || departmentId != null || status != null) {
            return ResponseEntity.ok(employeeUseCase.searchEmployees(query, departmentId, status));
        }
        return ResponseEntity.ok(employeeUseCase.getAllEmployees());
    }

    @GetMapping("/profile")
    public ResponseEntity<EmployeeResponse> getProfile(Principal principal) {
        return ResponseEntity.ok(employeeUseCase.getEmployeeByUsername(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeUseCase.getEmployeeById(id));
    }

    @PostMapping
    public ResponseEntity<EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeUseCase.createEmployee(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeUseCase.updateEmployee(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeUseCase.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
