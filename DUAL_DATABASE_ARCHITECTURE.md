# 🗄️ MeuMU Online - Arquitetura de Dual Database

## 📊 **VISÃO GERAL**

O MeuMU Online usa **2 databases separadas**:

```
┌─────────────────────────────────────────┐
│  MUONLINE (Database do Servidor MU)     │
│  ├── accounts (leitura)                 │
│  ├── character_info (leitura)           │
│  ├── guild_list (leitura)               │
│  ├── guild_members (leitura)            │
│  ├── event_ranking (leitura)            │
│  └── server_ranking (leitura)           │
└─────────────────────────────────────────┘
           ▲ (READONLY - Não modificar!)
           │
    ┌──────┴──────┐
    │   WEBSITE   │
    └──────┬──────┘
           │
           ▼ (READ + WRITE - Site pode modificar)
┌─────────────────────────────────────────┐
│  WEBMU (Database do Site)               │
│  ├── WEBENGINE_NEWS                     │
│  ├── WEBENGINE_NEWS_TRANSLATIONS        │
│  ├── WEBENGINE_VOTES                    │
│  ├── WEBENGINE_VOTE_SITES               │
│  ├── WEBENGINE_BANS                     │
│  ├── WEBENGINE_BLOCKED_IP               │
│  ├── WEBENGINE_DOWNLOADS                │
│  ├── WEBENGINE_CREDITS_LOGS             │
│  └── ... (todas WEBENGINE_*)            │
└─────────────────────────────────────────┘
```

---

## 🎯 **PROPÓSITO DE CADA DATABASE**

### **1. MUONLINE (Database do Servidor)**
- ✅ **Leitura:** Sim
- ❌ **Escrita:** Não (somente o servidor MU escreve)
- 📁 **Tabelas principais:**
  - `accounts` - Contas dos jogadores
  - `character_info` - Personagens
  - `guild_list` - Guilds
  - `event_ranking` - Rankings de eventos
  - `server_ranking` - Rankings gerais

**Uso no site:**
- Buscar contas para login
- Listar personagens
- Exibir rankings
- Verificar se conta é admin (`web_admin = 1`)

---

### **2. WEBMU (Database do Site)**
- ✅ **Leitura:** Sim
- ✅ **Escrita:** Sim
- 📁 **Tabelas principais:**
  - `WEBENGINE_NEWS` - Notícias do site
  - `WEBENGINE_VOTES` - Sistema de votação
  - `WEBENGINE_BANS` - Banimentos web
  - `WEBENGINE_DOWNLOADS` - Downloads
  - `WEBENGINE_CREDITS_LOGS` - Log de créditos

**Uso no site:**
- Gerenciar notícias
- Sistema de votos
- Banimentos (web-only)
- Downloads
- Logs e estatísticas

---

## 🔐 **AUTENTICAÇÃO SEM CRIAR ADMIN**

### **Como funciona:**

1. **Usuário faz login** com conta do MU
2. **Site consulta** `muonline.accounts`
3. **Verifica campo** `web_admin`:
   - `web_admin = 1` → Admin no site ✅
   - `web_admin = 0` → Usuário normal ❌

### **Exemplo SQL:**

```sql
-- Tornar conta "admin123" um admin do site
UPDATE muonline.accounts 
SET web_admin = 1 
WHERE account = 'admin123';

-- Remover admin
UPDATE muonline.accounts 
SET web_admin = 0 
WHERE account = 'admin123';
```

**Não é necessário criar conta separada!**

---

## 📝 **CONFIGURAÇÃO NO INSTALADOR**

### **Step 2: Database**

O instalador pede:

| Campo | Valor | Descrição |
|-------|-------|-----------|
| **Host** | `localhost` | Endereço do MySQL |
| **Porta** | `3306` | Porta do MySQL |
| **Database MU** | `muonline` | Database do servidor MU |
| **Database Web** | `webmu` | Database do site (criada automaticamente) |
| **Usuário** | `root` | Usuário MySQL |
| **Senha** | `sua_senha` | Senha MySQL |

---

## ⚙️ **ARQUIVOS DE CONFIGURAÇÃO CRIADOS**

### **1. `/backend-nodejs/.env`**

```env
# Database MU (Read Only)
DB_MU_HOST=localhost
DB_MU_PORT=3306
DB_MU_NAME=muonline
DB_MU_USER=root
DB_MU_PASSWORD=sua_senha

# Database Web (Read + Write)
DB_WEB_HOST=localhost
DB_WEB_PORT=3306
DB_WEB_NAME=webmu
DB_WEB_USER=root
DB_WEB_PASSWORD=sua_senha

# JWT
JWT_SECRET=abc123...

# Server
PORT=3001
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=http://seudominio.com
```

---

### **2. `/config.php`**

```php
<?php
// Database MU (Read Only)
define('DB_MU_HOST', 'localhost');
define('DB_MU_PORT', '3306');
define('DB_MU_NAME', 'muonline');
define('DB_MU_USER', 'root');
define('DB_MU_PASSWORD', 'sua_senha');

// Database Web (Read + Write)
define('DB_WEB_HOST', 'localhost');
define('DB_WEB_PORT', '3306');
define('DB_WEB_NAME', 'webmu');
define('DB_WEB_USER', 'root');
define('DB_WEB_PASSWORD', 'sua_senha');

// Site
define('SITE_URL', 'http://seudominio.com');
define('BACKEND_PORT', '3001');
define('BACKEND_MODE', 'pm2');
?>
```

---

## 🛠️ **O QUE O INSTALADOR FAZ**

### **Fluxo de Instalação:**

