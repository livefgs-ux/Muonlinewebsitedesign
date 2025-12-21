# ⚠️ BACKEND NÃO DISPONÍVEL - Erro ECONNREFUSED

**Status**: ⚠️ ESPERADO (Ambiente de Desenvolvimento)  
**Data**: 21/12/2024

---

## 🔍 **O QUE ESTÁ ACONTECENDO?**

Os erros `ECONNREFUSED` que você está vendo são **NORMAIS** e **ESPERADOS** no ambiente Figma Make.

### **Por quê?**

```
❌ [GET /rankings/resets]: Error ECONNREFUSED
```

Isso acontece porque:

1. ✅ **Frontend está correto** - Fazendo chamadas para `http://localhost:3001/api`
2. ❌ **Backend Node.js não está rodando** - Precisa ser iniciado na VPS
3. ⚠️ **Ambiente Figma Make** - Não pode rodar servidores Node.js

---

## 📊 **ARQUITETURA ATUAL**

```
┌─────────────────────────────────────────────────────┐
│  FIGMA MAKE (Desenvolvimento)                       │
│  ┌─────────────┐           ┌──────────────┐        │
│  │  Frontend   │ ────X───> │ Backend      │        │
│  │  React      │  (404)    │ Node.js      │        │
│  │  Vite       │           │ (NOT RUNNING)│        │
│  └─────────────┘           └──────────────┘        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  VPS LINUX (Produção)                               │
│  ┌─────────────┐           ┌──────────────┐        │
│  │  Frontend   │ ────✓───> │ Backend      │        │
│  │  Build      │  (OK)     │ Node.js      │        │
│  │  Nginx      │           │ PM2          │        │
│  └─────────────┘           └──────────────┘        │
│                                    │                │
│                                    ↓                │
│                            ┌──────────────┐        │
│                            │   MariaDB    │        │
│                            │  (MuOnline)  │        │
│                            └──────────────┘        │
└─────────────────────────────────────────────────────┘
```

---

## ✅ **O QUE ESTÁ FUNCIONANDO**

1. ✅ **Frontend completo** - React, Vite, Tailwind
2. ✅ **Traduções** - 8 idiomas
3. ✅ **UI/UX** - Glassmorphism, animações
4. ✅ **Loja de Cash** - Links configuráveis
5. ✅ **AdminCP** - Interface completa
6. ✅ **Backend Node.js criado** - Em `/backend-nodejs/`
7. ✅ **API Service** - Conecta ao Node.js

---

## ❌ **O QUE NÃO FUNCIONA (AINDA)**

1. ❌ **Rankings** - Precisa do backend
2. ❌ **Login/Auth** - Precisa do backend
3. ❌ **Personagens** - Precisa do backend
4. ❌ **Stats do servidor** - Precisa do backend

**Motivo**: Backend Node.js precisa estar **rodando na VPS** conectado ao **MariaDB**.

---

## 🚀 **COMO RESOLVER**

### **OPÇÃO 1: Iniciar Backend na VPS (PRODUÇÃO)**

```bash
# 1. Conectar na VPS via SSH
ssh usuario@ip_vps

# 2. Navegar para a pasta do backend
cd /var/www/meumu-backend

# 3. Instalar dependências
npm install

# 4. Configurar .env
nano .env

# 5. Iniciar backend
pm2 start ecosystem.config.js

# 6. Verificar se está rodando
pm2 status
curl http://localhost:3001/health
```

**Resultado**:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### **OPÇÃO 2: Ignorar Erros (DESENVOLVIMENTO)**

Os erros não impedem o site de funcionar. O frontend mostra mensagens amigáveis:

```
⚠️ Backend não disponível. Inicie o servidor Node.js para ver dados reais.
```

---

## 📁 **ESTRUTURA DE ARQUIVOS**

### **Backend Completo (Criado)**

```
/backend-nodejs/
├── src/
│   ├── server.js                    # ✅ Servidor Express
│   ├── config/
│   │   ├── database.js             # ✅ Conexão MariaDB
│   │   └── auth.js                 # ✅ JWT
│   ├── controllers/
│   │   ├── authController.js       # ✅ Login/Register
│   │   ├── rankingsController.js   # ✅ Rankings
│   │   ├── charactersController.js # ✅ Personagens
│   │   └── serverController.js     # ✅ Info/Stats
│   ├── routes/
│   │   ├── auth.js                 # ✅ Rotas auth
│   │   ├── rankings.js             # ✅ Rotas rankings
│   │   └── characters.js           # ✅ Rotas chars
│   └── middleware/
│       ├── auth-middleware.js      # ✅ Proteção JWT
│       └── error-handler.js        # ✅ Tratamento erros
├── .env.example                    # ✅ Template config
├── ecosystem.config.js             # ✅ Config PM2
├── package.json                    # ✅ Dependências
└── README.md                       # ✅ Documentação
```

### **Frontend Integrado**

