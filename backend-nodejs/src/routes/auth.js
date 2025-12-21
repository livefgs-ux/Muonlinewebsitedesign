/**
 * Rotas de Autenticação
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

// POST /api/auth/login - Login
router.post('/login', validateLogin, login);

// POST /api/auth/register - Registro
router.post('/register', validateRegister, register);

// POST /api/auth/verify - Verificar token
router.post('/verify', verifyToken, verifyTokenRoute);

// GET /api/auth/account - Informações da conta (requer autenticação)
router.get('/account', verifyToken, getAccountInfo);

module.exports = router;
