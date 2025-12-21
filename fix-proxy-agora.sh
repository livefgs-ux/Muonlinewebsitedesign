#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Configurar Proxy AGORA
# Solução direta para CyberPanel/OpenLiteSpeed
#═══════════════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}    MeuMU Online - Configurar Proxy AGORA${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo ""

DOMAIN="meumu.com"
VHOST_PATH="/usr/local/lsws/conf/vhosts/${DOMAIN}"
VHOST_CONF="${VHOST_PATH}/vhost.conf"
PUBLIC_HTML="/home/${DOMAIN}/public_html"

echo -e "${GREEN}Domínio: ${DOMAIN}${NC}"
echo -e "${GREEN}VHost: ${VHOST_PATH}${NC}"
echo ""

# Verificar backend
echo -e "${CYAN}1. Verificando backend...${NC}"
BACKEND_TEST=$(curl -s http://localhost:3001/api/server/health 2>/dev/null)

if echo "$BACKEND_TEST" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Backend funcionando!${NC}"
else
    echo -e "${RED}❌ Backend não está funcionando!${NC}"
    exit 1
fi

echo ""

# Fazer backup
echo -e "${CYAN}2. Fazendo backup do vhost.conf...${NC}"
if [ -f "$VHOST_CONF" ]; then
    sudo cp "$VHOST_CONF" "${VHOST_CONF}.backup-$(date +%Y%m%d-%H%M%S)"
    echo -e "${GREEN}✅ Backup criado${NC}"
else
    echo -e "${RED}❌ vhost.conf não encontrado: ${VHOST_CONF}${NC}"
    exit 1
fi

echo ""

# Método 1: Adicionar External App no OpenLiteSpeed
echo -e "${CYAN}3. Configurando External App...${NC}"

# Criar configuração de External App
EXTAPP_CONFIG="
  extprocessor backend-api {
    type                    proxy
    address                 127.0.0.1:3001
    maxConns                100
    pcKeepAliveTimeout      60
    initTimeout             60
    retryTimeout            0
    respBuffer              0
  }
"

# Verificar se já existe
if grep -q "extprocessor backend-api" "$VHOST_CONF"; then
    echo -e "${YELLOW}⚠️  External App já existe${NC}"
else
    echo -e "${CYAN}Adicionando External App...${NC}"
    # Adicionar antes de </virtualHost>
    sudo sed -i "/<\/virtualHost>/i\\
\\
  extprocessor backend-api {\\
    type                    proxy\\
    address                 127.0.0.1:3001\\
    maxConns                100\\
    pcKeepAliveTimeout      60\\
    initTimeout             60\\
    retryTimeout            0\\
    respBuffer              0\\
  }\\
" "$VHOST_CONF"
    
    echo -e "${GREEN}✅ External App adicionado${NC}"
fi

echo ""

# Método 2: Adicionar Context de Proxy
echo -e "${CYAN}4. Configurando Context de Proxy...${NC}"

# Remover contextos antigos se existirem
if grep -q "<context>" "$VHOST_CONF"; then
    echo -e "${YELLOW}Removendo contextos antigos...${NC}"
    sudo sed -i '/<context>/,/<\/context>/d' "$VHOST_CONF"
fi

# Adicionar novo contexto de proxy
sudo sed -i "/<\/virtualHost>/i\\
\\
  context /api/ {\\
    type                    proxy\\
    handler                 backend-api\\
    addDefaultCharset       off\\
  }\\
\\
  context / {\\
    location                ${PUBLIC_HTML}/dist\\
    allowBrowse             1\\
    rewrite  {\\
      enable                1\\
RewriteCond %{REQUEST_FILENAME} !-f\\
RewriteCond %{REQUEST_FILENAME} !-d\\
RewriteCond %{REQUEST_URI} !^/api/\\
RewriteRule ^ /index.html [L]\\
    }\\
  }\\
" "$VHOST_CONF"

echo -e "${GREEN}✅ Context configurado${NC}"

echo ""

# Atualizar Document Root
echo -e "${CYAN}5. Atualizando Document Root...${NC}"
sudo sed -i "s|docRoot.*${PUBLIC_HTML}.*|docRoot                   ${PUBLIC_HTML}/dist|g" "$VHOST_CONF"
echo -e "${GREEN}✅ Document Root → ${PUBLIC_HTML}/dist${NC}"

echo ""

# Reiniciar OpenLiteSpeed
echo -e "${CYAN}6. Reiniciando OpenLiteSpeed...${NC}"
sudo systemctl restart lsws

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ OpenLiteSpeed reiniciado!${NC}"
else
    echo -e "${RED}❌ Erro ao reiniciar!${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}Aguardando 5 segundos...${NC}"
sleep 5

# Testar
echo ""
echo -e "${CYAN}7. Testando proxy...${NC}"
echo ""

echo -e "${YELLOW}Teste 1: Backend direto${NC}"
curl -s http://localhost:3001/api/server/health | head -c 200
echo ""
echo ""

echo -e "${YELLOW}Teste 2: Proxy via domínio${NC}"
PROXY_RESULT=$(curl -s http://${DOMAIN}/api/server/health 2>/dev/null)
echo "$PROXY_RESULT" | head -c 500
echo ""
echo ""

if echo "$PROXY_RESULT" | grep -q "healthy"; then
    echo -e "${GREEN}✅✅✅ PROXY FUNCIONANDO! ✅✅✅${NC}"
    echo ""
    echo -e "${GREEN}Acesse: http://${DOMAIN}${NC}"
    echo -e "${CYAN}Limpe cache: Ctrl+Shift+R${NC}"
elif echo "$PROXY_RESULT" | grep -q "<!DOCTYPE"; then
    echo -e "${RED}❌ PROXY NÃO FUNCIONOU!${NC}"
    echo -e "${YELLOW}Ainda retornando HTML 404${NC}"
    echo ""
    echo -e "${CYAN}SOLUÇÃO ALTERNATIVA:${NC}"
    echo ""
    echo -e "Entre no CyberPanel:"
    echo -e "  1. Acesse: https://$(hostname -I | awk '{print $1}'):8090"
    echo -e "  2. Websites → List Websites → ${DOMAIN}"
    echo -e "  3. Click em 'Rewrite Rules'"
    echo -e "  4. Adicione estas regras:"
    echo ""
    echo -e "${YELLOW}RewriteEngine On"
    echo -e "RewriteCond %{REQUEST_URI} ^/api/"
    echo -e "RewriteRule ^api/(.*)$ http://127.0.0.1:3001/api/\$1 [P,L]${NC}"
    echo ""
    echo -e "  5. Salve e reinicie: systemctl restart lsws"
else
    echo -e "${YELLOW}⚠️  Sem resposta${NC}"
fi

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo ""

# Mostrar configuração
echo -e "${YELLOW}Arquivo de configuração:${NC}"
echo -e "${CYAN}cat ${VHOST_CONF}${NC}"
echo ""
