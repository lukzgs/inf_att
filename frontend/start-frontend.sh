#!/bin/sh
# Script para iniciar o serviço do frontend

set -e

echo "[Frontend] Iniciando container do frontend..."
docker-compose -f ../docker-compose.yml up --build -d frontend

