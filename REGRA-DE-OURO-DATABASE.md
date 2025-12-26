# 🎯 REGRA DE OURO: ARQUITETURA DE BANCO DE DADOS

**Data:** 26 de dezembro de 2024  
**Autor:** Fabricio (Root)  
**Aplicação:** MeuMU Online - Backend Node.js  

---

## 🏆 **A REGRA DE OURO**

> **"Nunca adapte o banco para o código errado."**  
> **"Sempre adapte o código ao banco do servidor."**

Esta é a **regra fundamental** que garante a integridade, estabilidade e longevidade do seu servidor MU Online.

---

## ❌ **O QUE NÃO FAZER (ERROS CRÍTICOS)**

### **1. NÃO Adicionar Colunas para "Agradar" Editores Antigos**

**Erro comum:**
```sql
-- ❌ ERRADO! Nunca faça isso!
ALTER TABLE character_info ADD COLUMN goblin_points INT DEFAULT 0;
```

**Por que é errado:**
- `goblin_points` é de editores **Season 6 obsoletos**
- DV-Team Season 19 usa **schema normalizado** (sem essa coluna)
- Adicionar mascara o problema, não resolve
- Pode corromper dados a longo prazo

**Solução correta:**
- **Trocar** para editor compatível com Season 19
- **Ou** criar personagem pelo client (não pelo editor)

---

### **2. NÃO Criar Tabelas que Não Existem no Servidor**

**Erro comum:**
```sql
-- ❌ ERRADO! DV-Team não usa esta tabela!
CREATE TABLE Character (
    name VARCHAR(50),
    goblin_points INT
);
```

**Por que é errado:**
- DV-Team Season 19 usa `character_info` (normalizado)
- Tabela `Character` é de versões **antigas não normalizadas**
- Criar tabela "fake" não resolve incompatibilidade

**Solução correta:**
- Usar `character_info` + `character_add_stat` + `character_inventory`
- Seguir estrutura **exata** do DV-Team

---

### **3. NÃO Misturar Schemas Antigos com Modernos**

**Erro comum:**
```sql
-- ❌ ERRADO! Misturando Season 6 com Season 19
ALTER TABLE accounts ADD COLUMN memb___id VARCHAR(10); -- Season 6
-- Mas a tabela já tem 'account' (Season 19)
```

**Por que é errado:**
- Schemas diferentes **não são compatíveis**
- Causa inconsistências e bugs
- Dificulta manutenção

**Solução correta:**
- **Escolher UMA estrutura** e seguir 100%
- DV-Team Season 19 = `account`, `password`, `email`, `guid`
- Season 6 = `memb___id`, `memb__pwd`, `mail_addr`

---

## ✅ **O QUE FAZER (ABORDAGEM CORRETA)**

### **1. Detectar Estrutura do Banco**

```javascript
// ✅ CORRETO: Código se adapta ao banco
const checkStructureSql = `
  SELECT COLUMN_NAME 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts'
  AND COLUMN_NAME IN ('account', 'memb___id')
`;

const result = await executeQuery(checkStructureSql);
const isSeason19 = result.data[0].COLUMN_NAME === 'account';
```

**Vantagem:**
- Código funciona em **qualquer** versão do banco
- Sem hardcoding de estrutura
- Manutenível e escalável

---

### **2. Inserir APENAS Campos Essenciais**

```javascript
// ✅ CORRETO: Apenas campos que SABEMOS que existem
const insertSql = `
  INSERT INTO accounts 
  (account, password, email)
  VALUES (?, ?, ?)
`;
```

**Evitar:**
```javascript
// ❌ ERRADO: Assumindo colunas que podem não existir
const insertSql = `
  INSERT INTO accounts 
  (account, password, email, blocked, vip_level, cash_credits)
  VALUES (?, ?, ?, 0, 0, 0)
`;
```

**Por que evitar:**
- `blocked`, `vip_level`, `cash_credits` podem **não existir**
- Causa erro: `Unknown column 'blocked' in 'field list'`

---

