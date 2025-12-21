#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Setup Completo Automático
# Detecta, cria, configura e inicia TUDO automaticamente
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
BOLD='\033[1m'
NC='\033[0m'

clear
echo -e "${PURPLE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║      🚀 MeuMU Online - Setup Completo Automático 🚀         ║
║               Season 19-2-3 Épico - v3.0.0                   ║
║                                                              ║
║  Este script vai:                                            ║
║  ✅ Detectar estrutura atual                                 ║
║  ✅ Criar backend automaticamente (se necessário)            ║
║  ✅ Buildar frontend (se necessário)                         ║
║  ✅ Configurar tudo                                          ║
║  ✅ Iniciar serviços                                         ║
║  ✅ Testar funcionamento                                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# DETECTAR LOCALIZAÇÃO
# ═══════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo -e "${CYAN}📍 Localização do script: ${SCRIPT_DIR}${NC}"
echo ""

# Detectar se estamos no projeto fonte ou no diretório de deploy
if [ -f "$SCRIPT_DIR/package.json" ] && [ -f "$SCRIPT_DIR/vite.config.ts" ]; then
    # Estamos no projeto fonte (dev)
    PROJECT_SOURCE_DIR="$SCRIPT_DIR"
    echo -e "${GREEN}✅ Projeto fonte detectado: ${PROJECT_SOURCE_DIR}${NC}"
    IS_SOURCE=true
else
    # Estamos em diretório de deploy
    echo -e "${YELLOW}⚠️  Não estamos no diretório fonte do projeto${NC}"
    IS_SOURCE=false
fi

echo ""

# Pedir domínio/diretório de deploy
echo -e "${CYAN}${BOLD}Digite o domínio do seu servidor:${NC}"
echo -e "${YELLOW}Exemplos: meumu.com, game.example.com${NC}"
read -p "> " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Domínio não pode estar vazio!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Domínio: ${DOMAIN}${NC}"
echo ""

# Detectar diretório de deploy
POSSIBLE_PATHS=(
    "/home/${DOMAIN}/public_html"
    "/var/www/${DOMAIN}"
    "/var/www/html"
    "/usr/share/nginx/html"
    "$SCRIPT_DIR"
)

DEPLOY_DIR=""

echo -e "${CYAN}Detectando diretório de deploy...${NC}"
for path in "${POSSIBLE_PATHS[@]}"; do
    if [ -d "$path" ]; then
        echo -e "${YELLOW}Encontrado: ${path}${NC}"
        read -p "Este é o diretório correto? (s/N): " CONFIRM
        if [[ "$CONFIRM" =~ ^[Ss]$ ]]; then
            DEPLOY_DIR="$path"
            break
        fi
    fi
done

if [ -z "$DEPLOY_DIR" ]; then
    echo -e "${YELLOW}Digite o caminho do diretório de deploy:${NC}"
    read -p "> " DEPLOY_DIR
fi

echo ""
echo -e "${GREEN}✅ Diretório de deploy: ${DEPLOY_DIR}${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 1: VERIFICAR BACKEND-NODEJS
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 1: Verificar Backend Node.js                         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

BACKEND_TARGET="${DEPLOY_DIR}/backend-nodejs"

if [ -d "$BACKEND_TARGET" ]; then
    echo -e "${GREEN}✅ Backend já existe em: ${BACKEND_TARGET}${NC}"
