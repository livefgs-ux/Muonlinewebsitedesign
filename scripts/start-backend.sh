#!/bin/bash

##############################################
# 🚀 START BACKEND - MeuMU Online
# Inicia o backend Node.js
##############################################

echo "🚀 Iniciando backend..."

cd backend-nodejs

# Verificar .env
if [ ! -f ".env" ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Execute o instalador em /install primeiro."
    exit 1
fi

# Verificar node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar PM2
if command -v pm2 &> /dev/null; then
    echo "🔧 Iniciando com PM2..."
    pm2 delete meumu-backend 2>/dev/null
    pm2 start src/server.js --name meumu-backend
    pm2 save
    echo "✅ Backend rodando com PM2!"
    pm2 status
else
    echo "⚠️  PM2 não instalado. Iniciando com Node..."
    node src/server.js &
    echo "✅ Backend rodando!"
fi
