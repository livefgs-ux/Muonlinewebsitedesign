#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - INSTALADOR INTERATIVO
# ═══════════════════════════════════════════════════════════════
# 📌 VERSÃO DO INSTALADOR
VERSION="579"
VERSION_DATE="2025-12-31 00:05 CET - V579: FIX CRÍTICO - AdminCP não desaparece mais em erros HTTP (cache persistente)"
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
# MYSQL - COMANDOS PADRONIZADOS (PATCH MÍNIMO V514)
# ═══════════════════════════════════════════════════════════════
# 🔧 CORREÇÃO: MariaDB moderno usa unix_socket (root SEM senha)
# 👉 Admin tasks = sudo mysql
# 👉 App tasks = webuser com senha
# ═══════════════════════════════════════════════════════════════

MYSQL_ADMIN_CMD="sudo mysql"
MYSQL_WEB_USER="webuser"
MYSQL_WEB_PASS="@meusite123@"
WEB_GROUP="cyberpanel"

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
    echo -e "${CYAN}                    📌 Versão: ${VERSION} (${VERSION_DATE})${NC}"
    echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÕES DE PROTEÇÃO E VALIDAÇÃO
# ═══════════════════════════════════════════════════════════════

# Função 1: Matar TODOS os processos Node.js (proteção contra duplicação)
kill_all_node_processes() {
    echo -e "${YELLOW}🔪 Matando TODOS os processos Node.js...${NC}"
    
    # Matar nodemon
    pkill -9 -f nodemon 2>/dev/null
    
    # Matar node server.js
    pkill -9 -f "node.*server.js" 2>/dev/null
    
    # Matar npm start
    pkill -9 -f "npm.*start" 2>/dev/null
    
    # Matar PM2
    if command -v pm2 &> /dev/null; then
        pm2 delete meumu-backend 2>/dev/null || true
        pm2 delete all 2>/dev/null || true
    fi
    
    # Aguardar processos morrerem
    sleep 3
    
    # Verificar se ainda tem algo rodando
    if pgrep -f "node.*server.js" > /dev/null 2>&1; then
        echo -e "${RED}⚠️  Ainda há processos Node.js rodando!${NC}"
        echo -e "${YELLOW}Forçando kill -9...${NC}"
        pkill -9 -f node 2>/dev/null
        sleep 2
    fi
    
    echo -e "${GREEN}✅ Todos os processos Node.js foram encerrados${NC}"
}

# Função 2: Verificar se porta 3001 está livre
check_port_3001() {
    if netstat -tulpn 2>/dev/null | grep -q ":3001 " || ss -tulpn 2>/dev/null | grep -q ":3001 "; then
        echo -e "${RED}❌ ERRO: Porta 3001 ainda está em uso!${NC}"
        echo ""
        echo -e "${YELLOW}Processos usando porta 3001:${NC}"
        netstat -tulpn 2>/dev/null | grep ":3001" || ss -tulpn 2>/dev/null | grep ":3001"
        echo ""
        
        # Tentar identificar PID
        PORT_PID=$(lsof -ti:3001 2>/dev/null)
        if [ -n "$PORT_PID" ]; then
            echo -e "${RED}PID usando porta 3001: $PORT_PID${NC}"
            echo -e "${YELLOW}Matando processo $PORT_PID...${NC}"
            kill -9 $PORT_PID 2>/dev/null
            sleep 2
        fi
        
        # Verificar novamente
        if netstat -tulpn 2>/dev/null | grep -q ":3001 " || ss -tulpn 2>/dev/null | grep -q ":3001 "; then
            echo -e "${RED}❌ Falha ao liberar porta 3001!${NC}"
            echo -e "${YELLOW}Execute manualmente:${NC}"
            echo -e "${CYAN}lsof -ti:3001 | xargs kill -9${NC}"
            return 1
        else
            echo -e "${GREEN}✅ Porta 3001 liberada com sucesso${NC}"
        fi
    else
        echo -e "${GREEN}✅ Porta 3001 está livre${NC}"
    fi
    return 0
}

# Função 3: Validar .env não tem placeholders
validate_env_file() {
    local ENV_FILE="$BASE_DIR/backend-nodejs/.env"
    
    echo -e "${YELLOW}🔍 Validando arquivo .env...${NC}"
    
    if [ ! -f "$ENV_FILE" ]; then
        echo -e "${RED}❌ ERRO: Arquivo .env não existe!${NC}"
        return 1
    fi
    
    # Verificar placeholders perigosos
    if grep -q "sua_senha_mysql" "$ENV_FILE" 2>/dev/null; then
        echo -e "${RED}❌ ERRO: .env contém placeholder 'sua_senha_mysql'!${NC}"
        echo -e "${YELLOW}Corrija o arquivo: nano $ENV_FILE${NC}"
        return 1
    fi
    
    if grep -q "your_password_here" "$ENV_FILE" 2>/dev/null; then
        echo -e "${RED}❌ ERRO: .env contém placeholder 'your_password_here'!${NC}"
        echo -e "${YELLOW}Corrija o arquivo: nano $ENV_FILE${NC}"
        return 1
    fi
    
    if grep -q "CHANGE_ME" "$ENV_FILE" 2>/dev/null; then
        echo -e "${RED}❌ ERRO: .env contém placeholder 'CHANGE_ME'!${NC}"
        echo -e "${YELLOW}Corrija o arquivo: nano $ENV_FILE${NC}"
        return 1
    fi
    
    # Verificar se senha não está vazia
    DB_PASS=$(grep "^DB_PASSWORD=" "$ENV_FILE" | cut -d'=' -f2)
    if [ -z "$DB_PASS" ] || [ "$DB_PASS" = '""' ] || [ "$DB_PASS" = "''" ]; then
        echo -e "${RED}❌ ERRO: DB_PASSWORD está vazio no .env!${NC}"
        echo -e "${YELLOW}Corrija o arquivo: nano $ENV_FILE${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Arquivo .env validado (sem placeholders)${NC}"
    return 0
}

# Função 4: Testar conexão MySQL antes de subir servidor
test_mysql_connection() {
    echo -e "${YELLOW}🔍 Testando conexão MySQL...${NC}"
    
    if $MYSQL_ADMIN_CMD -e "SELECT 1;" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ MySQL conectado com sucesso${NC}"
        
        # Verificar databases
        local DB_MU=$($MYSQL_ADMIN_CMD -e "SHOW DATABASES LIKE 'muonline';" 2>/dev/null | grep muonline)
        local DB_WEB=$($MYSQL_ADMIN_CMD -e "SHOW DATABASES LIKE 'meuweb';" 2>/dev/null | grep meuweb)
        
        if [ -z "$DB_MU" ]; then
            echo -e "${RED}❌ Database 'muonline' não existe!${NC}"
            echo -e "${YELLOW}   Execute: CREATE DATABASE muonline;${NC}"
            return 1
        fi
        
        if [ -z "$DB_WEB" ]; then
            echo -e "${YELLOW}⚠️  Database 'meuweb' não existe, criando...${NC}"
            $MYSQL_ADMIN_CMD -e "CREATE DATABASE meuweb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
        fi
        
        echo -e "${GREEN}✅ Databases 'muonline' e 'meuweb' OK${NC}"
        return 0
    else
        echo -e "${RED}❌ Falha ao conectar no MySQL!${NC}"
        echo -e "${YELLOW}Verifique se o MySQL está rodando e a senha está correta${NC}"
        return 1
    fi
}

