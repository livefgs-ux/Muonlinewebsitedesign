#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Iniciar TUDO (Frontend + Backend)
# Script All-in-One para resolver todos os problemas
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
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║            🎮 MeuMU Online - Iniciar TUDO 🎮                ║
║               Season 19-2-3 Épico                            ║
║                                                              ║
║  Este script vai configurar e iniciar:                       ║
║  • Frontend React (build + Apache)                           ║
║  • Backend Node.js (PM2 ou Standalone)                       ║
║  • Verificar MySQL                                           ║
║  • Testar tudo                                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""

ERRORS=0
WARNINGS=0

# ═══════════════════════════════════════════════════════════════
# PASSO 1: VERIFICAR REQUISITOS
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 1: Verificar Requisitos                              ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Node.js
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
else
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo -e "${YELLOW}Instale: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs${NC}"
    ERRORS=$((ERRORS + 1))
fi

# npm
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
else
    echo -e "${RED}❌ npm não encontrado!${NC}"
    ERRORS=$((ERRORS + 1))
fi

# MySQL
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✅ MySQL/MariaDB instalado${NC}"
else
    echo -e "${YELLOW}⚠️  MySQL/MariaDB não encontrado${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Apache
if command -v apache2 &> /dev/null || command -v httpd &> /dev/null; then
    echo -e "${GREEN}✅ Apache instalado${NC}"
else
    echo -e "${YELLOW}⚠️  Apache não encontrado${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ Erros encontrados! Corrija antes de continuar.${NC}"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
# PASSO 2: BUILDAR FRONTEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 2: Buildar Frontend React                            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo -e "${YELLOW}Pasta /dist já existe.${NC}"
    echo ""
    read -p "Rebuildar? (s/N): " REBUILD
    
    if [[ "$REBUILD" =~ ^[Ss]$ ]]; then
        echo ""
        echo -e "${CYAN}Instalando dependências do frontend...${NC}"
        npm install || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
        
        echo ""
        echo -e "${CYAN}Buildando React...${NC}"
        npm run build || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
        
        echo -e "${GREEN}✅ Build concluído!${NC}"
    else
        echo -e "${GREEN}✅ Usando build existente${NC}"
    fi
else
    echo -e "${CYAN}Instalando dependências do frontend...${NC}"
    npm install || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
    
    echo ""
    echo -e "${CYAN}Buildando React...${NC}"
    npm run build || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
    
    echo -e "${GREEN}✅ Build concluído!${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 3: VERIFICAR BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 3: Configurar Backend Node.js                        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ ! -d "backend-nodejs" ]; then
    echo -e "${RED}❌ Pasta backend-nodejs não encontrada!${NC}"
    exit 1
fi

if [ ! -f "backend-nodejs/.env" ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo -e "${YELLOW}Execute o instalador: http://meumu.com/install${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pasta backend-nodejs encontrada${NC}"
echo -e "${GREEN}✅ Arquivo .env existe${NC}"
echo ""

# Instalar dependências
cd backend-nodejs

if [ ! -d "node_modules" ]; then
    echo -e "${CYAN}Instalando dependências do backend...${NC}"
    npm install || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
    echo -e "${GREEN}✅ Dependências instaladas!${NC}"
else
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
fi

cd ..

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 4: INICIAR BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 4: Iniciar Backend                                   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se já está rodando
if netstat -tuln 2>/dev/null | grep -q ':3001 '; then
    echo -e "${YELLOW}⚠️  Backend já está rodando na porta 3001${NC}"
    echo ""
    read -p "Reiniciar? (s/N): " RESTART
    
    if [[ "$RESTART" =~ ^[Ss]$ ]]; then
        if command -v pm2 &> /dev/null; then
            pm2 restart meumu-backend 2>/dev/null || pm2 delete meumu-backend 2>/dev/null
        else
            echo -e "${YELLOW}Mate o processo manualmente e execute novamente.${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ Backend já rodando, continuando...${NC}"
        BACKEND_STARTED=true
    fi
fi

if [ -z "$BACKEND_STARTED" ]; then
    echo -e "${CYAN}Como deseja iniciar o backend?${NC}"
    echo ""
    echo "  1) PM2 (Recomendado)"
    echo "  2) Node Standalone"
    echo ""
    read -p "Escolha (1-2): " BACKEND_OPTION
    
    case $BACKEND_OPTION in
        1)
            # Verificar/instalar PM2
            if ! command -v pm2 &> /dev/null; then
                echo ""
                echo -e "${YELLOW}Instalando PM2...${NC}"
                sudo npm install -g pm2 || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
            fi
            
            echo ""
            echo -e "${CYAN}Iniciando backend com PM2...${NC}"
            
            cd backend-nodejs
            pm2 delete meumu-backend 2>/dev/null
            pm2 start src/server.js --name meumu-backend || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
            pm2 save
            cd ..
            
            echo -e "${GREEN}✅ Backend iniciado com PM2!${NC}"
            BACKEND_STARTED=true
            ;;
            
        2)
            echo ""
            echo -e "${CYAN}Iniciando backend em background...${NC}"
            
            cd backend-nodejs
            nohup npm start > ../backend.log 2>&1 &
            BACKEND_PID=$!
            cd ..
            
            echo -e "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"
            echo -e "${YELLOW}Logs em: backend.log${NC}"
            BACKEND_STARTED=true
            ;;
            
        *)
            echo -e "${RED}Opção inválida!${NC}"
            exit 1
            ;;
    esac
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 5: TESTAR TUDO
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 5: Testar Instalação                                 ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}Aguardando backend inicializar...${NC}"
sleep 3

