#!/bin/sh
# Script para reiniciar o serviço do frontend

echo "[Frontend] Reconstruindo e reiniciando o container do frontend..."
docker-compose -f ../docker-compose.yml up -d --build frontend
echo "✅ [Frontend] Serviço reconstruído e reiniciado."