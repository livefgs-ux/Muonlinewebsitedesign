# 📝 CHANGELOG - VERSÃO 528
**Data:** 2025-12-29 00:30 UTC  
**Tipo:** 🔐 CRITICAL FIX - Hash Algorithm (DV Teams)  
**Prioridade:** ⚠️ CRÍTICA

---

## 🎯 **RESUMO**

Corrigido algoritmo de hash de senhas após análise do código de referência do WebEngine CMS. O servidor DV Teams usa **SHA-256(username:password)**, não SHA-256 puro.

---

## 🔍 **PROBLEMA IDENTIFICADO**

### **Sintoma:**
- ✅ Usuário `tiongas` consegue logar no **jogo** com senha `123123`
- ❌ Usuário `tiongas` NÃO consegue logar no **site** com mesma senha
- ❌ Erro 401 (Unauthorized) sempre retornado

### **Log do Erro:**
```bash
🔐 Tentativa de login: tiongas
✅ Usuário encontrado: tiongas
❌ Senha incorreta para: tiongas
# Hash no banco: 0244872fafb64a346d6f70665c5225288c3b984224595c8533a4a9720a1651c6
# Nenhum dos 6 algoritmos testados bateu
```

### **Causa Raiz:**
O `helpers.js` testava 6 algoritmos, mas **NENHUM** era o correto usado pelo DV Teams:

❌ **Testávamos:**
1. SHA-256(password)
2. SHA-256(guid + password)
3. SHA-256(password + guid)
4. SHA-256(MD5(password))
5. SHA-256(MD5 + guid)
6. SHA-256(guid + MD5)

✅ **Algoritmo CORRETO (DV Teams / WebEngine CMS):**
```
SHA-256(username:password)
```

**Exemplo:**
```javascript
// Usuário: tiongas
// Senha: 123123
// Hash: SHA-256('tiongas:123123')
```

---

## 🔧 **SOLUÇÃO APLICADA**

### **1. Descoberta do Algoritmo**

Analisado código de referência do WebEngine CMS (`codigo_de_comparacao.md`, linha 13269):

```php
// WebEngine CMS - Account.class.php
$data = array(
    'username' => $username,
    'password' => hash('sha256', $username.':'.$password),  // ← AQUI!
    'serial' => $this->_defaultAccountSerial,
    'email' => $email
);
```

**Formato:** `username:password` (com dois-pontos separando)

---

### **2. Correção no `helpers.js`**

**Arquivo:** `/home/meumu.com/public_html/backend-nodejs/src/utils/helpers.js`  
**Versão:** 528  
**Data:** 2025-12-29 00:30

**Mudança:**
```javascript
// ANTES (6 algoritmos)
const comparePassword = async (password, hash, guid = null) => {
  // ... testes 1-6 (nenhum funcionava)
}

// DEPOIS (8 algoritmos)
const comparePassword = async (password, hash, guid = null, username = null) => {
  // ✅ TESTE #1 (NOVO - DV TEAMS)
  if (username) {
    const sha256UsernamePass = crypto.createHash('sha256')
      .update(username + ':' + password)
      .digest('hex');
    
    if (sha256UsernamePass.toLowerCase() === cleanHash.toLowerCase()) {
      console.log('✅ MATCH: SHA-256(username:password) - DV Teams / WebEngine CMS');
      return true;
    }
  }
  
  // ... testes 2-8 (antigos testes 1-6 + 2 novos)
}
```

**Adicionados 2 novos testes:**
- ✅ **Teste #1:** SHA-256(username:password) ← **CRITICAL!**
- ✅ **Teste #8:** SHA-256(MD5(username:password))

**Total agora:** **8 algoritmos testados**

---

### **3. Correção no `authController.js` (Login)**

**Arquivo:** `/home/meumu.com/public_html/backend-nodejs/src/controllers/authController.js`  
**Versão:** 528  
**Data:** 2025-12-29 00:30

**Mudança:**
```javascript
// ANTES
const passwordMatch = await comparePassword(password, account.pwd, String(account.guid));

// DEPOIS
const passwordMatch = await comparePassword(
  password, 
  account.pwd, 
  String(account.guid),
  account.username  // ← NOVO! Passa username para testar algoritmo DV Teams
);
```

---

### **4. Correção no `authController.js` (Registro)**

