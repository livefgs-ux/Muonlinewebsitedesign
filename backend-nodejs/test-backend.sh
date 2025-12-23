#!/bin/bash

# ═══════════════════════════════════════════════════════════
# TESTE BACKEND - MeuMU Online
# ═══════════════════════════════════════════════════════════

echo "════════════════════════════════════════════════════════"
echo "  🔍 TESTE BACKEND - MeuMU Online"
echo "════════════════════════════════════════════════════════"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Parar PM2
echo -e "${YELLOW}📛 Parando PM2...${NC}"
pm2 stop meumu-backend 2>/dev/null || true
pm2 delete meumu-backend 2>/dev/null || true

# 2. Verificar .env
echo ""
echo -e "${YELLOW}📄 Verificando .env...${NC}"
cd /home/meumu.com/public_html/backend-nodejs

if [ ! -f .env ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Arquivo .env existe${NC}"
echo ""
echo "Configurações:"
grep "DB_MU_USER" .env
grep "DB_WEB_USER" .env
grep "PORT" .env | head -1

# 3. Testar conexão database
echo ""
echo -e "${YELLOW}🔍 Testando conexão database...${NC}"
node test-db-connection.js 2>&1 | head -20

# 4. Iniciar servidor
echo ""
echo -e "${YELLOW}🚀 Iniciando servidor (direto)...${NC}"
echo "Aguarde 5 segundos..."
echo ""

timeout 5 node src/server.js 2>&1 &
SERVER_PID=$!

sleep 3

# 5. Testar porta 3001
echo ""
echo -e "${YELLOW}🔍 Testando porta 3001...${NC}"

if curl -s http://127.0.0.1:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Servidor ONLINE em http://127.0.0.1:3001${NC}"
    echo ""
    echo "Response:"
    curl -s http://127.0.0.1:3001/health | head -5
else
    echo -e "${RED}❌ Servidor NÃO respondeu${NC}"
fi

# 6. Matar processo de teste
kill $SERVER_PID 2>/dev/null || true

# 7. Iniciar com PM2
echo ""
echo -e "${YELLOW}🚀 Iniciando com PM2...${NC}"
pm2 start src/server.js --name meumu-backend --update-env

sleep 2

echo ""
echo -e "${YELLOW}📊 Status PM2:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}📜 Logs (últimas 10 linhas):${NC}"
pm2 logs meumu-backend --lines 10 --nostream

echo ""
echo "════════════════════════════════════���═══════════════════"
echo -e "${GREEN}  ✅ TESTE COMPLETO!${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Abra em seu navegador:"
echo "  http://meumu.com:3001/health"
echo "  http://meumu.com:3001/install"
echo ""
