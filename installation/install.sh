#!/bin/bash

# =====================================================
# MEUMU ONLINE - INSTALADOR AUTOMATIZADO (LINUX)
# =====================================================
# Script de instalação automatizada para Ubuntu/Debian
# Versão: 1.0.0
# =====================================================

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════╗"
echo "║                                            ║"
echo "║       MEUMU ONLINE - INSTALLER             ║"
echo "║       Season 19-2-3 Épico                  ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar se é root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Este script precisa ser executado como root${NC}"
    echo "Execute: sudo ./install.sh"
    exit 1
fi

echo -e "${GREEN}✅ Executando como root${NC}"

# =====================================================
# FUNÇÃO: LOG
# =====================================================
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# =====================================================
# PASSO 1: ATUALIZAR SISTEMA
# =====================================================
log_info "Atualizando sistema..."
apt update && apt upgrade -y
log_success "Sistema atualizado"

# =====================================================
# PASSO 2: INSTALAR NODE.JS
# =====================================================
log_info "Instalando Node.js 18..."

if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    log_warning "Node.js já instalado: $NODE_VERSION"
else
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    log_success "Node.js instalado: $(node -v)"
fi

# =====================================================
# PASSO 3: INSTALAR MARIADB
# =====================================================
log_info "Instalando MariaDB..."

if command -v mysql &> /dev/null; then
    log_warning "MariaDB já instalado"
else
    apt install -y mariadb-server mariadb-client
    systemctl start mariadb
    systemctl enable mariadb
    log_success "MariaDB instalado"
    
    log_warning "Execute 'mysql_secure_installation' após a instalação"
fi

# =====================================================
# PASSO 4: INSTALAR PM2
# =====================================================
log_info "Instalando PM2..."

if command -v pm2 &> /dev/null; then
    log_warning "PM2 já instalado"
else
    npm install -g pm2
    pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER
    log_success "PM2 instalado"
fi

# =====================================================
# PASSO 5: INSTALAR NGINX
# =====================================================
log_info "Instalando Nginx..."

if command -v nginx &> /dev/null; then
    log_warning "Nginx já instalado"
else
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
    log_success "Nginx instalado"
fi

# =====================================================
# PASSO 6: INSTALAR CERTBOT (SSL)
# =====================================================
log_info "Instalando Certbot..."

if command -v certbot &> /dev/null; then
    log_warning "Certbot já instalado"
else
    apt install -y certbot python3-certbot-nginx
    log_success "Certbot instalado"
fi

# =====================================================
# PASSO 7: CRIAR DIRETÓRIO DO PROJETO
# =====================================================
log_info "Configurando diretório do projeto..."

PROJECT_DIR="/var/www/meumuonline"

if [ -d "$PROJECT_DIR" ]; then
    log_warning "Diretório já existe: $PROJECT_DIR"
else
    mkdir -p $PROJECT_DIR
    chown -R $SUDO_USER:$SUDO_USER $PROJECT_DIR
    log_success "Diretório criado: $PROJECT_DIR"
fi

# =====================================================
# PASSO 8: INSTALAR DEPENDÊNCIAS DO PROJETO
# =====================================================
log_info "Instalando dependências do projeto..."

cd $PROJECT_DIR

# Frontend
if [ -f "package.json" ]; then
    sudo -u $SUDO_USER npm install
    log_success "Dependências frontend instaladas"
fi

# Backend
if [ -f "backend-nodejs/package.json" ]; then
    cd backend-nodejs
    sudo -u $SUDO_USER npm install
    cd ..
    log_success "Dependências backend instaladas"
fi

# =====================================================
# PASSO 9: CONFIGURAR FIREWALL
# =====================================================
log_info "Configurando firewall (UFW)..."

if command -v ufw &> /dev/null; then
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    ufw --force enable
    log_success "Firewall configurado"
else
    apt install -y ufw
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    log_success "Firewall instalado e configurado"
fi

# =====================================================
# PASSO 10: CRIAR ARQUIVO .ENV
# =====================================================
log_info "Criando arquivo .env..."

if [ ! -f "$PROJECT_DIR/backend-nodejs/.env" ]; then
    cp $PROJECT_DIR/backend-nodejs/.env.example $PROJECT_DIR/backend-nodejs/.env
    log_success "Arquivo .env criado"
    log_warning "IMPORTANTE: Edite $PROJECT_DIR/backend-nodejs/.env com suas configurações"
else
    log_warning "Arquivo .env já existe"
fi

# =====================================================
# CONCLUSÃO
# =====================================================
echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════╗"
echo "║                                            ║"
echo "║    ✅ INSTALAÇÃO BASE CONCLUÍDA            ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. Configure o banco de dados MySQL:"
echo "   sudo mysql_secure_installation"
echo ""
echo "2. Edite o arquivo .env:"
echo "   nano $PROJECT_DIR/backend-nodejs/.env"
echo ""
echo "3. Importe o banco de dados:"
echo "   cd $PROJECT_DIR/installation"
echo "   ./setup-database.sh"
echo ""
echo "4. Build do frontend:"
echo "   cd $PROJECT_DIR"
echo "   npm run build"
echo ""
echo "5. Inicie o backend:"
echo "   pm2 start backend-nodejs/src/server.js --name meumuonline-api"
echo "   pm2 save"
echo ""
echo "6. Configure o Nginx:"
echo "   ./setup-nginx.sh"
echo ""
echo "7. Obtenha SSL (após configurar domínio):"
echo "   sudo certbot --nginx -d seudominio.com"
echo ""
echo "8. Acesse o instalador visual:"
echo "   https://seudominio.com/install"
echo ""
echo -e "${GREEN}🎉 Boa sorte com seu servidor!${NC}"
echo ""
