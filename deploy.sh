#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Script de Deploy Automático
# 
# @version 2.0.0
# @author MeuMU Team
# @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
#═══════════════════════════════════════════════════════════════════

set -e  # Exit on error

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Banner
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║               🎮 MeuMU Online - Deploy Script 🎮              ║"
echo "║                    Season 19-2-3 Épico                       ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto!${NC}"
    exit 1
fi

# Verificar Node.js
echo -e "${BLUE}🔍 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não instalado! Instale: https://nodejs.org${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} encontrado${NC}"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não instalado!${NC}"
    exit 1
fi

# Menu
echo ""
echo -e "${YELLOW}Escolha o tipo de deploy:${NC}"
echo "1) Desenvolvimento (dev server)"
echo "2) Produção Local (PM2)"
echo "3) Produção VPS/Cloud (build + PM2)"
echo "4) Apenas Build"
echo "5) Apenas Backend"
echo ""
read -p "Opção: " DEPLOY_OPTION

case $DEPLOY_OPTION in
    1)
        # Desenvolvimento
        echo -e "${BLUE}🚀 Iniciando modo desenvolvimento...${NC}"
        
        # Frontend
        echo -e "${BLUE}📦 Instalando dependências do frontend...${NC}"
        npm install
        
        # Backend
        echo -e "${BLUE}📦 Instalando dependências do backend...${NC}"
        cd backend-nodejs
        npm install
        cd ..
        
        echo ""
        echo -e "${GREEN}✅ Dependências instaladas!${NC}"
        echo ""
        echo -e "${YELLOW}Para iniciar:${NC}"
        echo -e "${BLUE}Frontend:${NC} npm run dev"
        echo -e "${BLUE}Backend:${NC}  cd backend-nodejs && npm start"
        ;;
        
    2)
        # Produção Local
        echo -e "${BLUE}🚀 Deploy para produção local...${NC}"
        
        # Verificar PM2
        if ! command -v pm2 &> /dev/null; then
            echo -e "${YELLOW}⚠️  PM2 não instalado. Instalando...${NC}"
            npm install -g pm2
        fi
        
        # Build frontend
        echo -e "${BLUE}🔨 Buildando frontend...${NC}"
        npm install
        npm run build
        echo -e "${GREEN}✅ Frontend buildado em /dist${NC}"
        
        # Backend
        echo -e "${BLUE}🔨 Configurando backend...${NC}"
        cd backend-nodejs
        npm install
        
        # Parar PM2 se já estiver rodando
        pm2 delete meumu-backend 2>/dev/null || true
        
        # Iniciar com PM2
        pm2 start src/server.js --name meumu-backend
        pm2 save
        
        cd ..
        
        echo ""
        echo -e "${GREEN}✅ Deploy concluído!${NC}"
        echo ""
        echo -e "${BLUE}📊 Status do backend:${NC}"
        pm2 status
        echo ""
        echo -e "${YELLOW}⚠️  Configure seu servidor web para apontar para /dist${NC}"
        echo -e "${BLUE}Apache:${NC}   DocumentRoot /caminho/para/dist"
        echo -e "${BLUE}Nginx:${NC}    root /caminho/para/dist;"
        ;;
        
    3)
        # Produção VPS
        echo -e "${BLUE}🚀 Deploy para VPS/Cloud...${NC}"
        
        # Verificar .env
        if [ ! -f "backend-nodejs/.env" ]; then
            echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
            echo -e "${YELLOW}Execute o instalador primeiro: http://seudominio.com/install${NC}"
            exit 1
        fi
        
        # Verificar PM2
        if ! command -v pm2 &> /dev/null; then
            echo -e "${YELLOW}⚠️  PM2 não instalado. Instalando...${NC}"
            npm install -g pm2
        fi
        
        # Build frontend
        echo -e "${BLUE}🔨 Buildando frontend...${NC}"
        npm install
        npm run build
        echo -e "${GREEN}✅ Frontend buildado${NC}"
        
        # Backend
        echo -e "${BLUE}🔨 Configurando backend...${NC}"
        cd backend-nodejs
        npm install --production
        
        # Parar PM2
        pm2 delete meumu-backend 2>/dev/null || true
        
        # Iniciar com PM2
        pm2 start src/server.js --name meumu-backend -i max
        pm2 save
        
        # Auto-start
        pm2 startup | tail -n 1 > /tmp/pm2-startup.sh
        chmod +x /tmp/pm2-startup.sh
        
        cd ..
        
        # Deletar /install
        if [ -d "install" ]; then
            echo -e "${YELLOW}⚠️  Deletar pasta /install? (s/N)${NC}"
            read -p "Opção: " DELETE_INSTALL
            if [ "$DELETE_INSTALL" = "s" ] || [ "$DELETE_INSTALL" = "S" ]; then
                rm -rf install/
                echo -e "${GREEN}✅ Pasta /install deletada${NC}"
            fi
        fi
        
        # Permissões
        echo -e "${BLUE}🔒 Ajustando permissões...${NC}"
        chmod 640 backend-nodejs/.env
        chmod 640 config.php 2>/dev/null || true
        
        echo ""
        echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                  ✅ DEPLOY CONCLUÍDO! ✅                      ║${NC}"
        echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${BLUE}📊 Status dos serviços:${NC}"
        pm2 status
        echo ""
        echo -e "${YELLOW}📝 Próximos passos:${NC}"
        echo "1. Configurar servidor web (Apache/Nginx)"
        echo "2. Apontar DocumentRoot para /dist"
        echo "3. Configurar SSL (certbot)"
        echo "4. Testar: curl http://localhost:3001/api/health"
        echo ""
        echo -e "${BLUE}Executar comando PM2 startup:${NC}"
        cat /tmp/pm2-startup.sh
        ;;
        
    4)
        # Apenas Build
        echo -e "${BLUE}🔨 Buildando apenas frontend...${NC}"
        npm install
        npm run build
        echo ""
        echo -e "${GREEN}✅ Build concluído em /dist${NC}"
        echo ""
        echo -e "${BLUE}Arquivos criados:${NC}"
        ls -lh dist/
        ;;
        
    5)
        # Apenas Backend
        echo -e "${BLUE}🔨 Configurando apenas backend...${NC}"
        
        # Verificar .env
        if [ ! -f "backend-nodejs/.env" ]; then
            echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
            echo -e "${YELLOW}Execute o instalador primeiro.${NC}"
            exit 1
        fi
        
        cd backend-nodejs
        npm install
        
        echo ""
        echo -e "${YELLOW}Como deseja iniciar o backend?${NC}"
        echo "1) PM2 (recomendado)"
        echo "2) Node direto (npm start)"
        echo ""
        read -p "Opção: " BACKEND_OPTION
        
        if [ "$BACKEND_OPTION" = "1" ]; then
            if ! command -v pm2 &> /dev/null; then
                echo -e "${YELLOW}Instalando PM2...${NC}"
                npm install -g pm2
            fi
            
            pm2 delete meumu-backend 2>/dev/null || true
            pm2 start src/server.js --name meumu-backend
            pm2 save
            
            echo ""
            echo -e "${GREEN}✅ Backend iniciado com PM2${NC}"
            pm2 status
        else
            echo ""
            echo -e "${GREEN}✅ Backend configurado${NC}"
            echo -e "${BLUE}Iniciar com:${NC} npm start"
        fi
        
        cd ..
        ;;
        
    *)
        echo -e "${RED}❌ Opção inválida!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}       🎮 MeuMU Online v2.0.0 - Deploy Finalizado! 🎮${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
