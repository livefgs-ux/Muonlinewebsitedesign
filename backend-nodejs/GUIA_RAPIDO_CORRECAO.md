# ⚡ GUIA RÁPIDO - Correção de Tabelas (2 minutos)

## 🎯 SITUAÇÃO ATUAL

```
✅ Backend funcionando (porta 3001)
✅ Conectado ao MariaDB
✅ Banco: muonline
❌ Erro: Table 'muonline.MEMB_INFO' doesn't exist
```

**Problema:** Nomes das tabelas na configuração não batem com o banco.

---

## ⚡ SOLUÇÃO AUTOMÁTICA (RECOMENDADO)

### **Copie e cole tudo de uma vez:**

```bash
cd /home/meumu.com/public_html/backend-nodejs && \
node auto-fix-tables.js && \
echo "" && \
echo "📋 Se todas as tabelas foram detectadas, execute:" && \
echo "   cat tables-config.env >> .env && npm restart"
```

---

## 📖 PASSO A PASSO DETALHADO

### **1️⃣ Detectar tabelas automaticamente**

```bash
cd /home/meumu.com/public_html/backend-nodejs
node auto-fix-tables.js
```

**Vai mostrar algo como:**
```
✅ accounts        : AccountCharacter
✅ characters      : Character
✅ guild           : Guild
✅ guildMember     : GuildMember
✅ cashShop        : CashShopData

📄 Configuração salva em: tables-config.env
```

---

### **2️⃣ Aplicar configuração**

**Se TODAS as tabelas foram detectadas:**
```bash
cat tables-config.env >> .env
```

**OU editar manualmente:**
```bash
nano .env
```

Adicionar:
```env
TABLE_ACCOUNTS=AccountCharacter
TABLE_CHARACTERS=Character
TABLE_GUILD=Guild
TABLE_GUILD_MEMBER=GuildMember
TABLE_CASH_SHOP=CashShopData
```

Salvar: `Ctrl+O` → Enter → `Ctrl+X`

---

### **3️⃣ Reiniciar servidor**

```bash
npm restart
```

**OU com PM2:**
```bash
pm2 restart meumu-api
```

---

### **4️⃣ Testar**

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/server/info
curl http://localhost:3001/api/server/stats
```

**Deve retornar JSON com dados REAIS, sem erros!**

---

## 🔍 VERIFICAÇÃO MANUAL (Alternativa)

Se preferir verificar as tabelas manualmente:

```bash
# Método 1: Via script
node check-tables.js

# Método 2: Direto no MySQL
mysql -u root -p -e "USE muonline; SHOW TABLES;"

# Método 3: Ver estrutura
mysql -u root -p -e "USE muonline; DESCRIBE AccountCharacter;"
```

---

## 📋 NOMES COMUNS DE TABELAS MU ONLINE

| Tipo | Nomes Possíveis |
|------|-----------------|
| **Contas** | `MEMB_INFO`, `AccountCharacter`, `ACCOUNT` |
| **Personagens** | `Character`, `CharacterInfo`, `CHARACTER` |
| **Guilds** | `Guild`, `GuildInfo`, `GUILD` |
| **Warehouse** | `warehouse`, `WareHouse`, `WAREHOUSE` |
| **Cash Shop** | `CashShopData`, `T_CashShopData` |

---

## ✅ CHECKLIST

- [ ] Executei `node auto-fix-tables.js`
- [ ] Todas as tabelas foram detectadas
- [ ] Apliquei a configuração ao .env
- [ ] Reiniciei o servidor
- [ ] Testei os endpoints (sem erro de tabela)

---

## 🐛 TROUBLESHOOTING

### **Erro: Access denied**
```bash
mysql -u root -p
GRANT ALL PRIVILEGES ON muonline.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### **Erro: Cannot find module**
```bash
npm install
```

### **Erro: .env file not found**
```bash
cp .env.template .env
nano .env  # Editar com credenciais
```

### **Tabelas não detectadas**
```bash
# Ver lista completa
node check-tables.js

# Copiar e colar a lista aqui nos comentários
# para eu ajudar a identificar!
```

---

## 📞 COMANDOS RESUMIDOS

```bash
# SOLUÇÃO COMPLETA (1 linha)
cd /home/meumu.com/public_html/backend-nodejs && node auto-fix-tables.js && cat tables-config.env >> .env && npm restart

# VERIFICAR
curl http://localhost:3001/health
```

---

## 🎉 RESULTADO ESPERADO

```json
{
  "success": true,
  "data": {
    "name": "MeuMU Online",
    "version": "Season 19-2-3 - Épico",
    "totalAccounts": 1234,
    "playersOnline": 56,
    "totalGuilds": 78
  }
}
```

---

**🚀 Pronto! Execute os comandos e me mostre o resultado!**
