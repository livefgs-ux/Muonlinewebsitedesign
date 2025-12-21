#!/bin/bash

##############################################
# 🚀 DEPLOY COMPLETO - MeuMU Online
# 
# Deploy de produção:
# - Build frontend
# - Deploy backend
# - Configuração completa
##############################################

set -e  # Parar em caso de erro

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 MeuMU Online - Deploy Completo    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

PROJECT_DIR="/home/meumu.com/public_html"

##############################################
# 1. Build Frontend
##############################################
echo -e "${YELLOW}[1/4]${NC} Build do frontend..."
cd $PROJECT_DIR
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Erro: Build falhou!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build concluído${NC}"
echo ""

##############################################
# 2. Deploy Frontend
##############################################
echo -e "${YELLOW}[2/4]${NC} Deploy do frontend..."

# Backup
BACKUP_DIR="../backups/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r dist "$BACKUP_DIR/" 2>/dev/null || true

# Remover arquivos de dev
rm -f index.html 2>/dev/null || true
rm -rf src 2>/dev/null || true

# Copiar build
cp -r dist/* .

# Verificar
if ! grep -q "/assets/index-" index.html; then
    echo -e "${RED}❌ Erro: index.html de produção não foi copiado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend deployado${NC}"
echo ""

##############################################
# 3. Configurar Backend
##############################################
echo -e "${YELLOW}[3/4]${NC} Configurando backend..."

cd $PROJECT_DIR/backend-nodejs

# Verificar .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}📝 Arquivo .env criado. Configure as credenciais!${NC}"
        echo -e "${BLUE}Execute: nano backend-nodejs/.env${NC}"
        exit 1
    fi
fi

# Instalar dependências
if [ ! -d "node_modules" ]; then
    npm install
fi

# Iniciar/Reiniciar com PM2
pm2 delete meumu-backend 2>/dev/null || true
pm2 start src/server.js --name meumu-backend --watch --ignore-watch="node_modules"
pm2 save

echo -e "${GREEN}✅ Backend configurado${NC}"
echo ""

##############################################
# 4. Reiniciar Servidor Web
##############################################
echo -e "${YELLOW}[4/4]${NC} Reiniciando servidor web..."

if systemctl is-active --quiet lsws 2>/dev/null; then
    sudo systemctl restart lsws
    echo -e "${GREEN}✅ LiteSpeed reiniciado${NC}"
elif systemctl is-active --quiet apache2 2>/dev/null; then
    sudo systemctl restart apache2
    echo -e "${GREEN}✅ Apache reiniciado${NC}"
elif systemctl is-active --quiet nginx 2>/dev/null; then
    sudo systemctl restart nginx
    echo -e "${GREEN}✅ Nginx reiniciado${NC}"
else
    echo -e "${YELLOW}⚠️  Nenhum servidor web detectado${NC}"
fi

echo ""

##############################################
# Resultado
##############################################
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  ✅ DEPLOY CONCLUÍDO!                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}🌐 Site:${NC} https://meumu.com"
echo -e "${GREEN}🔌 Backend:${NC} http://localhost:3001"
echo ""

echo -e "${YELLOW}📊 Status:${NC}"
pm2 status
echo ""

echo -e "${BLUE}📋 Verificação:${NC}"
echo -e "  1. Acesse: ${GREEN}https://meumu.com${NC}"
echo -e "  2. F12 → Sources"
echo -e "  3. Verifique: ${GREEN}/assets/index-XXXXX.js${NC}"
echo -e "  4. NÃO deve ter: ${RED}/src ou .tsx${NC}"
echo ""
