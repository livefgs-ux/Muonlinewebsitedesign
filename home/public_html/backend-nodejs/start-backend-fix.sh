#!/bin/bash

echo "========================================================"
echo "  INICIANDO BACKEND - MeuMU Online"
echo "========================================================"

cd /home/meumu.com/public_html/backend-nodejs

# 1. Parar PM2
echo ""
echo "[1/5] Parando processos antigos..."
pm2 stop meumu-backend 2>/dev/null || true
pm2 delete meumu-backend 2>/dev/null || true
pkill -f "src/server.js" 2>/dev/null || true
sleep 2
echo "[OK] Processos parados"

# 2. Verificar .env
echo ""
echo "[2/5] Verificando .env..."
if [ ! -f .env ]; then
    echo "Criando .env..."
    cat > .env << 'EOF'
DB_MU_HOST=127.0.0.1
DB_MU_PORT=3306
DB_MU_USER=usermu
DB_MU_PASSWORD=@mysql123@
DB_MU_NAME=muonline

DB_WEB_HOST=127.0.0.1
DB_WEB_PORT=3306
DB_WEB_USER=usermu
DB_WEB_PASSWORD=@mysql123@
DB_WEB_NAME=webmu

PORT=3001
NODE_ENV=production
JWT_SECRET=meumu_secret_2024_change_this
JWT_EXPIRES_IN=7d

DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:3001
LOG_LEVEL=info
EOF
fi
echo "[OK] .env configurado"

# 3. Testar database
echo ""
echo "[3/5] Testando database..."
timeout 5 node test-db-connection.js 2>&1 | head -10
echo ""

# 4. Iniciar PM2
echo "[4/5] Iniciando backend com PM2..."
pm2 start src/server.js --name meumu-backend --update-env --time
sleep 3
echo "[OK] Backend iniciado"

# 5. Verificar
echo ""
echo "[5/5] Verificando status..."
pm2 status

echo ""
echo "Logs (ultimas 10 linhas):"
pm2 logs meumu-backend --lines 10 --nostream

echo ""
echo "Testando API..."
sleep 2

HEALTH_RESPONSE=$(curl -s http://127.0.0.1:3001/health 2>&1)
echo "$HEALTH_RESPONSE"

echo ""
echo "========================================================"
if echo "$HEALTH_RESPONSE" | grep -q "success"; then
    echo "  [OK] BACKEND FUNCIONANDO!"
else
    echo "  [ERRO] Backend nao esta respondendo!"
fi
echo "========================================================"
echo ""
echo "URLs para testar no navegador:"
echo "  - http://meumu.com:3001/health"
echo "  - http://meumu.com:3001/install"
echo ""
