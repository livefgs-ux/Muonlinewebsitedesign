#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "  BUILDANDO E INSTALANDO FRONTEND - MeuMU Online"
echo "════════════════════════════════════════════════════════"
echo ""

FRONTEND_DIR="/home/meumu.com/public_html/frontend"
BACKEND_DIR="/home/meumu.com/public_html/backend-nodejs"

# Verificar se frontend existe
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Pasta frontend não encontrada!"
    echo "   Esperado: $FRONTEND_DIR"
    echo ""
    echo "OPÇÕES:"
    echo "1. Criar frontend novo (deixe-me saber)"
    echo "2. Se você tem backup, restaure em $FRONTEND_DIR"
    exit 1
fi

cd "$FRONTEND_DIR"

echo "[1/6] Verificando package.json..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado!"
    exit 1
fi
echo "✅ package.json encontrado"
echo ""

echo "[2/6] Instalando dependências do frontend..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências!"
    exit 1
fi
echo "✅ Dependências instaladas"
echo ""

echo "[3/6] Buildando frontend React..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erro ao buildar frontend!"
    exit 1
fi
echo "✅ Frontend buildado"
echo ""

echo "[4/6] Verificando pasta dist..."
if [ ! -d "dist" ]; then
    echo "❌ Pasta dist não foi criada!"
    exit 1
fi
echo "✅ Pasta dist criada"
echo ""

echo "[5/6] Copiando para backend..."
rm -rf "$BACKEND_DIR/dist"
cp -r dist "$BACKEND_DIR/"
if [ $? -ne 0 ]; then
    echo "❌ Erro ao copiar dist!"
    exit 1
fi
echo "✅ Dist copiado para backend"
echo ""

echo "[6/6] Reiniciando backend..."
cd "$BACKEND_DIR"
pm2 restart meumu-backend
sleep 2
pm2 status
echo ""

echo "════════════════════════════════════════════════════════"
echo "  ✅ FRONTEND INSTALADO COM SUCESSO!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Acesse agora:"
echo "  http://meumu.com:3001"
echo ""
echo "Ou configure seu domínio principal para apontar para :3001"
echo ""
