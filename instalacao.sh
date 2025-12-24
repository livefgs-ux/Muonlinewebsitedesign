#!/bin/bash

# ════════════════════════════════════════════════════════════════
#  INSTALAÇÃO AUTOMÁTICA 100% - MeuMU Online
#  Deploy via GitHub com logs completos
# ════════════════════════════════════════════════════════════════

set -e  # Parar em caso de erro

# ════════════════════════════════════════════════════════════════
#  CONFIGURAÇÕES
# ════════════════════════════════════════════════════════════════

# URL do seu repositório GitHub (SUBSTITUA PELO SEU!)
GITHUB_REPO="https://github.com/SEU-USUARIO/meumu-website.git"

# Diretórios
BASE_DIR="/home/meumu.com"
INSTALL_DIR="${BASE_DIR}/public_html"
BACKEND_DIR="${INSTALL_DIR}/backend-nodejs"
LOG_DIR="${BASE_DIR}/logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${LOG_DIR}/instalacao_${TIMESTAMP}.log"

# ════════════════════════════════════════════════════════════════
#  FUNÇÃO DE LOG
# ════════════════════════════════════════════════════════════════

log() {
    local MESSAGE="$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $MESSAGE" | tee -a "$LOG_FILE"
}

log_error() {
    local MESSAGE="$1"
    echo -e "\n❌ [ERRO] $MESSAGE\n" | tee -a "$LOG_FILE"
}

log_success() {
    local MESSAGE="$1"
    echo -e "✅ $MESSAGE" | tee -a "$LOG_FILE"
}

log_step() {
    local STEP="$1"
    echo "" | tee -a "$LOG_FILE"
    echo "════════════════════════════════════════════════════════════════" | tee -a "$LOG_FILE"
    echo "  $STEP" | tee -a "$LOG_FILE"
    echo "════════════════════════════════════════════════════════════════" | tee -a "$LOG_FILE"
}

# ════════════════════════════════════════════════════════════════
#  TRATAMENTO DE ERROS
# ════════════════════════════════════════════════════════════════

error_handler() {
    local LINE_NUMBER=$1
    log_error "Erro na linha $LINE_NUMBER"
    log_error "Comando que falhou: $BASH_COMMAND"
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "  ❌ INSTALAÇÃO FALHOU!"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "📋 LOG COMPLETO SALVO EM:"
    echo "   $LOG_FILE"
    echo ""
    echo "📋 ÚLTIMAS 30 LINHAS DO LOG:"
    echo "════════════════════════════════════════════════════════════════"
    tail -30 "$LOG_FILE"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "💡 COPIE O LOG ACIMA E COLE NO FIGMA MAKE PARA CORREÇÃO!"
    echo ""
    exit 1
}

trap 'error_handler $LINENO' ERR

# ════════════════════════════════════════════════════════════════
#  INICIALIZAÇÃO
# ════════════════════════════════════════════════════════════════

clear

log_step "INICIANDO INSTALAÇÃO AUTOMÁTICA - MeuMU Online"

# Criar diretório de logs se não existir
mkdir -p "$LOG_DIR"

log "Iniciando instalação em: $INSTALL_DIR"
log "Repositório GitHub: $GITHUB_REPO"
log "Log será salvo em: $LOG_FILE"
log ""

# ════════════════════════════════════════════════════════════════
#  ETAPA 1: BACKUP DO .ENV
# ════════════════════════════════════════════════════════════════

log_step "[1/10] FAZENDO BACKUP DO ARQUIVO .ENV"

ENV_FILE="${BACKEND_DIR}/.env"
ENV_BACKUP="/tmp/.env.backup.${TIMESTAMP}"

if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$ENV_BACKUP"
    log_success "Backup do .env salvo em: $ENV_BACKUP"
    ENV_EXISTS=true
else
    log "⚠️  Arquivo .env não encontrado (primeira instalação)"
    ENV_EXISTS=false
fi

