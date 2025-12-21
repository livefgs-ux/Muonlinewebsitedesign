# 🔧 Fix Backend Startup Error - Middleware Names

**Data:** 21 de Dezembro de 2024  
**Problema:** Backend não iniciava com erro `Route.get() requires a callback function but got a [object Undefined]`

---

## ❌ Problema Original

### Erro no Console

```
Error: Route.get() requires a callback function but got a [object Undefined]
    at Route.<computed> [as get] (/backend-nodejs/node_modules/express/lib/router/route.js:216:15)
    at Object.<anonymous> (/backend-nodejs/src/routes/wcoin.js:16:8)
```

### Causa Raiz

Inconsistência nos nomes dos middlewares exportados e importados:

**Middleware exporta:**
```javascript
// /backend-nodejs/src/middleware/auth-middleware.js
module.exports = {
  verifyToken,      // ✅ Nome correto
  verifyAdmin,      // ✅ Nome correto
  verifyTokenOptional
};
```

**Rotas importavam nomes incorretos:**
```javascript
// ❌ ERRADO
const { authenticateToken, isAdmin } = require('../middleware/auth-middleware');
const { authenticateToken, requireAdmin } = require('../middleware/auth-middleware');

// Resultado: authenticateToken = undefined, isAdmin = undefined
```

---

## ✅ Solução Implementada

### Arquivos Corrigidos

#### 1. `/backend-nodejs/src/routes/wcoin.js`

```javascript
// ❌ ANTES
const { authenticateToken, isAdmin } = require('../middleware/auth-middleware');

router.get('/admin/packages', authenticateToken, isAdmin, wcoinController.getAllPackagesAdmin);

// ✅ DEPOIS
const { verifyToken, verifyAdmin } = require('../middleware/auth-middleware');

router.get('/admin/packages', verifyToken, verifyAdmin, wcoinController.getAllPackagesAdmin);
```

**Mudanças:**
- `authenticateToken` → `verifyToken`
- `isAdmin` → `verifyAdmin`

---

#### 2. `/backend-nodejs/src/routes/events.js`

```javascript
// ❌ ANTES
const { authenticateToken, requireAdmin } = require('../middleware/auth-middleware');

router.get('/admin/all', authenticateToken, requireAdmin, eventsController.getAllEventsAdmin);

// ✅ DEPOIS
const { verifyToken, verifyAdmin } = require('../middleware/auth-middleware');

router.get('/admin/all', verifyToken, verifyAdmin, eventsController.getAllEventsAdmin);
```

**Mudanças:**
- `authenticateToken` → `verifyToken`
- `requireAdmin` → `verifyAdmin`
- Todas as 6 rotas admin foram atualizadas

---

### Arquivos Já Corretos (Não Precisaram Mudanças)

| Arquivo | Status | Middleware Usado |
|---------|--------|------------------|
| `/backend-nodejs/src/routes/auth.js` | ✅ OK | `verifyToken` |
| `/backend-nodejs/src/routes/characters.js` | ✅ OK | `verifyToken` |
| `/backend-nodejs/src/routes/news.js` | ✅ OK | `verifyToken, verifyAdmin` |
| `/backend-nodejs/src/routes/rankings.js` | ✅ OK | Sem auth |
| `/backend-nodejs/src/routes/server.js` | ✅ OK | Sem auth |
| `/backend-nodejs/src/routes/adminLogs.js` | ✅ OK | Sem auth (interno) |
| `/backend-nodejs/src/routes/sandbox.js` | ✅ OK | Sem auth (sandbox) |

---

## 🔍 Como Identificar o Erro

### Sintomas

1. **Erro no startup:**
   ```
   Error: Route.get() requires a callback function but got a [object Undefined]
   ```

2. **Stack trace aponta para:**
   ```
   at Object.<anonymous> (/backend-nodejs/src/routes/ARQUIVO.js:LINHA:8)
   ```

3. **Callback undefined:** A função de middleware ou controller está `undefined`

### Diagnóstico

```javascript
// Se você vê este erro, verifique:

// 1. O middleware existe?
console.log(verifyToken);  // undefined? ❌ Nome errado!

// 2. Está sendo exportado?
// Em auth-middleware.js:
module.exports = {
  verifyToken,  // ✅ Deve estar aqui
  // ...
};

// 3. Nome correto na importação?
const { verifyToken } = require('../middleware/auth-middleware');  // ✅
const { authenticateToken } = require('../middleware/auth-middleware');  // ❌
```

---

## 🛡️ Prevenção Futura

### 1. Usar Constantes para Nomes

```javascript
// middleware/auth-middleware.js
const MIDDLEWARE_NAMES = {
  VERIFY_TOKEN: 'verifyToken',
  VERIFY_ADMIN: 'verifyAdmin',
  VERIFY_TOKEN_OPTIONAL: 'verifyTokenOptional'
};

// Exportar tanto as funções quanto os nomes
module.exports = {
  verifyToken,
  verifyAdmin,
  verifyTokenOptional,
  MIDDLEWARE_NAMES  // Para referência
};
```

### 2. Adicionar Testes Unitários

```javascript
// tests/middleware.test.js
const middleware = require('../src/middleware/auth-middleware');

describe('Auth Middleware', () => {
  test('should export verifyToken', () => {
    expect(middleware.verifyToken).toBeDefined();
    expect(typeof middleware.verifyToken).toBe('function');
  });

  test('should export verifyAdmin', () => {
    expect(middleware.verifyAdmin).toBeDefined();
    expect(typeof middleware.verifyAdmin).toBe('function');
  });
});
```

