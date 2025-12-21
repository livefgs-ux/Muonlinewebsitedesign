#!/bin/bash

# MeuMU Online - Fix MIME Error (Quick)
# Solução rápida em 1 comando

echo "🚀 MeuMU Online - Corrigindo erro MIME Type..."
echo ""

# Build React
echo "📦 Instalando dependências..."
npm install || exit 1

echo ""
echo "🔨 Buildando React..."
npm run build || exit 1

echo ""
echo "✅ Build concluído!"
echo ""
echo "📝 Próximo passo:"
echo ""
echo "Configure o Apache para servir da pasta /dist:"
echo ""
echo "sudo nano /etc/apache2/sites-available/meumu.conf"
echo ""
echo "E mude DocumentRoot para:"
echo "DocumentRoot $(pwd)/dist"
echo ""
echo "Depois reinicie:"
echo "sudo systemctl restart apache2"
echo ""
