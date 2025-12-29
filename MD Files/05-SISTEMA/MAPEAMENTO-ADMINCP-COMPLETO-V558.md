# 🗺️ MAPEAMENTO COMPLETO - ADMINCP WEBENGINE VS MEUMU
**Data:** 2025-12-29 23:00 CET  
**Objetivo:** Mapear TODAS as funcionalidades do AdminCP e verificar backend  
**Fonte:** `codigo_de_comparacao.md` linha 26746-26793  

---

## 📋 **WEBENGINE ADMINCP - MENU COMPLETO**

### **1. NEWS MANAGEMENT** 📰
```php
array("News Management", array(
    "addnews" => "Publish",
    "managenews" => "Edit / Delete",
), "fa-newspaper-o"),
```

**Funcionalidades:**
- ✏️ **Publish (addnews):** Criar nova notícia
- 📝 **Edit / Delete (managenews):** Listar, editar e deletar notícias

**Nosso Backend (verificar):**
- `/backend-nodejs/src/controllers/newsController.js`
- Rotas: `/backend-nodejs/src/routes/news.js`

---

### **2. ACCOUNT MANAGEMENT** 👥
```php
array("Account", array(
    "searchaccount" => "Search",
    "accountsfromip" => "Find Accounts from IP",
    "onlineaccounts" => "Online Accounts",
    "newregistrations" => "New Registrations",
    "accountinfo" => "", // HIDDEN
), "fa-users"),
```

**Funcionalidades:**
- 🔍 **Search (searchaccount):** Buscar conta por username/email
- 🌐 **Find Accounts from IP (accountsfromip):** Listar contas do mesmo IP
- 🟢 **Online Accounts (onlineaccounts):** Listar contas online
- 🆕 **New Registrations (newregistrations):** Últimos registros
- ℹ️ **Account Info (accountinfo):** Detalhes da conta (rota hidden)

**Nosso Backend (verificar):**
- `/backend-nodejs/src/controllers/accountsController.js` ← **EXISTE?**
- Rotas: `/backend-nodejs/src/routes/accounts.js` ← **EXISTE?**

---

### **3. CHARACTER MANAGEMENT** 🎮
```php
array("Character", array(
    "searchcharacter" => "Search",
    "editcharacter" => "", // HIDDEN
), "fa-user"),
```

**Funcionalidades:**
- 🔍 **Search (searchcharacter):** Buscar personagem
- ✏️ **Edit Character (editcharacter):** Editar stats/items (rota hidden)

**Nosso Backend (verificar):**
- `/backend-nodejs/src/controllers/charactersController.js` ← **EXISTE?**
- Rotas: `/backend-nodejs/src/routes/characters.js` ← **EXISTE?**

---

### **4. BANS MANAGEMENT** 🚫
```php
array("Bans", array(
    "searchban" => "Search",
    "banaccount" => "Ban Account",
    "latestbans" => "Latest Bans",
    "blockedips" => "Block IP (web)",
), "fa-exclamation-circle"),
```

**Funcionalidades:**
- 🔍 **Search (searchban):** Buscar bans
- 🔨 **Ban Account (banaccount):** Banir conta
- 📋 **Latest Bans (latestbans):** Últimos bans
- 🌐 **Block IP (blockedips):** Bloquear IP no site

**Nosso Backend (verificar):**
- `/backend-nodejs/src/controllers/bansController.js` ← **EXISTE?**
- Rotas: `/backend-nodejs/src/routes/bans.js` ← **EXISTE?**

---

### **5. CREDITS MANAGEMENT** 💰
```php
array("Credits", array(
    "creditsconfigs" => "Credit Configurations",
    "creditsmanager" => "Credit Manager",
    "latestpaypal" => "PayPal Donations",
    "topvotes" => "Top Voters",
), "fa-money"),
```

**Funcionalidades:**
- ⚙️ **Credit Configurations (creditsconfigs):** Configurar sistema de créditos
- 💵 **Credit Manager (creditsmanager):** Adicionar/remover créditos
- 💳 **PayPal Donations (latestpaypal):** Últimas doações PayPal
- 🗳️ **Top Voters (topvotes):** Ranking de votadores

**Nosso Backend (verificar):**
- `/backend-nodejs/src/controllers/creditsController.js` ← **EXISTE?**
- `/backend-nodejs/src/controllers/paymentsController.js` ← **EXISTE?**
- Rotas: `/backend-nodejs/src/routes/credits.js` ← **EXISTE?**

---

