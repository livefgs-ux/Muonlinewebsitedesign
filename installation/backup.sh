#!/bin/bash

# =====================================================
# BACKUP SCRIPT - MeuMU Online
# =====================================================
# Faz backup completo do banco de dados e arquivos
# =====================================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configurações
PROJECT_DIR="/var/www/meumuonline"
BACKUP_DIR="/var/backups/meumuonline"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
RETENTION_DAYS=7

echo -e "${BLUE}🔄 Iniciando backup...${NC}"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# =====================================================
# BACKUP DO BANCO DE DADOS
# =====================================================
echo -e "${BLUE}📦 Backup do banco de dados...${NC}"

# Carregar credenciais do .env
if [ -f "$PROJECT_DIR/backend-nodejs/.env" ]; then
    export $(cat $PROJECT_DIR/backend-nodejs/.env | grep -v '^#' | xargs)
fi

# Backup do banco webmu
mysqldump -h ${DB_HOST:-localhost} \
          -P ${DB_PORT:-3306} \
          -u ${DB_USER:-root} \
          -p${DB_PASSWORD} \
          ${DB_NAME_WEBMU:-webmu} \
          | gzip > $BACKUP_DIR/webmu_$DATE.sql.gz

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Banco webmu backupeado${NC}"
else
    echo -e "${YELLOW}⚠️  Erro ao fazer backup do banco${NC}"
fi

# =====================================================
# BACKUP DOS ARQUIVOS
# =====================================================
echo -e "${BLUE}📦 Backup dos arquivos...${NC}"

tar -czf $BACKUP_DIR/files_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.git' \
    -C /var/www meumuonline

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Arquivos backupeados${NC}"
else
    echo -e "${YELLOW}⚠️  Erro ao fazer backup dos arquivos${NC}"
fi

# =====================================================
# REMOVER BACKUPS ANTIGOS
# =====================================================
echo -e "${BLUE}🗑️  Removendo backups antigos (>${RETENTION_DAYS} dias)...${NC}"

find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete

# =====================================================
# ESTATÍSTICAS
# =====================================================
echo ""
echo -e "${GREEN}✅ Backup concluído!${NC}"
echo ""
echo "📊 Estatísticas:"
echo "  Data: $DATE"
echo "  Localização: $BACKUP_DIR"

# Tamanho dos backups
DB_SIZE=$(du -h $BACKUP_DIR/webmu_$DATE.sql.gz | cut -f1)
FILES_SIZE=$(du -h $BACKUP_DIR/files_$DATE.tar.gz | cut -f1)

echo "  Banco de dados: $DB_SIZE"
echo "  Arquivos: $FILES_SIZE"

# Total de backups
TOTAL_BACKUPS=$(ls -1 $BACKUP_DIR/*.gz 2>/dev/null | wc -l)
echo "  Total de backups: $TOTAL_BACKUPS"

# Espaço usado
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
echo "  Espaço total usado: $TOTAL_SIZE"

echo ""
echo -e "${BLUE}💾 Backups disponíveis:${NC}"
ls -lh $BACKUP_DIR/*.gz | tail -5

echo ""
