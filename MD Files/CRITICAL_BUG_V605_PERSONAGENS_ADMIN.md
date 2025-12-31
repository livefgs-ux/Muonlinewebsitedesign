# 🚨 BUG CRÍTICO - Personagens Errados Exibidos (V605)

**Data:** 2025-12-31 06:45 CET  
**Severidade:** 🔴 **CRÍTICA** (Segurança)  
**Status:** 🔍 **EM INVESTIGAÇÃO**

---

## 📋 DESCRIÇÃO DO PROBLEMA

### **CENÁRIO:**

1. ✅ Usuário fez **Ctrl+Shift+R** (hard refresh)
2. ❌ Botão **AdminCP sumiu** (mesmo continuando logado)
3. 🚨 **CRÍTICO:** Logou com conta `Lorack` mas está vendo personagens da conta `admin`

### **EVIDÊNCIAS (Screenshot):**

```
Dashboard mostra: "Bem-vindo, admin!"
Conta logada: Lorack
Personagens exibidos: Da conta admin
```

---

## 🔍 ANÁLISE TÉCNICA

### **PROBLEMA 1: Botão AdminCP Desapareceu**

#### **Comportamento Esperado:**
- Após Ctrl+Shift+R, usuário deveria **deslogar** completamente
- OU manter estado admin se ainda tiver token válido

#### **Comportamento Atual:**
- Ctrl+Shift+R limpa cache do navegador
- Botão AdminCP some
- Mas usuário continua logado (mostra "Bem-vindo, admin!")

#### **Causa Provável:**
```typescript
// /src/app/contexts/AuthContext.tsx linha 51-71
const checkAuth = async () => {
  const token = sessionStorage.getItem('auth_token');
  
  // ⚠️ PROBLEMA: Se não houver token, recupera dados do sessionStorage
  if (!token) {
    const cachedUserData = sessionStorage.getItem('user_data');
    if (cachedUserData) {
      // ❌ Restaura user SEM verificar validade
      setUser(parsedData);
    }
  }
}
```

**HIPÓTESE:**
- `sessionStorage.clear()` é chamado no Ctrl+Shift+R
- Mas `user_data` pode ter sobrevivido (race condition?)
- Ou `auth_token` foi limpo mas `user_data` ficou

---

### **PROBLEMA 2: Personagens Errados (CRÍTICO)**

#### **Comportamento Esperado:**
- Logou com `Lorack` → Ver APENAS personagens de `Lorack`

#### **Comportamento Atual:**
- Logou com `Lorack` → Vê personagens de `admin`

#### **Análise do Backend:**

```javascript
// /backend-nodejs/src/controllers/charactersController.js

const getAccountCharacters = async (req, res) => {
  // ✅ Pega accountId do JWT
  const { accountId } = req.user;
  console.log(`📊 Account ID (do JWT): ${accountId}`);
  
  // ✅ Busca GUID da conta
  const accountGuid = await getAccountGuid(accountId);
  console.log(`✅ GUID da conta encontrado: ${accountGuid}`);
  
  // ✅ Query usa WHERE account_id = ?
  const sql = `
    SELECT ... FROM ${tables.characterInfo}
    WHERE account_id = ?
  `;
  
  // ✅ Passa GUID correto
  const result = await executeQueryMU(sql, [accountGuid]);
}
```

**BACKEND PARECE CORRETO!**

#### **Possíveis Causas:**

1. **JWT com accountId errado:**
   - Token foi gerado com `accountId: "admin"` ao invés de `"Lorack"`
   - Improvável, pois mostra "Bem-vindo, admin!" (correto)

2. **getAccountGuid retorna GUID errado:**
   ```sql
   SELECT guid FROM accounts WHERE account = ?
   ```
   - Se `accountId` = "admin", retorna GUID correto de admin
   - Se `accountId` = "Lorack", deveria retornar GUID de Lorack
   - **PROBLEMA:** Se retornar GUID de admin, mostra chars errados!

3. **Database com GUIDs trocados:**
   - Tabela `accounts` tem GUID incorreto para "Lorack"
   - Improvável

4. **Cache do Frontend:**
   - Componente `CharacterManagement` pode estar usando dados em cache
   - Dados de requisição anterior (admin) ainda em memória

---

## 🔬 INVESTIGAÇÃO NECESSÁRIA

### **PASSO 1: Verificar Logs do Backend**

```bash
# Ao fazer GET /api/characters com Lorack logado, deve mostrar:
📊 Account ID (do JWT): Lorack
✅ GUID da conta encontrado: [GUID_DO_LORACK]
📊 Parâmetros: [[GUID_DO_LORACK]]
```

**VERIFICAR:**
- [ ] accountId está correto no JWT?
- [ ] GUID retornado é do Lorack ou do admin?
- [ ] Query está usando GUID correto?

### **PASSO 2: Verificar Database**

```sql
-- Verificar GUIDs das contas
SELECT account, guid FROM accounts WHERE account IN ('admin', 'Lorack');

-- Verificar personagens
SELECT name, account_id FROM character_info WHERE account_id IN (
  SELECT guid FROM accounts WHERE account IN ('admin', 'Lorack')
);
```

**VERIFICAR:**
- [ ] GUID de "Lorack" está correto?
- [ ] Personagens estão associados ao GUID correto?

### **PASSO 3: Verificar Frontend (Cache)**

