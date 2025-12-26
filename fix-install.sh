#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 🔧 FIX INSTALL.SH - Corrigir nome do database de webmu para meuweb
# ═══════════════════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════════════"
echo "🔧 CORRIGINDO install.sh"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Backup do install.sh original
if [ ! -f "install.sh.backup" ]; then
    cp install.sh install.sh.backup
    echo "✅ Backup criado: install.sh.backup"
fi

# Substituir TODAS as ocorrências de 'webmu' por 'meuweb'
sed -i 's/webmu/meuweb/g' install.sh

echo "✅ install.sh corrigido!"
echo ""
echo "Mudanças aplicadas:"
echo "  - webmu → meuweb (em todas as ocorrências)"
echo ""
echo "Para desfazer:"
echo "  mv install.sh.backup install.sh"
echo ""
echo "═══════════════════════════════════════════════════════════════"