else
    echo -e "${YELLOW}⚠️  Backend NÃO encontrado em: ${BACKEND_TARGET}${NC}"
    echo ""
    
    # Verificar se temos backend no projeto fonte
    if [ "$IS_SOURCE" = true ] && [ -d "${PROJECT_SOURCE_DIR}/backend-nodejs" ]; then
        echo -e "${CYAN}${BOLD}🎯 Backend encontrado no projeto fonte!${NC}"
        echo -e "${YELLOW}Vou copiar automaticamente de:${NC}"
        echo -e "${CYAN}  ${PROJECT_SOURCE_DIR}/backend-nodejs${NC}"
        echo -e "${YELLOW}Para:${NC}"
        echo -e "${CYAN}  ${BACKEND_TARGET}${NC}"
        echo ""
        read -p "Continuar? (S/n): " COPY_CONFIRM
        
        if [[ ! "$COPY_CONFIRM" =~ ^[Nn]$ ]]; then
            echo ""
            echo -e "${CYAN}Copiando backend...${NC}"
            
            # Copiar tudo exceto node_modules e .env
            rsync -av \
                --exclude='node_modules' \
                --exclude='.env' \
                --exclude='*.log' \
                "${PROJECT_SOURCE_DIR}/backend-nodejs/" \
                "${BACKEND_TARGET}/" \
                || { echo -e "${RED}❌ Erro ao copiar!${NC}"; exit 1; }
            
            echo -e "${GREEN}✅ Backend copiado com sucesso!${NC}"
        else
            echo -e "${RED}❌ Operação cancelada${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Backend não encontrado no projeto fonte!${NC}"
        echo ""
        echo -e "${YELLOW}Baixe o projeto completo de:${NC}"
        echo -e "${CYAN}https://github.com/seu-usuario/meumu-online${NC}"
        echo ""
        echo -e "${YELLOW}Ou execute o instalador web:${NC}"
        echo -e "${CYAN}http://${DOMAIN}/install${NC}"
        exit 1
    fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 2: VERIFICAR .ENV DO BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 2: Verificar Configuração (.env)                     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

ENV_FILE="${BACKEND_TARGET}/.env"

if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✅ Arquivo .env já existe${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .env NÃO existe!${NC}"
    echo ""
    echo -e "${CYAN}${BOLD}Você precisa configurar o backend primeiro!${NC}"
    echo ""
    echo -e "${YELLOW}Opções:${NC}"
    echo ""
    echo -e "  ${CYAN}1. Execute o instalador web:${NC}"
    echo -e "     ${BOLD}http://${DOMAIN}/install${NC}"
    echo ""
    echo -e "  ${CYAN}2. Ou crie manualmente:${NC}"
    echo -e "     ${BOLD}cp ${BACKEND_TARGET}/.env.example ${ENV_FILE}${NC}"
    echo -e "     ${BOLD}nano ${ENV_FILE}${NC}"
    echo ""
    
    read -p "Deseja criar .env agora? (s/N): " CREATE_ENV
    
    if [[ "$CREATE_ENV" =~ ^[Ss]$ ]]; then
        echo ""
        echo -e "${CYAN}Criando .env...${NC}"
        
        # Criar .env básico
        cat > "$ENV_FILE" << 'ENVEOF'
# MeuMU Online - Backend Configuration
# IMPORTANTE: Configure estes valores!

# ═══════════════════════════════════════════════════════════════
# DATABASE - MySQL/MariaDB do Servidor MU (READONLY)
# ═══════════════════════════════════════════════════════════════
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=muonline
DB_POOL_MIN=2
DB_POOL_MAX=10

# ═══════════════════════════════════════════════════════════════
# DATABASE WEBMU - Database do Site (READ/WRITE)
# ═══════════════════════════════════════════════════════════════
WEBMU_DB_HOST=localhost
WEBMU_DB_PORT=3306
WEBMU_DB_USER=root
WEBMU_DB_PASSWORD=sua_senha_aqui
WEBMU_DB_NAME=webmu

# ═══════════════════════════════════════════════════════════════
# SERVIDOR
# ═══════════════════════════════════════════════════════════════
PORT=3001
NODE_ENV=production

# ═══════════════════════════════════════════════════════════════
# SEGURANÇA
# ═══════════════════════════════════════════════════════════════
JWT_SECRET=gere_uma_senha_super_secreta_aleatoria_aqui
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://DOMAIN_AQUI

# ═══════════════════════════════════════════════════════════════
# SERVIDOR MU ONLINE
# ═══════════════════════════════════════════════════════════════
SERVER_NAME=MeuMU Online
SERVER_VERSION=Season 19-2-3 - Épico
SERVER_RATES_EXP=1000x
SERVER_RATES_DROP=50%
SERVER_MAX_RESET=500
SERVER_MAX_GRAND_RESET=50

# ═══════════════════════════════════════════════════════════════
# TABELAS (detectadas automaticamente)
# ═══════════════════════════════════════════════════════════════
# As tabelas serão detectadas pelo auto-fix-tables.js
ENVEOF
        
        # Substituir DOMAIN_AQUI pelo domínio real
        sed -i "s/DOMAIN_AQUI/${DOMAIN}/g" "$ENV_FILE"
        
        echo -e "${GREEN}✅ Arquivo .env criado!${NC}"
        echo ""
        echo -e "${YELLOW}${BOLD}⚠️  IMPORTANTE: Edite o arquivo e configure:${NC}"
        echo -e "  • ${CYAN}Senha do MySQL (DB_PASSWORD e WEBMU_DB_PASSWORD)${NC}"
        echo -e "  • ${CYAN}JWT_SECRET (senha aleatória)${NC}"
        echo ""
        echo -e "${CYAN}Editar agora?${NC}"
        read -p "(s/N): " EDIT_NOW
        
        if [[ "$EDIT_NOW" =~ ^[Ss]$ ]]; then
            nano "$ENV_FILE" || vi "$ENV_FILE" || vim "$ENV_FILE"
        else
            echo -e "${YELLOW}Edite depois: nano ${ENV_FILE}${NC}"
        fi
    else
        echo -e "${RED}❌ Backend não pode funcionar sem .env!${NC}"
        echo -e "${YELLOW}Execute: http://${DOMAIN}/install${NC}"
        exit 1
    fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 3: INSTALAR DEPENDÊNCIAS DO BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 3: Instalar Dependências do Backend                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

cd "$BACKEND_TARGET" || exit 1

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
else
    echo -e "${CYAN}Instalando dependências (isso pode demorar)...${NC}"
    npm install || { echo -e "${RED}❌ Erro ao instalar dependências!${NC}"; exit 1; }
    echo -e "${GREEN}✅ Dependências instaladas!${NC}"
fi

cd "$DEPLOY_DIR" || exit 1

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 4: VERIFICAR/BUILDAR FRONTEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 4: Verificar Frontend                                ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ -f "${DEPLOY_DIR}/dist/index.html" ]; then
    echo -e "${GREEN}✅ Frontend já buildado (dist/index.html existe)${NC}"
