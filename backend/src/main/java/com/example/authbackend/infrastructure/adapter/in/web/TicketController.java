package com.example.authbackend.infrastructure.adapter.in.web;

import com.example.authbackend.application.dto.ResolveTicketRequest;
import com.example.authbackend.application.dto.TicketRequest;
import com.example.authbackend.application.dto.TicketResponse;
import com.example.authbackend.application.port.in.TicketUseCase;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketUseCase ticketUseCase;

    @Autowired
    public TicketController(TicketUseCase ticketUseCase) {
        this.ticketUseCase = ticketUseCase;
    }

    @PostMapping
    public ResponseEntity<TicketResponse> create(@Valid @RequestBody TicketRequest request, Principal principal) {
        TicketResponse created = ticketUseCase.createTicket(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/customer")
    public ResponseEntity<List<TicketResponse>> getCustomerTickets(Principal principal) {
        List<TicketResponse> tickets = ticketUseCase.getTicketsByCustomer(principal.getName());
        return ResponseEntity.ok(tickets);
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAll() {
        List<TicketResponse> tickets = ticketUseCase.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<TicketResponse> resolve(@PathVariable Long id,
                                                   @Valid @RequestBody ResolveTicketRequest request,
                                                   Principal principal) {
        TicketResponse resolved = ticketUseCase.resolveTicket(id, request.getResolutionNotes(), principal.getName());
        return ResponseEntity.ok(resolved);
    }
}
