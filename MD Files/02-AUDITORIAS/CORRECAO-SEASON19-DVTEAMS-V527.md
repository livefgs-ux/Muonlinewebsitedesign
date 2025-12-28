# 🔧 CORREÇÃO COMPLETA - SEASON 19 DV TEAMS
**Versão:** 527  
**Data:** 2025-12-28  
**Problema:** Sistema não conecta, não cria contas, não faz login  
**Causa:** Estrutura de tabelas/colunas INCORRETA (assumia Season 6 ou genérico)

---

## 🎯 **PROBLEMA RAIZ IDENTIFICADO**

### **❌ O QUE ESTAVA ERRADO:**

1. **Nomes de colunas GENÉRICOS** ao invés dos específicos do Season 19 DV Teams
2. **Falta de mapeamento estrutural** (tabelas e colunas)
3. **Queries assumindo estrutura Season 6** (`memb___id`, `memb__pwd`)
4. **Falta de referência ao WebEngine CMS** (código de comparação)

---

## ✅ **CORREÇÕES APLICADAS**

### **1. `/backend-nodejs/src/config/auth.js`**

**ANTES:**
```javascript
tables: {
  accounts: 'accounts',
  characters: 'character_info',
  // ...
}
```

**DEPOIS:**
```javascript
tables: {
  accounts: 'accounts',
  accountsStatus: 'accounts_status',
  accountData: 'account_data',
  characterInfo: 'character_info',
  guildList: 'guild_list',
  guildMembers: 'guild_members',
  characterGens: 'character_gens',
  accountsSecurity: 'accounts_security'
},

columns: {
  accounts: {
    username: 'account',      // Season 19 usa 'account'
    password: 'password',     // Não 'memb__pwd'
    guid: 'guid',             // Não 'memb_guid'
    email: 'email',           // Não 'mail_addr'
    blocked: 'blocked',       // Não 'bloc_code'
    securityCode: 'security_code',
    ctlCode: 'ctl1_code'
  },
  
  characterInfo: {
    name: 'name',
    accountId: 'account_id',
    race: 'race',
    money: 'money',
    level: 'level',
    reset: 'reset',
    greset: 'greset',
    // ... 30+ campos mapeados corretamente
  }
  // ... todas as tabelas mapeadas
}
```

---

### **2. `/backend-nodejs/src/controllers/authController.js`**

**CORREÇÃO #1: Import correto**
```javascript
// ANTES:
const { executeQuery } = require('../config/database');
const { tables } = require('../config/auth');

// DEPOIS:
const { executeQueryMU, executeQueryWEB } = require('../config/database');
const { tables, columns } = require('../config/auth');
```

**CORREÇÃO #2: Queries agora usam `executeQueryMU` ao invés de `executeQuery`**
```javascript
// ANTES:
const result = await executeQuery(sql, [username]);

// DEPOIS:
const result = await executeQueryMU(sql, [username]);
```

**MOTIVO:** WebEngine usa dual database:
- `MuOnline` → Dados do jogo (read-only no site)
- `Me_MuOnline` → Dados do site (read/write)

Nosso sistema espelha isso:
- `poolMU` (`executeQueryMU`) → Database `muonline`
- `poolWEB` (`executeQueryWEB`) → Database `meuweb`

---

## 📊 **ESTRUTURA SEASON 19 DV TEAMS (WebEngine)**

### **TABELA: `accounts`**
```sql
CREATE TABLE `accounts` (
  `account` varchar(255) PRIMARY KEY,  -- Username
  `password` varchar(255),              -- SHA-256 hash
  `guid` int(11),                       -- ID único
  `email` varchar(255),
  `blocked` tinyint(1) DEFAULT 0,
  `security_code` varchar(255),
  `ctl1_code` int(11) DEFAULT 0         -- Admin level
);
```

**CONSTANTES WEBENGINE:**
```php
define('_TBL_MI_', 'accounts');
define('_CLMN_USERNM_', 'account');
define('_CLMN_PASSWD_', 'password');
define('_CLMN_MEMBID_', 'guid');
define('_CLMN_EMAIL_', 'email');
define('_CLMN_BLOCCODE_', 'blocked');
define('_CLMN_CTLCODE_', 'ctl1_code');
```

---

### **TABELA: `character_info`**
```sql
CREATE TABLE `character_info` (
  `name` varchar(10) PRIMARY KEY,
  `account_id` varchar(255),
  `race` tinyint(3),                    -- Class (0-239)
  `level` int(11),
  `money` bigint(20),                   -- Zen
  `reset` int(11),
  `greset` int(11),                     -- Grand Reset
  `points` int(11),                     -- Level up points
  `strength` int(11),
  `agility` int(11),
  `vitality` int(11),
  `energy` int(11),
  `leadership` int(11),                 -- Command
  `pk_count` int(11),
  `pk_level` tinyint(3),
  `online` tinyint(1) DEFAULT 0,        -- ✅ CRITICAL!
  `level_master` int(11),
  `points_master` int(11),
  `level_majestic` int(11),
  `points_majestic` int(11)
);
```