elif [ -f "${DEPLOY_DIR}/index.html" ]; then
    echo -e "${GREEN}✅ Frontend HTML direto (index.html existe)${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend não encontrado!${NC}"
    
    if [ "$IS_SOURCE" = true ]; then
        echo ""
        echo -e "${CYAN}Buildando React...${NC}"
        
        cd "$PROJECT_SOURCE_DIR" || exit 1
        
        # Instalar dependências se necessário
        if [ ! -d "node_modules" ]; then
            echo -e "${CYAN}Instalando dependências do frontend...${NC}"
            npm install || { echo -e "${RED}❌ Erro!${NC}"; exit 1; }
        fi
        
        # Build
        npm run build || { echo -e "${RED}❌ Erro no build!${NC}"; exit 1; }
        
        # Copiar dist para deploy
        if [ "${DEPLOY_DIR}" != "${PROJECT_SOURCE_DIR}" ]; then
            echo -e "${CYAN}Copiando dist para ${DEPLOY_DIR}...${NC}"
            cp -r dist "${DEPLOY_DIR}/" || { echo -e "${RED}❌ Erro ao copiar!${NC}"; exit 1; }
        fi
        
        echo -e "${GREEN}✅ Frontend buildado!${NC}"
        
        cd "$DEPLOY_DIR" || exit 1
    else
        echo -e "${RED}❌ Frontend não disponível!${NC}"
        echo -e "${YELLOW}Baixe o projeto e execute: npm run build${NC}"
        exit 1
    fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 5: INICIAR BACKEND
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 5: Iniciar Backend Node.js                           ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se já está rodando
if netstat -tuln 2>/dev/null | grep -q ':3001 '; then
    echo -e "${YELLOW}⚠️  Backend já está rodando na porta 3001${NC}"
    
    if command -v pm2 &> /dev/null; then
        echo -e "${CYAN}Reiniciando...${NC}"
        pm2 restart meumu-backend 2>/dev/null || pm2 start "${BACKEND_TARGET}/src/server.js" --name meumu-backend
    fi
    
    echo -e "${GREEN}✅ Backend rodando${NC}"
