#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# APLICAR VERSÃO 550 - CORREÇÃO SEASON 19 DB STRUCTURE
# ═══════════════════════════════════════════════════════════════

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${CYAN}${BOLD}"
echo "═══════════════════════════════════════════════════════════════"
echo "  APLICANDO VERSÃO 550 - CORREÇÃO SEASON 19 DB STRUCTURE"
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"
echo ""
echo -e "${YELLOW}📋 Mudanças:${NC}"
echo "  ✅ authController.js - Campos Season 19 (account, email, guid)"
echo "  ✅ charactersController.js - Campos Season 19 (name, account_id, race, level, etc.)"
echo "  ✅ Removido fallback para Season 6"
echo "  ✅ Corrigidos erros 404/500 nos endpoints"
echo ""
echo -e "${YELLOW}🎯 Endpoints afetados:${NC}"
echo "  • GET /api/auth/account"
echo "  • GET /api/characters"
echo "  • POST /api/characters/:name/distribute-points"
echo "  • POST /api/characters/:name/reset"
echo ""

read -p "$(echo -e ${YELLOW}"Continuar? [Y/n] "${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ ! -z $REPLY ]]; then
    echo -e "${RED}❌ Cancelado pelo usuário${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  ETAPA 1/4: BACKUP${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

BACKUP_DIR="/home/meumu.com/backups/v549_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}📦 Fazendo backup dos controllers...${NC}"
cp backend-nodejs/src/controllers/authController.js "$BACKUP_DIR/"
cp backend-nodejs/src/controllers/charactersController.js "$BACKUP_DIR/"

echo -e "${GREEN}✅ Backup salvo em: $BACKUP_DIR${NC}"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  ETAPA 2/4: VERIFICAR ESTRUTURA DO BANCO${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

echo -e "${YELLOW}🔍 Verificando estrutura da tabela accounts...${NC}"
sudo mysql -e "USE muonline; DESCRIBE accounts;" > /tmp/accounts_structure.txt
if grep -q "account" /tmp/accounts_structure.txt; then
    echo -e "${GREEN}✅ Estrutura Season 19 detectada (coluna 'account')${NC}"
else
    echo -e "${RED}❌ ERRO: Estrutura Season 6 detectada (coluna 'memb___id')${NC}"
    echo -e "${RED}   Este update é apenas para Season 19 DV Teams!${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Verificando estrutura da tabela character_info...${NC}"
sudo mysql -e "USE muonline; DESCRIBE character_info;" > /tmp/character_info_structure.txt
if grep -q "account_id" /tmp/character_info_structure.txt; then
    echo -e "${GREEN}✅ Estrutura Season 19 detectada (coluna 'account_id')${NC}"
else
    echo -e "${RED}❌ ERRO: Estrutura Season 6 detectada (coluna 'AccountID')${NC}"
    echo -e "${RED}   Este update é apenas para Season 19 DV Teams!${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  ETAPA 3/4: ATUALIZAR CONTROLLERS${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

echo -e "${YELLOW}🔄 Aplicando correções...${NC}"

# Os arquivos já foram atualizados via IDE
# Aqui apenas validamos se as mudanças foram aplicadas

if grep -q "account as username" backend-nodejs/src/controllers/authController.js; then
    echo -e "${GREEN}✅ authController.js - Campos Season 19 OK${NC}"
else
    echo -e "${RED}❌ ERRO: authController.js não atualizado!${NC}"
    exit 1
fi

if grep -q "account_id" backend-nodejs/src/controllers/charactersController.js; then
    echo -e "${GREEN}✅ charactersController.js - Campos Season 19 OK${NC}"
else
    echo -e "${RED}❌ ERRO: charactersController.js não atualizado!${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  ETAPA 4/4: REINICIAR BACKEND${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

cd backend-nodejs

echo -e "${YELLOW}🔄 Reiniciando PM2...${NC}"
pm2 restart meumu-backend

echo -e "${YELLOW}⏳ Aguardando 3 segundos...${NC}"
sleep 3

echo -e "${YELLOW}📊 Status do PM2:${NC}"
pm2 status

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  TESTES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

echo -e "${YELLOW}🧪 Testando endpoints...${NC}"

# Test health
echo -e "\n${CYAN}1. Health Check:${NC}"
curl -s http://localhost:3001/api/health | jq . 2>/dev/null || echo "OK (sem jq instalado)"

# Test auth/account (precisa de token)
echo -e "\n${CYAN}2. GET /api/auth/account:${NC}"
echo -e "${YELLOW}   (precisa estar logado - teste manual)${NC}"

# Test characters (precisa de token)
echo -e "\n${CYAN}3. GET /api/characters:${NC}"
echo -e "${YELLOW}   (precisa estar logado - teste manual)${NC}"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  ✅ VERSÃO 550 APLICADA COM SUCESSO!${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📝 Próximos passos:${NC}"
echo "  1. Faça login no site"
echo "  2. Vá para o Dashboard"
echo "  3. Verifique se os dados da conta aparecem"
echo "  4. Verifique se a lista de personagens carrega"
echo ""
echo -e "${YELLOW}📂 Logs:${NC}"
echo "  pm2 logs meumu-backend --lines 50"
echo ""
echo -e "${YELLOW}🔙 Rollback (se necessário):${NC}"
echo "  cp $BACKUP_DIR/* backend-nodejs/src/controllers/"
echo "  pm2 restart meumu-backend"
echo ""
echo -e "${GREEN}${BOLD}Versão 550 instalada! 🎉${NC}"
