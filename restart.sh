#!/bin/sh
# Script principal para reiniciar todos os serviços do projeto

set -e

echo "--- Reiniciando Módulo Backend ---"
./backend/restart-backend.sh

echo "\n--- Reiniciando Módulo Frontend ---"
./frontend/restart-frontend.sh

echo "\n🚀 Ambiente reiniciado! Acompanhando logs (pressione Ctrl+C para sair):"
docker-compose logs -f