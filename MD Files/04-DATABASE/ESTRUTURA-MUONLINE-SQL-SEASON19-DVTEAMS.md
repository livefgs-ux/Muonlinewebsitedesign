# 📊 ESTRUTURA MUONLINE.SQL - SEASON 19 DV TEAMS
**Fonte:** muonline.sql dump completo (2025-11-18 21:38:11)  
**MySQL Version:** 5.7.41-log  
**Status:** ✅ **FONTE DE VERDADE ABSOLUTA**

---

## 🎯 **TABELAS PRINCIPAIS**

### **1. `accounts`** - Contas de Usuários

```sql
CREATE TABLE `accounts` (
  `guid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `blocked` tinyint(3) unsigned DEFAULT '0',
  `security_code` varchar(255) DEFAULT '0',
  `golden_channel` bigint(20) DEFAULT '1500434821',
  `facebook_status` tinyint(3) unsigned DEFAULT '0',
  `secured` tinyint(3) unsigned DEFAULT '1',
  `account` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `register` bigint(20) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `web_admin` int(11) DEFAULT '0',
  `deletion_token` varchar(40) NOT NULL DEFAULT '0',
  `passlost_token` varchar(40) NOT NULL DEFAULT '0',
  `email_token` varchar(40) NOT NULL DEFAULT '0',
  `new_email` varchar(64) NOT NULL DEFAULT '0',
  `social_id` varchar(13) NOT NULL DEFAULT '0',
  `activated` int(11) DEFAULT '0',
  `DiscordDiscriminator` int(11) DEFAULT NULL,
  `DiscordAvatar` varchar(255) DEFAULT NULL,
  `DiscordId` int(11) DEFAULT NULL,
  `DiscordUsername` varchar(255) DEFAULT NULL,
  `DiscordEmail` varchar(255) DEFAULT NULL,
  `DiscordLogin` int(11) DEFAULT '0',
  `token` varchar(50) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `ip` varchar(20) DEFAULT NULL,
  `registration_token` varchar(40) DEFAULT NULL,
  `lock_token` varchar(40) DEFAULT NULL,
  `ban_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `creation_counter` smallint(6) DEFAULT '0',
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
```

**Campos Chave:**
- 🔑 **PK:** `guid` (INT AUTO_INCREMENT)
- 👤 **Username:** `account` (VARCHAR)
- 🔐 **Password:** `password` (VARCHAR - SHA-256)
- 📧 **Email:** `email` (VARCHAR)
- 🚫 **Blocked:** `blocked` (TINYINT 0/1)
- 👑 **Admin:** `web_admin` (INT - >0 = admin)

**⚠️ CAMPOS QUE NÃO EXISTEM:**
- ❌ `ctl1_code` → Use `web_admin`
- ❌ `memb___id` → Use `account`
- ❌ `memb__pwd` → Use `password`
- ❌ `vip_expire_date` → Está em `account_data`
- ❌ `wcoin_p` → Está em `account_data`

---

### **2. `account_data`** - Dados Extras da Conta

