package com.company.ticketservice.api;

import com.company.ticketservice.model.CreateTicketRequest;
import com.company.ticketservice.model.Ticket;
import com.company.ticketservice.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

// Controller sadece HTTP'den sorumlu: istek al, service'e ilet, yanıt döndür
@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<Ticket> create(@Valid @RequestBody CreateTicketRequest req) {
        return ResponseEntity.ok(ticketService.create(req));
    }

    @GetMapping
    public List<Ticket> list() {
        return ticketService.listAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getOne(@PathVariable UUID id) {
        return ticketService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
