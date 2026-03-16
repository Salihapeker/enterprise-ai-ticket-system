package com.company.ticketservice.api;

import com.company.ticketservice.ai.AiAnalyzeResponse;
import com.company.ticketservice.ai.AiClient;
import com.company.ticketservice.model.CreateTicketRequest;
import com.company.ticketservice.model.Ticket;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = "http://localhost:5173") // frontend vite port
public class TicketController {

    private final AiClient aiClient;
    private final Map<UUID, Ticket> store = new ConcurrentHashMap<>();

    public TicketController(AiClient aiClient) {
        this.aiClient = aiClient;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @PostMapping
    public ResponseEntity<Ticket> create(@Valid @RequestBody CreateTicketRequest req) {
        // AI servisine description gönderiyoruz
        AiAnalyzeResponse ai = aiClient.analyze(req.description());

        UUID id = UUID.randomUUID();
        Ticket t = new Ticket(
                id,
                req.title(),
                req.description(),
                ai.urgencyScore(),
                ai.tag(),
                Instant.now()
        );
        store.put(id, t);

        return ResponseEntity.ok(t);
    }

    @GetMapping
    public List<Ticket> list() {
        return store.values().stream()
                .sorted(Comparator.comparing(Ticket::createdAt).reversed())
                .toList();
    }
}