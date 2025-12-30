# 🗄️ ESTRUTURA DO BANCO DE DADOS - REFERÊNCIA COMPLETA

**Projeto:** MeuMU Online  
**Data:** 2025-12-30  
**Versão:** V573+  
**Database:** muonline (MariaDB)  
**Autor:** Sistema de Documentação Técnica

---

## ⚠️ REGRA CRÍTICA

```
╔═══════════════════════════════════════════════════════════════╗
║  SEMPRE CONSULTE ESTE ARQUIVO ANTES DE CRIAR QUERIES!        ║
║  NUNCA assuma nomes de tabelas ou tipos de colunas!          ║
║  NUNCA use `characters` → USE `character_info`!              ║
║  NUNCA use `account` → USE `accounts`!                       ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📋 ÍNDICE

1. [Lista de Tabelas](#lista-de-tabelas)
2. [Tabela: accounts](#tabela-accounts)
3. [Tabela: accounts_active](#tabela-accounts_active)
4. [Tabela: accounts_status](#tabela-accounts_status)
5. [Tabela: character_info](#tabela-character_info)
6. [Relações entre Tabelas](#relações-entre-tabelas)
7. [Queries de Exemplo](#queries-de-exemplo)
8. [Regras de Segurança](#regras-de-segurança)
9. [Tabelas Relacionadas](#tabelas-relacionadas)

---

## 📊 LISTA DE TABELAS

### Banco de Dados: `muonline`

**Total de Tabelas: 148**

```sql
SHOW TABLES;
```

| Categoria | Tabelas |
|-----------|---------|
| **WEBENGINE** | WEBENGINE_ACCOUNT_COUNTRY, WEBENGINE_BANS, WEBENGINE_BAN_LOG, WEBENGINE_BLOCKED_IP, WEBENGINE_CREDITS_CONFIG, WEBENGINE_CREDITS_LOGS, WEBENGINE_CRON, WEBENGINE_DOWNLOADS, WEBENGINE_FLA, WEBENGINE_NEWS, WEBENGINE_NEWS_TRANSLATIONS, WEBENGINE_PASSCHANGE_REQUEST, WEBENGINE_PAYPAL_TRANSACTIONS, WEBENGINE_PLUGINS, WEBENGINE_REGISTER_ACCOUNT, WEBENGINE_VOTES, WEBENGINE_VOTE_LOGS, WEBENGINE_VOTE_SITES, webengine_account_country, webengine_ban_log, webengine_bans, webengine_blocked_ip, webengine_credits_config, webengine_credits_logs, webengine_cron, webengine_downloads, webengine_fla, webengine_news, webengine_news_translations, webengine_passchange_request, webengine_paypal_transactions, webengine_plugins, webengine_redeemcode, webengine_redeemcode_logs, webengine_register_account, webengine_vote_logs, webengine_vote_sites, webengine_votes |
| **ACCOUNTS** | accounts, accounts_active, accounts_allowed, accounts_banned, accounts_disconnect, accounts_security, accounts_status, accounts_status_web, accounts_validation, accounts_warning |
| **CHARACTERS** | character_add_stat, character_buff, character_chat_block, character_date, character_deleted, character_event_count, character_friend, character_gameoption, character_gens, character_gens_kill, character_gremory_case, character_helper, character_hunting_record, character_info, character_item_delay, character_item_inventory, character_item_pentagram, character_jewel_bingo, character_jewel_bingo_grid, character_kick, character_labyrinth, character_labyrinth_level, character_labyrinth_zone, character_mail, character_majestic_stats, character_majestic_tree, character_mini_bomb, character_mini_bomb_grid, character_monster_soul, character_mu_roomy, character_mu_roomy_deck, character_mupass, character_notification, character_numeric_baseball, character_quest_evo, character_quest_guided, character_quest_mu, character_restriction, character_score, character_skill, character_statistics, character_warp_favorite_list |
| **EVENTS** | event_arka_war_kill, event_arka_war_ranking, event_castle_siege_kill, event_castle_siege_ranking, event_castle_siege_time, event_dungeon_instance, event_jewel_bingo_ranking, event_labyrinth_league, event_labyrinth_schedule, event_labyrinth_settings, event_mini_bomb_ranking, event_mu_roomy_ranking, event_numeric_baseball_ranking, event_race_ranking, event_ranking, event_ranking_labyrinth, event_scramble_ranking, event_stage |
| **GUILDS** | guild_list, guild_matching, guild_members, guild_score |
| **SIEGES** | arka_war_data, castle_siege_data, castle_siege_guild, castle_siege_npc, castle_siege_registered_guild, crywolf_data |
| **SURVIVAL** | chaos_castle_survival_hall_of_fame, chaos_castle_survival_ranking, tormented_square_survival_hall_of_fame, tormented_square_survival_ranking, tormented_square_survival_team |
| **MISC** | account_buff, account_cash_shop_gift, account_cash_shop_item, account_data, account_warehouse, account_warehouse_old, block_diskserial, block_ip, block_mac, daily_reset_data, gen_ranking, giant_mount_settings, item_recovery, item_serial, lo_de, master_pc, migrations, monster_respawn, party, party_member, personal_access_tokens, serial_check, server_monster_soul_reset, server_ranking, server_signal |

---

## 🔑 TABELA: `accounts`

### Descrição
Tabela principal de contas de usuários.

**Engine:** InnoDB  
**Charset:** utf8mb4  
**Auto-Increment:** guid

### Estrutura Completa

```sql
DESCRIBE accounts;
```

| Field | Type | Null | Key | Default | Extra |
|-------|------|------|-----|---------|-------|
| `guid` | int(10) unsigned | NO | PRI | NULL | auto_increment |
| `blocked` | tinyint(3) unsigned | YES |  | 0 |  |
| `security_code` | varchar(255) | YES |  | 0 |  |
| `golden_channel` | bigint(20) | YES |  | 1500434821 |  |
| `facebook_status` | tinyint(3) unsigned | YES |  | 0 |  |
| `secured` | tinyint(3) unsigned | YES |  | 1 |  |
| `account` | varchar(255) | NO |  |  |  |
| `password` | varchar(255) | NO |  |  |  |
| `email` | varchar(255) | NO |  |  |  |
| `register` | bigint(20) | NO |  | unix_timestamp() |  |
| `updated_at` | datetime | NO |  | current_timestamp() | on update current_timestamp() |
| `created_at` | datetime | NO |  | current_timestamp() |  |
| `email_verified_at` | datetime | NO |  | current_timestamp() |  |
| `web_admin` | int(11) | YES |  | 0 |  |
| `deletion_token` | varchar(40) | NO |  | 0 |  |
| `passlost_token` | varchar(40) | NO |  | 0 |  |
| `email_token` | varchar(40) | NO |  | 0 |  |
| `new_email` | varchar(64) | NO |  | 0 |  |
| `social_id` | varchar(13) | NO |  | 0 |  |
| `activated` | int(11) | NO |  | 0 |  |
| `DiscordDiscriminator` | int(11) | NO |  | 0 |  |
| `DiscordAvatar` | varchar(255) | NO |  |  |  |
| `DiscordId` | int(11) | NO |  | 0 |  |
| `DiscordUsername` | varchar(255) | NO |  |  |  |
| `DiscordEmail` | varchar(255) | NO |  |  |  |
| `DiscordLogin` | int(11) | YES |  | 0 |  |
| `token` | varchar(50) | NO |  |  |  |
| `create_date` | datetime | NO |  | current_timestamp() |  |
| `ip` | varchar(20) | NO |  | 0.0.0.0 |  |
| `registration_token` | varchar(40) | NO |  |  |  |
| `lock_token` | varchar(40) | NO |  |  |  |
| `ban_time` | datetime | NO |  | current_timestamp() |  |
| `creation_counter` | smallint(6) | YES |  | 0 |  |

**Total:** 33 campos

### Campos Críticos

| Campo | Tipo | Descrição | Uso no Backend |
|-------|------|-----------|----------------|
| `guid` | int(10) unsigned | **PRIMARY KEY** - ID único da conta (auto-increment) | ✅ **USAR SEMPRE** como FK em outras tabelas |
| `account` | varchar(255) | **Username** - Nome de usuário (único) | ✅ Login / Busca de conta |
| `password` | varchar(255) | **Hash SHA-256** da senha | ⚠️ **NUNCA** retornar para frontend |
| `email` | varchar(255) | Email da conta | ✅ Recuperação de senha |
| `blocked` | tinyint(3) unsigned | 0 = Normal, 1 = Bloqueado | ✅ Validação de acesso |
| `web_admin` | int(11) | **NÃO USADO** - Admin é detectado via `character_info.authority` | ❌ **IGNORAR** |
| `created_at` | datetime | Data de criação | ✅ Histórico |
| `ip` | varchar(20) | IP de registro | ✅ Segurança |

### ⚠️ ATENÇÃO: Campo `web_admin`

```
╔═══════════════════════════════════════════════════════════════╗
║  O CAMPO `web_admin` EXISTE MAS NÃO É USADO!                 ║
║  Admin é detectado via character_info.authority > 0          ║
║  NUNCA confie em accounts.web_admin!                         ║
╚═══════════════════════════════════════════════════════════════╝
```

### Exemplo de Query Segura

```sql
-- ✅ CORRETO: Buscar conta para login
SELECT 
    guid,
    account,
    password,
    email,
    blocked