### **3. Deixar Client Criar Personagem (Não o Site)**

**Fluxo CORRETO:**

```
1. Usuário acessa site
2. Site cria APENAS a conta (tabela accounts)
3. Usuário abre o CLIENT do jogo
4. CLIENT cria personagem completo:
   - character_info
   - character_add_stat
   - character_inventory
   - character_quest
   - etc.
```

**Vantagens:**
- ✅ Zero risco de corrupção de dados
- ✅ 100% compatível com servidor
- ✅ Todos os campos preenchidos corretamente
- ✅ Inventário inicial, quests, stats OK

---

## 🔧 **IMPLEMENTAÇÃO NO MEUMU ONLINE**

### **Antes (ERRADO):**

```javascript
// ❌ Tentava criar personagem e inserir em colunas inexistentes
const insertSql = `
  INSERT INTO accounts 
  (account, password, email, blocked, vip_level, cash_credits)
  VALUES (?, ?, ?, 0, 0, 0)
`;
// Resultado: Erro 400 - Unknown column 'blocked'
```

---

### **Depois (CORRETO):**

```javascript
// ✅ Detecta colunas existentes dinamicamente
const checkColumnsSql = `
  SELECT COLUMN_NAME 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts'
  AND COLUMN_NAME IN ('created_at', 'guid')
`;

const columnsResult = await executeQuery(checkColumnsSql);
const hasCreatedAt = columnsResult.data.some(row => row.COLUMN_NAME === 'created_at');

// Montar INSERT apenas com colunas que EXISTEM
const columns = ['account', 'password', 'email'];
const values = ['?', '?', '?'];

if (hasCreatedAt) {
  columns.push('created_at');
  values.push('NOW()');
}

const insertSql = `
  INSERT INTO accounts 
  (${columns.join(', ')})
  VALUES (${values.join(', ')})
`;
// Resultado: ✅ Funciona em qualquer versão do banco
```

---

## 📋 **CHECKLIST DE BOAS PRÁTICAS**

### **Ao Escrever Código de Banco de Dados:**

- [ ] **NÃO** assumir que colunas existem
- [ ] **SEMPRE** detectar estrutura com `INFORMATION_SCHEMA`
- [ ] **NÃO** adicionar colunas para "forçar" compatibilidade
- [ ] **SEMPRE** adaptar código ao banco (não o contrário)
- [ ] **NÃO** criar personagens pelo site
- [ ] **SEMPRE** deixar client criar personagens
- [ ] **NÃO** misturar schemas diferentes
- [ ] **SEMPRE** seguir ONE estrutura (Season 6 OU Season 19)

---

## 🆘 **QUANDO ALGO DÁ ERRADO**

### **Erro: "Unknown column 'X' in 'field list'"**

**Diagnóstico:**
```sql
-- Ver estrutura real da tabela
DESCRIBE accounts;
```

**Soluções possíveis:**

1. **Remover coluna do INSERT** (mais comum)
2. **Detectar coluna dinamicamente** (melhor)
3. **~~Adicionar coluna~~** (❌ NÃO FAÇA ISSO!)

---

### **Erro: "Table 'Character' doesn't exist"**

**Diagnóstico:**
- Editor ou script usa tabela **obsoleta**

**Solução:**
- Trocar editor para versão compatível
- Ou ajustar código para usar `character_info`

---

## 🎓 **LIÇÕES APRENDIDAS**

### **1. Editores Antigos ≠ Bancos Modernos**

- MU Editor (Season 6) ≠ DV-Team (Season 19)
- Não force compatibilidade
- Use ferramentas compatíveis

---

### **2. Site Cria Conta, Client Cria Personagem**

- **Site:** Tabela `accounts` apenas
- **Client:** Tabelas `character_*` completas
- **Divisão de responsabilidades** = menos bugs

---

### **3. Schema Normalizado é Mais Seguro**

- DV-Team Season 19 separa dados em tabelas
- Menos redundância
- Mais integridade
- Mais performance

---

## 📚 **DOCUMENTAÇÃO TÉCNICA**

