#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - CONFIGURADOR NGINX PROXY REVERSO
# ═══════════════════════════════════════════════════════════════
# 
# Configura Nginx como proxy reverso para o backend Node.js
# 
# ═══════════════════════════════════════════════════════════════

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${BOLD}🔧 CONFIGURADOR NGINX PROXY REVERSO${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""

# Verificar se rodando como root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}❌ Este script precisa ser executado como root (sudo)${NC}"
   exit 1
fi

# Etapa 1: Verificar se Nginx está instalado
echo -e "${YELLOW}[1/8]${NC} Verificando Nginx..."
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}❌ Nginx não está instalado!${NC}"
    echo -e "${YELLOW}Instale com: sudo apt install nginx -y${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Nginx instalado${NC}"

# Etapa 2: Backup da configuração atual
echo ""
echo -e "${YELLOW}[2/8]${NC} Fazendo backup da configuração atual..."
NGINX_CONFIG="/etc/nginx/sites-available/meumu.com"
if [ -f "$NGINX_CONFIG" ]; then
    cp "$NGINX_CONFIG" "$NGINX_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}✅ Backup criado${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo de configuração não existe, será criado${NC}"
fi

# Etapa 3: Verificar se SSL está configurado
echo ""
echo -e "${YELLOW}[3/8]${NC} Verificando certificado SSL..."
SSL_CERT="/etc/letsencrypt/live/meumu.com/fullchain.pem"
SSL_KEY="/etc/letsencrypt/live/meumu.com/privkey.pem"

if [ ! -f "$SSL_CERT" ] || [ ! -f "$SSL_KEY" ]; then
    echo -e "${RED}❌ Certificados SSL não encontrados!${NC}"
    echo -e "${YELLOW}Execute: sudo certbot --nginx -d meumu.com -d www.meumu.com${NC}"
    echo ""
    echo -n -e "${BOLD}Deseja continuar mesmo assim? (s/N): ${NC}"
    read -r resposta
    if [[ ! "$resposta" =~ ^[Ss]$ ]]; then
        exit 1
    fi
    USE_SSL=false
else
    echo -e "${GREEN}✅ Certificados SSL encontrados${NC}"
    USE_SSL=true
fi

# Etapa 4: Criar configuração do Nginx
echo ""
echo -e "${YELLOW}[4/8]${NC} Criando configuração do Nginx..."

if [ "$USE_SSL" = true ]; then
    # Configuração com SSL
    cat > "$NGINX_CONFIG" << 'EOF'
# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - NGINX PROXY REVERSO (PRODUÇÃO)
# ═══════════════════════════════════════════════════════════════

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name meumu.com www.meumu.com;
    
    # Certificados SSL (Certbot)
    ssl_certificate /etc/letsencrypt/live/meumu.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/meumu.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Root do site (frontend buildado)
    root /home/meumu.com/public_html/dist;
    index index.html;
    
    # ═══════════════════════════════════════════════════════════
    # PROXY REVERSO PARA BACKEND NODE.JS
    # ═══════════════════════════════════════════════════════════
    
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        
        # HTTP/1.1
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS
        add_header 'Access-Control-Allow-Origin' 'https://meumu.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-Requested-With' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        # Preflight
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://meumu.com' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-Requested-With' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # ═══════════════════════════════════════════════════════════
    # FRONTEND (React/Vite SPA)
    # ═══════════════════════════════════════════════════════════
    
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache para assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # ═══════════════════════════════════════════════════════════
    # SEGURANÇA
    # ═══════════════════════════════════════════════════════════
    
    # Bloquear arquivos ocultos
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Bloquear arquivos sensíveis
    location ~ \.(env|log|sql|md|sh)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Logs
    access_log /var/log/nginx/meumu_access.log;
    error_log /var/log/nginx/meumu_error.log;
}

# Redirecionar HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name meumu.com www.meumu.com;
    return 301 https://$server_name$request_uri;
}
EOF
else
    # Configuração sem SSL (apenas HTTP - desenvolvimento)
    cat > "$NGINX_CONFIG" << 'EOF'
# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - NGINX PROXY REVERSO (DESENVOLVIMENTO)
# ═══════════════════════════════════════════════════════════════

server {
    listen 80;
    listen [::]:80;
    server_name meumu.com www.meumu.com;
    
    root /home/meumu.com/public_html/dist;
    index index.html;
    
    # PROXY REVERSO
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # FRONTEND
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # SEGURANÇA
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(env|log|sql|md|sh)$ {
        deny all;
    }
}
EOF
fi