### **6. WEBSITE CONFIGURATION** ⚙️
```php
array("Website Configuration", array(
    "admincp_access" => "AdminCP Access",
    "connection_settings" => "Connection Settings",
    "website_settings" => "Website Settings",
    "modules_manager" => "Modules Manager",
    "navbar" => "Navigation Menu",
    "usercp" => "UserCP Menu",
), "fa-toggle-on"),
```

**Funcionalidades:**
- 🛡️ **AdminCP Access (admincp_access):** Gerenciar lista de admins
- 🔌 **Connection Settings (connection_settings):** Configurar conexão DB
- 🌐 **Website Settings (website_settings):** Configurações gerais
- 📦 **Modules Manager (modules_manager):** Ativar/desativar módulos
- 🧭 **Navigation Menu (navbar):** Editar menu do site
- 👤 **UserCP Menu (usercp):** Editar menu do UserCP

**Nosso Backend (verificar):**
- `/backend-nodejs/src/controllers/settingsController.js` ← **EXISTE?**
- Rotas: `/backend-nodejs/src/routes/settings.js` ← **EXISTE?**

---

### **7. TOOLS** 🔧
```php
array("Tools", array(
    "cachemanager" => "Cache Manager",
    "cronmanager" => "Cron Job Manager",
), "fa-wrench"),
```

**Funcionalidades:**
- 🗄️ **Cache Manager (cachemanager):** Limpar/regenerar cache
- ⏰ **Cron Job Manager (cronmanager):** Gerenciar tarefas agendadas

**Nosso Backend (verificar):**
- `/backend-nodejs/src/controllers/toolsController.js` ← **EXISTE?**
- `/backend-nodejs/src/controllers/cronController.js` ← **EXISTE?**
- Rotas: `/backend-nodejs/src/routes/tools.js` ← **EXISTE?**

---

### **8. LANGUAGES** 🌍
```php
array("Languages", array(
    "phrases" => "Phrase List",
), "fa-language"),
```

**Funcionalidades:**
- 📝 **Phrase List (phrases):** Gerenciar traduções

**Nosso Backend (verificar):**
- `/backend-nodejs/src/controllers/languagesController.js` ← **EXISTE?**
- Rotas: `/backend-nodejs/src/routes/languages.js` ← **EXISTE?**

---

### **9. PLUGINS** 🔌
```php
array("Plugins", array(
    "plugins" => "Plugins Manager",
    "plugin_install" => "Import Plugin",
), "fa-plug"),
```

**Funcionalidades:**
- 📦 **Plugins Manager (plugins):** Listar/ativar/desativar plugins
- 📥 **Import Plugin (plugin_install):** Instalar novo plugin

**Nosso Backend (verificar):**
- `/backend-nodejs/src/controllers/pluginsController.js` ← **EXISTE?**
- Rotas: `/backend-nodejs/src/routes/plugins.js` ← **EXISTE?**

---

## ✅ **CHECKLIST DE VERIFICAÇÃO**

### **Controllers que DEVEM existir:**
- [ ] `newsController.js` (CRUD de notícias)
- [ ] `accountsController.js` (Gerenciar contas)
- [ ] `charactersController.js` (Gerenciar personagens)
- [ ] `bansController.js` (Sistema de bans)
- [ ] `creditsController.js` (Sistema de créditos)
- [ ] `paymentsController.js` (PayPal/Stripe)
- [ ] `settingsController.js` (Configurações do site)
- [ ] `toolsController.js` (Cache Manager, etc.)
- [ ] `cronController.js` (Cron Jobs)
- [ ] `languagesController.js` (Traduções)
- [ ] `pluginsController.js` (Sistema de plugins)

### **Rotas que DEVEM existir:**
- [ ] `/api/admin/news` (CRUD News)
- [ ] `/api/admin/accounts` (CRUD Accounts)
- [ ] `/api/admin/characters` (CRUD Characters)
- [ ] `/api/admin/bans` (CRUD Bans)
- [ ] `/api/admin/credits` (CRUD Credits)
- [ ] `/api/admin/payments` (PayPal/Stripe)
- [ ] `/api/admin/settings` (Configurações)
- [ ] `/api/admin/tools` (Cache, Cron)
- [ ] `/api/admin/languages` (Traduções)
- [ ] `/api/admin/plugins` (Plugins)

---

## 🎯 **PRÓXIMA AÇÃO:**

1. **Verificar CADA controller** no nosso backend
2. **Listar o que FALTA**
3. **Comparar funções** (ex: WebEngine tem "Ban Account" → Nosso backend tem essa rota?)
4. **Criar controllers/rotas faltantes**

---

**FIM DO MAPEAMENTO** 🗺️  
**Status:** ⏳ AGUARDANDO VERIFICAÇÃO DOS CONTROLLERS  
