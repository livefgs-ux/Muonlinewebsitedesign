/**
 * ADMIN ROUTES - MEUMU ONLINE
 * Rotas administrativas gerais (dashboard, estatísticas globais)
 * V573+ - Endpoints para AdminCP
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Todas as rotas requerem autenticação de admin
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/dashboard-stats', adminController.getDashboardStats);

// Personagens (visão global admin)
router.get('/all-characters', adminController.getAllCharacters);

// Online Accounts
router.get('/accounts/online', adminController.getOnlineAccounts);

// Latest Bans
router.get('/bans/latest', adminController.getLatestBans);

// Cache Management
router.get('/cache/stats', adminController.getCacheStats);
router.delete('/cache', adminController.clearCache);

// IP Blocking Management
router.get('/ip/list', adminController.listBlockedIPs);
router.post('/ip/block', adminController.blockIP);
router.post('/ip/unblock', adminController.unblockIP);

module.exports = router;