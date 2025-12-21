#!/bin/bash

# =====================================================
# SETUP DATABASE - Configuração do Banco de Dados
# =====================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════╗"
echo "║   CONFIGURAÇÃO DO BANCO DE DADOS           ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"

# Solicitar credenciais MySQL
echo -e "${YELLOW}Digite as credenciais do MySQL:${NC}"
read -p "Host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Porta [3306]: " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "Usuário [root]: " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Senha: " DB_PASS
echo ""

read -p "Nome do banco MuOnline [MuOnline]: " DB_MUONLINE
DB_MUONLINE=${DB_MUONLINE:-MuOnline}

read -p "Nome do banco WebMU [webmu]: " DB_WEBMU
DB_WEBMU=${DB_WEBMU:-webmu}

# Testar conexão
echo -e "${BLUE}Testando conexão...${NC}"
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS -e "SELECT 1;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Conexão estabelecida com sucesso${NC}"
else
    echo -e "${RED}❌ Falha ao conectar no MySQL${NC}"
    exit 1
fi

# Verificar se banco MuOnline existe
echo -e "${BLUE}Verificando banco MuOnline...${NC}"
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS -e "USE $DB_MUONLINE;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Banco $DB_MUONLINE encontrado${NC}"
else
    echo -e "${RED}❌ Banco $DB_MUONLINE não encontrado${NC}"
    echo -e "${YELLOW}O banco MuOnline deve existir antes de continuar${NC}"
    exit 1
fi

# Criar banco WebMU
echo -e "${BLUE}Criando banco $DB_WEBMU...${NC}"
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS << EOF
CREATE DATABASE IF NOT EXISTS $DB_WEBMU CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE $DB_WEBMU;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Banco $DB_WEBMU criado${NC}"
else
    echo -e "${RED}❌ Erro ao criar banco${NC}"
    exit 1
fi

# Importar tabelas
SQL_DIR="../backend-nodejs/database"

echo -e "${BLUE}Importando tabelas...${NC}"

for sql_file in $SQL_DIR/*.sql; do
    if [ -f "$sql_file" ]; then
        filename=$(basename "$sql_file")
        echo -e "  Importando: $filename"
        mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_WEBMU < "$sql_file"
        
        if [ $? -eq 0 ]; then
            echo -e "  ${GREEN}✅ $filename${NC}"
        else
            echo -e "  ${RED}❌ Erro em $filename${NC}"
        fi
    fi
done

echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════╗"
echo "║   ✅ BANCO DE DADOS CONFIGURADO            ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${YELLOW}📝 Atualizar .env com estas informações:${NC}"
echo ""
echo "DB_HOST=$DB_HOST"
echo "DB_PORT=$DB_PORT"
echo "DB_USER=$DB_USER"
echo "DB_PASSWORD=$DB_PASS"
echo "DB_NAME_MUONLINE=$DB_MUONLINE"
echo "DB_NAME_WEBMU=$DB_WEBMU"
echo ""
