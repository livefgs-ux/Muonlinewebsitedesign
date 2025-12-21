#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Diagnóstico Completo
# Script para identificar exatamente o que está faltando
# 
# @version 1.0.0
# @author MeuMU Team
#═══════════════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${PURPLE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          🔍 MeuMU Online - Diagnóstico Completo 🔍          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""

ERRORS=0
WARNINGS=0

# ═══════════════════════════════════════════════════════════════
# 1. VERIFICAR ESTRUTURA DE ARQUIVOS
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  1. Verificar Estrutura de Arquivos                         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Frontend
echo -e "${CYAN}Frontend:${NC}"
if [ -f "dist/index.html" ]; then
    echo -e "  ${GREEN}✅ dist/index.html${NC}"
else
    echo -e "  ${RED}❌ dist/index.html NÃO EXISTE!${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -d "dist/assets" ]; then
    echo -e "  ${GREEN}✅ dist/assets/${NC}"
else
    echo -e "  ${RED}❌ dist/assets/ NÃO EXISTE!${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Backend
echo -e "${CYAN}Backend:${NC}"
if [ -d "backend-nodejs" ]; then
    echo -e "  ${GREEN}✅ backend-nodejs/${NC}"
else
    echo -e "  ${RED}❌ backend-nodejs/ NÃO EXISTE!${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "backend-nodejs/src/server.js" ]; then
    echo -e "  ${GREEN}✅ backend-nodejs/src/server.js${NC}"
else
    echo -e "  ${RED}❌ backend-nodejs/src/server.js NÃO EXISTE!${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "backend-nodejs/.env" ]; then
    echo -e "  ${GREEN}✅ backend-nodejs/.env${NC}"
else
    echo -e "  ${RED}❌ backend-nodejs/.env NÃO EXISTE!${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "backend-nodejs/package.json" ]; then
    echo -e "  ${GREEN}✅ backend-nodejs/package.json${NC}"
else
    echo -e "  ${RED}❌ backend-nodejs/package.json NÃO EXISTE!${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -d "backend-nodejs/node_modules" ]; then
    echo -e "  ${GREEN}✅ backend-nodejs/node_modules/${NC}"
else
    echo -e "  ${YELLOW}⚠️  backend-nodejs/node_modules/ NÃO EXISTE (precisa npm install)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Rotas do backend
echo -e "${CYAN}Rotas do Backend:${NC}"
ROUTES=(
    "backend-nodejs/src/routes/server.js"
    "backend-nodejs/src/routes/rankings.js"
    "backend-nodejs/src/routes/auth.js"
    "backend-nodejs/src/routes/characters.js"
)

for route in "${ROUTES[@]}"; do
    if [ -f "$route" ]; then
        echo -e "  ${GREEN}✅ $(basename $route)${NC}"
    else
        echo -e "  ${RED}❌ $(basename $route) NÃO EXISTE!${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# Controllers
echo -e "${CYAN}Controllers:${NC}"
CONTROLLERS=(
    "backend-nodejs/src/controllers/serverController.js"
    "backend-nodejs/src/controllers/rankingsController.js"
    "backend-nodejs/src/controllers/authController.js"
)

for controller in "${CONTROLLERS[@]}"; do
    if [ -f "$controller" ]; then
        echo -e "  ${GREEN}✅ $(basename $controller)${NC}"
    else
        echo -e "  ${RED}❌ $(basename $controller) NÃO EXISTE!${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# ═══════════════════════════════════════════════════════════════
# 2. VERIFICAR NODE.JS E NPM
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  2. Verificar Node.js e npm                                 ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}❌ Node.js NÃO INSTALADO!${NC}"
    ERRORS=$((ERRORS + 1))
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: ${NPM_VERSION}${NC}"
else
    echo -e "${RED}❌ npm NÃO INSTALADO!${NC}"
    ERRORS=$((ERRORS + 1))
fi

