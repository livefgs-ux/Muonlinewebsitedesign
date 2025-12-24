#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "  VERIFICANDO PASTA /install"
echo "════════════════════════════════════════════════════════"
echo ""

cd /home/meumu.com/public_html/backend-nodejs

# Caminho absoluto
echo "[1] Caminho atual:"
pwd
echo ""

# Verificar src
echo "[2] Verificando __dirname (src/):"
ls -la src/ | grep -E 'server.js|^d'
echo ""

# Subir dois níveis
echo "[3] Subindo dois níveis (../../install):"
cd src
echo "De src/, dois níveis acima seria:"
cd ../..
pwd
ls -la | grep install
echo ""

# Verificar onde está install
cd /home/meumu.com/public_html
echo "[4] Procurando pasta install:"
find . -maxdepth 3 -type d -name "install" 2>/dev/null
echo ""

# Testar caminho Node.js
cd /home/meumu.com/public_html/backend-nodejs
echo "[5] Testando caminho no Node.js:"
node -e "
const path = require('path');
const fs = require('fs');
console.log('__dirname simulado:', path.join(__dirname, 'backend-nodejs', 'src'));
const installPath = path.join(__dirname, 'backend-nodejs', 'src', '../../install');
console.log('Caminho resolvido:', path.resolve(installPath));
console.log('Existe?', fs.existsSync(installPath));

// Tentar outros caminhos
const alt1 = path.join(__dirname, 'backend-nodejs', 'install');
const alt2 = path.join(__dirname, 'install');
const alt3 = '/home/meumu.com/public_html/install';

console.log('');
console.log('Alternativa 1:', path.resolve(alt1), '→', fs.existsSync(alt1));
console.log('Alternativa 2:', path.resolve(alt2), '→', fs.existsSync(alt2));
console.log('Alternativa 3:', alt3, '→', fs.existsSync(alt3));
"
echo ""

echo "════════════════════════════════════════════════════════"
