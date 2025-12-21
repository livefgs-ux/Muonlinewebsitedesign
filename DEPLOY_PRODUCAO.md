# 🚀 DEPLOY DE PRODUÇÃO - MeuMU Online

## ✅ **PROCEDIMENTO CORRETO**

### **O que DEVE acontecer em produção:**

1. ✅ Build do frontend (`npm run build`)
2. ✅ Copiar `/dist` para a raiz do domínio
3. ✅ Servidor web (Apache/Nginx/LiteSpeed) serve APENAS arquivos estáticos
4. ✅ Backend Node.js roda separado na porta 3001
5. ✅ Navegador recebe APENAS JavaScript compilado

---

## 🔴 **O QUE NUNCA FAZER EM PRODUÇÃO:**

### ❌ **JAMAIS:**

- Rodar Vite dev server em produção
- Expor arquivos `.tsx` ou `/src` publicamente
- Usar porta 5173 em produção
- Servir `index.html` de desenvolvimento
- Deixar `vite.config.ts` na raiz pública

### **Por quê?**

- 🔒 **Segurança:** Expõe código-fonte
- ⚡ **Performance:** Vite dev é lento para múltiplos usuários
- 🐛 **Estabilidade:** Dev server não é production-ready
- 📦 **Tamanho:** Arquivos não otimizados/comprimidos

---

## 📋 **FLUXO CORRETO DE DEPLOY**

### **Estrutura de Diretórios:**

```
/home/meumu.com/
├── public_html/           # ← Raiz pública (servida pelo Apache/Nginx)
│   ├── index.html         # ← Do build (contém /assets/index-XXX.js)
│   ├── assets/            # ← Bundle JS/CSS compilado
│   │   ├── index-a1b2c3.js
│   │   └── index-a1b2c3.css
│   └── .htaccess          # ← Configuração Apache
│
├── src/                   # ← Código-fonte (FORA da raiz pública!)
│   ├── app/
│   ├── main.tsx
│   └── ...
│
├── backend-nodejs/        # ← Backend separado
│   └── src/
│       └── server.js
│
├── package.json
├── vite.config.ts
└── node_modules/
```

---

## 🚀 **DEPLOY AUTOMATIZADO**

### **Opção 1: Script Automatizado (Recomendado)**

```bash
cd /home/meumu.com/public_html
chmod +x deploy-production.sh
bash deploy-production.sh
```

**O script faz:**
1. ✅ `npm run build`
2. ✅ Backup da raiz atual
3. ✅ Remove arquivos de dev
4. ✅ Copia `dist/*` para raiz
5. ✅ Reinicia servidor web
6. ✅ Verifica se está correto

---

### **Opção 2: Manual**

```bash
cd /home/meumu.com/public_html

# 1. Build
npm run build

# 2. Remover arquivos de dev da raiz
rm -f index.html
rm -rf src
rm -f vite.config.ts tsconfig.json postcss.config.mjs

# 3. Copiar build
cp -r dist/* .

# 4. Verificar
grep "/assets/index-" index.html
# Deve retornar: <script ... src="/assets/index-XXXXX.js"></script>

# 5. Reiniciar servidor
sudo systemctl restart lsws  # LiteSpeed
# OU
sudo systemctl restart apache2  # Apache
# OU
sudo systemctl restart nginx  # Nginx
```

---

## ✅ **VERIFICAÇÃO PÓS-DEPLOY**

### **1. Verificar arquivos na raiz:**

```bash
cd /home/meumu.com/public_html
ls -la

# Deve ter:
✅ index.html          # Do build
✅ assets/             # Bundle compilado
✅ backend-nodejs/     # Backend separado
✅ .htaccess           # Config Apache

# NÃO deve ter:
❌ src/
❌ vite.config.ts
❌ main.tsx
❌ node_modules/       # Pode estar, mas não é servido
```

### **2. Verificar conteúdo do index.html:**

```bash
cat index.html | grep -o '/assets/index-[^"]*'

# Deve retornar algo como:
/assets/index-a1b2c3d4.js
```

### **3. Testar no navegador:**

