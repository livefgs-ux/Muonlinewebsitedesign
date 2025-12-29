/**
 * 🎛️ Rotas de Configurações do Site
 */

const express = require('express');
const router = express.Router();
const { 
  getAllSettings, 
  updateSettings, 
  getServerConfig,
  toggleMaintenance,
  updateSmtpSettings,
  getMaintenanceStatus
} = require('../controllers/settingsController');
const { requireAdmin } = require('../middleware/auth');

// ✅ Rotas públicas
router.get('/server-config', getServerConfig);
router.get('/maintenance', getMaintenanceStatus);

// 🔒 Rotas protegidas - Admin apenas
router.get('/all', requireAdmin, getAllSettings);
router.put('/update', requireAdmin, updateSettings);
router.post('/maintenance/toggle', requireAdmin, toggleMaintenance);
router.post('/smtp/update', requireAdmin, updateSmtpSettings);

module.exports = router;