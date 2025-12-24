#!/bin/bash

# ═══════════════════════════════════════════════════════════════
#  TESTE DE SEGURANÇA - MeuMU Online
#  Valida todas as proteções implementadas
# ═══════════════════════════════════════════════════════════════

echo "🔒 TESTE DE SEGURANÇA - MeuMU Online"
echo "════════════════════════════════════════════════════════════════"
echo ""

API_URL="http://localhost:3001"
PASSED=0
FAILED=0

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ═══════════════════════════════════════════════════════════════
# FUNÇÕES DE TESTE
# ═══════════════════════════════════════════════════════════════

test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="$5"
    local expected_keyword="$6"
    
    echo -n "  Testando: $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL$endpoint")
    fi
    
    status=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status" = "$expected_status" ]; then
        if [ -z "$expected_keyword" ] || echo "$body" | grep -q "$expected_keyword"; then
            echo -e "${GREEN}✅ PASSOU${NC}"
            ((PASSED++))
            return 0
        fi
    fi
    
    echo -e "${RED}❌ FALHOU${NC}"
    echo "     Esperado: HTTP $expected_status com '$expected_keyword'"
    echo "     Recebido: HTTP $status"
    echo "     Body: $body" | head -c 200
    echo ""
    ((FAILED++))
    return 1
}

# ═══════════════════════════════════════════════════════════════
# TESTE 1: EMAIL TEMPORÁRIO BLOQUEADO
# ═══════════════════════════════════════════════════════════════

echo "🧪 [1/14] Email Temporário Bloqueado"
test_endpoint \
    "Bloquear 10minutemail.com" \
    "POST" \
    "/api/auth/register" \
    '{"username":"test","email":"test@10minutemail.com","password":"Test123!@#"}' \
    "400" \
    "temporários não são permitidos"

test_endpoint \
    "Bloquear guerrillamail.com" \
    "POST" \
    "/api/auth/register" \
    '{"username":"test","email":"test@guerrillamail.com","password":"Test123!@#"}' \
    "400" \
    "temporários não são permitidos"

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 2: SENHA FRACA BLOQUEADA
# ═══════════════════════════════════════════════════════════════

echo "🧪 [2/14] Senha Fraca Bloqueada"
test_endpoint \
    "Bloquear senha sem maiúscula" \
    "POST" \
    "/api/auth/register" \
    '{"username":"test","email":"test@gmail.com","password":"test123!"}' \
    "400" \
    "Senha muito fraca"

test_endpoint \
    "Bloquear senha sem número" \
    "POST" \
    "/api/auth/register" \
    '{"username":"test","email":"test@gmail.com","password":"Test!@#$"}' \
    "400" \
    "Senha muito fraca"

test_endpoint \
    "Bloquear senha sem especial" \
    "POST" \
    "/api/auth/register" \
    '{"username":"test","email":"test@gmail.com","password":"Test1234"}' \
    "400" \
    "Senha muito fraca"

test_endpoint \
    "Bloquear senha curta" \
    "POST" \
    "/api/auth/register" \
    '{"username":"test","email":"test@gmail.com","password":"Tt1!"}' \
    "400" \
    "Senha muito fraca"

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 3: AUTENTICAÇÃO OBRIGATÓRIA
# ═══════════════════════════════════════════════════════════════

echo "🧪 [3/14] Autenticação Obrigatória"
test_endpoint \
    "Bloquear acesso sem token" \
    "GET" \
    "/api/characters" \
    "" \
    "401" \
    "Token não fornecido"

test_endpoint \
    "Bloquear token inválido" \
    "GET" \
    "/api/characters" \
    '{"Authorization":"Bearer token_falso_123"}' \
    "401" \
    "Token inválido"

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 4: RATE LIMITING
# ═══════════════════════════════════════════════════════════════

echo "🧪 [4/14] Rate Limiting (pode demorar)"
echo "  Enviando 6 requisições rápidas para /api/auth/login..."

for i in {1..6}; do
    status=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"username":"fake","password":"fake"}' \
        "$API_URL/api/auth/login")
    
    if [ $i -eq 6 ] && [ "$status" = "429" ]; then
        echo -e "  ${GREEN}✅ Rate limit funcionando (HTTP 429 na 6ª tentativa)${NC}"
        ((PASSED++))
    elif [ $i -lt 6 ]; then
        echo -n "."
    fi
done

echo ""
echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 5: XSS SANITIZAÇÃO
# ═══════════════════════════════════════════════════════════════

echo "🧪 [5/14] XSS Sanitização"
test_endpoint \
    "Sanitizar <script>" \
    "POST" \
    "/api/auth/register" \
    '{"username":"<script>alert(1)</script>","email":"test@gmail.com","password":"Test123!@#"}' \
    "400" \
    ""

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 6: HEALTH CHECK
# ═══════════════════════════════════════════════════════════════

echo "🧪 [6/14] Health Check"
test_endpoint \
    "Servidor funcionando" \
    "GET" \
    "/health" \
    "" \
    "200" \
    "healthy"

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 7: CORS
# ═══════════════════════════════════════════════════════════════

echo "🧪 [7/14] CORS Headers"
headers=$(curl -s -I "$API_URL/health" | grep -i "access-control")
if [ -n "$headers" ]; then
    echo -e "  ${GREEN}✅ Headers CORS presentes${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Headers CORS ausentes${NC}"
    ((FAILED++))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 8: HELMET HEADERS
# ═══════════════════════════════════════════════════════════════

echo "🧪 [8/14] Helmet Security Headers"

