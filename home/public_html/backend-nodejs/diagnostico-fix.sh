#!/bin/bash

echo "========================================================"
echo "  DIAGNOSTICO BACKEND - MeuMU Online"
echo "========================================================"
echo ""

# 1. Verificar PM2
echo "[1/7] Status PM2:"
pm2 status | grep meumu-backend
echo ""

# 2. Verificar porta 3001
echo "[2/7] Porta 3001:"
if netstat -tlnp 2>/dev/null | grep -q ":3001"; then
    echo "[OK] Porta 3001 esta aberta"
    netstat -tlnp | grep ":3001"
else
    echo "[ERRO] Porta 3001 NAO esta aberta"
fi
echo ""

# 3. Testar API health
echo "[3/7] Testar API /health:"
curl -s http://127.0.0.1:3001/health 2>&1 | head -20
echo ""

# 4. Testar API instalador
echo "[4/7] Testar API /api/install/check-requirements:"
curl -s http://127.0.0.1:3001/api/install/check-requirements 2>&1 | head -20
echo ""

# 5. Ver logs PM2
echo "[5/7] Logs PM2 (ultimas 15 linhas):"
pm2 logs meumu-backend --lines 15 --nostream 2>&1 | tail -20
echo ""

# 6. Verificar .env
echo "[6/7] Configuracao .env:"
cd /home/meumu.com/public_html/backend-nodejs
if [ -f .env ]; then
    grep "^DB_MU_USER" .env || echo "DB_MU_USER nao encontrado"
    grep "^DB_WEB_USER" .env || echo "DB_WEB_USER nao encontrado"
    grep "^PORT" .env | head -1 || echo "PORT nao encontrado"
else
    echo "[ERRO] Arquivo .env NAO EXISTE"
fi
echo ""

# 7. Testar conexao database
echo "[7/7] Testar conexao database:"
cd /home/meumu.com/public_html/backend-nodejs
timeout 3 node test-db-connection.js 2>&1 | head -15
echo ""

echo "========================================================"
echo "  DIAGNOSTICO COMPLETO!"
echo "========================================================"
