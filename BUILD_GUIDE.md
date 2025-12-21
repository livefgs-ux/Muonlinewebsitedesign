# 🏗️ Guia de Build - MeuMU Online

**Última Atualização:** 21 de Dezembro de 2024

---

## 🚀 Build de Produção

### Pré-requisitos

```bash
# Node.js 18+ instalado
node --version  # Deve ser >= 18.0.0

# NPM atualizado
npm --version   # Deve ser >= 9.0.0
```

---

## 📦 Comandos de Build

### 1. Limpar Cache (Opcional)
```bash
# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Ou com cache limpo
npm cache clean --force
npm install
```

### 2. Build de Produção
```bash
npm run build
```

**Saída esperada:**
```
vite v6.3.5 building for production...
✓ 500+ modules transformed.
dist/index.html                   2.34 kB │ gzip:  1.12 kB
dist/assets/index-[hash].css     45.67 kB │ gzip: 12.34 kB
dist/assets/index-[hash].js     234.56 kB │ gzip: 78.90 kB
✓ built in 15.23s
```

### 3. Preview Local
```bash
npm run preview
```

Acesse: `http://localhost:4173`

---

## 📁 Estrutura de Build

```
dist/
├── index.html              # HTML principal
├── assets/
│   ├── index-[hash].css    # CSS compilado e minificado
│   ├── index-[hash].js     # JavaScript compilado
│   └── [outros assets]     # Imagens, fontes, etc.
└── [outros arquivos]
```

---

## 🔧 Troubleshooting

### Erro: "Cannot resolve import"

**Solução:**
```bash
# Reinstalar dependências
rm -rf node_modules
npm install
```

### Erro: "Out of memory"

**Solução:**
```bash
# Aumentar memória do Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Erro: TypeScript

**Solução:**
```bash
# Verificar erros de tipo
npx tsc --noEmit

# Build ignorando erros (não recomendado)
npm run build -- --force
```

### Build Muito Lento

**Otimizações:**
```bash
# 1. Limpar cache do Vite
rm -rf node_modules/.vite

# 2. Build sem source maps (mais rápido)
npm run build -- --mode production

# 3. Usar SSD ao invés de HDD
# 4. Fechar outros programas pesados
```

---

## 🌐 Deploy

### 1. Deploy em Servidor Web (Apache/Nginx)

#### Copiar arquivos
```bash
# Build primeiro
npm run build

