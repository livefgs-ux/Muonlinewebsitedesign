/**
 * Middleware de Autenticação JWT
 */

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');

/**
 * Verificar se o token JWT é válido
 */
const verifyToken = (req, res, next) => {
  try {
    // Pegar token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido'
      });
    }

    // Formato: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'Formato de token inválido'
      });
    }

    const token = parts[1];

    // Verificar token
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: 'Token inválido ou expirado'
        });
      }

      // Adicionar dados do usuário na requisição
      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error('❌ Erro no middleware de autenticação:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao verificar autenticação'
    });
  }
};

/**
 * Verificar se o usuário é admin
 */
const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Acesso negado. Apenas administradores.'
    });
  }
  next();
};

/**
 * Middleware opcional (não retorna erro se não tiver token)
 */
const verifyTokenOptional = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      req.user = null;
      return next();
    }

    const token = parts[1];

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        req.user = null;
      } else {
        req.user = decoded;
      }
      next();
    });

  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyTokenOptional
};
