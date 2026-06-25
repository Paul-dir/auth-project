package com.example.authbackend.application.service;

import com.example.authbackend.application.dto.DepartmentRequest;
import com.example.authbackend.application.dto.DepartmentResponse;
import com.example.authbackend.application.port.in.DepartmentUseCase;
import com.example.authbackend.application.port.out.DepartmentRepositoryPort;
import com.example.authbackend.application.port.out.EmployeeRepositoryPort;
import com.example.authbackend.domain.exception.ResourceNotFoundException;
import com.example.authbackend.domain.model.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService implements DepartmentUseCase {

    private final DepartmentRepositoryPort departmentRepository;
    private final EmployeeRepositoryPort employeeRepository;

    @Autowired
    public DepartmentService(DepartmentRepositoryPort departmentRepository,
                              EmployeeRepositoryPort employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(d -> {
                    DepartmentResponse r = DepartmentResponse.from(d);
                    r.setEmployeeCount(employeeRepository.countByDepartmentId(d.getId()));
                    return r;
                })
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentResponse getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        DepartmentResponse r = DepartmentResponse.from(dept);
        r.setEmployeeCount(employeeRepository.countByDepartmentId(id));
        return r;
    }

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        Department dept = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .managerId(request.getManagerId())
                .build();
        return DepartmentResponse.from(departmentRepository.save(dept));
    }

    @Override
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        Department updated = Department.builder()
                .id(id)
                .name(request.getName())
                .description(request.getDescription())
                .managerId(request.getManagerId())
                .build();

        DepartmentResponse r = DepartmentResponse.from(departmentRepository.save(updated));
        r.setEmployeeCount(employeeRepository.countByDepartmentId(id));
        return r;
    }

    @Override
    public void deleteDepartment(Long id) {
        departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        departmentRepository.deleteById(id);
    }
}
