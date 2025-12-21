#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Resolver TUDO
# Script definitivo que resolve todos os problemas automaticamente
# 
# @version 3.0.0
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
║         🚀 MeuMU Online - RESOLVER TUDO v3.0.0 🚀           ║
║                Season 19-2-3 Épico                           ║
║                                                              ║
║  Este script vai:                                            ║
║  ✅ Detectar/Criar backend automaticamente                   ║
║  ✅ Buildar React (se necessário)                            ║
║  ✅ Instalar dependências do backend                         ║
║  ✅ Iniciar backend Node.js (PM2)                            ║
║  ✅ Configurar proxy reverso                                 ║
║  ✅ Testar tudo                                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# DETECTAR LOCALIZAÇÃO
# ═══════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo -e "${CYAN}📍 Localização: ${SCRIPT_DIR}${NC}"
echo ""

# Verificar se temos backend no projeto
if [ -d "${SCRIPT_DIR}/backend-nodejs" ]; then
    BACKEND_SOURCE="${SCRIPT_DIR}/backend-nodejs"
    echo -e "${GREEN}✅ Backend encontrado no projeto: ${BACKEND_SOURCE}${NC}"
    HAS_BACKEND_SOURCE=true
else
    echo -e "${YELLOW}⚠️  Backend não encontrado no diretório atual${NC}"
    HAS_BACKEND_SOURCE=false
fi

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

# Detectar caminho do public_html
PUBLIC_HTML="${SCRIPT_DIR}"

# Se estamos em /root, detectar caminho correto
if [[ "$SCRIPT_DIR" == "/root"* ]] || [[ "$SCRIPT_DIR" == "$HOME"* ]]; then
    POSSIBLE_PATH="/home/${DOMAIN}/public_html"
    if [ -d "$POSSIBLE_PATH" ]; then
        echo -e "${YELLOW}Detectado diretório CyberPanel: ${POSSIBLE_PATH}${NC}"
        read -p "Usar este diretório? (S/n): " USE_PATH
        
        if [[ ! "$USE_PATH" =~ ^[Nn]$ ]]; then
            PUBLIC_HTML="$POSSIBLE_PATH"
        fi
    fi
fi

echo -e "${CYAN}Diretório de trabalho: ${PUBLIC_HTML}${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 0: VERIFICAR/CRIAR BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 0: Verificar Backend Node.js                         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

BACKEND_DIR="${PUBLIC_HTML}/backend-nodejs"

if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Pasta backend-nodejs não encontrada em: ${BACKEND_DIR}${NC}"
    echo ""
    
    if [ "$HAS_BACKEND_SOURCE" = true ]; then
        echo -e "${GREEN}✅ Backend encontrado no projeto fonte!${NC}"
        echo -e "${CYAN}Vou copiar de:${NC} ${BACKEND_SOURCE}"
        echo -e "${CYAN}Para:${NC} ${BACKEND_DIR}"
        echo ""
        read -p "Continuar? (S/n): " COPY_BACKEND
        
        if [[ ! "$COPY_BACKEND" =~ ^[Nn]$ ]]; then
            echo ""
            echo -e "${CYAN}Copiando backend...${NC}"
            
            # Criar diretório se não existir
            mkdir -p "${PUBLIC_HTML}"
            
            # Copiar tudo exceto node_modules e .env
            rsync -av \
                --exclude='node_modules' \
                --exclude='.env' \
                --exclude='*.log' \
                "${BACKEND_SOURCE}/" \
                "${BACKEND_DIR}/" \
                || { echo -e "${RED}❌ Erro ao copiar!${NC}"; exit 1; }
            
            echo -e "${GREEN}✅ Backend copiado com sucesso!${NC}"
        else
            echo -e "${RED}❌ Não é possível continuar sem backend${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Backend não disponível!${NC}"
        echo ""
        echo -e "${YELLOW}Opções:${NC}"
        echo -e "  1. Execute este script do diretório do projeto (onde tem backend-nodejs/)"
        echo -e "  2. Ou execute o instalador: ${CYAN}http://${DOMAIN}/install${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Backend já existe: ${BACKEND_DIR}${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 1: BUILDAR FRONTEND (se necessário)
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 1: Verificar/Buildar Frontend                        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✅ Frontend já buildado${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend não buildado. Buildando...${NC}"
    
    echo -e "${CYAN}Instalando dependências...${NC}"
    npm install || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
    
    echo ""
    echo -e "${CYAN}Buildando React...${NC}"
    npm run build || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
    
    echo -e "${GREEN}✅ Build concluído!${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 2: INSTALAR DEPENDÊNCIAS DO BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 2: Instalar Dependências do Backend                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

cd backend-nodejs

if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo -e "${YELLOW}Execute o instalador primeiro: http://${DOMAIN}/install${NC}"
    exit 1
fi

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
else
    echo -e "${CYAN}Instalando dependências...${NC}"
    npm install || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
    echo -e "${GREEN}✅ Dependências instaladas!${NC}"
fi

cd ..

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 3: INICIAR BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 3: Iniciar Backend Node.js                           ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se já está rodando
if netstat -tuln 2>/dev/null | grep -q ':3001 '; then
    echo -e "${YELLOW}⚠️  Backend já está rodando na porta 3001${NC}"
    
    if command -v pm2 &> /dev/null; then
        echo -e "${CYAN}Reiniciando...${NC}"
        pm2 restart meumu-backend 2>/dev/null
    fi
    
    echo -e "${GREEN}✅ Backend rodando${NC}"
else
    # Instalar PM2 se não existir
    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}Instalando PM2...${NC}"
        sudo npm install -g pm2 || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
    fi
    
    echo -e "${CYAN}Iniciando backend com PM2...${NC}"
    cd backend-nodejs
    pm2 delete meumu-backend 2>/dev/null
    pm2 start src/server.js --name meumu-backend || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
    pm2 save
    cd ..
    
    echo -e "${GREEN}✅ Backend iniciado!${NC}"
