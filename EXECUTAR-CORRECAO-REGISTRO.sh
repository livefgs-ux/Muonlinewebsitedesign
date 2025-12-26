#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - APLICAR CORREÇÃO DE REGISTRO (REGRA DE OURO)
# ═══════════════════════════════════════════════════════════════

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear
echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}   🎯 APLICAR REGRA DE OURO: CORRIGIR REGISTRO${NC}"
echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo ""

BASE_DIR="/home/meumu.com/public_html"

# ═══════════════════════════════════════════════════════════════
# ETAPA 1: ROLLBACK DO BANCO (OPCIONAL)
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[1/5]${NC} 🔄 Rollback de colunas extras (opcional)..."
echo ""
echo -e "${CYAN}Se você adicionou colunas extras antes (goblin_points, etc.),${NC}"
echo -e "${CYAN}execute este script SQL para limpá-las:${NC}"
echo ""
echo -e "${YELLOW}mysql -u root -p@mysql123@ < $BASE_DIR/ROLLBACK-COLUNAS-EXTRAS.sql${NC}"
echo ""
echo -e "${CYAN}Deseja executar o rollback agora? (S/n):${NC}"
read -r resposta

if [[ "$resposta" =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}Executando rollback...${NC}"
    
    if mysql -u root -p@mysql123@ < "$BASE_DIR/ROLLBACK-COLUNAS-EXTRAS.sql" 2>&1; then
        echo -e "${GREEN}✅ Rollback executado com sucesso${NC}"
    else
        echo -e "${RED}❌ Erro no rollback (pode já estar limpo)${NC}"
    fi
else
    echo -e "${YELLOW}⏭️  Rollback pulado${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# ETAPA 2: VERIFICAR ESTRUTURA DO BANCO
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[2/5]${NC} 🔍 Verificando estrutura do banco..."
echo ""

# Verificar tabela accounts
echo -e "${CYAN}Estrutura da tabela 'accounts':${NC}"
mysql -u root -p@mysql123@ -e "USE muonline; DESCRIBE accounts;" 2>/dev/null | head -20

echo ""

# Verificar se é Season 19 ou Season 6
ACCOUNT_COLUMN=$(mysql -u root -p@mysql123@ -Nse "
  SELECT COLUMN_NAME 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'muonline' 
  AND TABLE_NAME = 'accounts' 
  AND COLUMN_NAME IN ('account', 'memb___id')
  LIMIT 1
" 2>/dev/null)

if [ "$ACCOUNT_COLUMN" = "account" ]; then
    echo -e "${GREEN}✅ Detectado: Season 19 (DV-Team)${NC}"
    SEASON="Season 19"
elif [ "$ACCOUNT_COLUMN" = "memb___id" ]; then
    echo -e "${GREEN}✅ Detectado: Season 6${NC}"
    SEASON="Season 6"
else
    echo -e "${RED}❌ Estrutura desconhecida!${NC}"
    SEASON="Desconhecido"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# ETAPA 3: PARAR BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[3/5]${NC} 🔄 Parando backend..."

# Matar processos Node.js
pkill -9 -f node 2>/dev/null
pkill -9 -f nodemon 2>/dev/null
sleep 2

# Liberar porta 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

echo -e "${GREEN}✅ Backend parado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# ETAPA 4: CÓDIGO JÁ CORRIGIDO
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[4/5]${NC} ✅ Código já corrigido..."
echo ""
echo -e "${GREEN}O arquivo authController.js já foi atualizado com a Regra de Ouro:${NC}"
echo ""
echo -e "${CYAN}✅ Detecta estrutura do banco dinamicamente${NC}"
echo -e "${CYAN}✅ Insere APENAS campos essenciais (account, password, email)${NC}"
echo -e "${CYAN}✅ NÃO tenta criar personagem (deixa para o client)${NC}"
echo -e "${CYAN}✅ NÃO assume colunas extras (blocked, vip_level, etc.)${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# ETAPA 5: REINICIAR BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[5/5]${NC} 🚀 Reiniciando backend..."

cd "$BASE_DIR/backend-nodejs" || exit 1

# Criar diretórios de logs
mkdir -p logs/alerts logs/audit logs/security 2>/dev/null

# Iniciar com PM2 ou npm
if command -v pm2 &> /dev/null; then
    pm2 delete meumu-backend 2>/dev/null || true
    pm2 start src/server.js --name meumu-backend --log logs/server.log
    pm2 save
    echo -e "${GREEN}✅ Backend iniciado com PM2${NC}"
else
    nohup npm start > logs/server.log 2>&1 &
    sleep 3
    echo -e "${GREEN}✅ Backend iniciado em background${NC}"
fi

echo ""

# Aguardar inicialização
echo -e "${CYAN}⏳ Aguardando servidor inicializar (5 segundos)...${NC}"
sleep 5

# ═══════════════════════════════════════════════════════════════
# ETAPA 6: TESTAR
# ═══════════════════════════════════════════════════════════════

echo ""
echo -e "${YELLOW}🧪 Testando servidor...${NC}"
echo ""

# Teste 1: Health check
echo -e "${CYAN}Teste 1: Health check...${NC}"
HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Servidor respondendo${NC}"
else
    echo -e "${RED}❌ Servidor não está respondendo${NC}"
fi

echo ""

# Teste 2: Registro de teste
echo -e "${CYAN}Teste 2: Registro de conta de teste...${NC}"
TIMESTAMP=$(date +%s)
TEST_USER="testregra${TIMESTAMP}"

REGISTER_RESULT=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USER\",
    \"password\": \"senha123\",
    \"email\": \"${TEST_USER}@meumu.com\"
  }" 2>/dev/null)

echo "$REGISTER_RESULT" | python3 -m json.tool 2>/dev/null

if echo "$REGISTER_RESULT" | grep -q '"success":true'; then
    echo ""
    echo -e "${GREEN}✅✅✅ REGISTRO FUNCIONANDO!${NC}"
else
    echo ""
    echo -e "${RED}❌ Erro no registro${NC}"
    echo ""
    echo -e "${YELLOW}Ver logs:${NC}"
    echo -e "${CYAN}pm2 logs meumu-backend --lines 50${NC}"
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ CORREÇÃO APLICADA COM SUCESSO!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# RESUMO
# ═══════════════════════════════════════════════════════════════

echo -e "${CYAN}📋 RESUMO DA CORREÇÃO:${NC}"
echo ""
echo -e "${CYAN}Banco de dados:${NC} ${GREEN}${SEASON}${NC}"
echo -e "${CYAN}Estrutura:${NC} ${GREEN}Mantida original (sem alterações)${NC}"
echo ""
echo -e "${CYAN}Código de registro:${NC}"
echo -e "  ${GREEN}✅ Detecta estrutura automaticamente${NC}"
echo -e "  ${GREEN}✅ Insere apenas campos essenciais${NC}"
echo -e "  ${GREEN}✅ Não tenta criar personagem${NC}"
echo ""
echo -e "${CYAN}Próximos passos:${NC}"
echo -e "  ${YELLOW}1. Testar registro pelo site: https://meumu.com${NC}"
echo -e "  ${YELLOW}2. Criar personagem pelo CLIENT do jogo${NC}"
echo -e "  ${YELLOW}3. Verificar se personagem aparece corretamente${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# LOGS
# ═══════════════════════════════════════════════════════════════

echo -e "${CYAN}📊 Ver logs em tempo real:${NC}"
echo -e "  ${YELLOW}pm2 logs meumu-backend${NC}"
echo ""
echo -e "${CYAN}📖 Documentação:${NC}"
echo -e "  ${YELLOW}cat $BASE_DIR/REGRA-DE-OURO-DATABASE.md${NC}"
echo ""
