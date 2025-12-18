#!/bin/bash
# ============================================================
# Script de Instalação - MeuMU Online
# Projeto exportado do Figma Make
# ============================================================

echo "==============================================="
echo "   🎮 MeuMU Online - Instalação Completa"
echo "   Season 19-2-3 - Épico"
echo "==============================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo "Por favor, instale Node.js 18+ em: https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detectado${NC}"
echo ""

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) detectado${NC}"
echo ""

# ============================================================
# 1. CONFIGURAÇÃO DO BANCO DE DADOS
# ============================================================

echo -e "${YELLOW}📊 CONFIGURAÇÃO DO BANCO DE DADOS MYSQL${NC}"
echo "----------------------------------------------"

# Valores padrão
DEFAULT_DB_HOST="23.321.231.227"
DEFAULT_DB_USER="root"
DEFAULT_DB_PASS="123123123"
DEFAULT_DB_MU="muonline"
DEFAULT_DB_WEB="webmu"

read -p "Host do MySQL [$DEFAULT_DB_HOST]: " DB_HOST
DB_HOST=${DB_HOST:-$DEFAULT_DB_HOST}

read -p "Usuário do MySQL [$DEFAULT_DB_USER]: " DB_USER
DB_USER=${DB_USER:-$DEFAULT_DB_USER}

read -sp "Senha do MySQL [****]: " DB_PASS
echo ""
DB_PASS=${DB_PASS:-$DEFAULT_DB_PASS}

read -p "Nome do banco MU Online [$DEFAULT_DB_MU]: " DB_DATABASE_MU
DB_DATABASE_MU=${DB_DATABASE_MU:-$DEFAULT_DB_MU}

read -p "Nome do banco Web [$DEFAULT_DB_WEB]: " DB_DATABASE_WEB
DB_DATABASE_WEB=${DB_DATABASE_WEB:-$DEFAULT_DB_WEB}

echo ""
echo -e "${GREEN}✅ Configurações do banco de dados coletadas${NC}"
echo ""

# ============================================================
# 2. CRIAR ARQUIVO .env
# ============================================================

echo -e "${YELLOW}📝 Criando arquivo .env...${NC}"

cat <<EOF > .env
# Configuração do MeuMU Online
# Gerado automaticamente em $(date)

# Banco de Dados MySQL Principal
DB_HOST=$DB_HOST
DB_PORT=3306
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_DATABASE_MU=$DB_DATABASE_MU
DB_DATABASE_WEB=$DB_DATABASE_WEB

# Configuração de Assets
ASSETS_PATH=./public/assets
PUBLIC_URL=/

# Configuração do Servidor
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=info
EOF

echo -e "${GREEN}✅ Arquivo .env criado com sucesso${NC}"
echo ""

# ============================================================
# 3. ORGANIZAR ESTRUTURA DE ASSETS
# ============================================================

echo -e "${YELLOW}🖼️  Organizando estrutura de assets...${NC}"

# Criar diretórios necessários
mkdir -p public/assets/backgrounds
mkdir -p public/assets/images
mkdir -p public/assets/icons

echo -e "${GREEN}✅ Estrutura de pastas criada:${NC}"
echo "   📁 /public/assets/backgrounds/"
echo "   📁 /public/assets/images/"
echo "   📁 /public/assets/icons/"
echo ""

# Verificar se imagens existem
HERO_BG="public/assets/backgrounds/hero-background.png"
CHAR_EX="public/assets/images/character-example.png"

if [ ! -f "$HERO_BG" ]; then
    echo -e "${YELLOW}⚠️  Aviso: hero-background.png não encontrado${NC}"
    echo "   Você precisará adicionar o background principal em:"
    echo "   → $HERO_BG"
    echo ""
fi

if [ ! -f "$CHAR_EX" ]; then
    echo -e "${YELLOW}⚠️  Aviso: character-example.png não encontrado${NC}"
    echo "   Você precisará adicionar a imagem do personagem em:"
    echo "   → $CHAR_EX"
    echo ""
fi

# ============================================================
# 4. INSTALAR DEPENDÊNCIAS
# ============================================================

echo -e "${YELLOW}📦 Instalando dependências do projeto...${NC}"
echo "Isso pode levar alguns minutos..."
echo ""

npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependências instaladas com sucesso${NC}"
else
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi
echo ""

# ============================================================
# 5. BUILD DO PROJETO
# ============================================================

echo -e "${YELLOW}🔨 Compilando projeto...${NC}"
echo ""

npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build concluído com sucesso${NC}"
else
    echo -e "${RED}❌ Erro no build${NC}"
    echo "Verifique os logs acima para mais detalhes"
    exit 1
fi
echo ""

# ============================================================
# 6. VERIFICAR CONEXÃO COM BANCO (OPCIONAL)
# ============================================================

echo -e "${YELLOW}🔌 Deseja testar conexão com o banco de dados? (s/n)${NC}"
read -p "Resposta: " TEST_DB

if [[ "$TEST_DB" == "s" || "$TEST_DB" == "S" ]]; then
    echo "Testando conexão..."
    # Aqui você pode adicionar um script node para testar conexão
    node -e "
    const mysql = require('mysql2/promise');
    (async () => {
        try {
            const connection = await mysql.createConnection({
                host: '$DB_HOST',
                user: '$DB_USER',
                password: '$DB_PASS',
                database: '$DB_DATABASE_MU'
            });
            console.log('✅ Conexão com banco de dados bem-sucedida!');
            await connection.end();
        } catch (error) {
            console.error('❌ Erro ao conectar:', error.message);
        }
    })();
    " 2>/dev/null || echo -e "${YELLOW}⚠️  Teste de conexão indisponível (mysql2 não instalado)${NC}"
fi
echo ""

# ============================================================
# 7. RESUMO E PRÓXIMOS PASSOS
# ============================================================

echo ""
echo "==============================================="
echo -e "${GREEN}   ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
echo "==============================================="
echo ""
echo -e "${YELLOW}📊 CONFIGURAÇÕES APLICADAS:${NC}"
echo "   • Banco de dados: $DB_DATABASE_MU"
echo "   • Host MySQL: $DB_HOST"
echo "   • Usuário: $DB_USER"
echo "   • Assets organizados em: ./public/assets"
echo ""
echo -e "${YELLOW}🚀 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. Adicionar imagens aos assets:"
echo "   → public/assets/backgrounds/hero-background.png"
echo "   → public/assets/images/character-example.png"
echo ""
echo "2. Iniciar servidor de desenvolvimento:"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""
echo "3. Ou iniciar em produção:"
echo -e "   ${GREEN}npm start${NC}"
echo ""
echo "4. Acessar painel admin:"
echo "   → http://localhost:3000"
echo "   → Login: admin / senha configurada"
echo ""
echo -e "${YELLOW}📚 DOCUMENTAÇÃO:${NC}"
echo "   • README.md - Informações gerais"
echo "   • /public/assets/README.md - Guia de assets"
echo "   • .env - Configurações do ambiente"
echo ""
echo "==============================================="
echo -e "${GREEN}   Bom jogo! ⚔️🎮✨${NC}"
echo "==============================================="
