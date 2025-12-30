/**
 * CRONS ROUTES - MEUMU ONLINE
 * Rotas de gerenciamento de Cron Jobs (AdminCP)
 */

const express = require('express');
const router = express.Router();
const cronsController = require('../controllers/cronsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Todas as rotas requerem autenticação de admin
router.use(authenticate, requireAdmin);

// Listar todos os crons
router.get('/', cronsController.getAllCrons);

// Criar novo cron
router.post('/', cronsController.createCron);

// Obter detalhes de um cron
router.get('/:id', cronsController.getCronById);

// Atualizar cron
router.put('/:id', cronsController.updateCron);

// Executar cron manualmente
router.post('/:id/execute', cronsController.executeCron);

// Ativar/desativar cron
router.patch('/:id/toggle', cronsController.toggleCron);

// Deletar cron
router.delete('/:id', cronsController.deleteCron);

module.exports = router;
