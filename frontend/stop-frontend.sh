#!/bin/sh
# Script para parar o serviço do frontend

echo "[Frontend] Parando container do frontend..."
docker-compose -f ../docker-compose.yml stop frontend