echo -e "${GREEN}✅ Configuração criada${NC}"

# Etapa 5: Criar symlink
echo ""
echo -e "${YELLOW}[5/8]${NC} Criando symlink para sites-enabled..."
ln -sf "$NGINX_CONFIG" "/etc/nginx/sites-enabled/meumu.com"
echo -e "${GREEN}✅ Symlink criado${NC}"

# Etapa 6: Testar configuração
echo ""
echo -e "${YELLOW}[6/8]${NC} Testando configuração do Nginx..."
if nginx -t; then
    echo -e "${GREEN}✅ Configuração válida${NC}"
else
    echo -e "${RED}❌ Erro na configuração!${NC}"
    echo -e "${YELLOW}Restaurando backup...${NC}"
    if [ -f "$NGINX_CONFIG.backup."* ]; then
        cp "$NGINX_CONFIG.backup."* "$NGINX_CONFIG"
    fi
    exit 1
fi

# Etapa 7: Reiniciar Nginx
echo ""
echo -e "${YELLOW}[7/8]${NC} Reiniciando Nginx..."
if systemctl restart nginx; then
    echo -e "${GREEN}✅ Nginx reiniciado${NC}"
else
    echo -e "${RED}❌ Falha ao reiniciar Nginx!${NC}"
    exit 1
fi

# Etapa 8: Verificar se está rodando
echo ""
echo -e "${YELLOW}[8/8]${NC} Verificando status do Nginx..."
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx está rodando${NC}"
else
    echo -e "${RED}❌ Nginx não está rodando!${NC}"
    exit 1
fi

# Resumo final
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ PROXY REVERSO CONFIGURADO COM SUCESSO!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BOLD}📊 RESUMO DA CONFIGURAÇÃO:${NC}"
echo ""
if [ "$USE_SSL" = true ]; then
    echo -e "${CYAN}Modo:${NC} Produção (HTTPS)"
    echo -e "${CYAN}URL Frontend:${NC} https://meumu.com"
    echo -e "${CYAN}URL API:${NC} https://meumu.com/api"
else
    echo -e "${CYAN}Modo:${NC} Desenvolvimento (HTTP)"
    echo -e "${CYAN}URL Frontend:${NC} http://meumu.com"
    echo -e "${CYAN}URL API:${NC} http://meumu.com/api"
fi
echo ""
echo -e "${CYAN}Backend Node.js:${NC} http://127.0.0.1:3001 (interno)"
echo -e "${CYAN}Porta 3001:${NC} Acessível APENAS internamente"
echo ""
echo -e "${BOLD}🔥 PRÓXIMOS PASSOS:${NC}"
echo ""
echo -e "${YELLOW}1) Configurar .env do backend:${NC}"
echo -e "${CYAN}   cd /home/meumu.com/public_html/backend-nodejs${NC}"
echo -e "${CYAN}   cp .env.production .env${NC}"
echo -e "${CYAN}   nano .env (verificar se NODE_ENV=production)${NC}"
echo ""
echo -e "${YELLOW}2) Configurar .env do frontend:${NC}"
echo -e "${CYAN}   cd /home/meumu.com/public_html${NC}"
if [ "$USE_SSL" = true ]; then
    echo -e "${CYAN}   echo 'VITE_API_URL=https://meumu.com/api' > .env${NC}"
else
    echo -e "${CYAN}   echo 'VITE_API_URL=http://meumu.com/api' > .env${NC}"
fi
echo ""
echo -e "${YELLOW}3) Buildar frontend:${NC}"
echo -e "${CYAN}   npm run build${NC}"
echo ""
echo -e "${YELLOW}4) Reiniciar backend:${NC}"
echo -e "${CYAN}   cd backend-nodejs${NC}"
echo -e "${CYAN}   pkill -f node${NC}"
echo -e "${CYAN}   npm start${NC}"
echo ""
echo -e "${YELLOW}5) Testar:${NC}"
if [ "$USE_SSL" = true ]; then
    echo -e "${CYAN}   curl -I https://meumu.com${NC}"
    echo -e "${CYAN}   curl https://meumu.com/api/health${NC}"
else
    echo -e "${CYAN}   curl -I http://meumu.com${NC}"
    echo -e "${CYAN}   curl http://meumu.com/api/health${NC}"
fi
echo ""
echo -e "${GREEN}✅ Tudo pronto! 🚀${NC}"
echo ""