FROM accounts
WHERE account = ?;
-- Parâmetros: [username]

-- ❌ ERRADO: Retornar password para frontend
SELECT * FROM accounts WHERE account = ?;
-- NUNCA faça isso! Password é sensível!
```

---

## 📋 TABELA: `accounts_active`

### Descrição
Cópia da tabela `accounts` (mesma estrutura, 33 campos).  
**Uso desconhecido** - possivelmente para cache ou histórico.

**Estrutura:** Idêntica à tabela `accounts`

### ⚠️ DIFERENÇA vs `accounts`

| Campo | `accounts` | `accounts_active` |
|-------|------------|-------------------|
| `guid` | AUTO_INCREMENT | Normal (sem auto-increment) |

**Observação:** Esta tabela **NÃO** é usada no sistema atual do site.

---

## 🌐 TABELA: `accounts_status`

### Descrição
Controla o status de conexão/sessão das contas.

**Engine:** InnoDB  
**Charset:** utf8mb3

### Estrutura Completa

```sql
DESCRIBE accounts_status;
```

| Field | Type | Null | Key | Default | Extra |
|-------|------|------|-----|---------|-------|
| `account_id` | int(10) unsigned | NO | PRI | NULL |  |
| `server_group` | smallint(5) unsigned | YES |  | NULL |  |
| `current_server` | smallint(5) unsigned | YES |  | NULL |  |
| `start_server` | smallint(5) unsigned | YES |  | NULL |  |
| `dest_server` | smallint(6) | YES |  | NULL |  |
| `dest_world` | smallint(6) | YES |  | NULL |  |
| `dest_x` | smallint(6) | YES |  | NULL |  |
| `dest_y` | smallint(6) | YES |  | NULL |  |
| `warp_time` | int(10) unsigned | YES |  | NULL |  |
| `warp_auth_1` | int(10) unsigned | YES |  | NULL |  |
| `warp_auth_2` | int(10) unsigned | YES |  | NULL |  |
| `warp_auth_3` | int(10) unsigned | YES |  | NULL |  |
| `warp_auth_4` | int(10) unsigned | YES |  | NULL |  |
| `last_ip` | varchar(16) | YES |  | NULL |  |
| `last_mac` | varchar(50) | YES |  | NULL |  |
| `last_online` | varchar(255) | YES |  | NULL |  |
| `online` | tinyint(4) | YES |  | NULL |  |
| `disk_serial` | int(10) unsigned | YES |  | NULL |  |
| `type` | tinyint(3) unsigned | YES |  | NULL |  |

**Total:** 19 campos

### Campos Críticos

| Campo | Tipo | Descrição | Uso |
|-------|------|-----------|-----|
| `account_id` | int(10) unsigned | **PRIMARY KEY** - FK para `accounts.guid` | ✅ Relacionar com conta |
| `online` | tinyint(4) | 0 = Offline, 1 = Online | ✅ Status online/offline |
| `current_server` | smallint(5) unsigned | ID do servidor atual | ✅ Servidor conectado |
| `last_ip` | varchar(16) | Último IP usado | ✅ Segurança |
| `last_mac` | varchar(50) | MAC Address | ✅ Anti-cheat |

### Relação com `accounts`

```sql
-- Foreign Key (não explícita no schema, mas lógica)
accounts_status.account_id → accounts.guid
```

### Exemplo de Query

```sql
-- ✅ Verificar se conta está online
SELECT 
    a.account,
    s.online,
    s.current_server,
    s.last_ip
