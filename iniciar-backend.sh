#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Iniciar Backend Node.js
# 
# @version 1.0.0
# @author MeuMU Team
#═══════════════════════════════════════════════════════════════════

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║        🚀 MeuMU Online - Iniciar Backend 🚀                 ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo ""
    echo -e "${YELLOW}Instale o Node.js primeiro:${NC}"
    echo "  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
echo ""

# Ir para pasta do backend
if [ ! -d "backend-nodejs" ]; then
    echo -e "${RED}❌ Pasta backend-nodejs não encontrada!${NC}"
    echo -e "${YELLOW}Você está na pasta correta?${NC}"
    echo -e "${CYAN}Caminho atual: $(pwd)${NC}"
    exit 1
fi

cd backend-nodejs

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo ""
    echo -e "${YELLOW}Execute o instalador primeiro:${NC}"
    echo "  http://meumu.com/install"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Arquivo .env encontrado${NC}"
echo ""

# Instalar dependências se node_modules não existir
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependências do backend...${NC}"
    npm install
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro ao instalar dependências!${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Dependências instaladas!${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
    echo ""
fi

# Perguntar como iniciar
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Como deseja iniciar o backend?${NC}"
echo ""
echo "  1) ${GREEN}PM2${NC} (Recomendado - reinicia automaticamente, roda em background)"
echo "  2) ${BLUE}Node Standalone${NC} (Simples - mantém terminal aberto)"
echo "  3) ${PURPLE}Apenas verificar status${NC}"
echo "  4) ${RED}Cancelar${NC}"
echo ""
read -p "Escolha (1-4): " OPTION

case $OPTION in
    1)
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}Iniciando com PM2...${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
        echo ""
        
        # Verificar se PM2 está instalado
        if ! command -v pm2 &> /dev/null; then
            echo -e "${YELLOW}PM2 não encontrado. Instalando...${NC}"
            sudo npm install -g pm2
            
            if [ $? -ne 0 ]; then
                echo -e "${RED}❌ Erro ao instalar PM2!${NC}"
                echo -e "${YELLOW}Tente com sudo ou escolha opção 2 (Node Standalone)${NC}"
                exit 1
            fi
        fi
        
        # Parar se já estiver rodando
        pm2 delete meumu-backend 2>/dev/null
        
        # Iniciar
        pm2 start src/server.js --name meumu-backend
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Erro ao iniciar backend com PM2!${NC}"
            exit 1
        fi
        
        # Salvar para reiniciar automaticamente
        pm2 save
        
        # Configurar para iniciar no boot
        pm2 startup | tail -n 1 | bash
        
        echo ""
        echo -e "${GREEN}✅ Backend iniciado com PM2!${NC}"
        echo ""
        echo -e "${CYAN}Comandos úteis:${NC}"
        echo -e "  ${YELLOW}pm2 status${NC}           - Ver status"
        echo -e "  ${YELLOW}pm2 logs meumu-backend${NC} - Ver logs em tempo real"
        echo -e "  ${YELLOW}pm2 restart meumu-backend${NC} - Reiniciar"
        echo -e "  ${YELLOW}pm2 stop meumu-backend${NC} - Parar"
        echo ""
        
        # Mostrar logs
        echo -e "${CYAN}Mostrando logs (Ctrl+C para sair):${NC}"
        echo ""
        pm2 logs meumu-backend
        ;;
        
    2)
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}Iniciando com Node Standalone...${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  O backend vai rodar neste terminal.${NC}"
        echo -e "${YELLOW}⚠️  Não feche esta janela!${NC}"
        echo -e "${YELLOW}⚠️  Para parar: Ctrl+C${NC}"
        echo ""
        echo -e "${CYAN}Iniciando em 3 segundos...${NC}"
        sleep 3
        
        # Iniciar
        npm start
        ;;
        
    3)
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}Verificando status...${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
        echo ""
        
        # Verificar PM2
        if command -v pm2 &> /dev/null; then
            echo -e "${CYAN}Status PM2:${NC}"
            pm2 list | grep meumu-backend
            echo ""
        fi
        
        # Verificar porta 3001
        if netstat -tuln 2>/dev/null | grep -q ':3001 '; then
            echo -e "${GREEN}✅ Porta 3001 está em uso (backend rodando)${NC}"
            
            # Testar endpoint
            if command -v curl &> /dev/null; then
                echo ""
                echo -e "${CYAN}Testando endpoint /api/health:${NC}"
                curl -s http://localhost:3001/api/health
                echo ""
            fi
        else
            echo -e "${RED}❌ Porta 3001 está LIVRE (backend NÃO está rodando)${NC}"
        fi
        
        echo ""
        ;;
        
    4)
        echo ""
        echo -e "${YELLOW}Cancelado.${NC}"
        exit 0
        ;;
        
    *)
        echo ""
        echo -e "${RED}Opção inválida!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                     BACKEND RODANDO! ✅                      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Testar backend
echo -e "${CYAN}Testando backend...${NC}"
sleep 2

HEALTH_CHECK=$(curl -s http://localhost:3001/api/health 2>/dev/null)

if echo "$HEALTH_CHECK" | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend respondendo: ${HEALTH_CHECK}${NC}"
    echo ""
    echo -e "${PURPLE}🎮 Agora acesse o site:${NC}"
    echo -e "${CYAN}   http://meumu.com${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Limpe o cache do navegador: Ctrl+Shift+R${NC}"
else
    echo -e "${RED}❌ Backend não está respondendo!${NC}"
    echo ""
    echo -e "${YELLOW}Verifique os logs:${NC}"
    echo -e "${CYAN}   pm2 logs meumu-backend${NC}"
    echo -e "${CYAN}   OU veja a saída acima${NC}"
fi

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}       MeuMU Online - Backend Configurado${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