```sql
CREATE TABLE `account_data` (
  `account_id` int(10) unsigned NOT NULL,
  `vip_status` int(11) DEFAULT '-1',
  `vip_duration` bigint(20) DEFAULT NULL,
  `expanded_warehouse` tinyint(3) unsigned DEFAULT NULL,
  `expanded_warehouse_time` bigint(20) DEFAULT NULL,
  `special_character` smallint(5) unsigned DEFAULT NULL,
  `credits` int(10) unsigned DEFAULT NULL,
  `web_credits` int(10) unsigned DEFAULT NULL,
  `current_character` int(10) unsigned DEFAULT NULL,
  `current_type` tinyint(3) unsigned DEFAULT NULL,
  `current_ip` varchar(16) DEFAULT NULL,
  `current_mac` varchar(50) DEFAULT NULL,
  `current_diskserial` int(10) unsigned DEFAULT NULL,
  `current_server` smallint(5) unsigned DEFAULT NULL,
  `cash_shop_discount_wc` tinyint(3) unsigned DEFAULT NULL,
  `cash_shop_discount_gp` tinyint(3) unsigned DEFAULT NULL,
  `cash_shop_discount_date` bigint(20) DEFAULT NULL,
  `goblin_points` int(11) DEFAULT NULL,
  PRIMARY KEY (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

**Campos Chave:**
- 🔗 **FK:** `account_id` → `accounts.guid`
- 💰 **Credits:** `credits` (INT - WCoin)
- 🌐 **Web Credits:** `web_credits` (INT)
- 👹 **Goblin Points:** `goblin_points` (INT)
- 👑 **VIP Status:** `vip_status` (INT - -1=sem VIP, >0=ativo)
- ⏰ **VIP Expiration:** `vip_duration` (BIGINT timestamp)

**⚡ USO:**
```sql
-- Buscar conta com credits/vip
SELECT 
  a.account, a.email, a.guid, a.blocked, a.web_admin,
  ad.credits, ad.web_credits, ad.goblin_points, 
  ad.vip_status, ad.vip_duration