FROM accounts a
LEFT JOIN accounts_status s ON a.guid = s.account_id
WHERE a.account = ?;
```

---

## 🎮 TABELA: `character_info`

### Descrição
**TABELA PRINCIPAL** de personagens.

**Engine:** InnoDB  
**Charset:** utf8mb3  
**Auto-Increment:** guid (próximo: 210)

### Estrutura Completa

```sql
DESCRIBE character_info;
```

| Field | Type | Null | Key | Default | Extra |
|-------|------|------|-----|---------|-------|
| `guid` | int(10) unsigned | NO | PRI | NULL | auto_increment |
| `account_id` | int(10) unsigned | YES |  | NULL |  |
| `authority` | tinyint(3) unsigned | YES |  | 0 |  |
| `race` | smallint(5) unsigned | YES |  | NULL |  |
| `name` | varchar(255) | YES |  | NULL |  |
| `slot` | tinyint(4) | YES |  | 1 |  |
| `level` | smallint(6) | YES |  | 0 |  |
| `level_master` | smallint(6) | YES |  | 0 |  |
| `level_majestic` | smallint(6) | YES |  | 0 |  |
| `experience` | bigint(20) | YES |  | 0 |  |
| `experience_master` | bigint(20) | YES |  | 0 |  |
| `experience_majestic` | bigint(20) | YES |  | 0 |  |
| `points` | int(11) | YES |  | 0 |  |
| `points_master` | int(11) | YES |  | 0 |  |
| `points_majestic` | int(11) | YES |  | 0 |  |
| `strength` | int(10) unsigned | YES |  | 0 |  |
| `agility` | int(10) unsigned | YES |  | 0 |  |
| `vitality` | int(10) unsigned | YES |  | 0 |  |
| `energy` | int(10) unsigned | YES |  | 0 |  |
| `leadership` | int(10) unsigned | YES |  | 0 |  |
| `world` | smallint(5) unsigned | YES |  | 0 |  |
| `world_x` | smallint(6) | YES |  | 0 |  |
| `world_y` | smallint(6) | YES |  | 0 |  |
| `direction` | tinyint(3) unsigned | YES |  | 0 |  |
| `money` | int(10) unsigned | YES |  | 0 |  |
| `life` | int(11) | YES |  | 0 |  |
| `mana` | int(11) | YES |  | 0 |  |
| `shield` | int(11) | YES |  | 0 |  |
| `stamina` | int(11) | YES |  | 0 |  |
| `add_fruit_points` | int(11) | YES |  | 0 |  |
| `dec_fruit_points` | int(11) | YES |  | 0 |  |
| `expanded_inventory` | tinyint(3) unsigned | YES |  | 0 |  |
| `mute_time` | bigint(20) | YES |  | 0 |  |
| `admin_flags` | int(10) unsigned | YES |  | 0 |  |
| `pk_level` | tinyint(3) unsigned | YES |  | 3 |  |
| `pk_count` | int(11) | YES |  | 0 |  |
| `pk_points` | int(11) | YES |  | 0 |  |
| `first_time` | tinyint(3) unsigned | YES |  | 1 |  |
| `santa_claus_gift` | bigint(20) | YES |  | 0 |  |
| `personal_store_name` | varchar(255) | YES |  | 0 |  |
| `personal_store_open` | tinyint(4) | YES |  | 0 |  |
| `last_use` | bigint(20) | YES |  | 0 |  |
| `kick_time` | bigint(20) | YES |  | 0 |  |
| `post_count` | int(11) | YES |  | 0 |  |
| `post_day` | tinyint(3) unsigned | YES |  | 0 |  |
| `post_month` | tinyint(3) unsigned | YES |  | 0 |  |
| `ruud_money` | int(10) unsigned | YES |  | 0 |  |
| `hunting_log_visible` | tinyint(3) unsigned | YES |  | 0 |  |
| `create_date` | bigint(20) | YES |  | 0 |  |
| `online` | tinyint(4) | YES |  | 0 |  |
| `server_code` | smallint(5) unsigned | YES |  | 3 |  |
| `reset` | int(10) unsigned | YES |  | 0 |  |
| `monster_soul_purchase` | int(11) | YES |  | 0 |  |
| `lastserver` | int(11) | YES |  | 0 |  |
| `goblin_points` | int(11) | YES |  | 0 |  |

**Total:** 55 campos

### Campos CRÍTICOS

| Campo | Tipo | Descrição | ⚠️ ATENÇÃO |
|-------|------|-----------|-----------|
| `guid` | int(10) unsigned | **PRIMARY KEY** - ID único do personagem | Auto-increment |
| `account_id` | int(10) unsigned | **FOREIGN KEY** → `accounts.guid` | ⚠️ **É INTEGER, NÃO STRING!** |
| `authority` | tinyint(3) unsigned | **NÍVEL DE ADMIN** (0-8) | ✅ **CAMPO CRÍTICO** para detecção de admin |
| `name` | varchar(255) | Nome do personagem | ✅ ÚNICO |
| `race` | smallint(5) unsigned | Classe do personagem | Ver tabela de classes |
| `level` | smallint(6) | Nível normal (1-400) | |
| `level_master` | smallint(6) | Nível Master (1-200) | |
| `level_majestic` | smallint(6) | Nível Majestic (1-200) | |
| `reset` | int(10) unsigned | Número de resets | ✅ Sistema de reset |
| `online` | tinyint(4) | 0 = Offline, 1 = Online | ✅ Status do personagem |

### Relação com `accounts`

```sql
-- Foreign Key (lógica)
character_info.account_id → accounts.guid
```

### ⚠️ REGRA CRÍTICA: `account_id`

```
╔═══════════════════════════════════════════════════════════════╗
║  character_info.account_id é INTEGER (GUID), NÃO STRING!     ║
║                                                               ║
║  ❌ NUNCA: WHERE account_id = 'admin'                         ║
║  ✅ SEMPRE: WHERE account_id = 171                            ║
║                                                               ║
║  PASSOS CORRETOS:                                             ║
║  1. Buscar GUID: SELECT guid FROM accounts WHERE account = ? ║
║  2. Usar GUID:   WHERE account_id = ?                        ║
╚═══════════════════════════════════════════════════════════════╝
```

### Tabela de `authority` (Game Master Levels)

| Authority | Nível | Descrição |
|-----------|-------|-----------|
| 0 | Player | Jogador normal (sem privilégios) |
| 1 | Moderator | Moderador básico |
| 2 | GM | Game Master (GM) |
| 3 | Senior GM | GM Senior |
| 4-7 | Admin | Níveis de Admin |
| 8 | Super Admin | Administrador total |

**Detecção de Admin no Site:**
```sql
-- Se MAX(authority) > 0 em QUALQUER personagem → É ADMIN no site
SELECT MAX(authority) as max_authority
FROM character_info
WHERE account_id = ?;
```

### Tabela de `race` (Classes)

| Race ID | Classe | Descrição |
|---------|--------|-----------|
| 0 | Dark Wizard (DW) | Mago das Trevas |
| 1 | Soul Master (SM) | Mestre da Alma |
| 2 | Grand Master (GM) | Grão Mestre |
| 3 | Dimension Master (DM) | Mestre Dimensional |
| 16 | Dark Knight (DK) | Cavaleiro das Trevas |
| 17 | Blade Knight (BK) | Cavaleiro Lâmina |
| 18 | Blade Master (BM) | Mestre Lâmina |
| 19 | Dragon Knight | Cavaleiro Dragão |
| 32 | Fairy Elf (ELF) | Elfa Fada |
| 33 | Muse Elf (ME) | Musa Elfa |
| 34 | High Elf | Alta Elfa |
| 35 | Noble Elf | Elfa Nobre |
| 48 | Magic Gladiator (MG) | Gladiador Mágico |
| 49 | Duel Master | Mestre do Duelo |
| 64 | Dark Lord (DL) | Lorde das Trevas |
| 65 | Lord Emperor (LE) | Imperador |
| 80 | Summoner (SUM) | Invocador |
| 81 | Bloody Summoner (BS) | Invocador Sangrento |
| 82 | Dimension Summoner (DS) | Invocador Dimensional |
| 96 | Rage Fighter (RF) | Lutador Furioso |
| 97 | Fist Master (FM) | Mestre dos Punhos |
| 98 | Fist Blazer | Punhos Flamejantes |
| 112 | Grow Lancer (GL) | Lanceiro |
| 113 | Mirage Lancer | Lanceiro Miragem |
| 114 | Shining Lancer | Lanceiro Brilhante |
| 128 | Rune Wizard (RW) | Mago das Runas |
| 129 | Rune Spell Master | Mestre das Runas |
| 130 | Grand Rune Master | Grão Mestre das Runas |
| 144 | Slayer (SL) | Matador |
| 145 | Royal Slayer | Matador Real |
| 146 | Master Slayer | Mestre Matador |
| 160 | Gun Crusher (GC) | Esmagador de Armas |
| 161 | Gun Breaker | Quebrador de Armas |
| 162 | Master Gun Breaker | Mestre Quebrador |

### Exemplo de Queries Corretas

```sql
-- ✅ CORRETO: Buscar personagens de uma conta
SELECT 
    name,
    race,
    level,
    level_master,
    level_majestic,
    reset,
    online,
    authority
