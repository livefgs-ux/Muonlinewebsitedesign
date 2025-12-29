# 🧠 MEMÓRIA DO PROJETO - MEUMU ONLINE
**Versão:** 529  
**Data:** 2025-12-29 01:00 UTC  
**Última Atualização:** V.529 - Table Aliases Fix (undefined tables)

---

## 📊 **INFORMAÇÕES CRÍTICAS DO SERVIDOR**

### **🎮 SERVIDOR MU ONLINE**
- **Nome:** MeuMU Online
- **Versão:** Season 19-2-3 DV Teams
- **Files:** DV Teams (NÃO é IGC, NÃO é WebZen, NÃO é Season 6)
- **Rates:** EXP 9999x, Drop 60%
- **Max Reset:** 500
- **Max Grand Reset:** 50

### **💻 AMBIENTE LINUX**
- **OS:** Linux (CyberPanel)
- **Painel:** CyberPanel (NÃO é Apache, NÃO é XAMPP)
- **Domínio:** meumu.com
- **Path:** `/var/www/meumu/` ou `/home/meumu.com/public_html/`
- **Node.js:** Backend próprio (porta 3001)
- **Frontend:** React (porta 5173 dev, porta 80/443 produção)

### **🗄️ BANCO DE DADOS MARIADB**

#### **Usuário Root:**
- **Username:** `root`
- **Password:** `@mysql123@`

#### **Dual Database Architecture:**

**1. Database: `muonline` (Read-Only no site)**
- Dados do servidor MU (GameServer, ConnectServer)
- Tabelas principais:
  - ✅ `accounts` (Season 19, NÃO `MEMB_INFO`)
  - ✅ `character_info` (NÃO `Character`)
  - ✅ `guild_list`
  - ✅ `guild_members`
  - ✅ `accounts_status` (players online)
  - ✅ `account_data`
  - ✅ `character_gens`
  - ✅ `accounts_security`
  - ✅ Tabelas `WEBENGINE_*` (WebEngine CMS instalado)

**2. Database: `meuweb` (Read/Write no site)**
- Dados do site (rankings cache, logs, etc.)
- Tabelas principais:
  - `site_settings`
  - `ranking_characters`
  - `ranking_guilds`
  - `ranking_players`
  - `ranking_killers`
  - `ranking_gens`
  - `users` (autenticação site, JWT)

---

## 🔐 **ESTRUTURA DO BANCO `muonline` (SEASON 19 DV TEAMS)**

### **TABELA: `accounts`**
```sql
CREATE TABLE `accounts` (
  `account` varchar(255) PRIMARY KEY,    -- Username (NÃO memb___id)
  `password` varchar(255),                -- Hash (64 chars SHA-256)
  `guid` int(11),                         -- ID único
  `email` varchar(255),
  `blocked` tinyint(1) DEFAULT 0,
  `security_code` varchar(255),
  `ctl1_code` int(11) DEFAULT 0           -- Admin level
);
```

**COLUNAS CORRETAS:**
- ✅ `account` (não `memb___id`)
- ✅ `password` (não `memb__pwd`)
- ✅ `guid` (não `memb_guid`)
- ✅ `email` (não `mail_addr`)
- ✅ `blocked` (não `bloc_code`)

### **TABELA: `character_info`**
```sql
CREATE TABLE `character_info` (
  `name` varchar(10) PRIMARY KEY,
  `account_id` varchar(255),              -- Username (não GUID!)
  `race` tinyint(3),                      -- Class (0-239)
  `level` int(11),
  `money` bigint(20),                     -- Zen
  `reset` int(11),
  `greset` int(11),
  `points` int(11),
  `strength` int(11),
  `agility` int(11),
  `vitality` int(11),
  `energy` int(11),
  `leadership` int(11),
  `pk_count` int(11),
  `pk_level` tinyint(3),
  `online` tinyint(1) DEFAULT 0,          -- ✅ CRITICAL! Players online
  `level_master` int(11),
  `points_master` int(11),
  `level_majestic` int(11),
  `points_majestic` int(11)
);
```

**COLUNAS CORRETAS:**
- ✅ `name` (não `Name`)
- ✅ `account_id` (não `AccountID`)
- ✅ `race` (não `Class`)
- ✅ `money` (não `Zen`)
- ✅ `online` (não `ConnectStat`)

### **TABELA: `accounts_status`**
```sql
CREATE TABLE `accounts_status` (
  `account_id` varchar(255) PRIMARY KEY,
  `online` tinyint(1) DEFAULT 0,
  `current_server` int(11),
  `last_ip` varchar(15)
);
```

---

## 🔑 **ALGORITMO DE HASH (CRÍTICO!)**

### **HASH NO BANCO:**
- **Tamanho:** 64 caracteres (SHA-256)
- **Exemplo:** `0244872fafb64a346d6f70665c5225288c3b984224595c8533a4a9720a1651c6`

### **✅ ALGORITMO CORRETO (V.528):**
**DV Teams / WebEngine CMS usa:**
```javascript
SHA-256(username + ':' + password)
```

**Exemplo:**
- Username: `tiongas`
- Password: `123123`
- Hash: `SHA-256('tiongas:123123')`

**Fonte:** WebEngine CMS (codigo_de_comparacao.md, linha 13269)
```php
'password' => hash('sha256', $username.':'.$password)
```

