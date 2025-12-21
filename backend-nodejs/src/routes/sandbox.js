/**
 * SECURITY SANDBOX ROUTES
 */

const express = require('express');
const router = express.Router();
const {
  runSimulation,
  getSimulationHistory,
  clearHistory
} = require('../controllers/sandboxController');

// Executar simulação
router.post('/simulate', runSimulation);

// Histórico de simulações
router.get('/history', getSimulationHistory);

// Limpar histórico
router.delete('/history', clearHistory);

module.exports = router;
