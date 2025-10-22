#!/bin/sh
# Script para limpar imagens, containers e volumes desnecessários do Docker
# Libera espaço em disco removendo recursos não utilizados

set -e

echo "🧹 Iniciando limpeza do Docker..."
echo ""

echo "[1/4] Removendo containers parados..."
docker container prune -f
echo "✅ Containers parados removidos"

echo ""
echo "[2/4] Removendo imagens não utilizadas (sem nome)..."
docker image prune -f
echo "✅ Imagens não utilizadas removidas"

echo ""
echo "[3/4] Removendo imagens desnecessárias (incluindo imagens com nome)..."
docker image prune -a -f --filter "until=720h"
echo "✅ Imagens desnecessárias removidas"

echo ""
echo "[4/4] Limpeza geral do sistema Docker (containers, imagens, redes)..."
docker system prune -f
echo "✅ Limpeza geral concluída"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Limpeza concluída com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
docker system df
