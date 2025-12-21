#!/bin/bash

##############################################
# 🛑 STOP SCRIPT - MeuMU Online
##############################################

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🛑 MeuMU Online - Stop Script        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Parando serviços...${NC}"
pm2 stop all

echo -e "${GREEN}✅ Todos os serviços foram parados!${NC}"
echo ""

echo -e "${YELLOW}Status:${NC}"
pm2 status
echo ""

echo -e "${BLUE}💡 Para iniciar novamente:${NC} ${GREEN}bash deploy.sh${NC}"
echo ""
