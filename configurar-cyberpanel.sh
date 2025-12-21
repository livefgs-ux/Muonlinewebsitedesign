#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Configurar CyberPanel/OpenLiteSpeed
# 
# @version 1.0.0
# @author MeuMU Team
#═══════════════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${PURPLE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🎮 MeuMU Online - CyberPanel Setup 🎮                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""

# Pedir domínio
echo -e "${CYAN}Digite o nome do domínio (ex: meumu.com):${NC}"
read -p "> " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Domínio não pode estar vazio!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Domínio: ${DOMAIN}${NC}"
echo ""

# Detectar caminho
VHOST_PATH="/usr/local/lsws/conf/vhosts/${DOMAIN}"
PUBLIC_HTML="/home/${DOMAIN}/public_html"

# Verificar se existe
if [ ! -d "$VHOST_PATH" ]; then
    echo -e "${RED}❌ VHost não encontrado: ${VHOST_PATH}${NC}"
    echo -e "${YELLOW}Verifique se o domínio está correto no CyberPanel${NC}"
    exit 1
fi

echo -e "${GREEN}✅ VHost encontrado: ${VHOST_PATH}${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 1: INICIAR BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 1: Iniciar Backend Node.js                           ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

cd "${PUBLIC_HTML}" || exit 1

if [ ! -d "backend-nodejs" ]; then
    echo -e "${RED}❌ Pasta backend-nodejs não encontrada!${NC}"
    exit 1
fi

cd backend-nodejs

# Instalar dependências
if [ ! -d "node_modules" ]; then
    echo -e "${CYAN}Instalando dependências...${NC}"
    npm install || exit 1
fi

# Verificar se já está rodando
if netstat -tuln 2>/dev/null | grep -q ':3001 '; then
    echo -e "${YELLOW}⚠️  Backend já está rodando na porta 3001${NC}"
    read -p "Reiniciar? (s/N): " RESTART
    
    if [[ "$RESTART" =~ ^[Ss]$ ]]; then
        pm2 restart meumu-backend 2>/dev/null || pm2 delete meumu-backend 2>/dev/null
    fi
else
    # Iniciar
    if command -v pm2 &> /dev/null; then
        pm2 delete meumu-backend 2>/dev/null
        pm2 start src/server.js --name meumu-backend
        pm2 save
        echo -e "${GREEN}✅ Backend iniciado com PM2!${NC}"
    else
        echo -e "${YELLOW}PM2 não encontrado. Instalando...${NC}"
        sudo npm install -g pm2
        pm2 start src/server.js --name meumu-backend
        pm2 save
        echo -e "${GREEN}✅ Backend iniciado com PM2!${NC}"
    fi
fi

cd "${PUBLIC_HTML}"

echo ""

# Testar backend
echo -e "${CYAN}Testando backend...${NC}"
sleep 2

HEALTH=$(curl -s http://localhost:3001/api/health 2>/dev/null)

if echo "$HEALTH" | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend respondendo: ${HEALTH}${NC}"
else
    echo -e "${RED}❌ Backend não está respondendo!${NC}"
    echo -e "${YELLOW}Verifique os logs: pm2 logs meumu-backend${NC}"
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 2: CONFIGURAR DOCUMENT ROOT
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 2: Configurar Document Root                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

VHOST_CONF="${VHOST_PATH}/vhost.conf"

if [ ! -f "$VHOST_CONF" ]; then
    echo -e "${RED}❌ Arquivo vhost.conf não encontrado!${NC}"
    exit 1
fi

# Fazer backup
sudo cp "$VHOST_CONF" "${VHOST_CONF}.backup.$(date +%s)"
echo -e "${GREEN}✅ Backup criado${NC}"

# Verificar se já tem /dist no docRoot
if grep -q "docRoot.*${PUBLIC_HTML}/dist" "$VHOST_CONF"; then
    echo -e "${GREEN}✅ Document Root já configurado para /dist${NC}"
else
    echo -e "${YELLOW}Atualizando Document Root...${NC}"
    sudo sed -i "s|docRoot.*${PUBLIC_HTML}|docRoot                   ${PUBLIC_HTML}/dist|g" "$VHOST_CONF"
    echo -e "${GREEN}✅ Document Root atualizado!${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 3: CONFIGURAR PROXY
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 3: Configurar Proxy Reverso                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se já tem proxy configurado
if grep -q '<type>proxy</type>' "$VHOST_CONF"; then
    echo -e "${YELLOW}⚠️  Proxy já configurado${NC}"
    read -p "Reconfigurar? (s/N): " RECONFIG
    
    if [[ ! "$RECONFIG" =~ ^[Ss]$ ]]; then
        echo -e "${GREEN}✅ Mantendo configuração existente${NC}"
    else
        # Remover proxy antigo
        sudo sed -i '/<context>/,/<\/context>/d' "$VHOST_CONF"
    fi
fi

# Adicionar proxy se não existir
if ! grep -q '<type>proxy</type>' "$VHOST_CONF"; then
    echo -e "${CYAN}Adicionando configuração de proxy...${NC}"
    
    # Criar arquivo temporário com a configuração
    cat > /tmp/proxy_config.xml << 'EOF'

  <context>
    <type>proxy</type>
    <uri>/api/</uri>
    <handler>http://127.0.0.1:3001</handler>
    <addDefaultCharset>off</addDefaultCharset>
  </context>

  <context>
    <location>/</location>
    <allowBrowse>1</allowBrowse>
    <rewrite>
      <enable>1</enable>
      <base>/</base>
      <rules>
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^ /index.html [L]
      </rules>
    </rewrite>
  </context>
EOF

    # Inserir antes de </virtualHost>
    sudo sed -i "/<\/virtualHost>/i $(cat /tmp/proxy_config.xml)" "$VHOST_CONF"
    
    rm /tmp/proxy_config.xml
    
    echo -e "${GREEN}✅ Proxy configurado!${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 4: CRIAR .htaccess
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 4: Criar .htaccess                                   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

HTACCESS="${PUBLIC_HTML}/dist/.htaccess"

if [ -f "$HTACCESS" ]; then
    echo -e "${YELLOW}Criando backup de .htaccess...${NC}"
    cp "$HTACCESS" "${HTACCESS}.backup.$(date +%s)"
fi

cat > "$HTACCESS" << 'EOF'
# MeuMU Online - OpenLiteSpeed Configuration

RewriteEngine On
RewriteBase /

# Proxy para Backend Node.js
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://127.0.0.1:3001/api/$1 [P,L]

# React Router - Redirecionar para index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^ /index.html [L]

# Segurança
Options -Indexes

# MIME Types
AddType application/javascript .js .mjs
AddType text/css .css
AddType application/json .json

# Cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
EOF

echo -e "${GREEN}✅ .htaccess criado!${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 5: REINICIAR OPENLITESPEED
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 5: Reiniciar OpenLiteSpeed                           ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}Reiniciando OpenLiteSpeed...${NC}"
sudo systemctl restart lsws

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ OpenLiteSpeed reiniciado!${NC}"
else
    echo -e "${RED}❌ Erro ao reiniciar OpenLiteSpeed!${NC}"
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 6: TESTAR
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 6: Testar Configuração                               ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}Aguardando 3 segundos...${NC}"
sleep 3

