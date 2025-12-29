# 🚨 CORREÇÃO CRÍTICA - WCoin Duplicados + Personagens

**Data:** 2025-12-30 08:00 CET (UTC+1)  
**Versão:** V571  
**Status:** 🔴 **2 BUGS CRÍTICOS CORRIGIDOS**

---

## 🐛 **BUG 1: WCOIN PACKAGES DUPLICADOS (11x)**

### **PROBLEMA:**
- Dashboard mostra 66 pacotes de WCoin (11 repetições de cada valor)
- Deveria mostrar apenas 6 pacotes (R$ 10, 30, 60, 120, 300, 600)

### **CAUSA:**
- Tabela `meuweb.wcoin_packages` contém registros duplicados
- Provavelmente foram inseridos múltiplas vezes sem limpar antes

### **SOLUÇÃO:**

#### **MÉTODO 1: Via SSH (Recomendado)**

```bash
# 1. Acessar VPS
ssh root@seu-vps-ip

# 2. Executar script de limpeza
cd /home/meumu.cyou/backend-nodejs
mysql -u root -p meuweb < src/seeders/fix-wcoin-duplicates.sql

# 3. Verificar resultado
mysql -u root -p -e "USE meuweb; SELECT * FROM wcoin_packages ORDER BY display_order;"
```

**Resultado esperado:**
```
+----+-------------------+--------------+--------------+--------+----------+-----------------+-----------+---------------+
| id | name              | wcoin_amount | bonus_amount | price  | currency | purchase_link   | is_active | display_order |
+----+-------------------+--------------+--------------+--------+----------+-----------------+-----------+---------------+
|  1 | Pacote Iniciante  |         1000 |            0 |  10.00 | BRL      | #               |         1 |             1 |
|  2 | Pacote Bronze     |         3000 |          300 |  30.00 | BRL      | #               |         1 |             2 |
|  3 | Pacote Prata      |         6000 |          900 |  60.00 | BRL      | #               |         1 |             3 |
|  4 | Pacote Ouro       |        12000 |         2400 | 120.00 | BRL      | #               |         1 |             4 |
|  5 | Pacote Diamante   |        30000 |         7500 | 300.00 | BRL      | #               |         1 |             5 |
|  6 | Pacote Lendário   |        60000 |        18000 | 600.00 | BRL      | #               |         1 |             6 |
+----+-------------------+--------------+--------------+--------+----------+-----------------+-----------+---------------+
```

#### **MÉTODO 2: Via phpMyAdmin**

1. Acessar **CyberPanel → phpMyAdmin**
2. Selecionar banco **meuweb**
3. Aba **"SQL"**
4. Copiar TODO o conteúdo de `/backend-nodejs/src/seeders/fix-wcoin-duplicates.sql`
5. Executar
6. Verificar mensagem: `✅ Total de pacotes: 6`

#### **TESTAR SE FUNCIONOU:**

1. Limpar cache do navegador (Ctrl + Shift + Delete)
2. Acessar site: `https://meumu.cyou`
3. Fazer login
4. Dashboard → Aba **"Loja"**
5. **Deve aparecer apenas 6 pacotes** (não 66)

---

## 🐛 **BUG 2: PERSONAGEM "MeuMuzin" NÃO APARECE**

### **PROBLEMA:**
- Personagem existe no jogo (visível in-game)
- Site diz: "Você ainda não possui personagens"

### **CAUSA:**
```javascript
// charactersController.js LINHA 38-39 (ANTES - ERRADO)
const getGuidSql = `SELECT guid FROM accounts WHERE account = ?`;
const guidResult = await executeQueryMU(getGuidSql, [accountId]);
// ...
WHERE account_id = ?  // ❌ Buscando por GUID

// ========================================================================
// PROBLEMA: Na tabela character_info do MU Season 19, o campo account_id
// NÃO é um GUID numérico! É uma STRING com o nome da conta!
// ========================================================================
```

**Estrutura REAL da tabela `character_info`:**
```sql
CREATE TABLE character_info (
  guid INT PRIMARY KEY,
  name VARCHAR(10),
  account_id VARCHAR(10),  -- ❌ É STRING, não GUID!
  race INT,
  level INT,
  ...
);

-- Exemplo de dados REAIS:
-- guid | name      | account_id
-- 1    | MeuMuzin  | admin       <-- account_id é "admin", não um número!
```

### **SOLUÇÃO APLICADA:**

✅ **Arquivo corrigido:** `/backend-nodejs/src/controllers/charactersController.js`

