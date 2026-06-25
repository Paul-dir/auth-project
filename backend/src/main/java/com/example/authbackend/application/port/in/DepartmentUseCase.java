package com.example.authbackend.application.port.in;

import com.example.authbackend.application.dto.DepartmentRequest;
import com.example.authbackend.application.dto.DepartmentResponse;
import java.util.List;

public interface DepartmentUseCase {
    List<DepartmentResponse> getAllDepartments();
    DepartmentResponse getDepartmentById(Long id);
    DepartmentResponse createDepartment(DepartmentRequest request);
    DepartmentResponse updateDepartment(Long id, DepartmentRequest request);
    void deleteDepartment(Long id);
}
