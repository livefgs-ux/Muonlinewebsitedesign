/**
 * BANS ROUTES - MEUMU ONLINE
 * Rotas de gerenciamento de bans (AdminCP)
 */

const express = require('express');
const router = express.Router();
const bansController = require('../controllers/bansController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Todas as rotas requerem autenticação de admin
router.use(authenticate, requireAdmin);

// Buscar bans
router.get('/search', bansController.searchBans);

// Últimos bans
router.get('/latest', bansController.getLatestBans);

// Criar banimento (alias)
router.post('/create', bansController.createBan);

// Banir conta
router.post('/ban', bansController.banAccount);

// Desbanir conta
router.post('/unban', bansController.unbanAccount);

// IPs bloqueados
router.get('/blocked-ips', bansController.getBlockedIPs);

// Bloquear IP
router.post('/block-ip', bansController.blockIP);

// Desbloquear IP
router.delete('/block-ip/:ip', bansController.unblockIP);

// Estatísticas
router.get('/stats', bansController.getBanStats);

module.exports = router;