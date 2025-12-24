#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "  BUILDANDO E INSTALANDO SITE - MeuMU Online"
echo "════════════════════════════════════════════════════════════════"
echo ""

cd /home/meumu.com/public_html

echo "[1/6] Instalando dependências do frontend..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências!"
    exit 1
fi
echo "✅ Dependências instaladas"
echo ""

echo "[2/6] Buildando frontend React..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao buildar!"
    exit 1
fi
echo "✅ Frontend buildado"
echo ""

echo "[3/6] Copiando dist para backend..."
rm -rf backend-nodejs/dist
cp -r dist backend-nodejs/

if [ ! -d "backend-nodejs/dist" ]; then
    echo "❌ Erro: dist não copiado!"
    exit 1
fi
echo "✅ Dist copiado"
echo ""

echo "[4/6] Removendo instalador web..."
rm -rf backend-nodejs/install
echo "✅ Instalador removido"
echo ""

echo "[5/6] Configurando .env..."
cd backend-nodejs

# Backup do .env atual
if [ -f .env ]; then
    cp .env .env.backup
    echo "✅ Backup do .env criado"
fi

# Atualizar .env
if ! grep -q "INSTALLATION_COMPLETE=true" .env 2>/dev/null; then
    echo "INSTALLATION_COMPLETE=true" >> .env
fi

if ! grep -q "ALLOWED_ORIGINS" .env 2>/dev/null; then
    echo "ALLOWED_ORIGINS=http://meumu.com:3001,http://meumu.com,https://meumu.com" >> .env
fi

echo "✅ .env configurado"
echo ""

echo "[6/6] Iniciando backend com PM2..."
pm2 delete meumu-backend 2>/dev/null || true
pm2 start src/server.js --name meumu-backend
pm2 save
sleep 2
pm2 status

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ✅ INSTALAÇÃO COMPLETA!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🌐 ACESSE AGORA: http://meumu.com:3001"
echo ""
echo "📋 Comandos úteis:"
echo "  Ver logs:    pm2 logs meumu-backend"
echo "  Reiniciar:   pm2 restart meumu-backend"
echo "  Status:      pm2 status"
echo ""
echo "════════════════════════════════════════════════════════════════"