fi

echo ""
echo -e "${CYAN}Aguardando backend inicializar...${NC}"
sleep 3

# Testar backend
HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)

if echo "$HEALTH" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Backend respondendo: OK${NC}"
else
    echo -e "${RED}❌ Backend não está respondendo!${NC}"
    echo -e "${YELLOW}Logs do PM2:${NC}"
    pm2 logs meumu-backend --lines 20 --nostream
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 4: DETECTAR SERVIDOR WEB
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 4: Detectar e Configurar Servidor Web                ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

WEBSERVER=""

if systemctl is-active --quiet lsws 2>/dev/null; then
    WEBSERVER="openlitespeed"
    echo -e "${GREEN}✅ OpenLiteSpeed detectado (CyberPanel)${NC}"
elif systemctl is-active --quiet apache2 2>/dev/null; then
    WEBSERVER="apache"
    echo -e "${GREEN}✅ Apache detectado${NC}"
elif systemctl is-active --quiet httpd 2>/dev/null; then
    WEBSERVER="apache"
    echo -e "${GREEN}✅ Apache (httpd) detectado${NC}"
else
    echo -e "${YELLOW}⚠️  Nenhum servidor web detectado automaticamente${NC}"
    echo ""
    echo "Qual servidor web você usa?"
    echo "  1) OpenLiteSpeed (CyberPanel)"
    echo "  2) Apache"
    echo "  3) Nginx"
    echo "  4) Outro/Pular"
    read -p "Escolha (1-4): " WEB_CHOICE
    
    case $WEB_CHOICE in
        1) WEBSERVER="openlitespeed" ;;
        2) WEBSERVER="apache" ;;
        3) WEBSERVER="nginx" ;;
        *) WEBSERVER="unknown" ;;
    esac
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 5: CONFIGURAR PROXY
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 5: Configurar Proxy Reverso                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

case $WEBSERVER in
    openlitespeed)
        echo -e "${CYAN}Configurando OpenLiteSpeed...${NC}"
        
        VHOST_PATH="/usr/local/lsws/conf/vhosts/${DOMAIN}"
        VHOST_CONF="${VHOST_PATH}/vhost.conf"
        
        if [ -f "$VHOST_CONF" ]; then
            # Backup
            sudo cp "$VHOST_CONF" "${VHOST_CONF}.backup.$(date +%s)"
            
            # Atualizar Document Root
            sudo sed -i "s|docRoot.*|docRoot                   ${PUBLIC_HTML}/dist|g" "$VHOST_CONF"
            
            # Adicionar proxy se não existir
            if ! grep -q '<type>proxy</type>' "$VHOST_CONF"; then
                # Criar config temporária
                cat > /tmp/proxy_config.xml << 'PROXYEOF'

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
PROXYEOF
                
                # Inserir antes de </virtualHost>
                sudo sed -i "/<\/virtualHost>/i $(cat /tmp/proxy_config.xml)" "$VHOST_CONF"
                rm /tmp/proxy_config.xml
            fi
            
            echo -e "${GREEN}✅ Proxy configurado!${NC}"
            
            # Reiniciar OpenLiteSpeed
            echo ""
            echo -e "${CYAN}Reiniciando OpenLiteSpeed...${NC}"
            sudo systemctl restart lsws
            echo -e "${GREEN}✅ OpenLiteSpeed reiniciado!${NC}"
        else
            echo -e "${RED}❌ Arquivo vhost.conf não encontrado!${NC}"
            echo -e "${YELLOW}Configure manualmente no CyberPanel${NC}"
        fi
        ;;
        
    apache)
        echo -e "${CYAN}Configurando Apache...${NC}"
        echo -e "${YELLOW}Configuração manual necessária${NC}"
        echo ""
        echo -e "${CYAN}Adicione isso ao seu VirtualHost:${NC}"
        cat << 'APACHECONF'

    # Proxy para API
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api

    # React Router
    <Directory /path/to/dist>
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_URI} !^/api/
        RewriteRule ^ /index.html [L]
    </Directory>
