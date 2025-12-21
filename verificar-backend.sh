#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Verificar Backend
# Diagnóstico completo do backend Node.js
#═══════════════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}    MeuMU Online - Diagnóstico do Backend${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo ""

# Status do PM2
echo -e "${BLUE}1. STATUS DO PM2:${NC}"
pm2 status

echo ""
echo -e "${BLUE}2. LOGS DO BACKEND (últimas 50 linhas):${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
pm2 logs meumu-backend --lines 50 --nostream

echo ""
echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
echo ""

# Verificar porta
echo -e "${BLUE}3. PORTA 3001:${NC}"
if netstat -tuln 2>/dev/null | grep -q ':3001 '; then
    echo -e "${GREEN}✅ Porta 3001 está EM USO${NC}"
    netstat -tuln | grep 3001
else
    echo -e "${RED}❌ Porta 3001 está LIVRE (backend não está rodando!)${NC}"
fi

echo ""

# Verificar .env
echo -e "${BLUE}4. ARQUIVO .ENV:${NC}"
if [ -f "/home/meumu.com/public_html/backend-nodejs/.env" ]; then
    echo -e "${GREEN}✅ .env existe${NC}"
    echo ""
    echo -e "${YELLOW}Conteúdo (sem senhas):${NC}"
    grep -v "PASSWORD\|SECRET" /home/meumu.com/public_html/backend-nodejs/.env | head -20
else
    echo -e "${RED}❌ .env NÃO EXISTE!${NC}"
fi

echo ""

# Testar MySQL
echo -e "${BLUE}5. CONEXÃO COM MYSQL:${NC}"
if command -v mysql &> /dev/null; then
    echo -e "${CYAN}Testando conexão...${NC}"
    # Tentar extrair credenciais do .env
    if [ -f "/home/meumu.com/public_html/backend-nodejs/.env" ]; then
        DB_HOST=$(grep "^DB_HOST=" /home/meumu.com/public_html/backend-nodejs/.env | cut -d= -f2)
        DB_USER=$(grep "^DB_USER=" /home/meumu.com/public_html/backend-nodejs/.env | cut -d= -f2)
        DB_NAME=$(grep "^DB_NAME=" /home/meumu.com/public_html/backend-nodejs/.env | cut -d= -f2)
        
        echo "Host: $DB_HOST"
        echo "User: $DB_USER"
        echo "Database: $DB_NAME"
    fi
else
    echo -e "${YELLOW}⚠️  MySQL client não instalado${NC}"
fi

echo ""

# Verificar node_modules
echo -e "${BLUE}6. DEPENDÊNCIAS:${NC}"
if [ -d "/home/meumu.com/public_html/backend-nodejs/node_modules" ]; then
    echo -e "${GREEN}✅ node_modules existe${NC}"
    
    # Verificar pacotes críticos
    PACKAGES=("express" "mysql2" "dotenv" "cors" "helmet")
    for pkg in "${PACKAGES[@]}"; do
        if [ -d "/home/meumu.com/public_html/backend-nodejs/node_modules/$pkg" ]; then
            echo -e "  ${GREEN}✅ $pkg${NC}"
        else
            echo -e "  ${RED}❌ $pkg NÃO INSTALADO!${NC}"
        fi
    done
else
    echo -e "${RED}❌ node_modules NÃO EXISTE!${NC}"
    echo -e "${YELLOW}Execute: cd backend-nodejs && npm install${NC}"
fi

echo ""

# Tentar iniciar manualmente para ver erro
echo -e "${BLUE}7. TESTAR INICIALIZAÇÃO MANUAL:${NC}"
echo -e "${CYAN}Tentando iniciar manualmente...${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"

cd /home/meumu.com/public_html/backend-nodejs
timeout 5 node src/server.js 2>&1 || true

echo ""
echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
echo ""

# Resumo
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}    RESUMO DO DIAGNÓSTICO${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Verifique os logs acima e procure por:${NC}"
echo ""
echo -e "  ${RED}❌ Erros de conexão com MySQL${NC}"
echo -e "     Solução: Verificar DB_HOST, DB_USER, DB_PASSWORD no .env"
echo ""
echo -e "  ${RED}❌ Erro 'Cannot find module'${NC}"
echo -e "     Solução: cd backend-nodejs && npm install"
echo ""
echo -e "  ${RED}❌ Erro 'EADDRINUSE' (porta já em uso)${NC}"
echo -e "     Solução: pm2 delete meumu-backend && pm2 start src/server.js"
echo ""
echo -e "  ${RED}❌ Erro '.env' ou variáveis não definidas${NC}"
echo -e "     Solução: Configurar .env corretamente"
echo ""
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo ""
