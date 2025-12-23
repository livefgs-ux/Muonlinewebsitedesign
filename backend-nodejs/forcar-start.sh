#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "  🚀 FORÇAR INÍCIO DO BACKEND - MeuMU Online"
echo "════════════════════════════════════════════════════════"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /home/meumu.com/public_html/backend-nodejs

# 1. Matar TUDO relacionado ao backend
echo -e "${YELLOW}1️⃣  Matando processos antigos...${NC}"
pm2 stop meumu-backend 2>/dev/null || true
pm2 delete meumu-backend 2>/dev/null || true
pkill -f "src/server.js" 2>/dev/null || true
pkill -f "node.*3001" 2>/dev/null || true
sleep 2
echo -e "${GREEN}✅ Processos mortos${NC}"
echo ""

# 2. Limpar logs PM2
echo -e "${YELLOW}2️⃣  Limpando logs PM2...${NC}"
pm2 flush
rm -f /root/.pm2/logs/meumu-backend*.log 2>/dev/null || true
echo -e "${GREEN}✅ Logs limpos${NC}"
echo ""

# 3. Verificar .env
echo -e "${YELLOW}3️⃣  Verificando .env...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ Arquivo .env NÃO EXISTE!${NC}"
    echo "Criando .env padrão..."
    
    cat > .env << 'EOF'
# DATABASE MU
DB_MU_HOST=127.0.0.1
DB_MU_PORT=3306
DB_MU_USER=usermu
DB_MU_PASSWORD=@mysql123@
DB_MU_NAME=muonline

# DATABASE WEB
DB_WEB_HOST=127.0.0.1
DB_WEB_PORT=3306
DB_WEB_USER=usermu
DB_WEB_PASSWORD=@mysql123@
DB_WEB_NAME=webmu

# SERVIDOR
PORT=3001
NODE_ENV=production

# JWT
JWT_SECRET=meumu_secret_2024_change_this
JWT_EXPIRES_IN=7d

# LIMITES
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:3001

# LOGS
LOG_LEVEL=info
EOF
    
    echo -e "${GREEN}✅ .env criado${NC}"
else
    echo -e "${GREEN}✅ .env existe${NC}"
fi

echo "Configuração:"
grep "^DB_MU_USER" .env
grep "^DB_WEB_USER" .env
grep "^PORT" .env | head -1
echo ""

# 4. Testar database
echo -e "${YELLOW}4️⃣  Testando database...${NC}"
timeout 3 node test-db-connection.js 2>&1 | grep -E "(Testando|Conectado|Erro|ERRO)" | head -10
echo ""

# 5. Testar servidor DIRETO (sem PM2)
echo -e "${YELLOW}5️⃣  Testando servidor direto (5 segundos)...${NC}"
echo "Rodando: timeout 5 node src/server.js"
echo ""

timeout 5 node src/server.js 2>&1 | head -30 &
SERVER_PID=$!

sleep 3

echo ""
echo -e "${YELLOW}6️⃣  Testando porta 3001...${NC}"

if curl -s http://127.0.0.1:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ SERVIDOR ONLINE!${NC}"
    echo ""
    echo "Response:"
    curl -s http://127.0.0.1:3001/health | python3 -m json.tool 2>/dev/null || curl -s http://127.0.0.1:3001/health
else
    echo -e "${RED}❌ Servidor NÃO respondeu${NC}"
    echo "Porta 3001 não está respondendo!"
fi

echo ""

# Matar teste
kill $SERVER_PID 2>/dev/null || true
sleep 1

# 7. Iniciar com PM2
echo -e "${YELLOW}7️⃣  Iniciando com PM2...${NC}"
pm2 start src/server.js --name meumu-backend --update-env --time

sleep 3

echo ""
echo -e "${YELLOW}8️⃣  Status PM2:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}9️⃣  Logs PM2 (últimas 10 linhas):${NC}"
pm2 logs meumu-backend --lines 10 --nostream

echo ""
echo -e "${YELLOW}🔟 Teste final da API:${NC}"
sleep 2

if curl -s http://127.0.0.1:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅✅✅ BACKEND FUNCIONANDO PERFEITAMENTE! ✅✅✅${NC}"
    echo ""
    echo "API Health:"
    curl -s http://127.0.0.1:3001/health | python3 -m json.tool 2>/dev/null || curl -s http://127.0.0.1:3001/health
    echo ""
    echo ""
    echo -e "${GREEN}API Instalador:${NC}"
    curl -s http://127.0.0.1:3001/api/install/check-requirements 2>&1 | head -20
else
    echo -e "${RED}❌❌❌ BACKEND NÃO ESTÁ FUNCIONANDO ❌❌❌${NC}"
    echo ""
    echo "Verifique os logs acima para encontrar o erro!"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}  ✅ PROCESSO COMPLETO!${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo "URLs para testar no navegador:"
echo "  - http://meumu.com:3001/health"
echo "  - http://meumu.com:3001/install"
echo "  - http://meumu.com:3001/api/install/check-requirements"
echo ""