FROM character_info
WHERE account_id = ?;
-- Parâmetro: [accountGuid] (INTEGER)

-- ✅ CORRETO: Verificar se conta tem admin
SELECT MAX(authority) as max_authority
FROM character_info
WHERE account_id = ?;
-- Parâmetro: [accountGuid] (INTEGER)

-- ✅ CORRETO: Buscar personagem específico de uma conta
SELECT * FROM character_info
WHERE name = ? AND account_id = ?;
-- Parâmetros: [characterName, accountGuid]

-- ❌ ERRADO: Usar username em vez de GUID
SELECT * FROM character_info
WHERE account_id = 'admin';
-- NUNCA FAÇA ISSO! Compara INTEGER com STRING → Falha!
```

---

## 🔗 RELAÇÕES ENTRE TABELAS

### Diagrama de Relações

```
┌─────────────────────────┐
│      accounts           │
│  ┌──────────────────┐   │
│  │ guid (PK)        │◄──┼────┐
│  │ account          │   │    │
│  │ password         │   │    │
│  │ email            │   │    │
│  └──────────────────┘   │    │
└─────────────────────────┘    │
                               │ FK
┌─────────────────────────┐    │
│   accounts_status       │    │
│  ┌──────────────────┐   │    │
│  │ account_id (PK)  │◄──┼────┤
│  │ online           │   │    │
│  │ current_server   │   │    │
│  └──────────────────┘   │    │
└─────────────────────────┘    │
                               │
