#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - FIX DE PERMISSÕES
# ═══════════════════════════════════════════════════════════════

echo "🔓 Corrigindo permissões..."
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Diretório do projeto
PROJECT_DIR="/home/meumu.com/public_html"

# Verificar se o diretório existe
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Diretório não encontrado: $PROJECT_DIR${NC}"
    exit 1
fi

# Verificar quem está rodando
CURRENT_USER=$(whoami)
echo -e "${YELLOW}👤 Usuário atual: $CURRENT_USER${NC}"

# Verificar dono atual
OWNER=$(stat -c '%U' "$PROJECT_DIR")
echo -e "${YELLOW}👤 Dono atual do diretório: $OWNER${NC}"
echo ""

# Se já for o dono, não precisa fazer nada
if [ "$CURRENT_USER" = "$OWNER" ]; then
    echo -e "${GREEN}✅ Você já é o dono do diretório!${NC}"
    echo ""
    echo "Continuando instalação..."
    cd "$PROJECT_DIR"
    node install.js
    exit 0
fi

# Pedir confirmação
echo -e "${YELLOW}⚠️  Você NÃO é o dono do diretório!${NC}"
echo ""
echo "Para corrigir, execute:"
echo ""
echo -e "${GREEN}sudo chown -R $CURRENT_USER:$CURRENT_USER $PROJECT_DIR${NC}"
echo ""
read -p "Deseja executar agora? (s/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo "🔓 Corrigindo ownership..."
    sudo chown -R $CURRENT_USER:$CURRENT_USER "$PROJECT_DIR"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Permissões corrigidas!${NC}"
        echo ""
        echo "Continuando instalação..."
        cd "$PROJECT_DIR"
        node install.js
    else
        echo -e "${RED}❌ Erro ao corrigir permissões!${NC}"
        echo "Execute manualmente:"
        echo "  sudo chown -R $CURRENT_USER:$CURRENT_USER $PROJECT_DIR"
        exit 1
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  Instalação cancelada${NC}"
    echo ""
    echo "Para continuar, execute:"
    echo "  1. sudo chown -R $CURRENT_USER:$CURRENT_USER $PROJECT_DIR"
    echo "  2. node install.js"
    exit 0
fi
