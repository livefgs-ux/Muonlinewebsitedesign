/**
 * EVENTS ROUTES - MEUMU ONLINE
 * Rotas para gerenciamento de eventos
 */

const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { verifyToken, verifyAdmin } = require('../middleware/auth-middleware');

// ==========================================
// ROTAS PÚBLICAS
// ==========================================

/**
 * @route   GET /api/events
 * @desc    Obter todos os eventos ativos
 * @access  Public
 */
router.get('/', eventsController.getActiveEvents);

/**
 * @route   GET /api/events/featured
 * @desc    Obter eventos em destaque
 * @access  Public
 */
router.get('/featured', eventsController.getFeaturedEvents);

/**
 * @route   GET /api/events/:id
 * @desc    Obter detalhes de um evento
 * @access  Public
 */
router.get('/:id', eventsController.getEventById);

/**
 * @route   GET /api/events/:id/next-occurrence
 * @desc    Calcular próxima ocorrência do evento
 * @access  Public
 */
router.get('/:id/next-occurrence', eventsController.getNextOccurrence);

// ==========================================
// ROTAS ADMIN (Requerem autenticação)
// ==========================================

/**
 * @route   GET /api/admin/events
 * @desc    Listar todos os eventos (incluindo inativos)
 * @access  Admin
 */
router.get('/admin/all', verifyToken, verifyAdmin, eventsController.getAllEventsAdmin);

/**
 * @route   POST /api/admin/events
 * @desc    Criar novo evento
 * @access  Admin
 */
router.post('/admin', verifyToken, verifyAdmin, eventsController.createEvent);

/**
 * @route   PUT /api/admin/events/:id
 * @desc    Atualizar evento
 * @access  Admin
 */
router.put('/admin/:id', verifyToken, verifyAdmin, eventsController.updateEvent);

/**
 * @route   DELETE /api/admin/events/:id
 * @desc    Deletar evento
 * @access  Admin
 */
router.delete('/admin/:id', verifyToken, verifyAdmin, eventsController.deleteEvent);

/**
 * @route   PATCH /api/admin/events/:id/toggle
 * @desc    Ativar/desativar evento
 * @access  Admin
 */
router.patch('/admin/:id/toggle', verifyToken, verifyAdmin, eventsController.toggleEventStatus);

/**
 * @route   GET /api/admin/events/stats
 * @desc    Obter estatísticas de eventos
 * @access  Admin
 */
router.get('/admin/stats', verifyToken, verifyAdmin, eventsController.getEventStats);

module.exports = router;