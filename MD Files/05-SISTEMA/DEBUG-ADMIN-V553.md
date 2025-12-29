# 🔍 DEBUG ADMIN - GUIA COMPLETO V553
**Data:** 2025-12-29 20:30 CET  
**Problema:** Conta "admin" não mostra botão AdminCP

---

## 📋 **CHECKLIST DE VERIFICAÇÃO**

Execute estes passos **NA ORDEM**:

### **✅ PASSO 1: Verificar campo `web_admin` no banco**

```bash
# No terminal do VPS:
mysql -u root -p muonline
```

```sql
-- Executar no MySQL:
SELECT guid, account, email, blocked, web_admin 
FROM accounts 
WHERE account = 'admin';
```

**Resultado esperado:**
```
+------+---------+----------------+---------+-----------+
| guid | account | email          | blocked | web_admin |
+------+---------+----------------+---------+-----------+
|    1 | admin   | admin@meumu.com|    0    |     1     |
+------+---------+----------------+---------+-----------+
```

**❌ Se `web_admin` for 0 ou NULL:**
```sql
UPDATE accounts SET web_admin = 1 WHERE account = 'admin';
SELECT account, web_admin FROM accounts WHERE account = 'admin';
```

---

### **✅ PASSO 2: Reiniciar o backend**

```bash
# No VPS:
cd /home/meumu.com/public_html/backend-nodejs
pm2 restart meumu-backend
pm2 logs meumu-backend --lines 100
```

---

### **✅ PASSO 3: Testar login e ver logs**

```bash
# No terminal do VPS (deixe rodando):
pm2 logs meumu-backend --lines 100 --raw
```

```
# No site:
1. Fazer logout
2. Limpar cache do navegador (Ctrl+Shift+Delete → Cookies e cache)
3. Fazer login com "admin"
```

**LOG ESPERADO NO BACKEND:**

```
🔐 Tentativa de login: admin
✅ Usuário encontrado: admin
✅ Senha correta para: admin
🔐 Mantendo hash SHA-256 (compatibilidade com servidor MU)
🔍 DEBUG - Verificando permissões de admin:
   account.web_admin (raw): 1        ← DEVE SER 1!
   typeof: number                     ← DEVE SER "number" ou "string"
   === 1: true                        ← DEVE SER true!
   === '1': false
   > 0: true                          ← DEVE SER true!
👤 Tipo de conta: 👑 ADMIN (web_admin: 1)  ← DEVE APARECER "👑 ADMIN"!
✅ ========================================
✅ ADMIN DETECTADO!
✅ Username: admin
✅ JWT terá isAdmin: true             ← IMPORTANTE!
✅ ========================================
✅ Login bem-sucedido: admin
```

**❌ Se aparecer "👤 USUÁRIO" em vez de "👑 ADMIN":**

O campo `web_admin` está zerado no banco! Volte ao PASSO 1.

---

### **✅ PASSO 4: Verificar JWT no navegador**

```javascript
// Abrir Console do Navegador (F12)
// Colar este código:

const token = localStorage.getItem('auth_token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('🔑 JWT Payload:', payload);
  console.log('👑 isAdmin:', payload.isAdmin);
} else {
  console.log('❌ Token não encontrado!');
}
```

**Resultado esperado:**
```json
{
  "accountId": "admin",
  "email": "admin@meumu.com",
  "isAdmin": true,      ← DEVE SER true!
  "iat": 1704047400,
  "exp": 1704133800
}
```

**❌ Se `isAdmin` for `false`:**

O backend não está detectando corretamente. Verifique logs do PASSO 3.

---

### **✅ PASSO 5: Verificar frontend**

```javascript
// Console do navegador (F12):
console.log('🔍 AuthContext user:', window.localStorage.getItem('auth_token'));

// Verificar se o botão existe no DOM:
const adminButton = document.querySelector('[href*="admincp"]');
console.log('🔘 Botão AdminCP:', adminButton ? 'EXISTE' : 'NÃO EXISTE');
```

**Se o botão NÃO EXISTE:**

O `AuthContext` não está recebendo `isAdmin: true`. Verifique o PASSO 4.

---

## 🧪 **TESTE AUTOMATIZADO**

Criei um script que testa tudo automaticamente:

```bash
# No VPS:
cd /home/meumu.com/public_html/backend-nodejs
node test-admin-account.js
```

**O script vai:**
1. Conectar no MySQL
2. Verificar estrutura da tabela `accounts`
3. Buscar conta "admin"
4. Mostrar valor de `web_admin`
5. Listar todas as contas admin

