/**
 * 📋 AUDIT LOG - SISTEMA DE AUDITORIA
 * Registra todas as ações sensíveis para rastreamento
 */

const fs = require('fs');
const path = require('path');
const { getRealIp } = require('./security');

// ═══════════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════════

const AUDIT_LOG_DIR = path.join(__dirname, '../../../logs/audit');
const SECURITY_LOG_DIR = path.join(__dirname, '../../../logs/security');

// Criar diretórios se não existirem
[AUDIT_LOG_DIR, SECURITY_LOG_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ═══════════════════════════════════════════════════════════════
// TIPOS DE EVENTOS
// ═══════════════════════════════════════════════════════════════

const EventTypes = {
  // Autenticação
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  REGISTER_FAILED: 'REGISTER_FAILED',
  
  // Segurança
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TEMP_EMAIL_BLOCKED: 'TEMP_EMAIL_BLOCKED',
  WEAK_PASSWORD_BLOCKED: 'WEAK_PASSWORD_BLOCKED',
  
  // Personagens
  CHARACTER_RESET: 'CHARACTER_RESET',
  CHARACTER_CREATE: 'CHARACTER_CREATE',
  CHARACTER_DELETE: 'CHARACTER_DELETE',
  
  // WCoin
  WCOIN_PURCHASE: 'WCOIN_PURCHASE',
  WCOIN_TRANSFER: 'WCOIN_TRANSFER',
  
  // Admin
  ADMIN_ACCESS: 'ADMIN_ACCESS',
  ADMIN_ACTION: 'ADMIN_ACTION',
  
  // Acesso suspeito
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  MULTIPLE_IPS: 'MULTIPLE_IPS',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS'
};

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO DE LOG
// ═══════════════════════════════════════════════════════════════

/**
 * Registrar evento de auditoria
 */
const logAudit = (eventType, data = {}, req = null) => {
  try {
    const timestamp = new Date().toISOString();
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Extrair informações da requisição
    let logData = {
      timestamp,
      eventType,
      ...data
    };

    if (req) {
      logData.ip = getRealIp(req);
      logData.userAgent = req.headers['user-agent'] || 'unknown';
      logData.origin = req.headers.origin || req.headers.referer || 'unknown';
      logData.method = req.method;
      logData.path = req.path;
      
      // Adicionar usuário se autenticado
      if (req.user) {
        logData.userId = req.user.userId;
        logData.username = req.user.username;
      }
    }

    // Formatar linha de log
    const logLine = JSON.stringify(logData) + '\n';

    // Determinar tipo de log (audit ou security)
    const isSecurityEvent = [
      EventTypes.LOGIN_FAILED,
      EventTypes.RATE_LIMIT_EXCEEDED,
      EventTypes.INVALID_TOKEN,
      EventTypes.TEMP_EMAIL_BLOCKED,
      EventTypes.WEAK_PASSWORD_BLOCKED,
      EventTypes.SUSPICIOUS_ACTIVITY,
      EventTypes.MULTIPLE_IPS,
      EventTypes.UNAUTHORIZED_ACCESS
    ].includes(eventType);

    const logDir = isSecurityEvent ? SECURITY_LOG_DIR : AUDIT_LOG_DIR;
    const logFile = path.join(logDir, `${date}.log`);

    // Escrever no arquivo (append)
    fs.appendFileSync(logFile, logLine);

    // Log no console (apenas eventos importantes)
    if (isSecurityEvent || eventType === EventTypes.LOGIN_SUCCESS) {
      const emoji = isSecurityEvent ? '🚨' : '📋';
      console.log(`${emoji} AUDIT: ${eventType} - ${logData.ip || 'N/A'} - ${logData.username || logData.userId || 'N/A'}`);
    }

  } catch (error) {
    console.error('❌ Erro ao gravar audit log:', error);
    // Não bloqueia a aplicação se log falhar
  }
};

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE DE AUDITORIA
// ═══════════════════════════════════════════════════════════════

/**
 * Middleware para logar automaticamente ações sensíveis
 */
const auditMiddleware = (eventType) => {
  return (req, res, next) => {
    // Capturar resposta original
    const originalJson = res.json.bind(res);

    // Sobrescrever res.json para capturar resultado
    res.json = function(data) {
      // Logar apenas se for sucesso
      if (data && data.success) {
        logAudit(eventType, {
          success: true,
          ...data
        }, req);
      }

      // Chamar JSON original
      return originalJson(data);
    };

    next();
  };
};

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES DE DETECÇÃO DE ATIVIDADE SUSPEITA
// ═══════════════════════════════════════════════════════════════

/**
 * Detectar múltiplos IPs para mesma conta
 */
const trackLoginIps = {};

const detectMultipleIps = (userId, ip) => {
  if (!trackLoginIps[userId]) {
    trackLoginIps[userId] = new Set();
  }

  trackLoginIps[userId].add(ip);

  // Alertar se mais de 3 IPs diferentes em 24h
  if (trackLoginIps[userId].size > 3) {
    logAudit(EventTypes.SUSPICIOUS_ACTIVITY, {
      userId,
      reason: 'Múltiplos IPs detectados',
      ipCount: trackLoginIps[userId].size,
      ips: Array.from(trackLoginIps[userId])
    });
  }
};

// Limpar cache de IPs a cada 24 horas
setInterval(() => {
  Object.keys(trackLoginIps).forEach(userId => {
    trackLoginIps[userId].clear();
  });
}, 24 * 60 * 60 * 1000);

/**
 * Detectar tentativas de força bruta
 */
const bruteForceAttempts = {};

const trackBruteForce = (identifier, type = 'login') => {
  const key = `${type}-${identifier}`;
  
  if (!bruteForceAttempts[key]) {
    bruteForceAttempts[key] = {
      count: 0,
      firstAttempt: Date.now()
    };
  }

  bruteForceAttempts[key].count++;

  // Alertar se mais de 10 tentativas em 15 minutos
  const timeDiff = Date.now() - bruteForceAttempts[key].firstAttempt;
  const fifteenMinutes = 15 * 60 * 1000;

  if (bruteForceAttempts[key].count > 10 && timeDiff < fifteenMinutes) {
    logAudit(EventTypes.SUSPICIOUS_ACTIVITY, {
      identifier,
      type,
      reason: 'Possível ataque de força bruta',
      attempts: bruteForceAttempts[key].count,
      timeWindow: `${Math.floor(timeDiff / 60000)} minutos`
    });

    return true; // Indica ataque detectado
  }

  return false;
};

// Limpar cache de brute force a cada hora
setInterval(() => {
  Object.keys(bruteForceAttempts).forEach(key => {
    delete bruteForceAttempts[key];
  });
}, 60 * 60 * 1000);

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES DE CONSULTA DE LOGS
// ═══════════════════════════════════════════════════════════════

/**
 * Buscar logs de um usuário específico
 */
const getUserAuditLogs = (userId, days = 7) => {
  try {
    const logs = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      [AUDIT_LOG_DIR, SECURITY_LOG_DIR].forEach(dir => {
        const logFile = path.join(dir, `${dateStr}.log`);
        
        if (fs.existsSync(logFile)) {
          const content = fs.readFileSync(logFile, 'utf-8');
          const lines = content.split('\n').filter(line => line.trim());
          
          lines.forEach(line => {
            try {
              const entry = JSON.parse(line);
              if (entry.userId === userId) {
                logs.push(entry);
              }
            } catch (e) {
              // Ignorar linhas malformadas
            }
          });
        }
      });
    }

    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  } catch (error) {
    console.error('❌ Erro ao buscar audit logs:', error);
    return [];
  }
};

/**
 * Buscar eventos de segurança recentes
 */
const getSecurityEvents = (hours = 24) => {
  try {
    const events = [];
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    const today = new Date().toISOString().split('T')[0];

    const logFile = path.join(SECURITY_LOG_DIR, `${today}.log`);
    
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        try {
          const entry = JSON.parse(line);
          if (new Date(entry.timestamp) >= cutoffTime) {
            events.push(entry);
          }
        } catch (e) {
          // Ignorar linhas malformadas
        }
      });
    }

    return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  } catch (error) {
    console.error('❌ Erro ao buscar security events:', error);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// EXPORTAR
// ═══════════════════════════════════════════════════════════════

module.exports = {
  EventTypes,
  logAudit,
  auditMiddleware,
  detectMultipleIps,
  trackBruteForce,
  getUserAuditLogs,
  getSecurityEvents
};
