# 🚀 Deploy em Produção - MeuMU Online

## 📋 **CHECKLIST COMPLETO**

Após rodar o instalador PHP, você precisa:

- [ ] 1. Buildar o frontend React/Vite
- [ ] 2. Configurar servidor web (Apache/Nginx)
- [ ] 3. Iniciar backend Node.js
- [ ] 4. Configurar MIME types
- [ ] 5. Deletar pasta /install

---

## 🎨 **STEP 1: Buildar o Frontend React**

### **No diretório raiz do projeto:**

```bash
# Instalar dependências (se ainda não fez)
npm install

# Buildar para produção
npm run build
```

**Isso vai criar a pasta `/dist` com:**
- `index.html`
- `assets/` (JS, CSS, imagens)
- Arquivos otimizados e minificados

---

## 🌐 **STEP 2: Configurar Servidor Web**

### **Opção A: Apache (.htaccess)**

Crie ou edite `/public/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Redirecionar /install se não foi deletado
  RewriteCond %{REQUEST_URI} ^/install
  RewriteRule ^.*$ - [F,L]
  
  # API vai para o backend Node.js
  RewriteCond %{REQUEST_URI} ^/api
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  
  # React Router - enviar tudo para index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^.*$ /index.html [L]
</IfModule>

# MIME Types
<IfModule mod_mime.c>
  AddType application/javascript .js .mjs
  AddType application/json .json
  AddType text/css .css
  AddType image/svg+xml .svg
  AddType image/x-icon .ico
  AddType font/woff2 .woff2
</IfModule>

# Compressão
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css text/javascript application/javascript application/json
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

**Habilitar módulos Apache:**
```bash
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod mime
sudo a2enmod deflate
sudo a2enmod expires
sudo systemctl restart apache2
```

---

### **Opção B: Nginx**

Crie `/etc/nginx/sites-available/meumu.com`:

```nginx
server {
    listen 80;
    server_name meumu.com www.meumu.com;
    root /var/www/meumu/dist;
    index index.html;

    # Logs
    access_log /var/log/nginx/meumu_access.log;
    error_log /var/log/nginx/meumu_error.log;

    # Bloquear acesso ao /install
    location /install {
        deny all;
        return 403;
    }

    # API -> Backend Node.js
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # MIME Types
    types {
        application/javascript js mjs;
        application/json json;
        text/css css;
        image/svg+xml svg;
        image/x-icon ico;
        font/woff2 woff2;
    }

    # Assets (cache longo)
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Compressão
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1000;
}
```

**Ativar site:**
```bash
sudo ln -s /etc/nginx/sites-available/meumu.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🖥️ **STEP 3: Estrutura de Diretórios**

### **Configuração Recomendada:**

```
/var/www/meumu/              (ou C:\xampp\htdocs\meumu\)
├── dist/                     ← BUILD DO REACT (apontar DocumentRoot aqui)
│   ├── index.html
│   ├── assets/
│   │   ├── index-abc123.js
│   │   ├── index-def456.css
│   │   └── ...
│   └── vite.svg
├── backend-nodejs/           ← Backend Node.js
│   ├── src/
│   ├── .env                  ← Criado pelo instalador
│   ├── package.json
│   └── node_modules/
├── install/                  ⚠️ DELETAR após instalação!
├── src/                      ← Código React (não vai para produção)
├── public/
├── config.php                ← Criado pelo instalador
├── package.json
└── vite.config.js
```

### **Apache VirtualHost:**

```apache
<VirtualHost *:80>
    ServerName meumu.com
    ServerAlias www.meumu.com
    DocumentRoot /var/www/meumu/dist
    
    <Directory /var/www/meumu/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/meumu_error.log
    CustomLog ${APACHE_LOG_DIR}/meumu_access.log combined
</VirtualHost>
```

**Ativar:**
```bash
sudo a2ensite meumu.com
sudo systemctl reload apache2
```

---

## 🚀 **STEP 4: Iniciar Backend Node.js**

### **Opção 1: PM2 (Recomendado)**

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Ir para o backend
cd backend-nodejs

# Instalar dependências
npm install

# Iniciar com PM2
pm2 start src/server.js --name meumu-backend

# Salvar configuração
pm2 save

# Auto-start no boot
pm2 startup
# Copie e execute o comando que aparecer

# Ver status
pm2 status
pm2 logs meumu-backend
```

### **Opção 2: Systemd Service (Linux)**

Crie `/etc/systemd/system/meumu-backend.service`:

```ini
[Unit]
Description=MeuMU Online Backend
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/meumu/backend-nodejs
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**Ativar:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable meumu-backend
sudo systemctl start meumu-backend
sudo systemctl status meumu-backend
```

### **Opção 3: Windows Service (nssm)**

```powershell
# Baixar NSSM: https://nssm.cc/download

