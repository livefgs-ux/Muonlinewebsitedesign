#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - VALIDAÇÃO COMPLETA DO PROJETO
# ═══════════════════════════════════════════════════════════════

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'
BOLD='\033[1m'

# Contadores
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=6

# ═══════════════════════════════════════════════════════════════
# BANNER
# ═══════════════════════════════════════════════════════════════

clear
echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}       🎮 MEUMU ONLINE - VALIDAÇÃO COMPLETA 🎮${NC}"
echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo ""

BASE_DIR="/home/meumu.com/public_html"
cd "$BASE_DIR" || exit 1

# ═══════════════════════════════════════════════════════════════
# TESTE 1: BUILD DO FRONTEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BOLD}${CYAN}[1/6]${NC} 🏗️  TESTANDO BUILD DO FRONTEND..."
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Limpar dist antiga
if [ -d "dist" ]; then
    echo -e "${CYAN}   Limpando build anterior...${NC}"
    rm -rf dist/
fi

# Build
echo -e "${CYAN}   Executando npm run build...${NC}"
if npm run build > /tmp/build.log 2>&1; then
    # Verificar se gerou arquivos
    if [ -f "dist/index.html" ] && [ -d "dist/assets" ]; then
        DIST_SIZE=$(du -sh dist/ | cut -f1)
        ASSETS_COUNT=$(ls -1 dist/assets/ | wc -l)
        
        echo -e "${GREEN}   ✅ Build concluído com sucesso!${NC}"
        echo -e "${CYAN}      Tamanho: ${DIST_SIZE}${NC}"
        echo -e "${CYAN}      Assets: ${ASSETS_COUNT} arquivos${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}   ❌ Build gerou arquivos incompletos!${NC}"
        echo -e "${YELLOW}   Verifique: tail -n 20 /tmp/build.log${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
else
    echo -e "${RED}   ❌ Falha no build!${NC}"
    echo -e "${YELLOW}   Log:${NC}"
    tail -n 10 /tmp/build.log
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 2: BANCO DE DADOS MEUWEB
# ═══════════════════════════════════════════════════════════════

echo -e "${BOLD}${CYAN}[2/6]${NC} 🗄️  TESTANDO BANCO DE DADOS meuweb..."
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Verificar se banco existe
DB_EXISTS=$(mysql -u root -p@mysql123@ -e "SHOW DATABASES LIKE 'meuweb';" 2>/dev/null | grep meuweb)

if [ -z "$DB_EXISTS" ]; then
    echo -e "${YELLOW}   ⚠️  Banco 'meuweb' não existe, criando...${NC}"
    mysql -u root -p@mysql123@ -e "CREATE DATABASE meuweb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
fi

# Importar SQL se arquivo existe
if [ -f "criar-tabelas-meuweb.sql" ]; then
    echo -e "${CYAN}   Importando tabelas...${NC}"
    if mysql -u root -p@mysql123@ meuweb < criar-tabelas-meuweb.sql 2>/dev/null; then
        echo -e "${GREEN}   ✅ SQL importado com sucesso!${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Algumas tabelas podem já existir (ignorando)${NC}"
    fi
else
    echo -e "${YELLOW}   ⚠️  Arquivo criar-tabelas-meuweb.sql não encontrado${NC}"
fi

# Verificar tabelas
TABLES=$(mysql -u root -p@mysql123@ -e "USE meuweb; SHOW TABLES;" 2>/dev/null | tail -n +2)
TABLE_COUNT=$(echo "$TABLES" | wc -l)

if [ $TABLE_COUNT -ge 3 ]; then
    echo -e "${GREEN}   ✅ Banco 'meuweb' configurado corretamente!${NC}"
    echo -e "${CYAN}      Tabelas encontradas (${TABLE_COUNT}):${NC}"
    echo "$TABLES" | sed 's/^/      • /'
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}   ❌ Banco 'meuweb' incompleto!${NC}"
    echo -e "${YELLOW}      Tabelas encontradas: ${TABLE_COUNT}${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 3: BACKEND PM2
# ═══════════════════════════════════════════════════════════════

echo -e "${BOLD}${CYAN}[3/6]${NC} 🔧 TESTANDO BACKEND (PM2)..."
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if command -v pm2 &> /dev/null; then
    PM2_STATUS=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="meumu-backend") | .pm2_env.status' 2>/dev/null)
    
    if [ "$PM2_STATUS" = "online" ]; then
        PM2_UPTIME=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="meumu-backend") | .pm2_env.pm_uptime' 2>/dev/null)
        PM2_MEMORY=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="meumu-backend") | .monit.memory' 2>/dev/null)
        PM2_MEMORY_MB=$((PM2_MEMORY / 1024 / 1024))
        
        echo -e "${GREEN}   ✅ Backend rodando no PM2!${NC}"
        echo -e "${CYAN}      Status: online${NC}"
        echo -e "${CYAN}      Memória: ${PM2_MEMORY_MB}MB${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${YELLOW}   ⚠️  Backend não está online, tentando reiniciar...${NC}"
        cd "$BASE_DIR/server" || exit 1
        pm2 restart meumu-backend 2>/dev/null || pm2 start server.js --name meumu-backend
        sleep 3
        
        PM2_STATUS_RETRY=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="meumu-backend") | .pm2_env.status' 2>/dev/null)
        if [ "$PM2_STATUS_RETRY" = "online" ]; then
            echo -e "${GREEN}   ✅ Backend reiniciado com sucesso!${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}   ❌ Falha ao iniciar backend!${NC}"
            echo -e "${YELLOW}   Verifique: pm2 logs meumu-backend${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
        cd "$BASE_DIR" || exit 1
    fi
