#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "  🔍 DIAGNÓSTICO BACKEND - MeuMU Online"
echo "════════════════════════════════════════════════════════"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Verificar PM2
echo -e "${YELLOW}1️⃣  Status PM2:${NC}"
pm2 status | grep meumu-backend
echo ""

# 2. Verificar porta 3001
echo -e "${YELLOW}2️⃣  Porta 3001:${NC}"
if netstat -tlnp 2>/dev/null | grep -q ":3001"; then
    echo -e "${GREEN}✅ Porta 3001 está aberta${NC}"
    netstat -tlnp | grep ":3001"
else
    echo -e "${RED}❌ Porta 3001 NÃO está aberta${NC}"
fi
echo ""

# 3. Testar API
echo -e "${YELLOW}3️⃣  Testar API /health:${NC}"
echo "curl http://127.0.0.1:3001/health"
echo ""
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://127.0.0.1:3001/health 2>&1)
echo "$RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q "DOCTYPE"; then
    echo -e "${RED}❌ Retornou HTML (backend não está rodando!)${NC}"
elif echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Retornou JSON (backend OK!)${NC}"
else
    echo -e "${RED}❌ Erro na conexão${NC}"
fi
echo ""

# 4. Testar API /api/install/check-requirements
echo -e "${YELLOW}4️⃣  Testar API /api/install/check-requirements:${NC}"
echo "curl http://127.0.0.1:3001/api/install/check-requirements"
echo ""
RESPONSE2=$(curl -s http://127.0.0.1:3001/api/install/check-requirements 2>&1 | head -20)
echo "$RESPONSE2"
echo ""

if echo "$RESPONSE2" | grep -q "DOCTYPE"; then
    echo -e "${RED}❌ Retornou HTML (instalador está chamando API errada!)${NC}"
elif echo "$RESPONSE2" | grep -q "success"; then
    echo -e "${GREEN}✅ Retornou JSON (API OK!)${NC}"
else
    echo -e "${RED}❌ Erro na conexão${NC}"
fi
echo ""

# 5. Ver logs PM2
echo -e "${YELLOW}5️⃣  Logs PM2 (últimas 15 linhas):${NC}"
pm2 logs meumu-backend --lines 15 --nostream 2>&1 | tail -20
echo ""

# 6. Verificar .env
echo -e "${YELLOW}6️⃣  Configuração .env:${NC}"
cd /home/meumu.com/public_html/backend-nodejs
if [ -f .env ]; then
    grep "^DB_MU_USER" .env || echo "DB_MU_USER não encontrado"
    grep "^DB_WEB_USER" .env || echo "DB_WEB_USER não encontrado"
    grep "^PORT" .env | head -1 || echo "PORT não encontrado"
else
    echo -e "${RED}❌ Arquivo .env NÃO EXISTE${NC}"
fi
echo ""

# 7. Testar conexão database diretamente
echo -e "${YELLOW}7️⃣  Testar conexão database:${NC}"
cd /home/meumu.com/public_html/backend-nodejs
timeout 3 node test-db-connection.js 2>&1 | head -15
echo ""

echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}  ✅ DIAGNÓSTICO COMPLETO!${NC}"
echo "════════════════════════════════════════════════════════"
