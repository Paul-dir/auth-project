package com.example.authbackend.application.service;

import com.example.authbackend.application.dto.DashboardStatsDto;
import com.example.authbackend.application.port.in.DashboardUseCase;
import com.example.authbackend.application.port.out.DepartmentRepositoryPort;
import com.example.authbackend.application.port.out.EmployeeRepositoryPort;
import com.example.authbackend.application.port.out.LeaveRequestRepositoryPort;
import com.example.authbackend.application.port.out.TicketRepositoryPort;
import com.example.authbackend.domain.model.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService implements DashboardUseCase {

    private final EmployeeRepositoryPort employeeRepository;
    private final DepartmentRepositoryPort departmentRepository;
    private final LeaveRequestRepositoryPort leaveRequestRepository;
    private final TicketRepositoryPort ticketRepository;

    @Autowired
    public DashboardService(EmployeeRepositoryPort employeeRepository,
                             DepartmentRepositoryPort departmentRepository,
                             LeaveRequestRepositoryPort leaveRequestRepository,
                             TicketRepositoryPort ticketRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.ticketRepository = ticketRepository;
    }

    @Override
    public DashboardStatsDto getStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        long total = employeeRepository.findAll().size();
        long active = employeeRepository.countByStatus("ACTIVE");
        long onLeave = employeeRepository.countByStatus("ON_LEAVE");

        stats.setTotalEmployees(total);
        stats.setActiveEmployees(active);
        stats.setOnLeaveEmployees(onLeave);
        stats.setTotalDepartments(departmentRepository.count());
        stats.setPendingLeaveRequests(leaveRequestRepository.countByStatus("PENDING"));
        stats.setOpenTickets(ticketRepository.countByStatus("PENDING"));

        // employees by department
        List<Department> departments = departmentRepository.findAll();
        Map<String, Long> byDept = new LinkedHashMap<>();
        for (Department d : departments) {
            byDept.put(d.getName(), employeeRepository.countByDepartmentId(d.getId()));
        }
        stats.setEmployeesByDepartment(byDept);

        // employees by status
        Map<String, Long> byStatus = new LinkedHashMap<>();
        byStatus.put("ACTIVE", active);
        byStatus.put("ON_LEAVE", onLeave);
        byStatus.put("INACTIVE", employeeRepository.countByStatus("INACTIVE"));
        stats.setEmployeesByStatus(byStatus);

        return stats;
    }
}
