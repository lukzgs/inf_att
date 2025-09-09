#!/bin/sh
# Script para parar todo o ambiente do projeto

echo "Parando todos os containers com Docker Compose..."
docker-compose down