# ════════════════════════════════════════════════════════════════
#  ETAPA 2: PARAR PM2
# ════════════════════════════════════════════════════════════════

log_step "[2/10] PARANDO BACKEND (PM2)"

if pm2 list | grep -q "meumu-backend"; then
    log "Parando processo PM2..."
    pm2 stop meumu-backend >> "$LOG_FILE" 2>&1 || true
    pm2 delete meumu-backend >> "$LOG_FILE" 2>&1 || true
    log_success "Backend parado"
else
    log "Backend não estava rodando"
fi

# ════════════════════════════════════════════════════════════════
#  ETAPA 3: LIMPEZA TOTAL DO DIRETÓRIO
# ════════════════════════════════════════════════════════════════

log_step "[3/10] LIMPANDO DIRETÓRIO COMPLETAMENTE"

cd "$BASE_DIR"

# Verificar se o diretório existe
if [ -d "$INSTALL_DIR" ]; then
    log "Removendo $INSTALL_DIR..."
    
    # Remover atributos especiais (imutável, etc)
    chattr -R -i "$INSTALL_DIR" 2>/dev/null || true
    
    # Forçar remoção de tudo (incluindo arquivos ocultos)
    rm -rf "$INSTALL_DIR"
    
    # Verificar se ainda existe algo
    if [ -d "$INSTALL_DIR" ]; then
        log_error "Falha ao remover diretório! Tentando com força..."
        find "$INSTALL_DIR" -delete 2>/dev/null || true
        rm -rf "$INSTALL_DIR"
    fi
    
    log_success "Diretório limpo completamente"
else
    log "Diretório não existia (primeira instalação)"
fi

# Verificar se limpou mesmo
if [ -d "$INSTALL_DIR" ]; then
    log_error "ERRO CRÍTICO: Não conseguiu limpar o diretório!"
    log_error "Execute manualmente: rm -rf $INSTALL_DIR"
    exit 1
fi

# ════════════════════════════════════════════════════════════════
#  ETAPA 4: VERIFICAR GIT
# ════════════════════════════════════════════════════════════════

log_step "[4/10] VERIFICANDO GIT"

if ! command -v git &> /dev/null; then
    log_error "Git não está instalado!"
    log "Instalando Git..."
    
    if command -v apt-get &> /dev/null; then
        apt-get update >> "$LOG_FILE" 2>&1
        apt-get install -y git >> "$LOG_FILE" 2>&1
    elif command -v yum &> /dev/null; then
        yum install -y git >> "$LOG_FILE" 2>&1
    else
        log_error "Não conseguiu instalar Git automaticamente"
        log_error "Execute: apt-get install git (Debian/Ubuntu) ou yum install git (CentOS/RHEL)"
        exit 1
    fi
fi

GIT_VERSION=$(git --version)
log_success "Git instalado: $GIT_VERSION"

# ════════════════════════════════════════════════════════════════
#  ETAPA 5: CLONAR REPOSITÓRIO
# ════════════════════════════════════════════════════════════════

log_step "[5/10] CLONANDO REPOSITÓRIO DO GITHUB"

log "Clonando de: $GITHUB_REPO"
log "Destino: $INSTALL_DIR"

# Verificar se a URL do GitHub foi configurada
if [[ "$GITHUB_REPO" == *"SEU-USUARIO"* ]]; then
    log_error "VOCÊ PRECISA CONFIGURAR A URL DO GITHUB PRIMEIRO!"
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "  CONFIGURE O REPOSITÓRIO GITHUB"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "1. Edite o arquivo: $0"
    echo ""
    echo "2. Na linha 16, substitua:"
    echo '   GITHUB_REPO="https://github.com/SEU-USUARIO/meumu-website.git"'
    echo ""
    echo "   Por:"
    echo '   GITHUB_REPO="https://github.com/seu-usuario-real/meumu-website.git"'
    echo ""
    echo "3. Execute o script novamente"
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    exit 1
fi