┌─────────────────────────┐    │
│   character_info        │    │
│  ┌──────────────────┐   │    │
│  │ guid (PK)        │   │    │
│  │ account_id       │◄──┼────┘
│  │ authority        │   │
│  │ name             │   │
│  │ race             │   │
│  │ level            │   │
│  └──────────────────┘   │
└─────────────────────────┘
```

### Query Completa (JOIN)

```sql
SELECT 
    -- Dados da conta
    a.guid as account_guid,
    a.account as username,
    a.email,
    a.blocked,
    a.created_at,
    
    -- Status online
    s.online as account_online,
    s.current_server,
    s.last_ip,
    
    -- Personagens
    c.guid as character_guid,
    c.name as character_name,
    c.authority,
    c.race,
    c.level,
    c.level_master,
    c.level_majestic,
    c.reset,
    c.online as character_online
    
FROM accounts a
LEFT JOIN accounts_status s ON a.guid = s.account_id
LEFT JOIN character_info c ON a.guid = c.account_id
WHERE a.account = ?;
```

---

## 📝 QUERIES DE EXEMPLO

### 1. Listar TODAS as contas com seus personagens

```sql
SELECT 
    a.account,
    a.guid,
    COUNT(c.guid) as total_personagens,
    MAX(c.authority) as max_authority
