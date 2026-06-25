package com.example.authbackend.application.port.in;

import com.example.authbackend.application.dto.TicketRequest;
import com.example.authbackend.application.dto.TicketResponse;
import java.util.List;

public interface TicketUseCase {
    TicketResponse createTicket(TicketRequest request, String customerUsername);
    List<TicketResponse> getTicketsByCustomer(String customerUsername);
    List<TicketResponse> getAllTickets();
    TicketResponse resolveTicket(Long ticketId, String resolutionNotes, String adminUsername);
}
