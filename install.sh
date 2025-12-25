#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - INSTALAÇÃO AUTOMÁTICA
# ═══════════════════════════════════════════════════════════════

echo "🚀 MEUMU ONLINE - Instalação Automática"
echo "════════════════════════════════════════════════════════════"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ════════════════════════════════════════════════════════════════
# ETAPA 1: Verificar MySQL
# ════════════════════════════════════════════════════════════════

echo ""
echo "1️⃣ Verificando MySQL..."

if mysql -u root -p@mysql123@ -e "SHOW DATABASES;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MySQL está rodando e acessível${NC}"
    
    # Verificar databases
    DB_MU=$(mysql -u root -p@mysql123@ -e "SHOW DATABASES LIKE 'muonline';" 2>/dev/null | grep muonline)
    DB_WEB=$(mysql -u root -p@mysql123@ -e "SHOW DATABASES LIKE 'webmu';" 2>/dev/null | grep webmu)
    
    if [ -z "$DB_MU" ]; then
        echo -e "${RED}❌ Database 'muonline' não existe!${NC}"
        exit 1
    else
        echo -e "${GREEN}   ✅ Database 'muonline' OK${NC}"
    fi
    
    if [ -z "$DB_WEB" ]; then
        echo -e "${YELLOW}   ⚠️  Database 'webmu' não existe. Criando...${NC}"
        mysql -u root -p@mysql123@ -e "CREATE DATABASE webmu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}   ✅ Database 'webmu' criada${NC}"
        else
            echo -e "${RED}   ❌ Falha ao criar database 'webmu'${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}   ✅ Database 'webmu' OK${NC}"
    fi
else
    echo -e "${RED}❌ Não foi possível conectar ao MySQL!${NC}"
    echo -e "${YELLOW}Verifique a senha: @mysql123@${NC}"
    exit 1
fi

# ════════════════════════════════════════════════════════════════
# ETAPA 2: Copiar .env
# ════════════════════════════════════════════════════════════════

echo ""
echo "2️⃣ Configurando .env..."

if [ ! -f "backend-nodejs/.env.production" ]; then
    echo -e "${RED}❌ Arquivo backend-nodejs/.env.production não encontrado!${NC}"
    echo ""
    echo "💡 Certifique-se de estar em /home/meumu.com/public_html/"
    exit 1
fi

# Backup do .env existente
if [ -f "backend-nodejs/.env" ]; then
    cp backend-nodejs/.env backend-nodejs/.env.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${YELLOW}   Backup criado${NC}"
fi

# Copiar
cp backend-nodejs/.env.production backend-nodejs/.env
echo -e "${GREEN}✅ .env configurado${NC}"

# ════════════════════════════════════════════════════════════════
# ETAPA 3: Rebuildar Frontend
# ════════════════════════════════════════════════════════════════

echo ""
echo "3️⃣ Rebuildando frontend..."

# Backup do dist
if [ -d "dist" ]; then
    mv dist dist.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null
    echo -e "${YELLOW}   Backup do dist criado${NC}"
fi

# Build
echo -e "${YELLOW}   Aguarde, isso pode levar alguns minutos...${NC}"
npm run build

if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Frontend buildado com sucesso${NC}"
else
    echo -e "${RED}❌ Falha ao buildar frontend!${NC}"
    echo ""
    echo "Tente manualmente:"
    echo "   npm run build"
    exit 1
fi

# ════════════════════════════════════════════════════════════════
# ETAPA 4: Reiniciar Servidor Node.js
# ════════════════════════════════════════════════════════════════

echo ""
echo "4️⃣ Reiniciando servidor Node.js..."

# Matar processos antigos
pkill -f "node.*server.js" 2>/dev/null
pkill -f "nodemon.*server.js" 2>/dev/null
sleep 2
echo -e "${GREEN}   ✅ Processos antigos encerrados${NC}"

# Criar diretórios de logs
mkdir -p backend-nodejs/logs/alerts backend-nodejs/logs/audit backend-nodejs/logs/security 2>/dev/null

# Iniciar servidor
cd backend-nodejs

# Verificar se PM2 está instalado
if command -v pm2 &> /dev/null; then
    echo -e "${BLUE}   Usando PM2...${NC}"
    pm2 delete meumu-backend 2>/dev/null || true
    pm2 start src/server.js --name meumu-backend --log logs/server.log
    pm2 save
    echo -e "${GREEN}✅ Servidor iniciado com PM2${NC}"
else
    echo -e "${BLUE}   Usando npm start em background...${NC}"
    nohup npm start > logs/server.log 2>&1 &
    SERVER_PID=$!
    sleep 3
    
    # Verificar se o processo ainda está rodando
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Servidor iniciado (PID: $SERVER_PID)${NC}"
    else
        echo -e "${RED}❌ Servidor falhou ao iniciar!${NC}"
        echo ""
        echo "Verifique os logs:"
        echo "   tail -50 backend-nodejs/logs/server.log"
        exit 1
    fi
fi

cd ..

# ════════════════════════════════════════════════════════════════
# ETAPA 5: Testar Servidor
# ════════════════════════════════════════════════════════════════

echo ""
echo "5️⃣ Testando servidor..."
echo -e "${YELLOW}   Aguardando servidor inicializar (5 segundos)...${NC}"

sleep 5

# Testar health endpoint
HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Servidor está respondendo!${NC}"
    
    # Mostrar status
    echo ""
    echo "📊 Status do servidor:"
    echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"
else
    echo -e "${RED}❌ Servidor não está respondendo!${NC}"
    echo ""
    echo "📋 Últimas 30 linhas do log:"
    tail -30 backend-nodejs/logs/server.log
    echo ""
    echo "💡 Verifique o log completo:"
    echo "   tail -f backend-nodejs/logs/server.log"
    exit 1
fi

# ════════════════════════════════════════════════════════════════
# SUCESSO!
# ════════════════════════════════════════════════════════════════

echo ""
echo "════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅✅✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO! ✅✅✅${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🌐 ACESSE O SITE:"
echo -e "   ${BLUE}http://meumu.com:3001${NC}"
echo -e "   ${BLUE}http://meumu.com:3001/install${NC}"
echo ""
echo "📡 ENDPOINTS DA API:"
echo "   http://meumu.com:3001/api/server/info"
echo "   http://meumu.com:3001/api/rankings/resets"
echo "   http://meumu.com:3001/health"
echo ""
echo "📊 MONITORAR LOGS:"
echo "   tail -f backend-nodejs/logs/server.log"
echo ""
echo "🔄 REINICIAR SERVIDOR:"
if command -v pm2 &> /dev/null; then
    echo "   pm2 restart meumu-backend"
    echo "   pm2 logs meumu-backend"
else
    echo "   pkill -f 'node.*server.js'"
    echo "   cd backend-nodejs && npm start &"
fi
echo ""
echo "════════════════════════════════════════════════════════════"
