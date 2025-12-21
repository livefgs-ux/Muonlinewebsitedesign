#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo -e "${CYAN}${BOLD}"
echo "════════════════════════════════════════════════════════════"
echo "   MeuMU Online - Fix Backend Crash"
echo "════════════════════════════════════════════════════════════"
echo -e "${NC}"
echo ""

BACKEND_DIR="/home/meumu.com/public_html/backend-nodejs"

# 1. Parar TUDO
echo -e "${CYAN}1. Parando TODOS os processos...${NC}"
pm2 delete all 2>/dev/null
pm2 kill 2>/dev/null
pkill -9 node 2>/dev/null
sleep 2

echo -e "${GREEN}✅ Tudo parado${NC}"
echo ""

# 2. Ir para o backend
cd "$BACKEND_DIR" || { echo -e "${RED}❌ Backend não encontrado!${NC}"; exit 1; }

# 3. Verificar estrutura
echo -e "${CYAN}2. Verificando estrutura...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env NÃO EXISTE!${NC}"
    echo ""
    echo -e "${YELLOW}Execute o instalador: http://meumu.com/install${NC}"
    exit 1
else
    echo -e "${GREEN}✅ .env existe${NC}"
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules não existe!${NC}"
    echo -e "${CYAN}Instalando...${NC}"
    npm install || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
    echo -e "${GREEN}✅ Instalado${NC}"
else
    echo -e "${GREEN}✅ node_modules existe${NC}"
fi

if [ ! -f "src/server.js" ]; then
    echo -e "${RED}❌ src/server.js NÃO EXISTE!${NC}"
    exit 1
else
    echo -e "${GREEN}✅ src/server.js existe${NC}"
fi

echo ""

# 4. Mostrar configuração (sem senhas)
echo -e "${CYAN}3. Configuração atual (.env):${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
grep -v "PASSWORD\|SECRET" .env | head -20
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo ""

# 5. Testar MySQL
echo -e "${CYAN}4. Testando conexão MySQL...${NC}"

DB_HOST=$(grep "^DB_HOST=" .env | cut -d= -f2 | tr -d ' ')
DB_USER=$(grep "^DB_USER=" .env | cut -d= -f2 | tr -d ' ')
DB_PASSWORD=$(grep "^DB_PASSWORD=" .env | cut -d= -f2 | tr -d ' ')
DB_NAME=$(grep "^DB_NAME=" .env | cut -d= -f2 | tr -d ' ')

echo "Host: $DB_HOST"
echo "User: $DB_USER"
echo "Database: $DB_NAME"
echo ""

if command -v mysql &> /dev/null; then
    if mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME;" 2>/dev/null; then
        echo -e "${GREEN}✅ Conexão MySQL OK!${NC}"
    else
        echo -e "${RED}❌ ERRO DE CONEXÃO MYSQL!${NC}"
        echo ""
        echo -e "${YELLOW}Verifique:${NC}"
        echo "  1. MySQL está rodando: systemctl status mysql"
        echo "  2. Usuário/senha corretos no .env"
        echo "  3. Database existe: mysql -e 'SHOW DATABASES;'"
        echo ""
        read -p "Continuar mesmo assim? (s/N): " CONT
        if [[ ! "$CONT" =~ ^[Ss]$ ]]; then
            exit 1
        fi
    fi
else
    echo -e "${YELLOW}⚠️  MySQL client não instalado (pulando teste)${NC}"
fi

echo ""

# 6. Testar backend MANUALMENTE
echo -e "${CYAN}5. Testando backend manualmente...${NC}"
echo -e "${YELLOW}   (Pressione Ctrl+C após ver 'Server running' ou se houver erro)${NC}"
echo ""
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"

# Rodar em foreground para ver erros
timeout 10 node src/server.js 2>&1 &
NODE_PID=$!

sleep 5

# Verificar se ainda está rodando
if ps -p $NODE_PID > /dev/null 2>&1; then
    echo ""
    echo -e "${GREEN}✅ Backend rodou por 5 segundos sem crashar!${NC}"
    
    # Testar API
    echo ""
    echo -e "${CYAN}Testando API...${NC}"
    RESULT=$(curl -s http://localhost:3001/api/server/health 2>/dev/null)
    
    if echo "$RESULT" | grep -q "healthy"; then
        echo -e "${GREEN}✅ API RESPONDENDO!${NC}"
        echo "Resposta: ${RESULT:0:150}"
        
        # Matar teste
        kill $NODE_PID 2>/dev/null
        
        echo ""
        echo -e "${CYAN}6. Iniciando com PM2...${NC}"
        
        # Limpar PM2
        pm2 delete all 2>/dev/null
        
        # Iniciar UMA ÚNICA instância
        pm2 start src/server.js --name meumu-backend --instances 1
        pm2 save
        
        sleep 3
        
        echo ""
        echo -e "${CYAN}Status PM2:${NC}"
        pm2 status
        
        echo ""
        echo -e "${CYAN}Testando novamente...${NC}"
        sleep 2
        
        FINAL=$(curl -s http://localhost:3001/api/server/health 2>/dev/null)
        
        if echo "$FINAL" | grep -q "healthy"; then
            echo -e "${GREEN}${BOLD}"
            echo "╔══════════════════════════════════════════════════════════╗"
            echo "║                                                          ║"
            echo "║          ✅ BACKEND FUNCIONANDO! ✅                     ║"
            echo "║                                                          ║"
            echo "╚══════════════════════════════════════════════════════════╝"
            echo -e "${NC}"
            echo ""
            echo -e "${YELLOW}Próximo passo: Configurar proxy${NC}"
            echo -e "${CYAN}Execute: ./migrar-para-nginx.sh${NC}"
        else
            echo -e "${RED}❌ PM2 não conseguiu manter o backend rodando${NC}"
            echo ""
            echo -e "${YELLOW}Ver logs:${NC}"
            pm2 logs meumu-backend --lines 30
        fi
        
    else
        echo -e "${RED}❌ Backend rodou mas API não responde!${NC}"
        echo "Resposta: ${RESULT:0:200}"
        kill $NODE_PID 2>/dev/null
    fi
else
    echo ""
    echo -e "${RED}❌ BACKEND CRASHOU!${NC}"
    echo ""
    echo -e "${YELLOW}Veja o erro acima ↑${NC}"
    echo ""
    echo -e "${CYAN}Erros comuns:${NC}"
    echo "  • Porta 3001 já em uso"
    echo "  • Erro de conexão MySQL (credenciais incorretas)"
    echo "  • Módulos faltando (npm install)"
    echo "  • Erro de sintaxe no código"
fi

echo ""
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo ""
