#!/bin/sh
# Script para reiniciar o serviço do frontend (sem rebuild por padrão)
# Parar na primeira falha com mensagens de erro clara

set -e

echo "[Frontend] Reiniciando o container do frontend (sem rebuild)..."

if ! docker-compose -f ../docker-compose.yml restart frontend; then
  echo "❌ [Frontend] ERRO ao reiniciar serviço do frontend"
  exit 1
fi

echo "✅ [Frontend] Serviço reiniciado com sucesso."