#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# 🔧 V574 - SCRIPT DE CORREÇÃO AUTOMÁTICA DE TOKENS
# ═══════════════════════════════════════════════════════════════
# 
# Este script corrige TODOS os arquivos que estão buscando tokens
# de forma incompatível, aplicando o padrão multi-source correto.
#
# USO:
# chmod +x V574_SCRIPT_CORRECAO_TOKENS.sh
# bash V574_SCRIPT_CORRECAO_TOKENS.sh
#
# ═══════════════════════════════════════════════════════════════

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}   🔧 V574 - CORREÇÃO AUTOMÁTICA DE TOKENS${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Confirmar
read -r -p "$(echo -e ${YELLOW}Isso irá modificar 12 arquivos. Continuar? [s/N]: ${NC})" confirma

if [[ ! "$confirma" =~ ^[Ss]$ ]]; then
    echo -e "${RED}Operação cancelada.${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}✅ Iniciando correção...${NC}"
echo ""

# Contadores
TOTAL=0
SUCCESS=0
FAILED=0

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO: Corrigir arquivo
# ═══════════════════════════════════════════════════════════════

corrigir_arquivo() {
    local FILE="$1"
    local OLD_PATTERN="$2"
    local NEW_LINE="$3"
    
    echo -n "  → ${FILE}... "
    
    if [ ! -f "src/app/components/${FILE}" ]; then
        echo -e "${RED}❌ Não encontrado${NC}"
        FAILED=$((FAILED + 1))
        return 1
    fi
    
    # Fazer backup
    cp "src/app/components/${FILE}" "src/app/components/${FILE}.backup"
    
    # Aplicar correção (usando perl para substituição multi-linha)
    perl -i -pe "s/${OLD_PATTERN}/${NEW_LINE}/g" "src/app/components/${FILE}"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Corrigido${NC}"
        SUCCESS=$((SUCCESS + 1))
    else
        echo -e "${RED}❌ Erro${NC}"
        # Restaurar backup
        mv "src/app/components/${FILE}.backup" "src/app/components/${FILE}"
        FAILED=$((FAILED + 1))
    fi
    
    TOTAL=$((TOTAL + 1))
}

# ═══════════════════════════════════════════════════════════════
# CORREÇÕES
# ═══════════════════════════════════════════════════════════════

# PADRÃO ANTIGO PARA PADRÃO NOVO
OLD_1="localStorage.getItem\\('admin_token'\\)"
NEW_1="sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token')"

OLD_2="sessionStorage.getItem\\('adminToken'\\)"
NEW_2="sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token')"

# Arquivos a corrigir
echo -e "${CYAN}📝 Corrigindo arquivos...${NC}"
echo ""

# AccountManagement
corrigir_arquivo "admincp/sections/AccountManagement.tsx" "$OLD_1" "$NEW_1"

# NewsManagement
corrigir_arquivo "admincp/sections/NewsManagement.tsx" "$OLD_1" "$NEW_1"

# PluginsSection
corrigir_arquivo "admincp/sections/PluginsSection.tsx" "$OLD_1" "$NEW_1"

# LogsSection
corrigir_arquivo "admincp/sections/LogsSection.tsx" "$OLD_1" "$NEW_1"

# BansSection
corrigir_arquivo "admincp/sections/BansSection.tsx" "$OLD_1" "$NEW_1"

# WCoinPackagesSection
corrigir_arquivo "admincp/sections/WCoinPackagesSection.tsx" "$OLD_1" "$NEW_1"

# admin-diagnostics
corrigir_arquivo "admincp/admin-diagnostics.tsx" "$OLD_1" "$NEW_1"

# DonationsPanel
corrigir_arquivo "admin/DonationsPanel.tsx" "$OLD_1" "$NEW_1"

# SecurityPanel
corrigir_arquivo "admin/SecurityPanel.tsx" "$OLD_1" "$NEW_1"

# plugin-manager
corrigir_arquivo "admincp/plugin-manager.tsx" "$OLD_2" "$NEW_2"

# cron-manager
corrigir_arquivo "admincp/cron-manager.tsx" "$OLD_2" "$NEW_2"

# site-editor (já corrigido parcialmente, mas vamos garantir)
corrigir_arquivo "admincp/site-editor.tsx" "$OLD_2" "$NEW_2"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✅ CORREÇÃO CONCLUÍDA${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}📊 Resumo:${NC}"
echo -e "${GREEN}   ✅ Corrigidos: ${SUCCESS}/${TOTAL}${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}   ❌ Falhas: ${FAILED}${NC}"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 TODOS OS ARQUIVOS CORRIGIDOS COM SUCESSO!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Próximos passos:${NC}"
    echo -e "${CYAN}   1) npm run build${NC}"
    echo -e "${CYAN}   2) Limpar cache do navegador${NC}"
    echo -e "${CYAN}   3) Testar AdminCP${NC}"
    echo ""
    echo -e "${YELLOW}💾 Backups salvos em:${NC}"
    echo -e "${CYAN}   src/app/components/**/*.backup${NC}"
    echo ""
else
    echo -e "${RED}⚠️  Alguns arquivos falharam. Verifique os erros acima.${NC}"
fi
