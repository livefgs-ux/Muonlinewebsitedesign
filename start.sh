#!/bin/bash

# Script de inicialização do MeuMU Online

echo "⚔️  MeuMU Online - Season 19-2-3 Épico"
echo "════════════════════════════════════════════════"
echo ""

# Verifica se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Criando .env a partir do exemplo..."
    cp .env.example .env
    echo ""
    echo "✅ Arquivo .env criado!"
    echo "⚠️  ATENÇÃO: Configure suas credenciais MySQL no arquivo .env"
    echo ""
    echo "Pressione ENTER para abrir o arquivo .env..."
    read
    
    # Abre o editor padrão
    ${EDITOR:-nano} .env
fi

echo ""
echo "🧪 Testando conexão com MySQL..."
echo ""

# Testa conexão
npm run test:db

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Conexão OK! Iniciando servidores..."
    echo ""
    echo "🚀 Backend: http://localhost:3001"
    echo "🎨 Frontend: http://localhost:5173"
    echo ""
    echo "Pressione Ctrl+C para parar"
    echo ""
    
    # Inicia backend e frontend
    npm run dev:all
else
    echo ""
    echo "❌ Falha na conexão com MySQL!"
    echo ""
    echo "📋 Verifique:"
    echo "   1. MySQL está rodando?"
    echo "   2. Credenciais no .env estão corretas?"
    echo "   3. Firewall permite porta 3306?"
    echo ""
    echo "📖 Leia o guia: GUIA_CONEXAO_MYSQL.md"
fi