APACHECONF
        echo ""
        echo -e "${YELLOW}Depois: sudo systemctl restart apache2${NC}"
        ;;
        
    *)
        echo -e "${YELLOW}Configure o proxy manualmente${NC}"
        echo ""
        echo -e "${CYAN}Você precisa fazer:${NC}"
        echo "  1. Servir arquivos de: ${PUBLIC_HTML}/dist"
        echo "  2. Fazer proxy de /api/ para http://127.0.0.1:3001"
        ;;
esac

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 6: CRIAR .htaccess
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 6: Criar .htaccess                                   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

HTACCESS="${PUBLIC_HTML}/dist/.htaccess"

if [ -f "$HTACCESS" ]; then
    cp "$HTACCESS" "${HTACCESS}.backup.$(date +%s)"
fi

cat > "$HTACCESS" << 'HTACCESSEOF'
# MeuMU Online - Rewrite Rules

RewriteEngine On
RewriteBase /

# Proxy para Backend
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://127.0.0.1:3001/api/$1 [P,L]

# React Router
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
HTACCESSEOF

echo -e "${GREEN}✅ .htaccess criado!${NC}"

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 7: TESTAR TUDO
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 7: Testar Instalação                                 ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}Aguardando 5 segundos...${NC}"
sleep 5

# Teste 1: Backend direto
echo -e "${CYAN}Teste 1: Backend direto (localhost:3001)${NC}"
BACKEND_TEST=$(curl -s http://localhost:3001/api/server/info 2>/dev/null)

if echo "$BACKEND_TEST" | grep -q "success"; then
    echo -e "${GREEN}✅ Backend respondendo corretamente${NC}"
else
    echo -e "${RED}❌ Backend não está respondendo API corretamente${NC}"
fi

echo ""

# Teste 2: Proxy via domínio
echo -e "${CYAN}Teste 2: Proxy via domínio (${DOMAIN})${NC}"
PROXY_TEST=$(curl -s http://${DOMAIN}/api/health 2>/dev/null)

if echo "$PROXY_TEST" | grep -q "healthy"; then
    echo -e "${GREEN}✅ PROXY FUNCIONANDO! API acessível via domínio${NC}"
elif echo "$PROXY_TEST" | grep -q "<!DOCTYPE"; then
    echo -e "${RED}❌ PROXY NÃO CONFIGURADO!${NC}"
    echo -e "${YELLOW}O servidor está retornando HTML em vez de fazer proxy${NC}"
    echo ""
    echo -e "${CYAN}Configure manualmente:${NC}"
    if [ "$WEBSERVER" = "openlitespeed" ]; then
        echo "  1. Acesse CyberPanel → Websites → ${DOMAIN}"
        echo "  2. Click em 'Rewrite Rules'"
        echo "  3. Adicione as regras de proxy"
        echo "  4. Ou edite: ${VHOST_CONF}"
    fi
else
    echo -e "${YELLOW}⚠️  Sem resposta do domínio${NC}"
fi

echo ""

# Teste 3: Frontend
echo -e "${CYAN}Teste 3: Frontend${NC}"
if curl -s http://${DOMAIN} | grep -q "<!DOCTYPE"; then
    echo -e "${GREEN}✅ Frontend respondendo${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend pode não estar acessível${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# RESULTADO FINAL
# ═══════════════════════════════════════════════════════════════

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  ✅ PROCESSO COMPLETO! ✅                    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${PURPLE}🎮 MeuMU Online configurado! 🎮${NC}"
echo ""
echo -e "${CYAN}Próximos passos:${NC}"
echo ""
echo -e "  1. ${YELLOW}Limpe o cache do navegador:${NC} Ctrl+Shift+R"
echo -e "  2. ${YELLOW}Acesse:${NC} ${CYAN}http://${DOMAIN}${NC}"
echo -e "  3. ${YELLOW}Verifique console (F12):${NC} Não deve ter erros 404"
echo ""
echo -e "${CYAN}Comandos úteis:${NC}"
echo -e "  • ${YELLOW}pm2 status${NC} - Ver status do backend"
echo -e "  • ${YELLOW}pm2 logs meumu-backend${NC} - Ver logs"
echo -e "  • ${YELLOW}pm2 restart meumu-backend${NC} - Reiniciar backend"
echo ""

if echo "$PROXY_TEST" | grep -q "<!DOCTYPE"; then
    echo -e "${RED}⚠️  ATENÇÃO: Proxy não está funcionando!${NC}"
    echo -e "${YELLOW}Execute: ./configurar-cyberpanel.sh${NC}"
    echo ""
fi

echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}       MeuMU Online v3.0.0 - Setup Completo${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo ""