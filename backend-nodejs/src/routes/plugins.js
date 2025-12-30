/**
 * 🔌 Rotas de Plugins
 * V564 - Implementação completa
 */

const express = require('express');
const router = express.Router();
const { 
  getAllPlugins, 
  createPlugin, 
  updatePlugin, 
  togglePlugin, 
  deletePlugin,
  installPlugin
} = require('../controllers/pluginsController');
const { requireAdmin } = require('../middleware/auth');

// Todas as rotas protegidas - Admin apenas
router.get('/', requireAdmin, getAllPlugins);
router.post('/', requireAdmin, createPlugin);
router.post('/install', requireAdmin, installPlugin);
router.put('/:id', requireAdmin, updatePlugin);
router.put('/:id/toggle', requireAdmin, togglePlugin);
router.delete('/:id', requireAdmin, deletePlugin);

module.exports = router;