/**
 * Rotas de Personagens
 */

const express = require('express');
const router = express.Router();
const {
  getAccountCharacters,
  getCharacterDetails,
  distributePoints,
  resetCharacter
} = require('../controllers/charactersController');
const { validateDistributePoints } = require('../utils/validators');
const { verifyToken } = require('../middleware/auth-middleware');

// Todas as rotas requerem autenticação
router.use(verifyToken);

// GET /api/characters - Listar personagens da conta
router.get('/', getAccountCharacters);

// GET /api/characters/:name - Detalhes de um personagem
router.get('/:name', getCharacterDetails);

// PUT /api/characters/:name/points - Distribuir pontos
router.put('/:name/points', validateDistributePoints, distributePoints);

// POST /api/characters/:name/reset - Reset de personagem
router.post('/:name/reset', resetCharacter);

module.exports = router;
