#!/bin/bash
# ============================================================
# Script de Verificação de Assets - MeuMU Online
# Verifica se todos os assets estão corretos e prontos
# ============================================================

echo "==============================================="
echo "   🔍 Verificação de Assets - MeuMU Online"
echo "==============================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# ============================================================
# 1. VERIFICAR IMPORTS FIGMA NO CÓDIGO
# ============================================================

echo -e "${BLUE}[1/5] Verificando imports figma:asset no código...${NC}"

FIGMA_IMPORTS=$(grep -r "figma:asset" ./src 2>/dev/null || true)

if [ -z "$FIGMA_IMPORTS" ]; then
    echo -e "${GREEN}✅ Nenhum import figma:asset encontrado${NC}"
else
    echo -e "${RED}❌ ERRO: Ainda existem imports figma:asset no código:${NC}"
    echo "$FIGMA_IMPORTS"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ============================================================
# 2. VERIFICAR ESTRUTURA DE PASTAS
# ============================================================

echo -e "${BLUE}[2/5] Verificando estrutura de pastas...${NC}"

REQUIRED_DIRS=(
    "public/assets"
    "public/assets/backgrounds"
    "public/assets/images"
    "public/assets/icons"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ Pasta existe: $dir${NC}"
    else
        echo -e "${YELLOW}⚠️  Criando pasta: $dir${NC}"
        mkdir -p "$dir"
        WARNINGS=$((WARNINGS + 1))
    fi
done
echo ""

# ============================================================
# 3. VERIFICAR IMAGENS OBRIGATÓRIAS
# ============================================================

echo -e "${BLUE}[3/5] Verificando imagens obrigatórias...${NC}"

HERO_BG="public/assets/backgrounds/hero-background.png"
CHAR_EX="public/assets/images/character-example.png"

# Verificar hero-background.png
if [ -f "$HERO_BG" ]; then
    SIZE=$(du -h "$HERO_BG" | cut -f1)
    echo -e "${GREEN}✅ Background principal encontrado: $HERO_BG ($SIZE)${NC}"
else
    echo -e "${RED}❌ ERRO: Background principal não encontrado!${NC}"
    echo "   Esperado em: $HERO_BG"
    echo "   Exporte do Figma: figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png"
    ERRORS=$((ERRORS + 1))
fi

# Verificar character-example.png
if [ -f "$CHAR_EX" ]; then
    SIZE=$(du -h "$CHAR_EX" | cut -f1)
    echo -e "${GREEN}✅ Imagem de personagem encontrada: $CHAR_EX ($SIZE)${NC}"
else
    echo -e "${YELLOW}⚠️  Aviso: Imagem de personagem não encontrada${NC}"
    echo "   Esperado em: $CHAR_EX"
    echo "   Exporte do Figma: figma:asset/0481c7d9f941d688b911f1c81a92c821fe1a50e8.png"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# ============================================================
# 4. VERIFICAR ARQUIVOS DE CONFIGURAÇÃO
# ============================================================

echo -e "${BLUE}[4/5] Verificando arquivos de configuração...${NC}"

CONFIG_FILES=(
    ".env.example"
    "install.sh"
    "INSTALACAO.md"
    "ASSETS_MAPPING.md"
    "public/assets/README.md"
)

for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ Arquivo existe: $file${NC}"
    else
        echo -e "${RED}❌ ERRO: Arquivo não encontrado: $file${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

# Verificar se .env existe
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Arquivo .env configurado${NC}"
else
    echo -e "${YELLOW}⚠️  Aviso: Arquivo .env não encontrado${NC}"
    echo "   Execute: ./install.sh para criar automaticamente"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# ============================================================
# 5. VERIFICAR COMPONENTES ATUALIZADOS
# ============================================================

echo -e "${BLUE}[5/5] Verificando componentes React atualizados...${NC}"

COMPONENTS=(
    "src/app/components/shared-background.tsx"
    "src/app/components/hero-section.tsx"
    "src/app/components/rankings-section.tsx"
    "src/app/components/events-section.tsx"
    "src/app/components/downloads-section.tsx"
    "src/app/components/news-section.tsx"
    "src/app/components/dashboard-section.tsx"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        # Verificar se usa SharedBackground ou caminho local
        if grep -q "SharedBackground\|/assets/" "$component" 2>/dev/null; then
            echo -e "${GREEN}✅ Componente atualizado: $(basename $component)${NC}"
        else
            echo -e "${YELLOW}⚠️  Verificar: $(basename $component)${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${RED}❌ ERRO: Componente não encontrado: $component${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# ============================================================
# 6. RESUMO FINAL
# ============================================================

echo ""
echo "==============================================="
echo "           📊 RESUMO DA VERIFICAÇÃO"
echo "==============================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ PERFEITO! Tudo está configurado corretamente!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "  1. npm install"
    echo "  2. npm run build"
    echo "  3. npm start"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  ATENÇÃO: $WARNINGS aviso(s) encontrado(s)${NC}"
    echo ""
    echo "O projeto está funcional, mas há avisos."
    echo "Revise os avisos acima antes de fazer deploy em produção."
else
    echo -e "${RED}❌ ERRO: $ERRORS erro(s) encontrado(s)${NC}"
    echo -e "${YELLOW}⚠️  AVISOS: $WARNINGS aviso(s)${NC}"
    echo ""
    echo "Corrija os erros antes de continuar."
    echo "Consulte INSTALACAO.md para mais detalhes."
fi

echo ""
echo "==============================================="
echo ""

# Retornar código de erro se houver erros críticos
if [ $ERRORS -gt 0 ]; then
    exit 1
else
    exit 0
fi