```
1. Abrir: https://meumu.com
2. Pressionar F12 → Application → Sources
3. Verificar estrutura:

✅ CORRETO:
   ├── (index)
   ├── assets/
   │   ├── index-a1b2c3.js
   │   └── index-a1b2c3.css
   └── api/ (proxy)

❌ ERRADO:
   ├── src/
   ├── main.tsx
   └── vite.config.ts
```

### **4. Verificar console (F12):**

```javascript
// ✅ Não deve ter:
[vite] connecting...
[vite] connected.

// ✅ Deve funcionar normalmente sem erros
```

---

## 🔧 **CONFIGURAÇÃO DO BACKEND**

O backend Node.js roda **SEPARADAMENTE** do frontend:

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Iniciar com PM2
pm2 start src/server.js --name meumu-backend
pm2 save
pm2 startup
```

**Portas:**
- Frontend estático: Servido por Apache/Nginx na porta 80/443
- Backend API: Node.js na porta 3001 (proxy reverso)

---

## 📝 **CONFIGURAÇÃO APACHE (.htaccess)**

```apache
# Proxy para API
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api
RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]

# SPA fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Segurança
<FilesMatch "\.(tsx?|ts|jsx?|json)$">
    Require all denied
</FilesMatch>

# Cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/javascript "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
</IfModule>
```

---

## 🔄 **WORKFLOW DE DESENVOLVIMENTO → PRODUÇÃO**

### **Desenvolvimento (local):**
```bash
npm run dev
# Roda em http://localhost:5173
# Vite transpila .tsx em tempo real
```

### **Build:**
```bash
npm run build
# Gera /dist com arquivos compilados
```

### **Deploy:**
```bash
bash deploy-production.sh
# Copia /dist para raiz pública
# Remove arquivos de dev
# Reinicia servidor
```

---

## 🐛 **TROUBLESHOOTING**

### **Erro: "MIME type text/html"**

**Causa:** `index.html` de desenvolvimento está sendo servido.

**Solução:**
```bash
cd /home/meumu.com/public_html
grep "/assets/" index.html

# Se não retornar nada:
rm index.html
cp dist/index.html .
```

---

### **Erro: "Module not found"**

**Causa:** Backend não está rodando ou proxy não configurado.

**Solução:**
```bash
# Verificar backend
pm2 status meumu-backend

# Se não estiver rodando:
cd /home/meumu.com/public_html/backend-nodejs
pm2 start src/server.js --name meumu-backend

# Testar
curl http://localhost:3001/health
```

---

### **Arquivos .tsx sendo servidos**

**Causa:** Arquivos de dev na raiz pública.

**Solução:**
```bash
cd /home/meumu.com/public_html
rm -rf src vite.config.ts tsconfig.json
```

---

## 📊 **CHECKLIST FINAL**

Antes de considerar o deploy concluído:

- [ ] `npm run build` executado sem erros
- [ ] `/dist` foi copiado para raiz pública
- [ ] `index.html` contém `/assets/index-XXXXX.js`
- [ ] Arquivos `.tsx` NÃO estão na raiz pública
- [ ] Backend rodando (PM2)
- [ ] `https://meumu.com` carrega sem erros
- [ ] Console (F12) sem erros de MIME type
- [ ] Sources (F12) mostra apenas `/assets`
- [ ] Proxy `/api` funcionando

---

## 🎯 **COMANDOS RÁPIDOS**

```bash
# Deploy completo
cd /home/meumu.com/public_html && bash deploy-production.sh

# Verificar estrutura
ls -la /home/meumu.com/public_html

# Verificar index.html
grep "/assets/" /home/meumu.com/public_html/index.html

# Verificar backend
pm2 status

# Logs
pm2 logs meumu-backend
```

---

## ✅ **CONCLUSÃO**

**Regra de ouro:**

> Em produção, o navegador NUNCA deve ver:
> - Arquivos `.tsx`
> - Diretório `/src`
> - Vite dev server
> - Porta 5173
> 
> Apenas arquivos compilados em `/assets`.

---

**📖 Para mais informações, consulte:**
- [BUILD_GUIDE.md](./BUILD_GUIDE.md)
- [STATUS_FINAL_21DEC.md](./STATUS_FINAL_21DEC.md)
