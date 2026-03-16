package com.company.ticketservice.model;

import java.time.Instant;
import java.util.UUID;

public class Ticket {

    private UUID id;
    private String title;
    private String description;

    // AI servisinden gelecek:
    private double urgencyScore; // 0.0 - 1.0
    private String tag;          // NORMAL / ACIL / KRITIK_ACIL

    private Instant createdAt;

    public Ticket() {}

    public Ticket(UUID id, String title, String description, double urgencyScore, String tag, Instant createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.urgencyScore = urgencyScore;
        this.tag = tag;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public double getUrgencyScore() {
        return urgencyScore;
    }

    public String getTag() {
        return tag;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setUrgencyScore(double urgencyScore) {
        this.urgencyScore = urgencyScore;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}