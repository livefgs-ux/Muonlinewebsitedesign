#!/bin/bash

###############################################################################
# Script de Movimentação de Arquivos - MeuMU Online
# 
# Este script move todos os arquivos de documentação e desenvolvimento
# para a pasta "arquivos utilizados na criacao do site"
#
# Data: 20/12/2024
# Uso: bash mover-arquivos.sh
###############################################################################

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Pasta de destino
DEST="arquivos utilizados na criacao do site"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   📦 Script de Organização - MeuMU Online           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto!${NC}"
    exit 1
fi

# Verificar se a pasta de destino existe
if [ ! -d "$DEST" ]; then
    echo -e "${RED}❌ Erro: Pasta '$DEST' não encontrada!${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  ATENÇÃO: Este script irá mover arquivos!${NC}"
echo -e "${YELLOW}   Certifique-se de ter um backup antes de continuar.${NC}"
echo ""
read -p "Deseja continuar? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${RED}❌ Operação cancelada.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔄 Iniciando movimentação...${NC}"
echo ""

# Contador
MOVED=0
ERRORS=0

# Função para mover arquivo
move_file() {
    local file="$1"
    if [ -f "$file" ] || [ -d "$file" ]; then
        mv "$file" "$DEST/" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Movido: $file${NC}"
            ((MOVED++))
        else
            echo -e "${RED}❌ Erro ao mover: $file${NC}"
            ((ERRORS++))
        fi
    fi
}

# 1. Mover documentação AdminCP
echo -e "${BLUE}📚 Movendo documentação AdminCP...${NC}"
move_file "ADMINCP_BACKEND_INTEGRATION.md"
move_file "ADMINCP_CHANGELOG.md"
move_file "ADMINCP_DOCS_INDEX.md"
move_file "ADMINCP_FAKE_GUIDE.md"
move_file "ADMINCP_IMPLEMENTATION_SUMMARY.md"
move_file "ADMINCP_INDEX.txt"
move_file "ADMINCP_PARTE6_LAYOUT_SPA.md"
move_file "ADMINCP_QUICK_START.md"
move_file "ADMINCP_README.md"
move_file "ADMINCP_SCREENSHOTS.md"
move_file "ADMINCP_VISUAL_CHECKLIST.md"
move_file "ADMINCP_VISUAL_GUIDE.md"

# 2. Mover correções e ajustes
echo -e "${BLUE}🔧 Movendo correções e ajustes...${NC}"
move_file "AJUSTE_ANIMACOES_DOWNLOADS.md"
move_file "ANALISE_LIMPEZA.md"
move_file "ATUALIZACAO_POPUPS_TEMA.md"
move_file "CHANGELOG_AJUSTES_LAYOUT.md"
move_file "CHECKLIST_CONTRASTE_FINAL.md"
move_file "CORRECAO_SOBREPOSICAO_WIDGETS.md"
move_file "CORRECOES_CONTRASTE_VISUAL.md"
move_file "CORRECOES_EVENTS_TRADUCAO_APLICADAS.md"
move_file "CORRECOES_TRADUCAO_APLICADAS.md"
move_file "FIX_BACKGROUND_PROBLEMA.md"
move_file "FIX_HOOKS_ERROR.md"

# 3. Mover estrutura e sistema
echo -e "${BLUE}🏗️  Movendo estrutura e sistema...${NC}"
move_file "ESTRUTURA_LIMPA.md"
move_file "ESTRUTURA_VISUAL.txt"
move_file "SISTEMA_COMPLETO.md"
move_file "SISTEMA_TRADUCAO_ATUALIZADO.md"
move_file "SISTEMA_TRADUCAO_STATUS_COMPLETO.md"

# 4. Mover guias
echo -e "${BLUE}📖 Movendo guias...${NC}"
move_file "GUIA_INSTALACAO.md"
move_file "GUIA_INSTALACAO_ADMINCP.md"
move_file "GUIA_RAPIDO_SISTEMA.md"
move_file "COMO_USAR_ADMINCP.md"
move_file "EXPORT_DASHBOARD_GUIDE.md"

# 5. Mover implementações
echo -e "${BLUE}⚙️  Movendo implementações...${NC}"
move_file "IMPLEMENTACAO_MODOS_TESTE_ADMINCP.md"
move_file "PARTE_9_DOACOES_IMPLEMENTADA.md"
move_file "PARTE_10_SEGURANCA_IMPLEMENTADA.md"
move_file "PARTE_11_CRONJOBS_IMPLEMENTADA.md"
move_file "PARTE_12_PLAYER_DASHBOARD_IMPLEMENTADA.md"
move_file "RESUMO_COMPLETO_PARTES_10-11-12.md"
move_file "RESUMO_PARTE6.md"

# 6. Mover otimizações
echo -e "${BLUE}⚡ Movendo otimizações...${NC}"
move_file "OTIMIZACOES_PERFORMANCE.md"
move_file "REFATORACAO_ANTI_DUPLICIDADE.md"
move_file "MIGRACAO_TRADUCAO_DOT_NOTATION.md"

# 7. Mover planos e conversões
echo -e "${BLUE}📋 Movendo planos e conversões...${NC}"
move_file "PLANO_CONVERSAO_MOCK_PARA_REAL.md"
move_file "PROXIMOS_PASSOS_IMPLEMENTACAO.md"
move_file "RESUMO_CONVERSAO_MOCK_PARA_REAL.md"
move_file "README_CONVERSAO_COMPLETA.md"
move_file "README_DOCUMENTACAO.md"
move_file "SEGURANCA_COMPONENTES_TESTE_REMOVIDOS.md"

# 8. Mover backups
echo -e "${BLUE}💾 Movendo backups...${NC}"
move_file "BACKUP_INDEX.md"
move_file "BACKUP_TEST_INSTALL_1.md"
move_file "BACKUP_20-12-2024_15h30"

# 9. Mover outros
echo -e "${BLUE}📄 Movendo outros arquivos...${NC}"
move_file "ATTRIBUTIONS.md"
move_file "LIMPEZA_CONCLUIDA.txt"
move_file "RECREATE_DASHBOARD_INSTRUCTIONS.md"
move_file "SYSTEM_DIAGNOSTICS_README.md"
move_file "COMECAR_AQUI.txt"
move_file "PROMPT_PARA_IA_RECRIAR_DASHBOARD.txt"
move_file "START_HERE.txt"

# 10. Mover pastas
echo -e "${BLUE}📁 Movendo pastas...${NC}"
move_file "mock-data"
move_file "server"
move_file "scripts"
move_file "guidelines"
move_file "shared"

# Resumo
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              📊 RESUMO DA OPERAÇÃO                    ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Arquivos movidos: ${MOVED}${NC}"
echo -e "${RED}❌ Erros: ${ERRORS}${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Movimentação concluída com sucesso!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Próximos passos:${NC}"
    echo -e "${YELLOW}   1. Teste o site: npm run dev${NC}"
    echo -e "${YELLOW}   2. Verifique se tudo funciona${NC}"
    echo -e "${YELLOW}   3. Se OK, pode deletar a pasta em produção${NC}"
else
    echo -e "${RED}⚠️  Movimentação concluída com erros!${NC}"
    echo -e "${RED}   Verifique os arquivos que não foram movidos.${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
