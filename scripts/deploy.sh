#!/bin/bash

##############################################
# 🚀 DEPLOY - MeuMU Online
# Deploy automático para produção
##############################################

echo "🚀 Iniciando deploy..."

# Build do frontend
echo "📦 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build concluído!"
    
    # Copiar assets
    echo "📁 Copiando assets..."
    # (Assets já estão em /assets após build)
    
    # Permissões
    echo "🔐 Ajustando permissões..."
    chmod 755 assets/ 2>/dev/null
    chmod 644 index.html 2>/dev/null
    
    echo "✅ Deploy concluído!"
    echo ""
    echo "🌐 Acesse: http://seudominio.com"
else
    echo "❌ Erro no build!"
    exit 1
fi
