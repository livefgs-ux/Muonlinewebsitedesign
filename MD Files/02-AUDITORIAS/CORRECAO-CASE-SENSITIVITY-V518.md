# 🔧 CORREÇÃO: CASE SENSITIVITY - executeQueryWeb vs executeQueryWEB - V518

**Data**: 28 de Dezembro de 2024  
**Tipo**: Bug Fix Crítico - Case Mismatch  
**Status**: ✅ Corrigido  
**Impacto**: CRÍTICO - Erro 500 em `/api/server/info`

---

## 🔴 PROBLEMA DETECTADO

### **Erro no Backend**

```
TypeError: executeQueryWeb is not a function
    at getServerInfo (serverController.js:25:26)
GET /api/server/info 500 0.462 ms
```

### **Sintomas**

- ✅ Backend inicia normalmente (sem crash)
- ✅ Porta 3001 aberta
- ✅ MySQL conectado
- ❌ `/api/server/info` → **500 Error**
- ✅ `/api/server/stats` → **200 OK**
- ⚠️ `/api/server/status` → **404** (endpoint não existe)

---

## 🔍 DIAGNÓSTICO

### **Causa Raiz: JavaScript Case Sensitivity**

```javascript
// ❌ Controllers IMPORTAM (camelCase):
const { executeQueryWeb } = require('../config/database');
//       ^^^^^^^^^^^^^^^^ "Web" com "W" maiúsculo e resto minúsculo

// ✅ database.js EXPORTA (all caps):
module.exports = {
  executeQueryWEB  // ← "WEB" todo maiúsculo!
};

// 🚨 RESULTADO:
executeQueryWeb === undefined  // ← Não encontra a função!
```

### **Por que o Erro é Confuso?**

1. **Outros endpoints funcionam**:
   - `executeQueryMU` ✅ (correto)
   - `testConnection` ✅ (correto)

2. **Apenas `executeQueryWeb` quebra**:
   - Importado com "W" maiúsculo + "eb" minúsculo
   - Mas exportado com "WEB" todo maiúsculo

3. **JavaScript é case-sensitive**:
   - `executeQueryWeb` ≠ `executeQueryWEB`
   - Sem erro de sintaxe (apenas runtime error)

---

## ✅ CORREÇÃO APLICADA

### **Arquivos Corrigidos**

#### **1. `/backend-nodejs/src/controllers/serverController.js`**

```javascript
// ❌ ANTES
const { executeQueryMU, executeQueryWeb, testConnection } = require('../config/database');

// Linha 25:
const result = await executeQueryWeb(sql);  // ← TypeError!

// Linha 129:
const settingsResult = await executeQueryWeb(settingsSql);  // ← TypeError!
```

```javascript
// ✅ DEPOIS
const { executeQueryMU, executeQueryWEB, testConnection } = require('../config/database');

// Linha 25:
const result = await executeQueryWEB(sql);  // ✅ Funciona!

// Linha 129:
const settingsResult = await executeQueryWEB(settingsSql);  // ✅ Funciona!
```

---

#### **2. `/backend-nodejs/src/controllers/settingsController.js`**

```javascript
// ❌ ANTES
const { executeQueryWeb, executeQueryMU } = require('../config/database');

// Múltiplas chamadas:
await executeQueryWeb(sql);  // ← TypeError!
```

```javascript
// ✅ DEPOIS
const { executeQueryWEB, executeQueryMU } = require('../config/database');

// Múltiplas chamadas:
await executeQueryWEB(sql);  // ✅ Funciona!
```

---

## 📊 ANTES vs DEPOIS

### **ANTES (V517 - Erro 500)**

```
Request:  GET /api/server/info
Flow:     → serverController.getServerInfo()
          → executeQueryWeb(sql)
          → undefined is not a function ❌
Response: 500 Internal Server Error
Frontend: Erro ao carregar informações
```

### **DEPOIS (V518 - Funcionando)**

```
Request:  GET /api/server/info
Flow:     → serverController.getServerInfo()
          → executeQueryWEB(sql)
          → SELECT * FROM site_settings ✅
Response: 200 OK
Frontend: Informações carregadas ✅
```

---

## 🎯 IMPACTO DA CORREÇÃO

### **Endpoints Afetados**

| Endpoint | Antes | Depois | Motivo |
|----------|-------|--------|--------|
| `/api/server/info` | ❌ 500 | ✅ 200 | `executeQueryWeb` corrigido |
| `/api/server/stats` | ✅ 200 | ✅ 200 | Não afetado (usa `executeQueryMU`) |
| `/api/settings/all` | ❌ 500 | ✅ 200 | `executeQueryWeb` corrigido |
| `/api/settings/update` | ❌ 500 | ✅ 200 | `executeQueryWeb` corrigido |
| `/api/settings/server-config` | ❌ 500 | ✅ 200 | `executeQueryWeb` corrigido |

### **Funcionalidades Restauradas**

✅ **Frontend carrega informações do servidor**  
✅ **AdminCP pode editar configurações**  
✅ **Site exibe rates, season, limites**  
✅ **Sem mais erro 500 em rotas principais**

---

## 📁 ESTRUTURA DE EXPORTS (Referência)

### **`/backend-nodejs/src/config/database.js` (Correto)**

