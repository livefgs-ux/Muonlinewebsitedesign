#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 🚀 COMANDOS RÁPIDOS - Setup Completo do MeuMU Online
# ═══════════════════════════════════════════════════════════════════════════
# 
# IMPORTANTE: Leia cada seção antes de executar!
# Você pode copiar e colar bloco por bloco no terminal
# 
# ═══════════════════════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════════════════════
# BLOCO 1: VERIFICAÇÃO INICIAL
# ═══════════════════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════════════"
echo "🔍 BLOCO 1: VERIFICAÇÃO INICIAL"
echo "═══════════════════════════════════════════════════════════════"

cd /home/meumu.com/public_html

# Verificar se há ocorrências de 'webmu' (deve ser ZERO)
echo ""
echo "Verificando ocorrências de 'webmu' no install.sh..."
WEBMU_COUNT=$(grep -c "webmu" install.sh 2>/dev/null || echo "0")
echo "Ocorrências encontradas: $WEBMU_COUNT"

if [ "$WEBMU_COUNT" -gt 0 ]; then
    echo "⚠️  ATENÇÃO: Ainda há ocorrências de 'webmu'!"
    echo "Execute o script de correção primeiro:"
    echo "  ./corrigir-install-webmu.sh"
    exit 1
else
    echo "✅ Nenhuma ocorrência de 'webmu' encontrada! Pode prosseguir."
fi

echo ""
echo "Pressione ENTER para continuar para o BLOCO 2..."
read

# ═══════════════════════════════════════════════════════════════════════════
# BLOCO 2: LIMPAR E RECRIAR DATABASES
# ═══════════════════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🗄️  BLOCO 2: LIMPAR E RECRIAR DATABASES"
echo "═══════════════════════════════════════════════════════════════"

echo ""
echo "⚠️  ATENÇÃO: Isto irá:"
echo "   • Dropar database 'webmu' (se existir)"
echo "   • Dropar database 'meuweb' (se existir)"
echo "   • Criar database 'meuweb' (limpo)"
echo ""
echo "Deseja continuar? (S/n)"
read -r resposta

if [[ "$resposta" =~ ^[Ss]$ ]]; then
    mysql -u root -p@mysql123@ << 'EOF'
DROP DATABASE IF EXISTS webmu;
DROP DATABASE IF EXISTS meuweb;
CREATE DATABASE meuweb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SELECT 'Database meuweb criado!' AS status;
EOF
    echo "✅ Databases recriados com sucesso!"
else
    echo "❌ Operação cancelada. Execute manualmente se necessário."
fi

echo ""
echo "Pressione ENTER para continuar para o BLOCO 3..."
read

# ═══════════════════════════════════════════════════════════════════════════
# BLOCO 3: CRIAR USUÁRIO WEBUSER
# ═══════════════════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "👤 BLOCO 3: CRIAR USUÁRIO WEBUSER"
echo "═══════════════════════════════════════════════════════════════"

if [ -f "backend-nodejs/database/00_create_webuser.sql" ]; then
    echo ""
    echo "Criando usuário 'webuser' com permissões limitadas..."
    mysql -u root -p@mysql123@ < backend-nodejs/database/00_create_webuser.sql
    
    echo ""
    echo "Testando login com webuser..."
    if mysql -u webuser -p@meusite123@ -e "SELECT 'Login OK!' AS status;" 2>/dev/null; then
        echo "✅ Usuário webuser criado e funcional!"
    else
        echo "❌ Erro ao criar usuário webuser!"
        exit 1
    fi
else
    echo "❌ Arquivo SQL não encontrado!"
    exit 1
fi

echo ""
echo "Pressione ENTER para continuar para o BLOCO 4..."
read

# ═══════════════════════════════════════════════════════════════════════════
# BLOCO 4: CRIAR TABELAS
# ═══════════════════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📋 BLOCO 4: CRIAR TABELAS"
echo "═══════════════════════════════════════════════════════════════"

cd backend-nodejs/database

echo ""
echo "Criando tabela 'events'..."
mysql -u root -p@mysql123@ meuweb < 06_create_events_table.sql && echo "✅ Tabela events criada!"

echo ""
echo "Criando tabela 'admin_logs'..."
mysql -u root -p@mysql123@ meuweb < 06_create_admin_logs.sql && echo "✅ Tabela admin_logs criada!"

echo ""
echo "Criando tabela 'wcoin_packages'..."
mysql -u root -p@mysql123@ meuweb < 05_create_wcoin_packages.sql && echo "✅ Tabela wcoin_packages criada!"

cd ../..

echo ""
echo "Verificando tabelas criadas..."
mysql -u root -p@mysql123@ meuweb -e "SHOW TABLES;"

echo ""
echo "Pressione ENTER para continuar para o BLOCO 5..."
read

# ═══════════════════════════════════════════════════════════════════════════
# BLOCO 5: EXECUTAR INSTALADOR
# ═══════════════════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🚀 BLOCO 5: EXECUTAR INSTALADOR"
echo "═══════════════════════════════════════════════════════════════"

echo ""
echo "Agora vamos executar o instalador completo."
echo "Ele irá:"
echo "  • Instalar dependências (frontend + backend)"
echo "  • Configurar arquivos .env"
echo "  • Buildar o frontend (npm run build)"
echo "  • Iniciar o servidor backend com PM2"
echo ""
echo "Deseja continuar? (S/n)"
read -r resposta

if [[ "$resposta" =~ ^[Ss]$ ]]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "Iniciando instalador..."
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    
    # Executar instalador
    ./install.sh
else
    echo ""
    echo "❌ Instalador não foi executado."
    echo ""
    echo "Execute manualmente quando estiver pronto:"
    echo "  cd /home/meumu.com/public_html"
    echo "  ./install.sh"
    echo "  (Escolha opção 1 - Instalação Completa)"
fi

# ═══════════════════════════════════════════════════════════════════════════
# FIM
# ═══════════════════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ SCRIPT CONCLUÍDO!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Se tudo correu bem, seu site está rodando em:"
echo "  http://meumu.com:3001"
echo ""
echo "Para ver logs do servidor:"
echo "  pm2 logs meumu-api"
echo ""
echo "Para reiniciar o servidor:"
echo "  pm2 restart meumu-api"
echo ""
