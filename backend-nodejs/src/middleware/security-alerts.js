/**
 * 🚨 SISTEMA DE ALERTAS DE SEGURANÇA
 * Notifica sobre atividades suspeitas
 */

const fs = require('fs');
const path = require('path');
const { logAudit, EventTypes } = require('./audit-log');

// ═══════════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════════

const ALERTS_DIR = path.join(__dirname, '../../../logs/alerts');
const ALERT_EMAIL = process.env.SECURITY_ALERT_EMAIL || null;

// Criar diretório se não existir
if (!fs.existsSync(ALERTS_DIR)) {
  fs.mkdirSync(ALERTS_DIR, { recursive: true });
}

// ═══════════════════════════════════════════════════════════════
// TIPOS DE ALERTAS
// ═══════════════════════════════════════════════════════════════

const AlertLevel = {
  LOW: 'LOW',           // Informativo
  MEDIUM: 'MEDIUM',     // Requer atenção
  HIGH: 'HIGH',         // Requer ação imediata
  CRITICAL: 'CRITICAL'  // Possível ataque em andamento
};

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES DE ALERTA
// ═══════════════════════════════════════════════════════════════

/**
 * Enviar alerta de segurança
 */
const sendSecurityAlert = (level, title, details = {}) => {
  try {
    const timestamp = new Date().toISOString();
    const date = new Date().toISOString().split('T')[0];

    const alert = {
      timestamp,
      level,
      title,
      details,
      acknowledged: false
    };

    // Salvar em arquivo
    const alertFile = path.join(ALERTS_DIR, `${date}.json`);
    let alerts = [];

    if (fs.existsSync(alertFile)) {
      const content = fs.readFileSync(alertFile, 'utf-8');
      try {
        alerts = JSON.parse(content);
      } catch (e) {
        alerts = [];
      }
    }

    alerts.push(alert);
    fs.writeFileSync(alertFile, JSON.stringify(alerts, null, 2));

    // Log no console com cores
    const emoji = {
      LOW: 'ℹ️',
      MEDIUM: '⚠️',
      HIGH: '🔴',
      CRITICAL: '🚨'
    }[level];

    console.log(`\n${emoji} ALERTA DE SEGURANÇA [${level}]`);
    console.log(`   ${title}`);
    console.log(`   Timestamp: ${timestamp}`);
    if (Object.keys(details).length > 0) {
      console.log(`   Detalhes:`, details);
    }
    console.log('');

    // TODO: Enviar email se configurado
    if (ALERT_EMAIL && (level === AlertLevel.HIGH || level === AlertLevel.CRITICAL)) {
      // Implementar envio de email
      console.log(`📧 Email de alerta deveria ser enviado para: ${ALERT_EMAIL}`);
    }

    return alert;

  } catch (error) {
    console.error('❌ Erro ao enviar alerta de segurança:', error);
  }
};

// ═══════════════════════════════════════════════════════════════
// ALERTAS ESPECÍFICOS
// ═══════════════════════════════════════════════════════════════

/**
 * Alerta de múltiplas tentativas de login falhas
 */
const alertMultipleLoginFails = (identifier, attempts, timeWindow) => {
  sendSecurityAlert(
    AlertLevel.HIGH,
    'Múltiplas tentativas de login falhas detectadas',
    {
      identifier,
      attempts,
      timeWindow,
      possibleAttack: 'Brute Force',
      recommendation: 'Considerar bloqueio temporário do IP'
    }
  );
};

/**
 * Alerta de acesso de novo IP
 */
const alertNewIpAccess = (userId, username, newIp, previousIps) => {
  sendSecurityAlert(
    AlertLevel.MEDIUM,
    'Acesso de novo IP detectado',
    {
      userId,
      username,
      newIp,
      previousIps: previousIps.slice(0, 5), // Últimos 5 IPs
      recommendation: 'Verificar se o acesso é legítimo'
    }
  );
};

/**
 * Alerta de tentativa de SQL Injection
 */
const alertSqlInjectionAttempt = (req, query) => {
  sendSecurityAlert(
    AlertLevel.CRITICAL,
    'Tentativa de SQL Injection detectada',
    {
      ip: req.realIp || req.ip,
      userAgent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      suspiciousQuery: query,
      recommendation: 'Bloquear IP imediatamente'
    }
  );

  // Logar também no audit
  logAudit(EventTypes.SUSPICIOUS_ACTIVITY, {
    type: 'SQL_INJECTION_ATTEMPT',
    query
  }, req);
};

/**
 * Alerta de tentativa de XSS
 */
const alertXssAttempt = (req, field, value) => {
  sendSecurityAlert(
    AlertLevel.HIGH,
    'Tentativa de XSS detectada',
    {
      ip: req.realIp || req.ip,
      userAgent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      field,
      suspiciousValue: value.substring(0, 100), // Primeiros 100 chars
      recommendation: 'Monitorar IP por atividade suspeita'
    }
  );
};

/**
 * Alerta de acesso não autorizado
 */
const alertUnauthorizedAccess = (req, resource) => {
  sendSecurityAlert(
    AlertLevel.HIGH,
    'Tentativa de acesso não autorizado',
    {
      ip: req.realIp || req.ip,
      userAgent: req.headers['user-agent'],
      path: req.path,
      resource,
      userId: req.user?.userId || 'N/A',
      recommendation: 'Verificar tentativas repetidas do mesmo IP'
    }
  );
};

