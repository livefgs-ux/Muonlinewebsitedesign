#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Migrar para Nginx
# OpenLiteSpeed tem problemas com proxy, Nginx funciona perfeitamente
#═══════════════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo -e "${CYAN}${BOLD}"
echo "════════════════════════════════════════════════════════════"
echo "   MeuMU Online - Migrar para Nginx"
echo "════════════════════════════════════════════════════════════"
echo -e "${NC}"
echo ""

DOMAIN="meumu.com"
PUBLIC_HTML="/home/${DOMAIN}/public_html"

echo -e "${YELLOW}⚠️  Este script vai:${NC}"
echo "  1. Instalar Nginx"
echo "  2. Parar OpenLiteSpeed (porta 80/443)"
echo "  3. Configurar Nginx com proxy para backend"
echo "  4. Iniciar Nginx"
echo ""
read -p "Continuar? (s/N): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Ss]$ ]]; then
    echo -e "${RED}Cancelado${NC}"
    exit 0
fi

echo ""

# 1. Instalar Nginx
echo -e "${CYAN}1. Instalando Nginx...${NC}"
sudo apt update
sudo apt install nginx -y

if ! command -v nginx &> /dev/null; then
    echo -e "${RED}❌ Erro ao instalar Nginx!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Nginx instalado!${NC}"
echo ""

# 2. Parar OpenLiteSpeed
echo -e "${CYAN}2. Parando OpenLiteSpeed...${NC}"
sudo systemctl stop lsws
sudo systemctl disable lsws

echo -e "${GREEN}✅ OpenLiteSpeed parado${NC}"
echo ""

# 3. Criar configuração Nginx
echo -e "${CYAN}3. Criando configuração Nginx...${NC}"

sudo tee /etc/nginx/sites-available/${DOMAIN} > /dev/null << 'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    server_name meumu.com www.meumu.com;

    root /home/meumu.com/public_html/dist;
    index index.html;

    # Logs
    access_log /var/log/nginx/meumu.com-access.log;
    error_log /var/log/nginx/meumu.com-error.log;

    # ════════════════════════════════════════════════════════
    # PROXY PARA BACKEND NODE.JS
    # ════════════════════════════════════════════════════════
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # ════════════════════════════════════════════════════════
    # REACT ROUTER - SPA
    # ════════════════════════════════════════════════════════
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ════════════════════════════════════════════════════════
    # CACHE DE ASSETS ESTÁTICOS
    # ════════════════════════════════════════════════════════
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # ════════════════════════════════════════════════════════
    # SEGURANÇA
    # ════════════════════════════════════════════════════════
    # Bloquear acesso a arquivos sensíveis
    location ~ /\.(?!well-known) {
        deny all;
    }

    # Desabilitar listagem de diretórios
    autoindex off;

    # Limites de tamanho
    client_max_body_size 10M;
}
NGINXCONF

# Substituir domínio se necessário
sudo sed -i "s|/home/meumu.com/|${PUBLIC_HTML%/*}/|g" /etc/nginx/sites-available/${DOMAIN}

echo -e "${GREEN}✅ Configuração criada!${NC}"
echo ""

# 4. Ativar site
echo -e "${CYAN}4. Ativando site...${NC}"

# Remover default
sudo rm -f /etc/nginx/sites-enabled/default

# Ativar meumu.com
sudo ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/

echo -e "${GREEN}✅ Site ativado!${NC}"
echo ""

# 5. Testar configuração
echo -e "${CYAN}5. Testando configuração Nginx...${NC}"
sudo nginx -t

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro na configuração!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuração OK!${NC}"
echo ""

# 6. Iniciar Nginx
echo -e "${CYAN}6. Iniciando Nginx...${NC}"
sudo systemctl enable nginx
sudo systemctl restart nginx

if ! systemctl is-active --quiet nginx; then
    echo -e "${RED}❌ Nginx não iniciou!${NC}"
    sudo systemctl status nginx
    exit 1
fi

echo -e "${GREEN}✅ Nginx rodando!${NC}"
echo ""

# 7. Aguardar e testar
echo -e "${CYAN}7. Aguardando 5 segundos...${NC}"
sleep 5

echo ""
echo -e "${CYAN}8. Testando proxy...${NC}"
echo ""

# Teste 1: Backend direto
echo -e "${YELLOW}Teste 1: Backend direto${NC}"
BACKEND=$(curl -s http://localhost:3001/api/server/health 2>/dev/null)
echo "${BACKEND:0:150}"
echo ""

# Teste 2: Proxy via Nginx
echo -e "${YELLOW}Teste 2: Proxy via Nginx${NC}"
PROXY=$(curl -s http://${DOMAIN}/api/server/health 2>/dev/null)
echo "${PROXY:0:150}"
echo ""

# Resultado
if echo "$PROXY" | grep -q "healthy"; then
    echo -e "${GREEN}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                                                          ║"
    echo "║          ✅✅✅ NGINX FUNCIONANDO! ✅✅✅              ║"
    echo "║                                                          ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${GREEN}🎮 Acesse: http://${DOMAIN}${NC}"
    echo -e "${CYAN}Limpe cache: Ctrl+Shift+R${NC}"
    echo ""
    echo -e "${YELLOW}Próximo passo: Configurar SSL${NC}"
    echo -e "${CYAN}sudo apt install certbot python3-certbot-nginx -y${NC}"
    echo -e "${CYAN}sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}${NC}"
else
    echo -e "${RED}❌ Proxy ainda não funciona${NC}"
    echo ""
    echo -e "${YELLOW}Logs do Nginx:${NC}"
    sudo tail -20 /var/log/nginx/meumu.com-error.log
fi

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}Comandos úteis:${NC}"
echo -e "  ${YELLOW}sudo systemctl status nginx${NC}      - Status do Nginx"
echo -e "  ${YELLOW}sudo systemctl restart nginx${NC}     - Reiniciar Nginx"
echo -e "  ${YELLOW}sudo nginx -t${NC}                    - Testar config"
echo -e "  ${YELLOW}sudo tail -f /var/log/nginx/meumu.com-error.log${NC}  - Ver logs"
echo ""

echo -e "${CYAN}Arquivos:${NC}"
echo -e "  ${YELLOW}/etc/nginx/sites-available/${DOMAIN}${NC}"
echo -e "  ${YELLOW}/var/log/nginx/meumu.com-access.log${NC}"
echo ""
