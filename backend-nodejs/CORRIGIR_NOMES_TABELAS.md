# 🔧 CORREÇÃO - Nomes das Tabelas do Banco de Dados

**Problema Atual:**
```
❌ Erro na query: Table 'muonline.MEMB_INFO' doesn't exist
```

**Status:**
- ✅ Backend funcionando
- ✅ Conectado ao MariaDB
- ❌ Nomes de tabelas incorretos

---

## ⚡ SOLUÇÃO RÁPIDA (3 passos)

### **PASSO 1: Descobrir os nomes corretos das tabelas**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Executar script de diagnóstico
node check-tables.js
```

**O script vai mostrar:**
- 📊 Lista completa de tabelas no banco `muonline`
- 🔍 Identificação automática das tabelas principais
- ✅ Sugestões de nomes corretos

---

### **PASSO 2: Copiar os nomes corretos**

**Procure por estas tabelas importantes:**

| Tipo | Nomes Possíveis | Usado Para |
|------|----------------|------------|
| **Contas** | `MEMB_INFO`, `AccountCharacter`, `ACCOUNT` | Login, cadastro |
| **Personagens** | `Character`, `CharacterInfo`, `CHARACTER` | Gestão de chars |
| **Guild** | `Guild`, `GuildInfo`, `GUILD` | Sistema de guilds |
| **Warehouse** | `warehouse`, `WareHouse`, `WAREHOUSE` | Armazém |
| **Cash Shop** | `CashShopData`, `T_CashShopData` | WCoins |

**Exemplo de saída:**
```
  1. AccountCharacter
  2. Character
  3. Guild
  4. GuildMember
  5. warehouse
  ...
```

---

### **PASSO 3: Atualizar a configuração**

#### **Opção A: Via arquivo .env (RECOMENDADO)**

```bash
# Editar arquivo .env
nano .env
```

**Adicionar estas linhas (ajuste os nomes conforme seu banco):**
```env
# === NOMES DAS TABELAS DO BANCO ===
TABLE_ACCOUNTS=AccountCharacter
TABLE_CHARACTERS=Character
TABLE_GUILD=Guild
TABLE_GUILD_MEMBER=GuildMember
TABLE_CASH_SHOP=CashShopData
```

**Salvar:**
- `Ctrl + O` → Enter
- `Ctrl + X`

---

#### **Opção B: Editar src/config/auth.js diretamente**

```bash
nano src/config/auth.js
```

**Alterar a seção `tables:` para os nomes corretos:**
```javascript
tables: {
  accounts: process.env.TABLE_ACCOUNTS || 'AccountCharacter',  // ← AJUSTAR
  characters: process.env.TABLE_CHARACTERS || 'Character',      // ← AJUSTAR
  guild: process.env.TABLE_GUILD || 'Guild',                    // ← AJUSTAR
  guildMember: process.env.TABLE_GUILD_MEMBER || 'GuildMember', // ← AJUSTAR
  cashShop: process.env.TABLE_CASH_SHOP || 'CashShopData'       // ← AJUSTAR
}
```

---

### **PASSO 4: Reiniciar o servidor**

```bash
npm restart
```

**OU se estiver usando PM2:**
```bash
pm2 restart meumu-api
```

---

## 🔍 DIAGNÓSTICO MANUAL

Se preferir verificar diretamente no MySQL:

```bash
# Listar todas as tabelas
mysql -u root -p -e "USE muonline; SHOW TABLES;"

# Ver estrutura de uma tabela específica
mysql -u root -p -e "USE muonline; DESCRIBE AccountCharacter;"

# Contar registros
mysql -u root -p -e "USE muonline; SELECT COUNT(*) FROM AccountCharacter;"
```

---

## 📋 NOMES COMUNS POR VERSÃO DO MU

### **Season 6 - 10:**
```
MEMB_INFO (contas)
Character (personagens)
Guild (guilds)
warehouse (armazém)
```

### **Season 12+:**
```
AccountCharacter (contas)
Character (personagens)
Guild (guilds)
warehouse (armazém)
T_CashShopData (cash shop)
```

### **IGC/IGCN:**
```
MEMB_INFO (contas)
Character (personagens)
Guild (guilds)
warehouse (armazém)
CashShopData (cash shop)
```

---

## ✅ VERIFICAÇÃO

Após reiniciar, testar:

```bash
# 1. Health check
curl http://localhost:3001/health

# 2. Server info
curl http://localhost:3001/api/server/info

# 3. Server stats
curl http://localhost:3001/api/server/stats
```

**Deve retornar dados SEM erro de tabela!**

---

## 🐛 TROUBLESHOOTING

### **Erro: Access denied**
```bash
# Dar permissões ao usuário no banco
mysql -u root -p
GRANT ALL PRIVILEGES ON muonline.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### **Erro: Database doesn't exist**
```bash
# Verificar bancos existentes
mysql -u root -p -e "SHOW DATABASES;"

# Se o banco tiver nome diferente, atualizar no .env:
# DB_NAME=MuOnline  (ou o nome correto)
```

### **Tabela existe mas ainda dá erro**
```bash
# Verificar se a tabela tem dados
mysql -u root -p -e "USE muonline; SELECT COUNT(*) FROM AccountCharacter LIMIT 1;"

# Verificar case-sensitive
mysql -u root -p -e "USE muonline; SHOW TABLES LIKE '%account%';"
```

---

## 📝 RESUMO DOS COMANDOS

```bash
# 1. Descobrir tabelas
cd /home/meumu.com/public_html/backend-nodejs
node check-tables.js

# 2. Atualizar .env (ajustar nomes)
echo "TABLE_ACCOUNTS=AccountCharacter" >> .env
echo "TABLE_CHARACTERS=Character" >> .env
echo "TABLE_GUILD=Guild" >> .env
echo "TABLE_GUILD_MEMBER=GuildMember" >> .env
echo "TABLE_CASH_SHOP=CashShopData" >> .env

# 3. Reiniciar
npm restart

# 4. Testar
curl http://localhost:3001/api/server/info
```

---

## 🎯 PRÓXIMO PASSO

**Depois de corrigir os nomes das tabelas, me envie a lista completa que o `check-tables.js` mostrou para eu validar se está tudo correto!**

---

**✅ Execute `node check-tables.js` e me mostre o resultado! 🚀**
