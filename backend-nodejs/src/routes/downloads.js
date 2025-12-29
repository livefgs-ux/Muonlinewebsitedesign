/**
 * DOWNLOADS ROUTES - MEUMU ONLINE
 * Rotas de gerenciamento de downloads
 */

const express = require('express');
const router = express.Router();
const downloadsController = require('../controllers/downloadsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/', downloadsController.getActiveDownloads);
router.get('/:id', downloadsController.getDownloadById);

// Rotas admin (requerem autenticação)
router.get('/admin/all', authenticate, requireAdmin, downloadsController.getAllDownloadsAdmin);
router.post('/admin', authenticate, requireAdmin, downloadsController.createDownload);
router.put('/admin/:id', authenticate, requireAdmin, downloadsController.updateDownload);
router.delete('/admin/:id', authenticate, requireAdmin, downloadsController.deleteDownload);
router.patch('/admin/:id/toggle', authenticate, requireAdmin, downloadsController.toggleDownloadStatus);
router.get('/admin/stats', authenticate, requireAdmin, downloadsController.getDownloadStats);

module.exports = router;
