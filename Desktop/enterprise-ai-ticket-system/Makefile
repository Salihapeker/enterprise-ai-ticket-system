.PHONY: help up down restart logs build clean test ticket-logs ai-logs

help:
    @echo "Enterprise AI Ticket System komutlar:"
    @echo "  make up            Tum servisleri ayaga kaldir"
    @echo "  make down          Servisleri durdur"
    @echo "  make logs          Tum loglari takip et"
    @echo "  make build         Image yeniden build"
    @echo "  make clean         Container, volume, image temizle"

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