/**
 * Alerta de email temporário bloqueado
 */
const alertTempEmailBlocked = (email, ip) => {
  sendSecurityAlert(
    AlertLevel.LOW,
    'Email temporário bloqueado',
    {
      email,
      ip,
      recommendation: 'Monitorar se há múltiplas tentativas'
    }
  );

  logAudit(EventTypes.TEMP_EMAIL_BLOCKED, { email, ip });
};

/**
 * Alerta de senha fraca bloqueada
 */
const alertWeakPasswordBlocked = (username, ip) => {
  sendSecurityAlert(
    AlertLevel.LOW,
    'Senha fraca bloqueada',
    {
      username,
      ip,
      recommendation: 'Normal - usuário precisa criar senha forte'
    }
  );

  logAudit(EventTypes.WEAK_PASSWORD_BLOCKED, { username, ip });
};

/**
 * Alerta de rate limit excedido
 */
const alertRateLimitExceeded = (req, endpoint) => {
  sendSecurityAlert(
    AlertLevel.MEDIUM,
    'Rate limit excedido',
    {
      ip: req.realIp || req.ip,
      endpoint,
      userAgent: req.headers['user-agent'],
      recommendation: 'Possível ataque automatizado - monitorar'
    }
  );

  logAudit(EventTypes.RATE_LIMIT_EXCEEDED, { endpoint }, req);
};

/**
 * Alerta de múltiplos IPs para mesma conta
 */
const alertMultipleIps = (userId, username, ips) => {
  sendSecurityAlert(
    AlertLevel.MEDIUM,
    'Conta acessada de múltiplos IPs',
    {
      userId,
      username,
      ipCount: ips.length,
      ips: ips.slice(0, 10), // Primeiros 10 IPs
      recommendation: 'Possível compartilhamento de conta ou conta comprometida'
    }
  );

  logAudit(EventTypes.MULTIPLE_IPS, { userId, username, ips });
};

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE DE DETECÇÃO
// ═══════════════════════════════════════════════════════════════

/**
 * Detectar padrões suspeitos em inputs
 */
const detectSuspiciousPatterns = (req, res, next) => {
  try {
    // Verificar SQL Injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|#|\/\*|\*\/)/,
      /('|";|xp_|sp_)/i
    ];

    // Verificar XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];

    // Verificar body
    const checkObject = (obj, path = '') => {
      for (const key in obj) {
        const value = obj[key];
        const fullPath = path ? `${path}.${key}` : key;

        if (typeof value === 'string') {
          // Verificar SQL Injection
          sqlPatterns.forEach(pattern => {
            if (pattern.test(value)) {
              alertSqlInjectionAttempt(req, value);
            }
          });

          // Verificar XSS
          xssPatterns.forEach(pattern => {
            if (pattern.test(value)) {
              alertXssAttempt(req, fullPath, value);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          checkObject(value, fullPath);
        }
      }
    };

    if (req.body && typeof req.body === 'object') {
      checkObject(req.body);
    }

    next();

  } catch (error) {
    console.error('❌ Erro na detecção de padrões suspeitos:', error);
    next(); // Não bloquear em caso de erro
  }
};

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES DE CONSULTA
// ═══════════════════════════════════════════════════════════════

/**
 * Buscar alertas recentes
 */
const getRecentAlerts = (days = 7, level = null) => {
  try {
    const alerts = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const alertFile = path.join(ALERTS_DIR, `${dateStr}.json`);

      if (fs.existsSync(alertFile)) {
        const content = fs.readFileSync(alertFile, 'utf-8');
        try {
          const dayAlerts = JSON.parse(content);
          alerts.push(...dayAlerts);
        } catch (e) {
          // Ignorar arquivos malformados
        }
      }
    }

    // Filtrar por nível se especificado
    let filtered = alerts;
    if (level) {
      filtered = alerts.filter(alert => alert.level === level);
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  } catch (error) {
    console.error('❌ Erro ao buscar alertas:', error);
    return [];
  }
};

/**
 * Contar alertas por nível
 */
const countAlertsByLevel = (days = 7) => {
  const alerts = getRecentAlerts(days);
  
  const counts = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
    TOTAL: alerts.length
  };

  alerts.forEach(alert => {
    if (counts.hasOwnProperty(alert.level)) {
      counts[alert.level]++;
    }
  });

  return counts;
};

// ═══════════════════════════════════════════════════════════════
// EXPORTAR
// ═══════════════════════════════════════════════════════════════

module.exports = {
  AlertLevel,
  sendSecurityAlert,
  
  // Alertas específicos
  alertMultipleLoginFails,
  alertNewIpAccess,
  alertSqlInjectionAttempt,
  alertXssAttempt,
  alertUnauthorizedAccess,
  alertTempEmailBlocked,
  alertWeakPasswordBlocked,
  alertRateLimitExceeded,
  alertMultipleIps,
  
  // Middleware
  detectSuspiciousPatterns,
  
  // Consultas
  getRecentAlerts,
  countAlertsByLevel
};
