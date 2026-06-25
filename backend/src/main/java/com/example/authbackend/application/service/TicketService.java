package com.example.authbackend.application.service;

import com.example.authbackend.application.dto.TicketRequest;
import com.example.authbackend.application.dto.TicketResponse;
import com.example.authbackend.application.port.in.TicketUseCase;
import com.example.authbackend.application.port.out.DepartmentRepositoryPort;
import com.example.authbackend.application.port.out.TicketRepositoryPort;
import com.example.authbackend.application.port.out.UserRepositoryPort;
import com.example.authbackend.domain.exception.ResourceNotFoundException;
import com.example.authbackend.domain.model.Department;
import com.example.authbackend.domain.model.Ticket;
import com.example.authbackend.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService implements TicketUseCase {

    private final TicketRepositoryPort ticketRepository;
    private final DepartmentRepositoryPort departmentRepository;
    private final UserRepositoryPort userRepository;

    @Autowired
    public TicketService(TicketRepositoryPort ticketRepository,
                         DepartmentRepositoryPort departmentRepository,
                         UserRepositoryPort userRepository) {
        this.ticketRepository = ticketRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TicketResponse createTicket(TicketRequest request, String customerUsername) {
        User user = userRepository.findByUsername(customerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Customer account not found"));

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Ticket ticket = Ticket.builder()
                .customerUsername(user.getUsername())
                .customerEmail(user.getEmail())
                .subject(request.getSubject())
                .description(request.getDescription())
                .departmentId(dept.getId())
                .departmentName(dept.getName())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Ticket saved = ticketRepository.save(ticket);
        return TicketResponse.from(saved);
    }

    @Override
    public List<TicketResponse> getTicketsByCustomer(String customerUsername) {
        return ticketRepository.findByCustomerUsername(customerUsername).stream()
                .map(TicketResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(TicketResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public TicketResponse resolveTicket(Long ticketId, String resolutionNotes, String adminUsername) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        ticket.setStatus("RESOLVED");
        ticket.setResolvedBy(adminUsername);
        ticket.setResolutionNotes(resolutionNotes);
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);
        return TicketResponse.from(saved);
    }
}
