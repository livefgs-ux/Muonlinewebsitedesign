/**
 * 🔒 MIDDLEWARE DE SEGURANÇA AVANÇADA
 * Implementa todas as proteções contra as vulnerabilidades do vídeo
 */

const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

// ═══════════════════════════════════════════════════════════════
// 1. RATE LIMITING CUSTOMIZADO POR ENDPOINT
// ═══════════════════════════════════════════════════════════════

/**
 * Rate limit estrito para LOGIN (previne brute force)
 * 5 tentativas por 15 minutos por IP
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: {
    success: false,
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Identificar por IP + User Agent (mais difícil de burlar)
  keyGenerator: (req) => {
    return `${req.ip}-${req.headers['user-agent'] || 'unknown'}`;
  }
});

/**
 * Rate limit para REGISTRO (previne spam de contas)
 * 3 registros por hora por IP
 */
const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 registros
  message: {
    success: false,
    error: 'Muitos registros criados. Tente novamente em 1 hora.',
    retryAfter: '1 hora'
  },
  keyGenerator: (req) => {
    return `${req.ip}-${req.headers['user-agent'] || 'unknown'}`;
  }
});

/**
 * Rate limit para RESET/AÇÕES SENSÍVEIS
 * 10 ações por 15 minutos
 */
const resetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 tentativas
  message: {
    success: false,
    error: 'Muitas ações em pouco tempo. Aguarde 15 minutos.',
    retryAfter: '15 minutos'
  }
});

/**
 * Rate limit para recuperação de senha
 * 3 tentativas por hora
 */
const passwordRecoveryRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 tentativas
  message: {
    success: false,
    error: 'Muitas solicitações de recuperação de senha. Tente novamente em 1 hora.',
    retryAfter: '1 hora'
  }
});

// ═══════════════════════════════════════════════════════════════
// 2. VALIDAÇÃO DE EMAIL (BLACKLIST DE TEMPORÁRIOS)
// ═══════════════════════════════════════════════════════════════

/**
 * Lista de domínios de email temporário conhecidos
 * Baseado em: https://github.com/disposable/disposable-email-domains
 */
const TEMP_EMAIL_DOMAINS = [
  // Top 50 mais usados
  '10minutemail.com', '10minutemail.net', '10minutemail.org',
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamailblock.com',
  'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'tempmail.net',
  'mailinator.com', 'mailtinator.com', 'trashmail.com', 'trashmail.net',
  'yopmail.com', 'yopmail.net', 'yopmail.fr',
  'throwaway.email', 'throwawaymail.com', 'getnada.com',
  'mailnesia.com', 'mail-temp.com', 'emailondeck.com',
  'fakeinbox.com', 'fake-mail.com', 'tempr.email',
  'mohmal.com', 'sharklasers.com', 'grr.la', 'guerrillamail.biz',
  'spam4.me', 'mintemail.com', 'mytemp.email', 'mytempemail.com',
  'emailtemp.org', 'dispostable.com', 'binmail.in',
  'mfsa.ru', 'mfsa.info', 'mailcatch.com', 'mailforspam.com',
  'etranquil.com', 'getairmail.com', 'airmail.cc',
  'anonymbox.com', 'bugmenot.com', 'crazymailing.com',
  'deadaddress.com', 'dodgeit.com', 'dontreg.com'
];

/**
 * Middleware para validar email (previne temporários)
 */
const validateEmailMiddleware = (req, res, next) => {
  try {
    const email = req.body.email || req.body.memb__pwd;
    
    if (!email) {
      return next(); // Deixa outros validadores tratarem
    }

    // Extrair domínio
    const emailLower = email.toLowerCase().trim();
    const domain = emailLower.split('@')[1];

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    // Verificar se é email temporário
    if (TEMP_EMAIL_DOMAINS.includes(domain)) {
      console.log(`🚫 Email temporário bloqueado: ${emailLower}`);
      
      return res.status(400).json({
        success: false,
        error: 'Emails temporários não são permitidos. Use um email real.',
        field: 'email'
      });
    }

    // Email válido
    next();

  } catch (error) {
    console.error('❌ Erro na validação de email:', error);
    next(); // Não bloqueia em caso de erro no middleware
  }
};

// ═══════════════════════════════════════════════════════════════
// 3. VALIDAÇÃO DE SENHA FORTE
// ═══════════════════════════════════════════════════════════════

