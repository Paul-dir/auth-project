package com.example.authbackend.infrastructure.adapter.out.persistence;

import com.example.authbackend.application.port.out.TicketRepositoryPort;
import com.example.authbackend.domain.model.Ticket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class TicketPersistenceAdapter implements TicketRepositoryPort {

    private final TicketJpaRepository jpaRepository;

    @Autowired
    public TicketPersistenceAdapter(TicketJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Ticket save(Ticket ticket) {
        TicketEntity entity = new TicketEntity();
        entity.setId(ticket.getId());
        entity.setCustomerUsername(ticket.getCustomerUsername());
        entity.setCustomerEmail(ticket.getCustomerEmail());
        entity.setSubject(ticket.getSubject());
        entity.setDescription(ticket.getDescription());
        entity.setDepartmentId(ticket.getDepartmentId());
        entity.setDepartmentName(ticket.getDepartmentName());
        entity.setStatus(ticket.getStatus());
        entity.setCreatedAt(ticket.getCreatedAt());
        entity.setUpdatedAt(ticket.getUpdatedAt());
        entity.setResolvedBy(ticket.getResolvedBy());
        entity.setResolutionNotes(ticket.getResolutionNotes());

        TicketEntity saved = jpaRepository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<Ticket> findById(Long id) {
        return jpaRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Ticket> findByCustomerUsername(String customerUsername) {
        return jpaRepository.findByCustomerUsernameOrderByCreatedAtDesc(customerUsername).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Ticket> findAll() {
        return jpaRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    private Ticket mapToDomain(TicketEntity entity) {
        return Ticket.builder()
                .id(entity.getId())
                .customerUsername(entity.getCustomerUsername())
                .customerEmail(entity.getCustomerEmail())
                .subject(entity.getSubject())
                .description(entity.getDescription())
                .departmentId(entity.getDepartmentId())
                .departmentName(entity.getDepartmentName())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .resolvedBy(entity.getResolvedBy())
                .resolutionNotes(entity.getResolutionNotes())
                .build();
    }
}
