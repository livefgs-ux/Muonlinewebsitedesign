#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 🔍 SCRIPT DE VERIFICAÇÃO - Confirmar que TODAS as correções foram aplicadas
# ═══════════════════════════════════════════════════════════════════════════

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo "═══════════════════════════════════════════════════════════════"
echo "🔍 VERIFICANDO CORREÇÕES"
echo "═══════════════════════════════════════════════════════════════"
echo ""

cd /home/meumu.com/public_html || exit 1

# 1. Verificar install.sh
echo "1️⃣ Verificando install.sh..."
WEBMU_COUNT=$(grep -c "webmu" install.sh 2>/dev/null || echo "0")
MEUWEB_COUNT=$(grep -c "meuweb" install.sh 2>/dev/null || echo "0")

if [ "$WEBMU_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ Nenhuma ocorrência de 'webmu' encontrada${NC}"
else
    echo -e "${RED}❌ ERRO: Ainda existem $WEBMU_COUNT ocorrências de 'webmu'${NC}"
    echo ""
    echo "Linhas com 'webmu':"
    grep -n "webmu" install.sh
fi

echo -e "${CYAN}   Ocorrências de 'meuweb': $MEUWEB_COUNT${NC}"
echo ""

# 2. Verificar 00_create_webuser.sql
echo "2️⃣ Verificando 00_create_webuser.sql..."
if [ -f "backend-nodejs/database/00_create_webuser.sql" ]; then
    WEBMU_SQL=$(grep -c "webmu" backend-nodejs/database/00_create_webuser.sql 2>/dev/null || echo "0")
    MEUWEB_SQL=$(grep -c "meuweb" backend-nodejs/database/00_create_webuser.sql 2>/dev/null || echo "0")
    
    if [ "$WEBMU_SQL" -eq 0 ]; then
        echo -e "${GREEN}✅ Nenhuma ocorrência de 'webmu' encontrada${NC}"
    else
        echo -e "${RED}❌ ERRO: Ainda existem $WEBMU_SQL ocorrências de 'webmu'${NC}"
    fi
    
    echo -e "${CYAN}   Ocorrências de 'meuweb': $MEUWEB_SQL${NC}"
else
    echo -e "${RED}❌ Arquivo não encontrado${NC}"
fi
echo ""

# 3. Verificar validate-all.sh
echo "3️⃣ Verificando validate-all.sh..."
if [ -f "validate-all.sh" ]; then
    WEBMU_VAL=$(grep -c "webmu" validate-all.sh 2>/dev/null || echo "0")
    MEUWEB_VAL=$(grep -c "meuweb" validate-all.sh 2>/dev/null || echo "0")
    
    if [ "$WEBMU_VAL" -eq 0 ]; then
        echo -e "${GREEN}✅ Nenhuma ocorrência de 'webmu' encontrada${NC}"
    else
        echo -e "${RED}❌ ERRO: Ainda existem $WEBMU_VAL ocorrências de 'webmu'${NC}"
    fi
    
    echo -e "${CYAN}   Ocorrências de 'meuweb': $MEUWEB_VAL${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo não encontrado (opcional)${NC}"
fi
echo ""

# 4. Verificar backend .env files
echo "4️⃣ Verificando backend .env..."
if [ -f "backend-nodejs/.env" ]; then
    DB_WEB_NAME=$(grep "^DB_WEB_NAME=" backend-nodejs/.env 2>/dev/null | cut -d'=' -f2)
    if [ "$DB_WEB_NAME" = "meuweb" ]; then
        echo -e "${GREEN}✅ DB_WEB_NAME=meuweb (correto)${NC}"
    else
        echo -e "${RED}❌ DB_WEB_NAME=$DB_WEB_NAME (incorreto, deve ser 'meuweb')${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Arquivo .env ainda não foi criado (OK, será criado pelo install.sh)${NC}"
fi
echo ""

# 5. Verificar database MySQL
echo "5️⃣ Verificando databases MySQL..."
MYSQL_USER="root"
MYSQL_PASS="@mysql123@"

if mysql -u $MYSQL_USER -p$MYSQL_PASS -e "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MySQL conectado${NC}"
    
    # Verificar se meuweb existe
    MEUWEB_EXISTS=$(mysql -u $MYSQL_USER -p$MYSQL_PASS -e "SHOW DATABASES LIKE 'meuweb';" 2>/dev/null | grep -c "meuweb")
    if [ "$MEUWEB_EXISTS" -gt 0 ]; then
        echo -e "${GREEN}✅ Database 'meuweb' existe${NC}"
    else
        echo -e "${YELLOW}⚠️  Database 'meuweb' ainda não foi criado (será criado pelo install.sh)${NC}"
    fi
    
    # Verificar se webmu existe (não deveria)
    WEBMU_EXISTS=$(mysql -u $MYSQL_USER -p$MYSQL_PASS -e "SHOW DATABASES LIKE 'webmu';" 2>/dev/null | grep -c "webmu")
    if [ "$WEBMU_EXISTS" -gt 0 ]; then
        echo -e "${RED}❌ ATENÇÃO: Database 'webmu' ainda existe! Deve ser removido.${NC}"
        echo -e "${YELLOW}   Execute: mysql -u root -p@mysql123@ -e \"DROP DATABASE webmu;\"${NC}"
    else
        echo -e "${GREEN}✅ Database 'webmu' não existe (correto)${NC}"
    fi
else
    echo -e "${RED}❌ Não foi possível conectar ao MySQL${NC}"
fi
echo ""

# RESUMO FINAL
echo "═══════════════════════════════════════════════════════════════"
echo "📊 RESUMO DA VERIFICAÇÃO"
echo "═══════════════════════════════════════════════════════════════"
echo ""

TOTAL_ERRORS=0

if [ "$WEBMU_COUNT" -gt 0 ]; then
    echo -e "${RED}❌ install.sh ainda contém 'webmu'${NC}"
    ((TOTAL_ERRORS++))
fi

if [ "$WEBMU_SQL" -gt 0 ]; then
    echo -e "${RED}❌ 00_create_webuser.sql ainda contém 'webmu'${NC}"
    ((TOTAL_ERRORS++))
fi

if [ "$WEBMU_EXISTS" -gt 0 ]; then
    echo -e "${RED}❌ Database 'webmu' ainda existe no MySQL${NC}"
    ((TOTAL_ERRORS++))
fi

if [ $TOTAL_ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅✅✅ TODAS AS CORREÇÕES FORAM APLICADAS!${NC}"
    echo ""
    echo "Você pode agora executar:"
    echo "  ./install.sh"
    echo ""
    echo "E escolher opção 1 (Instalação Completa)"
else
    echo -e "${RED}❌ TOTAL DE ERROS: $TOTAL_ERRORS${NC}"
    echo ""
    echo "Execute as correções necessárias antes de continuar."
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
