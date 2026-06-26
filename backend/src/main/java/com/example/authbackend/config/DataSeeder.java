package com.example.authbackend.config;

import com.example.authbackend.application.port.out.DepartmentRepositoryPort;
import com.example.authbackend.application.port.out.EmployeeRepositoryPort;
import com.example.authbackend.application.port.out.LeaveRequestRepositoryPort;
import com.example.authbackend.application.port.out.TicketRepositoryPort;
import com.example.authbackend.application.port.out.UserRepositoryPort;
import com.example.authbackend.domain.model.Department;
import com.example.authbackend.domain.model.Employee;
import com.example.authbackend.domain.model.LeaveRequest;
import com.example.authbackend.domain.model.Ticket;
import com.example.authbackend.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final DepartmentRepositoryPort departmentRepo;
    private final EmployeeRepositoryPort employeeRepo;
    private final LeaveRequestRepositoryPort leaveRepo;
    private final TicketRepositoryPort ticketRepo;
    private final UserRepositoryPort userRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataSeeder(DepartmentRepositoryPort departmentRepo,
                      EmployeeRepositoryPort employeeRepo,
                      LeaveRequestRepositoryPort leaveRepo,
                      TicketRepositoryPort ticketRepo,
                      UserRepositoryPort userRepo,
                      PasswordEncoder passwordEncoder) {
        this.departmentRepo = departmentRepo;
        this.employeeRepo = employeeRepo;
        this.leaveRepo = leaveRepo;
        this.ticketRepo = ticketRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (departmentRepo.count() > 0) {
            return;
        }

        // Seed admin user
        if (!userRepo.existsByUsername("admin")) {
            userRepo.save(User.builder()
                    .username("admin")
                    .email("admin@company.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .build());
        }

        // Seed departments
        Department eng = departmentRepo.save(Department.builder()
                .name("Engineering").description("Software development and infrastructure").build());
        Department hr = departmentRepo.save(Department.builder()
                .name("Human Resources").description("People operations and talent management").build());
        Department mkt = departmentRepo.save(Department.builder()
                .name("Marketing").description("Brand, growth and communications").build());
        Department fin = departmentRepo.save(Department.builder()
                .name("Finance").description("Accounting, budgeting and financial planning").build());
        Department ops = departmentRepo.save(Department.builder()
                .name("Operations").description("Business operations and logistics").build());

        // Seed employees
        Employee e1 = employeeRepo.save(Employee.builder()
                .firstName("Alice").lastName("Johnson").email("alice@company.com")
                .phone("+1-555-0101").position("Senior Software Engineer")
                .departmentId(eng.getId()).departmentName(eng.getName())
                .hireDate(LocalDate.of(2021, 3, 15)).status("ACTIVE")
                .salary(95000.0).address("123 Tech St, San Francisco, CA").dateOfBirth(LocalDate.of(1990, 6, 20)).build());

        Employee e2 = employeeRepo.save(Employee.builder()
                .firstName("Bob").lastName("Smith").email("bob@company.com")
                .phone("+1-555-0102").position("Product Manager")
                .departmentId(eng.getId()).departmentName(eng.getName())
                .hireDate(LocalDate.of(2020, 7, 1)).status("ACTIVE")
                .salary(105000.0).address("456 Market St, San Francisco, CA").dateOfBirth(LocalDate.of(1987, 11, 5)).build());

        Employee e3 = employeeRepo.save(Employee.builder()
                .firstName("Carol").lastName("Davis").email("carol@company.com")
                .phone("+1-555-0103").position("HR Manager")
                .departmentId(hr.getId()).departmentName(hr.getName())
                .hireDate(LocalDate.of(2019, 1, 10)).status("ACTIVE")
                .salary(80000.0).address("789 Mission St, San Francisco, CA").dateOfBirth(LocalDate.of(1985, 4, 14)).build());

        Employee e4 = employeeRepo.save(Employee.builder()
                .firstName("David").lastName("Wilson").email("david@company.com")
                .phone("+1-555-0104").position("Marketing Director")
                .departmentId(mkt.getId()).departmentName(mkt.getName())
                .hireDate(LocalDate.of(2018, 9, 20)).status("ACTIVE")
                .salary(115000.0).address("321 Howard St, San Francisco, CA").dateOfBirth(LocalDate.of(1982, 8, 30)).build());

        Employee e5 = employeeRepo.save(Employee.builder()
                .firstName("Eva").lastName("Martinez").email("eva@company.com")
                .phone("+1-555-0105").position("Financial Analyst")
                .departmentId(fin.getId()).departmentName(fin.getName())
                .hireDate(LocalDate.of(2022, 2, 28)).status("ON_LEAVE")
                .salary(72000.0).address("654 Folsom St, San Francisco, CA").dateOfBirth(LocalDate.of(1993, 12, 1)).build());

        Employee e6 = employeeRepo.save(Employee.builder()
                .firstName("Frank").lastName("Lee").email("frank@company.com")
                .phone("+1-555-0106").position("DevOps Engineer")
                .departmentId(eng.getId()).departmentName(eng.getName())
                .hireDate(LocalDate.of(2021, 11, 8)).status("ACTIVE")
                .salary(88000.0).address("987 Bryant St, San Francisco, CA").dateOfBirth(LocalDate.of(1991, 3, 17)).build());

        Employee e7 = employeeRepo.save(Employee.builder()
                .firstName("Grace").lastName("Chen").email("grace@company.com")
                .phone("+1-555-0107").position("UX Designer")
                .departmentId(eng.getId()).departmentName(eng.getName())
                .hireDate(LocalDate.of(2023, 4, 3)).status("ACTIVE")
                .salary(78000.0).address("159 Brannan St, San Francisco, CA").dateOfBirth(LocalDate.of(1995, 9, 22)).build());

        Employee e8 = employeeRepo.save(Employee.builder()
                .firstName("Henry").lastName("Brown").email("henry@company.com")
                .phone("+1-555-0108").position("Operations Manager")
                .departmentId(ops.getId()).departmentName(ops.getName())
                .hireDate(LocalDate.of(2017, 6, 14)).status("ACTIVE")
                .salary(92000.0).address("246 Townsend St, San Francisco, CA").dateOfBirth(LocalDate.of(1979, 7, 7)).build());

        Employee e9 = employeeRepo.save(Employee.builder()
                .firstName("Isabella").lastName("Taylor").email("isabella@company.com")
                .phone("+1-555-0109").position("Content Strategist")
                .departmentId(mkt.getId()).departmentName(mkt.getName())
                .hireDate(LocalDate.of(2022, 8, 15)).status("INACTIVE")
                .salary(65000.0).address("369 Spear St, San Francisco, CA").dateOfBirth(LocalDate.of(1994, 2, 11)).build());

        Employee e10 = employeeRepo.save(Employee.builder()
                .firstName("James").lastName("Anderson").email("james@company.com")
                .phone("+1-555-0110").position("Junior Developer")
                .departmentId(eng.getId()).departmentName(eng.getName())
                .hireDate(LocalDate.of(2024, 1, 15)).status("ACTIVE")
                .salary(62000.0).address("741 Main St, San Francisco, CA").dateOfBirth(LocalDate.of(1999, 5, 25)).build());

        // Seed leave requests
        leaveRepo.save(LeaveRequest.builder()
                .employeeId(e5.getId()).employeeName(e5.getFullName())
                .leaveType("SICK").startDate(LocalDate.now().minusDays(5))
                .endDate(LocalDate.now().plusDays(2))
                .reason("Medical treatment and recovery").status("APPROVED")
                .createdAt(LocalDateTime.now().minusDays(7)).updatedAt(LocalDateTime.now().minusDays(5))
                .reviewedBy("Carol Davis").reviewNotes("Approved - medical documentation provided")
                .build());

        leaveRepo.save(LeaveRequest.builder()
                .employeeId(e1.getId()).employeeName(e1.getFullName())
                .leaveType("ANNUAL").startDate(LocalDate.now().plusDays(10))
                .endDate(LocalDate.now().plusDays(17))
                .reason("Family vacation").status("PENDING")
                .createdAt(LocalDateTime.now().minusDays(2)).updatedAt(LocalDateTime.now().minusDays(2))
                .build());

        leaveRepo.save(LeaveRequest.builder()
                .employeeId(e3.getId()).employeeName(e3.getFullName())
                .leaveType("ANNUAL").startDate(LocalDate.now().plusDays(5))
                .endDate(LocalDate.now().plusDays(8))
                .reason("Personal matter").status("PENDING")
                .createdAt(LocalDateTime.now().minusDays(1)).updatedAt(LocalDateTime.now().minusDays(1))
                .build());

        leaveRepo.save(LeaveRequest.builder()
                .employeeId(e7.getId()).employeeName(e7.getFullName())
                .leaveType("SICK").startDate(LocalDate.now().minusDays(1))
                .endDate(LocalDate.now())
                .reason("Feeling unwell").status("APPROVED")
                .createdAt(LocalDateTime.now().minusDays(1)).updatedAt(LocalDateTime.now())
                .reviewedBy("admin").reviewNotes("Approved")
                .build());

        leaveRepo.save(LeaveRequest.builder()
                .employeeId(e6.getId()).employeeName(e6.getFullName())
                .leaveType("ANNUAL").startDate(LocalDate.now().minusDays(30))
                .endDate(LocalDate.now().minusDays(25))
                .reason("Holiday trip").status("REJECTED")
                .createdAt(LocalDateTime.now().minusDays(35)).updatedAt(LocalDateTime.now().minusDays(30))
                .reviewedBy("admin").reviewNotes("Rejected - peak season, rescheduling required")
                .build());

        // Demo login accounts for all roles
        userRepo.save(User.builder()
                .username("alice")
                .email("alice@company.com")
                .password(passwordEncoder.encode("employee123"))
                .role("EMPLOYEE")
                .build());

        userRepo.save(User.builder()
                .username("customer")
                .email("customer@example.com")
                .password(passwordEncoder.encode("customer123"))
                .role("CUSTOMER")
                .build());

        // Sample support tickets
        ticketRepo.save(Ticket.builder()
                .customerUsername("customer")
                .customerEmail("customer@example.com")
                .subject("Payroll inquiry")
                .description("I need clarification on my last invoice payment schedule.")
                .departmentId(fin.getId()).departmentName(fin.getName())
                .status("PENDING")
                .createdAt(LocalDateTime.now().minusDays(2))
                .updatedAt(LocalDateTime.now().minusDays(2))
                .build());

        ticketRepo.save(Ticket.builder()
                .customerUsername("customer")
                .customerEmail("customer@example.com")
                .subject("Access request for portal")
                .description("Unable to view my previous support history after password reset.")
                .departmentId(eng.getId()).departmentName(eng.getName())
                .status("PENDING")
                .createdAt(LocalDateTime.now().minusHours(6))
                .updatedAt(LocalDateTime.now().minusHours(6))
                .build());

        ticketRepo.save(Ticket.builder()
                .customerUsername("customer")
                .customerEmail("customer@example.com")
                .subject("Billing address update")
                .description("Please update my billing address on file.")
                .departmentId(ops.getId()).departmentName(ops.getName())
                .status("RESOLVED")
                .createdAt(LocalDateTime.now().minusDays(5))
                .updatedAt(LocalDateTime.now().minusDays(1))
                .resolvedBy("admin")
                .resolutionNotes("Address updated successfully.")
                .build());
    }
}