**Arquivo:** `/home/meumu.com/public_html/backend-nodejs/src/controllers/authController.js`  
**Versão:** 528  
**Data:** 2025-12-29 00:30

**Mudança:**
```javascript
// ANTES (ERRADO)
const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

// DEPOIS (CORRETO - DV TEAMS)
// ✅ ALGORITMO CORRETO: SHA-256(username:password)
// Fonte: WebEngine CMS (codigo_de_comparacao.md, linha 13269)
// Código PHP original: hash('sha256', $username.':'.$password)
const crypto = require('crypto');
const hashedPassword = crypto.createHash('sha256')
  .update(cleanUsername + ':' + password)
  .digest('hex');

console.log(`🔐 Algoritmo: SHA-256(${cleanUsername}:${password})`);
console.log(`🔐 Tamanho do hash: ${hashedPassword.length} caracteres (deve ser 64)`);
```

---

## 📊 **IMPACTO**

### **Antes (V.527):**
| Operação | Status |
|----------|--------|
| Login no jogo | ✅ Funciona |
| Login no site | ❌ Sempre falha (401) |
| Registro no site | ⚠️ Cria conta com hash errado |

### **Depois (V.528):**
| Operação | Status |
|----------|--------|
| Login no jogo | ✅ Funciona |
| Login no site | ✅ **DEVE funcionar** (aguardando teste) |
| Registro no site | ✅ **Cria conta com hash correto** |

---

## 🧪 **VALIDAÇÃO**

### **Script de Teste Criado:**
```bash
# Caminho: /home/meumu.com/public_html/backend-nodejs/test-login-completo.js
# Função: Testa os 8 algoritmos e mostra qual funciona

cd /home/meumu.com/public_html/backend-nodejs
node test-login-completo.js
```

**O que o script faz:**
1. ✅ Conecta no banco `muonline`
2. ✅ Verifica se tabela `accounts` existe
3. ✅ Busca usuário `tiongas`
4. ✅ Mostra o hash do banco
5. ✅ **Testa os 8 algoritmos** (incluindo o novo SHA-256(username:password))
6. ✅ Mostra qual algoritmo funcionou

---

## 📋 **CHECKLIST DE TESTES**

### **A FAZER:**
- [ ] Executar `test-login-completo.js`
- [ ] Confirmar que algoritmo SHA-256(username:password) bate
- [ ] Testar login no site com `tiongas:123123`
- [ ] Testar login no site com `lorack:@lorack123@`
- [ ] Testar registro de nova conta
- [ ] Validar que nova conta consegue logar no jogo

---

## 🔍 **DESCOBERTA TÉCNICA**

### **Tabelas DV Teams (Season 19):**

**Arquivo de referência:** `codigo_de_comparacao.md` (linha 12311-12396)

```php
// ===== TABELA DE CONTAS =====
define('_TBL_MI_', 'accounts');
  define('_CLMN_USERNM_', 'account');       // Username
  define('_CLMN_PASSWD_', 'password');      // SHA-256(username:password)
  define('_CLMN_MEMBID_', 'guid');          // ID único
  define('_CLMN_EMAIL_', 'email');
  define('_CLMN_BLOCCODE_', 'blocked');

// ===== TABELA DE STATUS =====
define('_TBL_MS_', 'accounts_status');
  define('_CLMN_CONNSTAT_', 'online');      // 0=offline, 1=online
  define('_CLMN_MS_MEMBID_', 'account_id'); // FK para accounts.account

// ===== TABELA DE PERSONAGENS =====
define('_TBL_CHR_', 'character_info');
  define('_CLMN_CHR_NAME_', 'name');
  define('_CLMN_CHR_ACCID_', 'account_id'); // FK para accounts.account
  define('_CLMN_CHR_ONLINE_', 'online');    // 0=offline, 1=online
```

---

## 🎯 **ALGORITMOS SUPORTADOS (ATUALIZADO)**