### 3. Validação no Startup

```javascript
// server.js
const validateMiddleware = () => {
  const { verifyToken, verifyAdmin } = require('./middleware/auth-middleware');
  
  if (!verifyToken || !verifyAdmin) {
    throw new Error('❌ Middleware de autenticação não está configurado corretamente!');
  }
  
  console.log('✅ Middleware validado com sucesso');
};

validateMiddleware();
```

---

## 📊 Impacto da Correção

### Antes

```
❌ Backend não inicia
❌ Erro ao carregar rotas
❌ Aplicação inacessível
```

### Depois

```
✅ Backend inicia corretamente
✅ Todas as rotas carregadas
✅ Autenticação funcionando
✅ Aplicação acessível
```

---

## 🧪 Testes de Validação

### 1. Testar Startup

```bash
cd backend-nodejs
npm start

# Esperado:
# ✅ Servidor rodando na porta 3001
# ✅ Conexão com banco estabelecida
# ✅ Todas as rotas registradas
```

### 2. Testar Rotas Protegidas

```bash
# Sem token (deve retornar 401)
curl http://localhost:3001/api/wcoin/admin/packages

# Resposta esperada:
# {
#   "success": false,
#   "error": "Token não fornecido"
# }

# Com token válido (deve retornar 200 ou dados)
curl -H "Authorization: Bearer TOKEN_AQUI" \
     http://localhost:3001/api/wcoin/admin/packages
```

### 3. Testar Rotas Públicas

```bash
# Deve funcionar sem token
curl http://localhost:3001/api/wcoin/packages

# Resposta esperada:
# {
#   "success": true,
#   "data": [...]
# }
```

---

## 🎯 Checklist de Middleware

Use este checklist ao criar novas rotas:

- [ ] Importar middleware com nomes corretos:
  ```javascript
  const { verifyToken, verifyAdmin } = require('../middleware/auth-middleware');
  ```

- [ ] Aplicar na ordem correta:
  ```javascript
  router.get('/admin/rota', verifyToken, verifyAdmin, controller.funcao);
  //                         ↑ Primeiro   ↑ Segundo   ↑ Último
  ```

- [ ] Verificar que controller exporta a função:
  ```javascript
  module.exports = {
    funcao,  // ✅ Deve estar aqui
    // ...
  };
  ```

- [ ] Testar a rota:
  ```bash
  curl -X GET http://localhost:3001/api/sua-rota
  ```

---

## 📚 Referência de Middlewares

### Disponíveis em `auth-middleware.js`

| Nome | Tipo | Uso |
|------|------|-----|
| `verifyToken` | Function | Validar JWT obrigatório |
| `verifyAdmin` | Function | Validar se é admin (usar APÓS verifyToken) |
| `verifyTokenOptional` | Function | JWT opcional (não retorna erro) |

### Exemplo de Uso

```javascript
// Rota pública (sem middleware)
router.get('/public', controller.publicRoute);

// Rota autenticada (qualquer usuário logado)
router.get('/protected', verifyToken, controller.protectedRoute);

// Rota admin (apenas admins)
router.get('/admin', verifyToken, verifyAdmin, controller.adminRoute);

// Rota com auth opcional
router.get('/optional', verifyTokenOptional, controller.optionalAuthRoute);
```

---

## 🔄 Ordem de Execução dos Middlewares

```
Request → verifyToken → verifyAdmin → Controller → Response
          ↓ (valida JWT)  ↓ (valida isAdmin)  ↓ (lógica)
          
Se JWT inválido: ❌ 401 Unauthorized
Se não é admin:  ❌ 403 Forbidden  
Se tudo OK:      ✅ 200 OK + dados
```

---

## ✅ Status Final

### Arquivos Modificados (2)

- ✅ `/backend-nodejs/src/routes/wcoin.js`
- ✅ `/backend-nodejs/src/routes/events.js`

### Linhas Alteradas

- ~10 linhas total (imports + rotas)

### Tempo de Correção

- ~10 minutos

### Complexidade

- Baixa (apenas renomear imports)

---

## 🚀 Deploy

Depois da correção:

```bash
# 1. No servidor
cd /home/meumu.com/public_html/backend-nodejs

# 2. Reiniciar backend
pm2 restart meumu-api
# ou
npm start

# 3. Verificar logs
pm2 logs meumu-api

# 4. Testar endpoint
curl http://localhost:3001/api/wcoin/packages
```

---

## 📝 Lições Aprendidas

### 1. Consistência nos Nomes é Crucial

```javascript
// ❌ Nomes diferentes causam confusão
module.exports = { authenticateToken };
const { verifyToken } = require('...');  // undefined!

// ✅ Use o mesmo nome sempre
module.exports = { verifyToken };
const { verifyToken } = require('...');  // funciona!
```

### 2. Validar Imports no Startup

```javascript
// Adicione no início do server.js
const middleware = require('./middleware/auth-middleware');
console.log('Middleware disponíveis:', Object.keys(middleware));
// Output: ['verifyToken', 'verifyAdmin', 'verifyTokenOptional']
```

### 3. Erro de Undefined Pode Ser Silencioso

```javascript
const { naoExiste } = require('./middleware');
// Não dá erro aqui! ⚠️

router.get('/rota', naoExiste, controller.func);
// Só dá erro aqui quando Express tenta usar! ❌
```

---

**Correção aplicada e testada! Backend iniciando normalmente. 🎉**
