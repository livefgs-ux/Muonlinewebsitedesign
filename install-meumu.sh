#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - INSTALADOR AUTOMÁTICO
# ═══════════════════════════════════════════════════════════════

echo "🚀 Instalando MeuMU Online..."
echo "════════════════════════════════════════════════════════════"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Diretórios
BACKEND_DIR="/home/meumu.com/public_html/backend-nodejs"
FRONTEND_DIR="/home/meumu.com/public_html"

# ═══════════════════════════════════════════════════════════════
# 1. VERIFICAR SE MYSQL ESTÁ RODANDO
# ═══════════════════════════════════════════════════════════════

echo ""
echo "📊 Verificando MySQL/MariaDB..."

if ! systemctl is-active --quiet mariadb; then
    echo -e "${RED}❌ MariaDB não está rodando!${NC}"
    echo -e "${YELLOW}Iniciando MariaDB...${NC}"
    sudo systemctl start mariadb
    
    if ! systemctl is-active --quiet mariadb; then
        echo -e "${RED}❌ Falha ao iniciar MariaDB!${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ MySQL/MariaDB está rodando${NC}"

# ═══════════════════════════════════════════════════════════════
# 2. COPIAR .ENV CORRIGIDO
# ═══════════════════════════════════════════════════════════════

echo ""
echo "📝 Configurando .env..."

if [ -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}⚠️  Backup do .env existente${NC}"
    cp "$BACKEND_DIR/.env" "$BACKEND_DIR/.env.backup.$(date +%Y%m%d_%H%M%S)"
fi

if [ -f "$BACKEND_DIR/.env.production" ]; then
    cp "$BACKEND_DIR/.env.production" "$BACKEND_DIR/.env"
    echo -e "${GREEN}✅ .env configurado${NC}"
else
    echo -e "${RED}❌ Arquivo .env.production não encontrado!${NC}"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
# 3. INSTALAR DEPENDÊNCIAS DO BACKEND (SE NECESSÁRIO)
# ═══════════════════════════════════════════════════════════════

echo ""
echo "📦 Verificando dependências do backend..."

cd "$BACKEND_DIR"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Instalando dependências...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
else
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
fi

# ═══════════════════════════════════════════════════════════════
# 4. REBUILD DO FRONTEND
# ═══════════════════════════════════════════════════════════════

echo ""
echo "⚛️  Rebuilding frontend..."

cd "$FRONTEND_DIR"

if [ -d "dist" ]; then
    echo -e "${YELLOW}⚠️  Backup do dist existente${NC}"
    mv dist "dist.backup.$(date +%Y%m%d_%H%M%S)"
fi

npm run build

if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Frontend buildado com sucesso${NC}"
else
    echo -e "${RED}❌ Falha ao buildar frontend!${NC}"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
# 5. MATAR PROCESSOS NODE ANTIGOS
# ═══════════════════════════════════════════════════════════════

echo ""
echo "🔄 Reiniciando servidor Node.js..."

pkill -f "node.*server.js" 2>/dev/null || true
sleep 2

# ═══════════════════════════════════════════════════════════════
# 6. TESTAR CONEXÃO COM BANCO
# ═══════════════════════════════════════════════════════════════

echo ""
echo "🔍 Testando conexão com banco de dados..."

mysql -u root -p@mysql123@ -e "SHOW DATABASES;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Conexão com MySQL OK${NC}"
    
    # Verificar se databases existem
    DB_MU=$(mysql -u root -p@mysql123@ -e "SHOW DATABASES LIKE 'muonline';" 2>/dev/null | grep muonline)
    DB_WEB=$(mysql -u root -p@mysql123@ -e "SHOW DATABASES LIKE 'webmu';" 2>/dev/null | grep webmu)
    
    if [ -z "$DB_MU" ]; then
        echo -e "${RED}❌ Database 'muonline' não existe!${NC}"
        exit 1
    fi
    
    if [ -z "$DB_WEB" ]; then
        echo -e "${YELLOW}⚠️  Database 'webmu' não existe. Criando...${NC}"
        mysql -u root -p@mysql123@ -e "CREATE DATABASE webmu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        echo -e "${GREEN}✅ Database 'webmu' criada${NC}"
    fi
    
else
    echo -e "${RED}❌ Falha na conexão com MySQL!${NC}"
    echo -e "${YELLOW}Verifique a senha no .env${NC}"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
# 7. INICIAR SERVIDOR NODE.JS EM BACKGROUND
# ═══════════════════════════════════════════════════════════════

echo ""
echo "🚀 Iniciando servidor Node.js..."

cd "$BACKEND_DIR"

# Criar pasta de logs se não existir
mkdir -p logs/alerts logs/audit logs/security

# Iniciar servidor em background com PM2 (se instalado) ou nohup
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Usando PM2...${NC}"
    pm2 delete meumu-backend 2>/dev/null || true
    pm2 start src/server.js --name meumu-backend
    pm2 save
    echo -e "${GREEN}✅ Servidor iniciado com PM2${NC}"
else
    echo -e "${YELLOW}PM2 não instalado. Usando nohup...${NC}"
    nohup npm start > logs/server.log 2>&1 &
    sleep 3
    echo -e "${GREEN}✅ Servidor iniciado em background${NC}"
fi

# ═══════════════════════════════════════════════════════════════
# 8. VERIFICAR SE SERVIDOR ESTÁ RESPONDENDO
# ═══════════════════════════════════════════════════════════════

echo ""
echo "🔍 Verificando se servidor está respondendo..."

sleep 5

HEALTH_CHECK=$(curl -s http://localhost:3001/health 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Servidor está respondendo!${NC}"
    echo ""
    echo "$HEALTH_CHECK" | grep -o '"status":"[^"]*"' || echo "$HEALTH_CHECK"
else
    echo -e "${RED}❌ Servidor não está respondendo!${NC}"
    echo -e "${YELLOW}Verifique os logs em: $BACKEND_DIR/logs/server.log${NC}"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
# 9. SUCESSO!
# ═══════════════════════════════════════════════════════════════

echo ""
echo "════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📡 URLs de acesso:"
echo "   Frontend: http://meumu.com:3001"
echo "   API:      http://meumu.com:3001/api"
echo "   Health:   http://meumu.com:3001/health"
echo "   Install:  http://meumu.com:3001/install"
echo ""
echo "📊 Monitorar logs:"
echo "   tail -f $BACKEND_DIR/logs/server.log"
echo ""
echo "🔄 Reiniciar servidor:"
if command -v pm2 &> /dev/null; then
    echo "   pm2 restart meumu-backend"
else
    echo "   pkill -f 'node.*server.js' && cd $BACKEND_DIR && npm start &"
fi
echo ""
echo "════════════════════════════════════════════════════════════"
