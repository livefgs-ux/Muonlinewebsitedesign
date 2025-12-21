/**
 * WCOIN PACKAGES ROUTES
 * Rotas para gestão de pacotes de WCoin
 */

const express = require('express');
const router = express.Router();
const wcoinController = require('../controllers/wcoinController');
const { verifyToken, verifyAdmin } = require('../middleware/auth-middleware');

// Rotas públicas
router.get('/packages', wcoinController.getAllPackages);
router.get('/packages/:id', wcoinController.getPackageById);

// Rotas administrativas (requerem autenticação)
router.get('/admin/packages', verifyToken, verifyAdmin, wcoinController.getAllPackagesAdmin);
router.post('/admin/packages', verifyToken, verifyAdmin, wcoinController.createPackage);
router.put('/admin/packages/:id', verifyToken, verifyAdmin, wcoinController.updatePackage);
router.delete('/admin/packages/:id', verifyToken, verifyAdmin, wcoinController.deletePackage);
router.delete('/admin/packages/:id/permanent', verifyToken, verifyAdmin, wcoinController.permanentDeletePackage);

module.exports = router;