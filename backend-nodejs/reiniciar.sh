#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "  REINICIANDO BACKEND - MeuMU Online"
echo "════════════════════════════════════════════════════════"
echo ""

cd /home/meumu.com/public_html/backend-nodejs

# Parar
echo "[1/3] Parando backend..."
pm2 stop meumu-backend 2>/dev/null || true
pm2 delete meumu-backend 2>/dev/null || true
sleep 2
echo "[OK]"
echo ""

# Iniciar
echo "[2/3] Iniciando backend..."
pm2 start src/server.js --name meumu-backend --update-env --time
sleep 3
echo ""

# Status
echo "[3/3] Verificando status..."
pm2 status
echo ""

# Logs
echo "Logs (últimas 5 linhas):"
pm2 logs meumu-backend --lines 5 --nostream 2>/dev/null
echo ""

echo "════════════════════════════════════════════════════════"
echo "  [OK] BACKEND REINICIADO!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Teste no navegador:"
echo "  http://meumu.com:3001/install"
echo ""
echo "Ver logs completos:"
echo "  pm2 logs meumu-backend"
echo ""
