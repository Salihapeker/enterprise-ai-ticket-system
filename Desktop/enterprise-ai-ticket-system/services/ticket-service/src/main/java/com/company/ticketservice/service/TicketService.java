package com.company.ticketservice.service;

import com.company.ticketservice.ai.AiAnalyzeResponse;
import com.company.ticketservice.ai.AiClient;
import com.company.ticketservice.model.CreateTicketRequest;
import com.company.ticketservice.model.Ticket;
import com.company.ticketservice.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

// @Service → Spring bu sınıfı bir bean olarak yönetir, Controller inject edebilir
@Service
public class TicketService {

    private static final Logger log = LoggerFactory.getLogger(TicketService.class);

    private final AiClient aiClient;
    private final TicketRepository ticketRepository;

    // Constructor injection → test yazarken mock vermek kolaylaşır
    public TicketService(AiClient aiClient, TicketRepository ticketRepository) {
        this.aiClient = aiClient;
        this.ticketRepository = ticketRepository;
    }

    // @Transactional → hata olursa veritabanı değişikliği geri alınır (rollback)
    @Transactional
    public Ticket create(CreateTicketRequest req) {
        AiAnalyzeResponse ai = aiClient.analyze(req.getDescription());

        Ticket ticket = new Ticket(
                req.getTitle(),
                req.getDescription(),
                ai.getUrgencyScore(),
                ai.getTag(),
                Instant.now()
        );

        Ticket saved = ticketRepository.save(ticket);
        log.info("Created ticket id={} tag={} urgency={}", saved.getId(), saved.getTag(), saved.getUrgencyScore());
        return saved;
    }

    // @Transactional(readOnly = true) → sadece okuma, Hibernate optimizasyon yapar
    @Transactional(readOnly = true)
    public List<Ticket> listAll() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public Optional<Ticket> findById(UUID id) {
        return ticketRepository.findById(id);
    }
}
