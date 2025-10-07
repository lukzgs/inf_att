#!/bin/bash

echo "🌱 Executando seed do banco de dados..."
docker compose exec backend npx prisma db seed
echo "✅ Seed concluído!"