FROM accounts a
LEFT JOIN character_info c ON a.guid = c.account_id
GROUP BY a.guid, a.account
ORDER BY total_personagens DESC
LIMIT 20;
```

---

### 2. Buscar personagens de uma conta (por username)

```sql
-- PASSO 1: Buscar GUID da conta
SELECT guid FROM accounts WHERE account = ?;
-- Resultado: guid = 171

-- PASSO 2: Buscar personagens usando GUID
SELECT 
    name,
    race,
    level,
    reset,
    authority
FROM character_info
WHERE account_id = 171;
```

**Ou em uma query única:**
```sql
SELECT 
    c.name,
    c.race,
    c.level,
    c.reset,
    c.authority
FROM character_info c
INNER JOIN accounts a ON c.account_id = a.guid
WHERE a.account = ?;
```

---

### 3. Verificar se conta tem admin

```sql
SELECT MAX(authority) as max_authority
FROM character_info
WHERE account_id = (
    SELECT guid FROM accounts WHERE account = ?
);

-- Se max_authority > 0 → É ADMIN
-- Se max_authority = 0 ou NULL → NÃO é admin
```

---

### 4. Listar TODOS os admins

```sql
SELECT DISTINCT
    a.account,
    a.email,
    c.name as character_name,
    c.authority
