/**
 * ACCOUNTS ROUTES - MEUMU ONLINE
 * Rotas de gerenciamento de contas (AdminCP)
 */

const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Todas as rotas requerem autenticação de admin
router.use(authenticate, requireAdmin);

// Buscar conta
router.get('/search', accountsController.searchAccount);

// Detalhes da conta
router.get('/:username', accountsController.getAccountDetails);

// Contas do mesmo IP
router.get('/from-ip', accountsController.getAccountsFromIP);

// Contas online
router.get('/online', accountsController.getOnlineAccounts);

// Novos registros
router.get('/new-registrations', accountsController.getNewRegistrations);

// Atualizar email
router.put('/:username/email', accountsController.updateAccountEmail);

// Resetar senha
router.put('/:username/password', accountsController.resetAccountPassword);

// Adicionar/remover cash
router.put('/:username/cash', accountsController.updateAccountCash);

// Estatísticas
router.get('/stats', accountsController.getAccountStats);

module.exports = router;
