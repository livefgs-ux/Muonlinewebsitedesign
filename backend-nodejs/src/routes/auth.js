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
  getAccountInfo,
  logout  // ✅ ADICIONADO
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

// PUT /api/auth/update-password - Atualizar senha (requer autenticação)
router.put('/update-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { accountId } = req.user; // ← AccountId vem do JWT (middleware verifyToken)
    const bcrypt = require('bcrypt');
    const { executeQueryMU } = require('../config/database');
    const { successResponse, errorResponse } = require('../utils/helpers');
    const { tables } = require('../config/auth');
    
    console.log(`\n🔐 ========================================`);
    console.log(`🔐 UPDATE PASSWORD REQUEST`);
    console.log(`🔐 ========================================`);
    console.log(`🔐 Account: ${accountId}`);
    
    // Validar campos
    if (!currentPassword || !newPassword) {
      console.log(`❌ ERRO: Campos obrigatórios vazios`);
      return errorResponse(res, 'Senha atual e nova senha são obrigatórias', 400);
    }
    
    // Validar tamanho da nova senha
    if (newPassword.length < 6 || newPassword.length > 20) {
      console.log(`❌ ERRO: Tamanho inválido (${newPassword.length})`);
      return errorResponse(res, 'Nova senha deve ter entre 6 e 20 caracteres', 400);
    }
    
    // ========================================================================
    // SEASON 19: Buscar senha atual (campo 'password')
    // ========================================================================
    
    const checkSql = `SELECT password FROM ${tables.accounts} WHERE account = ?`;
    const checkResult = await executeQueryMU(checkSql, [accountId]);
    
    if (!checkResult.success || checkResult.data.length === 0) {
      console.error(`❌ Conta não encontrada: ${accountId}`);
      return errorResponse(res, 'Conta não encontrada', 404);
    }
    
    const account = checkResult.data[0];
    console.log(`✅ Conta encontrada`);
    
    // ========================================================================
    // VERIFICAR SENHA ATUAL
    // ========================================================================
    
    // A senha no banco está hasheada com bcrypt
    const isPasswordValid = await bcrypt.compare(currentPassword, account.password);
    
    if (!isPasswordValid) {
      console.log(`❌ Senha atual incorreta`);
      return errorResponse(res, 'Senha atual incorreta', 401);
    }
    
    console.log(`✅ Senha atual verificada`);
    
    // ========================================================================
    // HASHEAR NOVA SENHA
    // ========================================================================
    
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log(`✅ Nova senha hasheada`);
    
    // ========================================================================
    // ATUALIZAR NO BANCO
    // ========================================================================
    
    const updateSql = `UPDATE ${tables.accounts} SET password = ? WHERE account = ?`;
    const updateResult = await executeQueryMU(updateSql, [hashedNewPassword, accountId]);
    
    if (!updateResult.success) {
      console.error(`❌ Erro SQL ao atualizar senha:`, updateResult.error);
      return errorResponse(res, 'Erro ao atualizar senha', 500);
    }
    
    console.log(`✅ Senha atualizada com sucesso!`);
    console.log(`✅ ========================================\n`);
    
    return successResponse(res, { message: 'Senha atualizada com sucesso' });
    
  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ EXCEPTION AO ATUALIZAR SENHA');
    console.error('❌ ========================================');
    console.error('❌ Erro:', error);
    console.error('❌ Stack:', error.stack);
    console.error('❌ ========================================\n');
    const { errorResponse } = require('../utils/helpers');
    return errorResponse(res, 'Erro ao processar atualização', 500);
  }
});

// POST /api/auth/logout - Logout
router.post('/logout', verifyToken, logout);

module.exports = router;