else
    echo -e "${YELLOW}   ⚠️  PM2 não instalado, verificando processo node...${NC}"
    
    if pgrep -f "server.js" > /dev/null; then
        echo -e "${GREEN}   ✅ Backend rodando (processo node)${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}   ❌ Backend não está rodando!${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 4: API LOCAL (PORTA 3001)
# ═══════════════════════════════════════════════════════════════

echo -e "${BOLD}${CYAN}[4/6]${NC} 🌐 TESTANDO API LOCAL (porta 3001)..."
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Aguardar servidor inicializar
sleep 2

API_RESPONSE=$(curl -s http://localhost:3001/health 2>/dev/null)

if [ $? -eq 0 ] && [ -n "$API_RESPONSE" ]; then
    echo -e "${GREEN}   ✅ API respondendo na porta 3001!${NC}"
    echo -e "${CYAN}      Response:${NC}"
    echo "$API_RESPONSE" | jq '.' 2>/dev/null || echo "$API_RESPONSE" | sed 's/^/      /'
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}   ❌ API não está respondendo!${NC}"
    echo -e "${YELLOW}   Verifique: curl http://localhost:3001/health${NC}"
    echo -e "${YELLOW}   Logs: tail -f $BASE_DIR/server/logs/server.log${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 5: HTTPS (LITESPEED)
# ═══════════════════════════════════════════════════════════════

echo -e "${BOLD}${CYAN}[5/6]${NC} 🔒 TESTANDO HTTPS (LiteSpeed)..."
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

HTTPS_RESPONSE=$(curl -I -s -k https://meumu.com 2>&1 | head -n 1)

if echo "$HTTPS_RESPONSE" | grep -q "200\|301\|302"; then
    HTTP_CODE=$(echo "$HTTPS_RESPONSE" | grep -oP '\d{3}' | head -n 1)
    echo -e "${GREEN}   ✅ HTTPS funcionando!${NC}"
    echo -e "${CYAN}      Status: ${HTTP_CODE}${NC}"
    echo -e "${CYAN}      URL: https://meumu.com${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}   ⚠️  HTTPS não configurado ou não acessível${NC}"
    echo -e "${CYAN}      Response: ${HTTPS_RESPONSE}${NC}"
    echo -e "${YELLOW}   Use: bash install.sh (opção 11) para configurar proxy${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 6: PROXY REVERSO (API VIA HTTPS)
# ═══════════════════════════════════════════════════════════════

echo -e "${BOLD}${CYAN}[6/6]${NC} 🔄 TESTANDO PROXY REVERSO (/api)..."
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

PROXY_RESPONSE=$(curl -s -k https://meumu.com/api/health 2>/dev/null)

if [ $? -eq 0 ] && [ -n "$PROXY_RESPONSE" ]; then
    echo -e "${GREEN}   ✅ Proxy reverso funcionando!${NC}"
    echo -e "${CYAN}      Response:${NC}"
    echo "$PROXY_RESPONSE" | jq '.' 2>/dev/null || echo "$PROXY_RESPONSE" | sed 's/^/      /'
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}   ⚠️  Proxy reverso não configurado${NC}"
    echo -e "${YELLOW}   Use: bash install.sh (opção 11) para configurar${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════════════════

echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}📊 RESUMO DA VALIDAÇÃO${NC}"
echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo ""

PERCENTAGE=$((TESTS_PASSED * 100 / TOTAL_TESTS))

echo -e "${CYAN}Total de testes: ${TOTAL_TESTS}${NC}"
echo -e "${GREEN}✅ Testes aprovados: ${TESTS_PASSED}${NC}"
echo -e "${RED}❌ Testes falhados: ${TESTS_FAILED}${NC}"
echo -e "${YELLOW}📈 Taxa de sucesso: ${PERCENTAGE}%${NC}"
echo ""

# Status final
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}🎉 TODOS OS TESTES PASSARAM! PROJETO 100% FUNCIONAL! 🎉${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BOLD}🚀 PRÓXIMO PASSO: COMMIT E PUSH PARA GITHUB${NC}"
    echo ""
    echo -e "${CYAN}Execute:${NC}"
    echo -e "${YELLOW}   git add .${NC}"
    echo -e "${YELLOW}   git commit -m \"feat: Validação completa + limpeza estrutural\"${NC}"
    echo -e "${YELLOW}   git push origin main${NC}"
    echo ""
elif [ $TESTS_PASSED -ge 4 ]; then
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}${BOLD}⚠️  PROJETO FUNCIONAL COM AVISOS${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${CYAN}O projeto está funcional, mas alguns testes falharam.${NC}"
    echo -e "${CYAN}Você pode fazer deploy, mas recomendamos revisar os erros.${NC}"
    echo ""
else
    echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}${BOLD}❌ CORREÇÕES NECESSÁRIAS ANTES DO DEPLOY${NC}"
    echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}Revise os erros acima e execute:${NC}"
    echo -e "${CYAN}   bash install.sh (opção 1 - Instalação Completa)${NC}"
    echo ""
fi

# Salvar log
LOG_FILE="/tmp/meumu-validation-$(date +%Y%m%d_%H%M%S).log"
echo "Validação executada em $(date)" > "$LOG_FILE"
echo "Testes aprovados: $TESTS_PASSED/$TOTAL_TESTS" >> "$LOG_FILE"
echo "Taxa de sucesso: $PERCENTAGE%" >> "$LOG_FILE"

echo -e "${CYAN}📋 Log salvo em: ${LOG_FILE}${NC}"
echo ""
