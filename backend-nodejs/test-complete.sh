#!/bin/bash

echo "========================================================"
echo "  TESTE COMPLETO - Backend + Instalador"
echo "========================================================"
echo ""

cd /home/meumu.com/public_html/backend-nodejs

# 1. Reiniciar backend
echo "[1/4] Reiniciando backend..."
pm2 restart meumu-backend 2>/dev/null || pm2 start src/server.js --name meumu-backend --update-env
sleep 3

# 2. Testar API
echo ""
echo "[2/4] Testando API..."
API_RESPONSE=$(curl -s http://127.0.0.1:3001/health 2>&1)
echo "$API_RESPONSE"

if echo "$API_RESPONSE" | grep -q "success"; then
    echo "[OK] API funcionando!"
else
    echo "[ERRO] API nao esta respondendo JSON!"
fi

# 3. Testar instalador
echo ""
echo "[3/4] Testando endpoint do instalador..."
INSTALL_RESPONSE=$(curl -s -X POST http://127.0.0.1:3001/api/install/check-requirements 2>&1)
echo "$INSTALL_RESPONSE" | head -30

if echo "$INSTALL_RESPONSE" | grep -q "success"; then
    echo "[OK] Instalador API funcionando!"
else
    echo "[ERRO] Instalador API com problema!"
fi

# 4. Status final
echo ""
echo "[4/4] Status PM2:"
pm2 status | grep meumu-backend

echo ""
echo "========================================================"
echo "  TESTE URLs no navegador:"
echo "========================================================"
echo ""
echo "  1. Backend Health:"
echo "     http://meumu.com:3001/health"
echo ""
echo "  2. Instalador:"
echo "     http://meumu.com:3001/install"
echo ""
echo "  3. Instalador via OpenLiteSpeed (porta 80):"
echo "     http://meumu.com/install"
echo ""
echo "========================================================"
