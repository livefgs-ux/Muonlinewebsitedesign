#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - FIX DE PERMISSÕES (MIME TYPES)
# ═══════════════════════════════════════════════════════════════
# 
# RESOLVE: Erro "application/octet-stream" ao invés de JavaScript
# 
# CAUSA: Permissões incorretas após git clone ou deploy
# 
# SOLUÇÃO: Ajusta proprietário e permissões para servidor web
# 
# ═══════════════════════════════════════════════════════════════

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

# Diretório base
BASE_DIR="/home/meumu.com/public_html"

echo -e "${BOLD}🔐 FIX DE PERMISSÕES - RESOLVER MIME TYPES${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""

# Verificar se diretório existe
if [ ! -d "$BASE_DIR" ]; then
    echo -e "${RED}❌ Diretório não encontrado: $BASE_DIR${NC}"
    exit 1
fi

echo -e "${CYAN}📁 Diretório: $BASE_DIR${NC}"
echo ""

# Obter usuário atual
CURRENT_USER=$(whoami)
echo -e "${CYAN}👤 Usuário atual: $CURRENT_USER${NC}"
echo ""

# Etapa 1: Ajustar proprietário
echo -e "${YELLOW}[1/4]${NC} Ajustando proprietário para $CURRENT_USER:webapps..."
if chown -R "$CURRENT_USER:webapps" "$BASE_DIR" 2>/dev/null; then
    echo -e "${GREEN}✅ Proprietário ajustado sem sudo${NC}"
elif sudo chown -R "$CURRENT_USER:webapps" "$BASE_DIR" 2>/dev/null; then
    echo -e "${GREEN}✅ Proprietário ajustado com sudo${NC}"
else
    echo -e "${RED}❌ Falha ao ajustar proprietário!${NC}"
    echo -e "${YELLOW}Tente: sudo chown -R $CURRENT_USER:webapps $BASE_DIR${NC}"
    exit 1
fi

# Etapa 2: Ajustar permissões de diretórios (755)
echo ""
echo -e "${YELLOW}[2/4]${NC} Ajustando permissões de diretórios → 755 (rwxr-xr-x)..."
if find "$BASE_DIR" -type d -exec chmod 755 {} \; 2>/dev/null; then
    echo -e "${GREEN}✅ Diretórios ajustados sem sudo${NC}"
elif sudo find "$BASE_DIR" -type d -exec chmod 755 {} \; 2>/dev/null; then
    echo -e "${GREEN}✅ Diretórios ajustados com sudo${NC}"
else
    echo -e "${RED}❌ Falha ao ajustar diretórios!${NC}"
    exit 1
fi

# Etapa 3: Ajustar permissões de arquivos (644)
echo ""
echo -e "${YELLOW}[3/4]${NC} Ajustando permissões de arquivos → 644 (rw-r--r--)..."
if find "$BASE_DIR" -type f -exec chmod 644 {} \; 2>/dev/null; then
    echo -e "${GREEN}✅ Arquivos ajustados sem sudo${NC}"
elif sudo find "$BASE_DIR" -type f -exec chmod 644 {} \; 2>/dev/null; then
    echo -e "${GREEN}✅ Arquivos ajustados com sudo${NC}"
else
    echo -e "${RED}❌ Falha ao ajustar arquivos!${NC}"
    exit 1
fi

# Etapa 4: Tornar scripts executáveis (755)
echo ""
echo -e "${YELLOW}[4/4]${NC} Tornando scripts executáveis → 755..."

SCRIPTS=(
    "$BASE_DIR/install.sh"
    "$BASE_DIR/fix-permissions.sh"
    "$BASE_DIR/fix-permissions-mime.sh"
)

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        if chmod +x "$script" 2>/dev/null || sudo chmod +x "$script" 2>/dev/null; then
            echo -e "${GREEN}   ✅ $(basename $script)${NC}"
        fi
    fi
done

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ PERMISSÕES AJUSTADAS COM SUCESSO!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""

# Mostrar resumo
echo -e "${BOLD}📊 RESUMO DAS PERMISSÕES:${NC}"
echo ""
echo -e "${CYAN}Proprietário:${NC} $CURRENT_USER:webapps"
echo -e "${CYAN}Diretórios:${NC}   755 (rwxr-xr-x) - Servidor web pode ler e entrar"
echo -e "${CYAN}Arquivos:${NC}     644 (rw-r--r--) - Servidor web pode ler"
echo -e "${CYAN}Scripts:${NC}      755 (rwxr-xr-x) - Executáveis"
echo ""

# Verificar alguns arquivos
echo -e "${BOLD}🔍 VERIFICANDO ARQUIVOS CRÍTICOS:${NC}"
echo ""

if [ -f "$BASE_DIR/package.json" ]; then
    PERMS=$(stat -c "%a %U:%G" "$BASE_DIR/package.json" 2>/dev/null)
    echo -e "${GREEN}✅ package.json → $PERMS${NC}"
fi

if [ -f "$BASE_DIR/vite.config.ts" ]; then
    PERMS=$(stat -c "%a %U:%G" "$BASE_DIR/vite.config.ts" 2>/dev/null)
    echo -e "${GREEN}✅ vite.config.ts → $PERMS${NC}"
fi

if [ -f "$BASE_DIR/src/main.tsx" ]; then
    PERMS=$(stat -c "%a %U:%G" "$BASE_DIR/src/main.tsx" 2>/dev/null)
    echo -e "${GREEN}✅ src/main.tsx → $PERMS${NC}"
fi

if [ -d "$BASE_DIR/dist" ]; then
    PERMS=$(stat -c "%a %U:%G" "$BASE_DIR/dist" 2>/dev/null)
    echo -e "${GREEN}✅ dist/ → $PERMS${NC}"
fi

echo ""
echo -e "${BOLD}${CYAN}📋 PRÓXIMO PASSO:${NC}"
echo ""
echo -e "${YELLOW}Se o erro MIME type ainda acontecer:${NC}"
echo -e "${CYAN}   1) Verifique se rodou: ${BOLD}npm run build${NC}"
echo -e "${CYAN}   2) Arquivos .tsx NÃO rodam direto no navegador${NC}"
echo -e "${CYAN}   3) Apenas arquivos da pasta ${BOLD}dist/${NC}${CYAN} devem ser servidos${NC}"
echo ""
echo -e "${GREEN}✅ Permissões OK para Nginx/Apache servir corretamente!${NC}"
echo ""
