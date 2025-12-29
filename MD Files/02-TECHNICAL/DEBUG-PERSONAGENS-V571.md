# 🔍 DEBUG - PERSONAGENS NÃO APARECEM (V571)

**Data:** 2025-12-30 08:30 CET (UTC+1)  
**Versão:** V571  
**Status:** 🟡 **AGUARDANDO LOGS**

---

## 🐛 **PROBLEMA**

Usuários `admin` e `lorack` fazem login no site, mas a aba "Personagens" mostra:
```
"Você ainda não possui personagens. Crie um no jogo!"
```

Porém, os personagens **EXISTEM** no jogo (visível in-game).

---

## ✅ **CORREÇÕES APLICADAS NA V571**

### **1. Endpoint `/api/auth/logout` criado** ✅
- **Problema:** 404 Not Found ao fazer logout
- **Correção:** Endpoint adicionado em `/backend-nodejs/src/routes/auth.js`
- **Função:** Criada em `/backend-nodejs/src/controllers/authController.js`

### **2. Logs detalhados adicionados** ✅
- **Arquivo:** `/backend-nodejs/src/controllers/charactersController.js`
- **Logs adicionados:**
  - Account ID vindo do JWT
  - SQL Query completa
  - Resultados da query
  - DEBUG automático se não encontrar (mostra primeiros 5 chars da tabela)

### **3. Query corrigida** ✅
- **ANTES (ERRADO):** Buscava GUID primeiro, depois usava GUID no filtro
- **DEPOIS (CORRETO):** Busca diretamente por `account_id = accountName`

---

## 🚀 **COMO DESCOBRIR O PROBLEMA**

### **PASSO 1: Reiniciar backend com logs detalhados**

```bash
ssh root@seu-vps-ip
cd /home/meumu.cyou/backend-nodejs
pm2 restart backend
pm2 logs backend --lines 0
```

**Deixe este terminal aberto!** Os logs aparecerão em tempo real.

---

### **PASSO 2: Fazer login no site**

1. Abrir `https://meumu.cyou` em outro navegador/aba
2. Fazer login com `lorack` (ou `admin`)
3. Ir para Dashboard → Aba "Personagens"
4. **VOLTAR ao terminal SSH e copiar OS LOGS**

---

### **PASSO 3: Analisar os logs**

Os logs vão mostrar algo assim:

#### **CASO 1: Personagens encontrados (SUCESSO)** ✅
```
📊 ========================================
📊 BUSCANDO PERSONAGENS
📊 ========================================
📊 Account ID (do JWT): lorack
📊 Account ID Type: string
📊 Tabela: character_info
📊 SQL Query:
SELECT name, account_id, race, level, ... FROM character_info WHERE account_id = ? ORDER BY name ASC
📊 Parâmetros: [lorack]
📊 Query executada!
📊 Success: true
📊 Data length: 2
📊 Personagens encontrados:
   1. LorackChar1 (account_id: lorack, level: 150)
   2. LorackChar2 (account_id: lorack, level: 80)
✅ Retornando 2 personagens
✅ ========================================
```

**SE VER ISSO** → Problema resolvido! ✅

---

#### **CASO 2: Nenhum personagem encontrado (PROBLEMA)** ⚠️
```
📊 ========================================
📊 BUSCANDO PERSONAGENS
📊 ========================================
📊 Account ID (do JWT): lorack
📊 Account ID Type: string
📊 Tabela: character_info
📊 SQL Query:
SELECT name, account_id, ... FROM character_info WHERE account_id = ? ORDER BY name ASC
📊 Parâmetros: [lorack]
📊 Query executada!
📊 Success: true
📊 Data length: 0
⚠️  Nenhum personagem encontrado!
⚠️  Verificando se problema é SQL ou dados...
⚠️  DEBUG: Tabela TEM personagens:
   1. MeuMuzin → account_id: "admin" (type: string)
   2. TestChar → account_id: "test123" (type: string)
   3. LorackDK → account_id: "LORACK" (type: string)  ← ❗ OLHE AQUI!
✅ Retornando 0 personagens
✅ ========================================
```

**SE VER ISSO** → O problema é **CASE SENSITIVE**!

---

## 🔍 **ANÁLISE DOS LOGS**

