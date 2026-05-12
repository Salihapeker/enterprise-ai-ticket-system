package com.company.ticketservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

// @Entity → Hibernate bu sınıfı veritabanı tablosuna eşler
// @Table  → hangi tablo adının kullanılacağını söyler
@Entity
@Table(name = "tickets")
public class Ticket {

    // @Id        → birincil anahtar (primary key)
    // @GeneratedValue(UUID) → UUID'yi PostgreSQL gen_random_uuid() ile üretir
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 4000)
    private String description;

    // urgency_score → snake_case sütun adı, Java'da camelCase alan
    @Column(name = "urgency_score", nullable = false)
    private double urgencyScore;

    @Column(nullable = false, length = 20)
    private String tag;

    // updatable = false → bir kez yazılır, sonradan değiştirilemez
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // JPA her zaman boş constructor ister (reflection ile nesne üretir)
    public Ticket() {}

    public Ticket(String title, String description, double urgencyScore, String tag, Instant createdAt) {
        this.title = title;
        this.description = description;
        this.urgencyScore = urgencyScore;
        this.tag = tag;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public double getUrgencyScore() { return urgencyScore; }
    public String getTag() { return tag; }
    public Instant getCreatedAt() { return createdAt; }

    public void setId(UUID id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setUrgencyScore(double urgencyScore) { this.urgencyScore = urgencyScore; }
    public void setTag(String tag) { this.tag = tag; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