```typescript
// /src/app/components/player/tabs/CharactersTab.tsx (ou similar)

// ⚠️ VERIFICAR se está fazendo cache incorreto:
const [characters, setCharacters] = useState([]);

useEffect(() => {
  fetchCharacters();
}, [user]); // ✅ DEVE refetch quando user muda

// ❌ SE NÃO tiver dependency, mantém dados anteriores!
```

**VERIFICAR:**
- [ ] Component re-fetcha ao mudar de conta?
- [ ] Estado de characters é limpo ao logout?
- [ ] Há cache no AuthContext?

---

## 🛠️ CORREÇÕES PROPOSTAS

### **CORREÇÃO 1: Botão AdminCP**

```typescript
// /src/app/contexts/AuthContext.tsx

const checkAuth = async () => {
  const token = sessionStorage.getItem('auth_token');
  
  if (!token) {
    // ✅ CORREÇÃO: Limpar tudo se não houver token
    sessionStorage.clear();
    setUser(null);
    setIsLoading(false);
    return;
  }
  
  // Continuar validação...
}
```

### **CORREÇÃO 2: Personagens Errados**

**Opção A: Adicionar mais logs no backend**

```javascript
// /backend-nodejs/src/controllers/charactersController.js

const getAccountGuid = async (accountUsername) => {
  console.log(`🔍 Buscando GUID para conta: "${accountUsername}"`);
  
  const sql = `SELECT guid FROM ${tables.accounts} WHERE account = ?`;
  const result = await executeQueryMU(sql, [accountUsername]);
  
  if (!result.success || result.data.length === 0) {
    console.error(`❌ Conta não encontrada: "${accountUsername}"`);
    return null;
  }
  
  const guid = result.data[0].guid;
  console.log(`✅ GUID encontrado para "${accountUsername}": ${guid}`);
  return guid;
};
```

**Opção B: Validar JWT no middleware**

```javascript
// /backend-nodejs/src/middleware/auth-middleware.js

// ✅ Adicionar log do accountId decodificado
console.log('🔐 JWT decodificado:', {
  accountId: decoded.accountId,
  isAdmin: decoded.isAdmin,
  iat: decoded.iat,
  exp: decoded.exp
});
```

**Opção C: Limpar cache do frontend ao trocar conta**

```typescript
// /src/app/contexts/AuthContext.tsx

const logout = async () => {
  // ✅ Limpar TUDO
  sessionStorage.clear();
  localStorage.clear();
  setUser(null);
  
  // ✅ Forçar reload
  window.location.reload();
};
```

---

## ⚠️ IMPACTO DE SEGURANÇA

### **SEVERIDADE: 🔴 CRÍTICA**

**Problema:** Usuários podem ver personagens de outras contas

**Riscos:**
- ❌ Vazamento de informações (level, stats, zen)
- ❌ Possível manipulação de personagens de outros (se endpoints de UPDATE não validarem)
- ❌ Violação de privacidade
- ❌ Perda de confiança dos jogadores

**Classificação OWASP:**
- **A01:2021 – Broken Access Control** ✅ SE CONFIRMAR

---

## 📝 PRÓXIMOS PASSOS

### **URGENTE (Fazer Agora):**

1. **[ ] Reproduzir o bug:**
   - Fazer login com Lorack
   - Ver personagens exibidos
   - Verificar logs do backend

2. **[ ] Verificar JWT:**
   ```bash
   # Copiar token do sessionStorage
   # Decodificar em jwt.io
   # Verificar accountId
   ```

3. **[ ] Verificar Database:**
   ```sql
   SELECT account, guid FROM accounts WHERE account IN ('admin', 'Lorack');
   SELECT name, account_id FROM character_info LIMIT 10;
   ```

4. **[ ] Adicionar logs extras:**
   - Em `getAccountGuid`
   - Em `auth-middleware.js`
   - No frontend ao chamar `/api/characters`

### **MÉDIO PRAZO:**

1. **[ ] Adicionar testes:**
   - Teste de isolamento de contas
   - Teste de validação JWT
   - Teste de cache do frontend

2. **[ ] Implementar rate limiting:**
   - Para prevenir enumeração de accounts

3. **[ ] Adicionar auditoria:**
   - Log de TODAS as queries com account_id
   - Alert se query retornar dados de conta diferente

---

## 🔗 ARQUIVOS RELEVANTES

```
Backend:
- /backend-nodejs/src/controllers/charactersController.js
- /backend-nodejs/src/middleware/auth-middleware.js
- /backend-nodejs/src/config/database.js

Frontend:
- /src/app/contexts/AuthContext.tsx
- /src/app/components/navigation.tsx
- /src/app/components/player/tabs/CharactersTab.tsx (?)
- /src/app/components/character-management.tsx

Database:
- accounts (memb_info)
- character_info
```

---

## 📊 STATUS

| Item | Status | Prioridade |
|------|--------|------------|
| **Reproduzir bug** | ⏳ Pendente | 🔴 Urgente |
| **Verificar JWT** | ⏳ Pendente | 🔴 Urgente |
| **Verificar DB** | ⏳ Pendente | 🔴 Urgente |
| **Adicionar logs** | ⏳ Pendente | 🟡 Alta |
| **Corrigir botão AdminCP** | ⏳ Pendente | 🟡 Alta |
| **Implementar testes** | ⏳ Pendente | 🟢 Média |

---

**🚨 BUG CRÍTICO - REQUER INVESTIGAÇÃO IMEDIATA**

**Criado:** 2025-12-31 06:45 CET  
**Versão:** V605  
**Severity:** CRITICAL  
**Type:** Security + UX Bug
