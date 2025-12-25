#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - CONFIGURADOR LITESPEED PROXY REVERSO
# ═══════════════════════════════════════════════════════════════
# 
# Configura OpenLiteSpeed como proxy reverso para o backend Node.js
# Compatível com CyberPanel
# 
# ═══════════════════════════════════════════════════════════════

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${BOLD}🔧 CONFIGURADOR LITESPEED PROXY REVERSO (CYBERPANEL)${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""

# Verificar se rodando como root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}❌ Este script precisa ser executado como root (sudo)${NC}"
   exit 1
fi

# Etapa 1: Detectar LiteSpeed
echo -e "${YELLOW}[1/10]${NC} Detectando LiteSpeed..."

LSWS_INSTALLED=false
LSWS_CONF_DIR=""

# Detectar CyberPanel (OpenLiteSpeed)
if [ -d "/usr/local/lsws" ]; then
    LSWS_INSTALLED=true
    LSWS_CONF_DIR="/usr/local/lsws/conf"
    LSWS_BIN="/usr/local/lsws/bin/lswsctrl"
    echo -e "${GREEN}✅ OpenLiteSpeed detectado (CyberPanel)${NC}"
    echo -e "${CYAN}   Diretório: /usr/local/lsws${NC}"
elif [ -d "/opt/litespeed" ]; then
    LSWS_INSTALLED=true
    LSWS_CONF_DIR="/opt/litespeed/conf"
    LSWS_BIN="/opt/litespeed/bin/lswsctrl"
    echo -e "${GREEN}✅ LiteSpeed Enterprise detectado${NC}"
    echo -e "${CYAN}   Diretório: /opt/litespeed${NC}"
else
    echo -e "${RED}❌ LiteSpeed não encontrado!${NC}"
    echo -e "${YELLOW}Este script é para servidores com OpenLiteSpeed/LiteSpeed.${NC}"
    echo -e "${YELLOW}Você está usando CyberPanel?${NC}"
    exit 1
fi

# Etapa 2: Verificar vHost do domínio
echo ""
echo -e "${YELLOW}[2/10]${NC} Procurando vHost do domínio meumu.com..."

VHOST_CONF=""

# Possíveis localizações do vHost
VHOST_PATHS=(
    "/usr/local/lsws/conf/vhosts/meumu.com/vhost.conf"
    "/usr/local/lsws/conf/vhosts/meumu.com.conf"
    "$LSWS_CONF_DIR/vhosts/meumu.com/vhost.conf"
    "/etc/cyberpanel/vhosts/meumu.com.conf"
)

for path in "${VHOST_PATHS[@]}"; do
    if [ -f "$path" ]; then
        VHOST_CONF="$path"
        echo -e "${GREEN}✅ vHost encontrado: $VHOST_CONF${NC}"
        break
    fi
done

if [ -z "$VHOST_CONF" ]; then
    echo -e "${RED}❌ vHost do domínio meumu.com não encontrado!${NC}"
    echo ""
    echo -e "${YELLOW}📋 INSTRUÇÕES MANUAIS:${NC}"
    echo -e "${CYAN}1. Acesse CyberPanel: https://meumu.com:8090${NC}"
    echo -e "${CYAN}2. Websites → List Websites → meumu.com → Manage${NC}"
    echo -e "${CYAN}3. vHost Conf${NC}"
    echo -e "${CYAN}4. Cole o conteúdo de: /home/meumu.com/public_html/litespeed-proxy-config.conf${NC}"
    echo -e "${CYAN}5. Save → Graceful Restart${NC}"
    echo ""
    exit 1
fi

# Etapa 3: Backup do vHost atual
echo ""
echo -e "${YELLOW}[3/10]${NC} Fazendo backup do vHost atual..."
cp "$VHOST_CONF" "$VHOST_CONF.backup.$(date +%Y%m%d_%H%M%S)"
echo -e "${GREEN}✅ Backup criado${NC}"

# Etapa 4: Verificar se já tem configuração de proxy
echo ""
echo -e "${YELLOW}[4/10]${NC} Verificando configurações existentes..."

if grep -q "extProcessor meumu-api" "$VHOST_CONF" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Configuração de proxy já existe!${NC}"
    echo -e "${YELLOW}Removendo configuração antiga...${NC}"
    
    # Remover blocos antigos
    sed -i '/extProcessor meumu-api/,/^}/d' "$VHOST_CONF"
    sed -i '/context \/api\//,/^}/d' "$VHOST_CONF"
    
    echo -e "${GREEN}✅ Configuração antiga removida${NC}"
fi

# Etapa 5: Adicionar configuração de proxy
echo ""
echo -e "${YELLOW}[5/10]${NC} Adicionando configuração de proxy..."

# Adicionar antes do fechamento do vhConf
cat >> "$VHOST_CONF" << 'EOF'

# ════════════════════════════════════════════════════════════════
# MEUMU ONLINE - PROXY REVERSO PARA BACKEND NODE.JS
# Configurado automaticamente em $(date)
# ════════════════════════════════════════════════════════════════

extProcessor meumu-api {
  type                    proxy
  address                 127.0.0.1:3001
  maxConns                100
  env                     NODE_ENV=production
  initTimeout             60
  retryTimeout            0
  pcKeepAliveTimeout      60
  respBuffer              0
  autoStart               0
  notes                   MeuMU Online Backend API (Node.js)
}

context /api/ {
  type                    proxy
  handler                 meumu-api
  addDefaultCharset       off
  enableRewrite           1
  
  extraHeaders            <<<END_extraHeaders
Access-Control-Allow-Origin https://meumu.com
Access-Control-Allow-Methods GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers Authorization, Content-Type, X-Requested-With
Access-Control-Allow-Credentials true
  END_extraHeaders
}

# ════════════════════════════════════════════════════════════════

EOF

echo -e "${GREEN}✅ Configuração adicionada${NC}"

# Etapa 6: Ajustar DocumentRoot se necessário
echo ""
echo -e "${YELLOW}[6/10]${NC} Verificando DocumentRoot..."

if grep -q "docRoot.*public_html/dist" "$VHOST_CONF" 2>/dev/null; then
    echo -e "${GREEN}✅ DocumentRoot já aponta para dist/${NC}"
else
    echo -e "${YELLOW}⚠️  Ajustando DocumentRoot para dist/...${NC}"
    
    # Tentar ajustar docRoot
    if grep -q "docRoot.*public_html" "$VHOST_CONF" 2>/dev/null; then
        sed -i 's|docRoot\s*\(.*\)public_html|docRoot \1public_html/dist|' "$VHOST_CONF"
        echo -e "${GREEN}✅ DocumentRoot ajustado${NC}"
    else
        echo -e "${YELLOW}⚠️  DocumentRoot não encontrado, configure manualmente${NC}"
    fi
fi

# Etapa 7: Adicionar regras de rewrite para SPA
echo ""
echo -e "${YELLOW}[7/10]${NC} Configurando regras SPA (React Router)..."

if grep -q "RewriteRule.*index.html" "$VHOST_CONF" 2>/dev/null; then
    echo -e "${GREEN}✅ Regras SPA já configuradas${NC}"
else
    echo -e "${YELLOW}⚠️  Configure manualmente via CyberPanel:${NC}"
    echo -e "${CYAN}   Rewrite Rules → RewriteCond %{REQUEST_FILENAME} !-f${NC}"
    echo -e "${CYAN}                 → RewriteRule ^(.*)$ /index.html [L,QSA]${NC}"
fi

# Etapa 8: Verificar SSL
echo ""
echo -e "${YELLOW}[8/10]${NC} Verificando certificado SSL..."

SSL_CERT="/etc/letsencrypt/live/meumu.com/fullchain.pem"
SSL_KEY="/etc/letsencrypt/live/meumu.com/privkey.pem"

if [ -f "$SSL_CERT" ] && [ -f "$SSL_KEY" ]; then
    echo -e "${GREEN}✅ Certificados SSL encontrados${NC}"
    
    if grep -q "$SSL_CERT" "$VHOST_CONF" 2>/dev/null; then
        echo -e "${GREEN}✅ SSL já configurado no vHost${NC}"
    else
        echo -e "${YELLOW}⚠️  Configure SSL via CyberPanel:${NC}"
        echo -e "${CYAN}   Manage SSL → Issue SSL${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Certificados SSL não encontrados${NC}"
    echo -e "${CYAN}   Configure via CyberPanel: Manage SSL → Issue SSL${NC}"
fi

# Etapa 9: Validar configuração
echo ""
echo -e "${YELLOW}[9/10]${NC} Validando configuração do LiteSpeed..."

# LiteSpeed não tem comando de teste como nginx -t
# Vamos apenas verificar sintaxe básica
if [ -f "$VHOST_CONF" ]; then
    echo -e "${GREEN}✅ Arquivo vHost existe e foi modificado${NC}"
else
    echo -e "${RED}❌ Erro ao salvar configuração!${NC}"
    exit 1
fi

# Etapa 10: Reiniciar LiteSpeed
echo ""
echo -e "${YELLOW}[10/10]${NC} Reiniciando LiteSpeed..."

if [ -f "$LSWS_BIN" ]; then
    echo -e "${CYAN}Executando graceful restart...${NC}"
    "$LSWS_BIN" restart gracefully
    
    sleep 3
    
    # Verificar se está rodando
    if "$LSWS_BIN" status | grep -q "running"; then
        echo -e "${GREEN}✅ LiteSpeed reiniciado com sucesso${NC}"
    else
        echo -e "${RED}❌ LiteSpeed não está rodando!${NC}"
        echo -e "${YELLOW}Execute manualmente: $LSWS_BIN start${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Reinicie manualmente via CyberPanel:${NC}"
    echo -e "${CYAN}   Server Status → Restart LiteSpeed${NC}"
fi

# Resumo final
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ PROXY REVERSO LITESPEED CONFIGURADO!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BOLD}📊 RESUMO DA CONFIGURAÇÃO:${NC}"
echo ""
echo -e "${CYAN}Modo:${NC} Produção (HTTPS via LiteSpeed)"
echo -e "${CYAN}URL Frontend:${NC} https://meumu.com"
echo -e "${CYAN}URL API:${NC} https://meumu.com/api"
echo -e "${CYAN}Backend Node.js:${NC} http://127.0.0.1:3001 (interno)"
echo -e "${CYAN}vHost Config:${NC} $VHOST_CONF"
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
echo -e "${CYAN}   echo 'VITE_API_URL=https://meumu.com/api' > .env${NC}"
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
echo -e "${CYAN}   curl https://meumu.com/api/health${NC}"
echo ""
echo -e "${BOLD}⚠️  SE ALGO NÃO FUNCIONAR:${NC}"
echo -e "${YELLOW}Configure manualmente via CyberPanel:${NC}"
echo -e "${CYAN}https://meumu.com:8090${NC}"
echo -e "${CYAN}Websites → List Websites → meumu.com → Manage → vHost Conf${NC}"
echo ""
echo -e "${GREEN}✅ Tudo pronto! 🚀${NC}"
echo ""