| # | Algoritmo | Uso | Status |
|---|-----------|-----|--------|
| 1 | SHA-256(username:password) | **DV Teams / WebEngine CMS** | ✅ **NOVO!** |
| 2 | SHA-256(password) | Season 19 puro | ✅ OK |
| 3 | SHA-256(guid + password) | Season 19 com salt | ✅ OK |
| 4 | SHA-256(password + guid) | Season 19 com salt reverso | ✅ OK |
| 5 | SHA-256(MD5(password)) | Hash duplo | ✅ OK |
| 6 | SHA-256(MD5 + guid) | Hash duplo com salt | ✅ OK |
| 7 | SHA-256(guid + MD5) | Hash duplo com salt reverso | ✅ OK |
| 8 | SHA-256(MD5(username:password)) | Combinação | ✅ **NOVO!** |
| - | MD5 puro | Season 6 antigo | ✅ OK |
| - | Bcrypt | Sistemas modernos | ✅ OK |
| - | Plain text | MU muito antigo | ✅ OK (inseguro) |

---

## 📁 **ARQUIVOS MODIFICADOS**

### **1. `/backend-nodejs/src/utils/helpers.js`**
**Mudança:** Adicionados 2 novos algoritmos de teste (total: 8)  
**Linhas:** 41-152 (função `comparePassword`)

### **2. `/backend-nodejs/src/controllers/authController.js`**
**Mudança #1 (Login):** Passa `username` para `comparePassword()`  
**Linhas:** 70-78

**Mudança #2 (Registro):** Usa SHA-256(username:password) ao criar conta  
**Linhas:** 220-230

### **3. `/backend-nodejs/test-login-completo.js`**
**Mudança:** Arquivo criado (script de teste completo)  
**Linhas:** 1-485

### **4. `/install.sh`**
**Mudança:** Versão incrementada para 528  
**Linhas:** 7-8

### **5. `/MD Files/00-PROJETO/MEMORIA-PROJETO-MEUMU.md`**
**Mudança:** Atualizada seção "ALGORITMO DE HASH" (linha 61)

---

## 🚀 **PRÓXIMOS PASSOS**

1. ✅ **EXECUTAR TESTE:**
   ```bash
   cd /home/meumu.com/public_html/backend-nodejs
   node test-login-completo.js
   ```

2. ⏳ **VALIDAR RESULTADO:**
   - Se mostrar "✅ MATCH: SHA-256(username:password)" → **SUCESSO!**
   - Se falhar → investigar hash no banco

3. ⏳ **TESTAR LOGIN NO SITE:**
   - Frontend → Login com `tiongas:123123`
   - Deve retornar token JWT

4. ⏳ **TESTAR REGISTRO:**
   - Frontend → Criar nova conta
   - Tentar logar no jogo com a conta criada

---

## 📌 **IMPORTANTE**

### **Regra de Ouro Mantida:**
✅ **Site E Jogo usam o MESMO algoritmo** (SHA-256(username:password))  
✅ **Não há migração de hash** (compatibilidade total)  
✅ **Estrutura do banco não foi alterada** (apenas código)

### **Compatibilidade:**
✅ Season 19 DV Teams  
✅ WebEngine CMS  
⚠️ Season 6 (fallback ainda funciona, mas algoritmo diferente)

---

## 📝 **LOGS DE EXEMPLO ESPERADOS**

### **Teste Bem-Sucedido:**
```bash
🔐 Detectado hash SHA-256 (64 chars)
🧪 Testando múltiplos algoritmos...
  [1/8] SHA256(username:password): 0244872fafb64a34...
        Input: "tiongas:123123"
✅ MATCH: SHA-256(username:password) - DV Teams / WebEngine CMS

✅✅✅ SENHA VÁLIDA! LOGIN OK! ✅✅✅
```

### **Login no Site:**
```bash
🔐 Tentativa de login: tiongas
✅ Usuário encontrado: tiongas
✅ MATCH: SHA-256(username:password) - DV Teams / WebEngine CMS
✅ Senha correta para: tiongas
🔐 Mantendo hash SHA-256 (compatibilidade com servidor MU)
👤 Tipo de conta: USUÁRIO
✅ Login bem-sucedido: tiongas
```

---

## 🎉 **RESULTADO ESPERADO**

Após esta correção, o sistema de login deve funcionar **100% compatível** com:
- ✅ Servidor DV Teams Season 19
- ✅ WebEngine CMS
- ✅ Contas existentes no banco
- ✅ Novas contas criadas pelo site

---

**Versão:** 528  
**Data:** 2025-12-29 00:30 UTC  
**Status:** ⏳ AGUARDANDO TESTES

**Última atualização:** 2025-12-29 00:30 UTC
