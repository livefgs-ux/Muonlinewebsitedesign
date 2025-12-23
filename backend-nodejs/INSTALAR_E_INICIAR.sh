#!/bin/bash

echo "========================================================"
echo "  INSTALACAO COMPLETA - MeuMU Online Backend"
echo "========================================================"
echo ""

cd /home/meumu.com/public_html/backend-nodejs

# Passo 1: Instalar dependencias
echo "PASSO 1/2: Instalando dependencias npm..."
echo "========================================================"
echo ""

rm -rf node_modules package-lock.json
npm install --production

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERRO] Falha ao instalar dependencias!"
    exit 1
fi

echo ""
echo "[OK] Dependencias instaladas!"
echo ""

# Passo 2: Iniciar backend
echo "PASSO 2/2: Iniciando backend..."
echo "========================================================"
echo ""

pm2 stop meumu-backend 2>/dev/null || true
pm2 delete meumu-backend 2>/dev/null || true
sleep 2

pm2 start src/server.js --name meumu-backend --update-env --time
sleep 3

echo ""
pm2 status
echo ""

# Testar
echo "Testando API..."
sleep 2

curl -s http://127.0.0.1:3001/health
echo ""
echo ""

curl -s -X POST http://127.0.0.1:3001/api/install/check-requirements | head -20
echo ""
echo ""

echo "========================================================"
echo "  INSTALACAO CONCLUIDA!"
echo "========================================================"
echo ""
echo "Teste no navegador:"
echo "  http://meumu.com:3001/install"
echo ""
echo "Ver logs:"
echo "  pm2 logs meumu-backend"
echo ""
