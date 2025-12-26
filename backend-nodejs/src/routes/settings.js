/**
 * 🎛️ Rotas de Configurações do Site
 */

const express = require('express');
const router = express.Router();
const { getAllSettings, updateSettings, getServerConfig } = require('../controllers/settingsController');
const { requireAdmin } = require('../middleware/auth');

// ✅ Rota pública - Obter configurações de servidor (rates, season)
router.get('/server-config', getServerConfig);

// 🔒 Rotas protegidas - Admin apenas
router.get('/all', requireAdmin, getAllSettings);
router.put('/update', requireAdmin, updateSettings);

module.exports = router;
