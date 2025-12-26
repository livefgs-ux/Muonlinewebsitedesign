/**
 * Rotas de Autenticação
 * ATUALIZADO COM SEGURANÇA AVANÇADA
 */

const express = require('express');
const router = express.Router();
const { 
  login, 
  register, 
  verifyTokenRoute,
  getAccountInfo
} = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../utils/validators');
const { verifyToken } = require('../middleware/auth-middleware');

// Importar middlewares de segurança
const {
  loginRateLimiter,
  registerRateLimiter,
  validateEmailMiddleware,
  validatePasswordStrength,  // ✅ ATIVADO!
  xssMiddleware
} = require('../middleware/security');

// Aplicar sanitização XSS em todas as rotas
router.use(xssMiddleware);

// POST /api/auth/login - Login
// Rate limit: 5 tentativas por 15 minutos
router.post('/login', 
  loginRateLimiter,
  validateLogin, 
  login
);

// POST /api/auth/register - Registro
// Rate limit: 3 registros por hora
// Validações: Email temporário + Senha forte (COMPLEXIDADE + ANTI-SEQUÊNCIAS)
router.post('/register', 
  registerRateLimiter,
  validateEmailMiddleware,
  validatePasswordStrength,  // ✅ ATIVADO! (Maiúscula, Minúscula, Número, Especial, Anti-Sequência)
  validateRegister, 
  register
);

// POST /api/auth/verify - Verificar token
router.post('/verify', verifyToken, verifyTokenRoute);

// GET /api/auth/account - Informações da conta (requer autenticação)
router.get('/account', verifyToken, getAccountInfo);

module.exports = router;