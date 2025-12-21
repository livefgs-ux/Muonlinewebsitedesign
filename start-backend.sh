#!/bin/bash

##############################################
# 🚀 START BACKEND - MeuMU Online
# Inicia o backend Node.js com PM2
##############################################

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 Iniciando Backend - MeuMU Online  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Detectar diretório do backend
if [ -d "/home/meumu.com/public_html/backend-nodejs" ]; then
    BACKEND_DIR="/home/meumu.com/public_html/backend-nodejs"
elif [ -d "./backend-nodejs" ]; then
    BACKEND_DIR="./backend-nodejs"
else
    echo -e "${RED}❌ Diretório backend-nodejs não encontrado!${NC}"
    exit 1
fi

cd "$BACKEND_DIR"
echo -e "${GREEN}📁 Diretório:${NC} $BACKEND_DIR"
echo ""

##############################################
# 1. Verificar Node.js
##############################################
echo -e "${YELLOW}[1/5]${NC} Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não instalado!${NC}"
    echo -e "Instale com: ${YELLOW}curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION}${NC}"
echo ""

##############################################
# 2. Verificar PM2
##############################################
echo -e "${YELLOW}[2/5]${NC} Verificando PM2..."
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 não instalado. Instalando...${NC}"
    npm install -g pm2
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PM2 instalado${NC}"
    else
        echo -e "${RED}❌ Erro ao instalar PM2${NC}"
        exit 1
    fi
else
    PM2_VERSION=$(pm2 -v)
    echo -e "${GREEN}✅ PM2 ${PM2_VERSION}${NC}"
fi
echo ""

##############################################
# 3. Verificar dependências
##############################################
echo -e "${YELLOW}[3/5]${NC} Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules não encontrado. Instalando...${NC}"
    npm install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependências instaladas${NC}"
    else
        echo -e "${RED}❌ Erro ao instalar dependências${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Dependências OK${NC}"
fi
echo ""

##############################################
# 4. Verificar .env
##############################################
echo -e "${YELLOW}[4/5]${NC} Verificando configuração..."
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo -e "${YELLOW}Execute o Setup Wizard ou crie manualmente:${NC}"
    echo -e "  cp .env.example .env"
    echo -e "  nano .env"
    exit 1
else
    echo -e "${GREEN}✅ .env configurado${NC}"
fi
echo ""

##############################################
# 5. Iniciar com PM2
##############################################
echo -e "${YELLOW}[5/5]${NC} Iniciando backend..."

# Parar processo antigo se existir
pm2 delete meumu-backend 2>/dev/null

# Iniciar novo processo
pm2 start src/server.js --name meumu-backend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend iniciado!${NC}"
    
    # Salvar configuração do PM2
    pm2 save
    
    # Configurar PM2 para iniciar no boot (apenas uma vez)
    if ! systemctl is-enabled pm2-$USER &> /dev/null; then
        pm2 startup | grep -v PM2 | grep sudo | bash
    fi
    
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  ✅ Backend Rodando!                   ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
    
    # Mostrar status
    pm2 status
    
    echo ""
    echo -e "${GREEN}📊 Comandos úteis:${NC}"
    echo -e "  ${YELLOW}pm2 status${NC}          - Ver status"
    echo -e "  ${YELLOW}pm2 logs meumu-backend${NC} - Ver logs"
    echo -e "  ${YELLOW}pm2 restart meumu-backend${NC} - Reiniciar"
    echo -e "  ${YELLOW}pm2 stop meumu-backend${NC} - Parar"
    echo ""
    
    # Testar API
    sleep 2
    echo -e "${CYAN}🧪 Testando API...${NC}"
    HEALTH=$(curl -s http://localhost:3001/health)
    
    if echo "$HEALTH" | grep -q "healthy"; then
        echo -e "${GREEN}✅ API respondendo corretamente!${NC}"
        echo "$HEALTH" | python3 -m json.tool 2>/dev/null | head -10
    else
        echo -e "${RED}❌ API não respondeu corretamente${NC}"
        echo -e "Verifique os logs: ${YELLOW}pm2 logs meumu-backend${NC}"
    fi
else
    echo -e "${RED}❌ Erro ao iniciar backend${NC}"
    echo -e "Verifique os logs: ${YELLOW}pm2 logs meumu-backend${NC}"
    exit 1
fi

echo ""
