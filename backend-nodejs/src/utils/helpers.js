/**
 * Funções Auxiliares
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn, bcryptSaltRounds } = require('../config/auth');

/**
 * Gerar hash de senha
 */
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, bcryptSaltRounds);
  } catch (error) {
    throw new Error('Erro ao gerar hash de senha');
  }
};

/**
 * Comparar senha com hash
 */
const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Erro ao comparar senha');
  }
};

/**
 * Gerar token JWT
 */
const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
};

/**
 * Verificar token JWT
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
};

/**
 * Formatar data para MySQL
 */
const formatDateForMySQL = (date = new Date()) => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Sanitizar username (remover caracteres especiais)
 */
const sanitizeUsername = (username) => {
  return username.replace(/[^a-zA-Z0-9]/g, '');
};

/**
 * Calcular classe do personagem baseado no número
 */
const getClassName = (classNumber) => {
  const classes = {
    0: 'Dark Wizard',
    1: 'Soul Master',
    2: 'Grand Master',
    3: 'Soul Wizard',
    16: 'Dark Knight',
    17: 'Blade Knight',
    18: 'Blade Master',
    19: 'Dragon Knight',
    32: 'Fairy Elf',
    33: 'Muse Elf',
    34: 'High Elf',
    35: 'Noble Elf',
    48: 'Magic Gladiator',
    49: 'Duel Master',
    50: 'Magic Knight',
    64: 'Dark Lord',
    65: 'Lord Emperor',
    66: 'Empire Lord',
    80: 'Summoner',
    81: 'Bloody Summoner',
    82: 'Dimension Master',
    83: 'Dimension Summoner',
    96: 'Rage Fighter',
    97: 'Fist Master',
    98: 'Fist Blazer',
    112: 'Grow Lancer',
    113: 'Mirage Lancer',
    114: 'Shining Lancer',
    128: 'Rune Mage',
    129: 'Rune Spell Master',
    130: 'Grand Rune Mage',
    144: 'Slayer',
    145: 'Royal Slayer',
    146: 'Master Slayer',
    160: 'Gun Crusher',
    161: 'Gun Breaker',
    162: 'Master Gun Breaker',
    176: 'Light Wizard',
    177: 'Shine Wizard',
    178: 'Luminous Wizard'
  };
  
  return classes[classNumber] || 'Unknown';
};

/**
 * Resposta de sucesso padronizada
 */
const successResponse = (res, data, message = 'Operação realizada com sucesso', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Resposta de erro padronizada
 */
const errorResponse = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: error.message || error
  });
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  formatDateForMySQL,
  sanitizeUsername,
  getClassName,
  successResponse,
  errorResponse
};
