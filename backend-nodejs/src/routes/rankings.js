/**
 * Rotas de Rankings
 */

const express = require('express');
const router = express.Router();
const {
  getTopResets,
  getTopPK,
  getTopLevel,
  getTopGuilds,
  getTopByClass,
  getCharacterRank,
  getTopGrandResets
} = require('../controllers/rankingsController');
const { validateRankingParams } = require('../utils/validators');

// GET /api/rankings/resets - Top Resets
router.get('/resets', validateRankingParams, getTopResets);

// GET /api/rankings/pk - Top PK
router.get('/pk', validateRankingParams, getTopPK);

// GET /api/rankings/level - Top Level
router.get('/level', validateRankingParams, getTopLevel);

// GET /api/rankings/guilds - Top Guilds
router.get('/guilds', validateRankingParams, getTopGuilds);

// GET /api/rankings/class/:classId - Top por Classe
router.get('/class/:classId', validateRankingParams, getTopByClass);

// GET /api/rankings/character/:name - Posição de um personagem
router.get('/character/:name', getCharacterRank);

// GET /api/rankings/grandresets - Top Grand Resets
router.get('/grandresets', validateRankingParams, getTopGrandResets);

module.exports = router;