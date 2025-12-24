#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "  INSTALAÇÃO AUTOMÁTICA COMPLETA - MeuMU Online"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "⚠️  ATENÇÃO: Este script assume que você já copiou os arquivos"
echo "   do Figma Make para /home/meumu.com/public_html/frontend/"
echo ""
read -p "Continuar? (s/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Instalação cancelada"
    exit 1
fi

FRONTEND_DIR="/home/meumu.com/public_html/frontend"
BACKEND_DIR="/home/meumu.com/public_html/backend-nodejs"

# Verificar se frontend existe
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Pasta frontend não encontrada: $FRONTEND_DIR"
    echo ""
    echo "EXECUTE PRIMEIRO:"
    echo "  mkdir -p $FRONTEND_DIR"
    echo "  # Copie os arquivos do Figma Make para esta pasta"
    exit 1
fi

# Verificar se tem package.json
if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    echo "❌ package.json não encontrado em $FRONTEND_DIR"
    echo "   Certifique-se de copiar TODOS os arquivos do Figma Make"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  INICIANDO INSTALAÇÃO..."
echo "════════════════════════════════════════════════════════════════"
echo ""

# 1. Instalar dependências
echo "[1/7] Instalando dependências do frontend..."
echo "      (Isso pode demorar 3-5 minutos)"
cd "$FRONTEND_DIR"
npm install --legacy-peer-deps 2>&1 | tail -20

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências!"
    echo ""
    echo "Tente manualmente:"
    echo "  cd $FRONTEND_DIR"
    echo "  npm install --legacy-peer-deps"
    exit 1
fi

echo "✅ Dependências instaladas"
echo ""

# 2. Buildar frontend
echo "[2/7] Buildando frontend React..."
echo "      (Isso pode demorar 1-2 minutos)"
npm run build 2>&1 | tail -20

if [ $? -ne 0 ]; then
    echo "❌ Erro ao buildar frontend!"
    exit 1
fi

echo "✅ Frontend buildado"
echo ""

# 3. Verificar dist
echo "[3/7] Verificando pasta dist..."
if [ ! -d "dist" ]; then
    echo "❌ Pasta dist não foi criada!"
    exit 1
fi

DIST_FILES=$(ls -1 dist/ | wc -l)
echo "✅ Pasta dist criada ($DIST_FILES arquivos)"
echo ""

# 4. Copiar para backend
echo "[4/7] Copiando dist para backend..."
rm -rf "$BACKEND_DIR/dist"
cp -r dist "$BACKEND_DIR/"

if [ $? -ne 0 ]; then
    echo "❌ Erro ao copiar dist!"
    exit 1
fi

echo "✅ Dist copiado"
echo ""

# 5. Remover instalador
echo "[5/7] Removendo instalador web..."
if [ -d "$BACKEND_DIR/install" ]; then
    rm -rf "$BACKEND_DIR/install"
    echo "✅ Instalador removido"
else
    echo "⚠️  Instalador já foi removido"
fi
echo ""

# 6. Marcar instalação completa
echo "[6/7] Configurando .env..."
cd "$BACKEND_DIR"

if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não existe, criando..."
    touch .env
fi

# Adicionar INSTALLATION_COMPLETE se não existir
if ! grep -q "INSTALLATION_COMPLETE" .env; then
    echo "INSTALLATION_COMPLETE=true" >> .env
    echo "✅ INSTALLATION_COMPLETE=true adicionado"
else
    echo "⚠️  INSTALLATION_COMPLETE já existe no .env"
fi

# Adicionar ALLOWED_ORIGINS se não existir
if ! grep -q "ALLOWED_ORIGINS" .env; then
    echo "ALLOWED_ORIGINS=http://meumu.com:3001,http://meumu.com,https://meumu.com" >> .env
    echo "✅ ALLOWED_ORIGINS configurado"
else
    echo "⚠️  ALLOWED_ORIGINS já existe no .env"
fi

echo ""

# 7. Reiniciar backend
echo "[7/7] Reiniciando backend..."
pm2 restart meumu-backend

if [ $? -ne 0 ]; then
    echo "⚠️  PM2 restart falhou, tentando start..."
    pm2 start src/server.js --name meumu-backend
fi

pm2 save
sleep 2
pm2 status
echo ""

# Verificar logs
echo "════════════════════════════════════════════════════════════════"
echo "  VERIFICANDO LOGS..."
echo "════════════════════════════════════════════════════════════════"
echo ""
pm2 logs meumu-backend --lines 10 --nostream
echo ""

# Resumo
echo "════════════════════════════════════════════════════════════════"
echo "  ✅ INSTALAÇÃO COMPLETA!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📍 Frontend buildado: $FRONTEND_DIR/dist"
echo "📍 Dist copiado para: $BACKEND_DIR/dist"
echo "📍 Backend rodando: $(pm2 status | grep meumu-backend | awk '{print $10}')"
echo ""
echo "🌐 ACESSE AGORA:"
echo ""
echo "   http://meumu.com:3001"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📋 COMANDOS ÚTEIS:"
echo ""
echo "  Ver logs:      pm2 logs meumu-backend"
echo "  Status:        pm2 status"
echo "  Reiniciar:     pm2 restart meumu-backend"
echo "  Parar:         pm2 stop meumu-backend"
echo ""
echo "════════════════════════════════════════════════════════════════"
