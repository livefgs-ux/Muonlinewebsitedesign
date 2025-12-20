// Middleware de autenticação JWT com verificação de IP e User-Agent
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'MeuMU-Online-Season19-Secret-Key-2025';
const JWT_EXPIRATION = '12h'; // Token válido por 12 horas

/**
 * Verifica se o token JWT é válido e se a sessão não foi comprometida
 * Previne: Session Hijacking, Token Replay Attacks
 */
export function verifyToken(req, res, next) {
  try {
    // Busca token do cookie ou header Authorization
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: "Autenticação necessária. Token ausente." 
      });
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // ===== VALIDAÇÃO ANTI-HIJACK =====
    // Compara IP e User-Agent para detectar sessões roubadas
    const currentIp = req.ip || req.connection.remoteAddress;
    const currentUa = req.headers["user-agent"] || '';

    // Se IP ou UA mudaram, a sessão pode ter sido comprometida
    if (decoded.ip !== currentIp) {
      console.warn(`⚠️ IP mudou para sessão - User: ${decoded.username}, IP Original: ${decoded.ip}, IP Atual: ${currentIp}`);
      return res.status(403).json({ 
        success: false,
        error: "Sessão inválida. Faça login novamente por segurança." 
      });
    }

    if (decoded.ua !== currentUa) {
      console.warn(`⚠️ User-Agent mudou para sessão - User: ${decoded.username}`);
      return res.status(403).json({ 
        success: false,
        error: "Sessão inválida. Faça login novamente por segurança." 
      });
    }

    // Adiciona dados do usuário na requisição para uso posterior
    req.user = {
      username: decoded.username,
      role: decoded.role || 'user',
      accountId: decoded.accountId
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        success: false,
        error: "Token expirado. Faça login novamente.",
        expired: true
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false,
        error: "Token inválido ou corrompido." 
      });
    }

    console.error('Erro ao verificar token:', err);
    return res.status(500).json({ 
      success: false,
      error: "Erro ao validar autenticação." 
    });
  }
}

/**
 * Verifica se o usuário tem permissão de administrador
 */
export function verifyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: "Autenticação necessária." 
    });
  }

  // Verifica se é admin (role pode ser 1, 2, 3, etc dependendo do servidor MU)
  if (req.user.role === 'user' || req.user.role === 0) {
    return res.status(403).json({ 
      success: false,
      error: "Acesso negado. Permissão de administrador necessária." 
    });
  }

  next();
}

/**
 * Middleware combinado que verifica autenticação E autorização de admin
 * Para uso nas rotas do AdminCP
 */
export function requireAuth(req, res, next) {
  verifyToken(req, res, (err) => {
    if (err) return;
    verifyAdmin(req, res, next);
  });
}

/**
 * Gera um token JWT seguro
 */
export function generateToken(userData) {
  const payload = {
    username: userData.username,
    accountId: userData.accountId,
    role: userData.role || 'user',
    ip: userData.ip,
    ua: userData.ua,
    iat: Math.floor(Date.now() / 1000) // Issued at timestamp
  };

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRATION 
  });
}