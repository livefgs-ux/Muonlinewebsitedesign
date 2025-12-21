#!/bin/bash

##############################################
# 🔧 FIX API 500 ERROR - MeuMU Online
##############################################

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo -e "${RED}╔════════════════════════════════════════╗${NC}"
echo -e "${RED}║  🔧 Corrigindo Erro 500 da API        ║${NC}"
echo -e "${RED}╚════════════════════════════════════════╝${NC}"
echo ""

PROJECT_DIR="/home/meumu.com/public_html"
cd $PROJECT_DIR

##############################################
# 1. Verificar Backend
##############################################
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}[1/6]${NC} Verificando backend Node.js..."
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}❌ PM2 não instalado!${NC}"
    echo -e "${YELLOW}Instalando PM2...${NC}"
    npm install -g pm2
fi

# Verificar status do backend
if pm2 list | grep -q "meumu-backend.*online"; then
    echo -e "${GREEN}✅ Backend está rodando${NC}"
else
    echo -e "${YELLOW}⚠️  Backend não está rodando. Iniciando...${NC}"
    cd backend-nodejs
    
    # Verificar se .env existe
    if [ ! -f ".env" ]; then
        echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            echo -e "${YELLOW}📝 Criado .env a partir de .env.example${NC}"
            echo -e "${CYAN}⚠️  CONFIGURE AS CREDENCIAIS:${NC}"
            echo -e "${BLUE}   nano backend-nodejs/.env${NC}"
            exit 1
        fi
    fi
    
    # Instalar dependências se necessário
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Instalando dependências...${NC}"
        npm install
    fi
    
    # Iniciar backend
    pm2 start src/server.js --name meumu-backend
    pm2 save
    
    # Aguardar 3 segundos
    sleep 3
    
    cd ..
fi

echo ""

##############################################
# 2. Testar Backend
##############################################
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}[2/6]${NC} Testando backend..."
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

if curl -s -f http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend respondendo em http://localhost:3001${NC}"
    HEALTH=$(curl -s http://localhost:3001/health)
    echo -e "${CYAN}Resposta:${NC}"
    echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"
else
    echo -e "${RED}❌ Backend NÃO está respondendo!${NC}"
    echo -e "${YELLOW}Logs do backend:${NC}"
    pm2 logs meumu-backend --lines 20 --nostream
    exit 1
fi

echo ""

##############################################
# 3. Copiar arquivos de proxy
##############################################
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}[3/6]${NC} Configurando proxy reverso..."
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# .htaccess e api-proxy.php já foram criados pelo script anterior
echo -e "${GREEN}✅ Arquivos de proxy configurados:${NC}"
echo -e "   - .htaccess (rewrite rules)"
echo -e "   - api-proxy.php (proxy PHP)"

echo ""

##############################################
# 4. Testar Proxy PHP
##############################################
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}[4/6]${NC} Testando proxy PHP..."
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Testar proxy PHP diretamente
TEST_URL="https://meumu.com/api/server/info"
echo -e "${CYAN}Testando: $TEST_URL${NC}"

RESPONSE=$(curl -s -w "\n%{http_code}" "$TEST_URL")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Proxy funcionando! HTTP $HTTP_CODE${NC}"
    echo -e "${CYAN}Resposta:${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null | head -20 || echo "$BODY" | head -20
elif [ "$HTTP_CODE" = "500" ]; then
    echo -e "${RED}❌ Ainda dando erro 500${NC}"
    echo -e "${YELLOW}Verificando se é problema do mod_proxy...${NC}"
    
    # Verificar qual servidor web está rodando
    if systemctl is-active --quiet lsws 2>/dev/null; then
        echo -e "${CYAN}Servidor: LiteSpeed${NC}"
        echo -e "${YELLOW}Reiniciando LiteSpeed...${NC}"
        sudo systemctl restart lsws
    elif systemctl is-active --quiet apache2 2>/dev/null; then
        echo -e "${CYAN}Servidor: Apache${NC}"
        echo -e "${YELLOW}Habilitando módulos proxy...${NC}"
        sudo a2enmod proxy 2>/dev/null || true
        sudo a2enmod proxy_http 2>/dev/null || true
        sudo a2enmod rewrite 2>/dev/null || true
        sudo systemctl restart apache2
    fi
    
    echo -e "${YELLOW}Aguardando 5 segundos...${NC}"
    sleep 5
    
    # Testar novamente
    RESPONSE2=$(curl -s -w "\n%{http_code}" "$TEST_URL")
    HTTP_CODE2=$(echo "$RESPONSE2" | tail -n 1)
    
    if [ "$HTTP_CODE2" = "200" ]; then
        echo -e "${GREEN}✅ Resolvido! HTTP $HTTP_CODE2${NC}"
    else
        echo -e "${RED}❌ Ainda com erro. HTTP $HTTP_CODE2${NC}"
        echo -e "${YELLOW}Resposta:${NC}"
        echo "$RESPONSE2" | head -n -1
    fi
