#!/bin/sh
# Script principal para reiniciar todos os serviços do projeto
# Uso: ./restart.sh (sem rebuild) ou ./restart.sh --build (com rebuild)
# Parar na primeira falha com mensagens de erro clara

set -e

BUILD_FLAG=""
if [ "$1" = "--build" ]; then
  BUILD_FLAG="--build"
  echo "🔨 Modo rebuild ativado"
fi

echo ""
echo "--- Reiniciando Módulo Backend ---"
if ! ./backend/restart-backend.sh; then
  echo "❌ Falha ao reiniciar o backend. Abortando."
  exit 1
fi

echo ""
echo "--- Reiniciando Módulo Frontend ---"
if [ -n "$BUILD_FLAG" ]; then
  echo "[Frontend] Reconstruindo e reiniciando o container do frontend..."
  if ! docker-compose -f ./docker-compose.yml up -d $BUILD_FLAG frontend; then
    echo "❌ [Frontend] ERRO ao reconstruir e reiniciar o container do frontend"
    exit 1
  fi
  echo "✅ [Frontend] Serviço reconstruído e reiniciado com sucesso."
else
  if ! ./frontend/restart-frontend.sh; then
    echo "❌ Falha ao reiniciar o frontend. Abortando."
    exit 1
  fi
fi

echo ""
echo "🚀 Ambiente reiniciado com sucesso! Acompanhando logs (pressione Ctrl+C para sair):"
echo ""
docker-compose logs -f