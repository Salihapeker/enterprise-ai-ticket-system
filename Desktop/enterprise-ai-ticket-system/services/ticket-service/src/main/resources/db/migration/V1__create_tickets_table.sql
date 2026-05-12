-- Faz 1 — tickets tablosu
-- Flyway bu dosyayı bir kez çalıştırır ve flyway_schema_history tablosuna kaydeder.
-- Bir kez deploy olduktan sonra bu dosyayı DEĞİŞTİRMEYİN; yeni değişiklikler V2__.sql olarak eklenir.

CREATE TABLE tickets (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(120)  NOT NULL,
    description   VARCHAR(4000) NOT NULL,
    urgency_score FLOAT8        NOT NULL DEFAULT 0.0,
    tag           VARCHAR(20)   NOT NULL DEFAULT 'NORMAL',
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Listeleme sorgusu her zaman created_at DESC döner, index bunu hızlandırır
CREATE INDEX idx_tickets_created_at ON tickets (created_at DESC);