else
    # Instalar PM2 se não existir
    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}PM2 não instalado. Instalando...${NC}"
        sudo npm install -g pm2 || { echo -e "${RED}❌ Erro ao instalar PM2!${NC}"; exit 1; }
        echo -e "${GREEN}✅ PM2 instalado!${NC}"
    fi
    
    echo -e "${CYAN}Iniciando backend com PM2...${NC}"
    cd "$BACKEND_TARGET" || exit 1
    
    pm2 delete meumu-backend 2>/dev/null
    pm2 start src/server.js --name meumu-backend || { 
        echo -e "${RED}❌ Erro ao iniciar backend!${NC}"
        echo ""
        echo -e "${YELLOW}Verificando erro...${NC}"
        node src/server.js
        exit 1
    }
    
    pm2 save
    
    # Configurar PM2 para iniciar no boot
    pm2 startup 2>/dev/null || true
    
    echo -e "${GREEN}✅ Backend iniciado!${NC}"
    
    cd "$DEPLOY_DIR" || exit 1
fi

echo ""
echo -e "${CYAN}Aguardando backend inicializar...${NC}"
sleep 3

# Testar backend
echo -e "${CYAN}Testando backend...${NC}"
HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)

if echo "$HEALTH" | grep -q '"status"'; then
    echo -e "${GREEN}✅ Backend respondendo corretamente!${NC}"
    echo -e "${CYAN}Resposta: ${HEALTH:0:100}...${NC}"
else
    echo -e "${RED}❌ Backend não está respondendo!${NC}"
    echo ""
    echo -e "${YELLOW}Logs do PM2:${NC}"
    pm2 logs meumu-backend --lines 30 --nostream
    echo ""
    echo -e "${YELLOW}Verifique:${NC}"
    echo -e "  • ${CYAN}.env está configurado corretamente${NC}"
    echo -e "  • ${CYAN}MySQL está rodando${NC}"
    echo -e "  • ${CYAN}Credenciais do banco estão corretas${NC}"
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 6: CONFIGURAR PROXY REVERSO
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 6: Configurar Proxy Reverso                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Detectar servidor web
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
elif systemctl is-active --quiet nginx 2>/dev/null; then
    WEBSERVER="nginx"
    echo -e "${GREEN}✅ Nginx detectado${NC}"
else
    echo -e "${YELLOW}⚠️  Servidor web não detectado automaticamente${NC}"
    echo ""
    echo "Qual servidor web você usa?"
    echo "  1) OpenLiteSpeed (CyberPanel)"
    echo "  2) Apache"
    echo "  3) Nginx"
    echo "  4) Pular configuração (manual)"
    read -p "Escolha (1-4): " WEB_CHOICE
    
    case $WEB_CHOICE in
        1) WEBSERVER="openlitespeed" ;;
        2) WEBSERVER="apache" ;;
        3) WEBSERVER="nginx" ;;
        *) WEBSERVER="skip" ;;
    esac
fi

echo ""

if [ "$WEBSERVER" != "skip" ]; then
    case $WEBSERVER in
        openlitespeed)
            echo -e "${CYAN}Configurando OpenLiteSpeed...${NC}"
            
            # Chamar script específico do CyberPanel se existir
            if [ -f "${SCRIPT_DIR}/configurar-cyberpanel.sh" ]; then
                bash "${SCRIPT_DIR}/configurar-cyberpanel.sh"
            else
                echo -e "${YELLOW}Script configurar-cyberpanel.sh não encontrado${NC}"
                echo -e "${YELLOW}Configure manualmente no CyberPanel${NC}"
            fi
            ;;
            
        apache)
            echo -e "${YELLOW}Configuração manual necessária para Apache${NC}"
            echo ""
            echo -e "${CYAN}Adicione ao VirtualHost:${NC}"
            echo ""
            cat << 'APACHECONF'
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
APACHECONF
            echo ""
            echo -e "${YELLOW}Depois: sudo systemctl restart apache2${NC}"
            ;;
            
        nginx)
            echo -e "${YELLOW}Configuração manual necessária para Nginx${NC}"
            echo ""
            echo -e "${CYAN}Adicione ao server block:${NC}"
            echo ""
            cat << 'NGINXCONF'
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
NGINXCONF
            echo ""
            echo -e "${YELLOW}Depois: sudo systemctl restart nginx${NC}"
            ;;
    esac
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 7: TESTAR TUDO
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 7: Testar Sistema Completo                           ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}Aguardando 5 segundos...${NC}"
sleep 5

