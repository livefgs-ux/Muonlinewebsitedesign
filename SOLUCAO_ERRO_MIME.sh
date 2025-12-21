#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Solução Definitiva para Erro MIME Type
# 
# ERRO: "Expected a JavaScript-or-Wasm module script but the server 
#        responded with a MIME type of application/octet-stream"
#
# @version 1.0.0
# @author MeuMU Team
#═══════════════════════════════════════════════════════════════════

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║     🔧 MeuMU Online - Correção de Erro MIME Type 🔧         ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

echo -e "${YELLOW}Detectando o problema...${NC}"
echo ""

# Detectar caminho atual
CURRENT_DIR=$(pwd)
echo -e "${CYAN}📁 Caminho atual: ${CURRENT_DIR}${NC}"
echo ""

# 1. VERIFICAR SE /dist EXISTE
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASSO 1: Verificar se pasta /dist existe${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Pasta /dist existe${NC}"
    
    if [ -f "dist/index.html" ]; then
        echo -e "${GREEN}✅ dist/index.html encontrado${NC}"
    else
        echo -e "${RED}❌ dist/index.html NÃO encontrado - build incompleto!${NC}"
        BUILD_NEEDED=true
    fi
    
    if [ -d "dist/assets" ]; then
        echo -e "${GREEN}✅ dist/assets existe${NC}"
    else
        echo -e "${RED}❌ dist/assets NÃO existe - build incompleto!${NC}"
        BUILD_NEEDED=true
    fi
else
    echo -e "${RED}❌ Pasta /dist NÃO EXISTE!${NC}"
    echo -e "${YELLOW}⚠️  O React precisa ser buildado!${NC}"
    BUILD_NEEDED=true
fi

echo ""

# 2. BUILDAR SE NECESSÁRIO
if [ "$BUILD_NEEDED" = true ]; then
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}PASSO 2: Buildar React para Produção${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    
    # Verificar se npm está disponível
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ ERRO: npm não encontrado!${NC}"
        echo ""
        echo -e "${YELLOW}Instale o Node.js primeiro:${NC}"
        echo "  https://nodejs.org/"
        echo ""
        exit 1
    fi
    
    echo -e "${YELLOW}🔨 Instalando dependências...${NC}"
    npm install
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro ao instalar dependências!${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${YELLOW}🔨 Buildando React...${NC}"
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro ao buildar React!${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
else
    echo -e "${GREEN}✅ Build já existe, pulando...${NC}"
fi

echo ""

# 3. CRIAR/VERIFICAR .htaccess
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASSO 3: Configurar .htaccess${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

HTACCESS_CONTENT='# MeuMU Online - Apache Configuration

<IfModule mod_rewrite.c>
	RewriteEngine On
	RewriteBase /
	
	# Servir arquivos estáticos diretamente
	RewriteCond %{REQUEST_FILENAME} -f [OR]
	RewriteCond %{REQUEST_FILENAME} -d
	RewriteRule ^ - [L]
	
	# React Router - redirecionar tudo para index.html
	RewriteRule ^ index.html [L]
</IfModule>

# Segurança
Options -Indexes

# Compressão GZIP
<IfModule mod_deflate.c>
	AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# MIME Types Corretos (IMPORTANTE!)
<IfModule mod_mime.c>
	AddType application/javascript .js .mjs
	AddType text/css .css
	AddType text/html .html
	AddType image/svg+xml .svg
	AddType application/json .json
</IfModule>

# Cache
<IfModule mod_expires.c>
	ExpiresActive On
	ExpiresByType image/jpg "access plus 1 year"
	ExpiresByType image/jpeg "access plus 1 year"
	ExpiresByType image/gif "access plus 1 year"
	ExpiresByType image/png "access plus 1 year"
	ExpiresByType image/svg+xml "access plus 1 year"
	ExpiresByType text/css "access plus 1 month"
	ExpiresByType application/javascript "access plus 1 month"
</IfModule>'

if [ -f "dist/.htaccess" ]; then
    echo -e "${YELLOW}⚠️  .htaccess já existe${NC}"
    echo -e "${CYAN}Criando backup...${NC}"
    cp dist/.htaccess dist/.htaccess.backup.$(date +%s)
fi

echo "$HTACCESS_CONTENT" > dist/.htaccess
echo -e "${GREEN}✅ .htaccess criado/atualizado!${NC}"

echo ""

# 4. CONFIGURAR APACHE
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASSO 4: Configurar Apache/Nginx${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

echo -e "${YELLOW}O DocumentRoot do seu servidor web deve apontar para:${NC}"
echo -e "${GREEN}${CURRENT_DIR}/dist${NC}"
echo ""

echo -e "${CYAN}Para Apache, edite o VirtualHost:${NC}"
echo -e "${PURPLE}sudo nano /etc/apache2/sites-available/meumu.conf${NC}"
echo ""
echo -e "${CYAN}E configure assim:${NC}"
cat << EOF

${YELLOW}<VirtualHost *:80>
    ServerName meumu.com
    ServerAlias www.meumu.com
    
    DocumentRoot ${CURRENT_DIR}/dist
    
    <Directory ${CURRENT_DIR}/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog \${APACHE_LOG_DIR}/meumu_error.log
    CustomLog \${APACHE_LOG_DIR}/meumu_access.log combined
</VirtualHost>${NC}

EOF

echo ""
echo -e "${YELLOW}Depois, habilite o site e reinicie o Apache:${NC}"
echo -e "${GREEN}sudo a2ensite meumu.conf${NC}"
echo -e "${GREEN}sudo a2enmod rewrite${NC}"
echo -e "${GREEN}sudo systemctl restart apache2${NC}"

echo ""

# 5. VERIFICAÇÃO FINAL
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASSO 5: Verificação Final${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

ERRORS=0

if [ ! -f "dist/index.html" ]; then
    echo -e "${RED}❌ dist/index.html não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ dist/index.html OK${NC}"
fi

if [ ! -d "dist/assets" ]; then
    echo -e "${RED}❌ dist/assets não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ dist/assets OK${NC}"
fi

if [ ! -f "dist/.htaccess" ]; then
    echo -e "${RED}❌ dist/.htaccess não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ dist/.htaccess OK${NC}"
fi

echo ""

# RESULTADO FINAL
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                  ✅ TUDO PRONTO! ✅                          ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${PURPLE}Próximos passos:${NC}"
    echo -e "  1. Configure o Apache (instruções acima)"
    echo -e "  2. Reinicie o Apache: ${GREEN}sudo systemctl restart apache2${NC}"
    echo -e "  3. Acesse: ${CYAN}http://meumu.com${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE: Limpe o cache do navegador (Ctrl+Shift+R)${NC}"
else
    echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║              ❌ ERROS DETECTADOS (${ERRORS}) ❌                      ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Corrija os erros acima e execute novamente.${NC}"
fi

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}       Correção de Erro MIME Type - Completo${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
