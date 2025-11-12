#!/bin/bash

# Script para reiniciar o backend após atualização do sistema de chamada automática

echo "🔄 Reiniciando backend com o novo sistema de chamada automática..."
echo ""

# Navegue até o diretório backend
cd "$(dirname "$0")/backend" || exit 1

echo "📦 Instalando dependências..."
npm install

echo "🔨 Compilando TypeScript..."
npm run build

echo "✅ Build concluído!"
echo ""
echo "🚀 Para iniciar o backend, execute um dos comandos:"
echo ""
echo "  Desenvolvimento (com auto-reload):"
echo "    npm run start:dev"
echo ""
echo "  Produção:"
echo "    npm run start:prod"
echo ""
echo "📝 O sistema de chamada automática está configurado para:"
echo "  ✅ 7h00 - Primeira chamada da manhã"
echo "  ✅ 13h30 - Segunda chamada da tarde"
echo "  ✅ 00h00 - Terceira chamada (meia-noite)"
echo ""
echo "🔍 Para monitorar, procure nos logs por: [AUTO-OPEN]"
echo ""
