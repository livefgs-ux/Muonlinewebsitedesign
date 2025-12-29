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

// GET /api/auth/verify - Verificar token (compatibilidade frontend)
// V.530 - Adicionado suporte para GET além de POST
router.get('/verify', verifyToken, verifyTokenRoute);

// GET /api/auth/account - Informações da conta (requer autenticação)
router.get('/account', verifyToken, getAccountInfo);

// POST /api/auth/update-email - Atualizar email (requer autenticação)
router.post('/update-email', verifyToken, validateEmailMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const accountId = req.account.memb___id;
    const { executeQueryMU } = require('../config/database');
    const { successResponse, errorResponse } = require('../utils/helpers');
    
    // Validar email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse(res, 'Email inválido', 400);
    }
    
    // Atualizar no banco
    const sql = `UPDATE MEMB_INFO SET mail_addr = ? WHERE memb___id = ?`;
    const result = await executeQueryMU(sql, [email, accountId]);
    
    if (result.success) {
      return successResponse(res, {
        message: 'Email atualizado com sucesso'
      });
    } else {
      throw new Error('Falha ao atualizar email');
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar email:', error);
    const { errorResponse } = require('../utils/helpers');
    return errorResponse(res, 'Erro ao atualizar email', 500);
  }
});

// POST /api/auth/update-password - Atualizar senha (requer autenticação)
router.post('/update-password', verifyToken, validatePasswordStrength, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const accountId = req.account.memb___id;
    const { executeQueryMU } = require('../config/database');
    const { successResponse, errorResponse } = require('../utils/helpers');
    
    // Validar senhas
    if (!oldPassword || !newPassword) {
      return errorResponse(res, 'Senhas obrigatórias', 400);
    }
    
    // Buscar senha atual
    const checkSql = `SELECT memb__pwd FROM MEMB_INFO WHERE memb___id = ?`;
    const checkResult = await executeQueryMU(checkSql, [accountId]);
    
    if (!checkResult.success || !checkResult.data[0]) {
      return errorResponse(res, 'Conta não encontrada', 404);
    }
    
    // Verificar senha antiga
    const currentPassword = checkResult.data[0].memb__pwd;
    if (currentPassword !== oldPassword) {
      return errorResponse(res, 'Senha atual incorreta', 401);
    }
    
    // Atualizar senha
    const updateSql = `UPDATE MEMB_INFO SET memb__pwd = ? WHERE memb___id = ?`;
    const updateResult = await executeQueryMU(updateSql, [newPassword, accountId]);
    
    if (updateResult.success) {
      return successResponse(res, {
        message: 'Senha atualizada com sucesso'
      });
    } else {
      throw new Error('Falha ao atualizar senha');
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error);
    const { errorResponse } = require('../utils/helpers');
    return errorResponse(res, 'Erro ao atualizar senha', 500);
  }
});

module.exports = router;