# Clonar repositório
git clone "$GITHUB_REPO" "$INSTALL_DIR" >> "$LOG_FILE" 2>&1

if [ ! -d "$INSTALL_DIR" ]; then
    log_error "Falha ao clonar repositório!"
    log_error "Verifique:"
    log_error "1. A URL está correta?"
    log_error "2. O repositório existe?"
    log_error "3. Você tem acesso ao repositório?"
    log_error "4. Se for privado, configure SSH keys ou use Personal Access Token"
    exit 1
fi

log_success "Repositório clonado com sucesso"

# ════════════════════════════════════════════════════════════════
#  ETAPA 6: RESTAURAR .ENV
# ════════════════════════════════════════════════════════════════

log_step "[6/10] RESTAURANDO ARQUIVO .ENV"

if [ "$ENV_EXISTS" = true ]; then
    mkdir -p "$BACKEND_DIR"
    cp "$ENV_BACKUP" "$ENV_FILE"
    log_success ".env restaurado do backup"
else
    log "⚠️  Primeira instalação - .env precisa ser criado"
    log "   O backend iniciará em modo instalação"
fi

# ════════════════════════════════════════════════════════════════
#  ETAPA 7: CORRIGIR PACKAGE.JSON
# ════════════════════════════════════════════════════════════════

log_step "[7/10] CORRIGINDO PACKAGE.JSON"

cd "$INSTALL_DIR"

if [ ! -f "package.json" ]; then
    log_error "package.json não encontrado no repositório!"
    exit 1
fi

# Backup
cp package.json package.json.backup

# Adicionar React se não existir
if ! grep -q '"react":' package.json; then
    log "Adicionando React às dependencies..."
    sed -i '/"dependencies": {/a\    "react": "18.3.1",\n    "react-dom": "18.3.1",' package.json
    log_success "React adicionado"
else
    log "React já existe no package.json"
fi

# Adicionar types se não existir
if ! grep -q '"@types/react":' package.json; then
    log "Adicionando types às devDependencies..."
    sed -i '/"devDependencies": {/a\    "@types/react": "18.3.12",\n    "@types/react-dom": "18.3.1",\n    "typescript": "5.6.2",' package.json
    log_success "Types adicionados"
else
    log "Types já existem no package.json"
fi

# ════════════════════════════════════════════════════════════════
#  ETAPA 8: INSTALAR DEPENDÊNCIAS
# ════════════════════════════════════════════════════════════════

log_step "[8/10] INSTALANDO DEPENDÊNCIAS NPM"

log "Verificando Node.js..."
NODE_VERSION=$(node --version 2>&1 || echo "não instalado")
NPM_VERSION=$(npm --version 2>&1 || echo "não instalado")

log "Node.js: $NODE_VERSION"
log "NPM: $NPM_VERSION"

if [[ "$NODE_VERSION" == "não instalado" ]]; then
    log_error "Node.js não está instalado!"
    log_error "Instale Node.js 18+ antes de continuar"
    exit 1
fi

log "Instalando dependências (pode demorar 2-3 minutos)..."
npm install --legacy-peer-deps >> "$LOG_FILE" 2>&1

INSTALLED_PACKAGES=$(ls -1 node_modules | wc -l)
log_success "Dependências instaladas: $INSTALLED_PACKAGES pacotes"

# ════════════════════════════════════════════════════════════════
#  ETAPA 9: BUILDAR FRONTEND
# ════════════════════════════════════════════════════════════════

log_step "[9/10] BUILDANDO FRONTEND REACT"

log "Iniciando build (pode demorar 1-2 minutos)..."
npm run build >> "$LOG_FILE" 2>&1

if [ ! -d "dist" ]; then
    log_error "Build falhou! Pasta dist não foi criada"
    log_error "Verifique os logs acima"
    exit 1
fi

