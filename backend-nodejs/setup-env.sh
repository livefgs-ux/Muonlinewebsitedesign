#!/bin/bash

###############################################################################
# SCRIPT DE SETUP AUTOMÁTICO - Criar .env e Detectar Tabelas
###############################################################################

echo ""
echo "🚀 SETUP AUTOMÁTICO - MeuMU Online Backend"
echo "============================================================"
echo ""

cd "$(dirname "$0")"

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Criando .env a partir do .env.template..."
    
    if [ -f .env.template ]; then
        cp .env.template .env
        echo "✅ Arquivo .env criado!"
    else
        echo "❌ Erro: .env.template não encontrado!"
        exit 1
    fi
else
    echo "✅ Arquivo .env encontrado"
fi

echo ""
echo "🔍 Detectando tabelas do banco de dados..."
echo ""

# Executar script de detecção
node auto-fix-tables.js

echo ""
echo "============================================================"
echo ""

# Verificar se tables-config.env foi criado
if [ -f tables-config.env ]; then
    echo "✅ Configuração de tabelas detectada!"
    echo ""
    read -p "Deseja aplicar a configuração ao .env? (s/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[SsYy]$ ]]; then
        cat tables-config.env >> .env
        echo "✅ Configuração aplicada ao .env"
        echo ""
        echo "🔄 Reiniciando servidor..."
        npm restart
    else
        echo "⚠️  Configuração NÃO aplicada"
        echo "💡 Para aplicar manualmente: cat tables-config.env >> .env"
    fi
else
    echo "⚠️  Algumas tabelas não foram detectadas automaticamente"
    echo "💡 Execute: node check-tables.js"
    echo "💡 E edite manualmente: nano .env"
fi

echo ""
echo "============================================================"
echo "✅ Setup concluído!"
echo ""
