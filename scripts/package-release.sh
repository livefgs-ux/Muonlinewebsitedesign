#!/bin/bash

##############################################
# 📦 PACKAGE RELEASE - MeuMU Online
# Cria arquivo .zip para distribuição
##############################################

VERSION="1.0.0"
PACKAGE_NAME="MeuMU-Online-v${VERSION}.zip"

echo "📦 Criando pacote de release..."

# Build do frontend
echo "🔨 Building frontend..."
npm run build

# Criar pasta temporária
TEMP_DIR="meumu-online-release"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

echo "📁 Copiando arquivos..."

# Copiar estrutura principal
cp -r install/ $TEMP_DIR/
cp -r src/ $TEMP_DIR/
cp -r backend-nodejs/ $TEMP_DIR/
cp -r api/ $TEMP_DIR/
cp -r assets/ $TEMP_DIR/
cp -r scripts/ $TEMP_DIR/

# Copiar arquivos raiz
cp index.html $TEMP_DIR/
cp package.json $TEMP_DIR/
cp vite.config.ts $TEMP_DIR/
cp postcss.config.mjs $TEMP_DIR/
cp tsconfig.json $TEMP_DIR/
cp .gitignore $TEMP_DIR/
cp README.md $TEMP_DIR/

# Criar .htaccess
cat > $TEMP_DIR/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF

# Criar config.sample.php
cat > $TEMP_DIR/config.sample.php << 'EOF'
<?php
// MeuMU Online - Configuração
// Renomeie para config.php após instalação

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'MuOnline');
define('DB_USER', 'root');
define('DB_PASSWORD', '');

define('SITE_URL', 'http://localhost');
define('BACKEND_PORT', '3001');
?>
EOF

# Limpar node_modules do backend
rm -rf $TEMP_DIR/backend-nodejs/node_modules

# Criar .env.example no backend
cat > $TEMP_DIR/backend-nodejs/.env.example << 'EOF'
DB_HOST=localhost
DB_PORT=3306
DB_NAME=MuOnline
DB_USER=root
DB_PASSWORD=

JWT_SECRET=gere_uma_chave_aleatoria_aqui
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost,https://seudominio.com
EOF

# Criar ZIP
echo "🗜️  Compactando..."
cd $TEMP_DIR
zip -r ../$PACKAGE_NAME . -q
cd ..

# Limpar
rm -rf $TEMP_DIR

# Resultado
SIZE=$(du -h $PACKAGE_NAME | cut -f1)
echo ""
echo "✅ Pacote criado com sucesso!"
echo "📦 Arquivo: $PACKAGE_NAME"
echo "📊 Tamanho: $SIZE"
echo ""
echo "🚀 Pronto para distribuir!"
