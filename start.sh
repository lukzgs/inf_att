#!/bin/sh
# Script para iniciar todo o ambiente do projeto de gestão de presença com feedback de status

set -e

echo "[1/3] Instalando dependências do backend..."
(cd backend && npm install)

echo "[2/3] Instalando dependências do frontend..."
(cd frontend && npm install)

echo "[3/3] Iniciando containers com Docker Compose em modo detached..."
docker-compose up --build -d

# --- Verificação de Status ---

echo "\nAguardando o banco de dados (PostgreSQL) ficar pronto..."
timeout 60s sh -c '
  until docker-compose logs db 2>&1 | grep "database system is ready to accept connections"; do
    echo -n "."
    sleep 2
  done
'

if [ $? -ne 0 ]; then
  echo "\n[ERRO] O banco de dados não iniciou a tempo. Verifique os logs:"
  docker-compose logs db
  exit 1
fi
echo "\n✅ Banco de dados está online!"


echo "\nAguardando o backend (NestJS) ficar pronto..."
timeout 60s sh -c '
  until curl -s -f http://localhost:3000/health > /dev/null; do
    echo -n "."
    sleep 2
  done
'

if [ $? -ne 0 ]; then
  echo "\n[ERRO] O backend não respondeu a tempo. Verifique os logs:"
  docker-compose logs backend
  exit 1
fi
echo "\n✅ Backend está online e respondendo em http://localhost:3000/health"


echo "\n🚀 Ambiente pronto para uso!"
echo "--------------------------------------------------"
echo "Frontend acessível em: http://localhost:8080"
echo "Backend API acessível em: http://localhost:3000"
echo "--------------------------------------------------"
echo "\nMostrando logs em tempo real (pressione Ctrl+C para sair):"

# Anexa aos logs para visualização em tempo real
docker-compose logs -f
