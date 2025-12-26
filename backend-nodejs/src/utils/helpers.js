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
 * Comparar senha com hash (suporta MÚLTIPLOS algoritmos de MU Online)
 * DETECTA AUTOMATICAMENTE e TESTA TODOS os formatos conhecidos
 * 
 * Suporta:
 * - SHA-256 puro
 * - SHA-256(guid + password) - MU Online Season 19
 * - SHA-256(password + guid) - MU Online Season 19
 * - MD5 puro - MU Online Season 6
 * - SHA-256(MD5(password)) - Hash duplo
 * - Bcrypt - Sistemas modernos
 * - Texto plano - MU muito antigo (inseguro)
 */
const comparePassword = async (password, hash, guid = null) => {
  try {
    // ========================================================================
    // CRÍTICO: Normalizar hash vindo do MariaDB (remove lixo binário)
    // ========================================================================
    // Problema: MariaDB pode retornar hashes com:
    // - Espaços invisíveis
    // - Caracteres de controle (\0, \r, \n)
    // - Encoding diferente (latin1 → utf8)
    // - Bytes binários convertidos para VARCHAR
    //
    // Solução: Remover TUDO que não for caractere hexadecimal válido
    const cleanHash = hash.toString().replace(/[^a-fA-F0-9]/g, '');
    
    console.log(`🔍 Hash original (${hash.length} chars): ${hash.substring(0, 16)}...`);
    console.log(`🔍 Hash limpo (${cleanHash.length} chars): ${cleanHash.substring(0, 16)}...`);
    
    // SHA-256 hash tem sempre 64 caracteres hexadecimais
    if (cleanHash.length === 64 && /^[a-f0-9]+$/i.test(cleanHash)) {
      console.log('🔐 Detectado hash SHA-256 (64 chars)');
      console.log('🧪 Testando múltiplos algoritmos...');
      
      // Teste 1: SHA-256 puro
      const sha256Pure = crypto.createHash('sha256').update(password).digest('hex');
      console.log(`  [1/6] SHA256(password): ${sha256Pure.substring(0, 16)}...`);
      if (sha256Pure.toLowerCase() === cleanHash.toLowerCase()) {
        console.log('✅ MATCH: SHA-256 puro');
        return true;
      }
      
      // Teste 2: SHA-256(guid + password) - Se GUID disponível
      if (guid) {
        const sha256GuidPass = crypto.createHash('sha256').update(guid + password).digest('hex');
        console.log(`  [2/6] SHA256(guid + password): ${sha256GuidPass.substring(0, 16)}...`);
        if (sha256GuidPass.toLowerCase() === cleanHash.toLowerCase()) {
          console.log(`✅ MATCH: SHA-256(guid + password) - GUID: ${guid}`);
          return true;
        }
        
        // Teste 3: SHA-256(password + guid)
        const sha256PassGuid = crypto.createHash('sha256').update(password + guid).digest('hex');
        console.log(`  [3/6] SHA256(password + guid): ${sha256PassGuid.substring(0, 16)}...`);
        if (sha256PassGuid.toLowerCase() === cleanHash.toLowerCase()) {
          console.log(`✅ MATCH: SHA-256(password + guid) - GUID: ${guid}`);
          return true;
        }
      } else {
        console.log(`  [2/6] SHA256(guid + password): PULADO (GUID não fornecido)`);
        console.log(`  [3/6] SHA256(password + guid): PULADO (GUID não fornecido)`);
      }
      
      // Teste 4: SHA-256(MD5(password)) - Hash duplo (ALGORITMO MAIS COMUM EM MU!)
      const md5Hash = crypto.createHash('md5').update(password).digest('hex');
      const sha256MD5 = crypto.createHash('sha256').update(md5Hash).digest('hex');
      console.log(`  [4/6] SHA256(MD5(password)): ${sha256MD5.substring(0, 16)}...`);
      if (sha256MD5.toLowerCase() === cleanHash.toLowerCase()) {
        console.log('✅ MATCH: SHA-256(MD5(password)) - Hash duplo (MU Online padrão)');
        return true;
      }
      
      // Teste 5: SHA-256(MD5(password) + guid)
      if (guid) {
        const sha256MD5Guid = crypto.createHash('sha256').update(md5Hash + guid).digest('hex');
        console.log(`  [5/6] SHA256(MD5 + guid): ${sha256MD5Guid.substring(0, 16)}...`);
        if (sha256MD5Guid.toLowerCase() === cleanHash.toLowerCase()) {
          console.log(`✅ MATCH: SHA-256(MD5 + guid) - GUID: ${guid}`);
          return true;
        }
      } else {
        console.log(`  [5/6] SHA256(MD5 + guid): PULADO (GUID não fornecido)`);
      }
      
      // Teste 6: SHA-256(guid + MD5(password))
      if (guid) {
        const sha256GuidMD5 = crypto.createHash('sha256').update(guid + md5Hash).digest('hex');
        console.log(`  [6/6] SHA256(guid + MD5): ${sha256GuidMD5.substring(0, 16)}...`);
        if (sha256GuidMD5.toLowerCase() === cleanHash.toLowerCase()) {
          console.log(`✅ MATCH: SHA-256(guid + MD5) - GUID: ${guid}`);
          return true;
        }
      } else {
        console.log(`  [6/6] SHA256(guid + MD5): PULADO (GUID não fornecido)`);
      }
      
      console.log('❌ NENHUM ALGORITMO SHA-256 BATEU!');
      console.log(`📊 Hash esperado: ${cleanHash}`);
      console.log(`📊 GUID fornecido: ${guid || 'NÃO FORNECIDO'}`);
      return false;
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
 * IMPORTANTE: Retorna "message" para compatibilidade com frontend
 */
const errorResponse = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message: error.message || error  // ✅ MUDADO: "error" → "message"
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