#!/bin/bash

echo "Los siguientes servicios están ejecutándose:"
services=$(docker-compose ps --services | grep -v 'Name')
IFS=$'\n'; set -f
select service in $services; do
    if [ -n "$service" ]; then
        docker-compose stop $service
        break
    else
        echo "Selección inválida. Por favor, elige un número de la lista."
    fi
done
unset IFS; set +f