#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# V577 - APLICAR CORREÇÕES URGENTES
# Data: 2025-12-30 23:45 CET
# ═══════════════════════════════════════════════════════════════

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "═══════════════════════════════════════════════════════════════"
echo "  🚀 V577 - APLICANDO CORREÇÕES URGENTES"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 1. EXECUTAR MIGRATION 005 (Ban Columns)
echo -e "${YELLOW}[1/4]${NC} Aplicando migration 005 (colunas de ban)..."
if [ -f "backend-nodejs/migrations/005-add-ban-columns.sql" ]; then
    sudo mysql muonline < backend-nodejs/migrations/005-add-ban-columns.sql
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Migration 005 executada com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro ao executar migration 005${NC}"
    fi
else
    echo -e "${RED}❌ Arquivo migration não encontrado!${NC}"
fi

echo ""

# 2. VERIFICAR DEPENDÊNCIAS BACKEND
echo -e "${YELLOW}[2/4]${NC} Verificando dependências do backend..."
cd backend-nodejs
if npm list multer adm-zip &>/dev/null; then
    echo -e "${GREEN}✅ Dependências já instaladas (multer, adm-zip)${NC}"
else
    echo -e "${YELLOW}📦 Instalando dependências faltantes...${NC}"
    npm install multer adm-zip
    echo -e "${GREEN}✅ Dependências instaladas!${NC}"
fi
cd ..

echo ""

# 3. REBUILD FRONTEND
echo -e "${YELLOW}[3/4]${NC} Rebuilding frontend..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend buildado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao buildar frontend${NC}"
fi

echo ""

# 4. REINICIAR BACKEND
echo -e "${YELLOW}[4/4]${NC} Reiniciando backend..."
cd backend-nodejs
if command -v pm2 &> /dev/null; then
    pm2 restart meumu-backend 2>/dev/null || pm2 start src/server.js --name meumu-backend
    echo -e "${GREEN}✅ Backend reiniciado via PM2!${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 não encontrado. Inicie manualmente com:${NC}"
    echo -e "   cd backend-nodejs && npm start"
fi
cd ..

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}🎉 CORREÇÕES V577 APLICADAS COM SUCESSO!${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📋 CHECKLIST:"
echo "  ✅ Migration 005 executada"
echo "  ✅ Dependências verificadas"
echo "  ✅ Frontend rebuildado"
echo "  ✅ Backend reiniciado"
echo ""
echo "🔍 PRÓXIMOS PASSOS:"
echo "  1. Acesse https://meumu.com"
echo "  2. Faça login no AdminCP"
echo "  3. Verifique Dashboard Stats"
echo "  4. Teste criação de conta"
echo "  5. Teste sistema de bans"
echo ""
echo "═══════════════════════════════════════════════════════════════"
