#!/bin/bash
set -e

echo "════════════════════════════════════════════════════════════════"
echo "  INSTALAÇÃO AUTOMÁTICA 100% - MeuMU Online"
echo "  Sem precisar copiar nada manualmente!"
echo "════════════════════════════════════════════════════════════════"
echo ""

cd /home/meumu.com/public_html

# ============================================================
# 1. CORRIGIR package.json AUTOMATICAMENTE
# ============================================================
echo "[1/8] Corrigindo package.json automaticamente..."

# Fazer backup
cp package.json package.json.backup.$(date +%s)

# Adicionar React e React-DOM nas dependencies se não existir
if ! grep -q '"react":' package.json; then
    # Adicionar React logo após "dependencies": {
    sed -i '/"dependencies": {/a\    "react": "18.3.1",\n    "react-dom": "18.3.1",' package.json
    echo "   ✅ React adicionado às dependencies"
else
    echo "   ⚠️  React já existe no package.json"
fi

# Adicionar TypeScript types nas devDependencies se não existir
if ! grep -q '"@types/react":' package.json; then
    sed -i '/"devDependencies": {/a\    "@types/react": "18.3.12",\n    "@types/react-dom": "18.3.1",\n    "typescript": "5.6.2",' package.json
    echo "   ✅ Types adicionados às devDependencies"
else
    echo "   ⚠️  Types já existem no package.json"
fi

echo "✅ package.json corrigido"
echo ""

# ============================================================
# 2. LIMPAR INSTALAÇÃO ANTERIOR
# ============================================================
echo "[2/8] Limpando instalação anterior..."
rm -rf node_modules package-lock.json
echo "✅ Cache limpo"
echo ""

# ============================================================
# 3. INSTALAR DEPENDÊNCIAS
# ============================================================
echo "[3/8] Instalando dependências (React incluído)..."
echo "    (Isso pode demorar 2-3 minutos, aguarde...)"
npm install --legacy-peer-deps 2>&1 | tail -10
echo "✅ Dependências instaladas"
echo ""

# ============================================================
# 4. BUILDAR FRONTEND
# ============================================================
echo "[4/8] Buildando frontend React..."
echo "    (Isso pode demorar 1-2 minutos...)"
npm run build 2>&1 | tail -10
echo "✅ Frontend buildado"
echo ""

# Verificar se dist foi criado
if [ ! -d "dist" ]; then
    echo "❌ ERRO: Pasta dist não foi criada!"
    echo ""
    echo "Verifique os logs acima para identificar o erro."
    exit 1
fi

DIST_SIZE=$(du -sh dist | cut -f1)
echo "   📦 Tamanho do build: $DIST_SIZE"
echo ""

# ============================================================
# 5. COPIAR PARA BACKEND
# ============================================================
echo "[5/8] Copiando dist para backend..."
rm -rf backend-nodejs/dist
cp -r dist backend-nodejs/

if [ ! -d "backend-nodejs/dist" ]; then
    echo "❌ ERRO: Falha ao copiar dist!"
    exit 1
fi

echo "✅ Dist copiado para backend"
echo ""

# ============================================================
# 6. REMOVER INSTALADOR WEB
# ============================================================
echo "[6/8] Removendo instalador web (não é mais necessário)..."
if [ -d "backend-nodejs/install" ]; then
    rm -rf backend-nodejs/install
    echo "✅ Instalador removido"
else
    echo "⚠️  Instalador já foi removido anteriormente"
fi
echo ""

# ============================================================
# 7. CONFIGURAR .env
# ============================================================
echo "[7/8] Configurando .env do backend..."
cd backend-nodejs

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "   O backend precisa ser instalado primeiro via instalador web."
    echo ""
    echo "   Execute: pm2 start src/server.js --name meumu-backend"
    echo "   Acesse: http://meumu.com:3001/install"
    echo "   Configure o banco de dados e depois execute este script novamente."
    exit 1
fi

# Backup do .env
cp .env .env.backup.$(date +%s)

# Marcar instalação como completa
if grep -q "INSTALLATION_COMPLETE=true" .env; then
    echo "   ⚠️  INSTALLATION_COMPLETE já está configurado"
else
    echo "INSTALLATION_COMPLETE=true" >> .env
    echo "   ✅ INSTALLATION_COMPLETE=true adicionado"
fi

# Configurar ALLOWED_ORIGINS
if grep -q "ALLOWED_ORIGINS=" .env; then
    echo "   ⚠️  ALLOWED_ORIGINS já está configurado"
else
    echo "ALLOWED_ORIGINS=http://meumu.com:3001,http://meumu.com,https://meumu.com,http://localhost:3001" >> .env
    echo "   ✅ ALLOWED_ORIGINS configurado"
fi

echo "✅ .env configurado"
echo ""

# ============================================================
# 8. REINICIAR BACKEND
# ============================================================
echo "[8/8] Reiniciando backend com PM2..."

# Parar processo anterior
pm2 delete meumu-backend 2>/dev/null || true
sleep 1

# Iniciar novo processo
pm2 start src/server.js --name meumu-backend --update-env

# Salvar configuração do PM2
pm2 save

# Aguardar inicialização
sleep 3

echo "✅ Backend reiniciado"
echo ""

# ============================================================
# VERIFICAR STATUS
# ============================================================
echo "════════════════════════════════════════════════════════════════"
echo "  VERIFICANDO STATUS..."
echo "════════════════════════════════════════════════════════════════"
echo ""

pm2 status

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ÚLTIMAS 15 LINHAS DOS LOGS:"
echo "════════════════════════════════════════════════════════════════"
echo ""

pm2 logs meumu-backend --lines 15 --nostream

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ✅ INSTALAÇÃO 100% COMPLETA!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🌐 ACESSE AGORA:"
echo ""
echo "   👉 http://meumu.com:3001"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  RESUMO DA INSTALAÇÃO:"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "✅ Frontend buildado: $(du -sh /home/meumu.com/public_html/dist 2>/dev/null | cut -f1)"
echo "✅ Dist copiado para: /home/meumu.com/public_html/backend-nodejs/dist"
echo "✅ Instalador removido: /install desabilitado"
echo "✅ CORS configurado: Múltiplas origens permitidas"
echo "✅ Backend rodando: PM2 gerenciando processo"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  COMANDOS ÚTEIS:"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "  Ver logs em tempo real:"
echo "    pm2 logs meumu-backend"
echo ""
echo "  Ver status do PM2:"
echo "    pm2 status"
echo ""
echo "  Reiniciar backend:"
echo "    pm2 restart meumu-backend"
echo ""
echo "  Parar backend:"
echo "    pm2 stop meumu-backend"
echo ""
echo "  Verificar .env:"
echo "    cat /home/meumu.com/public_html/backend-nodejs/.env"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🎮 BOA SORTE COM SEU SERVIDOR MU ONLINE! 🚀"
echo ""
echo "════════════════════════════════════════════════════════════════"