# Testar proxy
echo -e "${CYAN}Testando proxy reverso...${NC}"
PROXY_TEST=$(curl -s http://${DOMAIN}/api/health 2>/dev/null)

if echo "$PROXY_TEST" | grep -q "ok"; then
    echo -e "${GREEN}✅ Proxy funcionando: ${PROXY_TEST}${NC}"
else
    echo -e "${RED}❌ Proxy NÃO está funcionando!${NC}"
    echo -e "${YELLOW}Resposta: ${PROXY_TEST}${NC}"
    echo ""
    echo -e "${CYAN}Possíveis causas:${NC}"
    echo "  1. OpenLiteSpeed não reiniciou corretamente"
    echo "  2. Configuração de proxy incorreta"
    echo "  3. Firewall bloqueando porta 3001"
    echo ""
    echo -e "${YELLOW}Tente:${NC}"
    echo "  sudo systemctl restart lsws"
    echo "  pm2 restart meumu-backend"
fi

echo ""

# Testar frontend
echo -e "${CYAN}Testando frontend...${NC}"
if curl -s http://${DOMAIN} | grep -q "<!DOCTYPE"; then
    echo -e "${GREEN}✅ Frontend respondendo!${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend pode não estar respondendo corretamente${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# RESULTADO FINAL
# ═══════════════════════════════════════════════════════════════

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  ✅ CONFIGURAÇÃO COMPLETA! ✅                ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${PURPLE}🎮 MeuMU Online configurado! 🎮${NC}"
echo ""
echo -e "${CYAN}Próximos passos:${NC}"
echo ""
echo -e "  1. ${YELLOW}Limpe o cache do navegador:${NC} Ctrl+Shift+R"
echo -e "  2. ${YELLOW}Acesse:${NC} ${CYAN}http://${DOMAIN}${NC}"
echo -e "  3. ${YELLOW}Verifique console (F12):${NC} Não deve ter erros 404 em /api/*"
echo ""
echo -e "${CYAN}Comandos úteis:${NC}"
echo -e "  • ${YELLOW}pm2 logs meumu-backend${NC} - Ver logs do backend"
echo -e "  • ${YELLOW}sudo systemctl restart lsws${NC} - Reiniciar OpenLiteSpeed"
echo -e "  • ${YELLOW}curl http://localhost:3001/api/health${NC} - Testar backend direto"
echo -e "  • ${YELLOW}curl http://${DOMAIN}/api/health${NC} - Testar proxy"
echo ""
echo -e "${CYAN}Arquivos de configuração:${NC}"
echo -e "  • ${YELLOW}${VHOST_CONF}${NC}"
echo -e "  • ${YELLOW}${HTACCESS}${NC}"
echo ""
echo -e "${RED}⚠️  IMPORTANTE:${NC}"
echo -e "  • Delete a pasta /install: ${YELLOW}rm -rf ${PUBLIC_HTML}/install${NC}"
echo -e "  • Configure SSL no CyberPanel para usar HTTPS"
echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}       MeuMU Online v3.0.0 - CyberPanel Setup${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
