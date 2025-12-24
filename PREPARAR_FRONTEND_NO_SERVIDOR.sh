#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "  PREPARANDO PASTA FRONTEND NO SERVIDOR"
echo "════════════════════════════════════════════════════════════════"
echo ""

cd /home/meumu.com/public_html

# Criar pasta frontend
echo "[1/4] Criando pasta frontend..."
mkdir -p frontend
cd frontend
echo "✅ Pasta criada: /home/meumu.com/public_html/frontend"
echo ""

# Criar package.json básico
echo "[2/4] Criando package.json..."
cat > package.json << 'PACKAGE_JSON_EOF'
{
  "name": "meumu-online-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "lucide-react": "^0.468.0",
    "recharts": "^2.15.0",
    "sonner": "^1.7.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.6.2",
    "vite": "^6.0.3",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49"
  }
}
PACKAGE_JSON_EOF

echo "✅ package.json criado"
echo ""

# Criar vite.config.ts
echo "[3/4] Criando vite.config.ts..."
cat > vite.config.ts << 'VITE_CONFIG_EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
})
VITE_CONFIG_EOF

echo "✅ vite.config.ts criado"
echo ""

# Criar estrutura de pastas
echo "[4/4] Criando estrutura de pastas..."
mkdir -p src/app/components
mkdir -p src/app/config
mkdir -p src/app/contexts
mkdir -p src/app/hooks
mkdir -p src/app/i18n
mkdir -p src/services
mkdir -p src/styles
mkdir -p src/types
mkdir -p src/utils
mkdir -p public
echo "✅ Estrutura criada"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "  ✅ PASTA FRONTEND PREPARADA!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "PRÓXIMOS PASSOS:"
echo ""
echo "1. Copie os arquivos do frontend do Figma Make para esta pasta"
echo ""
echo "2. Execute:"
echo "   cd /home/meumu.com/public_html/frontend"
echo "   npm install --legacy-peer-deps"
echo "   npm run build"
echo ""
echo "3. Copie o build para o backend:"
echo "   cp -r dist /home/meumu.com/public_html/backend-nodejs/"
echo ""
echo "4. Reinicie o backend:"
echo "   cd /home/meumu.com/public_html/backend-nodejs"
echo "   pm2 restart meumu-backend"
echo ""
echo "5. Acesse: http://meumu.com:3001"
echo ""
echo "════════════════════════════════════════════════════════════════"