# Copiar para servidor
scp -r dist/* user@servidor:/var/www/html/
```

#### Configuração Nginx
```nginx
server {
    listen 80;
    server_name seudominio.com;
    root /var/www/html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache de assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Configuração Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access 1 year"
  ExpiresByType image/jpeg "access 1 year"
  ExpiresByType image/gif "access 1 year"
  ExpiresByType image/png "access 1 year"
  ExpiresByType text/css "access 1 month"
  ExpiresByType application/javascript "access 1 month"
</IfModule>
```

### 2. Deploy com PM2 + Nginx (Método Recomendado)

#### 1. Fazer build
```bash
npm run build
```

#### 2. Servir com servidor estático
```bash
# Instalar serve globalmente
npm install -g serve

# Ou usar com PM2
pm2 serve dist 3000 --name "meumu-frontend" --spa
```

#### 3. Nginx como proxy reverso
```nginx
server {
    listen 80;
    server_name seudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL com Certbot (HTTPS)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Renovação automática (já configurado)
sudo certbot renew --dry-run
```

---

## ⚙️ Variáveis de Ambiente

### Configuração da API

Edite: `/src/app/config/api.ts`

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://api.seudominio.com/api', // ← Altere aqui
  TIMEOUT: 30000,
  // ...
};
```

**Importante:**
- Em **desenvolvimento**: `http://localhost:3001/api`
- Em **produção**: `https://api.seudominio.com/api`

---

## 📊 Otimizações de Build

### 1. Code Splitting

O Vite já faz code splitting automático. Para otimizar ainda mais:

```javascript
// Lazy loading de rotas
import { lazy } from 'react';

const AdminCP = lazy(() => import('./components/admincp/AdminCPLayout'));
const PlayerDashboard = lazy(() => import('./components/player/PlayerDashboard'));
```

### 2. Compressão

```bash
# Instalar brotli/gzip no servidor
sudo apt install brotli

# Comprimir assets
find dist -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) -exec brotli {} \;
```

### 3. Análise de Bundle

```bash
# Instalar plugin
npm install --save-dev rollup-plugin-visualizer

# Adicionar ao vite.config (se existir)
# import { visualizer } from 'rollup-plugin-visualizer';

# Build com análise
npm run build
# Abrir stats.html gerado
```

---

## 🔍 Validação Pós-Build

### Checklist

- [ ] Build concluído sem erros
- [ ] Tamanho do bundle razoável (< 500KB gzipped)
- [ ] Assets minificados
- [ ] Source maps gerados (opcional)
- [ ] Console sem warnings
- [ ] Todas as rotas funcionando
- [ ] API conectando corretamente
- [ ] Imagens carregando
- [ ] CSS aplicado corretamente
- [ ] JavaScript executando sem erros

### Teste Manual

```bash
# 1. Iniciar preview
npm run preview

# 2. Abrir em navegador
# http://localhost:4173

# 3. Testar:
- Login/Logout
- Navegação entre páginas
- PlayerDashboard
- AdminCP
- Rankings
- Sistema de notícias
```

### Teste de Performance

```bash
# Google Lighthouse
# 1. Abrir DevTools (F12)
# 2. Aba "Lighthouse"
# 3. Selecionar "Performance"
# 4. "Generate report"

# Meta:
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
```

---

## 📱 Build para Mobile/PWA (Futuro)

### manifest.json
```json
{
  "name": "MeuMU Online",
  "short_name": "MeuMU",
  "description": "Servidor Privado de Mu Online",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#FFB800",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🎯 Métricas de Build Esperadas

### Tamanhos Típicos

| Arquivo | Tamanho Original | Gzipped |
|---------|------------------|---------|
| HTML | ~3 KB | ~1 KB |
| CSS | ~50 KB | ~12 KB |
| JavaScript | ~250 KB | ~80 KB |
| **Total** | ~303 KB | ~93 KB |

### Tempo de Build

| Máquina | Tempo Médio |
|---------|-------------|
| Dev (laptop) | 15-25s |
| Servidor VPS | 20-40s |
| Build Server | 10-15s |

---

## 🆘 Suporte

### Build falhando?

1. **Verifique versão do Node.js**
   ```bash
   node --version  # Deve ser >= 18
   ```

2. **Limpe cache**
   ```bash
   rm -rf node_modules .vite
   npm install
   ```

3. **Verifique erros no console**
   - Leia a mensagem de erro completa
   - Procure por "ERROR" ou "FAIL"

4. **Consulte documentação**
   - `/FIX_BUILD_ERROR.md` - Erros comuns
   - `/TROUBLESHOOTING.md` - Troubleshooting geral
   - `/README.md` - Documentação principal

---

## ✅ Checklist de Produção

### Antes do Deploy

- [ ] `npm run build` sem erros
- [ ] Todas as dependências instaladas
- [ ] Configuração da API correta
- [ ] Backend rodando e acessível
- [ ] Banco de dados configurado
- [ ] SSL/HTTPS configurado
- [ ] DNS apontando corretamente
- [ ] Firewall permitindo portas necessárias
- [ ] Backup do banco antes de deploy
- [ ] Testes manuais realizados

### Pós-Deploy

- [ ] Site acessível via domínio
- [ ] HTTPS funcionando
- [ ] API conectando
- [ ] Login/Logout funcionando
- [ ] Sem erros no console do navegador
- [ ] Performance aceitável
- [ ] Mobile responsivo
- [ ] Todas as páginas carregando
- [ ] Assets (imagens, CSS, JS) carregando
- [ ] Monitoramento ativo

---

**Build bem-sucedido! 🎉**

Seu site está pronto para produção!