if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    echo -e "${GREEN}✅ PM2: ${PM2_VERSION}${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 não instalado (não é obrigatório)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# 3. VERIFICAR SE BACKEND ESTÁ RODANDO
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  3. Verificar se Backend está rodando                       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar porta 3001
if netstat -tuln 2>/dev/null | grep -q ':3001 '; then
    echo -e "${GREEN}✅ Porta 3001 está EM USO (backend rodando)${NC}"
    
    # Testar endpoint
    if command -v curl &> /dev/null; then
        echo ""
        echo -e "${CYAN}Testando endpoint /health:${NC}"
        HEALTH_RESPONSE=$(curl -s http://localhost:3001/health 2>/dev/null)
        
        if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
            echo -e "${GREEN}✅ Backend respondendo: ${HEALTH_RESPONSE}${NC}"
        else
            echo -e "${RED}❌ Backend não está respondendo corretamente${NC}"
            echo -e "${YELLOW}Resposta: ${HEALTH_RESPONSE}${NC}"
            ERRORS=$((ERRORS + 1))
        fi
        
        echo ""
        echo -e "${CYAN}Testando endpoint /api/server/info:${NC}"
        INFO_RESPONSE=$(curl -s http://localhost:3001/api/server/info 2>/dev/null)
        
        if echo "$INFO_RESPONSE" | grep -q "success"; then
            echo -e "${GREEN}✅ API /server/info respondendo${NC}"
        else
            echo -e "${RED}❌ API /server/info não está respondendo${NC}"
            echo -e "${YELLOW}Resposta: ${INFO_RESPONSE}${NC}"
            ERRORS=$((ERRORS + 1))
        fi
    fi
    
else
    echo -e "${RED}❌ Porta 3001 está LIVRE (backend NÃO está rodando!)${NC}"
    ERRORS=$((ERRORS + 1))
    
    # Verificar PM2
    if command -v pm2 &> /dev/null; then
        echo ""
        echo -e "${CYAN}Verificando PM2:${NC}"
        PM2_LIST=$(pm2 list 2>/dev/null | grep meumu-backend)
        
        if [ -n "$PM2_LIST" ]; then
            echo -e "${YELLOW}⚠️  Backend está no PM2 mas não rodando${NC}"
            echo "$PM2_LIST"
        else
            echo -e "${YELLOW}⚠️  Backend NÃO está no PM2${NC}"
        fi
    fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# 4. VERIFICAR SERVIDOR WEB
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  4. Verificar Servidor Web                                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Apache
if systemctl is-active --quiet apache2 2>/dev/null; then
    echo -e "${GREEN}✅ Apache rodando${NC}"
    WEBSERVER="apache"
elif systemctl is-active --quiet httpd 2>/dev/null; then
    echo -e "${GREEN}✅ Apache (httpd) rodando${NC}"
    WEBSERVER="apache"
# OpenLiteSpeed (CyberPanel)
elif systemctl is-active --quiet lsws 2>/dev/null; then
    echo -e "${GREEN}✅ OpenLiteSpeed rodando (CyberPanel)${NC}"
    WEBSERVER="openlitespeed"
else
    echo -e "${YELLOW}⚠️  Nenhum servidor web detectado${NC}"
    WARNINGS=$((WARNINGS + 1))
    WEBSERVER="unknown"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# 5. TESTAR PROXY REVERSO
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  5. Testar Proxy Reverso                                    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if command -v curl &> /dev/null; then
    # Pedir domínio
    echo -e "${CYAN}Digite seu domínio (ex: meumu.com) ou pressione Enter para pular:${NC}"
    read -p "> " DOMAIN
    
    if [ -n "$DOMAIN" ]; then
        echo ""
        echo -e "${CYAN}Testando http://${DOMAIN}/api/health:${NC}"
        PROXY_RESPONSE=$(curl -s http://${DOMAIN}/api/health 2>/dev/null)
        
        if echo "$PROXY_RESPONSE" | grep -q "healthy"; then
            echo -e "${GREEN}✅ Proxy funcionando! Backend acessível via domínio${NC}"
        elif echo "$PROXY_RESPONSE" | grep -q "<!DOCTYPE"; then
            echo -e "${RED}❌ PROXY NÃO CONFIGURADO!${NC}"
            echo -e "${YELLOW}O servidor está retornando HTML do React em vez de fazer proxy${NC}"
            ERRORS=$((ERRORS + 1))
        elif [ -z "$PROXY_RESPONSE" ]; then
            echo -e "${YELLOW}⚠️  Sem resposta (domínio pode não estar apontando para este servidor)${NC}"
            WARNINGS=$((WARNINGS + 1))
        else
            echo -e "${YELLOW}⚠️  Resposta inesperada: ${PROXY_RESPONSE}${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${YELLOW}Teste de proxy pulado${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  curl não instalado, não é possível testar${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# 6. VERIFICAR DATABASE
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  6. Verificar MySQL/MariaDB                                 ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✅ MySQL/MariaDB instalado${NC}"
    
    if systemctl is-active --quiet mysql 2>/dev/null || systemctl is-active --quiet mariadb 2>/dev/null; then
        echo -e "${GREEN}✅ MySQL/MariaDB rodando${NC}"
    else
        echo -e "${RED}❌ MySQL/MariaDB NÃO está rodando!${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  MySQL/MariaDB não encontrado${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════════════════

echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    RESUMO DO DIAGNÓSTICO                     ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}Estatísticas:${NC}"
echo -e "  Erros críticos: ${RED}${ERRORS}${NC}"
echo -e "  Avisos: ${YELLOW}${WARNINGS}${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              ✅ NENHUM ERRO CRÍTICO DETECTADO! ✅            ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Tudo parece estar funcionando!${NC}"
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Há ${WARNINGS} aviso(s) não crítico(s).${NC}"
    fi
else
    echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║            ❌ ${ERRORS} ERRO(S) CRÍTICO(S) ENCONTRADO(S)! ❌         ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Ações necessárias:${NC}"
    echo ""
    
    # Sugestões baseadas nos erros
    if [ ! -f "backend-nodejs/.env" ]; then
        echo -e "  ${CYAN}1.${NC} Execute o instalador: ${GREEN}http://meumu.com/install${NC}"
    fi
    
    if [ ! -d "backend-nodejs/node_modules" ]; then
        echo -e "  ${CYAN}2.${NC} Instale dependências: ${GREEN}cd backend-nodejs && npm install${NC}"
    fi
    
    if ! netstat -tuln 2>/dev/null | grep -q ':3001 '; then
        echo -e "  ${CYAN}3.${NC} Inicie o backend: ${GREEN}./iniciar-backend.sh${NC}"
    fi
    
    if echo "$PROXY_RESPONSE" | grep -q "<!DOCTYPE"; then
        echo -e "  ${CYAN}4.${NC} Configure proxy: ${GREEN}./configurar-cyberpanel.sh${NC}"
    fi
    
    if [ ! -f "dist/index.html" ]; then
        echo -e "  ${CYAN}5.${NC} Build do frontend: ${GREEN}npm run build${NC}"
    fi
fi

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}       MeuMU Online v3.0.0 - Diagnóstico Completo${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
