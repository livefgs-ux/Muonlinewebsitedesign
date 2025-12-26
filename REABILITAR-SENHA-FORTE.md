# 🔒 REABILITAR SENHA FORTE

## ⚠️ APÓS OS TESTES, EXECUTE:

```bash
nano /home/meumu.com/public_html/backend-nodejs/src/routes/auth.js
```

### **Linha 18-20 - DESCOMENTAR:**

**ANTES (Testes):**
```javascript
const {
  loginRateLimiter,
  registerRateLimiter,
  validateEmailMiddleware,
  // validatePasswordStrength,  // ⚠️ DESABILITADO PARA TESTES
  xssMiddleware
} = require('../middleware/security');
```

**DEPOIS (Produção):**
```javascript
const {
  loginRateLimiter,
  registerRateLimiter,
  validateEmailMiddleware,
  validatePasswordStrength,  // ✅ REABILITADO
  xssMiddleware
} = require('../middleware/security');
```

---

### **Linha 39 - DESCOMENTAR:**

**ANTES (Testes):**
```javascript
router.post('/register', 
  registerRateLimiter,
  validateEmailMiddleware,
  // validatePasswordStrength,  // ⚠️ DESABILITADO
  validateRegister, 
  register
);
```

**DEPOIS (Produção):**
```javascript
router.post('/register', 
  registerRateLimiter,
  validateEmailMiddleware,
  validatePasswordStrength,  // ✅ REABILITADO
  validateRegister, 
  register
);
```

---

### **REINICIAR:**
```bash
pm2 restart meumu-backend
```

---

## 📋 **REQUISITOS DE SENHA FORTE**

Ao reabilitar, senhas precisarão de:

- ✅ Mínimo 8 caracteres
- ✅ 1 letra maiúscula
- ✅ 1 letra minúscula  
- ✅ 1 número
- ✅ 1 caractere especial (@$!%*?&#)

**Exemplo válido:** `Senha123!`

---

**Data:** 26/12/2024  
**Status:** Desabilitado para testes
