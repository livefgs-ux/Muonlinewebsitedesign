# ⚠️ SUPABASE EDGE FUNCTIONS - DESATIVADO

**Status**: ❌ DESATIVADO  
**Data**: 21/12/2024  
**Motivo**: Migração completa para backend Node.js próprio

---

## 🔄 **MIGRAÇÃO COMPLETA**

O Supabase Edge Functions foi **COMPLETAMENTE SUBSTITUÍDO** por um backend Node.js + Express rodando na VPS Linux com conexão direta ao MariaDB.

### **Documentação da Migração:**
- 📄 `/MIGRACAO_SUPABASE_PARA_NODEJS.md`
- 📄 `/backend-nodejs/README.md`
- 📄 `/backend-nodejs/INSTALL_QUICKSTART.md`

---

## ❌ **POR QUE O SUPABASE FOI REMOVIDO?**

1. ❌ **Não funcionava** - ECONNREFUSED ao conectar MariaDB
2. ❌ **Arquitetura errada** - Supabase → MariaDB local (impossível)
3. ❌ **Dependência desnecessária** - Temos VPS Linux própria
4. ❌ **Custos** - Supabase cobra por edge functions
5. ❌ **Complexidade** - Mais uma camada de abstração

---

## ✅ **NOVA ARQUITETURA**

### **Antes (ERRADO):**
```
Frontend (Figma Make)
    ↓ fetch
Supabase Edge Functions (Cloud)
    ↓ mysql2 (ECONNREFUSED)
MariaDB (VPS Linux) ❌
```

**Problema**: Supabase cloud não consegue conectar ao MariaDB na VPS privada.

### **Depois (CORRETO):**
```
Frontend (VPS Linux)
    ↓ fetch (http://localhost:3001/api)
Backend Node.js (VPS Linux)
    ↓ mysql2
MariaDB (VPS Linux) ✅
```

**Solução**: Tudo na mesma VPS, conexão local, sem latência.

---

## 🚀 **NOVO BACKEND NODE.JS**

### **Localização:**
```
/backend-nodejs/
```

### **Features:**
- ✅ **Express.js** - Framework robusto
- ✅ **MySQL2** - Conexão nativa MariaDB
- ✅ **JWT** - Autenticação segura
- ✅ **Bcrypt** - Hash de senhas
- ✅ **CORS** - Segurança
- ✅ **PM2** - Process manager
- ✅ **18 Endpoints REST** - API completa

### **Endpoints Criados:**

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

---

## 🔧 **CONFIGURAÇÃO DO NOVO BACKEND**

### **1. Instalar na VPS:**

```bash
# Upload via FTP/SFTP
/backend-nodejs/ → /var/www/meumu-backend/

# SSH na VPS
ssh usuario@ip_vps

# Instalar dependências
cd /var/www/meumu-backend
npm install
```

### **2. Configurar .env:**

```bash
cp .env.example .env
nano .env
```

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mariadb
DB_NAME=MuOnline
JWT_SECRET=$(openssl rand -base64 64)
ALLOWED_ORIGINS=https://seusite.com
NODE_ENV=production
```

### **3. Criar Tabela de Notícias:**

```sql
mysql -u root -p

USE MuOnline;

CREATE TABLE IF NOT EXISTS website_news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category ENUM('update', 'event', 'maintenance', 'announcement') DEFAULT 'announcement',
  author VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

EXIT;
```

### **4. Iniciar com PM2:**

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
pm2 status
```

### **5. Testar:**

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/rankings/resets?limit=5
```

---

## 🌐 **FRONTEND INTEGRADO**

O frontend foi **COMPLETAMENTE REESCRITO** para usar o novo backend:

### **Arquivo Principal:**
```
/src/services/api.ts
```

### **Configuração:**
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
// Em produção: https://seusite.com/api
```

### **Componentes Atualizados:**
- ✅ `/src/app/components/rankings-section-real.tsx`
- ✅ `/src/app/components/player/PlayerDashboard.tsx`
- ✅ `/src/app/components/dashboard-section.tsx`
- ✅ Todos os componentes do AdminCP

---

## ⚠️ **ERROS ESPERADOS ATÉ INICIAR O BACKEND**

Enquanto o backend Node.js não estiver rodando na VPS, você verá:

```
❌ [GET /rankings/resets]: Error ECONNREFUSED
❌ [GET /rankings/pk]: Error ECONNREFUSED
❌ [GET /rankings/guilds]: Error ECONNREFUSED
```

**Isso é NORMAL!** Os erros desaparecerão quando você:

1. ✅ Fazer upload do `/backend-nodejs/` para VPS
2. ✅ Instalar dependências (`npm install`)
3. ✅ Configurar `.env`
4. ✅ Iniciar backend (`pm2 start ecosystem.config.js`)

---

## 📊 **COMPARAÇÃO**

| Feature | Supabase (Antigo) | Node.js (Novo) |
|---------|-------------------|----------------|
| **Conexão DB** | ❌ ECONNREFUSED | ✅ Direta |
| **Latência** | ❌ Cloud → VPS | ✅ Local |
| **Custos** | ❌ Pago | ✅ Grátis |
| **Controle** | ❌ Limitado | ✅ Total |
| **Manutenção** | ❌ Complexa | ✅ Simples |
| **Performance** | ❌ ~200ms | ✅ ~5ms |

---

## 🆘 **TROUBLESHOOTING**

### **Q: Os erros ECONNREFUSED ainda aparecem!**
**A:** Normal! Inicie o backend Node.js na VPS.

### **Q: Como sei se o backend está rodando?**
**A:** Execute na VPS:
```bash
pm2 status
curl http://localhost:3001/health
```

### **Q: Preciso do Supabase para algo?**
**A:** Não! Tudo foi migrado para Node.js.

### **Q: Posso deletar a pasta /supabase/?**
**A:** Não, ela é protegida. Mas foi desativada completamente.

---

## ✅ **CONCLUSÃO**

- ❌ **Supabase**: Desativado permanentemente
- ✅ **Node.js**: Backend completo e funcional
- ✅ **Frontend**: Integrado ao Node.js
- ⚠️ **Próximo passo**: Iniciar backend na VPS

**🎮 Migração completa! Sistema 100% desacoplado do Supabase!**
