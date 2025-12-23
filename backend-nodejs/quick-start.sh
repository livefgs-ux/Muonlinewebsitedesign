#!/bin/bash

echo "========================================================"
echo "  QUICK START - MeuMU Online Backend"
echo "========================================================"
echo ""

cd /home/meumu.com/public_html/backend-nodejs

# 1. Parar PM2
echo "[1/4] Parando processos antigos..."
pm2 stop meumu-backend 2>/dev/null || true
pm2 delete meumu-backend 2>/dev/null || true
pkill -f "src/server.js" 2>/dev/null || true
sleep 2
echo "[OK]"
echo ""

# 2. Verificar dependencias
echo "[2/4] Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    echo "[ERRO] node_modules nao existe!"
    echo ""
    echo "Execute primeiro:"
    echo "  ./instalar-dependencias.sh"
    echo ""
    exit 1
fi
echo "[OK] node_modules existe"
echo ""

# 3. Verificar .env
echo "[3/4] Verificando .env..."
if [ ! -f .env ]; then
    echo "[AVISO] .env nao existe - backend vai funcionar em modo instalacao"
fi
echo ""

# 4. Iniciar PM2
echo "[4/4] Iniciando backend com PM2..."
pm2 start src/server.js --name meumu-backend --update-env --time
sleep 3
echo ""

# Status
echo "========================================================"
echo "  STATUS"
echo "========================================================"
pm2 status
echo ""

echo "Logs (ultimas 5 linhas):"
pm2 logs meumu-backend --lines 5 --nostream 2>/dev/null
echo ""

# Testar API
echo "Testando API..."
sleep 2
HEALTH_RESPONSE=$(curl -s http://127.0.0.1:3001/health 2>&1)

if echo "$HEALTH_RESPONSE" | grep -q "success"; then
    echo ""
    echo "========================================================"
    echo "  [OK] BACKEND FUNCIONANDO!"
    echo "========================================================"
    echo ""
    echo "Teste no navegador:"
    echo "  http://meumu.com:3001/health"
    echo "  http://meumu.com:3001/install"
    echo ""
else
    echo ""
    echo "========================================================"
    echo "  [ERRO] Backend nao esta respondendo!"
    echo "========================================================"
    echo ""
    echo "Ver logs completos:"
    echo "  pm2 logs meumu-backend"
    echo ""
fi
