all: network build up

network:
	docker network create intra || true

build:
	docker-compose -f ./backend/docker-compose.yml build

up:
	docker-compose -f ./backend/docker-compose.yml up -d

down:
	docker-compose -f ./backend/docker-compose.yml down

clean: down
	docker stop $$(docker ps -q); \
	docker image rmi -f $$(docker image ls -q); \
	docker volume rm $$(docker volume ls -q); \
	docker network rm intra || true; \
	docker builder prune -f

.PHONY: all network build up down clean