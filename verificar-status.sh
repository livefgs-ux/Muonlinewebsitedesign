#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Verificador de Status
# Verifica se tudo está funcionando corretamente
# 
# @version 2.0.1
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
echo "║       🔍 MeuMU Online - Verificador de Status 🔍            ║"
echo "║                  Season 19-2-3 Épico                         ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Contadores
TOTAL=0
SUCCESS=0
WARNING=0
ERROR=0

# Função de verificação
check() {
    local name="$1"
    local command="$2"
    local type="${3:-critical}"
    
    TOTAL=$((TOTAL + 1))
    echo -ne "${CYAN}🔍 ${name}...${NC} "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        SUCCESS=$((SUCCESS + 1))
        return 0
    else
        if [ "$type" = "critical" ]; then
            echo -e "${RED}❌ ERRO${NC}"
            ERROR=$((ERROR + 1))
        else
            echo -e "${YELLOW}⚠️  AVISO${NC}"
            WARNING=$((WARNING + 1))
        fi
        return 1
    fi
}

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}║  ARQUIVOS DE CONFIGURAÇÃO${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

check "config.php existe" "[ -f config.php ]"
check "backend-nodejs/.env existe" "[ -f backend-nodejs/.env ]"
check "package.json existe" "[ -f package.json ]"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}║  BUILD DO FRONTEND${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

check "Pasta /dist existe" "[ -d dist ]"
check "dist/index.html existe" "[ -f dist/index.html ]"
check "dist/assets existe" "[ -d dist/assets ]"
check "Favicon existe" "[ -f public/favicon.svg ]" "warning"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}║  BACKEND NODE.JS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

check "node_modules do backend" "[ -d backend-nodejs/node_modules ]"

# Verificar se backend está rodando
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${CYAN}🔍 Backend rodando...${NC} ${GREEN}✅ OK${NC}"
    SUCCESS=$((SUCCESS + 1))
    TOTAL=$((TOTAL + 1))
    
    # Testar resposta
    HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health)
    if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
        echo -e "${CYAN}🔍 Resposta do backend...${NC} ${GREEN}✅ OK (${HEALTH_RESPONSE})${NC}"
        SUCCESS=$((SUCCESS + 1))
    else
        echo -e "${CYAN}🔍 Resposta do backend...${NC} ${YELLOW}⚠️  AVISO (resposta inesperada)${NC}"
        WARNING=$((WARNING + 1))
    fi
    TOTAL=$((TOTAL + 1))
else
    echo -e "${CYAN}🔍 Backend rodando...${NC} ${RED}❌ ERRO (não está rodando)${NC}"
    ERROR=$((ERROR + 1))
    TOTAL=$((TOTAL + 1))
    echo ""
    echo -e "${YELLOW}Para iniciar o backend:${NC}"
    echo -e "${BLUE}  cd backend-nodejs && npm start${NC}"
    echo -e "${BLUE}  OU: pm2 start backend-nodejs/src/server.js --name meumu-backend${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}║  SEGURANÇA${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

if [ -d "install" ]; then
    echo -e "${CYAN}🔍 Pasta /install deletada...${NC} ${RED}❌ PERIGO (ainda existe!)${NC}"
    ERROR=$((ERROR + 1))
    TOTAL=$((TOTAL + 1))
    echo ""
    echo -e "${RED}⚠️  ATENÇÃO: Delete a pasta /install por segurança:${NC}"
    echo -e "${YELLOW}  rm -rf install/${NC}"
else
    echo -e "${CYAN}🔍 Pasta /install deletada...${NC} ${GREEN}✅ OK${NC}"
    SUCCESS=$((SUCCESS + 1))
    TOTAL=$((TOTAL + 1))
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}║  RESUMO FINAL${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "Total de verificações: ${CYAN}${TOTAL}${NC}"
echo -e "Sucesso: ${GREEN}${SUCCESS}${NC}"
echo -e "Avisos: ${YELLOW}${WARNING}${NC}"
echo -e "Erros: ${RED}${ERROR}${NC}"

echo ""

# Status final
if [ $ERROR -eq 0 ] && [ $WARNING -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          ✅ TUDO FUNCIONANDO PERFEITAMENTE! ✅               ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${PURPLE}🎮 Seu site está pronto para receber jogadores! 🎮${NC}"
elif [ $ERROR -eq 0 ]; then
    echo -e "${YELLOW}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║        ⚠️  FUNCIONANDO COM AVISOS (OK para uso) ⚠️          ║${NC}"
    echo -e "${YELLOW}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Os avisos acima não impedem o site de funcionar.${NC}"
else
    echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║            ❌ ERROS DETECTADOS - REQUER ATENÇÃO ❌           ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}Corrija os erros acima antes de usar em produção.${NC}"
fi

echo ""
echo -e "${BLUE}📝 Próximos passos:${NC}"
if [ $ERROR -gt 0 ]; then
    echo "  1. Corrija os erros marcados com ❌"
    echo "  2. Execute este script novamente"
else
    echo "  1. Configure seu servidor web (Apache/Nginx) para apontar para /dist"
    echo "  2. Acesse: http://seudominio.com"
    echo "  3. Teste todas as funcionalidades"
fi

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}       MeuMU Online v2.0.1 - Status Check Completo${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
