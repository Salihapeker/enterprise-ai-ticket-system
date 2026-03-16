package com.company.ticketservice.model;

import java.time.Instant;
import java.util.UUID;

public record Ticket(
        UUID id,
        String title,
        String description,
        double urgencyScore,
        String tag,
        Instant createdAt
) {}