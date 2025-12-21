#!/bin/bash

##############################################
# 🚀 DEPLOY DE PRODUÇÃO - MeuMU Online
# 
# Este script faz o deploy CORRETO:
# 1. Build do frontend
# 2. Copia dist/ para raiz
# 3. Remove arquivos de dev
# 4. Reinicia servidor
##############################################

set -e  # Parar em caso de erro

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 MeuMU - Deploy de Produção        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

PROJECT_DIR="/home/meumu.com/public_html"

##############################################
# Verificações
##############################################
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado em $PROJECT_DIR${NC}"
    exit 1
fi

cd $PROJECT_DIR

##############################################
# 1. Build do Frontend
##############################################
echo -e "${YELLOW}[1/5]${NC} Fazendo build do frontend..."
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Erro: diretório dist/ não foi criado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build concluído${NC}"
echo ""

##############################################
# 2. Backup da raiz atual (segurança)
##############################################
echo -e "${YELLOW}[2/5]${NC} Criando backup da raiz..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "../backups/$BACKUP_DIR"

# Fazer backup apenas de arquivos importantes
cp -r dist "../backups/$BACKUP_DIR/" 2>/dev/null || true
cp .htaccess "../backups/$BACKUP_DIR/" 2>/dev/null || true

echo -e "${GREEN}✅ Backup criado em ../backups/$BACKUP_DIR${NC}"
echo ""

##############################################
# 3. Remover arquivos de DEV da raiz
##############################################
echo -e "${YELLOW}[3/5]${NC} Removendo arquivos de desenvolvimento..."

# CRÍTICO: Remover APENAS arquivos de dev, NÃO backend ou configs
rm -f index.html 2>/dev/null || true
rm -rf src 2>/dev/null || true
rm -f vite.config.ts 2>/dev/null || true
rm -f tsconfig.json 2>/dev/null || true
rm -f postcss.config.mjs 2>/dev/null || true

echo -e "${GREEN}✅ Arquivos de dev removidos${NC}"
echo ""

##############################################
# 4. Copiar build para raiz
##############################################
echo -e "${YELLOW}[4/5]${NC} Copiando build para raiz..."

cp -r dist/* .

# Copiar .htaccess se não existir na raiz
if [ ! -f ".htaccess" ] || [ ".htaccess" -ot "dist/.htaccess" ]; then
    if [ -f ".htaccess" ]; then
        cp .htaccess .htaccess.backup
    fi
    # Criar .htaccess com configuração de proxy reverso
    cat > .htaccess << 'EOF'
# MeuMU Online - Apache Configuration
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Proxy reverso para API
    RewriteCond %{REQUEST_URI} ^/api
    RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]

    # SPA fallback
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# Segurança
<FilesMatch "\.(tsx?|env|log|md|sh)$">
    Require all denied
</FilesMatch>

# Cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/javascript "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
</IfModule>
EOF
    echo -e "${GREEN}✅ .htaccess criado/atualizado${NC}"
fi

# Verificar se index.html foi copiado
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Erro: index.html não foi copiado!${NC}"
    exit 1
fi

# Verificar se contém código de produção (bundle)
if ! grep -q "/assets/index-" index.html; then
    echo -e "${RED}❌ Erro: index.html não contém bundle de produção!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build copiado para raiz${NC}"
echo ""

##############################################
# 5. Reiniciar servidor web
##############################################
echo -e "${YELLOW}[5/5]${NC} Reiniciando servidor web..."

# LiteSpeed
if systemctl is-active --quiet lsws 2>/dev/null; then
    sudo systemctl restart lsws
    echo -e "${GREEN}✅ LiteSpeed reiniciado${NC}"
# Apache
elif systemctl is-active --quiet apache2 2>/dev/null; then
    sudo systemctl restart apache2
    echo -e "${GREEN}✅ Apache reiniciado${NC}"
# Nginx
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
echo -e "${BLUE}║  ✅ DEPLOY CONCLUÍDO COM SUCESSO!      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}🌐 Acesse:${NC} https://meumu.com"
echo ""

echo -e "${YELLOW}📋 Verificação:${NC}"
echo -e "  1. Abra https://meumu.com no navegador"
echo -e "  2. Pressione F12 → Sources"
echo -e "  3. Deve ver: ${GREEN}assets/index-XXXXX.js${NC}"
echo -e "  4. NÃO deve ver: ${RED}/src ou .tsx${NC}"
echo ""

echo -e "${BLUE}📊 Estatísticas:${NC}"
du -sh assets/ 2>/dev/null && echo "  Tamanho do bundle: $(du -sh assets/ | awk '{print $1}')"
echo "  Backup salvo em: ../backups/$BACKUP_DIR"
echo ""