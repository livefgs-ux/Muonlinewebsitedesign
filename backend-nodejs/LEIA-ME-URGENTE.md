# 🚨 LEIA-ME URGENTE - Backend Funcionando, Tabelas Incorretas

## ✅ STATUS ATUAL

- ✅ Backend Node.js FUNCIONANDO (porta 3001)
- ✅ Conectado ao MariaDB
- ✅ Banco de dados: `muonline`
- ❌ **Nomes das tabelas estão incorretos**

---

## ⚡ SOLUÇÃO EM 2 COMANDOS

```bash
cd /home/meumu.com/public_html/backend-nodejs

# 1. Detectar automaticamente os nomes corretos
node auto-fix-tables.js

# 2. Aplicar configuração (se detectar tudo)
cat tables-config.env >> .env

# 3. Reiniciar
npm restart
```

**Tempo:** 30 segundos

---

## 🔍 O QUE O SCRIPT FAZ?

1. ✅ Conecta no banco `muonline`
2. ✅ Lista todas as tabelas
3. ✅ Detecta automaticamente:
   - Tabela de **contas** (MEMB_INFO, AccountCharacter, etc)
   - Tabela de **personagens** (Character, CharacterInfo, etc)
   - Tabela de **guilds** (Guild, GuildInfo, etc)
   - Tabela de **cash shop** (CashShopData, etc)
4. ✅ Gera configuração pronta para usar
5. ✅ Salva em `tables-config.env`

---

## 📋 RESULTADO ESPERADO

```
🔍 DETECÇÃO AUTOMÁTICA:
============================================================
✅ accounts        : AccountCharacter
✅ characters      : Character
✅ guild           : Guild
✅ guildMember     : GuildMember
✅ cashShop        : CashShopData
============================================================

📝 CONFIGURAÇÃO DETECTADA:

# === NOMES DAS TABELAS (Auto-detectado) ===
TABLE_ACCOUNTS=AccountCharacter
TABLE_CHARACTERS=Character
TABLE_GUILD=Guild
TABLE_GUILD_MEMBER=GuildMember
TABLE_CASH_SHOP=CashShopData

✅ Todas as tabelas foram detectadas!
📄 Configuração salva em: tables-config.env

🚀 Execute: cat tables-config.env >> .env
```

---

## ✅ DEPOIS DE APLICAR

```bash
# Reiniciar servidor
npm restart

# Testar
curl http://localhost:3001/api/server/info
curl http://localhost:3001/api/server/stats
```

**Deve retornar dados REAIS do banco sem erros!**

---

## 🐛 SE O SCRIPT NÃO DETECTAR AUTOMATICAMENTE

**Ele vai mostrar a lista completa de tabelas.**

**Copie e cole aqui a lista para eu ajustar manualmente!**

OU edite manualmente:

```bash
nano .env
```

Adicione:
```env
TABLE_ACCOUNTS=NomeDaTabelaDeContas
TABLE_CHARACTERS=NomeDaTabelaDePersonagens
TABLE_GUILD=NomeDaTabelaDeGuilds
```

---

## 📞 COMANDOS RESUMIDOS

```bash
# SOLUÇÃO COMPLETA
cd /home/meumu.com/public_html/backend-nodejs
node auto-fix-tables.js
cat tables-config.env >> .env
npm restart
curl http://localhost:3001/health
```

---

**🚀 Execute agora: `node auto-fix-tables.js` e me mostre o resultado!**
