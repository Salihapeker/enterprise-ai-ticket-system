package com.company.ticketservice.repository;

import com.company.ticketservice.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

// JpaRepository<Ticket, UUID> → Spring bu interface'i otomatik implement eder.
// Ücretsiz gelen metodlar: save(), findById(), findAll(), deleteById(), count()...
public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    // "findBy" + alan adı → Spring, SQL'i otomatik üretir:
    // SELECT * FROM tickets ORDER BY created_at DESC
    List<Ticket> findAllByOrderByCreatedAtDesc();
}
