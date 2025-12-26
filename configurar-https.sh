#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - CONFIGURAR HTTPS E PROXY REVERSO
# ═══════════════════════════════════════════════════════════════

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}       🔒 CONFIGURAÇÃO HTTPS + PROXY REVERSO${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

BASE_DIR="/home/meumu.com/public_html"

# ═══════════════════════════════════════════════════════════════
# ETAPA 1: CONFIGURAR FRONTEND PARA HTTPS
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[1/6]${NC} Configurando Frontend para HTTPS..."

cd "$BASE_DIR" || exit 1

# Criar .env do frontend
cat > .env << 'EOF'
# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - CONFIGURAÇÃO DO FRONTEND (HTTPS)
# ═══════════════════════════════════════════════════════════════

# URL da API Backend (através do proxy HTTPS)
# ⚠️ IMPORTANTE: Usar HTTPS sem porta (proxy reverso redireciona)
VITE_API_URL=https://meumu.com/api
EOF

echo -e "${GREEN}✅ .env do frontend criado (HTTPS)${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# ETAPA 2: CONFIGURAR BACKEND PARA HTTPS
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[2/6]${NC} Configurando Backend para HTTPS..."

cd "$BASE_DIR/backend-nodejs" || exit 1

# Backup do .env antigo
if [ -f ".env" ]; then
    cp .env ".env.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${CYAN}   Backup do .env antigo criado${NC}"
fi

# Copiar .env.production
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo -e "${GREEN}✅ .env do backend configurado (HTTPS)${NC}"
else
    echo -e "${RED}❌ .env.production não encontrado!${NC}"
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# ETAPA 3: PARAR BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[3/6]${NC} Parando backend Node.js..."

# Matar TODOS os processos Node.js
pkill -9 -f node 2>/dev/null
pkill -9 -f nodemon 2>/dev/null
sleep 3

# Liberar porta 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 2

echo -e "${GREEN}✅ Backend parado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# ETAPA 4: REBUILD FRONTEND
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[4/6]${NC} Rebuilding frontend com HTTPS..."

cd "$BASE_DIR" || exit 1

# Remover dist antigo
if [ -d "dist" ]; then
    mv dist "dist.backup.$(date +%Y%m%d_%H%M%S)"
fi

echo -e "${CYAN}   Aguarde, isso pode levar alguns minutos...${NC}"

if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend buildado com HTTPS${NC}"
else
    echo -e "${RED}❌ Erro ao buildar frontend${NC}"
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# ETAPA 5: REINICIAR BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[5/6]${NC} Reiniciando backend..."

cd "$BASE_DIR/backend-nodejs" || exit 1

# Criar diretórios de logs
mkdir -p logs/alerts logs/audit logs/security 2>/dev/null

# Iniciar com PM2 ou npm
if command -v pm2 &> /dev/null; then
    pm2 delete meumu-backend 2>/dev/null || true
    pm2 start src/server.js --name meumu-backend --log logs/server.log
    pm2 save
    echo -e "${GREEN}✅ Backend iniciado com PM2${NC}"
else
    nohup npm start > logs/server.log 2>&1 &
    sleep 3
    echo -e "${GREEN}✅ Backend iniciado em background${NC}"
fi

echo ""

# Aguardar inicialização
echo -e "${CYAN}⏳ Aguardando servidor inicializar (5 segundos)...${NC}"
sleep 5

# ═══════════════════════════════════════════════════════════════
# ETAPA 6: TESTAR
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[6/6]${NC} Testando servidor..."
echo ""

# Testar porta 3001 (HTTP local)
echo -e "${CYAN}🔍 Testando HTTP (localhost:3001)...${NC}"
HEALTH_HTTP=$(curl -s http://localhost:3001/health 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend HTTP respondendo${NC}"
else
    echo -e "${RED}❌ Backend HTTP não está respondendo${NC}"
fi

echo ""

# Testar HTTPS (através do proxy)
echo -e "${CYAN}🔍 Testando HTTPS (meumu.com/api)...${NC}"
HEALTH_HTTPS=$(curl -s -k https://meumu.com/api/health 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Proxy HTTPS funcionando!${NC}"
    HTTPS_OK=true
else
    echo -e "${YELLOW}⚠️  Proxy HTTPS não configurado${NC}"
    echo -e "${YELLOW}   Execute: bash setup-litespeed-proxy.sh${NC}"
    HTTPS_OK=false
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ CONFIGURAÇÃO HTTPS CONCLUÍDA!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# RESUMO
# ═══════════════════════════════════════════════════════════════

echo -e "${CYAN}📋 RESUMO DA CONFIGURAÇÃO:${NC}"
echo ""
echo -e "${CYAN}Frontend:${NC}"
echo -e "   VITE_API_URL=${GREEN}https://meumu.com/api${NC}"
echo ""
echo -e "${CYAN}Backend:${NC}"
echo -e "   PORT=${GREEN}3001${NC}"
echo -e "   NODE_ENV=${GREEN}production${NC}"
echo -e "   FRONTEND_URL=${GREEN}https://meumu.com${NC}"
echo -e "   RATE_LIMIT_MAX=${GREEN}500${NC} (aumentado para evitar bloqueio)"
echo ""

if [ "$HTTPS_OK" = true ]; then
    echo -e "${CYAN}🌐 ACESSE O SITE:${NC}"
    echo -e "   ${GREEN}https://meumu.com${NC}"
    echo ""
    echo -e "${CYAN}🔧 Desenvolvimento (porta 3001):${NC}"
    echo -e "   ${YELLOW}http://meumu.com:3001${NC}"
else
    echo -e "${YELLOW}⚠️  PRÓXIMO PASSO: CONFIGURAR PROXY REVERSO${NC}"
    echo ""
    echo -e "${CYAN}Execute:${NC}"
    echo -e "   ${YELLOW}bash $BASE_DIR/setup-litespeed-proxy.sh${NC}"
    echo ""
    echo -e "${CYAN}Ou configure manualmente via CyberPanel:${NC}"
    echo -e "   ${YELLOW}https://meumu.com:8090${NC}"
    echo -e "   ${YELLOW}Websites → meumu.com → Manage → vHost Conf${NC}"
fi

echo ""
echo -e "${CYAN}📊 Ver logs em tempo real:${NC}"
echo -e "   ${YELLOW}pm2 logs meumu-backend${NC}"
echo ""