### **ALGORITMOS SUPORTADOS (8 testes):**
1. ✅ **SHA-256(username:password)** → DV Teams / WebEngine CMS ✅ CORRETO!
2. ✅ SHA-256 puro
3. ✅ SHA-256(guid + password)
4. ✅ SHA-256(password + guid)
5. ✅ SHA-256(MD5(password))
6. ✅ SHA-256(MD5 + guid)
7. ✅ SHA-256(guid + MD5)
8. ✅ SHA-256(MD5(username:password))

### **OBSERVAÇÕES:**
- WebEngine CMS usa o mesmo banco
- GameServer consegue validar o hash
- Site NÃO consegue validar (ainda)
- Possível: Salt customizado, XOR encryption, ou Varbinary

---

## 📁 **ESTRUTURA DO PROJETO**

```
/var/www/meumu/
├── backend-nodejs/          # Node.js + Express (porta 3001)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # Dual pool (poolMU + poolWEB)
│   │   │   └── auth.js          # Mapeamento tabelas/colunas Season 19
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── serverController.js
│   │   │   ├── charactersController.js
│   │   │   └── rankingsController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   └── utils/
│   │       └── helpers.js       # 6 algoritmos de hash
│   └── .env
│
├── frontend-react/          # React + Vite (porta 5173 dev)
│   └── src/
│
└── MD Files/                # Documentação
    ├── 00-PROJETO/
    ├── 01-INSTALACAO/
    ├── 02-AUDITORIAS/
    ├── 03-SEGURANCA/
    └── 04-DATABASE/
```

---

## 🔧 **PROBLEMAS RESOLVIDOS**

### ✅ **V.525 - Players Online Falsos**
- **Problema:** Mostrava 999+ players online com servidor offline
- **Solução:** Validação de porta real do MU (55901, 55960)

### ✅ **V.527 - Estrutura Season 19 DV Teams**
- **Problema:** Queries usavam nomes Season 6 (`memb___id`, `ConnectStat`)
- **Solução:** Mapeamento completo em `auth.js` (tabelas + colunas)

---

## ❌ **PROBLEMAS PENDENTES**

### 🔴 **CRÍTICO: Login não funciona**
- **Status:** ✅ CORRIGIDO NA V.528 (aguardando testes)
- **Causa:** Hash era SHA-256(username:password), não SHA-256 puro
- **Solução:** Adicionado algoritmo correto no helpers.js
- **Próximo passo:** Executar `test-login-completo.js` para validar

### 🔴 **CRÍTICO: Rankings mostravam "undefined"**
- **Status:** ✅ CORRIGIDO NA V.529
- **Causa:** Controllers usavam `tables.characters`, mas auth.js definia `tables.characterInfo`
- **Solução:** Adicionados getters como aliases no auth.js
- **Próximo passo:** Reiniciar servidor com `pm2 restart meumu-backend`

### 🔴 **CRÍTICO: Registro de conta**
- **Status:** NÃO TESTADO
- **Depende de:** Descobrir algoritmo de hash correto

### 🟡 **IMPORTANTE: Cache de rankings**
- **Status:** NÃO IMPLEMENTADO
- **Referência:** WebEngine usa cache + cron

---

## 🎯 **CONTAS DE TESTE**

### **Conta 1: tiongas**
- **Username:** `tiongas`
- **Password:** `123123`
- **Hash no banco:** `0244872fafb64a346d6f70665c5225288c3b984224595c8533a4a9720a1651c6`
- **GUID:** (verificar no banco)
- **Status:** Existe no jogo, falha no site

---

## 📋 **COMANDOS ÚTEIS**

### **Acessar MariaDB:**
```bash
mysql -u root -p@mysql123@
USE muonline;
```

### **Ver estrutura de tabela:**
```bash
DESCRIBE accounts;
DESCRIBE character_info;
```

### **Buscar usuário:**
```sql
SELECT account, password, guid, email, blocked 
FROM accounts 
WHERE account = 'tiongas';
```

### **Ver players online:**
```sql
SELECT COUNT(*) FROM accounts_status WHERE online = 1;
SELECT COUNT(*) FROM character_info WHERE online = 1;
```

### **Testar backend:**
```bash
cd /var/www/meumu/backend-nodejs
npm start
curl http://localhost:3001/api/health
```

---

## 🚀 **PRÓXIMOS PASSOS**

1. ⏳ Executar `test-login-completo.js` para descobrir algoritmo
2. ⏳ Corrigir `helpers.js` com algoritmo correto
3. ⏳ Testar registro de conta
4. ⏳ Testar área do jogador
5. ⏳ Implementar cache de rankings
6. ⏳ Testar AdminCP

---

## 📌 **REGRAS DO PROJETO**

1. ✅ Arquivos `.md` na pasta `/MD Files/` (não raiz)
2. ✅ Sempre atualizar `install.sh` com versão ao fazer update
3. ✅ Seguir GUIDELINES.md (security-first, estrutura)
4. ✅ Dual database: `muonline` (read-only) + `meuweb` (read/write)
5. ✅ Season 19 DV Teams (não Season 6, não IGC)
6. ✅ Linux + CyberPanel (não Apache, não XAMPP)

---

**Última atualização:** 2025-12-29 01:00 UTC  
**Versão do instalador:** 529  
**Status:** ⏳ Aguardando teste de login (algoritmo corrigido)