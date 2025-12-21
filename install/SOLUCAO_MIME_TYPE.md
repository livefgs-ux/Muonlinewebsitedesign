# ⚡ SOLUÇÃO RÁPIDA - Erro MIME Type / vite.svg

## 🔥 **SEU PROBLEMA:**

```
❌ Expected a JavaScript module script but got "application/octet-stream"
❌ GET https://meumu.com/vite.svg 404 (Not Found)
```

---

## ✅ **SOLUÇÃO EM 3 PASSOS:**

### **PASSO 1: Buildar o Frontend React**

```bash
# No diretório raiz do projeto:
npm install
npm run build
```

**Isso cria a pasta `/dist` com os arquivos prontos para produção.**

---

### **PASSO 2: Configurar Servidor Web**

#### **Se usar Apache (XAMPP, etc.):**

Edite o arquivo **httpd-vhosts.conf** ou **.htaccess**:

```apache
# Apontar para /dist
DocumentRoot "C:/xampp/htdocs/meumu/dist"

<Directory "C:/xampp/htdocs/meumu/dist">
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
    
    # React Router
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^.*$ /index.html [L]
</Directory>

# MIME Types
<IfModule mod_mime.c>
    AddType application/javascript .js .mjs
    AddType application/json .json
    AddType text/css .css
    AddType image/svg+xml .svg
</IfModule>
```

**Reiniciar Apache:**
```bash
# Linux
sudo systemctl restart apache2

# Windows (XAMPP)
Painel XAMPP → Apache → Restart
```

---

#### **Se usar Nginx:**

Edite o arquivo de configuração do site:

```nginx
server {
    listen 80;
    server_name meumu.com;
    root /var/www/meumu/dist;  # ← IMPORTANTE: apontar para /dist
    index index.html;

    # API -> Backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # MIME Types
    types {
        application/javascript js mjs;
        text/css css;
        image/svg+xml svg;
    }
}
```

**Reiniciar Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### **PASSO 3: Iniciar o Backend**

```bash
cd backend-nodejs
npm install
npm start
```

**OU com PM2:**
```bash
npm install -g pm2
cd backend-nodejs
pm2 start src/server.js --name meumu-backend
pm2 save
```

---

## 🎯 **VERIFICAR SE FUNCIONOU:**

### **1. Backend rodando:**
```bash
curl http://localhost:3001/api/health
# Deve retornar: {"status":"ok"}
```

### **2. Frontend carregando:**
```
http://meumu.com
# Deve abrir o site sem erros
```

### **3. Console do browser (F12):**
```
Sem erros de MIME type
Sem erros 404 no vite.svg
```

---

## 📁 **ESTRUTURA CORRETA:**

```
/var/www/meumu/             (ou C:\xampp\htdocs\meumu\)
├── dist/                    ← Apache/Nginx aponta AQUI!
│   ├── index.html          ← Página principal
│   ├── assets/
│   │   ├── index-abc.js    ← JavaScript buildado
│   │   ├── index-def.css   ← CSS buildado
│   │   └── ...
│   └── vite.svg            ← Ícone do Vite
├── backend-nodejs/
│   ├── .env                ← Configuração do backend
│   └── src/server.js       ← Backend Node.js
└── config.php              ← Configuração PHP
```

---

## 🚀 **SCRIPTS AUTOMÁTICOS:**

### **Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
# Escolha opção 2 ou 3
```

### **Windows:**
```cmd
deploy.bat
REM Escolha opção 2 ou 3
```

---

## ⚠️ **ERROS COMUNS:**

### **1. "vite.svg 404"**
**Causa:** DocumentRoot não aponta para `/dist`  
**Solução:** Alterar DocumentRoot ou root para `/dist`

### **2. "application/octet-stream"**
**Causa:** MIME types não configurados  
**Solução:** Adicionar `AddType` (Apache) ou `types` (Nginx)

### **3. "Cannot GET /api/***"**
**Causa:** Backend não está rodando  
**Solução:** `cd backend-nodejs && npm start`

### **4. Rotas React dão 404**
**Causa:** React Router não configurado  
**Solução:** Adicionar `RewriteRule` (Apache) ou `try_files` (Nginx)

---

## 💡 **ATALHO RÁPIDO (tudo de uma vez):**

```bash
# Build + Backend
npm run build && cd backend-nodejs && npm install && npm start
```

**Então configure o servidor web para apontar para `/dist`**

---

## 📞 **AINDA NÃO FUNCIONOU?**

Me envie:
1. Screenshot do erro no console (F12)
2. Resultado de `curl http://localhost:3001/api/health`
3. Conteúdo de `ls -la dist/` ou `dir dist\`
4. Qual servidor web você usa (Apache/Nginx/IIS)

---

**MeuMU Online v2.0.0**  
Season 19-2-3 Épico  
© 2024-2025 MeuMU Team
