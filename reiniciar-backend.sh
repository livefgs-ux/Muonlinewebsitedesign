#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo -e "${CYAN}${BOLD}"
echo "═══════════════════════════════════════════════"
echo "   MeuMU Online - Reiniciar Backend"
echo "═══════════════════════════════════════════════"
echo -e "${NC}"
echo ""

BACKEND_DIR="/home/meumu.com/public_html/backend-nodejs"

# Verificar se existe
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend não encontrado: $BACKEND_DIR${NC}"
    exit 1
fi

cd "$BACKEND_DIR" || exit 1

# Verificar .env
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Arquivo .env não existe!${NC}"
    echo -e "${YELLOW}Execute primeiro o instalador: http://meumu.com/install${NC}"
    exit 1
fi

# Verificar node_modules
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules não existe!${NC}"
    echo -e "${CYAN}Instalando dependências...${NC}"
    npm install || { echo -e "${RED}❌ Erro ao instalar!${NC}"; exit 1; }
    echo -e "${GREEN}✅ Dependências instaladas!${NC}"
    echo ""
fi

echo -e "${CYAN}1. Parando processo antigo...${NC}"

# Matar TODOS os processos do backend
pm2 delete meumu-backend 2>/dev/null
pm2 delete all 2>/dev/null

# Matar processos Node.js na porta 3001
PID=$(lsof -ti:3001 2>/dev/null)
if [ ! -z "$PID" ]; then
    echo -e "${YELLOW}   Matando processo na porta 3001 (PID: $PID)${NC}"
    kill -9 $PID 2>/dev/null
fi

# Aguardar
sleep 2

echo -e "${GREEN}✅ Processos parados${NC}"
echo ""

# Testar manualmente primeiro
echo -e "${CYAN}2. Testando backend manualmente...${NC}"
echo -e "${YELLOW}   (aguarde 3 segundos)${NC}"
echo ""

# Rodar em background por 3 segundos para ver se há erros
timeout 3 node src/server.js &
sleep 3

# Verificar se rodou
if curl -s http://localhost:3001/api/server/health 2>/dev/null | grep -q "healthy"; then
    echo -e "${GREEN}✅ Backend funciona manualmente!${NC}"
    
    # Matar o teste
    pkill -f "node src/server.js"
    sleep 1
    
    echo ""
    echo -e "${CYAN}3. Iniciando com PM2...${NC}"
    
    # Iniciar com PM2
    pm2 start src/server.js --name meumu-backend
    pm2 save
    
    echo ""
    sleep 2
    
    # Verificar
    if pm2 status | grep -q "online"; then
        echo -e "${GREEN}✅ PM2 iniciado!${NC}"
        
        echo ""
        echo -e "${CYAN}4. Testando API...${NC}"
        sleep 2
        
        RESULT=$(curl -s http://localhost:3001/api/server/health 2>/dev/null)
        
        if echo "$RESULT" | grep -q "healthy"; then
            echo -e "${GREEN}${BOLD}"
            echo "╔══════════════════════════════════════════════╗"
            echo "║                                              ║"
            echo "║      ✅ BACKEND FUNCIONANDO! ✅             ║"
            echo "║                                              ║"
            echo "╚══════════════════════════════════════════════╝"
            echo -e "${NC}"
            echo ""
            echo -e "${CYAN}Resposta:${NC} ${RESULT:0:150}..."
            echo ""
            echo -e "${YELLOW}Próximo passo: Configurar proxy do OpenLiteSpeed${NC}"
            echo -e "${CYAN}Execute: ./fix-openlitespeed-proxy.sh${NC}"
        else
            echo -e "${RED}❌ API não respondeu corretamente${NC}"
            echo -e "${YELLOW}Logs:${NC}"
            pm2 logs meumu-backend --lines 20 --nostream
        fi
    else
        echo -e "${RED}❌ PM2 não iniciou corretamente${NC}"
        pm2 status
    fi
    
else
    echo -e "${RED}❌ Backend tem erros!${NC}"
    echo ""
    echo -e "${YELLOW}Erro ao rodar: node src/server.js${NC}"
    echo ""
    echo -e "${CYAN}Tentando ver o erro...${NC}"
    echo ""
    node src/server.js
fi

echo ""
