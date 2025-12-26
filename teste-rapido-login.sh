#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - TESTE RÁPIDO DE LOGIN/REGISTRO
# ═══════════════════════════════════════════════════════════════

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}       🔍 MEUMU ONLINE - TESTE RÁPIDO DE LOGIN${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 1: Verificar se backend está rodando
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[1/6]${NC} Verificando se backend está rodando..."

HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend está rodando${NC}"
    
    # Verificar se database está conectado
    if echo "$HEALTH" | grep -q '"database":"connected"'; then
        echo -e "${GREEN}✅ Database conectado${NC}"
    else
        echo -e "${RED}❌ Database desconectado${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Backend não está rodando!${NC}"
    echo -e "${YELLOW}Execute: pm2 start backend-nodejs/src/server.js${NC}"
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 2: Verificar estrutura da tabela accounts
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[2/6]${NC} Verificando estrutura da tabela accounts..."

ESTRUTURA=$(mysql -u root -p@mysql123@ muonline -e \
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS \
     WHERE TABLE_SCHEMA='muonline' AND TABLE_NAME='accounts' \
     AND COLUMN_NAME IN ('account', 'memb___id') LIMIT 1;" 2>/dev/null | tail -n 1)

if [ "$ESTRUTURA" = "account" ]; then
    echo -e "${GREEN}✅ Estrutura: Season 19 (account, password, email)${NC}"
    SEASON=19
elif [ "$ESTRUTURA" = "memb___id" ]; then
    echo -e "${GREEN}✅ Estrutura: Season 6 (memb___id, memb__pwd, mail_addr)${NC}"
    SEASON=6
else
    echo -e "${RED}❌ Estrutura não reconhecida!${NC}"
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 3: Criar conta de teste no banco
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[3/6]${NC} Criando conta de teste no banco..."

# Deletar se já existir
mysql -u root -p@mysql123@ muonline -e \
    "DELETE FROM accounts WHERE memb___id='testefab';" 2>/dev/null

# Criar conta
if [ "$SEASON" = "19" ]; then
    # Season 19
    mysql -u root -p@mysql123@ muonline -e \
        "INSERT INTO accounts (account, password, email, created_at, blocked, vip_level, cash_credits) \
         VALUES ('testefab', 'e10adc3949ba59abbe56e057f20f883e', 'testefab@meumu.com', NOW(), 0, 0, 0);" \
        2>/dev/null
else
    # Season 6
    mysql -u root -p@mysql123@ muonline -e \
        "INSERT INTO accounts (memb___id, memb__pwd, memb_name, sno__numb, post_code, addr_info, addr_deta, \
                               tel__numb, phon_numb, mail_addr, fpas_ques, fpas_answ, job__code, appl_days, \
                               modi_days, out__days, true_days, mail_chek, bloc_code, ctl1_code, AccountLevel, \
                               AccountExpireDate, CashCredits) \
         VALUES ('testefab', 'e10adc3949ba59abbe56e057f20f883e', 'testefab', '0000000000000', '000000', \
                 'N/A', 'N/A', '000-0000-0000', '000-0000-0000', 'testefab@meumu.com', '', '', '', NOW(), \
                 NOW(), NOW(), NOW(), '1', '0', '0', '0', NULL, 0);" \
        2>/dev/null
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Conta 'testefab' criada no banco${NC}"
    echo -e "${CYAN}   Username: testefab${NC}"
    echo -e "${CYAN}   Senha: senha123${NC}"
else
    echo -e "${RED}❌ Erro ao criar conta no banco${NC}"
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 4: Verificar se conta foi criada corretamente
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[4/6]${NC} Verificando conta no banco..."

if [ "$SEASON" = "19" ]; then
    CONTA=$(mysql -u root -p@mysql123@ muonline -e \
        "SELECT account, CHAR_LENGTH(password) as hash_len, email FROM accounts WHERE account='testefab';" \
        2>/dev/null | tail -n 1)
else
    CONTA=$(mysql -u root -p@mysql123@ muonline -e \
        "SELECT memb___id, CHAR_LENGTH(memb__pwd) as hash_len, mail_addr FROM accounts WHERE memb___id='testefab';" \
        2>/dev/null | tail -n 1)
fi

if echo "$CONTA" | grep -q "32"; then
    echo -e "${GREEN}✅ Conta verificada (hash MD5 com 32 caracteres)${NC}"
else
    echo -e "${RED}❌ Conta com hash inválido!${NC}"
    echo "$CONTA"
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 5: Testar registro via API
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[5/6]${NC} Testando registro via API..."

REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testapi",
        "password": "senha123",
        "email": "testapi@meumu.com"
    }')

if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Registro via API funcionando${NC}"
    
    # Limpar conta de teste
    mysql -u root -p@mysql123@ muonline -e \
        "DELETE FROM accounts WHERE memb___id='testapi';" 2>/dev/null
else
    echo -e "${RED}❌ Erro ao registrar via API${NC}"
    echo -e "${CYAN}Resposta:${NC}"
    echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# TESTE 6: Testar login via API
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[6/6]${NC} Testando login via API..."

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testefab",
        "password": "senha123"
    }')

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Login via API funcionando${NC}"
    
    # Extrair token
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$TOKEN" ]; then
        echo -e "${CYAN}   Token JWT gerado: ${TOKEN:0:50}...${NC}"
    fi
else
    echo -e "${RED}❌ Erro ao fazer login via API${NC}"
    echo -e "${CYAN}Resposta:${NC}"
    echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
    
    echo ""
    echo -e "${YELLOW}🔍 Verificando logs do backend...${NC}"
    echo ""
    pm2 logs meumu-backend --lines 30 --nostream 2>/dev/null | tail -n 30
fi

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}       ✅ TESTE COMPLETO${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# RESUMO
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}📋 RESUMO:${NC}"
echo ""
echo -e "${CYAN}Acesse o site:${NC}"
echo -e "   http://meumu.com:3001"
echo ""
echo -e "${CYAN}Credenciais de teste:${NC}"
echo -e "   Username: ${GREEN}testefab${NC}"
echo -e "   Senha:    ${GREEN}senha123${NC}"
echo ""
echo -e "${CYAN}Ver logs em tempo real:${NC}"
echo -e "   pm2 logs meumu-backend"
echo ""
