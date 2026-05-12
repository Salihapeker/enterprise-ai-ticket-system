# Enterprise AI Ticket System

Telekom operatörleri için tasarlanmış uçtan uca AI destekli talep takip platformu.

## Mimari

┌─────────────┐ ┌──────────────────┐ ┌────────────────┐
│ Frontend │ ────▶ │ ticket-service │ ────▶ │ ai-service │
│ React + TS │ │ Spring Boot 3 │ │ FastAPI │
└─────────────┘ └──────────────────┘ └────────────────┘
│ │
(Faz 1: Postgres) (Faz 3: HF models)

## Özellikler (roadmap)

- [x] **Faz 0** — Altyapı (Actuator, exception handler, structured logging, resilience)
- [ ] **Faz 1** — PostgreSQL + JPA + Flyway + pagination
- [ ] **Faz 2** — JWT + RBAC + Spring Security
- [ ] **Faz 3** — Gerçek NLP (Türkçe BERT + sentence embeddings + pgvector)
- [ ] **Faz 4** — WebSocket real-time updates
- [ ] **Faz 5** — Analytics dashboard, admin UI, ticket detay
- [ ] **Faz 6** — CI/CD + cloud deploy
- [ ] **Faz 7** — Kapsamlı test (JUnit, Testcontainers, Playwright)
- [ ] **Faz 8** — Kafka, Elasticsearch, observability stack

## Hızlı Başlangıç

```bash
cp .env.example .env
make up
make logs
```

Servisler:

- Frontend: http://localhost:5173
- Ticket API: http://localhost:8082
- AI API: http://localhost:8000
- Health: http://localhost:8082/actuator/health

## Geliştirme

Her servisi ayrı terminalde:

```bash
# Terminal 1 — AI service
cd services/ai-analysis-service
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Ticket service
cd services/ticket-service
./mvnw spring-boot:run

# Terminal 3 — Frontend
cd frontend
npm run dev
```

## API Örnekleri

Ticket oluştur:

```bash
curl -X POST http://localhost:8082/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"İnternet kesik","description":"Hiç çalışmıyor acil!"}'
```

## Teknolojiler

**Backend**

- Java 17 + Spring Boot 3.5
- Python 3.11 + FastAPI
- (Faz 1+) PostgreSQL, Flyway, JPA
- (Faz 2+) Spring Security, JWT
- (Faz 3+) Hugging Face Transformers, sentence-transformers, pgvector

**Frontend**

- React 19 + TypeScript + Vite
- TailwindCSS 4
- Chart.js + react-chartjs-2
- STOMP WebSocket client

**DevOps**

- Docker + Docker Compose
- (Faz 6+) GitHub Actions, Fly.io

## Dizin Yapısı

.
├── docker-compose.yml
├── Makefile
├── .env.example
├── frontend/
├── services/
│ ├── ticket-service/ # Spring Boot
│ └── ai-analysis-service/ # FastAPI
└── docs/ # Faz dokümanları
