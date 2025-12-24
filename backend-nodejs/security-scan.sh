#!/bin/bash

# ═══════════════════════════════════════════════════════════════
#  SECURITY SCAN - ANÁLISE COMPLETA DE SEGURANÇA
#  Verifica vulnerabilidades em dependências e configurações
# ═══════════════════════════════════════════════════════════════

echo "🔒 SECURITY SCAN - MeuMU Online Backend"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ISSUES_FOUND=0

# ═══════════════════════════════════════════════════════════════
# 1. NPM AUDIT (VULNERABILIDADES)
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}[1/5] Verificando vulnerabilidades em dependências...${NC}"
echo ""

npm audit --production > /tmp/npm-audit.txt 2>&1

if grep -q "found 0 vulnerabilities" /tmp/npm-audit.txt; then
    echo -e "${GREEN}✅ Nenhuma vulnerabilidade encontrada!${NC}"
else
    echo -e "${YELLOW}⚠️  Vulnerabilidades detectadas:${NC}"
    cat /tmp/npm-audit.txt
    ISSUES_FOUND=1
    
    echo ""
    echo -e "${YELLOW}💡 Execute: npm run security-fix${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# 2. OUTDATED PACKAGES
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}[2/5] Verificando pacotes desatualizados...${NC}"
echo ""

OUTDATED=$(npm outdated 2>&1)

if [ -z "$OUTDATED" ]; then
    echo -e "${GREEN}✅ Todos os pacotes estão atualizados!${NC}"
else
    echo -e "${YELLOW}⚠️  Pacotes desatualizados:${NC}"
    echo "$OUTDATED"
    echo ""
    echo -e "${YELLOW}💡 Execute: npm run update-safe${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# 3. VERIFICAR .ENV
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}[3/5] Verificando configuração .env...${NC}"
echo ""

if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo "   Copie .env.example e configure as variáveis"
    ISSUES_FOUND=1
else
    # Verificar variáveis obrigatórias
    REQUIRED_VARS=("JWT_SECRET" "DB_HOST" "DB_USER" "DB_PASSWORD")
    
    for var in "${REQUIRED_VARS[@]}"; do
        if ! grep -q "^${var}=" .env; then
            echo -e "${RED}❌ Variável ${var} ausente no .env${NC}"
            ISSUES_FOUND=1
        fi
    done
    
    # Verificar tamanho do JWT_SECRET
    JWT_SECRET=$(grep "^JWT_SECRET=" .env | cut -d'=' -f2)
    if [ ${#JWT_SECRET} -lt 32 ]; then
        echo -e "${YELLOW}⚠️  JWT_SECRET muito curto (mínimo 32 caracteres)${NC}"
        ISSUES_FOUND=1
    fi
    
    if [ $ISSUES_FOUND -eq 0 ]; then
        echo -e "${GREEN}✅ Configuração .env OK!${NC}"
    fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# 4. VERIFICAR .GITIGNORE
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}[4/5] Verificando .gitignore...${NC}"
echo ""

if [ ! -f "../.gitignore" ]; then
    echo -e "${RED}❌ Arquivo .gitignore não encontrado!${NC}"
    ISSUES_FOUND=1
else
    # Verificar se .env está no gitignore
    if ! grep -q "^\.env$" ../.gitignore; then
        echo -e "${RED}❌ .env NÃO está no .gitignore!${NC}"
        echo "   Adicione '.env' ao .gitignore imediatamente"
        ISSUES_FOUND=1
    else
        echo -e "${GREEN}✅ .gitignore configurado corretamente!${NC}"
    fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# 5. VERIFICAR PERMISSÕES DE ARQUIVOS
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}[5/5] Verificando permissões de arquivos...${NC}"
echo ""

# .env não deve ser executável
if [ -f ".env" ] && [ -x ".env" ]; then
    echo -e "${YELLOW}⚠️  .env não deveria ser executável${NC}"
    echo "   Execute: chmod 600 .env"
fi

# Scripts devem ser executáveis
SCRIPTS=("setup-git-hooks.sh" "security-scan.sh" "test-security.sh")
for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ] && [ ! -x "$script" ]; then
        echo -e "${YELLOW}⚠️  $script não é executável${NC}"
        echo "   Execute: chmod +x $script"
    fi
done

echo -e "${GREEN}✅ Permissões verificadas!${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# RESUMO
# ═══════════════════════════════════════════════════════════════

echo "════════════════════════════════════════════════════════════════"
echo ""

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ SCAN COMPLETO - NENHUM PROBLEMA ENCONTRADO!${NC}"
    echo ""
    echo "🔒 Seu backend está seguro!"
    echo ""
else
    echo -e "${YELLOW}⚠️  SCAN COMPLETO - PROBLEMAS ENCONTRADOS${NC}"
    echo ""
    echo "📋 Revise os alertas acima e corrija antes de fazer deploy"
    echo ""
fi

echo "════════════════════════════════════════════════════════════════"
echo ""

# Gerar relatório JSON
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
REPORT_FILE="security-scan-${TIMESTAMP}.json"

cat > "$REPORT_FILE" << EOF
{
  "timestamp": "$(date --iso-8601=seconds)",
  "issues_found": $ISSUES_FOUND,
  "scan_type": "full",
  "checks": {
    "npm_audit": "completed",
    "outdated_packages": "completed",
    "env_config": "completed",
    "gitignore": "completed",
    "file_permissions": "completed"
  }
}
EOF

echo "📄 Relatório salvo em: $REPORT_FILE"
echo ""

exit $ISSUES_FOUND
