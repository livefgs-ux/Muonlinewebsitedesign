/**
 * ADMIN LOGS ROUTES
 * Rotas para sistema de auditoria administrativa
 */

const express = require('express');
const router = express.Router();
const {
  logAdminAction,
  getAdminLogs,
  getLogStats,
  exportLogsToCSV,
  cleanOldLogs
} = require('../controllers/adminLogsController');

// Registrar nova ação (usado internamente por outros controllers)
router.post('/log', logAdminAction);

// Listar logs com filtros
router.get('/logs', getAdminLogs);

// Estatísticas de logs
router.get('/stats', getLogStats);

// Exportar logs para CSV
router.get('/export', exportLogsToCSV);

// Limpar logs antigos (apenas Super Admin)
router.delete('/clean', cleanOldLogs);

module.exports = router;