### **Cenário A: `account_id` está MAIÚSCULO no banco**

Se nos logs do DEBUG aparecer:
```
LorackDK → account_id: "LORACK" (type: string)
```

Mas o JWT contém:
```
📊 Account ID (do JWT): lorack  ← minúsculo
```

**SOLUÇÃO:** Banco está usando MAIÚSCULAS, mas JWT está em minúsculas.

#### **Opção 1: Atualizar banco (PERIGOSO!)**
```sql
USE muonline;

-- VERIFICAR PRIMEIRO
SELECT name, account_id FROM character_info WHERE LOWER(account_id) = 'lorack';

-- SE ENCONTRAR, ATUALIZAR
UPDATE character_info 
SET account_id = LOWER(account_id) 
WHERE account_id = 'LORACK';
```

#### **Opção 2: Alterar query para case-insensitive (SEGURO)**
```javascript
// No charactersController.js, trocar WHERE por:
WHERE LOWER(account_id) = LOWER(?)
```

---

### **Cenário B: `account_id` está NULL no banco**

Se nos logs aparecer:
```
MeuMuzin → account_id: "null" (type: object)
```

**SOLUÇÃO:** Preencher manualmente o `account_id`:

```sql
USE muonline;

-- Verificar personagens sem account_id
SELECT guid, name, account_id FROM character_info WHERE account_id IS NULL OR account_id = '';

-- Atualizar manualmente (exemplo)
UPDATE character_info 
SET account_id = 'lorack' 
WHERE name = 'LorackDK';
```

---

### **Cenário C: Coluna `account_id` não existe**

Se aparecer erro:
```
❌ Erro SQL: Unknown column 'account_id' in 'where clause'
```

**SOLUÇÃO:** Descobrir qual é a coluna correta:

```sql
USE muonline;

-- Mostrar estrutura da tabela
DESCRIBE character_info;

-- Procurar coluna que guarda nome da conta
SELECT * FROM character_info LIMIT 1;
```

---

## 📋 **CHECKLIST DE DEBUG**

### **1. Verificar estrutura da tabela:**
```sql
DESCRIBE muonline.character_info;
```

**Procure por:**
- ✅ `account_id` VARCHAR
- ❌ `account_guid` INT (se for isso, precisa mudar a query!)
- ❌ `memb___id` VARCHAR (Season 6, precisa adaptar)

### **2. Verificar dados dos personagens:**
```sql
SELECT guid, name, account_id 
FROM muonline.character_info 
WHERE name IN ('MeuMuzin', 'LorackDK') 
LIMIT 10;
```

**Verificar:**
- ✅ `account_id` contém string "admin", "lorack", etc.
- ❌ `account_id` é NULL (precisa preencher)
- ❌ `account_id` é MAIÚSCULO "LORACK" (case sensitive)

### **3. Verificar accounts:**
```sql
SELECT guid, account 
FROM muonline.accounts 
WHERE account IN ('admin', 'lorack');
```

**Verificar:**
- ✅ `account` é minúsculo "lorack"
- ❌ `account` é maiúsculo "LORACK" (inconsistência!)

---

## 🛠️ **SOLUÇÕES RÁPIDAS**

### **Se account_id está maiúsculo:**
```sql
UPDATE muonline.character_info 
SET account_id = LOWER(account_id);
```

### **Se account_id está NULL:**
```sql
-- Descobrir relação
SELECT c.guid, c.name, a.account
FROM muonline.character_info c
JOIN muonline.accounts a ON c.??? = a.guid  ← descobrir relação
WHERE c.account_id IS NULL;

-- Depois atualizar
UPDATE muonline.character_info c
JOIN muonline.accounts a ON c.??? = a.guid
SET c.account_id = a.account
WHERE c.account_id IS NULL;
```

---

## 🚨 **EXECUTE AGORA E ME ENVIE OS LOGS**

```bash
# Terminal 1 (logs em tempo real)
ssh root@seu-vps-ip
pm2 logs backend --lines 0

# Navegador (outro terminal/aba)
1. Login no site
2. Ir em Personagens
3. COPIAR os logs que aparecem
4. ME ENVIAR
```

**COM OS LOGS, CONSIGO IDENTIFICAR O PROBLEMA EXATO! 🎯**
