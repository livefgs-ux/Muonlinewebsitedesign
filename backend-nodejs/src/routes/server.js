/**
 * Rotas de Informações do Servidor
 */

const express = require('express');
const router = express.Router();
const {
  getServerInfo,
  getServerStats
} = require('../controllers/serverController');

// GET /api/server/info - Informações do servidor
router.get('/info', getServerInfo);

// GET /api/server/stats - Estatísticas em tempo real
router.get('/stats', getServerStats);

// ⚠️ REMOVIDO: GET /api/server/health (duplicado!)
// /health existe na RAIZ (server.js linha 212), não em /api/server/health

module.exports = router;