#!/bin/bash

# =====================================================
# SETUP NGINX - Configuração do Servidor Web
# =====================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════╗"
echo "║   CONFIGURAÇÃO DO NGINX                    ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"

# Solicitar informações
read -p "Nome do domínio (ex: meumuonline.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Domínio é obrigatório${NC}"
    exit 1
fi

read -p "Incluir www? (s/n) [s]: " INCLUDE_WWW
INCLUDE_WWW=${INCLUDE_WWW:-s}

if [ "$INCLUDE_WWW" = "s" ]; then
    SERVER_NAME="$DOMAIN www.$DOMAIN"
else
    SERVER_NAME="$DOMAIN"
fi

PROJECT_DIR="/var/www/meumuonline"

# Criar configuração do Nginx
NGINX_CONF="/etc/nginx/sites-available/meumuonline"

echo -e "${BLUE}Criando configuração do Nginx...${NC}"

cat > $NGINX_CONF << 'EOF'
server {
    listen 80;
    server_name SERVER_NAME_PLACEHOLDER;

    # Frontend (arquivos estáticos)
    root PROJECT_DIR_PLACEHOLDER/dist;
    index index.html;

    # Configuração para SPA (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API (proxy para Node.js)
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Upload de arquivos
    location /uploads {
        alias PROJECT_DIR_PLACEHOLDER/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logs
    access_log /var/log/nginx/meumuonline-access.log;
    error_log /var/log/nginx/meumuonline-error.log;
}
EOF

# Substituir placeholders
sed -i "s|SERVER_NAME_PLACEHOLDER|$SERVER_NAME|g" $NGINX_CONF
sed -i "s|PROJECT_DIR_PLACEHOLDER|$PROJECT_DIR|g" $NGINX_CONF

echo -e "${GREEN}✅ Configuração criada${NC}"

# Criar link simbólico
if [ -L "/etc/nginx/sites-enabled/meumuonline" ]; then
    echo -e "${YELLOW}Link simbólico já existe${NC}"
else
    ln -s /etc/nginx/sites-available/meumuonline /etc/nginx/sites-enabled/
    echo -e "${GREEN}✅ Link simbólico criado${NC}"
fi

# Remover site padrão
if [ -L "/etc/nginx/sites-enabled/default" ]; then
    rm /etc/nginx/sites-enabled/default
    echo -e "${GREEN}✅ Site padrão removido${NC}"
fi

# Testar configuração
echo -e "${BLUE}Testando configuração...${NC}"
nginx -t

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Configuração válida${NC}"
    
    # Reiniciar Nginx
    systemctl restart nginx
    echo -e "${GREEN}✅ Nginx reiniciado${NC}"
else
    echo -e "${RED}❌ Erro na configuração${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════╗"
echo "║   ✅ NGINX CONFIGURADO                     ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${YELLOW}📝 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. Certifique-se de que o DNS está apontando para este servidor"
echo ""
echo "2. Obtenha certificado SSL (HTTPS):"
echo "   sudo certbot --nginx -d $DOMAIN"
if [ "$INCLUDE_WWW" = "s" ]; then
    echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi
echo ""
echo "3. Acesse seu site:"
echo "   http://$DOMAIN"
echo ""
echo "4. Após obter SSL, acesse:"
echo "   https://$DOMAIN"
echo ""
