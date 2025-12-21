#!/bin/bash
###############################################################################
# MeuMU Online - Script de Correção de Permissões
# Corrige automaticamente as permissões do projeto
###############################################################################

echo "════════════════════════════════════════════════════════════"
echo "  MeuMU Online - Correção Automática de Permissões"
echo "════════════════════════════════════════════════════════════"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está rodando como root
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Rodando como ROOT${NC}"
    IS_ROOT=true
else
    echo -e "${YELLOW}⚠️  Rodando como usuário normal${NC}"
    IS_ROOT=false
fi

echo ""

# Detectar usuário do servidor web
detect_web_user() {
    if id "www-data" &>/dev/null; then
        echo "www-data"
    elif id "apache" &>/dev/null; then
        echo "apache"
    elif id "nginx" &>/dev/null; then
        echo "nginx"
    elif id "httpd" &>/dev/null; then
        echo "httpd"
    else
        echo "$(whoami)"
    fi
}

WEB_USER=$(detect_web_user)
echo -e "🔍 Usuário do servidor web detectado: ${GREEN}$WEB_USER${NC}"
echo ""

# Aplicar permissões
echo "📝 Aplicando permissões..."

if [ "$IS_ROOT" = true ]; then
    # Root: pode fazer tudo
    chmod -R 775 .
    chown -R $WEB_USER:$WEB_USER .
    echo -e "${GREEN}✅ Permissões aplicadas com sucesso!${NC}"
else
    # Usuário normal: apenas chmod
    chmod -R 775 .
    echo -e "${GREEN}✅ Permissões de leitura/escrita aplicadas!${NC}"
    echo -e "${YELLOW}⚠️  Não foi possível alterar o dono (precisa de sudo)${NC}"
fi

echo ""

# Verificar pastas críticas
echo "🔍 Verificando pastas críticas..."

check_folder() {
    if [ -d "$1" ]; then
        if [ -w "$1" ]; then
            echo -e "  ${GREEN}✅${NC} $1 - Escrita OK"
        else
            echo -e "  ${RED}❌${NC} $1 - SEM PERMISSÃO DE ESCRITA"
        fi
    else
        echo -e "  ${RED}❌${NC} $1 - NÃO EXISTE"
    fi
}

check_folder "backend-nodejs"
check_folder "install"
check_folder "."

echo ""

# Teste final
if [ -w "." ] && [ -w "backend-nodejs" ]; then
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✅ SUCESSO! O instalador deve funcionar agora!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "📝 Próximos passos:"
    echo "   1. Acesse: http://seu-dominio.com/install"
    echo "   2. Clique em 'Instalar Agora'"
    echo ""
else
    echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}  ❌ AINDA HÁ PROBLEMAS DE PERMISSÃO${NC}"
    echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "💡 Tente executar com sudo:"
    echo "   sudo ./scripts/fix-permissions.sh"
    echo ""
fi
