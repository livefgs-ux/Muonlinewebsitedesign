#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - INSTALADOR INTERATIVO
# ═══════════════════════════════════════════════════════════════

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'
BOLD='\033[1m'

# Diretório base
BASE_DIR="/home/meumu.com/public_html"

# ═══════════════════════════════════════════════════════════════
# FUNÇÕES AUXILIARES
# ═══════════════════════════════════════════════════════════════

pause() {
    echo ""
    echo -e "${CYAN}Pressione ENTER para voltar ao menu...${NC}"
    read -r
}

clear_screen() {
    clear
    echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
    echo -e "${MAGENTA}       🎮 MEUMU ONLINE - INSTALADOR INTERATIVO 🎮${NC}"
    echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 1: INSTALAÇÃO COMPLETA
# ═══════════════════════════════════════════════════════════════

instalacao_completa() {
    clear_screen
    echo -e "${BOLD}🚀 INSTALAÇÃO COMPLETA AUTOMÁTICA${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    # Etapa 1: Verificar MySQL
    echo -e "${YELLOW}[1/7]${NC} Verificando MySQL..."
    if mysql -u root -p@mysql123@ -e "SHOW DATABASES;" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ MySQL rodando e acessível${NC}"
        
        DB_MU=$(mysql -u root -p@mysql123@ -e "SHOW DATABASES LIKE 'muonline';" 2>/dev/null | grep muonline)
        DB_WEB=$(mysql -u root -p@mysql123@ -e "SHOW DATABASES LIKE 'webmu';" 2>/dev/null | grep webmu)
        
        if [ -z "$DB_MU" ]; then
            echo -e "${RED}❌ Database 'muonline' não existe!${NC}"
            pause
            return 1
        fi
        
        if [ -z "$DB_WEB" ]; then
            echo -e "${YELLOW}⚠️  Criando database 'webmu'...${NC}"
            mysql -u root -p@mysql123@ -e "CREATE DATABASE webmu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
        fi
        echo -e "${GREEN}   ✅ Databases OK${NC}"
    else
        echo -e "${RED}❌ MySQL não acessível!${NC}"
        pause
        return 1
    fi
    
    # Etapa 2: Instalar dependências do frontend
    echo ""
    echo -e "${YELLOW}[2/7]${NC} Instalando dependências do frontend..."
    cd "$BASE_DIR" || exit 1
    if npm install --no-scripts > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Dependências do frontend instaladas${NC}"
    else
        echo -e "${RED}❌ Falha ao instalar dependências do frontend${NC}"
        pause
        return 1
    fi
    
    # Etapa 3: Instalar dependências do backend
    echo ""
    echo -e "${YELLOW}[3/7]${NC} Instalando dependências do backend..."
    cd "$BASE_DIR/backend-nodejs" || exit 1
    if npm install > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Dependências do backend instaladas${NC}"
    else
        echo -e "${RED}❌ Falha ao instalar dependências do backend${NC}"
        pause
        return 1
    fi
    cd "$BASE_DIR" || exit 1
    
    # Etapa 4: Configurar .env
    echo ""
    echo -e "${YELLOW}[4/7]${NC} Configurando .env..."
    configurar_env_interno
    
    # Etapa 5: Buildar frontend
    echo ""
    echo -e "${YELLOW}[5/7]${NC} Buildando frontend..."
    cd "$BASE_DIR" || exit 1
    
    if [ -d "dist" ]; then
        mv dist "dist.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null
    fi
    
    echo -e "${CYAN}   Aguarde, isso pode levar alguns minutos...${NC}"
    if npm run build; then
        echo -e "${GREEN}✅ Frontend buildado com sucesso${NC}"
    else
        echo -e "${RED}❌ Falha ao buildar frontend${NC}"
        pause
        return 1
    fi
    
    # Etapa 6: Parar processos antigos
    echo ""
    echo -e "${YELLOW}[6/7]${NC} Parando processos Node.js antigos..."
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f "nodemon.*server.js" 2>/dev/null
    sleep 2
    echo -e "${GREEN}✅ Processos antigos encerrados${NC}"
    
    # Etapa 7: Iniciar servidor
    echo ""
    echo -e "${YELLOW}[7/7]${NC} Iniciando servidor..."
    
    mkdir -p "$BASE_DIR/backend-nodejs/logs/alerts" 2>/dev/null
    mkdir -p "$BASE_DIR/backend-nodejs/logs/audit" 2>/dev/null
    mkdir -p "$BASE_DIR/backend-nodejs/logs/security" 2>/dev/null
    
    cd "$BASE_DIR/backend-nodejs" || exit 1
    
    if command -v pm2 &> /dev/null; then
        pm2 delete meumu-backend 2>/dev/null || true
        pm2 start src/server.js --name meumu-backend --log logs/server.log
        pm2 save
        echo -e "${GREEN}✅ Servidor iniciado com PM2${NC}"
    else
        nohup npm start > logs/server.log 2>&1 &
        sleep 3
        echo -e "${GREEN}✅ Servidor iniciado em background${NC}"
    fi
    
    cd "$BASE_DIR" || exit 1
    
    # Aguardar inicialização
    echo ""
    echo -e "${CYAN}⏳ Aguardando servidor inicializar (5 segundos)...${NC}"
    sleep 5
    
    # Testar servidor
    HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Servidor respondendo!${NC}"
        echo ""
        echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}✅✅✅ INSTALAÇÃO COMPLETA COM SUCESSO! ✅✅✅${NC}"
        echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
        echo ""
        echo -e "${BOLD}🌐 ACESSE O SITE:${NC}"
        echo -e "   ${BLUE}http://meumu.com:3001${NC}"
        echo ""
    else
        echo -e "${RED}❌ Servidor não está respondendo${NC}"
        echo -e "${YELLOW}Verifique os logs: tail -f backend-nodejs/logs/server.log${NC}"
    fi
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 2: INSTALAR DEPENDÊNCIAS
# ═══════════════════════════════════════════════════════════════

instalar_dependencias() {
    clear_screen
    echo -e "${BOLD}📦 INSTALAÇÃO DE DEPENDÊNCIAS${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    echo -e "${YELLOW}[1/2]${NC} Instalando dependências do frontend..."
    cd "$BASE_DIR" || exit 1
    npm install --no-scripts
    echo -e "${GREEN}✅ Frontend OK${NC}"
    
    echo ""
    echo -e "${YELLOW}[2/2]${NC} Instalando dependências do backend..."
    cd "$BASE_DIR/backend-nodejs" || exit 1
    npm install
    echo -e "${GREEN}✅ Backend OK${NC}"
    
    cd "$BASE_DIR" || exit 1
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ Todas as dependências instaladas!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 3: CONFIGURAR .ENV
# ═══════════════════════════════════════════════════════════════

configurar_env_interno() {
    if [ -f "$BASE_DIR/backend-nodejs/.env.production" ]; then
        if [ -f "$BASE_DIR/backend-nodejs/.env" ]; then
            cp "$BASE_DIR/backend-nodejs/.env" "$BASE_DIR/backend-nodejs/.env.backup.$(date +%Y%m%d_%H%M%S)"
        fi
        cp "$BASE_DIR/backend-nodejs/.env.production" "$BASE_DIR/backend-nodejs/.env"
        echo -e "${GREEN}✅ .env configurado${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.production não encontrado. Criando...${NC}"
        cat > "$BASE_DIR/backend-nodejs/.env.production" << 'EOF'
# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - CONFIGURAÇÃO DE PRODUÇÃO
# ═══════════════════════════════════════════════════════════════

# SEGURANÇA - JWT (ALTERAR EM PRODUÇÃO!)
JWT_SECRET=mEuMu_OnL1nE_jWt_K3y_2o24_pr0ducT10n_4a8b9c7d2e5f6g1h3i

# DATABASE PRINCIPAL (Host, User, Password compartilhados)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=@mysql123@

# DATABASES (Nomes)
DB_NAME_MUONLINE=muonline
DB_NAME_WEBMU=webmu

# DATABASE MUONLINE (Servidor MU - Read Only) - Compatibilidade
DB_MU_HOST=127.0.0.1
DB_MU_PORT=3306
DB_MU_USER=root
DB_MU_PASSWORD=@mysql123@
DB_MU_NAME=muonline

# DATABASE WEBMU (Website - Read + Write) - Compatibilidade
DB_WEB_HOST=127.0.0.1
DB_WEB_PORT=3306
DB_WEB_USER=root
DB_WEB_PASSWORD=@mysql123@
DB_WEB_NAME=webmu

# SERVIDOR
PORT=3001
FRONTEND_URL=http://meumu.com:3001

# POOL DE CONEXÕES
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# RATE LIMITING
RATE_LIMIT_AUTH_WINDOW=15
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_API_WINDOW=1
RATE_LIMIT_API_MAX=100
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# LOGS E AUDITORIA
LOG_LEVEL=info
ENABLE_AUDIT_LOG=true
ENABLE_SECURITY_ALERTS=true

# AMBIENTE
NODE_ENV=production

# SEGURANÇA
ALLOWED_ORIGINS=http://meumu.com:3001,http://localhost:3001
SESSION_SECRET=mEuMu_s3ss10n_k3y_7x9y2z4a6b8c
EOF
        cp "$BASE_DIR/backend-nodejs/.env.production" "$BASE_DIR/backend-nodejs/.env"
        echo -e "${GREEN}✅ .env criado e configurado${NC}"
    fi
}

configurar_env() {
    clear_screen
    echo -e "${BOLD}⚙️  CONFIGURAÇÃO DO .ENV${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    configurar_env_interno
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ Configuração do .env concluída!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 4: BUILD FRONTEND
# ═══════════════════════════════════════════════════════════════

build_frontend() {
    clear_screen
    echo -e "${BOLD}🏗️  BUILD DO FRONTEND${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    cd "$BASE_DIR" || exit 1
    
    if [ -d "dist" ]; then
        echo -e "${YELLOW}⚠️  Fazendo backup do dist antigo...${NC}"
        mv dist "dist.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null
    fi
    
    echo -e "${CYAN}🔨 Buildando... (pode levar alguns minutos)${NC}"
    echo ""
    
    if npm run build; then
        echo ""
        echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}✅ Frontend buildado com sucesso!${NC}"
        echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    else
        echo ""
        echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
        echo -e "${RED}❌ Falha ao buildar frontend!${NC}"
        echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
    fi
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 5: REINICIAR SERVIDOR
# ═══════════════════════════════════════════════════════════════

reiniciar_servidor() {
    clear_screen
    echo -e "${BOLD}🔄 REINICIAR SERVIDOR NODE.JS${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    echo -e "${YELLOW}[1/3]${NC} Parando processos antigos..."
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f "nodemon.*server.js" 2>/dev/null
    sleep 2
    echo -e "${GREEN}✅ Processos encerrados${NC}"
    
    echo ""
    echo -e "${YELLOW}[2/3]${NC} Criando diretórios de logs..."
    mkdir -p "$BASE_DIR/backend-nodejs/logs/alerts" 2>/dev/null
    mkdir -p "$BASE_DIR/backend-nodejs/logs/audit" 2>/dev/null
    mkdir -p "$BASE_DIR/backend-nodejs/logs/security" 2>/dev/null
    echo -e "${GREEN}✅ Diretórios criados${NC}"
    
    echo ""
    echo -e "${YELLOW}[3/3]${NC} Iniciando servidor..."
    
    cd "$BASE_DIR/backend-nodejs" || exit 1
    
    if command -v pm2 &> /dev/null; then
        pm2 delete meumu-backend 2>/dev/null || true
        pm2 start src/server.js --name meumu-backend --log logs/server.log
        pm2 save
        echo -e "${GREEN}✅ Servidor iniciado com PM2${NC}"
    else
        nohup npm start > logs/server.log 2>&1 &
        SERVER_PID=$!
        sleep 3
        
        if ps -p $SERVER_PID > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Servidor iniciado (PID: $SERVER_PID)${NC}"
        else
            echo -e "${RED}❌ Servidor falhou ao iniciar!${NC}"
            echo -e "${YELLOW}Verifique: tail -f logs/server.log${NC}"
            pause
            return 1
        fi
    fi
    
    cd "$BASE_DIR" || exit 1
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ Servidor reiniciado!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 6: VERIFICAR MYSQL
# ═══════════════════════════════════════════════════════════════

verificar_mysql() {
    clear_screen
    echo -e "${BOLD}🔍 VERIFICAÇÃO DO MYSQL${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    if mysql -u root -p@mysql123@ -e "SHOW DATABASES;" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ MySQL está rodando e acessível${NC}"
        echo ""
        
        echo -e "${BOLD}Databases disponíveis:${NC}"
        mysql -u root -p@mysql123@ -e "SHOW DATABASES;" 2>/dev/null
        
        echo ""
        DB_MU=$(mysql -u root -p@mysql123@ -e "SHOW DATABASES LIKE 'muonline';" 2>/dev/null | grep muonline)
        DB_WEB=$(mysql -u root -p@mysql123@ -e "SHOW DATABASES LIKE 'webmu';" 2>/dev/null | grep webmu)
        
        if [ -n "$DB_MU" ]; then
            echo -e "${GREEN}✅ Database 'muonline' existe${NC}"
        else
            echo -e "${RED}❌ Database 'muonline' NÃO existe${NC}"
        fi
        
        if [ -n "$DB_WEB" ]; then
            echo -e "${GREEN}✅ Database 'webmu' existe${NC}"
        else
            echo -e "${RED}❌ Database 'webmu' NÃO existe${NC}"
        fi
    else
        echo -e "${RED}❌ MySQL não está acessível!${NC}"
        echo -e "${YELLOW}Verifique a senha: @mysql123@${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 7: VERIFICAR PORTAS
# ═══════════════════════════════════════════════════════════════

verificar_portas() {
    clear_screen
    echo -e "${BOLD}🔌 VERIFICAÇÃO DE PORTAS${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    echo -e "${BOLD}Porta 3306 (MySQL):${NC}"
    if netstat -tulnp 2>/dev/null | grep :3306 > /dev/null; then
        echo -e "${GREEN}✅ Porta 3306 está em uso (MySQL rodando)${NC}"
        netstat -tulnp 2>/dev/null | grep :3306
    else
        echo -e "${RED}❌ Porta 3306 não está em uso${NC}"
    fi
    
    echo ""
    echo -e "${BOLD}Porta 3001 (Node.js):${NC}"
    if netstat -tulnp 2>/dev/null | grep :3001 > /dev/null; then
        echo -e "${GREEN}✅ Porta 3001 está em uso (Servidor rodando)${NC}"
        netstat -tulnp 2>/dev/null | grep :3001
    else
        echo -e "${RED}❌ Porta 3001 não está em uso${NC}"
    fi
    
    echo ""
    echo -e "${BOLD}Processos Node.js:${NC}"
    if ps aux | grep -v grep | grep "node.*server.js" > /dev/null; then
        ps aux | grep -v grep | grep "node.*server.js"
    else
        echo -e "${YELLOW}⚠️  Nenhum processo Node.js encontrado${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 8: HEALTH CHECK
# ═══════════════════════════════════════════════════════════════

health_check() {
    clear_screen
    echo -e "${BOLD}💚 HEALTH CHECK${NC}"
    echo "════════════��═══════════════════════════════════════════════"
    echo ""
    
    echo -e "${CYAN}🔍 Testando endpoint /health...${NC}"
    echo ""
    
    HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Servidor está respondendo!${NC}"
        echo ""
        echo -e "${BOLD}Resposta:${NC}"
        echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"
        
        echo ""
        if echo "$HEALTH" | grep -q '"database":"connected"'; then
            echo -e "${GREEN}✅ Database: CONECTADO${NC}"
        else
            echo -e "${RED}❌ Database: DESCONECTADO${NC}"
        fi
    else
        echo -e "${RED}❌ Servidor não está respondendo!${NC}"
        echo -e "${YELLOW}Porta 3001 não está acessível${NC}"
    fi
    
    echo ""
    echo -e "${CYAN}🔍 Testando endpoint /api/server/info...${NC}"
    echo ""
    
    INFO=$(curl -s http://localhost:3001/api/server/info 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ API está respondendo!${NC}"
        echo ""
        echo -e "${BOLD}Resposta:${NC}"
        echo "$INFO" | python3 -m json.tool 2>/dev/null || echo "$INFO"
    else
        echo -e "${RED}❌ API não está respondendo!${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 9: VER LOGS
# ═══════════════════════════════════════════════════════════════

ver_logs() {
    clear_screen
    echo -e "${BOLD}📋 LOGS DO SERVIDOR${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    if [ -f "$BASE_DIR/backend-nodejs/logs/server.log" ]; then
        echo -e "${CYAN}Últimas 50 linhas do log:${NC}"
        echo ""
        tail -50 "$BASE_DIR/backend-nodejs/logs/server.log"
    else
        echo -e "${RED}❌ Arquivo de log não encontrado!${NC}"
        echo -e "${YELLOW}Path: $BASE_DIR/backend-nodejs/logs/server.log${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}Para ver logs em tempo real: tail -f backend-nodejs/logs/server.log${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# MENU PRINCIPAL
# ═══════════════════════════════════════════════════════════════

menu_principal() {
    while true; do
        clear_screen
        
        echo -e "${BOLD}MENU PRINCIPAL:${NC}"
        echo ""
        echo -e "${GREEN} 1)${NC} 🚀 Instalação Completa (RECOMENDADO)"
        echo -e "${GREEN} 2)${NC} 📦 Instalar Dependências (npm install)"
        echo -e "${GREEN} 3)${NC} ⚙️  Configurar .env"
        echo -e "${GREEN} 4)${NC} 🏗️  Build Frontend"
        echo -e "${GREEN} 5)${NC} 🔄 Reiniciar Servidor"
        echo ""
        echo -e "${CYAN} 6)${NC} 🔍 Verificar MySQL"
        echo -e "${CYAN} 7)${NC} 🔌 Verificar Portas"
        echo -e "${CYAN} 8)${NC} 💚 Health Check"
        echo -e "${CYAN} 9)${NC} 📋 Ver Logs"
        echo ""
        echo -e "${RED} 0)${NC} ❌ Sair"
        echo ""
        echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
        echo -n -e "${BOLD}Escolha uma opção: ${NC}"
        
        read -r opcao
        
        case $opcao in
            1) instalacao_completa ;;
            2) instalar_dependencias ;;
            3) configurar_env ;;
            4) build_frontend ;;
            5) reiniciar_servidor ;;
            6) verificar_mysql ;;
            7) verificar_portas ;;
            8) health_check ;;
            9) ver_logs ;;
            0) 
                clear_screen
                echo -e "${GREEN}Até logo! 👋${NC}"
                echo ""
                exit 0
                ;;
            *)
                echo -e "${RED}Opção inválida!${NC}"
                sleep 1
                ;;
        esac
    done
}

# ═══════════════════════════════════════════════════════════════
# INICIAR
# ═══════════════════════════════════════════════════════════════

# Verificar se está no diretório correto
if [ ! -d "$BASE_DIR" ]; then
    echo -e "${RED}❌ Diretório base não encontrado: $BASE_DIR${NC}"
    exit 1
fi

# Iniciar menu
menu_principal