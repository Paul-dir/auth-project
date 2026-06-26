package com.example.authbackend.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketJpaRepository extends JpaRepository<TicketEntity, Long> {
    List<TicketEntity> findByCustomerUsernameOrderByCreatedAtDesc(String customerUsername);
    List<TicketEntity> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
