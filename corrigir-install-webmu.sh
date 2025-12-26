#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 🔧 SCRIPT DE CORREÇÃO - Substituir 'webmu' por 'meuweb' em TODOS os arquivos
# ═══════════════════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════════════"
echo "🔧 CORRIGINDO TODOS OS ARQUIVOS (webmu → meuweb)"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /home/meumu.com/public_html || exit 1

# 1. Fazer backup
echo "📦 Fazendo backup de install.sh..."
cp install.sh install.sh.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✅ Backup criado${NC}"
echo ""

# 2. Substituir em install.sh
echo "🔄 Substituindo 'webmu' por 'meuweb' em install.sh..."
sed -i 's/webmu/meuweb/g' install.sh
echo -e "${GREEN}✅ install.sh corrigido${NC}"
echo ""

# 3. Substituir em validate-all.sh (se existir)
if [ -f "validate-all.sh" ]; then
    echo "🔄 Substituindo em validate-all.sh..."
    cp validate-all.sh validate-all.sh.backup.$(date +%Y%m%d_%H%M%S)
    sed -i 's/webmu/meuweb/g' validate-all.sh
    echo -e "${GREEN}✅ validate-all.sh corrigido${NC}"
    echo ""
fi

# 4. Verificar quantas substituições foram feitas
echo "📊 RESUMO DAS CORREÇÕES:"
echo ""
echo "Ocorrências de 'meuweb' em install.sh:"
grep -c "meuweb" install.sh || echo "0"

echo ""
echo "Ocorrências RESTANTES de 'webmu' em install.sh:"
grep -c "webmu" install.sh || echo "0"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ CORREÇÃO CONCLUÍDA!${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Para desfazer, execute:"
echo "  mv install.sh.backup.* install.sh"
echo ""