1. ✅ **Testa conexão** com database `muonline`
2. ✅ **Verifica** se tabela `accounts` existe
3. ✅ **Cria database** `webmu` (se não existir)
4. ✅ **Executa SQL** `/install/webmu_schema.sql`
5. ✅ **Cria tabelas** WEBENGINE_*
6. ✅ **Insere dados** iniciais (notícia de boas-vindas)
7. ✅ **Cria arquivo** `.env` no backend
8. ✅ **Cria arquivo** `config.php` na raiz
9. ✅ **Inicia backend** Node.js (PM2 ou standalone)
10. ✅ **Marca instalação** concluída

---

## 📋 **TABELAS WEBENGINE CRIADAS**

### **Sistema:**
- `WEBENGINE_NEWS` - Notícias
- `WEBENGINE_NEWS_TRANSLATIONS` - Traduções de notícias
- `WEBENGINE_PLUGINS` - Plugins instalados
- `WEBENGINE_CRON` - Tarefas agendadas

### **Usuários:**
- `WEBENGINE_REGISTER_ACCOUNT` - Registro de contas
- `WEBENGINE_PASSCHANGE_REQUEST` - Recuperação de senha
- `WEBENGINE_ACCOUNT_COUNTRY` - País do usuário
- `WEBENGINE_FLA` - Failed Login Attempts

### **Moderação:**
- `WEBENGINE_BANS` - Banimentos
- `WEBENGINE_BAN_LOG` - Log de banimentos
- `WEBENGINE_BLOCKED_IP` - IPs bloqueados

### **Votos:**
- `WEBENGINE_VOTES` - Votos dos usuários
- `WEBENGINE_VOTE_LOGS` - Log de votos
- `WEBENGINE_VOTE_SITES` - Sites de votação

### **Créditos:**
- `WEBENGINE_CREDITS_CONFIG` - Configuração de créditos
- `WEBENGINE_CREDITS_LOGS` - Log de transações
- `WEBENGINE_PAYPAL_TRANSACTIONS` - Transações PayPal

### **Downloads:**
- `WEBENGINE_DOWNLOADS` - Arquivos para download

---

## 🔍 **EXEMPLO DE USO NO BACKEND**

### **Node.js (Backend):**

```javascript
// Conectar em ambas databases
const muDB = mysql.createConnection({
  host: process.env.DB_MU_HOST,
  port: process.env.DB_MU_PORT,
  database: process.env.DB_MU_NAME,
  user: process.env.DB_MU_USER,
  password: process.env.DB_MU_PASSWORD
});

const webDB = mysql.createConnection({
  host: process.env.DB_WEB_HOST,
  port: process.env.DB_WEB_PORT,
  database: process.env.DB_WEB_NAME,
  user: process.env.DB_WEB_USER,
  password: process.env.DB_WEB_PASSWORD
});

// Buscar conta do MU (readonly)
const account = await muDB.query(
  'SELECT * FROM accounts WHERE account = ?',
  [username]
);

// Verificar se é admin
if (account.web_admin === 1) {
  console.log('Admin!');
}

// Salvar voto no webDB (write)
await webDB.query(
  'INSERT INTO WEBENGINE_VOTES (account, site_id) VALUES (?, ?)',
  [username, siteId]
);
```

---

## ✅ **VANTAGENS DESSA ARQUITETURA**

1. ✅ **Segurança:** Database MU não é modificada pelo site
2. ✅ **Isolamento:** Problemas no site não afetam o servidor MU
3. ✅ **Performance:** Queries separadas, sem sobrecarga
4. ✅ **Manutenção:** Backup independente de cada database
5. ✅ **Flexibilidade:** Fácil migrar o site para outro servidor

---

## 📝 **DADOS INICIAIS INSERIDOS**

### **Notícia de Boas-Vindas:**
```sql
INSERT INTO WEBENGINE_NEWS (title, content, author) VALUES
('Bem-vindo ao MeuMU Online!', 'Seu servidor está pronto!', 'Sistema');
```

### **Sites de Votação (Desabilitados):**
```sql
INSERT INTO WEBENGINE_VOTE_SITES (name, url, active) VALUES
('XtremeTop100', 'https://www.xtremetop100.com/', 0),
('TopG', 'https://topg.org/', 0);
```

### **Configuração de Créditos:**
```sql
INSERT INTO WEBENGINE_CREDITS_CONFIG (credit_name, credit_type) VALUES
('WCoins', 'wcoin'),
('Créditos', 'credits'),
('Goblin Points', 'goblin_points');
```

---

## 🆘 **TROUBLESHOOTING**

### **Erro: "Tabela accounts não encontrada"**
- Database `muonline` está errada
- Verificar nome correto do database do MU

### **Erro: "Access denied for user"**
- Usuário não tem permissão
- Executar: `GRANT ALL ON *.* TO 'root'@'localhost'`

### **Erro: "Can't create database webmu"**
- Usuário não tem permissão CREATE
- Executar: `GRANT CREATE ON *.* TO 'root'@'localhost'`

---

## 🎯 **PRÓXIMOS PASSOS**

Após instalação:

1. ✅ **Definir admin:**
   ```sql
   UPDATE muonline.accounts SET web_admin = 1 WHERE account = 'admin';
   ```

2. ✅ **Acessar site:**
   ```
   http://seudominio.com
   ```

3. ✅ **Fazer login** com conta admin

4. ✅ **Configurar** notícias, eventos, downloads no AdminCP

---

**🎮 MeuMU Online** - Arquitetura de Dual Database  
✨ Segura, eficiente e fácil de manter!