---

## 🔧 **SOLUÇÕES PARA PROBLEMAS COMUNS**

### **❌ Problema 1: `web_admin` é NULL**

```sql
UPDATE accounts SET web_admin = 1 WHERE account = 'admin';
```

### **❌ Problema 2: Conta bloqueada**

```sql
UPDATE accounts SET blocked = 0 WHERE account = 'admin';
```

### **❌ Problema 3: Backend não reiniciou**

```bash
pm2 restart meumu-backend
pm2 logs meumu-backend --lines 50
```

### **❌ Problema 4: Frontend não atualizou**

```bash
# Limpar cache do navegador:
Ctrl+Shift+Delete → Marcar "Cookies" e "Cache" → Limpar

# Ou testar em modo anônimo:
Ctrl+Shift+N (Chrome) ou Ctrl+Shift+P (Firefox)
```

### **❌ Problema 5: Senha incorreta**

```sql
-- Ver hash da senha no banco:
SELECT account, password FROM accounts WHERE account = 'admin';

-- Se precisar resetar senha:
-- (Substitua "novasenha" pela senha desejada)
UPDATE accounts 
SET password = SHA2(CONCAT('admin', ':', 'novasenha'), 256) 
WHERE account = 'admin';
```

---

## 📊 **ESTRUTURA CORRETA DO BANCO**

```sql
-- Tabela accounts (Season 19 DV Teams)
CREATE TABLE `accounts` (
  `guid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account` varchar(255) DEFAULT NULL,     -- Username
  `password` varchar(255) DEFAULT NULL,    -- SHA-256(username:password)
  `email` varchar(255) DEFAULT NULL,
  `blocked` tinyint(3) unsigned DEFAULT '0',  -- 0 = ativo, 1 = bloqueado
  `web_admin` int(11) DEFAULT '0',         -- 0 = user, 1+ = admin
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

**Valores de `web_admin`:**
- `0` = Usuário normal (sem AdminCP)
- `1` = Administrador (acesso total ao AdminCP)
- `2+` = Níveis customizados (futuro)

---

## 🎯 **SQL COMPLETO DE FIX**

Execute este SQL para garantir que tudo está correto:

```sql
USE muonline;

-- 1. Verificar conta atual
SELECT guid, account, email, blocked, web_admin 
FROM accounts 
WHERE account = 'admin';

-- 2. Corrigir (se necessário)
UPDATE accounts 
SET web_admin = 1, 
    blocked = 0 
WHERE account = 'admin';

-- 3. Verificar resultado
SELECT guid, account, email, blocked, web_admin,
  CASE 
    WHEN web_admin > 0 THEN '✅ É ADMIN'
    ELSE '❌ NÃO É ADMIN'
  END AS status
FROM accounts 
WHERE account = 'admin';

-- 4. Listar TODOS os admins
SELECT guid, account, email, web_admin
FROM accounts
WHERE web_admin > 0
ORDER BY web_admin DESC;
```

---

## 📝 **CHECKLIST FINAL**

Antes de me avisar que "não funcionou", verifique:

- [ ] ✅ `web_admin = 1` no banco
- [ ] ✅ `blocked = 0` no banco
- [ ] ✅ Backend reiniciado (`pm2 restart meumu-backend`)
- [ ] ✅ Cache do navegador limpo
- [ ] ✅ Logout/Login feito novamente
- [ ] ✅ Logs do backend mostram "👑 ADMIN DETECTADO!"
- [ ] ✅ JWT tem `isAdmin: true`
- [ ] ✅ Navegador sem erros no console (F12)

---

## 🚀 **SE TUDO ACIMA ESTIVER OK E AINDA NÃO FUNCIONAR:**

Me envie:

1. **Screenshot do resultado do SQL:**
```sql
SELECT account, web_admin FROM accounts WHERE account = 'admin';
```

2. **Logs do backend durante login:**
```bash
pm2 logs meumu-backend --lines 100
```

3. **Resultado do JWT no console:**
```javascript
const token = localStorage.getItem('auth_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
```

4. **Screenshot do botão AdminCP** (se aparece ou não)

---

**Fabrício, siga este guia PASSO A PASSO e me envie os resultados!** 🚀

---

**Eng. Fabrício Ribeiro**  
*MeuMU Online - Season 19 DV Teams*  
*Timezone: CET (UTC+1) - Suíça*
