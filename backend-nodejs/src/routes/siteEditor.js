/**
 * 🎨 Rotas do Site Editor
 * V563 - Implementação completa
 */

const express = require('express');
const router = express.Router();
const { 
  getConfig, 
  updateHomeBanner, 
  updateSocialLinks, 
  bulkUpdateConfig,
  updateBackground,
  getBackground
} = require('../controllers/siteEditorController');
const { requireAdmin } = require('../middleware/auth');

// ✅ Rota pública - Obter background atual
router.get('/background', getBackground);

// 🔒 Rotas protegidas - Admin apenas
router.get('/config', requireAdmin, getConfig);
router.post('/home-banner', requireAdmin, updateHomeBanner);
router.post('/social-links', requireAdmin, updateSocialLinks);
router.post('/config/bulk-update', requireAdmin, bulkUpdateConfig);
router.post('/background', requireAdmin, updateBackground);

module.exports = router;
