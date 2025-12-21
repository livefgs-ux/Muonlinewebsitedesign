#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}"
echo -e "${CYAN}${BOLD}   MeuMU Online - Diagnóstico Rápido${NC}"
echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}"
echo ""

# 1. Status PM2
echo -e "${YELLOW}1. STATUS PM2:${NC}"
pm2 status
echo ""

# 2. Processos Node.js
echo -e "${YELLOW}2. PROCESSOS NODE.JS NA PORTA 3001:${NC}"
netstat -tuln | grep 3001
ps aux | grep "[n]ode.*server.js"
echo ""

# 3. Logs (últimas 30 linhas)
echo -e "${YELLOW}3. LOGS DO BACKEND (últimas 30 linhas):${NC}"
echo -e "${CYAN}════════════════════════════════════════════════${NC}"
pm2 logs meumu-backend --lines 30 --nostream 2>&1 || echo "Sem logs disponíveis"
echo -e "${CYAN}════════════════════════════════════════════════${NC}"
echo ""

# 4. Testar backend direto
echo -e "${YELLOW}4. TESTAR BACKEND:${NC}"
echo -e "${CYAN}curl http://localhost:3001/api/server/health${NC}"
RESULT=$(curl -s -w "\n%{http_code}" http://localhost:3001/api/server/health 2>/dev/null)
HTTP_CODE=$(echo "$RESULT" | tail -n 1)
BODY=$(echo "$RESULT" | head -n -1)

echo "HTTP Code: $HTTP_CODE"
echo "Response: ${BODY:0:200}"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Backend respondendo!${NC}"
else
    echo -e "${RED}❌ Backend NÃO está respondendo (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# 5. Verificar .env
echo -e "${YELLOW}5. ARQUIVO .ENV:${NC}"
if [ -f "/home/meumu.com/public_html/backend-nodejs/.env" ]; then
    echo -e "${GREEN}✅ .env existe${NC}"
    echo ""
    echo "Primeiras 15 linhas (sem senhas):"
    grep -v "PASSWORD\|SECRET" /home/meumu.com/public_html/backend-nodejs/.env | head -15
else
    echo -e "${RED}❌ .env NÃO EXISTE!${NC}"
fi
echo ""

# 6. Verificar node_modules
echo -e "${YELLOW}6. DEPENDÊNCIAS:${NC}"
if [ -d "/home/meumu.com/public_html/backend-nodejs/node_modules" ]; then
    echo -e "${GREEN}✅ node_modules existe${NC}"
else
    echo -e "${RED}❌ node_modules NÃO EXISTE!${NC}"
    echo -e "${YELLOW}Execute: cd /home/meumu.com/public_html/backend-nodejs && npm install${NC}"
fi
echo ""

# Resumo
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${CYAN}${BOLD}   RESUMO${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Backend está funcionando!${NC}"
    echo -e "${YELLOW}   Problema pode estar no proxy do OpenLiteSpeed${NC}"
else
    echo -e "${RED}❌ Backend NÃO está funcionando!${NC}"
    echo ""
    echo -e "${YELLOW}Verifique os logs acima e procure por:${NC}"
    echo "  • Erros de conexão com MySQL"
    echo "  • Módulos não encontrados (npm install)"
    echo "  • Problemas no .env"
    echo "  • Erros de sintaxe no código"
fi
echo ""