```javascript
module.exports = {
  // Pools
  pool: poolMU,
  poolMU,
  poolWEB,
  
  // Testes
  testConnection,
  
  // ✅ Queries (CORRETO - TUDO MAIÚSCULO)
  executeQuery,       // Compatibilidade (usa MU)
  executeQueryMU,     // ✅ MU maiúsculo
  executeQueryWEB,    // ✅ WEB maiúsculo (NÃO "Web"!)
  
  // Transações
  executeTransaction,
  executeTransactionMU,
  executeTransactionWEB,  // ✅ WEB maiúsculo
  
  // Utilitários
  closePool
};
```

---

## 🔧 COMO APLICAR A CORREÇÃO

### **Opção 1: Atualizar do GitHub** (Recomendado)

```bash
cd /home/meumu.com/public_html
git pull origin main
./install.sh
# Opção 5 (Reiniciar Servidor)
```

### **Opção 2: Patch Manual**

```bash
# 1. Editar serverController.js
nano backend-nodejs/src/controllers/serverController.js

# Substituir TODAS as ocorrências:
# executeQueryWeb → executeQueryWEB

# 2. Editar settingsController.js
nano backend-nodejs/src/controllers/settingsController.js

# Substituir TODAS as ocorrências:
# executeQueryWeb → executeQueryWEB

# 3. Reiniciar backend
./install.sh
# Opção 5
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

### **1. Verificar Correção Aplicada**

```bash
# Testar imports:
grep "executeQueryWEB" backend-nodejs/src/controllers/serverController.js
grep "executeQueryWEB" backend-nodejs/src/controllers/settingsController.js

# ✅ Deve mostrar linhas com "WEB" maiúsculo
```

### **2. Testar Backend**

```bash
# Reiniciar servidor:
cd backend-nodejs
pkill -f node
npm start

# ✅ Deve iniciar sem erros
```

### **3. Testar Endpoints**

```bash
# Endpoint que estava quebrado:
curl http://localhost:3001/api/server/info

# ✅ Deve retornar JSON:
# {
#   "success": true,
#   "data": {
#     "name": "MeuMU Online",
#     "version": "Season 19-2-3",
#     ...
#   }
# }
```

---

## 🐛 TROUBLESHOOTING

### **Erro: "executeQueryWeb is not a function" persiste**

```bash
# Solução 1: Verificar se correção foi aplicada
cat backend-nodejs/src/controllers/serverController.js | grep "executeQuery"

# ❌ Se mostrar "executeQueryWeb" (camelCase):
# Correção não aplicada! Edite manualmente.

# ✅ Se mostrar "executeQueryWEB" (all caps):
# Correção OK, mas pode ter arquivo cache.
```

---

### **Erro: "Cannot find module"**

```bash
# Solução: Reinstalar dependências
cd backend-nodejs
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📖 LIÇÕES APRENDIDAS

### **1. JavaScript Case Sensitivity**

```javascript
// JavaScript diferencia maiúsculas/minúsculas:
const foo = "bar";
const Foo = "baz";
const FOO = "qux";

console.log(foo !== Foo);  // true
console.log(Foo !== FOO);  // true
```

### **2. Naming Conventions Importantes**

```javascript
// ✅ BOM: Convenção consistente
executeQueryMU    // MU sempre maiúsculo
executeQueryWEB   // WEB sempre maiúsculo

// ❌ RUIM: Mistura de estilos
executeQueryWeb   // "W" maiúsculo, "eb" minúsculo
executeQueryMu    // "M" maiúsculo, "u" minúsculo
```

### **3. IDE Autocomplete Pode Enganar**

```
Cenário:
- IDE sugere "executeQueryWeb" (camelCase)
- Mas código exporta "executeQueryWEB" (all caps)
- Autocomplete aceita, mas runtime quebra!

Solução:
- Sempre verificar exports reais
- Testes unitários detectariam isso
```

---

## 📚 DOCUMENTAÇÃO ATUALIZADA

### **Arquivos Afetados**
- `/backend-nodejs/src/controllers/serverController.js` ✅ Corrigido
- `/backend-nodejs/src/controllers/settingsController.js` ✅ Corrigido
- `/install.sh` (v518) ✅ Version bump
- `/MD Files/02-AUDITORIAS/CORRECAO-CASE-SENSITIVITY-V518.md` (Este arquivo)

### **Convention Estabelecida**

```javascript
// ✅ PADRÃO OFICIAL (Documentado):
executeQueryMU    // Sempre "MU" maiúsculo
executeQueryWEB   // Sempre "WEB" maiúsculo

// ❌ NUNCA USAR:
executeQueryMu    // "u" minúsculo
executeQueryWeb   // "eb" minúsculo
executeQueryweb   // Tudo minúsculo
```

---

## ⚡ COMPATIBILIDADE

### **Testado Em**
- ✅ Rocky Linux 9.x
- ✅ CyberPanel 2.3.x
- ✅ Node.js 18+
- ✅ MariaDB 10.x

### **Não Quebra Compatibilidade**
- ✅ Código existente que usa `executeQueryMU`
- ✅ Transações (`executeTransactionWEB`)
- ✅ Pools (`poolMU`, `poolWEB`)

---

## 🧠 CONCLUSÃO

Este erro é **100% naming convention**:
- ✅ NÃO é problema de database
- ✅ NÃO é problema de conexão
- ✅ NÃO é problema de firewall
- ✅ NÃO é problema de middleware

É **case sensitivity** clássico em JavaScript.

**Solução**: Normalizar todos os imports para `executeQueryWEB` (all caps).

---

**Versão do Install**: 518  
**Status**: ✅ Corrigido e documentado  
**Próxima Versão**: 519 (Auditoria de Segurança)

**FIM DO DOCUMENTO**
