# Enterprise AI Ticket System

Telekom operatorleri icin AI destekli talep takip platformu.

## Mimari

Frontend (React+TS) -> ticket-service (Spring Boot) -> ai-service (FastAPI)

## Roadmap

- [x] Faz 0 - Altyapi (Actuator, exception handler, structured logging, resilience)
- [ ] Faz 1 - PostgreSQL + JPA + Flyway
- [ ] Faz 2 - JWT + RBAC
- [ ] Faz 3 - Gercek NLP (Turkce BERT + pgvector)
- [ ] Faz 4 - WebSocket
- [ ] Faz 5 - Frontend tamamlama
- [ ] Faz 6 - Docker + CI/CD
- [ ] Faz 7 - Test
- [ ] Faz 8 - Kafka, Elasticsearch

## Hizli baslangic
docker compose up -d
docker compose logs -f
Servisler:
- Frontend: http://localhost:5173
- Ticket API: http://localhost:8082
- AI API: http://localhost:8000
- Health: http://localhost:8082/actuator/health

## API ornegi
curl -X POST http://localhost:8082/tickets ^
-H "Content-Type: application/json" ^
-d "{"title":"Internet kesik","description":"Hic calismiyor acil!"}"