#!/bin/bash
set -e

echo "════════════════════════════════════════════════════════════════"
echo "  BUILDANDO FRONTEND CORRIGIDO - MeuMU Online"
echo "════════════════════════════════════════════════════════════════"
echo ""

cd /home/meumu.com/public_html

echo "[1/7] Baixando package.json corrigido do Figma Make..."
echo "      (React adicionado às dependencies)"
echo ""

echo "[2/7] Limpando instalação anterior..."
rm -rf node_modules package-lock.json
echo "✅ Limpo"
echo ""

echo "[3/7] Instalando dependências (incluindo React)..."
npm install --legacy-peer-deps
echo "✅ Dependências instaladas"
echo ""

echo "[4/7] Buildando frontend React..."
npm run build
echo "✅ Frontend buildado"
echo ""

echo "[5/7] Copiando dist para backend..."
rm -rf backend-nodejs/dist
cp -r dist backend-nodejs/
echo "✅ Dist copiado"
echo ""

echo "[6/7] Finalizando instalação..."
rm -rf backend-nodejs/install
cd backend-nodejs

# Configurar .env
grep -q "INSTALLATION_COMPLETE=true" .env 2>/dev/null || echo "INSTALLATION_COMPLETE=true" >> .env
grep -q "ALLOWED_ORIGINS" .env 2>/dev/null || echo "ALLOWED_ORIGINS=http://meumu.com:3001,http://meumu.com,https://meumu.com" >> .env

echo "✅ .env configurado"
echo ""

echo "[7/7] Reiniciando backend com PM2..."
pm2 delete meumu-backend 2>/dev/null || true
pm2 start src/server.js --name meumu-backend --update-env
pm2 save
sleep 2

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ✅ INSTALAÇÃO COMPLETA!"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Mostrar status
pm2 status

echo ""
echo "🌐 ACESSE AGORA: http://meumu.com:3001"
echo ""
echo "📋 Comandos úteis:"
echo "   pm2 logs meumu-backend    # Ver logs"
echo "   pm2 restart meumu-backend # Reiniciar"
echo "   pm2 stop meumu-backend    # Parar"
echo ""
echo "════════════════════════════════════════════════════════════════"