else
    echo -e "${YELLOW}⚠️  HTTP $HTTP_CODE${NC}"
    echo "$BODY" | head -20
fi

echo ""

##############################################
# 5. Verificar permissões
##############################################
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}[5/6]${NC} Verificando permissões..."
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Garantir que api-proxy.php seja executável
chmod 644 api-proxy.php
chmod 644 .htaccess

echo -e "${GREEN}✅ Permissões configuradas${NC}"
echo ""

##############################################
# 6. Diagnóstico Final
##############################################
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}[6/6]${NC} Diagnóstico final..."
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}📊 Status dos Serviços:${NC}"
echo ""

# Backend
if curl -s -f http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "  Backend (localhost:3001):     ${GREEN}✅ ONLINE${NC}"
else
    echo -e "  Backend (localhost:3001):     ${RED}❌ OFFLINE${NC}"
fi

# Proxy
PROXY_TEST=$(curl -s -o /dev/null -w "%{http_code}" "https://meumu.com/api/server/info")
if [ "$PROXY_TEST" = "200" ]; then
    echo -e "  Proxy (/api/*):               ${GREEN}✅ FUNCIONANDO${NC}"
elif [ "$PROXY_TEST" = "500" ]; then
    echo -e "  Proxy (/api/*):               ${RED}❌ ERRO 500${NC}"
else
    echo -e "  Proxy (/api/*):               ${YELLOW}⚠️  HTTP $PROXY_TEST${NC}"
fi

# Frontend
FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" "https://meumu.com")
if [ "$FRONTEND_TEST" = "200" ]; then
    echo -e "  Frontend (https://meumu.com): ${GREEN}✅ ONLINE${NC}"
else
    echo -e "  Frontend (https://meumu.com): ${YELLOW}⚠️  HTTP $FRONTEND_TEST${NC}"
fi

echo ""
echo -e "${CYAN}📋 Arquivos de Configuração:${NC}"
echo ""

if [ -f ".htaccess" ]; then
    echo -e "  .htaccess:                    ${GREEN}✅ EXISTE${NC}"
else
    echo -e "  .htaccess:                    ${RED}❌ NÃO EXISTE${NC}"
fi

if [ -f "api-proxy.php" ]; then
    echo -e "  api-proxy.php:                ${GREEN}✅ EXISTE${NC}"
else
    echo -e "  api-proxy.php:                ${RED}❌ NÃO EXISTE${NC}"
fi

if [ -f "index.html" ]; then
    if grep -q "/assets/index-" index.html; then
        echo -e "  index.html:                   ${GREEN}✅ PRODUÇÃO${NC}"
    else
        echo -e "  index.html:                   ${YELLOW}⚠️  DEV MODE${NC}"
    fi
else
    echo -e "  index.html:                   ${RED}❌ NÃO EXISTE${NC}"
fi

echo ""

##############################################
# Resultado Final
##############################################
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

if [ "$PROXY_TEST" = "200" ]; then
    echo -e "${GREEN}✅ TUDO FUNCIONANDO!${NC}"
    echo ""
    echo -e "${CYAN}🌐 Acesse:${NC} https://meumu.com"
    echo -e "${CYAN}📊 API:${NC} https://meumu.com/api/server/info"
else
    echo -e "${RED}❌ AINDA COM PROBLEMAS${NC}"
    echo ""
    echo -e "${YELLOW}Próximos passos:${NC}"
    echo ""
    echo -e "1. Verificar logs do backend:"
    echo -e "   ${BLUE}pm2 logs meumu-backend${NC}"
    echo ""
    echo -e "2. Verificar logs do servidor web:"
    echo -e "   ${BLUE}tail -f /usr/local/lsws/logs/error.log${NC}"
    echo -e "   ${BLUE}tail -f /var/log/apache2/error.log${NC}"
    echo ""
    echo -e "3. Testar API diretamente:"
    echo -e "   ${BLUE}curl http://localhost:3001/api/server/info${NC}"
    echo ""
    echo -e "4. Testar proxy PHP:"
    echo -e "   ${BLUE}curl https://meumu.com/api-proxy.php?REDIRECT_URL=/api/server/info${NC}"
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
