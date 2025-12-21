/**
 * Rotas de Notícias
 */

const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');
const { validateNews } = require('../utils/validators');
const { verifyToken, verifyAdmin } = require('../middleware/auth-middleware');

// GET /api/news - Listar notícias (público)
router.get('/', getAllNews);

// GET /api/news/:id - Obter notícia por ID (público)
router.get('/:id', getNewsById);

// POST /api/news - Criar notícia (admin)
router.post('/', verifyToken, verifyAdmin, validateNews, createNews);

// PUT /api/news/:id - Atualizar notícia (admin)
router.put('/:id', verifyToken, verifyAdmin, validateNews, updateNews);

// DELETE /api/news/:id - Deletar notícia (admin)
router.delete('/:id', verifyToken, verifyAdmin, deleteNews);

module.exports = router;
