#!/bin/bash

##############################################
# 🚀 START - MeuMU Online
##############################################

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear

echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║    ███╗   ███╗███████╗██╗   ██╗███╗   ███╗██╗   ██╗  ║
║    ████╗ ████║██╔════╝██║   ██║████╗ ████║██║   ██║  ║
║    ██╔████╔██║█████╗  ██║   ██║██╔████╔██║██║   ██║  ║
║    ██║╚██╔╝██║██╔══╝  ██║   ██║██║╚██╔╝██║██║   ██║  ║
║    ██║ ╚═╝ ██║███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝  ║
║    ╚═╝     ╚═╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝   ║
║                                                       ║
║           Season 19-2-3 - Épico                      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

PROJECT_DIR="/home/meumu.com/public_html"

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🎛️  MENU PRINCIPAL${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}🚀 PRODUÇÃO:${NC}"
echo -e "  ${GREEN}[1]${NC} Deploy de Produção (build + deploy)"
echo -e "  ${GREEN}[2]${NC} Iniciar Backend (PM2)"
echo -e "  ${GREEN}[3]${NC} Reiniciar Servidor Web"
echo ""
echo -e "${YELLOW}🛠️  DESENVOLVIMENTO:${NC}"
echo -e "  ${BLUE}[4]${NC} Dev Mode Frontend (Vite)"
echo -e "  ${BLUE}[5]${NC} Dev Mode Backend"
echo ""
echo -e "${YELLOW}📊 MONITORAMENTO:${NC}"
echo -e "  ${CYAN}[6]${NC} Ver Status (PM2)"
echo -e "  ${CYAN}[7]${NC} Ver Logs"
echo -e "  ${CYAN}[8]${NC} Diagnóstico Completo"
echo ""
echo -e "${YELLOW}🔧 MANUTENÇÃO:${NC}"
echo -e "  ${YELLOW}[9]${NC} Parar Backend"
echo -e "  ${YELLOW}[10]${NC} Limpar Cache"
echo ""
echo -e "  ${RED}[0]${NC} Sair"
echo ""
echo -ne "${CYAN}Digite sua escolha: ${NC}"
read choice

case $choice in
    1)
        echo -e "${GREEN}🚀 Executando deploy de produção...${NC}"
        bash $PROJECT_DIR/deploy-production.sh
        ;;
    2)
        echo -e "${GREEN}🔌 Iniciando backend...${NC}"
        cd $PROJECT_DIR/backend-nodejs
        pm2 start src/server.js --name meumu-backend --watch --ignore-watch="node_modules"
        pm2 save
        echo -e "${GREEN}✅ Backend iniciado!${NC}"
        pm2 status
        ;;
    3)
        echo -e "${YELLOW}🔄 Reiniciando servidor web...${NC}"
        if systemctl is-active --quiet lsws 2>/dev/null; then
            sudo systemctl restart lsws
            echo -e "${GREEN}✅ LiteSpeed reiniciado${NC}"
        elif systemctl is-active --quiet apache2 2>/dev/null; then
            sudo systemctl restart apache2
            echo -e "${GREEN}✅ Apache reiniciado${NC}"
        elif systemctl is-active --quiet nginx 2>/dev/null; then
            sudo systemctl restart nginx
            echo -e "${GREEN}✅ Nginx reiniciado${NC}"
        else
            echo -e "${RED}❌ Nenhum servidor web detectado${NC}"
        fi
        ;;
    4)
        echo -e "${BLUE}⚠️  MODO DESENVOLVIMENTO${NC}"
        echo -e "${YELLOW}Iniciando Vite dev server na porta 5173...${NC}"
        cd $PROJECT_DIR
        npm run dev
        ;;
    5)
        echo -e "${BLUE}⚠️  MODO DESENVOLVIMENTO${NC}"
        echo -e "${YELLOW}Iniciando backend em modo dev...${NC}"
        cd $PROJECT_DIR/backend-nodejs
        npm start
        ;;
    6)
        echo -e "${CYAN}📊 Status dos serviços:${NC}"
        pm2 status
        echo ""
        echo -e "${BLUE}Informações:${NC}"
        echo -e "  Backend: http://localhost:3001/health"
        echo -e "  Frontend: https://meumu.com"
        ;;
    7)
        echo -e "${CYAN}📝 Logs (Ctrl+C para sair):${NC}"
        pm2 logs
        ;;
    8)
        echo -e "${CYAN}🔍 Executando diagnóstico...${NC}"
        bash $PROJECT_DIR/diagnostico.sh
        ;;
    9)
        echo -e "${YELLOW}🛑 Parando backend...${NC}"
        pm2 stop meumu-backend
        echo -e "${GREEN}✅ Backend parado${NC}"
        pm2 status
        ;;
    10)
        echo -e "${YELLOW}🧹 Limpando cache...${NC}"
        cd $PROJECT_DIR
        rm -rf .vite dist node_modules/.vite
        echo -e "${GREEN}✅ Cache limpo${NC}"
        echo -e "${BLUE}💡 Execute 'npm run build' para rebuild${NC}"
        ;;
    0)
        echo -e "${CYAN}👋 Até logo!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Opção inválida!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ CONCLUÍDO!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
