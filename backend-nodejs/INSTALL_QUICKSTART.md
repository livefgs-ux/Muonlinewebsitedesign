# ⚡ INSTALAÇÃO RÁPIDA - Backend Node.js

## 🎯 **PASSO A PASSO SIMPLIFICADO**

### **1️⃣ Instalar Node.js na VPS**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

---

### **2️⃣ Fazer Upload**

```bash
# Criar pasta
sudo mkdir -p /var/www/meumu-backend

# Fazer upload via FTP/SFTP de TODOS os arquivos desta pasta (/backend-nodejs/)
# Ou usar rsync:
rsync -avz --progress /caminho/local/backend-nodejs/ usuario@ip_vps:/var/www/meumu-backend/
```

---

### **3️⃣ Instalar Dependências**

```bash
cd /var/www/meumu-backend
npm install
```

---

### **4️⃣ Configurar .env**

```bash
cp .env.example .env
nano .env
```

**Editar:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SUA_SENHA_MARIADB_AQUI
DB_NAME=muonline

JWT_SECRET=Cole_Aqui_Uma_Chave_Aleatoria_De_64_Caracteres

ALLOWED_ORIGINS=http://localhost:5173,https://seusite.com
```

**Gerar JWT Secret:**
```bash
openssl rand -base64 64
```

---

### **5️⃣ Criar Tabela de Notícias**

```bash
mysql -u root -p
```

```sql
USE MuOnline;

CREATE TABLE IF NOT EXISTS website_news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category ENUM('update', 'event', 'maintenance', 'announcement') DEFAULT 'announcement',
  priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
  author VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  views INT DEFAULT 0,
  INDEX idx_category (category),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

EXIT;
```

---

### **6️⃣ Iniciar Backend**

```bash
# Iniciar
pm2 start ecosystem.config.js

# Salvar
pm2 save

# Auto-start no boot
pm2 startup
# (copiar e executar o comando que aparecer)

# Verificar status
pm2 status
```

---

### **7️⃣ Testar**

```bash
# Health check
curl http://localhost:3001/health

# Info do servidor
curl http://localhost:3001/api/server/info

# Rankings
curl http://localhost:3001/api/rankings/resets?limit=5
```

---

## ✅ **PRONTO!**

Seu backend está rodando em: **http://localhost:3001**

---

## 📋 **COMANDOS PM2 ÚTEIS**

```bash
pm2 status           # Ver status
pm2 logs meumu-api   # Ver logs
pm2 restart meumu-api  # Reiniciar
pm2 stop meumu-api   # Parar
pm2 monit            # Monitorar em tempo real
```

---

## 🔧 **CONFIGURAR NGINX (Opcional)**

```nginx
server {
    listen 80;
    server_name api.seusite.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo nano /etc/nginx/sites-available/meumu-api
sudo ln -s /etc/nginx/sites-available/meumu-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🆘 **PROBLEMAS?**

### **Backend não inicia:**
```bash
pm2 logs meumu-api  # Ver erro
```

### **Erro de conexão no banco:**
```bash
sudo systemctl status mariadb  # Ver se MariaDB está rodando
cat .env | grep DB_  # Verificar credenciais
```

### **Porta 3001 em uso:**
```bash
sudo lsof -i :3001  # Ver o que está usando
# Ou alterar PORT no .env para 3002
```

---

**🚀 Instalação completa!**