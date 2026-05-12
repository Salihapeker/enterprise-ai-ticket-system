.PHONY: help up down restart logs build clean test ticket-logs ai-logs frontend-dev

help:
	@echo "Enterprise AI Ticket System — komutlar:"
	@echo "  make up            Tüm servisleri ayağa kaldır"
	@echo "  make down          Servisleri durdur"
	@echo "  make restart       Yeniden başlat"
	@echo "  make logs          Tüm logları takip et"
	@echo "  make ticket-logs   Sadece ticket-service logları"
	@echo "  make ai-logs       Sadece ai-service logları"
	@echo "  make build         Image'leri yeniden build et"
	@echo "  make clean         Container, volume, image temizle"
	@echo "  make test          Tüm testleri çalıştır"
	@echo "  make frontend-dev  Frontend dev server"

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

ticket-logs:
	docker compose logs -f ticket-service

ai-logs:
	docker compose logs -f ai-service

build:
	docker compose build --no-cache

clean:
	docker compose down -v --rmi local

test:
	cd services/ticket-service && ./mvnw test
	cd services/ai-analysis-service && python -m pytest

frontend-dev:
	cd frontend && npm run dev