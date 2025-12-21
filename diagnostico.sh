#!/bin/bash

##############################################
# 🔍 DIAGNÓSTICO - MeuMU Online
##############################################

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🔍 MeuMU Online - Diagnóstico        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

##############################################
# 1. Verificar portas
##############################################
echo -e "${YELLOW}[1/8]${NC} Verificando portas..."
echo -e "${BLUE}→ Porta 3001 (Backend):${NC}"
if lsof -i:3001 &> /dev/null; then
    echo -e "${GREEN}✅ Porta 3001 em uso${NC}"
    lsof -i:3001 | grep LISTEN
else
    echo -e "${RED}❌ Porta 3001 livre (Backend NÃO está rodando!)${NC}"
fi

echo -e "${BLUE}→ Porta 5173 (Frontend):${NC}"
if lsof -i:5173 &> /dev/null; then
    echo -e "${GREEN}✅ Porta 5173 em uso${NC}"
    lsof -i:5173 | grep LISTEN
else
    echo -e "${RED}❌ Porta 5173 livre (Frontend NÃO está rodando!)${NC}"
fi
echo ""

##############################################
# 2. Status PM2
##############################################
echo -e "${YELLOW}[2/8]${NC} Status PM2..."
pm2 status
echo ""

##############################################
# 3. Verificar Node/NPM
##############################################
echo -e "${YELLOW}[3/8]${NC} Versões instaladas..."
echo -e "${BLUE}→ Node:${NC} $(node -v)"
echo -e "${BLUE}→ NPM:${NC} $(npm -v)"
echo -e "${BLUE}→ PM2:${NC} $(pm2 -v 2>/dev/null || echo 'Não instalado')"
echo ""

##############################################
# 4. Verificar MariaDB
##############################################
echo -e "${YELLOW}[4/8]${NC} MariaDB..."
if sudo systemctl is-active --quiet mariadb; then
    echo -e "${GREEN}✅ MariaDB está rodando${NC}"
else
    echo -e "${RED}❌ MariaDB NÃO está rodando${NC}"
fi
echo ""

##############################################
# 5. Testar Backend
##############################################
echo -e "${YELLOW}[5/8]${NC} Testando Backend..."
echo -e "${BLUE}→ Health Check:${NC}"
if curl -s http://localhost:3001/health 2>&1 | head -5; then
    echo -e "${GREEN}✅ Backend respondeu${NC}"
else
    echo -e "${RED}❌ Backend não respondeu${NC}"
fi
echo ""

echo -e "${BLUE}→ Server Info:${NC}"
if curl -s http://localhost:3001/api/server/info 2>&1 | head -5; then
    echo -e "${GREEN}✅ API respondeu${NC}"
else
    echo -e "${RED}❌ API não respondeu${NC}"
fi
echo ""

##############################################
# 6. Testar Frontend
##############################################
echo -e "${YELLOW}[6/8]${NC} Testando Frontend..."
echo -e "${BLUE}→ HTTP Status:${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Frontend respondendo (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Frontend não está respondendo (HTTP $HTTP_CODE)${NC}"
fi
echo ""

##############################################
# 7. Verificar arquivos críticos
##############################################
echo -e "${YELLOW}[7/8]${NC} Verificando arquivos críticos..."
PROJECT_DIR="/home/meumu.com/public_html"

FILES=(
    "$PROJECT_DIR/index.html"
    "$PROJECT_DIR/src/main.tsx"
    "$PROJECT_DIR/src/app/App.tsx"
    "$PROJECT_DIR/vite.config.ts"
    "$PROJECT_DIR/package.json"
    "$PROJECT_DIR/backend-nodejs/src/server.js"
    "$PROJECT_DIR/backend-nodejs/.env"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $(basename $file)${NC}"
    else
        echo -e "${RED}❌ $(basename $file) NÃO ENCONTRADO${NC}"
    fi
done
echo ""

##############################################
# 8. Verificar dependências
##############################################
echo -e "${YELLOW}[8/8]${NC} Verificando dependências..."
cd $PROJECT_DIR

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules (frontend) existe${NC}"
else
    echo -e "${RED}❌ node_modules (frontend) NÃO EXISTE${NC}"
fi

if [ -d "backend-nodejs/node_modules" ]; then
    echo -e "${GREEN}✅ node_modules (backend) existe${NC}"
else
    echo -e "${RED}❌ node_modules (backend) NÃO EXISTE${NC}"
fi
echo ""

##############################################
# 9. Recomendações
##############################################
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  💡 RECOMENDAÇÕES                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Verificar se serviços estão rodando
if ! lsof -i:3001 &> /dev/null; then
    echo -e "${RED}❌ Backend não está rodando!${NC}"
    echo -e "   ${YELLOW}Execute:${NC} ${GREEN}bash deploy.sh${NC}"
    echo ""
fi

if ! lsof -i:5173 &> /dev/null; then
    echo -e "${RED}❌ Frontend não está rodando!${NC}"
    echo -e "   ${YELLOW}Execute:${NC} ${GREEN}bash deploy.sh${NC}"
    echo ""
fi

# Verificar se MariaDB está ativo
if ! sudo systemctl is-active --quiet mariadb; then
    echo -e "${RED}❌ MariaDB não está rodando!${NC}"
    echo -e "   ${YELLOW}Execute:${NC} ${GREEN}sudo systemctl start mariadb${NC}"
    echo ""
fi

echo -e "${GREEN}✅ Diagnóstico concluído!${NC}"
echo ""
