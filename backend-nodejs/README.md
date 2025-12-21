# 🎮 MeuMU Online - Backend API

Backend Node.js/Express completo para o servidor privado de Mu Online.

**Status:** ✅ Pronto para produção  
**Versão:** 1.0.0  
**Última Atualização:** 21/12/2024

---

## 📋 Requisitos

- **Node.js** >= 18.0.0
- **MariaDB/MySQL** (banco de dados do MU Online)
- **PM2** (opcional, para rodar 24/7)
- **VPS Linux** com acesso SSH

---

## ⚡ INÍCIO RÁPIDO (3 Passos)

### **Passo 1: Instalar Dependências**

```bash
cd /home/meumu.com/public_html/backend-nodejs
npm install
```

### **Passo 2: Configurar .env**

**Opção A: Automático (Recomendado)**
```bash
chmod +x setup-env.sh
./setup-env.sh
```

**Opção B: Manual**
```bash
cp .env.template .env
nano .env
# Configure DB_PASSWORD e JWT_SECRET
```

### **Passo 3: Iniciar Backend**

```bash
npm start
```

**Pronto!** Backend rodando em `http://localhost:3001`

---

## 🚀 Instalação Completa

### 1️⃣ Instalar Node.js na VPS

```bash
# Adicionar repositório Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt-get install -y nodejs

# Verificar instalação
node -v
npm -v
```

### 2️⃣ Instalar PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### 3️⃣ Fazer Upload do Backend

```bash
# Criar diretório
sudo mkdir -p /var/www/meumu-backend
cd /var/www/meumu-backend

# Fazer upload dos arquivos via FTP/SFTP ou clonar
# (copie todos os arquivos desta pasta para /var/www/meumu-backend)
```

### 4️⃣ Instalar Dependências

```bash
npm install
```

### 5️⃣ Configurar Variáveis de Ambiente

```bash
# Copiar exemplo de configuração
cp .env.example .env

# Editar configurações
nano .env
```

**Configurações importantes no .env:**

```env
# Porta do servidor
PORT=3001

# Banco de dados MariaDB
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_AQUI
DB_NAME=muonline

# JWT Secret (TROCAR POR UMA CHAVE FORTE!)
JWT_SECRET=GERE_UMA_CHAVE_ALEATORIA_FORTE_COM_MAIS_DE_32_CARACTERES

# CORS - Adicionar seu domínio
ALLOWED_ORIGINS=http://localhost:5173,https://seusite.com
```

### 6️⃣ Criar Tabela de Notícias (Opcional)

```sql
-- Executar no seu banco MariaDB/MySQL
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
```

### 7️⃣ Iniciar Servidor

**Modo desenvolvimento:**
```bash
npm run dev
```

**Modo produção (24/7 com PM2):**
```bash
# Iniciar
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Configurar para iniciar no boot
pm2 startup

# Verificar status
pm2 status

# Ver logs
pm2 logs meumu-api

# Reiniciar
pm2 restart meumu-api

# Parar
pm2 stop meumu-api
```

---

## 📡 Endpoints da API

### 🔐 Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/login` | Login | ❌ |
| POST | `/api/auth/register` | Registro | ❌ |
| POST | `/api/auth/verify` | Verificar token | ✅ |
| GET | `/api/auth/account` | Info da conta | ✅ |

**Exemplo de Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "accountId": "admin",
    "email": "admin@example.com",
    "isAdmin": true
  }
}
```

### 🏆 Rankings

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/rankings/resets` | Top Resets | ❌ |
| GET | `/api/rankings/pk` | Top PK | ❌ |
| GET | `/api/rankings/level` | Top Level | ❌ |
| GET | `/api/rankings/guilds` | Top Guilds | ❌ |
| GET | `/api/rankings/character/:name` | Posição do personagem | ❌ |

**Parâmetros de query:**
- `limit` (padrão: 100) - Número de resultados
- `offset` (padrão: 0) - Paginação

**Exemplo:**
```bash
curl http://localhost:3001/api/rankings/resets?limit=10
```

### 👤 Personagens

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/characters` | Listar personagens da conta | ✅ |
| GET | `/api/characters/:name` | Detalhes do personagem | ✅ |
| PUT | `/api/characters/:name/points` | Distribuir pontos | ✅ |
| POST | `/api/characters/:name/reset` | Reset de personagem | ✅ |

**Exemplo de Distribuição de Pontos:**
```bash
curl -X PUT http://localhost:3001/api/characters/MyChar/points \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"strength":100,"agility":50,"vitality":30}'
```

### 📰 Notícias

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/news` | Listar notícias | ❌ |
| GET | `/api/news/:id` | Obter notícia | ❌ |
| POST | `/api/news` | Criar notícia | ✅ Admin |
| PUT | `/api/news/:id` | Atualizar notícia | ✅ Admin |
| DELETE | `/api/news/:id` | Deletar notícia | ✅ Admin |

### 🖥️ Servidor

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/server/info` | Informações do servidor | ❌ |
| GET | `/api/server/stats` | Estatísticas em tempo real | ❌ |
| GET | `/health` | Health check | ❌ |

---

## 🔒 Segurança

### Recursos Implementados:

✅ **JWT Authentication** - Tokens seguros com expiração  
✅ **Bcrypt** - Hash de senhas com salt  
✅ **Helmet** - Headers de segurança HTTP  
✅ **CORS** - Proteção contra requisições não autorizadas  
✅ **Rate Limiting** - Proteção contra DDoS e abuso  
✅ **SQL Injection Protection** - Prepared statements  
✅ **XSS Protection** - Sanitização de inputs  

### Configurar Admin:

```sql
-- Tornar uma conta admin (ctl1_code = 8)
UPDATE MEMB_INFO SET ctl1_code = 8 WHERE memb___id = 'admin';
```

---

## 📊 Monitoramento

### Ver Logs em Tempo Real:

```bash
# Logs do PM2
pm2 logs meumu-api

# Logs do sistema
pm2 monit
```

### Verificar Status:

```bash
# Status do servidor
pm2 status

# Health check
curl http://localhost:3001/health
```

---

## 🔧 Troubleshooting

### Erro de Conexão no Banco

```bash
# Verificar se o MariaDB está rodando
sudo systemctl status mariadb

# Verificar se as credenciais estão corretas no .env
cat .env | grep DB_
```

### Porta 3001 já em uso

```bash
# Ver o que está usando a porta
sudo lsof -i :3001

# Matar processo
sudo kill -9 PID

# Ou mudar a porta no .env
PORT=3002
```

### Erro de permissão

```bash
# Dar permissão correta aos arquivos
sudo chown -R $USER:$USER /var/www/meumu-backend
chmod -R 755 /var/www/meumu-backend
```

---

## 🌐 Configurar Nginx (Produção)

```nginx
# /etc/nginx/sites-available/meumu-api
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Ativar configuração
sudo ln -s /etc/nginx/sites-available/meumu-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📦 Scripts NPM

```bash
npm start       # Iniciar em produção
npm run dev     # Iniciar em desenvolvimento (com nodemon)
```

---

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verificar logs: `pm2 logs meumu-api`
2. Verificar health check: `curl http://localhost:3001/health`
3. Verificar arquivo .env
4. Verificar conexão com MariaDB

---

## 📄 Licença

MIT License - MeuMU Online

---

**🎮 Backend criado com ❤️ para MeuMU Online**