FROM accounts a
INNER JOIN character_info c ON a.guid = c.account_id
WHERE c.authority > 0
ORDER BY c.authority DESC, a.account ASC;
```

---

### 5. Verificar se personagem pertence à conta

```sql
SELECT COUNT(*) as is_owner
FROM character_info c
INNER JOIN accounts a ON c.account_id = a.guid
WHERE c.name = ? AND a.account = ?;

-- Se is_owner = 1 → Personagem pertence à conta
-- Se is_owner = 0 → Personagem NÃO pertence (FRAUDE!)
```

---

### 6. Buscar personagens online

```sql
SELECT 
    c.name,
    c.level,
    a.account as owner,
    s.current_server
FROM character_info c
INNER JOIN accounts a ON c.account_id = a.guid
LEFT JOIN accounts_status s ON a.guid = s.account_id
WHERE c.online = 1
ORDER BY c.level DESC;
```

---

### 7. Ranking de resets

```sql
SELECT 
    c.name,
    c.reset,
    c.level,
    a.account
FROM character_info c
INNER JOIN accounts a ON c.account_id = a.guid
ORDER BY c.reset DESC, c.level DESC
LIMIT 100;
```

---

## 🔒 REGRAS DE SEGURANÇA

### 1. NUNCA retornar passwords

```sql
-- ❌ ERRADO
SELECT * FROM accounts WHERE account = ?;

-- ✅ CORRETO
SELECT 
    guid,
    account,
    email,
    blocked,
    created_at
FROM accounts
WHERE account = ?;
```

---

### 2. SEMPRE usar prepared statements

```javascript
// ❌ ERRADO - SQL Injection!
const sql = `SELECT * FROM accounts WHERE account = '${username}'`;

// ✅ CORRETO - Prepared statement
const sql = `SELECT guid, account FROM accounts WHERE account = ?`;
const result = await executeQueryMU(sql, [username]);
```

---

### 3. SEMPRE verificar ownership

```javascript
// Antes de modificar personagem, verificar se pertence à conta!
const sql = `
    SELECT COUNT(*) as is_owner
    FROM character_info c
    INNER JOIN accounts a ON c.account_id = a.guid
    WHERE c.name = ? AND a.account = ?
`;
const result = await executeQueryMU(sql, [characterName, accountUsername]);

if (result.data[0].is_owner === 0) {
    return errorResponse(res, 'Personagem não pertence a esta conta!', 403);
}
```

---

### 4. NUNCA confiar no frontend

```javascript
// Frontend envia: { characterName: "MeuMuzin", newLevel: 400 }

// ❌ ERRADO - Aceitar sem validar
UPDATE character_info SET level = 400 WHERE name = 'MeuMuzin';

// ✅ CORRETO - Validar ownership + limites
1. Verificar se personagem pertence à conta logada
2. Verificar se newLevel está dentro dos limites (1-400)
3. Verificar se conta tem permissão (admin?)
4. Só então executar UPDATE
```

---

### 5. SEMPRE usar account_id (GUID) em queries

```javascript
// ❌ ERRADO
const sql = `SELECT * FROM character_info WHERE account_id = ?`;
await executeQueryMU(sql, [accountUsername]); // String!

// ✅ CORRETO
// Passo 1: Buscar GUID
const accountGuid = await getAccountGuid(accountUsername);

