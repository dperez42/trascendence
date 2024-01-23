NAME = ft_transcedence

VOLUM_LS = $(shell docker volume ls -q)

all: clean build

build:
	@docker-compose up --build

run:
	@docker-compose up -d --build

up:
	@docker-compose up

stop:
	@docker-compose down
	@echo "*** Containers Stoped ***"

stop-service:
	@./stop-service.sh

clean:  stop
	@docker system prune -af
	@echo "*** Containers and images erased ***"
	@docker network prune -f
	@echo "*** Networks erased ***"
	@echo "***************************************************************************"
	@echo "*  REMEMBER THAT I DON'T DELETE ANY VOLUMES, TYPE "make fclean" TO DO IT  *"
	@echo "***************************************************************************"

fclean: clean
ifneq "$(VOLUM_LS)" ""
	@docker volume rm $(VOLUM_LS)
	@echo "*** Volumes erased ***"
else
	@echo "*** No volumes to delete ***"
endif

info:
	@echo "*** CONTAINERS LIST ***" && docker ps -a
	@echo "*** IMAGES LIST ***" && docker images 
	@echo "*** NETWORKS LIST ***" && docker network ls 
	@echo "*** VOLUMES LIST ***" && docker volume ls

backend: 
	@cd ./backend && docker build -t backend . && \
	docker exec -it backend /bin/bash

frontend:	
	@cd ./frontend && docker build -t frontend . && \
	docker exec -it frontend /bin/bash

database: 
	@cd ./database && docker build -t database . && \
	docker exec -it database /bin/bash

pgadmin: 
	@cd ./pgadmin && docker build -t pgadmin . && \
	docker exec -it pgadmin /bin/bash

help:
	@echo "THIS IS THE LIST OF AVAILABLE OPTIONS FOR MAKE"
	@echo "'all' ---------> to clean, not including volumes and launch ft_transcendence"
	@echo "'build' -------> to launch ft_transcendence"
	@echo "'stop' --------> to stop all the containers"
	@echo "'clean' -------> to erase all the containers and networks"
	@echo "'fclean' ------> to erase all the containers, networks and volumes"
	@echo "'info' --------> to get info about images and containers"
	@echo "'backend' -----> to launch bash in backend container only"
	@echo "'frontend' ----> to launch bash in frontend container only"

.PHONY: all run build stop clean fclean info backend frontend database pgadmin help