FROM accounts a
LEFT JOIN account_data ad ON a.guid = ad.account_id
WHERE a.account = 'username';
```

---

### **3. `character_info`** - Personagens

```sql
CREATE TABLE `character_info` (
  `guid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` int(10) unsigned DEFAULT NULL,
  `authority` tinyint(3) unsigned DEFAULT '0',
  `race` smallint(5) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slot` tinyint(4) DEFAULT '1',
  `level` smallint(6) DEFAULT '0',
  `level_master` smallint(6) DEFAULT '0',
  `level_majestic` smallint(6) DEFAULT '0',
  `experience` bigint(20) DEFAULT '0',
  `experience_master` bigint(20) DEFAULT '0',
  `experience_majestic` bigint(20) DEFAULT '0',
  `points` int(11) DEFAULT '0',
  `points_master` int(11) DEFAULT '0',
  `points_majestic` int(11) DEFAULT '0',
  `strength` int(10) unsigned DEFAULT '0',
  `agility` int(10) unsigned DEFAULT '0',
  `vitality` int(10) unsigned DEFAULT '0',
  `energy` int(10) unsigned DEFAULT '0',
  `leadership` int(10) unsigned DEFAULT '0',
  `world` smallint(5) unsigned DEFAULT '0',
  `world_x` smallint(6) DEFAULT '0',
  `world_y` smallint(6) DEFAULT '0',
  `direction` tinyint(3) unsigned DEFAULT '0',
  `money` int(10) unsigned DEFAULT '0',
  `life` int(11) DEFAULT '0',
  `mana` int(11) DEFAULT '0',
  `shield` int(11) DEFAULT '0',
  `stamina` int(11) DEFAULT '0',
  `add_fruit_points` int(11) DEFAULT '0',
  `dec_fruit_points` int(11) DEFAULT '0',
  `expanded_inventory` tinyint(3) unsigned DEFAULT '0',
  `mute_time` bigint(20) DEFAULT '0',
  `admin_flags` int(10) unsigned DEFAULT '0',
  `pk_level` tinyint(3) unsigned DEFAULT '3',
  `pk_count` int(11) DEFAULT '0',
  `pk_points` int(11) DEFAULT '0',
  `first_time` tinyint(3) unsigned DEFAULT '1',
  `santa_claus_gift` bigint(20) DEFAULT '0',
  `personal_store_name` varchar(255) DEFAULT '0',
  `personal_store_open` tinyint(4) DEFAULT '0',
  `last_use` bigint(20) DEFAULT '0',
  `kick_time` bigint(20) DEFAULT '0',
  `post_count` int(11) DEFAULT '0',
  `post_day` tinyint(3) unsigned DEFAULT '0',
  `post_month` tinyint(3) unsigned DEFAULT '0',
  `ruud_money` int(10) unsigned DEFAULT '0',
  `hunting_log_visible` tinyint(3) unsigned DEFAULT '0',
  `create_date` bigint(20) DEFAULT '0',
  `online` tinyint(4) DEFAULT '0',
  `server_code` smallint(5) unsigned DEFAULT '3',
  `reset` int(10) unsigned DEFAULT '0',
  `monster_soul_purchase` int(11) DEFAULT '0',
  `lastserver` int(11) DEFAULT '0',
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
```

**Campos Chave:**
- 🔑 **PK:** `guid` (INT AUTO_INCREMENT)
- 🔗 **FK:** `account_id` → `accounts.guid`
- 👤 **Name:** `name` (VARCHAR)
- 🎭 **Class:** `race` (SMALLINT 0-767)
- ⬆️ **Level:** `level` (SMALLINT)
- 🌟 **Master Level:** `level_master` (SMALLINT)
- 👑 **Majestic Level:** `level_majestic` (SMALLINT)
- 💰 **Zen:** `money` (INT)
- 🔄 **Reset:** `reset` (INT)
- 💪 **STR:** `strength` (INT)
- 🏃 **AGI:** `agility` (INT) ← **NÃO "dexterity"!**
- ❤️ **VIT:** `vitality` (INT)
- ⚡ **ENE:** `energy` (INT)
- 👑 **CMD:** `leadership` (INT)
- 🎯 **Points:** `points`, `points_master`, `points_majestic` (INT)
- ☠️ **PK:** `pk_level`, `pk_count` (TINYINT/INT)
- 🟢 **Online:** `online` (TINYINT 0/1)

**⚠️ CAMPOS QUE NÃO EXISTEM:**
- ❌ `greset` / `grandResets` / `MasterResetCount` → Só existe `reset`!
- ❌ `dexterity` → Chama-se `agility`!
- ❌ `cLevel` → Chama-se `level`!
- ❌ `Class` → Chama-se `race`!

**⚡ USO:**
```sql
-- Buscar personagens de uma conta
-- 1. Primeiro buscar GUID da conta
SELECT guid FROM accounts WHERE account = 'username';

-- 2. Depois buscar personagens
SELECT 
  name, race, level, level_master, level_majestic,
  money, reset, points, points_master, points_majestic,
  strength, agility, vitality, energy, leadership,
  pk_level, pk_count, online
FROM character_info
WHERE account_id = 1
ORDER BY name ASC;
```

---

### **4. `accounts_status`** - Status Online/Servidor

```sql
CREATE TABLE `accounts_status` (
  `account_id` int(10) unsigned NOT NULL,
  `server_group` smallint(5) unsigned DEFAULT NULL,
  `current_server` smallint(5) unsigned DEFAULT NULL,
  `start_server` smallint(5) unsigned DEFAULT NULL,
  `dest_server` smallint(6) DEFAULT NULL,
  `dest_world` smallint(6) DEFAULT NULL,
  `dest_x` smallint(6) DEFAULT NULL,
  `dest_y` smallint(6) DEFAULT NULL,
  `warp_time` int(10) unsigned DEFAULT NULL,
  `warp_auth_1` int(10) unsigned DEFAULT NULL,
  `warp_auth_2` int(10) unsigned DEFAULT NULL,
  `warp_auth_3` int(10) unsigned DEFAULT NULL,
  `warp_auth_4` int(10) unsigned DEFAULT NULL,
  `last_ip` varchar(16) DEFAULT NULL,
  `last_mac` varchar(50) DEFAULT NULL,
  `last_online` varchar(255) DEFAULT NULL,
  `online` tinyint(4) DEFAULT NULL,
  `disk_serial` int(10) unsigned DEFAULT NULL,
  `type` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

**Campos Chave:**
- 🔗 **PK/FK:** `account_id` → `accounts.guid`
- 🟢 **Online:** `online` (TINYINT 0/1)
- 🌐 **Server:** `current_server` (SMALLINT)
- 🌍 **Last IP:** `last_ip` (VARCHAR)
- ⏰ **Last Online:** `last_online` (VARCHAR timestamp)

---

### **5. `guild_list`** - Guildas

```sql
CREATE TABLE `guild_list` (
  `guid` int(10) unsigned NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `emblem` varchar(255) DEFAULT NULL,
  `hostil` int(10) unsigned DEFAULT NULL,
  `alliance` int(10) unsigned DEFAULT NULL,
  `notice` varchar(255) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

---

### **6. `guild_members`** - Membros de Guilda

```sql
CREATE TABLE `guild_members` (
  `guild_id` int(10) unsigned NOT NULL,
  `char_id` int(10) unsigned NOT NULL,
  `id` tinyint(3) unsigned DEFAULT NULL,
  `ranking` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`guild_id`,`char_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

**Campos Chave:**
- 🔗 **PK:** `guild_id`, `char_id`
- 🎖️ **Rank:** `ranking` (TINYINT)

---

## 🎯 **MAPEAMENTO RÁPIDO**

### **Login:**
```sql
SELECT account, password, guid, email, blocked 
FROM accounts 
WHERE account = ?
```

### **Dados da Conta:**
```sql
SELECT 
  a.account, a.email, a.guid, a.blocked, a.web_admin,
  ad.credits, ad.web_credits, ad.goblin_points, 
  ad.vip_status, ad.vip_duration
FROM accounts a
LEFT JOIN account_data ad ON a.guid = ad.account_id
WHERE a.account = ?
```

### **Personagens:**
```sql
-- 1. Buscar GUID
SELECT guid FROM accounts WHERE account = ?

-- 2. Listar personagens
SELECT 
  name, race, level, level_master, level_majestic,
  money, reset, points, 
  strength, agility, vitality, energy, leadership,
  pk_level, pk_count, online
FROM character_info
WHERE account_id = ?
ORDER BY name ASC
```

### **Players Online:**
```sql
SELECT COUNT(*) as online_count
FROM character_info
WHERE online = 1
```

### **Rankings:**
```sql
-- Top Level
SELECT name, race, level, reset
FROM character_info
ORDER BY level DESC, reset DESC
LIMIT 10

-- Top Resets
SELECT name, race, level, reset
FROM character_info
ORDER BY reset DESC, level DESC
LIMIT 10

-- Top PK
SELECT name, race, pk_count
FROM character_info
ORDER BY pk_count DESC
LIMIT 10
```

---

## ✅ **VALIDAÇÃO**

Sempre que criar uma query, verifique:

1. ✅ `accounts.account` (NÃO `memb___id`)
2. ✅ `accounts.password` (NÃO `memb__pwd`)
3. ✅ `accounts.web_admin` (NÃO `ctl1_code`)
4. ✅ LEFT JOIN com `account_data` para credits/vip
5. ✅ `character_info.agility` (NÃO `dexterity`)
6. ✅ `character_info.reset` (NÃO `greset`)
7. ✅ Buscar `accounts.guid` antes de buscar personagens
8. ✅ `character_info.account_id` → `accounts.guid`

---

## 🚨 **REGRAS DE OURO**

1. **NUNCA** assuma nomes de colunas
2. **SEMPRE** use esta documentação como referência
3. **SEMPRE** teste queries no MySQL antes de implementar
4. **NUNCA** use `SELECT *` em produção
5. **SEMPRE** use prepared statements (SQL injection)
6. **SEMPRE** valide se campos existem antes de usar

---

**Última Atualização:** 2025-12-29 18:00 CET  
**Fonte:** muonline.sql dump (2025-11-18 21:38:11)  
**Status:** ✅ **VALIDADO E CONFIRMADO**
