#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 🧪 SCRIPT DE TESTE DAS CORREÇÕES
# ═══════════════════════════════════════════════════════════════════════════
#
# Este script testa as 3 correções implementadas:
# 1. Ranking de Guilds (erro 500)
# 2. Sistema de Login (erro 401)
# 3. API URL (usar proxy reverso)
#
# ═══════════════════════════════════════════════════════════════════════════

echo "══════════════════════════════════════════════════════════════"
echo "🧪 TESTANDO CORREÇÕES - MeuMU Online"
echo "══════════════════════════════════════════════════════════════"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
    local url=$1
    local name=$2
    
    echo -n "Testing $name... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" -m 5)
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✅ OK (200)${NC}"
        return 0
    elif [ "$status" = "401" ]; then
        echo -e "${YELLOW}⚠️  AUTH (401)${NC}"
        return 1
    elif [ "$status" = "500" ]; then
        echo -e "${RED}❌ ERROR (500)${NC}"
        return 2
    else
        echo -e "${RED}❌ FAIL ($status)${NC}"
        return 3
    fi
}

echo "─────────────────────────────────────────────────────────────"
echo "1️⃣  TESTANDO BACKEND (PM2)"
echo "─────────────────────────────────────────────────────────────"
echo ""

# Verificar se PM2 está rodando
if command -v pm2 &> /dev/null; then
    echo -e "${BLUE}📦 PM2 Status:${NC}"
    pm2 list | grep meumu-api
    echo ""
else
    echo -e "${YELLOW}⚠️  PM2 não encontrado${NC}"
    echo ""
fi

echo "─────────────────────────────────────────────────────────────"
echo "2️⃣  TESTANDO ENDPOINTS DA API"
echo "─────────────────────────────────────────────────────────────"
echo ""

# Base URL
BASE_URL="http://localhost:3001/api"

# Testar endpoints
test_endpoint "$BASE_URL/server/stats" "Server Stats"
test_endpoint "$BASE_URL/rankings/resets?limit=10" "Top Resets"
test_endpoint "$BASE_URL/rankings/level?limit=10" "Top Level"
test_endpoint "$BASE_URL/rankings/pk?limit=10" "Top PK"
test_endpoint "$BASE_URL/rankings/guilds?limit=10" "Top Guilds ⭐"
test_endpoint "$BASE_URL/events" "Events"
test_endpoint "$BASE_URL/news" "News"

echo ""
echo "─────────────────────────────────────────────────────────────"
echo "3️⃣  TESTANDO RANKING DE GUILDS (DETALHADO)"
echo "─────────────────────────────────────────────────────────────"
echo ""

response=$(curl -s "$BASE_URL/rankings/guilds?limit=10")

if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ SUCESSO! Ranking de Guilds funcionando!${NC}"
    echo ""
    echo "Resposta:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
elif echo "$response" | grep -q 'error'; then
    echo -e "${RED}❌ ERRO no ranking de guilds${NC}"
    echo ""
    echo "Erro:"
    echo "$response"
else
    echo -e "${YELLOW}⚠️  Resposta inesperada${NC}"
    echo "$response"
fi

echo ""
echo "─────────────────────────────────────────────────────────────"
echo "4️⃣  TESTANDO BUILD DO FRONTEND"
echo "─────────────────────────────────────────────────────────────"
echo ""

if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Pasta /dist existe${NC}"
    echo ""
    echo "Arquivos principais:"
    ls -lh dist/ | head -10
else
    echo -e "${YELLOW}⚠️  Pasta /dist não existe${NC}"
    echo ""
    echo "Execute: npm run build"
fi

echo ""
echo "─────────────────────────────────────────────────────────────"
echo "5️⃣  VERIFICANDO ARQUIVOS .ENV"
echo "─────────────────────────────────────────────────────────────"
echo ""

if [ -f ".env.production" ]; then
    echo -e "${GREEN}✅ .env.production existe${NC}"
    echo "   VITE_API_URL=$(grep VITE_API_URL .env.production | cut -d'=' -f2)"
else
    echo -e "${RED}❌ .env.production não existe${NC}"
fi

if [ -f ".env.development" ]; then
    echo -e "${GREEN}✅ .env.development existe${NC}"
    echo "   VITE_API_URL=$(grep VITE_API_URL .env.development | cut -d'=' -f2)"
else
    echo -e "${RED}❌ .env.development não existe${NC}"
fi

if [ -f "backend-nodejs/.env" ]; then
    echo -e "${GREEN}✅ backend-nodejs/.env existe${NC}"
else
    echo -e "${RED}❌ backend-nodejs/.env não existe${NC}"
fi

echo ""
echo "══════════════════════════════════════════════════════════════"
echo "✅ TESTES CONCLUÍDOS!"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "   1. Se todos os testes passarem:"
echo "      cd /home/meumu.com/public_html"
echo "      npm run build"
echo "      pm2 restart meumu-api"
echo ""
echo "   2. Verificar logs do backend:"
echo "      pm2 logs meumu-api --lines 50"
echo ""
echo "   3. Testar login no site e verificar rankings"
echo ""
echo "══════════════════════════════════════════════════════════════"