/**
 * Requisitos de senha forte:
 * - Mínimo 8 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 letra minúscula
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial (@$!%*?&)
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=[\]{}|;:'",.<>/?\\])[A-Za-z\d@$!%*?&#^()_\-+=[\]{}|;:'",.<>/?\\]{8,}$/;

/**
 * Middleware para validar força da senha
 */
const validatePasswordStrength = (req, res, next) => {
  try {
    const password = req.body.password || req.body.memb_pwd;

    if (!password) {
      return next(); // Deixa outros validadores tratarem
    }

    // Verificar tamanho mínimo
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Senha muito fraca. Mínimo 8 caracteres.',
        requirements: {
          minLength: 8,
          uppercase: true,
          lowercase: true,
          number: true,
          special: true
        }
      });
    }

    // Verificar regex completo
    if (!PASSWORD_REGEX.test(password)) {
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[@$!%*?&#^()_\-+=[\]{}|;:'",.<>/?\\]/.test(password);

      let errorMsg = 'Senha muito fraca. Faltam: ';
      const missing = [];

      if (!hasUppercase) missing.push('1 letra maiúscula');
      if (!hasLowercase) missing.push('1 letra minúscula');
      if (!hasNumber) missing.push('1 número');
      if (!hasSpecial) missing.push('1 caractere especial (@$!%*?&#)');

      errorMsg += missing.join(', ');

      return res.status(400).json({
        success: false,
        error: errorMsg,
        requirements: {
          minLength: password.length >= 8,
          uppercase: hasUppercase,
          lowercase: hasLowercase,
          number: hasNumber,
          special: hasSpecial
        }
      });
    }

    // Senha forte - prosseguir
    next();

  } catch (error) {
    console.error('❌ Erro na validação de senha:', error);
    next(); // Não bloqueia em caso de erro no middleware
  }
};

// ═══════════════════════════════════════════════════════════════
// 4. SANITIZAÇÃO XSS (PREVINE INJEÇÃO DE SCRIPTS)
// ═══════════════════════════════════════════════════════════════

/**
 * Middleware XSS Clean
 * Limpa dados de entrada para prevenir XSS
 */
const xssMiddleware = xss();

// ═══════════════════════════════════════════════════════════════
// 5. FORÇAR HTTPS (EM PRODUÇÃO)
// ═══════════════════════════════════════════════════════════════

/**
 * Redirecionar HTTP -> HTTPS em produção
 */
const forceHttps = (req, res, next) => {
  // Ignorar em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // Verificar se está em HTTPS
  const proto = req.header('x-forwarded-proto') || req.protocol;
  
  if (proto !== 'https') {
    console.log(`🔒 Redirecionando para HTTPS: ${req.url}`);
    return res.redirect(301, `https://${req.header('host')}${req.url}`);
  }

  next();
};

// ═══════════════════════════════════════════════════════════════
// 6. VALIDAÇÃO DE IP (PREVINE PROXIES MALICIOSOS)
// ═══════════════════════════════════════════════════════════════

/**
 * Extrair IP real do usuário (considerando proxies)
 */
const getRealIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.ip;
};

/**
 * Middleware para adicionar IP real à requisição
 */
const addRealIp = (req, res, next) => {
  req.realIp = getRealIp(req);
  next();
};

// ═══════════════════════════════════════════════════════════════
// 7. PREVENIR ENUMERAÇÃO DE USUÁRIOS
// ═══════════════════════════════════════════════════════════════

/**
 * Mensagem genérica para login/registro
 * Não revela se usuário existe ou não
 */
const genericAuthMessage = {
  login: 'Credenciais inválidas',
  register: 'Erro ao criar conta. Verifique os dados.',
  recovery: 'Se o email existir, enviaremos instruções de recuperação.'
};

// ═══════════════════════════════════════════════════════════════
// EXPORTAR MIDDLEWARES
// ═══════════════════════════════════════════════════════════════

module.exports = {
  // Rate limiting
  loginRateLimiter,
  registerRateLimiter,
  resetRateLimiter,
  passwordRecoveryRateLimiter,
  
  // Validações
  validateEmailMiddleware,
  validatePasswordStrength,
  
  // Sanitização
  xssMiddleware,
  
  // HTTPS
  forceHttps,
  
  // IP
  addRealIp,
  getRealIp,
  
  // Mensagens genéricas
  genericAuthMessage,
  
  // Lista de emails temporários (para uso externo)
  TEMP_EMAIL_DOMAINS
};
