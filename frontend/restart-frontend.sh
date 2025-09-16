#!/bin/sh
# Script para reiniciar o serviço do frontend

echo "[Frontend] Reiniciando container do frontend..."
docker-compose -f ../docker-compose.yml restart frontend
echo "✅ [Frontend] Serviço reiniciado."