DIST_SIZE=$(du -sh dist | cut -f1)
DIST_FILES=$(find dist -type f | wc -l)
log_success "Frontend buildado: $DIST_SIZE ($DIST_FILES arquivos)"

# Copiar dist para backend
log "Copiando dist para backend..."
rm -rf "$BACKEND_DIR/dist"
cp -r dist "$BACKEND_DIR/"

if [ ! -d "$BACKEND_DIR/dist" ]; then
    log_error "Falha ao copiar dist para backend!"
    exit 1
fi

log_success "Dist copiado para backend"

# Remover instalador web (não é mais necessário)
if [ -d "$BACKEND_DIR/install" ]; then
    log "Removendo instalador web..."
    rm -rf "$BACKEND_DIR/install"
    log_success "Instalador removido"
fi

# ════════════════════════════════════════════════════════════════
#  ETAPA 10: FINALIZAR INSTALAÇÃO
# ════════════════════════════════════════════════════════════════

log_step "[10/10] FINALIZANDO INSTALAÇÃO"

cd "$BACKEND_DIR"

# Configurar .env
if [ -f ".env" ]; then
    log "Configurando .env..."
    
    # Marcar como instalado
    if ! grep -q "INSTALLATION_COMPLETE=true" .env; then
        echo "INSTALLATION_COMPLETE=true" >> .env
        log_success "INSTALLATION_COMPLETE=true adicionado"
    fi
    
    # Configurar CORS
    if ! grep -q "ALLOWED_ORIGINS=" .env; then
        echo "ALLOWED_ORIGINS=http://meumu.com:3001,http://meumu.com,https://meumu.com,http://localhost:3001" >> .env
        log_success "ALLOWED_ORIGINS configurado"
    fi
fi

# Iniciar backend com PM2
log "Iniciando backend com PM2..."
pm2 start src/server.js --name meumu-backend --update-env >> "$LOG_FILE" 2>&1
pm2 save >> "$LOG_FILE" 2>&1

# Aguardar inicialização
log "Aguardando backend inicializar..."
sleep 3

# ════════════════════════════════════════════════════════════════
#  VERIFICAR STATUS
# ════════════════════════════════════════════════════════════════

log_step "VERIFICANDO STATUS"

pm2 status | tee -a "$LOG_FILE"

# Verificar se está rodando
if pm2 list | grep -q "meumu-backend.*online"; then
    log_success "Backend está rodando!"
else
    log_error "Backend não iniciou corretamente!"
    log "Veja os logs do PM2:"
    pm2 logs meumu-backend --lines 30 --nostream | tee -a "$LOG_FILE"
    exit 1
fi

# ════════════════════════════════════════════════════════════════
#  SUCESSO!
# ════════════════════════════════════════════════════════════════

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ✅ INSTALAÇÃO COMPLETA COM SUCESSO!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🌐 ACESSE AGORA:"
echo ""
echo "   👉 http://meumu.com:3001"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  RESUMO DA INSTALAÇÃO"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "✅ Repositório: $GITHUB_REPO"
echo "✅ Frontend buildado: $DIST_SIZE ($DIST_FILES arquivos)"
echo "✅ Backend rodando via PM2"
echo "✅ Logs salvos em: $LOG_FILE"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  COMANDOS ÚTEIS"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "  Ver logs em tempo real:"
echo "    pm2 logs meumu-backend"
echo ""
echo "  Ver status:"
echo "    pm2 status"
echo ""
echo "  Reiniciar backend:"
echo "    pm2 restart meumu-backend"
echo ""
echo "  Atualizar site (após commit no GitHub):"
echo "    ./instalacao.sh"
echo ""
echo "  Ver log desta instalação:"
echo "    cat $LOG_FILE"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🎮 BOA SORTE COM SEU SERVIDOR MU ONLINE! 🚀"
echo ""
echo "════════════════════════════════════════════════════════════════"

log_success "Instalação concluída em: $(date)"

# Limpar backup temporário do .env
rm -f "$ENV_BACKUP"