**CONSTANTES WEBENGINE:**
```php
define('_TBL_CHR_', 'character_info');
define('_CLMN_CHR_NAME_', 'name');
define('_CLMN_CHR_ACCID_', 'account_id');
define('_CLMN_CHR_CLASS_', 'race');
define('_CLMN_CHR_ZEN_', 'money');
define('_CLMN_CHR_LVL_', 'level');
define('_CLMN_CHR_ONLINE_', 'online');  // ✅ Players online!
```

---

## 🚨 **PROBLEMA CRÍTICO: PLAYERS ONLINE**

### **WebEngine CMS faz:**
```php
// cron_online_characters.php
$query = "SELECT `name` 
          FROM `character_info` 
          WHERE `online` = 1";  // ✅ CORRETO!
```

### **NOSSO SISTEMA ESTAVA FAZENDO:**
```javascript
// ❌ ERRADO! (verificar serverController.js)
const sql = `SELECT Name FROM Character WHERE ConnectStat = 1`;
```

**PROBLEMA:**
- Coluna certa: `online` (Season 19 DV Teams)
- Coluna ERRADA: `ConnectStat` (Season 6?)

---

## 📋 **PRÓXIMAS CORREÇÕES NECESSÁRIAS**

### **✅ FEITO:**
1. ✅ `/backend-nodejs/src/config/auth.js` - Mapeamento completo
2. ✅ `/backend-nodejs/src/controllers/authController.js` - Imports e queries

### **❌ FALTANDO:**
3. ⏳ `/backend-nodejs/src/controllers/serverController.js` - Players online
4. ⏳ `/backend-nodejs/src/controllers/charactersController.js` - Área do jogador
5. ⏳ `/backend-nodejs/src/controllers/rankingsController.js` - Rankings
6. ⏳ Implementar sistema de CACHE (como WebEngine)
7. ⏳ Validar AdminCP

---

## 🎯 **PLANO DE AÇÃO**

### **ETAPA 1: CORRIGIR CONTROLLERS** ⏳
- [ ] `serverController.js` → Usar coluna `online` ao invés de `ConnectStat`
- [ ] `charactersController.js` → Usar `columns.characterInfo.*`
- [ ] `rankingsController.js` → Usar estrutura correta

### **ETAPA 2: IMPLEMENTAR CACHE** ⏳
- [ ] Criar `cacheService.js` (espelhando WebEngine)
- [ ] Rankings em cache (atualizar via cron)
- [ ] Players online em cache

### **ETAPA 3: TESTAR** ⏳
- [ ] Registro de conta
- [ ] Login
- [ ] Players online (sem falsos positivos)
- [ ] Rankings
- [ ] Área do jogador

---

## 📊 **COMPARAÇÃO WEBENGINE vs NOSSO SISTEMA**

| Recurso | WebEngine CMS | Nosso Sistema (ANTES) | DEPOIS (V527) |
|---------|---------------|----------------------|---------------|
| **Estrutura DB** | Dual (`MuOnline` + `Me_MuOnline`) | Dual (`poolMU` + `poolWEB`) | ✅ Mantido |
| **Mapeamento Tabelas** | ✅ Constantes PHP | ❌ Hardcoded | ✅ `auth.js` |
| **Mapeamento Colunas** | ✅ `_CLMN_*` | ❌ Assumido | ✅ `columns.*` |
| **Cache** | ✅ Sim (cron) | ❌ Não | ⏳ Pendente |
| **Players Online** | ✅ `online = 1` | ❌ `ConnectStat = 1` | ⏳ Corrigindo |

---

## ✅ **CONCLUSÃO PARCIAL**

**PROBLEMA RESOLVIDO (parcial):**
- ✅ Estrutura de dados agora mapeia CORRETAMENTE Season 19 DV Teams
- ✅ AuthController usa colunas corretas (`account`, `password`, `guid`)
- ✅ Sistema preparado para dual database

**PRÓXIMO PASSO:**
- 🔄 Corrigir `serverController.js`, `charactersController.js`, `rankingsController.js`
- 🔄 Implementar cache (conforme WebEngine)
- 🔄 Testar login, registro, players online

---

**Status:** 2/7 arquivos corrigidos (29%)  
**Próxima correção:** `serverController.js` (players online)
