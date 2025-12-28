#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# DIAGNÓSTICO COMPLETO DO BACKEND
# ═══════════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  🔍 DIAGNÓSTICO COMPLETO DO BACKEND${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

# 1. Verificar se Node.js está instalado
echo -e "${YELLOW}[1/8] Verificando Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js instalado: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js NÃO instalado!${NC}"
fi
echo ""

# 2. Verificar processos Node.js rodando
echo -e "${YELLOW}[2/8] Verificando processos Node.js...${NC}"
if ps aux | grep -v grep | grep "node.*server.js" > /dev/null; then
    echo -e "${GREEN}✅ Processos Node.js encontrados:${NC}"
    ps aux | grep -v grep | grep "node.*server.js"
else
    echo -e "${RED}❌ NENHUM processo Node.js rodando!${NC}"
    echo -e "${YELLOW}   O backend NÃO ESTÁ INICIADO!${NC}"
fi
echo ""

# 3. Verificar porta 3001
echo -e "${YELLOW}[3/8] Verificando porta 3001...${NC}"
if netstat -tulnp 2>/dev/null | grep :3001 > /dev/null || ss -tulnp 2>/dev/null | grep :3001 > /dev/null; then
    echo -e "${GREEN}✅ Porta 3001 em uso:${NC}"
    netstat -tulnp 2>/dev/null | grep :3001 || ss -tulnp 2>/dev/null | grep :3001
else
    echo -e "${RED}❌ Porta 3001 NÃO está em uso!${NC}"
    echo -e "${YELLOW}   O servidor backend NÃO está rodando!${NC}"
fi
echo ""

# 4. Testar conexão localhost:3001
echo -e "${YELLOW}[4/8] Testando conexão localhost:3001/health...${NC}"
HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend respondendo!${NC}"
    echo -e "${CYAN}Resposta:${NC}"
    echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"
else
    echo -e "${RED}❌ Backend NÃO está respondendo!${NC}"
    echo -e "${YELLOW}   curl falhou ao conectar em localhost:3001${NC}"
fi
echo ""

# 5. Verificar logs do backend
echo -e "${YELLOW}[5/8] Verificando logs do backend...${NC}"
LOG_FILE="/home/meumu.com/public_html/backend-nodejs/logs/server.log"
if [ -f "$LOG_FILE" ]; then
    echo -e "${GREEN}✅ Arquivo de log existe${NC}"
    echo -e "${CYAN}Últimas 20 linhas:${NC}"
    echo ""
    tail -20 "$LOG_FILE"
else
    echo -e "${RED}❌ Arquivo de log NÃO existe!${NC}"
    echo -e "${YELLOW}   Path: $LOG_FILE${NC}"
    echo -e "${YELLOW}   O servidor NUNCA foi iniciado ou logs não foram criados${NC}"
fi
echo ""

# 6. Verificar PM2
echo -e "${YELLOW}[6/8] Verificando PM2...${NC}"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ PM2 instalado${NC}"
    echo -e "${CYAN}Lista de processos PM2:${NC}"
    pm2 list
else
    echo -e "${YELLOW}⚠️  PM2 NÃO instalado (usando nohup)${NC}"
fi
echo ""

# 7. Verificar .env do backend
echo -e "${YELLOW}[7/8] Verificando .env do backend...${NC}"
ENV_FILE="/home/meumu.com/public_html/backend-nodejs/.env"
if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✅ Arquivo .env existe${NC}"
    
    # Verificar PORT
    PORT=$(grep "^PORT=" "$ENV_FILE" | cut -d'=' -f2)
    if [ -n "$PORT" ]; then
        echo -e "${CYAN}   PORT=$PORT${NC}"
    else
        echo -e "${RED}   ❌ PORT não definido!${NC}"
    fi
    
    # Verificar DB_HOST
    DB_HOST=$(grep "^DB_HOST=" "$ENV_FILE" | cut -d'=' -f2)
    if [ -n "$DB_HOST" ]; then
        echo -e "${CYAN}   DB_HOST=$DB_HOST${NC}"
    else
        echo -e "${RED}   ❌ DB_HOST não definido!${NC}"
    fi
else
    echo -e "${RED}❌ Arquivo .env NÃO existe!${NC}"
    echo -e "${YELLOW}   Path: $ENV_FILE${NC}"
fi
echo ""

# 8. Verificar MySQL
echo -e "${YELLOW}[8/8] Verificando MySQL...${NC}"
if sudo mysql -e "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MySQL acessível${NC}"
    
    # Verificar databases
    DB_MU=$(sudo mysql -e "SHOW DATABASES LIKE 'muonline';" 2>/dev/null | grep muonline)
    DB_WEB=$(sudo mysql -e "SHOW DATABASES LIKE 'meuweb';" 2>/dev/null | grep meuweb)
    
    if [ -n "$DB_MU" ]; then
        echo -e "${GREEN}   ✅ Database 'muonline' existe${NC}"
    else
        echo -e "${RED}   ❌ Database 'muonline' NÃO existe!${NC}"
    fi
    
    if [ -n "$DB_WEB" ]; then
        echo -e "${GREEN}   ✅ Database 'meuweb' existe${NC}"
    else
        echo -e "${RED}   ❌ Database 'meuweb' NÃO existe!${NC}"
    fi
else
    echo -e "${RED}❌ MySQL NÃO acessível!${NC}"
fi
echo ""

# RESUMO
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  📊 RESUMO DO DIAGNÓSTICO${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

if ps aux | grep -v grep | grep "node.*server.js" > /dev/null; then
    echo -e "${GREEN}✅ Backend ESTÁ RODANDO${NC}"
else
    echo -e "${RED}❌ Backend NÃO ESTÁ RODANDO!${NC}"
    echo ""
    echo -e "${YELLOW}💡 SOLUÇÃO:${NC}"
    echo -e "${CYAN}   cd /home/meumu.com/public_html${NC}"
    echo -e "${CYAN}   ./install.sh${NC}"
    echo -e "${CYAN}   Escolha opção 5 (Reiniciar Servidor)${NC}"
fi

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