# Instalar serviço
nssm install MeuMUBackend "C:\Program Files\nodejs\node.exe" "C:\xampp\htdocs\meumu\backend-nodejs\src\server.js"
nssm set MeuMUBackend AppDirectory "C:\xampp\htdocs\meumu\backend-nodejs"
nssm set MeuMUBackend AppEnvironmentExtra NODE_ENV=production
nssm start MeuMUBackend
```

---

## ✅ **STEP 5: Verificar Instalação**

### **1. Testar Backend:**
```bash
curl http://localhost:3001/api/health
# Deve retornar: {"status":"ok"}
```

### **2. Testar Frontend:**
```bash
# Abrir no browser
http://meumu.com
```

### **3. Verificar MIME Types:**
```bash
curl -I http://meumu.com/assets/index-abc123.js
# Deve retornar: Content-Type: application/javascript
```

### **4. Verificar logs:**
```bash
# Backend
pm2 logs meumu-backend

# Apache
tail -f /var/log/apache2/error.log

# Nginx
tail -f /var/log/nginx/error.log
```

---

## 🔒 **STEP 6: Segurança**

### **1. Deletar pasta /install:**
```bash
rm -rf install/
# OU renomear
mv install/ install_backup/
```

### **2. Proteger arquivos sensíveis:**

**Apache (.htaccess na raiz):**
```apache
# Proteger arquivos de configuração
<FilesMatch "^(config\.php|\.env)$">
    Require all denied
</FilesMatch>
```

**Nginx:**
```nginx
location ~ ^/(config\.php|\.env) {
    deny all;
    return 404;
}
```

### **3. Atualizar permissões:**
```bash
# Linux
sudo chown -R www-data:www-data /var/www/meumu
sudo chmod -R 755 /var/www/meumu
sudo chmod 640 config.php backend-nodejs/.env

# Windows
icacls "C:\xampp\htdocs\meumu" /grant "IIS_IUSRS:(OI)(CI)RX" /T
```

---

## 🌐 **STEP 7: SSL/HTTPS (Opcional)**

### **Let's Encrypt (Gratuito):**

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-apache  # Apache
sudo apt install certbot python3-certbot-nginx   # Nginx

# Obter certificado
sudo certbot --apache -d meumu.com -d www.meumu.com     # Apache
sudo certbot --nginx -d meumu.com -d www.meumu.com      # Nginx

# Auto-renovação
sudo certbot renew --dry-run
```

**Atualizar config.php:**
```php
define('SITE_URL', 'https://meumu.com');  // HTTP → HTTPS
```

**Atualizar backend-nodejs/.env:**
```env
ALLOWED_ORIGINS=https://meumu.com,http://localhost:5173
```

---

## 🐛 **TROUBLESHOOTING**

### **Erro: "application/octet-stream"**

**Causa:** MIME types não configurados.

**Solução:**
```bash
# Apache
sudo a2enmod mime
sudo systemctl restart apache2

# Nginx - adicionar block types {} na config
```

### **Erro: "404 Not Found" em rotas React**

**Causa:** React Router não configurado.

**Solução:** Adicionar `try_files` (Nginx) ou `RewriteRule` (Apache).

### **Erro: "Cannot GET /api/***"**

**Causa:** Proxy para backend não configurado.

**Solução:** Verificar proxy_pass (Nginx) ou RewriteRule [P] (Apache).

### **Erro: "Backend não conecta ao MySQL"**

**Verificar .env:**
```bash
cd backend-nodejs
cat .env
# Conferir host, user, password
```

**Testar conexão:**
```bash
mysql -h localhost -u root -p muonline
```

---

## 📊 **CHECKLIST FINAL**

- [ ] `npm run build` executado com sucesso
- [ ] Pasta `/dist` criada com index.html
- [ ] DocumentRoot apontando para `/dist`
- [ ] Backend rodando na porta 3001
- [ ] Proxy /api configurado
- [ ] MIME types corretos
- [ ] React Router funcionando
- [ ] Pasta /install deletada
- [ ] Permissões corretas
- [ ] SSL configurado (opcional)
- [ ] Firewall liberado (portas 80, 443, 3001)

---

## 🎯 **COMANDOS RÁPIDOS**

### **Deploy completo:**
```bash
# 1. Build frontend
npm install && npm run build

# 2. Backend
cd backend-nodejs
npm install
pm2 start src/server.js --name meumu-backend
pm2 save

# 3. Limpar
cd ..
rm -rf install/

# 4. Testar
curl http://localhost:3001/api/health
curl http://localhost/
```

---

## 💡 **DICAS DE PERFORMANCE**

### **1. CDN para assets estáticos:**
Upload `/dist/assets` para Cloudflare, AWS S3, etc.

### **2. Redis para cache:**
```bash
sudo apt install redis-server
# Configurar no backend
```

### **3. Nginx + Apache (Reverse Proxy):**
Nginx serve estáticos, Apache processa PHP.

### **4. Compressão Brotli:**
```bash
sudo apt install libbrotli-dev
# Configurar no Nginx
```

---

**MeuMU Online v2.0.0**  
Season 19-2-3 Épico  
© 2024-2025 MeuMU Team
