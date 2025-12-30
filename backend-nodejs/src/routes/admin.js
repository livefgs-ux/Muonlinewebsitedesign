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

module.exports = router;