// Passo 2: Usar GUID
const sql = `SELECT * FROM character_info WHERE account_id = ?`;
await executeQueryMU(sql, [accountGuid]); // Integer!
```

---

## 📊 TABELAS RELACIONADAS

### Tabelas de Character (55 tabelas)

| Tabela | Descrição |
|--------|-----------|
| `character_info` | **PRINCIPAL** - Dados do personagem |
| `character_item_inventory` | Inventário do personagem |
| `character_skill` | Skills aprendidas |
| `character_quest_mu` | Quests completadas |
| `character_buff` | Buffs ativos |
| `character_friend` | Lista de amigos |
| `character_mail` | Mensagens recebidas |
| `character_restriction` | Restrições (ban, mute) |
| `character_deleted` | Personagens deletados |

### Tabelas de Guild (4 tabelas)

| Tabela | Descrição |
|--------|-----------|
| `guild_list` | Lista de guilds |
| `guild_members` | Membros das guilds |
| `guild_score` | Pontuação das guilds |
| `guild_matching` | Sistema de matching |

### Tabelas de Event (18 tabelas)

| Tabela | Descrição |
|--------|-----------|
| `event_ranking` | Rankings gerais |
| `event_castle_siege_ranking` | Ranking Castle Siege |
| `event_arka_war_ranking` | Ranking Arka War |
| `event_labyrinth_league` | Labyrinth League |

---

## ✅ CHECKLIST DE QUERIES

Antes de executar uma query em produção:

- [ ] ✅ Uso prepared statements (não concatenação de strings)?
- [ ] ✅ Usei `account_id` (GUID) em vez de `account` (username)?
- [ ] ✅ Verifiquei ownership (personagem pertence à conta)?
- [ ] ✅ NÃO retornei campo `password`?
- [ ] ✅ Tratei caso de resultado vazio (personagem não existe)?
- [ ] ✅ Validei limites (level 1-400, reset >= 0)?
- [ ] ✅ Loguei a operação (para auditoria)?
- [ ] ✅ Testei com conta normal E admin?

---

## 🎯 EXEMPLO REAL: Sistema de Reset

### Requisitos
1. Jogador pode resetar personagem se level >= 400
2. Reset aumenta contador `reset` em +1
3. Reset volta level para 1, mantém stats
4. Personagem deve pertencer à conta logada

### Implementação Correta

```javascript
async function resetCharacter(req, res) {
    const { characterName } = req.body;
    const accountUsername = req.user.accountId; // Do JWT
    
    try {
        // 1. Buscar GUID da conta
        const accountGuid = await getAccountGuid(accountUsername);
        if (!accountGuid) {
            return errorResponse(res, 'Conta não encontrada', 404);
        }
        
        // 2. Verificar se personagem existe E pertence à conta
        const checkSql = `
            SELECT 
                c.guid,
                c.level,
                c.reset,
                c.account_id
            FROM character_info c
            WHERE c.name = ? AND c.account_id = ?
        `;
        const checkResult = await executeQueryMU(checkSql, [characterName, accountGuid]);
        
        if (checkResult.data.length === 0) {
            return errorResponse(res, 'Personagem não encontrado ou não pertence a esta conta', 404);
        }
        
        const character = checkResult.data[0];
        
        // 3. Validar level mínimo
        if (character.level < 400) {
            return errorResponse(res, `Personagem precisa ser level 400. Atual: ${character.level}`, 400);
        }
        
        // 4. Executar reset
        const resetSql = `
            UPDATE character_info
            SET 
                level = 1,
                experience = 0,
                reset = reset + 1,
                points = points + 500
            WHERE name = ? AND account_id = ?
        `;
        const resetResult = await executeQueryMU(resetSql, [characterName, accountGuid]);
        
        if (!resetResult.success) {
            return errorResponse(res, 'Erro ao resetar personagem', 500);
        }
        
        // 5. Retornar sucesso
        return successResponse(res, {
            message: 'Personagem resetado com sucesso!',
            newReset: character.reset + 1,
            bonusPoints: 500
        });
        
    } catch (error) {
        console.error('❌ Erro ao resetar:', error);
        return errorResponse(res, 'Erro interno do servidor', 500);
    }
}
```

---

## 📌 CONCLUSÃO

Este documento contém **TODA** a estrutura do banco de dados necessária para criar queries seguras e corretas.

### Regras Absolutas

1. ✅ **SEMPRE** consulte este arquivo antes de criar queries
2. ✅ **SEMPRE** use `character_info.account_id` (INTEGER), nunca username
3. ✅ **SEMPRE** verifique ownership antes de modificar dados
4. ✅ **NUNCA** retorne campo `password` para frontend
5. ✅ **NUNCA** confie em `accounts.web_admin` - use `character_info.authority`
6. ✅ **SEMPRE** use prepared statements (proteção contra SQL Injection)

---

**FIM DO DOCUMENTO**

*Última atualização: 2025-12-30 (V573)*  
*Próxima revisão: Quando estrutura do banco mudar*
