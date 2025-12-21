#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Fix OpenLiteSpeed Proxy
# Configuração DIRETA do vhost.conf com sintaxe correta
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
echo "  MeuMU Online - Fix OpenLiteSpeed Proxy (v2)"
echo "════════════════════════════════════════════════════════════"
echo -e "${NC}"
echo ""

DOMAIN="meumu.com"
VHOST_CONF="/usr/local/lsws/conf/vhosts/${DOMAIN}/vhost.conf"
PUBLIC_HTML="/home/${DOMAIN}/public_html"

# Verificar se vhost.conf existe
if [ ! -f "$VHOST_CONF" ]; then
    echo -e "${RED}❌ vhost.conf não encontrado: ${VHOST_CONF}${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Arquivo encontrado: ${VHOST_CONF}${NC}"
echo ""

# Backup
BACKUP="${VHOST_CONF}.backup-$(date +%Y%m%d-%H%M%S)"
echo -e "${CYAN}Criando backup...${NC}"
sudo cp "$VHOST_CONF" "$BACKUP"
echo -e "${GREEN}✅ Backup: ${BACKUP}${NC}"
echo ""

# Criar novo vhost.conf do zero com sintaxe correta
echo -e "${CYAN}Criando novo vhost.conf...${NC}"

sudo tee "$VHOST_CONF" > /dev/null << 'VHOSTEOF'
docRoot                   /home/meumu.com/public_html/dist
enableGzip                1

errorlog /usr/local/lsws/logs/vhosts/meumu.com/error.log {
  useServer               0
  logLevel                ERROR
  rollingSize             10M
}

accesslog /usr/local/lsws/logs/vhosts/meumu.com/access.log {
  useServer               0
  logFormat               "%h %l %u %t \"%r\" %>s %b"
  logHeaders              7
  rollingSize             10M
  keepDays                10  
}

index  {
  useServer               0
  indexFiles              index.html, index.php
}

scripthandler  {
  add                     lsapi:meumu.com php
}

rewrite  {
  enable                  1
  autoLoadHtaccess        1
  rules                   <<<END_rules
# React Router - Redirecionar para index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^ /index.html [L]
  END_rules
}

context /api/ {
  type                    proxy
  handler                 http://127.0.0.1:3001
  addDefaultCharset       off
}
VHOSTEOF

echo -e "${GREEN}✅ vhost.conf reescrito!${NC}"
echo ""

# Substituir o domínio correto
sudo sed -i "s|/home/meumu.com/|${PUBLIC_HTML%/*}/|g" "$VHOST_CONF"

echo -e "${CYAN}Verificando sintaxe...${NC}"
echo ""
echo -e "${YELLOW}════════ vhost.conf ════════${NC}"
sudo cat "$VHOST_CONF"
echo -e "${YELLOW}════════════════════════════${NC}"
echo ""

# Testar sintaxe do OpenLiteSpeed
echo -e "${CYAN}Testando configuração do OpenLiteSpeed...${NC}"
sudo /usr/local/lsws/bin/lswsctrl configtest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Sintaxe OK!${NC}"
else
    echo -e "${RED}❌ Erro na sintaxe!${NC}"
    echo -e "${YELLOW}Restaurando backup...${NC}"
    sudo cp "$BACKUP" "$VHOST_CONF"
    exit 1
fi

echo ""

# Reiniciar OpenLiteSpeed
echo -e "${CYAN}Reiniciando OpenLiteSpeed...${NC}"
sudo systemctl restart lsws

sleep 3

if systemctl is-active --quiet lsws; then
    echo -e "${GREEN}✅ OpenLiteSpeed reiniciado!${NC}"
else
    echo -e "${RED}❌ OpenLiteSpeed falhou ao iniciar!${NC}"
    echo -e "${YELLOW}Restaurando backup...${NC}"
    sudo cp "$BACKUP" "$VHOST_CONF"
    sudo systemctl restart lsws
    exit 1
fi

echo ""

# Aguardar e testar
echo -e "${CYAN}Aguardando 5 segundos...${NC}"
sleep 5

echo ""
echo -e "${CYAN}Testando proxy...${NC}"
echo ""

# Teste 1
echo -e "${YELLOW}Teste 1: Backend direto (localhost:3001)${NC}"
BACKEND_TEST=$(curl -s http://localhost:3001/api/server/health 2>/dev/null)
echo "$BACKEND_TEST" | head -c 200
echo ""
echo ""

# Teste 2
echo -e "${YELLOW}Teste 2: Proxy via domínio (meumu.com)${NC}"
PROXY_TEST=$(curl -s http://meumu.com/api/server/health 2>/dev/null)
echo "$PROXY_TEST" | head -c 500
echo ""
echo ""

# Resultado
if echo "$PROXY_TEST" | grep -q "healthy"; then
    echo -e "${GREEN}${BOLD}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                                                            ║"
    echo "║          ✅✅✅ PROXY FUNCIONANDO! ✅✅✅                  ║"
    echo "║                                                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${CYAN}Acesse agora:${NC} ${BOLD}http://meumu.com${NC}"
    echo -e "${CYAN}Limpe cache:${NC} ${BOLD}Ctrl+Shift+R${NC}"
    echo ""
    
elif echo "$PROXY_TEST" | grep -q "<!DOCTYPE"; then
    echo -e "${RED}${BOLD}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                                                            ║"
    echo "║          ❌ PROXY AINDA NÃO FUNCIONA ❌                    ║"
    echo "║                                                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${YELLOW}O OpenLiteSpeed ainda está retornando 404 HTML${NC}"
    echo ""
    echo -e "${CYAN}Próximos passos:${NC}"
    echo ""
    echo -e "1️⃣ ${BOLD}Configure via CyberPanel GUI:${NC}"
    echo "   cat /root/CONFIGURAR_CYBERPANEL_GUI.md"
    echo ""
    echo -e "2️⃣ ${BOLD}Ou verifique logs:${NC}"
    echo "   tail -f /usr/local/lsws/logs/vhosts/meumu.com/error.log"
    echo ""
    echo -e "3️⃣ ${BOLD}Ou tente Nginx:${NC}"
    echo "   Nginx tem melhor suporte a proxy que OpenLiteSpeed"
    echo ""
    
else
    echo -e "${YELLOW}⚠️  Sem resposta do domínio${NC}"
    echo -e "${CYAN}Verifique DNS/Firewall${NC}"
fi

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

# Informações úteis
echo -e "${CYAN}Arquivos importantes:${NC}"
echo -e "  Config: ${YELLOW}${VHOST_CONF}${NC}"
echo -e "  Backup: ${YELLOW}${BACKUP}${NC}"
echo -e "  Logs:   ${YELLOW}/usr/local/lsws/logs/vhosts/meumu.com/error.log${NC}"
echo ""

echo -e "${CYAN}Comandos úteis:${NC}"
echo -e "  ${YELLOW}sudo systemctl restart lsws${NC}          - Reiniciar OpenLiteSpeed"
echo -e "  ${YELLOW}pm2 logs meumu-backend${NC}               - Ver logs do backend"
echo -e "  ${YELLOW}curl http://meumu.com/api/server/health${NC} - Testar proxy"
echo ""
