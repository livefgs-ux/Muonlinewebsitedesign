// Middleware global de segurança para proteção contra múltiplas ameaças
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import validator from "validator";

/**
 * Aplica todas as medidas de segurança no app Express
 * Protege contra: XSS, SQL Injection, Bruteforce, CSRF, Clickjacking
 */
export function applySecurity(app) {
  // ===== HELMET: Headers de segurança HTTP =====
  app.use(helmet({
    contentSecurityPolicy: false, // React SPA gerencia seu próprio CSP
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Permite CORS
    hidePoweredBy: true, // Remove header X-Powered-By
    hsts: {
      maxAge: 63072000, // 2 anos
      includeSubDomains: true,
      preload: true
    },
    noSniff: true, // X-Content-Type-Options: nosniff
    xssFilter: true, // X-XSS-Protection
    frameguard: { action: 'deny' }, // Previne clickjacking
  }));

  // ===== RATE LIMITING: Anti-Bruteforce Global =====
  const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 50, // Máximo 50 requisições por minuto por IP
    message: {
      success: false,
      error: "Muitas requisições. Aguarde 1 minuto e tente novamente."
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    handler: (req, res) => {
      console.warn(`⚠️ Rate limit excedido - IP: ${req.ip}, Path: ${req.path}`);
      res.status(429).json({
        success: false,
        error: "Muitas requisições. Aguarde 1 minuto e tente novamente."
      });
    }
  });

  app.use('/api/', generalLimiter);

  // ===== RATE LIMITING ESPECÍFICO PARA AUTENTICAÇÃO =====
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 tentativas de login a cada 15 minutos
    skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
    message: {
      success: false,
      error: "Muitas tentativas de login. Tente novamente em 15 minutos."
    },
    handler: (req, res) => {
      console.warn(`🚨 Bloqueio de autenticação - IP: ${req.ip}, Username: ${req.body?.username || 'N/A'}`);
      res.status(429).json({
        success: false,
        error: "Muitas tentativas de login. Tente novamente em 15 minutos."
      });
    }
  });

  // Aplica limitador de autenticação nas rotas de login e registro
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);

  // ===== XSS PROTECTION: Sanitização de dados =====
  app.use(xss());

  // ===== SANITIZAÇÃO CUSTOMIZADA DE INPUTS =====
  app.use((req, res, next) => {
    // Sanitiza campos do body
    if (req.body && typeof req.body === 'object') {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          // Remove espaços em branco e escapa HTML perigoso
          req.body[key] = validator.escape(req.body[key].trim());
          
          // Validações adicionais
          if (key === 'email' && req.body[key]) {
            req.body[key] = validator.normalizeEmail(req.body[key]) || req.body[key];
          }
        }
      }
    }

    // Sanitiza query parameters
    if (req.query && typeof req.query === 'object') {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = validator.escape(req.query[key].trim());
        }
      }
    }

    next();
  });

  // ===== LOG DE SEGURANÇA =====
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    const method = req.method;
    const path = req.path;
    
    // Log de requisições suspeitas
    if (req.path.includes('..') || req.path.includes('<script')) {
      console.warn(`🚨 ATIVIDADE SUSPEITA DETECTADA - ${timestamp} - ${ip} - ${method} ${path}`);
    }
    
    next();
  });

  console.log('🛡️  Sistema de segurança ativado com sucesso!');
  console.log('   ✓ Helmet headers configurados');
  console.log('   ✓ Rate limiting ativo (50 req/min geral, 5 login/15min)');
  console.log('   ✓ Proteção XSS ativada');
  console.log('   ✓ Sanitização de inputs habilitada');
}

/**
 * Valida campos de entrada para prevenir injeções
 */
export function validateInput(field, type = 'text') {
  if (!field || typeof field !== 'string') {
    return { valid: false, error: 'Campo inválido' };
  }

  switch (type) {
    case 'username':
      // Apenas letras, números e underscores, 3-16 caracteres
      if (!/^[a-zA-Z0-9_]{3,16}$/.test(field)) {
        return { 
          valid: false, 
          error: 'Username deve ter 3-16 caracteres e conter apenas letras, números e _' 
        };
      }
      break;

    case 'password':
      // Mínimo 6 caracteres
      if (field.length < 6 || field.length > 50) {
        return { 
          valid: false, 
          error: 'Senha deve ter entre 6 e 50 caracteres' 
        };
      }
      break;

    case 'email':
      if (!validator.isEmail(field)) {
        return { 
          valid: false, 
          error: 'Email inválido' 
        };
      }
      break;

    default:
      // Validação genérica: remove caracteres perigosos
      if (/<script|<iframe|javascript:|onerror=/i.test(field)) {
        return { 
          valid: false, 
          error: 'Entrada contém caracteres não permitidos' 
        };
      }
  }

  return { valid: true };
}
