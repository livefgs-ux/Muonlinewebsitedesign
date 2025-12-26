/**
 * Funções Auxiliares
 */

const bcrypt = require('bcrypt');
const crypto = require('crypto');
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
 * Gerar hash MD5 (compatível com servidores MU antigos)
 */
const hashPasswordMD5 = (password) => {
  return crypto.createHash('md5').update(password).digest('hex');
};

/**
 * Comparar senha com hash (suporta SHA-256, MD5 e Bcrypt)
 * DETECTA AUTOMATICAMENTE o formato do hash
 */
const comparePassword = async (password, hash) => {
  try {
    // Remover espaços em branco
    const cleanHash = hash.trim();
    
    // SHA-256 hash tem sempre 64 caracteres hexadecimais
    if (cleanHash.length === 64 && /^[a-f0-9]+$/i.test(cleanHash)) {
      console.log('🔐 Detectado hash SHA-256');
      const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
      return sha256Hash.toLowerCase() === cleanHash.toLowerCase();
    }
    
    // MD5 hash tem sempre 32 caracteres hexadecimais
    if (cleanHash.length === 32 && /^[a-f0-9]+$/i.test(cleanHash)) {
      console.log('🔐 Detectado hash MD5');
      const md5Hash = hashPasswordMD5(password);
      return md5Hash.toLowerCase() === cleanHash.toLowerCase();
    }
    
    // Bcrypt hash começa com $2a$, $2b$ ou $2y$
    if (cleanHash.startsWith('$2')) {
      console.log('🔐 Detectado hash Bcrypt');
      return await bcrypt.compare(password, cleanHash);
    }
    
    // Senha em texto plano (alguns servidores MU muito antigos)
    console.log('⚠️ Detectado senha em texto plano (inseguro!)');
    return password === cleanHash;
    
  } catch (error) {
    console.error('❌ Erro ao comparar senha:', error);
    return false;
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