# Testar backend
if command -v curl &> /dev/null; then
    HEALTH_CHECK=$(curl -s http://localhost:3001/api/health 2>/dev/null)
    
    if echo "$HEALTH_CHECK" | grep -q "ok"; then
        echo -e "${GREEN}✅ Backend respondendo: ${HEALTH_CHECK}${NC}"
    else
        echo -e "${RED}❌ Backend não está respondendo!${NC}"
        echo -e "${YELLOW}Verifique os logs:${NC}"
        if command -v pm2 &> /dev/null; then
            pm2 logs meumu-backend --lines 20 --nostream
        else
            tail -n 20 backend.log
        fi
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  curl não encontrado, pulando teste${NC}"
fi

echo ""

# Verificar arquivos
echo -e "${CYAN}Verificando arquivos:${NC}"
[ -f "dist/index.html" ] && echo -e "${GREEN}✅ dist/index.html${NC}" || { echo -e "${RED}❌ dist/index.html${NC}"; ERRORS=$((ERRORS + 1)); }
[ -d "dist/assets" ] && echo -e "${GREEN}✅ dist/assets/${NC}" || { echo -e "${RED}❌ dist/assets/${NC}"; ERRORS=$((ERRORS + 1)); }
[ -f "dist/.htaccess" ] && echo -e "${GREEN}✅ dist/.htaccess${NC}" || { echo -e "${YELLOW}⚠️  dist/.htaccess (será criado)${NC}"; }
[ -f "backend-nodejs/.env" ] && echo -e "${GREEN}✅ backend-nodejs/.env${NC}" || { echo -e "${RED}❌ backend-nodejs/.env${NC}"; ERRORS=$((ERRORS + 1)); }

echo ""

# ═══════════════════════════════════════════════════════════════
# RESULTADO FINAL
# ═══════════════════════════════════════════════════════════════

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    ✅ TUDO PRONTO! ✅                        ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${PURPLE}🎮 MeuMU Online está RODANDO! 🎮${NC}"
    echo ""
    echo -e "${CYAN}Próximos passos:${NC}"
    echo ""
    echo -e "  1. ${YELLOW}Acesse o site:${NC} ${CYAN}http://meumu.com${NC}"
    echo -e "  2. ${YELLOW}Limpe o cache:${NC} Ctrl+Shift+R no navegador"
    echo -e "  3. ${YELLOW}Abra o console:${NC} F12 → Verifique se não há erros"
    echo ""
    echo -e "${CYAN}Comandos úteis:${NC}"
    
    if command -v pm2 &> /dev/null; then
        echo -e "  • ${YELLOW}pm2 status${NC} - Ver status do backend"
        echo -e "  • ${YELLOW}pm2 logs meumu-backend${NC} - Ver logs"
        echo -e "  • ${YELLOW}pm2 restart meumu-backend${NC} - Reiniciar"
    else
        echo -e "  • ${YELLOW}tail -f backend.log${NC} - Ver logs"
        echo -e "  • ${YELLOW}kill $BACKEND_PID${NC} - Parar backend"
    fi
    
    echo ""
    echo -e "${RED}⚠️  IMPORTANTE: Delete a pasta /install por segurança!${NC}"
    echo -e "${YELLOW}   rm -rf install/${NC}"
    echo ""
    
else
    echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║            ❌ ERROS DETECTADOS (${ERRORS}) ❌                      ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Corrija os erros acima e execute novamente.${NC}"
    echo ""
fi

echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}       MeuMU Online v3.0.0 - All-in-One Setup${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
