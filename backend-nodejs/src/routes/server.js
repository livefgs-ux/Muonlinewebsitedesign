/**
 * Rotas de Informações do Servidor
 */

const express = require('express');
const router = express.Router();
const {
  getServerInfo,
  getServerStats,
  getHealthStatus
} = require('../controllers/serverController');

// GET /api/server/info - Informações do servidor
router.get('/info', getServerInfo);

// GET /api/server/stats - Estatísticas em tempo real
router.get('/stats', getServerStats);

// GET /api/health - Status da API
router.get('/health', getHealthStatus);

module.exports = router;