# Teste 1: Backend direto
echo -e "${CYAN}Teste 1: Backend direto${NC}"
BACKEND_API=$(curl -s http://localhost:3001/api/server/info 2>/dev/null)

if echo "$BACKEND_API" | grep -q '"success"'; then
    echo -e "${GREEN}✅ API /server/info funcionando${NC}"
else
    echo -e "${RED}❌ API não está respondendo corretamente${NC}"
    echo -e "${YELLOW}Resposta: ${BACKEND_API}${NC}"
fi

echo ""

# Teste 2: Proxy
echo -e "${CYAN}Teste 2: Proxy via domínio${NC}"
PROXY_TEST=$(curl -s http://${DOMAIN}/api/health 2>/dev/null)

if echo "$PROXY_TEST" | grep -q '"status"'; then
    echo -e "${GREEN}✅ PROXY FUNCIONANDO!${NC}"
elif echo "$PROXY_TEST" | grep -q "<!DOCTYPE"; then
    echo -e "${RED}❌ PROXY NÃO CONFIGURADO!${NC}"
    echo -e "${YELLOW}Servidor retornando HTML em vez de fazer proxy${NC}"
else
    echo -e "${YELLOW}⚠️  Sem resposta (verifique DNS/domínio)${NC}"
fi

echo ""

# Teste 3: Frontend
echo -e "${CYAN}Teste 3: Frontend${NC}"
if curl -s http://${DOMAIN} 2>/dev/null | grep -q "<!DOCTYPE"; then
    echo -e "${GREEN}✅ Frontend acessível${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend pode não estar acessível${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# RESULTADO FINAL
# ═══════════════════════════════════════════════════════════════

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  ✅ SETUP COMPLETO! ✅                       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${PURPLE}${BOLD}🎮 MeuMU Online está pronto! 🎮${NC}"
echo ""
echo -e "${CYAN}Próximos passos:${NC}"
echo ""
echo -e "  1. ${YELLOW}Acesse:${NC} ${BOLD}${CYAN}http://${DOMAIN}${NC}"
echo -e "  2. ${YELLOW}Limpe cache:${NC} ${BOLD}Ctrl+Shift+R${NC}"
echo -e "  3. ${YELLOW}Verifique console:${NC} ${BOLD}F12 → Console${NC}"
echo ""
echo -e "${CYAN}Comandos úteis:${NC}"
echo -e "  • ${YELLOW}pm2 status${NC} - Ver processos"
echo -e "  • ${YELLOW}pm2 logs meumu-backend${NC} - Ver logs"
echo -e "  • ${YELLOW}pm2 restart meumu-backend${NC} - Reiniciar"
echo -e "  • ${YELLOW}pm2 stop meumu-backend${NC} - Parar"
echo ""
echo -e "${CYAN}Arquivos importantes:${NC}"
echo -e "  • ${YELLOW}Backend:${NC} ${BACKEND_TARGET}"
echo -e "  • ${YELLOW}Config:${NC} ${ENV_FILE}"
echo -e "  • ${YELLOW}Frontend:${NC} ${DEPLOY_DIR}/dist"
echo ""

if echo "$PROXY_TEST" | grep -q "<!DOCTYPE"; then
    echo -e "${RED}${BOLD}⚠️  ATENÇÃO: Proxy precisa ser configurado manualmente!${NC}"
    echo ""
fi

echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}${BOLD}       MeuMU Online v3.0.0 - Setup Completo${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
