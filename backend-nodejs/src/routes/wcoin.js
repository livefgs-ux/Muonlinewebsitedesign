/**
 * WCOIN PACKAGES ROUTES
 * Rotas para gestão de pacotes de WCoin
 */

const express = require('express');
const router = express.Router();
const wcoinController = require('../controllers/wcoinController');
const { authenticateToken, isAdmin } = require('../middleware/auth-middleware');

// Rotas públicas
router.get('/packages', wcoinController.getAllPackages);
router.get('/packages/:id', wcoinController.getPackageById);

// Rotas administrativas (requerem autenticação)
router.get('/admin/packages', authenticateToken, isAdmin, wcoinController.getAllPackagesAdmin);
router.post('/admin/packages', authenticateToken, isAdmin, wcoinController.createPackage);
router.put('/admin/packages/:id', authenticateToken, isAdmin, wcoinController.updatePackage);
router.delete('/admin/packages/:id', authenticateToken, isAdmin, wcoinController.deletePackage);
router.delete('/admin/packages/:id/permanent', authenticateToken, isAdmin, wcoinController.permanentDeletePackage);

module.exports = router;