# Função 5: Criar usuário seguro 'webuser' no MySQL
create_mysql_webuser() {
    echo -e "${YELLOW}🔐 Criando usuário seguro 'webuser'...${NC}"
    
    # Verificar se arquivo SQL existe
    if [ ! -f "$BASE_DIR/backend-nodejs/database/00_create_webuser.sql" ]; then
        echo -e "${RED}❌ Arquivo SQL não encontrado!${NC}"
        return 1
    fi
    
    # Executar script SQL
    if $MYSQL_ADMIN_CMD < "$BASE_DIR/backend-nodejs/database/00_create_webuser.sql" 2>/dev/null; then
        echo -e "${GREEN}✅ Usuário 'webuser' criado com sucesso${NC}"
        echo -e "${CYAN}   Permissões:${NC}"
        echo -e "${CYAN}   - muonline: SELECT (READ-ONLY)${NC}"
        echo -e "${CYAN}   - meuweb: SELECT, INSERT, UPDATE, DELETE (READ+WRITE)${NC}"
        
        # Testar login com webuser
        if mysql -u $MYSQL_WEB_USER -p$MYSQL_WEB_PASS -e "SELECT 1;" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Login com webuser funcionando!${NC}"
            return 0
        else
            echo -e "${RED}❌ Usuário criado mas login falhou!${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  Erro ao criar usuário (pode já existir)${NC}"
        
        # Tentar login para verificar se já existe
        if mysql -u $MYSQL_WEB_USER -p$MYSQL_WEB_PASS -e "SELECT 1;" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Usuário 'webuser' já existe e está funcional${NC}"
            return 0
        else
            echo -e "${RED}❌ Usuário não existe e não foi possível criar!${NC}"
            return 1
        fi
    fi
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 1: INSTALAÇÃO COMPLETA (12 ETAPAS)
# ═══════════════════════════════════════════════════════════════
# NOVIDADE V562: Agora atualiza código do GitHub automaticamente!
# Etapa 0: Proteções de segurança (kill, port, mysql, webuser)
# Etapa 0.5: Git pull (atualiza código antes de buildar) ⬅️ NOVO!
# Etapa 1-11: Instalação completa
# Etapa 12: Limpeza final
# ═══════════════════════════════════════════════════════════════

instalacao_completa() {
    clear_screen
    echo -e "${BOLD}🚀 INSTALAÇÃO COMPLETA AUTOMÁTICA${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    # Etapa 0: PROTEÇÕES CRÍTICAS
    echo -e "${YELLOW}[0/12]${NC} 🛡️  EXECUTANDO PROTEÇÕES DE SEGURANÇA..."
    echo ""
    
    # Proteção 1: Matar TODOS os processos Node.js
    kill_all_node_processes
    echo ""
    
    # Proteção 2: Verificar se porta 3001 está livre
    if ! check_port_3001; then
        echo -e "${RED}❌ ERRO CRÍTICO: Não foi possível liberar porta 3001!${NC}"
        pause
        return 1
    fi
    echo ""
    
    # Proteção 3: Testar conexão MySQL ANTES de continuar
    if ! test_mysql_connection; then
        echo -e "${RED}❌ ERRO CRÍTICO: MySQL não está acessível!${NC}"
        pause
        return 1
    fi
    echo ""
    
    # Proteção 4: Criar usuário seguro 'webuser'
    if ! create_mysql_webuser; then
        echo -e "${YELLOW}⚠️  Usuário 'webuser' pode já existir, continuando...${NC}"
    fi
    echo ""
    
    echo -e "${GREEN}✅✅✅ TODAS AS PROTEÇÕES PASSARAM!${NC}"
    echo ""
    
    # Etapa 0.5: ATUALIZAR CÓDIGO DO GITHUB (CRÍTICO!)
    echo -e "${YELLOW}[0.5/12]${NC} 🔄 Atualizando código do GitHub..."
    echo ""
    
    # Verificar se é um repositório git
    if [ -d "$BASE_DIR/.git" ]; then
        echo -e "${CYAN}   📦 Repositório Git detectado${NC}"
        
        # Salvar arquivos críticos
        echo -e "${CYAN}   💾 Salvando arquivos críticos...${NC}"
        
        # Backup .env do backend
        if [ -f "$BASE_DIR/backend-nodejs/.env" ]; then
            cp "$BASE_DIR/backend-nodejs/.env" "/tmp/meumu-env-backup" 2>/dev/null
            echo -e "${GREEN}      ✅ Backend .env salvo${NC}"
        fi
        
        # Backup .env do frontend
        if [ -f "$BASE_DIR/.env" ]; then
            cp "$BASE_DIR/.env" "/tmp/meumu-frontend-env-backup" 2>/dev/null
            echo -e "${GREEN}      ✅ Frontend .env salvo${NC}"
        fi
        
        # Fazer git pull
        echo -e "${CYAN}   🔄 Executando git pull...${NC}"
        cd "$BASE_DIR" || exit 1
        
        # Resetar mudanças locais e puxar versão mais recente
        git reset --hard HEAD > /dev/null 2>&1
        git pull origin main 2>&1 | grep -E "(Already|Updating|Fast-forward|files changed)" || echo "   Git pull executado"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}   ✅ Código atualizado do GitHub${NC}"
            
            # Restaurar .env do backend
            if [ -f "/tmp/meumu-env-backup" ]; then
                cp "/tmp/meumu-env-backup" "$BASE_DIR/backend-nodejs/.env" 2>/dev/null
                rm "/tmp/meumu-env-backup" 2>/dev/null
                echo -e "${GREEN}   ✅ Backend .env restaurado${NC}"
            fi
            
            # Restaurar .env do frontend
            if [ -f "/tmp/meumu-frontend-env-backup" ]; then
                cp "/tmp/meumu-frontend-env-backup" "$BASE_DIR/.env" 2>/dev/null
                rm "/tmp/meumu-frontend-env-backup" 2>/dev/null
                echo -e "${GREEN}   ✅ Frontend .env restaurado${NC}"
            fi
        else
            echo -e "${YELLOW}   ⚠️  Git pull falhou, continuando com código atual${NC}"
        fi
    else
        echo -e "${YELLOW}   ⚠️  Não é um repositório Git (pulando atualização)${NC}"
        echo -e "${CYAN}   💡 Para versão fresh, use opção 10 do menu${NC}"
    fi
    
    echo ""
    
    # Etapa 1: Verificar MySQL
    echo -e "${YELLOW}[1/12]${NC} Verificando MySQL..."
    if $MYSQL_ADMIN_CMD -e "SHOW DATABASES;" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ MySQL rodando e acessível${NC}"
        
        DB_MU=$($MYSQL_ADMIN_CMD -e "SHOW DATABASES LIKE 'muonline';" 2>/dev/null | grep muonline)
        DB_WEB=$($MYSQL_ADMIN_CMD -e "SHOW DATABASES LIKE 'meuweb';" 2>/dev/null | grep meuweb)
        
        if [ -z "$DB_MU" ]; then
            echo -e "${RED}❌ Database 'muonline' não existe!${NC}"
            echo -e "${YELLOW}   Execute: CREATE DATABASE muonline;${NC}"
            pause
            return 1
        fi
        
        if [ -z "$DB_WEB" ]; then
            echo -e "${YELLOW}⚠️  Criando database 'meuweb'...${NC}"
            $MYSQL_ADMIN_CMD -e "CREATE DATABASE meuweb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
        fi
        echo -e "${GREEN}   ✅ Databases OK${NC}"
    else
        echo -e "${RED}❌ MySQL não acessível!${NC}"
        pause
        return 1
    fi
    
    # Etapa 2: Instalar dependências do frontend
    echo ""
    echo -e "${YELLOW}[2/12]${NC} Instalando dependências do frontend..."
    cd "$BASE_DIR" || exit 1
    
    # 🔧 VERIFICAÇÃO CRÍTICA: Apagar node_modules antigo
    if [ -d "node_modules" ]; then
        echo -e "${YELLOW}   ⚠️  Removendo node_modules antigo...${NC}"
        rm -rf node_modules
    fi
    
    # Mostrar progresso (SEM > /dev/null para debug)
    echo -e "${CYAN}   Instalando pacotes (pode demorar 1-2 minutos)...${NC}"
    if npm install --no-scripts 2>&1 | grep -E "(added|removed|changed|audited)" | tail -1; then
        echo -e "${GREEN}✅ Dependências do frontend instaladas${NC}"
        
        # 🔧 VERIFICAR se node_modules foi criado
        if [ ! -d "node_modules" ]; then
            echo -e "${RED}❌ ERRO: node_modules não foi criado!${NC}"
            pause
            return 1
        fi
        
        # 🔧 VERIFICAR se Vite está instalado
        if [ ! -f "node_modules/.bin/vite" ]; then
            echo -e "${RED}❌ ERRO: Vite não foi instalado!${NC}"
            echo -e "${YELLOW}   Tentando npm install novamente (sem --no-scripts)...${NC}"
            npm install 2>&1 | tail -5
        fi
        
        echo -e "${GREEN}   ✅ node_modules OK ($(du -sh node_modules 2>/dev/null | cut -f1))${NC}"
    else
        echo -e "${RED}❌ Falha ao instalar dependências do frontend${NC}"
        echo -e "${YELLOW}   Tentando novamente SEM --no-scripts...${NC}"
        if npm install 2>&1 | tail -10; then
            echo -e "${GREEN}✅ Sucesso na segunda tentativa${NC}"
        else
            pause
            return 1
        fi
    fi
    
    # Etapa 3: Instalar dependências do backend
    echo ""
    echo -e "${YELLOW}[3/12]${NC} Instalando dependências do backend..."
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
    echo -e "${YELLOW}[4/12]${NC} Configurando .env..."
    configurar_env_interno
    
    # Etapa 4.5: Executar migrations do banco de dados
    echo ""
    echo -e "${YELLOW}[4.5/12]${NC} Executando migrations do banco..."
    cd "$BASE_DIR/backend-nodejs/migrations" || exit 1
    
    # Executar migration 003 (site_config)
    if [ -f "003-create-site-config.sql" ]; then
        echo -e "${CYAN}   📋 Executando migration: 003-create-site-config.sql${NC}"
        if $MYSQL_ADMIN_CMD meuweb < 003-create-site-config.sql > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Migration executada: Tabela site_config criada${NC}"
        else
            # Pode já existir, verificar
            if $MYSQL_ADMIN_CMD -e "SHOW TABLES FROM meuweb LIKE 'site_config';" | grep -q "site_config"; then
                echo -e "${YELLOW}⚠️  Tabela site_config já existe (OK)${NC}"
            else
                echo -e "${RED}❌ Erro ao executar migration 003${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}⚠️  Migration 003 não encontrada (pode já estar aplicada)${NC}"
    fi
    
    # Executar migration 004 (plugins)
    if [ -f "004-create-plugins.sql" ]; then
        echo -e "${CYAN}   📋 Executando migration: 004-create-plugins.sql${NC}"
        if $MYSQL_ADMIN_CMD meuweb < 004-create-plugins.sql > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Migration executada: Tabela plugins criada${NC}"
        else
            # Pode já existir, verificar
            if $MYSQL_ADMIN_CMD -e "SHOW TABLES FROM meuweb LIKE 'plugins';" | grep -q "plugins"; then
                echo -e "${YELLOW}⚠️  Tabela plugins já existe (OK)${NC}"
            else
                echo -e "${RED}❌ Erro ao executar migration 004${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}⚠️  Migration 004 não encontrada (pode já estar aplicada)${NC}"
    fi
    
    cd "$BASE_DIR" || exit 1
    
    # Etapa 5: Buildar frontend
    echo ""
    echo -e "${YELLOW}[5/12]${NC} Buildando frontend..."
    cd "$BASE_DIR" || exit 1
    
    # Garantir que o .env existe
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  Criando .env do frontend...${NC}"
        cat > .env << 'EOF'
# ══════════��════════════════════════════════════════════════════
# MEUMU ONLINE - CONFIGURAÇÃO DO FRONTEND (HTTPS)
# ══════════════════════════════════════════════════════════════

# URL da API Backend (através do proxy OpenLiteSpeed)
# ⚠️  IMPORTANTE: Usar URL RELATIVA para funcionar com HTTPS!
# 
# ✅ CORRETO: /api (URL relativa - usa protocolo do site)
# ❌ ERRADO: http://meumu.com:3001/api (Mixed Content!)
# 
# Com URL relativa (/api):
# - Navegador usa HTTPS automaticamente
# - OpenLiteSpeed proxy redireciona para porta 3001
# - Sem erro de Mixed Content
# - Cadeado verde no navegador
#
VITE_API_URL=/api
EOF
        echo -e "${GREEN}✅ .env do frontend criado (HTTPS pronto)${NC}"
    else
        # Verificar e corrigir .env para URL relativa
        if grep -q "VITE_API_URL=http" ".env" 2>/dev/null; then
            echo -e "${YELLOW}  .env do frontend tem URL absoluta! Corrigindo para URL relativa...${NC}"
            sed -i 's|VITE_API_URL=.*|VITE_API_URL=/api|g' .env
            echo -e "${GREEN}✅ .env corrigido (URL relativa para HTTPS)${NC}"
        elif ! grep -q "VITE_API_URL" ".env" 2>/dev/null; then
            echo -e "${YELLOW}⚠️  Adicionando VITE_API_URL ao .env...${NC}"
            echo "VITE_API_URL=/api" >> .env
            echo -e "${GREEN}✅ VITE_API_URL adicionada${NC}"
        else
            echo -e "${GREEN}✅ .env do frontend já está correto${NC}"
        fi
    fi
    
    if [ -d "dist" ]; then
        mv dist "dist.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null
    fi
    
    echo -e "${CYAN}   🔨 Buildando frontend (1-3 minutos)...${NC}"
    echo ""
    
    # 🔧 VERIFICAR ANTES DE BUILDAR
    if [ ! -d "node_modules" ]; then
        echo -e "${RED}❌ ERRO CRÍTICO: node_modules não existe!${NC}"
        echo -e "${YELLOW}   Execute npm install primeiro${NC}"
        pause
        return 1
    fi
    
    if [ ! -f "node_modules/.bin/vite" ]; then
        echo -e "${RED}❌ ERRO CRÍTICO: Vite não está instalado!${NC}"
        echo -e "${YELLOW}   Instalando Vite...${NC}"
        npm install vite @vitejs/plugin-react --save-dev
    fi
    
    # Remover dist antigo
    if [ -d "dist" ]; then
        echo -e "${YELLOW}   📦 Removendo build antigo...${NC}"
        mv dist "dist.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null
    fi
    
    # BUILDAR (mostrar progresso)
    if npm run build 2>&1 | tee /tmp/build.log | grep -E "(built|dist|error|failed)"; then
        echo ""
        
        # 🔧 VERIFICAR SE DIST FOI CRIADO
        if [ ! -d "dist" ]; then
            echo -e "${RED}❌ ERRO: Pasta dist/ NÃO foi criada!${NC}"
            echo -e "${YELLOW}   Veja o log completo: cat /tmp/build.log${NC}"
            pause
            return 1
        fi
        
        # 🔧 VERIFICAR SE TEM ARQUIVOS .JS
        JS_COUNT=$(find dist/assets -name "*.js" 2>/dev/null | wc -l)
        if [ "$JS_COUNT" -eq 0 ]; then
            echo -e "${RED}❌ ERRO: Nenhum arquivo .js foi gerado!${NC}"
            pause
            return 1
        fi
        
        # 🔧 VERIFICAR SE TEM index.html
        if [ ! -f "dist/index.html" ]; then
            echo -e "${RED}❌ ERRO: index.html não foi gerado!${NC}"
            pause
            return 1
        fi
        
        echo -e "${GREEN}✅ Frontend buildado com sucesso!${NC}"
        echo -e "${GREEN}   📁 Arquivos gerados:${NC}"
        echo -e "${CYAN}      - index.html: $(ls -lh dist/index.html 2>/dev/null | awk '{print $5}')${NC}"
        echo -e "${CYAN}      - JS files: $JS_COUNT arquivos${NC}"
        echo -e "${CYAN}      - Tamanho total: $(du -sh dist 2>/dev/null | cut -f1)${NC}"
    else
        echo ""
        echo -e "${RED}❌ Falha ao buildar frontend!${NC}"
        echo -e "${YELLOW}   Veja o log: cat /tmp/build.log${NC}"
        cat /tmp/build.log
        pause
        return 1
    fi
    
    # Etapa 6: Criar estrutura do banco meuweb
    echo ""
    echo -e "${YELLOW}[6/12]${NC} Criando estrutura do banco 'meuweb'..."
    
    # Verificar se pasta de database existe
    if [ ! -d "$BASE_DIR/backend-nodejs/database" ]; then
        echo -e "${RED}❌ Pasta database não encontrada!${NC}"
        pause
        return 1
    fi
    
    # Contar quantos arquivos SQL existem
    SQL_COUNT=$(ls -1 "$BASE_DIR/backend-nodejs/database/"*.sql 2>/dev/null | wc -l)
    echo -e "${CYAN}   📄 Encontrados $SQL_COUNT scripts SQL${NC}"
    
    # Executar scripts SQL numerados em ordem
    SQL_SUCCESS=0
    SQL_FAILED=0
    
    for sql_file in "$BASE_DIR/backend-nodejs/database"/*.sql; do
        if [ -f "$sql_file" ]; then
            filename=$(basename "$sql_file")
            echo -e "${CYAN}   → Executando $filename...${NC}"
            
            # Executar SQL e capturar erros
            if $MYSQL_ADMIN_CMD meuweb < "$sql_file" 2>/tmp/sql_error.log; then
                echo -e "${GREEN}      ✅ $filename executado${NC}"
                SQL_SUCCESS=$((SQL_SUCCESS + 1))
            else
                # Verificar se erro é de tabela já existir (não é erro crítico)
                if grep -q "already exists" /tmp/sql_error.log 2>/dev/null; then
                    echo -e "${YELLOW}      ⚠️  $filename: tabela já existe (OK)${NC}"
                    SQL_SUCCESS=$((SQL_SUCCESS + 1))
                else
                    echo -e "${RED}      ❌ Erro em $filename${NC}"
                    cat /tmp/sql_error.log
                    SQL_FAILED=$((SQL_FAILED + 1))
                fi
            fi
        fi
    done
    
    echo ""
    echo -e "${GREEN}✅ Estrutura do meuweb criada!${NC}"
    echo -e "${CYAN}   Sucesso: $SQL_SUCCESS | Falhas: $SQL_FAILED${NC}"
    
    # Verificar tabelas criadas
    TABLES=$($MYSQL_ADMIN_CMD -e "SHOW TABLES FROM meuweb;" 2>/dev/null | tail -n +2)
    if [ -n "$TABLES" ]; then
        echo -e "${GREEN}   📊 Tabelas criadas:${NC}"
        echo "$TABLES" | while read table; do
            ROW_COUNT=$($MYSQL_ADMIN_CMD -e "SELECT COUNT(*) FROM meuweb.$table;" 2>/dev/null | tail -1)
            echo -e "${CYAN}      - $table: $ROW_COUNT registros${NC}"
        done
    else
        echo -e "${YELLOW}   ⚠️  Nenhuma tabela encontrada (primeira instalação?)${NC}"
    fi
    
    # Etapa 7: Configurar LiteSpeed Proxy Reverso
    echo ""
    echo -e "${YELLOW}[7/12]${NC} Configurando OpenLiteSpeed Proxy Reverso..."
    configurar_litespeed_interno
    
    # Etapa 8: Parar processos antigos
    echo ""
    echo -e "${YELLOW}[8/12]${NC} Parando processos Node.js antigos..."
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f "nodemon.*server.js" 2>/dev/null
    sleep 2
    echo -e "${GREEN}✅ Processos antigos encerrados${NC}"
    
    # Etapa 8.5: Normalizar middleware (CRÍTICO V516)
    echo ""
    echo -e "${YELLOW}[8.5/12]${NC} 🔧 Normalizando estrutura de middleware..."
    
    MIDDLEWARE_DIR="$BASE_DIR/backend-nodejs/src/middleware"
    
    if [ -f "$MIDDLEWARE_DIR/auth.js" ]; then
        echo -e "${GREEN}✅ auth.js já existe${NC}"
    elif [ -f "$MIDDLEWARE_DIR/auth-middleware.js" ]; then
        echo -e "${YELLOW}⚠️  auth.js não encontrado, criando symlink para auth-middleware.js${NC}"
        cd "$MIDDLEWARE_DIR" || exit 1
        ln -sf auth-middleware.js auth.js
        echo -e "${GREEN}✅ Symlink auth.js → auth-middleware.js criado${NC}"
        cd "$BASE_DIR" || exit 1
    else
        echo -e "${RED}❌ ERRO CRÍTICO: Nenhum middleware de autenticação encontrado!${NC}"
        echo -e "${YELLOW}   Esperado: auth.js OU auth-middleware.js${NC}"
        echo -e "${YELLOW}   Verifique: ls -la $MIDDLEWARE_DIR${NC}"
        pause
        return 1
    fi
    
    # Etapa 9: Iniciar servidor
    echo ""
    echo -e "${YELLOW}[9/12]${NC} Iniciando servidor..."
    
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
    
    # Etapa 10: Testar servidor (porta 3001 direta)
    echo ""
    echo -e "${YELLOW}[10/12]${NC} Testando servidor (porta 3001)..."
    HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Servidor backend respondendo!${NC}"
    else
        echo -e "${RED}❌ Servidor não está respondendo${NC}"
        echo -e "${YELLOW}Verifique os logs: tail -f backend-nodejs/logs/server.log${NC}"
        pause
        return 1
    fi
    
    # Etapa 11: Testar proxy HTTPS (se LiteSpeed configurado)
    echo ""
    echo -e "${YELLOW}[11/12]${NC} Testando proxy HTTPS..."
    HTTPS_HEALTH=$(curl -s -k https://meumu.com/api/health 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Proxy reverso HTTPS funcionando!${NC}"
        HTTPS_OK=true
    else
        echo -e "${YELLOW}⚠️  Proxy HTTPS não configurado (use opção 11 do menu)${NC}"
        HTTPS_OK=false
    fi
    
    # Etapa 12: Limpeza final
    echo ""
    echo -e "${YELLOW}[12/12]${NC} 🧹 Limpeza final..."
    
    # Remover backups temporários do git pull
    rm -f /tmp/meumu-env-backup 2>/dev/null
    rm -f /tmp/meumu-frontend-env-backup 2>/dev/null
    
    # Remover logs de build temporários
    rm -f /tmp/build.log 2>/dev/null
    rm -f /tmp/sql_error.log 2>/dev/null
    
    echo -e "${GREEN}✅ Arquivos temporários removidos${NC}"
    
    echo ""
    echo -e "${GREEN}══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅✅✅ INSTALAÇÃO COMPLETA COM SUCESSO! ✅✅✅${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BOLD}🌐 ACESSE O SITE:${NC}"
    echo ""
    if [ "$HTTPS_OK" = true ]; then
        echo -e "   ${GREEN}🔒 HTTPS (Recomendado):${NC}"
        echo -e "   ${BLUE}https://meumu.com${NC}"
        echo ""
        echo -e "   ${CYAN}🔓 HTTP (Desenvolvimento):${NC}"
        echo -e "   ${BLUE}http://meumu.com:3001${NC}"
    else
        echo -e "   ${BLUE}http://meumu.com:3001${NC}"
        echo ""
        echo -e "   ${YELLOW}💡 Para ativar HTTPS, execute opção 11 do menu${NC}"
    fi
    echo ""
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 2: INSTALAR DEPENDÊNCIAS
# ═══════════════════════════════════════════════════════════════

instalar_dependencias() {
    clear_screen
    echo -e "${BOLD} INSTALAÇÃO DE DEPENDÊNCIAS${NC}"
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
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ══════════════════════════════════════════════════════════════
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
# ═════════════════════════════════════════════════════════════
# MEUMU ONLINE - CONFIGURAÇÃO DE PRODUÇÃO (HTTPS)
# ═══════════════════════════════════════════════════════════════

# SEGURANÇA - JWT (ALTERAR EM PRODUÇÃO!)
JWT_SECRET=mEuMu_OnL1nE_jWt_K3y_2o24_pr0ducT10n_4a8b9c7d2e5f6g1h3i

# DATABASE PRINCIPAL (Host, User, Password compartilhados)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=webuser
DB_PASSWORD=@meusite123@

# DATABASES (Nomes)
DB_NAME_MUONLINE=muonline
DB_NAME_MEUWEB=meuweb
DB_NAME_WEBMU=meuweb

# DATABASE MUONLINE (Servidor MU - Read Only) - Compatibilidade
DB_MU_HOST=127.0.0.1
DB_MU_PORT=3306
DB_MU_USER=webuser
DB_MU_PASSWORD=@meusite123@
DB_MU_NAME=muonline

# DATABASE MEUWEB (Website - Read + Write) - Compatibilidade
DB_WEB_HOST=127.0.0.1
DB_WEB_PORT=3306
DB_WEB_USER=webuser
DB_WEB_PASSWORD=@meusite123@
DB_WEB_NAME=meuweb

# SERVIDOR
PORT=3001
FRONTEND_URL=https://meumu.com

# POOL DE CONEXÕES
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# RATE LIMITING (VALORES AUMENTADOS PARA PRODUÇÃO)
# ⚠️  IMPORTANTE: Rate limit aumentado para evitar bloqueios durante uso normal
RATE_LIMIT_AUTH_WINDOW=15
RATE_LIMIT_AUTH_MAX=20
RATE_LIMIT_API_WINDOW=1
RATE_LIMIT_API_MAX=500
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=500

# LOGS E AUDITORIA
LOG_LEVEL=info
ENABLE_AUDIT_LOG=true
ENABLE_SECURITY_ALERTS=true

# AMBIENTE (production = HTTPS pronto)
NODE_ENV=production

# SEGURANÇA - CORS (PERMITIR HTTPS E HTTP)
# ⚠️  IMPORTANTE: Permitir tanto HTTPS (produção) quanto HTTP (desenvolvimento)
ALLOWED_ORIGINS=https://meumu.com,http://meumu.com,http://meumu.com:3001,https://meumu.com:3001

# SESSION
SESSION_SECRET=mEuMu_s3ss10n_k3y_7x9y2z4a6b8c
EOF
        cp "$BASE_DIR/backend-nodejs/.env.production" "$BASE_DIR/backend-nodejs/.env"
        echo -e "${GREEN}✅ .env criado e configurado${NC}"
    fi
}

configurar_env() {
    clear_screen
    echo -e "${BOLD}⚙️  CONFIGURAÇÃO DO .ENV${NC}"
    echo "═══════════════════════════════════════════════════════════"
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
# ══════════════════════��════════════════════════════════════════

build_frontend() {
    clear_screen
    echo -e "${BOLD}🏗️  BUILD DO FRONTEND${NC}"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    
    cd "$BASE_DIR" || exit 1
    
    # Garantir que o .env existe
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  Criando .env do frontend...${NC}"
        cat > .env << 'EOF'
# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - CONFIGURAÇÃO DO FRONTEND (HTTPS)
# ══════════════════════════════════════════════════════════════

# URL da API Backend (através do proxy OpenLiteSpeed)
# ⚠️  IMPORTANTE: Usar URL RELATIVA para funcionar com HTTPS!
# 
# ✅ CORRETO: /api (URL relativa - usa protocolo do site)
# ❌ ERRADO: http://meumu.com:3001/api (Mixed Content!)
# 
# Com URL relativa (/api):
# - Navegador usa HTTPS automaticamente
# - OpenLiteSpeed proxy redireciona para porta 3001
# - Sem erro de Mixed Content
# - Cadeado verde no navegador
#
VITE_API_URL=/api
EOF
        echo -e "${GREEN}✅ .env do frontend criado (HTTPS pronto)${NC}"
    else
        # Verificar e corrigir .env para URL relativa
        if grep -q "VITE_API_URL=http" ".env" 2>/dev/null; then
            echo -e "${YELLOW}⚠️  .env do frontend tem URL absoluta! Corrigindo para URL relativa...${NC}"
            sed -i 's|VITE_API_URL=.*|VITE_API_URL=/api|g' .env
            echo -e "${GREEN}✅ .env corrigido (URL relativa para HTTPS)${NC}"
        elif ! grep -q "VITE_API_URL" ".env" 2>/dev/null; then
            echo -e "${YELLOW}⚠️  Adicionando VITE_API_URL ao .env...${NC}"
            echo "VITE_API_URL=/api" >> .env
            echo -e "${GREEN}✅ VITE_API_URL adicionada${NC}"
        else
            echo -e "${GREEN}✅ .env do frontend já está correto${NC}"
        fi
    fi
    
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
# ══════════════════════════════════════════════════════════════

reiniciar_servidor() {
    clear_screen
    echo -e "${BOLD}🔄 REINICIAR SERVIDOR NODE.JS${NC}"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    
    # Proteção 1: Matar TODOS os processos
    echo -e "${YELLOW}[1/6]${NC} 🛡️  Matando TODOS os processos Node.js..."
    kill_all_node_processes
    echo ""
    
    # Proteção 2: Verificar porta 3001
    echo -e "${YELLOW}[2/6]${NC} 🔍 Verificando se porta 3001 está livre..."
    if ! check_port_3001; then
        echo -e "${RED}❌ ERRO: Não foi possível liberar porta 3001!${NC}"
        pause
        return 1
    fi
    echo ""
    
    # Proteção 3: Validar .env
    echo -e "${YELLOW}[3/6]${NC} 🔍 Validando arquivo .env..."
    if ! validate_env_file; then
        echo -e "${RED}❌ ERRO: Arquivo .env inválido!${NC}"
        pause
        return 1
    fi
    echo ""
    
    # Proteção 4: Testar MySQL
    echo -e "${YELLOW}[4/6]${NC} 🔍 Testando conexão MySQL..."
    if ! test_mysql_connection; then
        echo -e "${RED}❌ ERRO: MySQL não está acessível!${NC}"
        pause
        return 1
    fi
    echo ""
    
    echo -e "${GREEN}✅ TODAS AS PROTEÇÕES PASSARAM!${NC}"
    echo ""
    
    echo -e "${YELLOW}[5/6]${NC} Criando diretórios de logs..."
    mkdir -p "$BASE_DIR/backend-nodejs/logs/alerts" 2>/dev/null
    mkdir -p "$BASE_DIR/backend-nodejs/logs/audit" 2>/dev/null
    mkdir -p "$BASE_DIR/backend-nodejs/logs/security" 2>/dev/null
    echo -e "${GREEN}✅ Diretórios criados${NC}"
    
    echo ""
    echo -e "${YELLOW}[6/6]${NC} Iniciando servidor..."
    
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
    
    # Aguardar e testar
    echo ""
    echo -e "${CYAN}⏳ Aguardando servidor inicializar (5 segundos)...${NC}"
    sleep 5
    
    HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Servidor respondendo!${NC}"
    else
        echo -e "${RED}❌ Servidor não está respondendo${NC}"
        echo -e "${YELLOW}Verifique os logs: tail -f backend-nodejs/logs/server.log${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ Servidor reiniciado!${NC}"
    echo -e "${GREEN}══════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ══════════════════════════════════════════════════════���═══════
# FUNÇÃO 6: VERIFICAR MYSQL
# ═══════════════════════════════════════════════════════════════

verificar_mysql() {
    clear_screen
    echo -e "${BOLD}🔍 VERIFICAÇÃO DO MYSQL${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    if $MYSQL_ADMIN_CMD -e "SHOW DATABASES;" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ MySQL está rodando e acessível${NC}"
        echo ""
        
        echo -e "${BOLD}Databases disponíveis:${NC}"
        $MYSQL_ADMIN_CMD -e "SHOW DATABASES;" 2>/dev/null
        
        echo ""
        DB_MU=$($MYSQL_ADMIN_CMD -e "SHOW DATABASES LIKE 'muonline';" 2>/dev/null | grep muonline)
        DB_WEB=$($MYSQL_ADMIN_CMD -e "SHOW DATABASES LIKE 'meuweb';" 2>/dev/null | grep meuweb)
        
        if [ -n "$DB_MU" ]; then
            echo -e "${GREEN}✅ Database 'muonline' existe${NC}"
        else
            echo -e "${RED}❌ Database 'muonline' NÃO existe${NC}"
        fi
        
        if [ -n "$DB_WEB" ]; then
            echo -e "${GREEN}✅ Database 'meuweb' existe${NC}"
        else
            echo -e "${RED}❌ Database 'meuweb' NÃO existe${NC}"
        fi
    else
        echo -e "${RED}❌ MySQL não está acessível!${NC}"
        echo -e "${YELLOW}Verifique a senha: @mysql123@${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ════��═══════════════════════════��═════════════════════════════
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
        echo -e "${GREEN} Porta 3001 está em uso (Servidor rodando)${NC}"
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

# ══════════════════════��════════════════════════════════════════
# FUNÇÃO 8: HEALTH CHECK
# ═══════════════════════════════════════════════════════════════

health_check() {
    clear_screen
    echo -e "${BOLD}💚 HEALTH CHECK${NC}"
    echo "═════════════════════════════════════════════════════════"
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
    echo -e "${GREEN}══════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 9: VER LOGS
# ══════════════════════════════════════════════════════════════

ver_logs() {
    clear_screen
    echo -e "${BOLD}📋 LOGS DO SERVIDOR${NC}"
    echo "═══════════════════════════════════════════════════════════"
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
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}Para ver logs em tempo real: tail -f backend-nodejs/logs/server.log${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇO 10: ATUALIZAR DO GITHUB
# ══════════════════════════════════════════════════════════════

atualizar_github() {
    clear_screen
    echo -e "${BOLD}🔄 ATUALIZAR DO GITHUB${NC}"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo -e "${RED}⚠️  ATENÇÃO: Esta operação irá:${NC}"
    echo -e "${RED}   • Apagar TODOS os arquivos do diretório atual${NC}"
    echo -e "${RED}   • Baixar versão fresh do GitHub${NC}"
    echo -e "${RED}   • Substituir TUDO (inclusive configurações locais)${NC}"
    echo ""
    echo -e "${YELLOW}Diretório: $BASE_DIR${NC}"
    echo -e "${YELLOW}Repositório: https://github.com/livefgs-ux/Muonlinewebsitedesign${NC}"
    echo ""
    echo -e "${BOLD}Tem certeza que deseja continuar? (S/n): ${NC}"
    read -r confirmacao
    
    if [[ ! "$confirmacao" =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}❌ Operação cancelada!${NC}"
        pause
        return 0
    fi
    
    echo ""
    echo -e "${YELLOW}[1/7]${NC} Parando servidor Node.js..."
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f "nodemon.*server.js" 2>/dev/null
    if command -v pm2 &> /dev/null; then
        pm2 delete meumu-backend 2>/dev/null || true
    fi
    sleep 2
    echo -e "${GREEN}✅ Servidor parado${NC}"
    
    echo ""
    echo -e "${YELLOW}[2/7]${NC} Removendo arquivos antigos..."
    cd /home/meumu.com || exit 1
    
    # Remover tudo do public_html (arquivos normais e ocultos)
    rm -rf /home/meumu.com/public_html/{*,.[!.]*}
    
    echo -e "${GREEN}✅ Arquivos removidos${NC}"
    
    echo ""
    echo -e "${YELLOW}[3/7]${NC} Clonando repositório do GitHub..."
    cd "$BASE_DIR" || exit 1
    
    if git clone https://github.com/livefgs-ux/Muonlinewebsitedesign.git . 2>&1; then
        echo -e "${GREEN}✅ Repositório clonado com sucesso${NC}"
    else
        echo -e "${RED}❌ Falha ao clonar repositório!${NC}"
        echo -e "${YELLOW}Verifique sua conexão com a internet${NC}"
        pause
        return 1
    fi
    
    echo ""
    echo -e "${YELLOW}[4/7]${NC} 🔐 Ajustando permissões (CRÍTICO para MIME types)..."
    
    # Obter usuário atual
    CURRENT_USER=$(whoami)
    
    # Ajustar dono dos arquivos (usuário:cyberpanel)
    echo -e "${CYAN}   Ajustando proprietário para $CURRENT_USER:$WEB_GROUP...${NC}"
    chown -R "$CURRENT_USER:$WEB_GROUP" "$BASE_DIR" 2>/dev/null || \
    sudo chown -R "$CURRENT_USER:$WEB_GROUP" "$BASE_DIR"
    
    # Diretórios: 755 (rwxr-xr-x) - Servidor web precisa entrar e ler
    echo -e "${CYAN}   Diretórios → 755 (rwxr-xr-x)...${NC}"
    find "$BASE_DIR" -type d -exec chmod 755 {} \; 2>/dev/null || \
    sudo find "$BASE_DIR" -type d -exec chmod 755 {} \;
    
    # Arquivos: 644 (rw-r--r--) - Servidor web precisa ler
    echo -e "${CYAN}   Arquivos → 644 (rw-r--r--)...${NC}"
    find "$BASE_DIR" -type f -exec chmod 644 {} \; 2>/dev/null || \
    sudo find "$BASE_DIR" -type f -exec chmod 644 {} \;
    
    # Scripts .sh precisam ser executáveis: 755
    echo -e "${CYAN}   Scripts .sh → 755 (executáveis)...${NC}"
    find "$BASE_DIR" -type f -name "*.sh" -exec chmod 755 {} \; 2>/dev/null || \
    sudo find "$BASE_DIR" -type f -name "*.sh" -exec chmod 755 {} \;
    
    echo -e "${GREEN}✅ Permissões ajustadas corretamente${NC}"
    echo -e "${CYAN}   Proprietário: $CURRENT_USER:$WEB_GROUP${NC}"
    echo -e "${CYAN}   Diretórios: 755 (servidor web pode ler)${NC}"
    echo -e "${CYAN}   Arquivos: 644 (servidor web pode ler)${NC}"
    echo -e "${CYAN}   Scripts .sh: 755 (executáveis)${NC}"
    
    echo ""
    echo -e "${YELLOW}[5/7]${NC} Verificando estrutura de arquivos..."
    if [ -f "$BASE_DIR/package.json" ] && [ -f "$BASE_DIR/vite.config.ts" ]; then
        echo -e "${GREEN}✅ Projeto Vite/React detectado${NC}"
    else
        echo -e "${RED}❌ Estrutura do projeto não reconhecida!${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}[6/7]${NC} Verificando backend..."
    if [ -d "$BASE_DIR/backend-nodejs" ] && [ -f "$BASE_DIR/backend-nodejs/package.json" ]; then
        echo -e "${GREEN}✅ Backend Node.js detectado${NC}"
    else
        echo -e "${RED}❌ Backend não encontrado!${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}[7/7]${NC} Verificando permissões finais..."
    ls -la "$BASE_DIR" | head -10
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ Atualização do GitHub concluída!${NC}"
    echo -e "${GREEN}══��═════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BOLD}${CYAN}📋 PRÓXIMOS PASSOS OBRIGATÓRIOS:${NC}"
    echo ""
    echo -e "${YELLOW}   1) ${BOLD}Execute opção 1 (Instalação Completa)${NC}"
    echo -e "${CYAN}      → Instala dependências (npm install)${NC}"
    echo -e "${CYAN}      → Builda frontend (npm run build)${NC}"
    echo -e "${CYAN}      → Configura .env${NC}"
    echo -e "${CYAN}      → Inicia servidor${NC}"
    echo ""
    echo -e "${RED}   ⚠️  SEM npm run build → Erro MIME type!${NC}"
    echo -e "${RED}      Arquivos .tsx não rodam direto no navegador${NC}"
    echo ""
    
    pause
}

# ═══════════════════════════════════════════════════════════════
# FUNÇÃO 11: CONFIGURAR NGINX PROXY REVERSO
# ══════════════════════��════════════════════════════════════════

configurar_litespeed_proxy() {
    clear_screen
    echo -e "${BOLD}🔧 CONFIGURAR LITESPEED PROXY REVERSO (CYBERPANEL)${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo -e "${CYAN}Este assistente irá configurar o LiteSpeed como proxy reverso${NC}"
    echo -e "${CYAN}para o backend Node.js (compat��vel com CyberPanel).${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  ATENÇÃO: ${NC}"
    echo -e "${YELLOW}   • Você está usando CyberPanel + OpenLiteSpeed${NC}"
    echo -e "${YELLOW}   • NÃO use Nginx (incompatível com CyberPanel)${NC}"
    echo -e "${YELLOW}   • Você precisa de acesso root (sudo)${NC}"
    echo ""
    echo ""
    read -r -p "$(echo -e ${BOLD}Deseja continuar? '(S/n): '${NC})" confirmacao
    
    if [[ ! "$confirmacao" =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}❌ Operação cancelada!${NC}"
        pause
        return 0
    fi
    
    echo ""
    echo -e "${YELLOW}Verificando permissões...${NC}"
    
    if [ "$EUID" -eq 0 ]; then
        # Rodando como root
        echo -e "${GREEN}✅ Permissões root detectadas${NC}"
        bash "$BASE_DIR/setup-litespeed-proxy.sh"
    elif sudo -n true 2>/dev/null; then
        # Pode usar sudo sem senha
        echo -e "${GREEN}✅ Sudo sem senha detectado${NC}"
        sudo bash "$BASE_DIR/setup-litespeed-proxy.sh"
    else
        # Precisa de senha
        echo -e "${YELLOW}🔐 Digite a senha do sudo:${NC}"
        sudo bash "$BASE_DIR/setup-litespeed-proxy.sh"
    fi
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}✅ Proxy reverso configurado!${NC}"
        echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
        echo ""
        echo -e "${BOLD}${CYAN}📋 PRÓXIMOS PASSOS:${NC}"
        echo ""
        echo -e "${YELLOW}1) Configure o backend para produção:${NC}"
        echo -e "${CYAN}   cd backend-nodejs${NC}"
        echo -e "${CYAN}   cp .env.production .env${NC}"
        echo -e "${CYAN}   nano .env (verificar NODE_ENV=production)${NC}"
        echo ""
        echo -e "${YELLOW}2) Configure o frontend:${NC}"
        echo -e "${CYAN}   cd ..${NC}"
        echo -e "${CYAN}   echo 'VITE_API_URL=https://meumu.com/api' > .env${NC}"
        echo ""
        echo -e "${YELLOW}3) Rebuild frontend:${NC}"
        echo -e "${CYAN}   npm run build${NC}"
        echo ""
        echo -e "${YELLOW}4) Reinicie o backend:${NC}"
        echo -e "${CYAN}   cd backend-nodejs${NC}"
        echo -e "${CYAN}   pkill -f node${NC}"
        echo -e "${CYAN}   npm start${NC}"
        echo ""
        echo -e "${YELLOW}5) Teste:${NC}"
        echo -e "${CYAN}   curl https://meumu.com/api/health${NC}"
        echo ""
        echo -e "${BOLD}${MAGENTA}📖 DOCUMENTAÇÃO COMPLETA:${NC}"
        echo -e "${CYAN}   cat LITESPEED-PROXY-SETUP.md${NC}"
        echo ""
    else
        echo ""
        echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
        echo -e "${RED}❌ Erro ao configurar proxy reverso!${NC}"
        echo -e "${RED}═══════════���════════════════════════════════════════════════${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  Configure manualmente via CyberPanel:${NC}"
        echo -e "${CYAN}   https://meumu.com:8090${NC}"
        echo -e "${CYAN}   Websites → meumu.com → Manage → vHost Conf${NC}"
        echo -e "${CYAN}   Cole o conteúdo de: litespeed-proxy-config.conf${NC}"
        echo ""
    fi
    
    pause
}

# ══════════════════════════════════════════════════════════════
# FUNÇÃO AUXILIAR: Configurar LiteSpeed (versão silenciosa)
# ═══════════════════════════════════════════════════════════════

configurar_litespeed_interno() {
    # Versão silenciosa para instalação completa
    if [ -f "$BASE_DIR/setup-litespeed-proxy.sh" ]; then
        echo -e "${CYAN}   Aplicando configuração no vHost...${NC}"
        
        # Tentar configurar (sem confirmação)
        if sudo bash "$BASE_DIR/setup-litespeed-proxy.sh" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Proxy reverso configurado${NC}"
        else
            echo -e "${YELLOW}⚠️  Configuração manual necessária (use opção 11)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Script de configuração não encontrado${NC}"
        echo -e "${CYAN}   Configure manualmente via CyberPanel${NC}"
    fi
}

# ══════════════════════════════════════════════════════════════
# 🔧 FUNÇÃO: CORRIGIR BUGS V574
# ═══════════════════════════════════════════════════════════════

corrigir_bugs_v574() {
    clear_screen
    
    echo -e "${BOLD}${MAGENTA}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${MAGENTA}          🔧 CORREÇÃO DE BUGS - V574                        ${NC}"
    echo -e "${BOLD}${MAGENTA}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}Esta função corrige os seguintes bugs:${NC}"
    echo ""
    echo -e "${CYAN}1) 🛒 Pacotes WCoin duplicados na loja${NC}"
    echo -e "${CYAN}   → Remove duplicatas e mantém apenas 6 pacotes únicos${NC}"
    echo ""
    echo -e "${CYAN}2) 🗓️  Tabela de eventos com campo 'color' incorreto${NC}"
    echo -e "${CYAN}   → Recria tabela aceitando cores personalizadas${NC}"
    echo ""
    echo -e "${RED}⚠️  ATENÇÃO: Isso irá:${NC}"
    echo -e "${YELLOW}   - DELETAR todos os pacotes WCoin existentes${NC}"
    echo -e "${YELLOW}   - Recriar a tabela 'events' (se existir)${NC}"
    echo ""
    
    read -r -p "$(echo -e ${BOLD}Deseja continuar? [s/N]: ${NC})" confirma
    
    if [[ ! "$confirma" =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}Operação cancelada.${NC}"
        pause
        return
    fi
    
    echo ""
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${CYAN}              INICIANDO CORREÇÕES                          ${NC}"
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # ═══════════════════════════════════════════════════════════════
    # CORREÇÃO 1: WCOIN DUPLICATES
    # ═══════════════════════════════════════════════════════════════
    
    echo -e "${YELLOW}[1/2]${NC} Corrigindo pacotes WCoin duplicados..."
    
    WCOIN_FIX_FILE="$BASE_DIR/backend-nodejs/src/seeders/fix-wcoin-duplicates.sql"
    
    if [ ! -f "$WCOIN_FIX_FILE" ]; then
        echo -e "${RED}❌ Arquivo não encontrado: $WCOIN_FIX_FILE${NC}"
        pause
        return 1
    fi
    
    # Executar script de correção
    if $MYSQL_ADMIN_CMD meuweb < "$WCOIN_FIX_FILE" 2>/tmp/wcoin_fix.log; then
        echo -e "${GREEN}✅ Pacotes WCoin corrigidos!${NC}"
        
        # Verificar resultado
        WCOIN_COUNT=$($MYSQL_ADMIN_CMD -e "SELECT COUNT(*) FROM meuweb.wcoin_packages;" 2>/dev/null | tail -1)
        echo -e "${CYAN}   📦 Total de pacotes agora: ${WCOIN_COUNT}${NC}"
        
        if [ "$WCOIN_COUNT" -eq 6 ]; then
            echo -e "${GREEN}   ✅ Quantidade correta (6 pacotes únicos)${NC}"
        else
            echo -e "${YELLOW}   ⚠️  Quantidade inesperada (esperado: 6, atual: ${WCOIN_COUNT})${NC}"
        fi
        
        # Mostrar pacotes criados
        echo ""
        echo -e "${CYAN}   📋 Pacotes criados:${NC}"
        $MYSQL_ADMIN_CMD -e "SELECT id, wcoin_amount AS 'WCoin', price AS 'Preço', currency AS 'Moeda' FROM meuweb.wcoin_packages ORDER BY price ASC;" 2>/dev/null
    else
        echo -e "${RED}❌ Erro ao corrigir WCoin!${NC}"
        echo -e "${YELLOW}Log de erro:${NC}"
        cat /tmp/wcoin_fix.log
        pause
        return 1
    fi
    
    echo ""
    
    # ═══════════════════════════════════════════════════════════════
    # CORREÇÃO 2: EVENTS TABLE COLOR FIELD
    # ═══════════════════════════════════════════════════════════════
    
    echo -e "${YELLOW}[2/2]${NC} Verificando tabela de eventos..."
    
    EVENTS_TABLE_FILE="$BASE_DIR/backend-nodejs/database/06_create_events_table.sql"
    
    if [ ! -f "$EVENTS_TABLE_FILE" ]; then
        echo -e "${YELLOW}⚠️  Arquivo de eventos não encontrado (OK se não usa eventos)${NC}"
    else
        # Verificar se tabela events existe
        EVENTS_EXISTS=$($MYSQL_ADMIN_CMD -e "SHOW TABLES FROM meuweb LIKE 'events';" 2>/dev/null | tail -n +2)
        
        if [ -n "$EVENTS_EXISTS" ]; then
            echo -e "${CYAN}   Tabela 'events' existe. Verificando estrutura...${NC}"
            
            # Verificar se campo color é ENUM ou VARCHAR
            COLOR_TYPE=$($MYSQL_ADMIN_CMD -e "SHOW COLUMNS FROM meuweb.events LIKE 'color';" 2>/dev/null | tail -1 | awk '{print $2}')
            
            if [[ "$COLOR_TYPE" =~ "enum" ]]; then
                echo -e "${YELLOW}   ⚠️  Campo 'color' está como ENUM (restritivo)${NC}"
                echo -e "${CYAN}   Convertendo para VARCHAR...${NC}"
                
                # Fazer backup da tabela
                echo -e "${CYAN}   📦 Fazendo backup da tabela events...${NC}"
                $MYSQL_ADMIN_CMD -e "CREATE TABLE IF NOT EXISTS meuweb.events_backup_v574 AS SELECT * FROM meuweb.events;" 2>/dev/null
                
                # Alterar campo color
                if $MYSQL_ADMIN_CMD -e "ALTER TABLE meuweb.events MODIFY COLUMN color VARCHAR(20) DEFAULT 'yellow';" 2>/tmp/events_alter.log; then
                    echo -e "${GREEN}   ✅ Campo 'color' atualizado para VARCHAR(20)${NC}"
                    
                    # Contar eventos
                    EVENTS_COUNT=$($MYSQL_ADMIN_CMD -e "SELECT COUNT(*) FROM meuweb.events;" 2>/dev/null | tail -1)
                    echo -e "${CYAN}   📊 Total de eventos: ${EVENTS_COUNT}${NC}"
                else
                    echo -e "${RED}   ❌ Erro ao alterar campo 'color'${NC}"
                    cat /tmp/events_alter.log
                fi
            else
                echo -e "${GREEN}   ✅ Campo 'color' já está correto (VARCHAR)${NC}"
            fi
        else
            echo -e "${CYAN}   Tabela 'events' não existe. Criando...${NC}"
            
            if $MYSQL_ADMIN_CMD meuweb < "$EVENTS_TABLE_FILE" 2>/tmp/events_create.log; then
                echo -e "${GREEN}   ✅ Tabela 'events' criada com sucesso!${NC}"
                
                # Contar eventos inseridos
                EVENTS_COUNT=$($MYSQL_ADMIN_CMD -e "SELECT COUNT(*) FROM meuweb.events;" 2>/dev/null | tail -1)
                echo -e "${CYAN}   📊 Eventos inseridos: ${EVENTS_COUNT}${NC}"
            else
                echo -e "${RED}   ❌ Erro ao criar tabela 'events'${NC}"
                echo -e "${YELLOW}   Log de erro:${NC}"
                cat /tmp/events_create.log
            fi
        fi
    fi
    
    echo ""
    echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${GREEN}           ✅ CORREÇÕES CONCLUÍDAS - V574                   ${NC}"
    echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${CYAN}📋 Resumo:${NC}"
    echo -e "${GREEN}   ✅ Pacotes WCoin corrigidos${NC}"
    echo -e "${GREEN}   ✅ Tabela events verificada${NC}"
    echo ""
    echo -e "${YELLOW}🔄 Próximo passo:${NC}"
    echo -e "${CYAN}   - Faça build do frontend (opção 4)${NC}"
    echo -e "${CYAN}   - Limpe o cache do navegador (Ctrl + Shift + Delete)${NC}"
    echo -e "${CYAN}   - Teste a loja (deve ter exatamente 6 pacotes)${NC}"
    echo ""
    
    pause
}

# ═════════════════════════════════════════════════════════════
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
        echo -e "${YELLOW}10)${NC} 🔄 Atualizar do GitHub (Clone Fresh)"
        echo ""
        echo -e "${YELLOW}11)${NC} 🔧 Configurar OpenLiteSpeed Proxy Reverso"
        echo -e "${YELLOW}12)${NC} 🛠️  Corrigir Bugs V574 (WCoin + Events)"
        echo ""
        echo -e "${RED} 0)${NC} ❌ Sair"
        echo ""
        echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
        read -r -p "$(echo -e ${BOLD}Escolha uma opção: ${NC})" opcao
        
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
            10) atualizar_github ;;
            11) configurar_litespeed_proxy ;;
            12) corrigir_bugs_v574 ;;
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

# ══════════════════════════════════════════════════════════════
# INICIAR
# ═══════════════════════════════════════════════════════════════

# Verificar se está no diretório correto
if [ ! -d "$BASE_DIR" ]; then
    echo -e "${RED}❌ Diretório base não encontrado: $BASE_DIR${NC}"
    exit 1
fi

# Iniciar menu
menu_principal