### **Estrutura DV-Team Season 19 (Normalizada):**

```
muonline/
├── accounts                    → Contas de usuários
│   ├── guid (PK)              → ID único
│   ├── account                → Nome da conta
│   ├── password               → Hash MD5 da senha
│   ├── email                  → Email
│   └── created_at             → Data de criação
│
├── character_info              → Informações básicas do personagem
│   ├── guid (PK)              → ID único do char
│   ├── account_guid (FK)      → Referência para accounts.guid
│   ├── name                   → Nome do personagem
│   ├── class                  → Classe (DW, DK, ELF, etc.)
│   └── level                  → Nível
│
├── character_add_stat          → Stats adicionais
│   ├── character_guid (FK)
│   ├── strength
│   ├── agility
│   └── ...
│
└── character_inventory         → Inventário (hex)
    ├── character_guid (FK)
    └── items (BLOB)
```

---

### **Estrutura Season 6 (Antiga/Não Normalizada):**

```
MuOnline/
├── MEMB_INFO                   → Contas de usuários
│   ├── memb___id (PK)         → Nome da conta
│   ├── memb__pwd              → Hash MD5 da senha
│   ├── mail_addr              → Email
│   └── ...
│
└── Character                   → TUDO do personagem em uma tabela
    ├── AccountID (FK)
    ├── Name
    ├── Class
    ├── Level
    ├── Strength
    ├── Inventory (hex)
    └── ... (50+ colunas!)
```

**Diferenças:**
- Season 6: **1 tabela** com tudo (não normalizado)
- Season 19: **Múltiplas tabelas** (normalizado)
- Season 19 é **MAIS SEGURO** e **PERFORMÁTICO**

---

## 🚀 **APLICAÇÃO NO MEUMU ONLINE**

### **Arquivo Corrigido:**

`/backend-nodejs/src/controllers/authController.js`

**Linha 227-265:**
```javascript
if (isSeason19) {
  // ✅ REGRA DE OURO: Detectar colunas e inserir apenas as existentes
  const checkColumnsSql = `...`;
  const columnsResult = await executeQuery(checkColumnsSql);
  
  const columns = ['account', 'password', 'email'];
  const values = ['?', '?', '?'];
  const params = [cleanUsername, hashedPassword, email];
  
  if (hasCreatedAt) {
    columns.push('created_at');
    values.push('NOW()');
  }
  
  insertSql = `
    INSERT INTO accounts 
    (${columns.join(', ')})
    VALUES (${values.join(', ')})
  `;
  
  // ❌ NÃO TENTAMOS criar personagem!
  // ❌ NÃO ASSUMIMOS colunas extras!
  // ✅ APENAS conta (accounts)
}
```

---

## 🎉 **CONCLUSÃO**

A **Regra de Ouro** não é apenas uma "boa prática" - é **essencial** para:

✅ Manter integridade dos dados  
✅ Evitar corrupção de personagens  
✅ Garantir compatibilidade com servidor  
✅ Facilitar manutenção futura  
✅ Escalar projeto sem problemas  

**Sempre lembre:**
> **"Adapte o código ao banco, NUNCA o banco ao código."**

---

## 📞 **SUPORTE**

Se precisar adicionar funcionalidades:

1. **Primeiro:** Verificar se banco suporta
2. **Depois:** Adaptar código
3. **Nunca:** Alterar schema do banco

**Exceções:**
- Tabelas **novas** para site (não tocar em tabelas do servidor)
- Database `meuweb` (separado do `muonline`)

---

**📖 Leia também:**
- `/ROLLBACK-COLUNAS-EXTRAS.sql` - Script de limpeza
- `/backend-nodejs/src/controllers/authController.js` - Implementação correta
- `/DIAGNOSTICO-E-CORRECAO-LOGIN.sql` - Diagnóstico de estrutura

---

**Última atualização:** 26/12/2024  
**Status:** ✅ Implementado e testado  
**Versão:** 2.0 (Regra de Ouro aplicada)