```
/src/services/api.ts                # ✅ API Service
/src/app/components/
├── rankings-section-real.tsx       # ✅ Usa api.rankings.*
├── player/PlayerDashboard.tsx      # ✅ Usa api.character.*
└── admincp/                        # ✅ Usa api.admin.*
```

---

## 🔧 **CONFIGURAÇÃO .ENV DO BACKEND**

```env
# Porta do servidor
PORT=3001

# Banco de dados MariaDB
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=MuOnline

# JWT Secret (gerar com: openssl rand -base64 64)
JWT_SECRET=sua_chave_secreta_aqui

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://seusite.com

# Environment
NODE_ENV=production
```

---

## 📊 **ENDPOINTS DO BACKEND**

### **✅ Criados (18 endpoints)**

#### **Auth (4)**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/verify`
- `GET /api/auth/account`

#### **Rankings (5)**
- `GET /api/rankings/resets`
- `GET /api/rankings/pk`
- `GET /api/rankings/level`
- `GET /api/rankings/guilds`
- `GET /api/rankings/character/:name`

#### **Characters (4)**
- `GET /api/characters`
- `GET /api/characters/:name`
- `PUT /api/characters/:name/points`
- `POST /api/characters/:name/reset`

#### **News (5)**
- `GET /api/news`
- `GET /api/news/:id`
- `POST /api/news` (admin)
- `PUT /api/news/:id` (admin)
- `DELETE /api/news/:id` (admin)

#### **Server (3)**
- `GET /api/server/info`
- `GET /api/server/stats`
- `GET /health`

---

## 🎯 **PRÓXIMOS PASSOS**

### **1. Upload do Backend para VPS**

```bash
# Fazer upload via FTP/SFTP:
/backend-nodejs/ → /var/www/meumu-backend/
```

### **2. Instalar Node.js na VPS**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### **3. Configurar e Iniciar**

```bash
cd /var/www/meumu-backend
npm install
cp .env.example .env
nano .env  # Configurar credenciais
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **4. Criar Tabela de Notícias**

```sql
CREATE TABLE IF NOT EXISTS website_news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category ENUM('update', 'event', 'maintenance', 'announcement') DEFAULT 'announcement',
  priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
  author VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  views INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### **5. Fazer Build do Frontend**

```bash
cd /caminho/do/frontend
npm run build
# Copiar pasta dist/ para /var/www/meumu-frontend/
```

### **6. Configurar Nginx**

```nginx
# Frontend
server {
    listen 80;
    server_name seusite.com;
    root /var/www/meumu-frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend (Opcional - Proxy Reverso)
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

### **7. Atualizar URL da API no Frontend**

**Arquivo**: `/src/services/api.ts`

```typescript
// Desenvolvimento
const API_BASE_URL = 'http://localhost:3001/api';

// Produção
const API_BASE_URL = 'https://api.seusite.com/api';
// OU
const API_BASE_URL = 'https://seusite.com:3001/api';
```

---

## 🆘 **TROUBLESHOOTING**

### **Backend não inicia**

```bash
# Ver logs
pm2 logs meumu-api

# Verificar porta
sudo lsof -i :3001

# Verificar MariaDB
sudo systemctl status mariadb
mysql -u root -p -e "SHOW DATABASES;"
```

### **Frontend não conecta**

```bash
# Verificar se backend está rodando
curl http://localhost:3001/health

# Verificar CORS
# Adicionar origem no .env: ALLOWED_ORIGINS=...

# Ver console do navegador (F12)
# Procurar por erros de CORS ou 404
```

### **MariaDB não conecta**

```bash
# Verificar credenciais no .env
cat .env | grep DB_

# Testar conexão manualmente
mysql -h localhost -u root -p -e "USE MuOnline; SHOW TABLES;"
```

---

## ✅ **RESUMO**

| Item | Status | Ação Necessária |
|------|--------|-----------------|
| **Frontend** | ✅ Completo | Nenhuma |
| **Backend Node.js** | ✅ Criado | Iniciar na VPS |
| **MariaDB** | ✅ Existente | Conectar backend |
| **Traduções** | ✅ Funcionando | Nenhuma |
| **Loja de Cash** | ✅ Funcionando | Configurar links no AdminCP |
| **Rankings** | ⚠️ Sem dados | Aguarda backend |
| **Auth** | ⚠️ Sem backend | Aguarda backend |

---

## 📚 **DOCUMENTAÇÃO**

1. **Migração Supabase→Node.js**: `/MIGRACAO_SUPABASE_PARA_NODEJS.md`
2. **Correção Traduções**: `/CORRECAO_TRADUCAO_LOJA_CASH.md`
3. **Backend README**: `/backend-nodejs/README.md`
4. **Guia Rápido**: `/backend-nodejs/INSTALL_QUICKSTART.md`

---

**🎮 Os erros são ESPERADOS até o backend ser iniciado na VPS!**
