# 🔐 SISTEMA DE ADMIN - WEBENGINE CMS vs DV TEAMS

**Data:** 2025-12-29 21:00 CET  
**Análise:** Código de comparação WebEngine CMS vs Banco DV Teams

---

## 🎯 **DESCOBERTA CRÍTICA:**

O **WebEngine CMS original** e o **banco DV Teams** usam **SISTEMAS DIFERENTES** para detectar administradores!

---

## 📊 **COMPARAÇÃO:**

### **❌ WebEngine CMS Original (PHP)**

**Fonte:** `codigo_de_comparacao.md`, linha 11410-11414

```php
function canAccessAdminCP($username) {
    if(!check_value($username)) return;
    // ❌ VERIFICA ARQUIVO JSON, NÃO O BANCO!
    if(array_key_exists($username, config('admins',true))) return true;
    return false;
}
```

**Sistema:**
- Admin é configurado no arquivo `webengine.json`
- Formato: `{"admins": {"admin": 100, "lorack": 50}}`
- Níveis: 0-100 (100 = acesso total)

**Linha 7529:**
```php
$webengineDefaultConfig['admins'] = array($_POST['install_step_5_1'] => 100);
```

**Linha 16069:**
```php
if(isLoggedIn() && canAccessAdminCP($_SESSION['username'])) {
    echo '<a href="'.__PATH_ADMINCP_HOME__.'" class="btn btn-primary admincp-button">AdminCP</a>';
}
```

---

### **✅ DV Teams Database (MariaDB/MySQL)**

**Fonte:** `ESTRUTURA-MUONLINE-SQL-SEASON19-DVTEAMS.md`, linha 27

```sql
CREATE TABLE `accounts` (
  `guid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `blocked` tinyint(3) unsigned DEFAULT '0',
  `web_admin` int(11) DEFAULT '0',  ← CAMPO QUE O WEBENGINE NÃO USA!
  ...
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

**Campo:**
- `web_admin` (INT)
- Valores: `0` = usuário normal, `1+` = admin
- **NÃO EXISTE NO WEBENGINE ORIGINAL!**

---

## 🤔 **POR QUE ISSO ACONTECEU?**

O banco de dados DV Teams **TEM** o campo `web_admin`, mas o WebEngine CMS original **IGNORA** ele e usa um arquivo JSON.

**Possíveis causas:**

1. **Modificação Customizada:**
   - Alguém modificou o WebEngine para usar o banco
   - Adicionaram o campo `web_admin` na tabela
   - Esqueceram de atualizar o código PHP

2. **Versão Diferente:**
   - Existe uma versão modificada do WebEngine que usa banco
   - O campo `web_admin` vem dessa versão

3. **Sistema Híbrido:**
   - O banco tem `web_admin` mas o WebEngine continua usando JSON
   - Dois sistemas convivem (banco + arquivo)

---

## 🔧 **SOLUÇÃO PARA O MEUMU ONLINE:**

Como estamos criando um **backend Node.js NOVO**, vamos **USAR O BANCO** (`web_admin`), não o arquivo JSON!

### **Backend Node.js - Sistema Correto:**

```javascript
// ✅ SEASON 19 DV TEAMS
const sql = `
  SELECT account, password, guid, email, blocked, web_admin 
  FROM accounts 
  WHERE account = ?
`;

const account = result.data[0];

// Verificar se é admin
const isAdmin = account.web_admin === 1 || account.web_admin > 0;

// Gerar JWT com isAdmin
const token = generateToken({
  accountId: account.account,
  email: account.email,
  isAdmin  ← IMPORTANTE!
});
```

---

## 📝 **REFERÊNCIAS NO WEBENGINE:**

### **1. Definição de Constantes (Linha 12319):**

```php
define('_CLMN_CTLCODE_', 'ctl1_code');  ← WebEngine usa ctl1_code (Season 6)
```

**MAS:** Season 19 DV Teams usa `web_admin`, NÃO `ctl1_code`!

### **2. Verificação de Admin (Linha 11412):**

```php
// ❌ WebEngine verifica arquivo JSON:
if(array_key_exists($username, config('admins',true))) return true;

// ✅ MeuMU Online verifica banco:
if(account.web_admin > 0) return true;
```

### **3. Mostrar Botão AdminCP (Linha 16070):**

```php
// WebEngine PHP:
if(isLoggedIn() && canAccessAdminCP($_SESSION['username'])) {
    echo '<a href="'.__PATH_ADMINCP_HOME__.'" class="btn btn-primary admincp-button">AdminCP</a>';
}

// MeuMU Online React:
{isAdmin && (
  <Link to="/admincp" className="admin-button">
    Admin CP
  </Link>
)}
```

---

## ⚠️ **IMPORTANTE:**

### **❌ NÃO CONFUNDIR:**

| Sistema | Campo Admin | Onde está |
|---------|-------------|-----------|
| **WebEngine CMS (PHP)** | `admins` array | `webengine.json` (arquivo) |
| **Season 6** | `ctl1_code` | `MEMB_INFO` (banco) |
| **Season 19 DV Teams** | `web_admin` | `accounts` (banco) |
| **MeuMU Online (Node.js)** | `web_admin` | `accounts` (banco) ✅ |

### **✅ NOSSO SISTEMA:**

```
┌─────────────────────────────────────────────┐
│  MEUMU ONLINE - ADMIN AUTHENTICATION       │
├─────────────────────────────────────────────┤
│  1. Login: POST /api/auth/login             │
│  2. Backend busca: SELECT web_admin FROM... │
│  3. JWT gerado com: { isAdmin: true }       │
│  4. Frontend verifica: user.isAdmin         │
│  5. Mostra botão: AdminCP                   │
└─────────────────────────────────────────────┘
```

---

## 🧪 **COMO VERIFICAR:**

### **1. No banco MySQL:**

```sql
SELECT account, web_admin FROM accounts WHERE account = 'admin';
```

**Esperado:** `web_admin = 1`

### **2. No backend (logs):**

```
🔍 DEBUG - Verificando permissões de admin:
   account.web_admin (raw): 1
   typeof: number
   === 1: true
👤 Tipo de conta: 👑 ADMIN (web_admin: 1)
✅ ADMIN DETECTADO!
```

### **3. No frontend (JWT):**

```javascript
const token = localStorage.getItem('auth_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('isAdmin:', payload.isAdmin);  // deve ser true
```

---

## 🎯 **CONCLUSÃO:**

**WebEngine CMS:** Usa arquivo JSON (`webengine.json`)  
**DV Teams Database:** Tem campo `web_admin` no banco  
**MeuMU Online:** Usa `web_admin` do banco (CORRETO!)

**Fabrício, nosso sistema está CERTO!** O backend está lendo `web_admin` do banco, que é o jeito correto para Season 19 DV Teams.

O problema pode ser:
1. ❌ Campo `web_admin` está zerado no banco (execute `UPDATE accounts SET web_admin = 1 WHERE account = 'admin'`)
2. ❌ Backend não foi reiniciado (execute `pm2 restart meumu-backend`)
3. ❌ Frontend não limpou cache (Ctrl+Shift+Delete)

---

**Status:** ✅ **SISTEMA IMPLEMENTADO CORRETAMENTE**

---

**Eng. Fabrício Ribeiro**  
*MeuMU Online - Season 19 DV Teams*  
*Timezone: CET (UTC+1) - Suíça*