**ANTES (ERRADO):**
```javascript
// Buscar GUID primeiro
const getGuidSql = `SELECT guid FROM accounts WHERE account = ?`;
const guidResult = await executeQueryMU(getGuidSql, [accountId]);
const accountGuid = guidResult.data[0].guid;

// Buscar chars por GUID
WHERE account_id = ?  // ❌ account_id não é GUID!
[accountGuid]
```

**DEPOIS (CORRETO):**
```javascript
// Buscar chars diretamente por nome da conta
WHERE account_id = ?  // ✅ account_id é STRING!
[accountId]  // accountId = "admin"
```

### **COMO TESTAR:**

#### **1. Reiniciar backend Node.js:**
```bash
ssh root@seu-vps-ip
pm2 restart backend

# Verificar logs
pm2 logs backend --lines 50
```

#### **2. Testar API diretamente:**
```bash
# Obter token JWT
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"SUA_SENHA"}'

# Copiar o token da resposta e usar abaixo:
curl -X GET http://localhost:3001/api/characters \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "name": "MeuMuzin",
      "level": 1,
      "masterLevel": 0,
      "majesticLevel": 0,
      "class": "Dark Knight",
      "classNumber": 0,
      "stats": {
        "strength": 18,
        "dexterity": 18,
        "vitality": 15,
        "energy": 15,
        "command": 0
      },
      "zen": 0,
      "resets": 0,
      "online": true
    }
  ]
}
```

#### **3. Testar no site:**
1. Acessar: `https://meumu.cyou`
2. Fazer login com conta `admin`
3. Dashboard → Aba **"Personagens"**
4. **Deve aparecer "MeuMuzin"**

---

## 🔍 **DEBUG: Se personagem ainda não aparecer**

### **Verificar dados no banco:**
```bash
# Conectar ao MariaDB
mysql -u root -p

# Executar queries de debug
USE muonline;

-- Verificar se a conta existe
SELECT guid, account FROM accounts WHERE account = 'admin';

-- Verificar se o char existe
SELECT guid, name, account_id, level, race, online 
FROM character_info 
WHERE name = 'MeuMuzin';

-- Verificar relação account <-> character
SELECT 
  a.account,
  c.name,
  c.account_id,
  c.level,
  c.online
FROM accounts a
LEFT JOIN character_info c ON c.account_id = a.account
WHERE a.account = 'admin';
```

**Resultado esperado:**
```
+--------+-----------+------------+-------+--------+
| account| name      | account_id | level | online |
+--------+-----------+------------+-------+--------+
| admin  | MeuMuzin  | admin      |     1 |      1 |
+--------+-----------+------------+-------+--------+
```

### **Se a coluna account_id estiver NULL ou diferente:**
```sql
-- CORRIGIR manualmente (CUIDADO!)
UPDATE character_info 
SET account_id = 'admin' 
WHERE name = 'MeuMuzin';
```

---

## 📊 **RESUMO DAS CORREÇÕES V571**

| Bug | Status | Arquivo Modificado | Ação Necessária |
|-----|--------|-------------------|-----------------|
| WCoin duplicados | ✅ Script criado | `fix-wcoin-duplicates.sql` | Executar SQL |
| Char não aparece | ✅ Código corrigido | `charactersController.js` | Reiniciar backend |
| Shield not defined | ✅ Corrigido V571 | `admin-security-audit.tsx` | - |
| Eventos vazios | ✅ Script criado | `events-seeder.sql` | Executar SQL |

---

## 🚀 **AÇÕES OBRIGATÓRIAS**

### **PASSO 1: Corrigir WCoin (5 min)**
```bash
cd /home/meumu.cyou/backend-nodejs
mysql -u root -p meuweb < src/seeders/fix-wcoin-duplicates.sql
```

### **PASSO 2: Reiniciar Backend (1 min)**
```bash
pm2 restart backend
pm2 logs backend --lines 20
```

### **PASSO 3: Testar no Site (2 min)**
1. Limpar cache do navegador
2. Login → Dashboard
3. Verificar:
   - ✅ Loja mostra 6 pacotes (não 66)
   - ✅ Personagens mostra "MeuMuzin"

---

## ⚠️ **IMPORTANTE**

1. **SEMPRE fazer backup antes:**
   ```bash
   mysqldump -u root -p meuweb wcoin_packages > wcoin_backup.sql
   ```

2. **Não executar seeders múltiplas vezes** sem limpar antes

3. **Se algo der errado, restaurar backup:**
   ```bash
   mysql -u root -p meuweb < wcoin_backup.sql
   ```

---

**EXECUTE AS CORREÇÕES E ME CONFIRME O RESULTADO! 🎯**
