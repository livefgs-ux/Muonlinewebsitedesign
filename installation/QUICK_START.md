# ⚡ GUIA RÁPIDO - MeuMU Online (5 Minutos)

**Para administradores experientes que já conhecem Linux, Node.js e MySQL.**

---

## 🚀 Instalação Expressa

### 1. Requisitos Pré-Instalados

Certifique-se de ter:
- Ubuntu 20.04+ ou Debian 10+
- Node.js 18+
- MySQL/MariaDB 5.7+
- Nginx
- PM2 global

### 2. Clone e Configure (2 min)

```bash
# Clone
cd /var/www
sudo git clone https://github.com/seu-repo/meumuonline.git
cd meumuonline

# Instalar dependências
npm install
cd backend-nodejs && npm install && cd ..

# Configurar .env
cp backend-nodejs/.env.example backend-nodejs/.env
nano backend-nodejs/.env
# Edite: DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET
```

### 3. Banco de Dados (1 min)

```bash
# Criar banco webmu
mysql -u root -p << EOF
CREATE DATABASE webmu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE webmu;
EOF

# Importar tabelas
cd backend-nodejs/database
for f in *.sql; do mysql -u root -p webmu < $f; done
cd ../..
```

### 4. Build e Start (1 min)

```bash
# Build frontend
npm run build

# Iniciar backend com PM2
pm2 start backend-nodejs/src/server.js --name meumuonline-api
pm2 save
pm2 startup
```

### 5. Nginx (1 min)

```bash
# Criar config
sudo nano /etc/nginx/sites-available/meumuonline
```

Cole:

```nginx
server {
    listen 80;
    server_name seudominio.com;
    root /var/www/meumuonline/dist;
    index index.html;

    location / { try_files $uri $uri/ /index.html; }
    location /api { proxy_pass http://localhost:3001; }
}
```

```bash
# Ativar
sudo ln -s /etc/nginx/sites-available/meumuonline /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# SSL (opcional)
sudo certbot --nginx -d seudominio.com
```

---

## ✅ Pronto!

Acesse: `https://seudominio.com/install`

Complete o wizard de instalação e está pronto! 🎉

---

## 🔧 Comandos Úteis

```bash
# Ver logs
pm2 logs meumuonline-api

# Reiniciar
pm2 restart meumuonline-api

# Status
pm2 status

# Backup
mysqldump -u root -p webmu | gzip > backup.sql.gz
```

---

## 📞 Problemas?

Consulte: `/installation/INSTALLATION_GUIDE.md`
