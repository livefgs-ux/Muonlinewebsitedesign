#!/bin/bash

echo "========================================================"
echo "  INSTALANDO DEPENDENCIAS - MeuMU Online Backend"
echo "========================================================"
echo ""

cd /home/meumu.com/public_html/backend-nodejs

# 1. Verificar npm
echo "[1/5] Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "ERRO: npm nao encontrado!"
    echo "Instale Node.js primeiro"
    exit 1
fi

npm --version
echo ""

# 2. Limpar node_modules antigo (se existir)
echo "[2/5] Limpando instalacao antiga..."
rm -rf node_modules package-lock.json
echo "OK"
echo ""

# 3. Instalar dependencias
echo "[3/5] Instalando dependencias (isso pode demorar)..."
npm install --production
echo ""

if [ $? -eq 0 ]; then
    echo "[OK] Dependencias instaladas com sucesso!"
else
    echo "[ERRO] Falha ao instalar dependencias!"
    exit 1
fi
echo ""

# 4. Verificar .env
echo "[4/5] Verificando .env..."
if [ ! -f .env ]; then
    echo "[AVISO] Arquivo .env nao existe!"
    echo "Sera criado durante instalacao web"
else
    echo "[OK] Arquivo .env existe"
fi
echo ""

# 5. Testar importacao
echo "[5/5] Testando modulos..."
node -e "require('express'); console.log('express: OK');"
node -e "require('mysql2'); console.log('mysql2: OK');"
node -e "require('cors'); console.log('cors: OK');"
node -e "require('dotenv'); console.log('dotenv: OK');"
echo ""

echo "========================================================"
echo "  INSTALACAO CONCLUIDA!"
echo "========================================================"
echo ""
echo "Proximo passo: iniciar o backend"
echo ""
echo "Execute:"
echo "  ./quick-start.sh"
echo ""