check_header() {
    local header="$1"
    local name="$2"
    
    if curl -s -I "$API_URL/health" | grep -qi "$header"; then
        echo -e "  ${GREEN}✅ $name presente${NC}"
        ((PASSED++))
    else
        echo -e "  ${YELLOW}⚠️  $name ausente (ok se não em produção)${NC}"
    fi
}

check_header "x-content-type-options" "X-Content-Type-Options"
check_header "x-frame-options" "X-Frame-Options"

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 9: ARQUIVOS SENSÍVEIS PROTEGIDOS
# ═══════════════════════════════════════════════════════════════

echo "🧪 [9/14] Arquivos Sensíveis Protegidos"

check_file_blocked() {
    local file="$1"
    local name="$2"
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$file")
    
    if [ "$status" = "404" ] || [ "$status" = "403" ]; then
        echo -e "  ${GREEN}✅ $name bloqueado (HTTP $status)${NC}"
        ((PASSED++))
    else
        echo -e "  ${RED}❌ $name ACESSÍVEL (HTTP $status) - VULNERABILIDADE!${NC}"
        ((FAILED++))
    fi
}

check_file_blocked "/.env" ".env"
check_file_blocked "/.git/config" ".git/config"
check_file_blocked "/package.json" "package.json"

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 10: SQL INJECTION BÁSICO
# ═══════════════════════════════════════════════════════════════

echo "🧪 [10/14] SQL Injection Básico"
test_endpoint \
    "Prevenir SQL injection no login" \
    "POST" \
    "/api/auth/login" \
    "{\"username\":\"admin' OR '1'='1\",\"password\":\"' OR '1'='1\"}" \
    "401" \
    ""

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 11: LOGS EXISTEM
# ═══════════════════════════════════════════════════════════════

echo "🧪 [11/14] Sistema de Logs"

if [ -d "logs/audit" ]; then
    echo -e "  ${GREEN}✅ Diretório de audit logs existe${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Diretório de audit logs não existe${NC}"
    ((FAILED++))
fi

if [ -d "logs/security" ]; then
    echo -e "  ${GREEN}✅ Diretório de security logs existe${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Diretório de security logs não existe${NC}"
    ((FAILED++))
fi

if [ -d "logs/alerts" ]; then
    echo -e "  ${GREEN}✅ Diretório de alerts existe${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Diretório de alerts não existe${NC}"
    ((FAILED++))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 12: MIDDLEWARES DE SEGURANÇA EXISTEM
# ═══════════════════════════════════════════════════════════════

echo "🧪 [12/14] Middlewares de Segurança"

check_file_exists() {
    local file="$1"
    local name="$2"
    
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✅ $name existe${NC}"
        ((PASSED++))
    else
        echo -e "  ${RED}❌ $name não existe${NC}"
        ((FAILED++))
    fi
}

check_file_exists "src/middleware/security.js" "security.js"
check_file_exists "src/middleware/audit-log.js" "audit-log.js"
check_file_exists "src/middleware/security-alerts.js" "security-alerts.js"

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 13: GITIGNORE PROTEGE DADOS SENSÍVEIS
# ═══════════════════════════════════════════════════════════════

echo "🧪 [13/14] GitIgnore Proteção"

if [ -f ".gitignore" ]; then
    if grep -q ".env" .gitignore; then
        echo -e "  ${GREEN}✅ .env no .gitignore${NC}"
        ((PASSED++))
    else
        echo -e "  ${RED}❌ .env NÃO está no .gitignore - PERIGO!${NC}"
        ((FAILED++))
    fi
    
    if grep -q "logs/" .gitignore; then
        echo -e "  ${GREEN}✅ logs/ no .gitignore${NC}"
        ((PASSED++))
    else
        echo -e "  ${YELLOW}⚠️  logs/ não está no .gitignore${NC}"
    fi
else
    echo -e "  ${RED}❌ .gitignore não existe!${NC}"
    ((FAILED++))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 14: DOCUMENTAÇÃO EXISTE
# ═══════════════════════════════════════════════════════════════

echo "🧪 [14/14] Documentação de Segurança"

check_file_exists "../SEGURANCA_IMPLEMENTADA.md" "SEGURANCA_IMPLEMENTADA.md"
check_file_exists "../ANALISE_SEGURANCA.md" "ANALISE_SEGURANCA.md"
check_file_exists "nginx-security.conf" "nginx-security.conf"

echo ""

# ═══════════════════════════════════════════════════════════════
# RESULTADO FINAL
# ═══════════════════════════════════════════════════════════════

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo "════════════════════════════════════════════════════════════════"
echo "  RESULTADO FINAL"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "  Total de testes: $TOTAL"
echo -e "  ${GREEN}Passou: $PASSED${NC}"
echo -e "  ${RED}Falhou: $FAILED${NC}"
echo ""
echo "  Score de Segurança: $PERCENTAGE%"
echo ""

if [ $PERCENTAGE -ge 90 ]; then
    echo -e "  ${GREEN}✅ EXCELENTE! Site muito seguro! 🔒🚀${NC}"
elif [ $PERCENTAGE -ge 70 ]; then
    echo -e "  ${YELLOW}⚠️  BOM. Mas precisa melhorar alguns itens.${NC}"
else
    echo -e "  ${RED}❌ CRÍTICO! Site vulnerável! Corrija urgentemente!${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

if [ $FAILED -gt 0 ]; then
    echo "💡 AÇÕES NECESSÁRIAS:"
    echo ""
    echo "  1. Revise os testes que falharam acima"
    echo "  2. Corrija os problemas indicados"
    echo "  3. Execute o teste novamente"
    echo "  4. Leia /SEGURANCA_IMPLEMENTADA.md"
    echo ""
fi

exit $([ $FAILED -eq 0 ] && echo 0 || echo 1)
