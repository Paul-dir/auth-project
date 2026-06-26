package com.example.authbackend.application.port.out;

import com.example.authbackend.domain.model.Ticket;
import java.util.List;
import java.util.Optional;

public interface TicketRepositoryPort {
    Ticket save(Ticket ticket);
    Optional<Ticket> findById(Long id);
    List<Ticket> findByCustomerUsername(String customerUsername);
    List<Ticket> findAll();
    long countByStatus(String status);
}
