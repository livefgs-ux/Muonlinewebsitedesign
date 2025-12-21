# 📊 TABELAS IDENTIFICADAS - Banco MuOnline

## ✅ ESTRUTURA DO BANCO DETECTADA

Seu servidor usa uma estrutura **customizada moderna**, diferente do padrão IGC/IGCN.

---

## 📋 TABELAS PRINCIPAIS

### **🔐 CONTAS E AUTENTICAÇÃO**
```
✅ accounts                      → Contas de jogadores
✅ accounts_active               → Contas ativas
✅ accounts_banned               → Contas banidas
✅ accounts_security             → Segurança (2FA, etc)
✅ accounts_status               → Status das contas
✅ accounts_validation           → Validação de email
```

### **👤 PERSONAGENS**
```
✅ character_info                → Informações principais
✅ character_item_inventory      → Inventário
✅ character_skill               → Skills/Habilidades
✅ character_buff                → Buffs ativos
✅ character_quest_mu            → Quests
✅ character_friend              → Lista de amigos
✅ character_mail                → Sistema de correio
✅ character_statistics          → Estatísticas
✅ character_deleted             → Personagens deletados
```

### **🏰 GUILDS**
```
✅ guild_list                    → Lista de guilds
✅ guild_members                 → Membros
✅ guild_matching                → Sistema de matching
✅ guild_score                   → Pontuação
```

### **💰 SISTEMA DE CASH E ITENS**
```
✅ account_cash_shop_item        → Itens da cash shop
✅ account_cash_shop_gift        → Presentes
✅ account_warehouse             → Warehouse da conta
✅ item_serial                   → Seriais de itens
✅ item_recovery                 → Recuperação de itens
```

### **🏆 RANKINGS E EVENTOS**
```
✅ event_ranking                 → Rankings gerais
✅ event_ranking_labyrinth       → Ranking Labyrinth
✅ gen_ranking                   → Ranking Gens
✅ server_ranking                → Ranking do servidor
✅ event_castle_siege_ranking    → Castle Siege
✅ event_arka_war_ranking        → Arka War
```

### **⚔️ EVENTOS ESPECIAIS**
```
✅ castle_siege_data             → Castle Siege
✅ castle_siege_guild            → Guilds participantes
✅ crywolf_data                  → Crywolf
✅ arka_war_data                 → Arka War
✅ event_labyrinth_schedule      → Agenda Labyrinth
✅ event_stage                   → Eventos de stage
```

### **🎮 SISTEMAS ESPECIAIS**
```
✅ character_gens                → Sistema Gens
✅ character_mupass              → MU Pass
✅ character_mu_roomy            → MU Roomy
✅ character_mini_bomb           → Mini Bomb
✅ character_jewel_bingo         → Jewel Bingo
✅ character_labyrinth           → Labyrinth
```

### **🌐 WEBENGINE (Sistema Web Próprio)**
```
✅ WEBENGINE_ACCOUNT_COUNTRY     → País das contas
✅ WEBENGINE_BANS                → Sistema de ban web
✅ WEBENGINE_CREDITS_CONFIG      → Configuração de créditos
✅ WEBENGINE_CREDITS_LOGS        → Logs de créditos
✅ WEBENGINE_DOWNLOADS           → Downloads
✅ WEBENGINE_NEWS                → Notícias
✅ WEBENGINE_VOTES               → Sistema de votos
✅ WEBENGINE_PAYPAL_TRANSACTIONS → Transações PayPal
```

### **🔧 SISTEMA E CONTROLE**
```
✅ server_signal                 → Status do servidor
✅ daily_reset_data              → Reset diário
✅ migrations                    → Migrations do banco
✅ party                         → Sistema de party
✅ party_member                  → Membros de party
```

---

## 🎯 TABELAS MAPEADAS NO BACKEND

| Tipo | Nome no Código | Tabela Real |
|------|---------------|-------------|
| **Contas** | `tables.accounts` | `accounts` |
| **Personagens** | `tables.characters` | `character_info` |
| **Guilds** | `tables.guild` | `guild_list` |
| **Membros Guild** | `tables.guildMember` | `guild_members` |
| **Cash Shop** | `tables.cashShop` | `account_cash_shop_item` |
| **Warehouse** | `tables.warehouse` | `account_warehouse` |
| **Inventário** | `tables.inventory` | `character_item_inventory` |
| **Skills** | `tables.skills` | `character_skill` |
| **Ranking** | `tables.ranking` | `event_ranking` |
| **Server Status** | `tables.serverSignal` | `server_signal` |

---

## 🔍 PRÓXIMO PASSO CRÍTICO

**Precisamos descobrir os NOMES DAS COLUNAS de cada tabela!**

Por exemplo:
- Tabela `accounts` tem: `id`, `username`, `password`? OU `account_id`, `login`, `pass`?
- Tabela `character_info` tem: `Name`, `Class`, `cLevel`? OU `name`, `class`, `level`?

**Execute agora:**
```bash
node detect-structure.js
```

Este script vai:
1. ✅ Mostrar TODAS as colunas de cada tabela
2. ✅ Tentar detectar automaticamente os nomes corretos
3. ✅ Gerar arquivo `database-mapping.json` com mapeamento completo
4. ✅ Mostrar exemplo de dados reais

---

## 📊 TOTAL DE TABELAS: **120+**

Seu banco é bem completo e organizado! 🎉

---

**🚀 Execute: `node detect-structure.js` e me mostre o resultado!**
