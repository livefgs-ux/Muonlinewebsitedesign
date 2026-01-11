/**
 * IP BLOCKING MIDDLEWARE
 * ✅ BASEADO NO WEBENGINE: IP Blocking System
 * Sistema de bloqueio de IPs para segurança web
 * V.631
 */

const { executeQueryWeb } = require('../config/database');
const { errorResponse } = require('../utils/helpers');

/**
 * Lista de IPs bloqueados (cache em memória)
 * Formato: { 'IP': { reason: 'motivo', blockedBy: 'admin', blockedAt: Date } }
 */
let blockedIPsCache = {};
let cacheLastUpdate = null;
const CACHE_TTL = 60000; // 1 minuto

/**
 * Carregar IPs bloqueados do banco
 */
async function loadBlockedIPs() {
  try {
    // Verificar se precisa atualizar cache
    const now = Date.now();
    if (cacheLastUpdate && (now - cacheLastUpdate) < CACHE_TTL) {
      return blockedIPsCache;
    }

    const sql = `
      SELECT 
        ip_address,
        reason,
        blocked_by,
        blocked_at,
        expires_at
      FROM blocked_ips
      WHERE status = 'active'
        AND (expires_at IS NULL OR expires_at > NOW())
    `;

    const result = await executeQueryWeb(sql);

    if (result.success && result.data) {
      // Atualizar cache
      blockedIPsCache = {};
      result.data.forEach(row => {
        blockedIPsCache[row.ip_address] = {
          reason: row.reason,
          blockedBy: row.blocked_by,
          blockedAt: row.blocked_at,
          expiresAt: row.expires_at
        };
      });

      cacheLastUpdate = now;
      console.log(`✅ Cache de IPs bloqueados atualizado: ${result.data.length} IPs`);
    }

    return blockedIPsCache;
  } catch (error) {
    console.error('❌ Erro ao carregar IPs bloqueados:', error);
    return blockedIPsCache; // Retornar cache antigo em caso de erro
  }
}

/**
 * Middleware de bloqueio de IP
 */
const ipBlockingMiddleware = async (req, res, next) => {
  try {
    // Obter IP real do cliente
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                     req.headers['x-real-ip'] ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress ||
                     req.ip;

    // Normalizar IP (remover ::ffff: do IPv6)
    const normalizedIP = clientIP.replace(/^::ffff:/, '');

    // Carregar lista de IPs bloqueados
    const blockedIPs = await loadBlockedIPs();

    // Verificar se IP está bloqueado
    if (blockedIPs[normalizedIP]) {
      const blockInfo = blockedIPs[normalizedIP];
      
      console.log(`\n🚫 ========================================`);
      console.log(`🚫 IP BLOQUEADO TENTOU ACESSAR`);
      console.log(`🚫 ========================================`);
      console.log(`🚫 IP: ${normalizedIP}`);
      console.log(`🚫 Motivo: ${blockInfo.reason}`);
      console.log(`🚫 Bloqueado por: ${blockInfo.blockedBy}`);
      console.log(`🚫 Bloqueado em: ${blockInfo.blockedAt}`);
      console.log(`🚫 Rota tentada: ${req.method} ${req.originalUrl}`);
      console.log(`🚫 ========================================\n`);

      // Log da tentativa de acesso (opcional)
      try {
        const logSQL = `
          INSERT INTO blocked_ip_attempts (ip_address, attempted_url, attempted_at)
          VALUES (?, ?, NOW())
        `;
        await executeQueryWeb(logSQL, [normalizedIP, req.originalUrl]);
      } catch (err) {
        console.error('⚠️ Erro ao registrar tentativa de acesso bloqueado:', err.message);
      }

      // Retornar erro 403 Forbidden
      return res.status(403).json({
        success: false,
        error: 'Access Denied',
        message: 'Your IP address has been blocked. Contact support if you believe this is an error.',
        code: 'IP_BLOCKED'
      });
    }

    // IP não está bloqueado, continuar
    next();
  } catch (error) {
    console.error('❌ Erro no middleware de IP blocking:', error);
    // Em caso de erro, permitir acesso (fail-open) para não derrubar o sistema
    next();
  }
};

/**
 * Verificar se um IP está bloqueado (usado em controllers)
 */
async function isIPBlocked(ip) {
  const normalizedIP = ip.replace(/^::ffff:/, '');
  const blockedIPs = await loadBlockedIPs();
  return !!blockedIPs[normalizedIP];
}

/**
 * Bloquear um IP (AdminCP)
 */
async function blockIP(ip, reason, blockedBy, expiresAt = null) {
  try {
    const normalizedIP = ip.replace(/^::ffff:/, '');

    // Verificar se IP já está bloqueado
    const checkSQL = `
      SELECT id FROM blocked_ips 
      WHERE ip_address = ? AND status = 'active'
    `;
    const checkResult = await executeQueryWeb(checkSQL, [normalizedIP]);

    if (checkResult.success && checkResult.data && checkResult.data.length > 0) {
      return {
        success: false,
        message: 'IP já está bloqueado'
      };
    }

    // Inserir IP bloqueado
    const insertSQL = `
      INSERT INTO blocked_ips (ip_address, reason, blocked_by, blocked_at, expires_at, status)
      VALUES (?, ?, ?, NOW(), ?, 'active')
    `;
    const insertResult = await executeQueryWeb(insertSQL, [normalizedIP, reason, blockedBy, expiresAt]);

    if (insertResult.success) {
      // Invalidar cache
      cacheLastUpdate = null;
      await loadBlockedIPs();

      console.log(`✅ IP bloqueado: ${normalizedIP} por ${blockedBy}`);
      return {
        success: true,
        message: 'IP bloqueado com sucesso',
        ip: normalizedIP
      };
    } else {
      throw new Error('Erro ao inserir IP bloqueado');
    }
  } catch (error) {
    console.error('❌ Erro ao bloquear IP:', error);
    return {
      success: false,
      message: 'Erro ao bloquear IP',
      error: error.message
    };
  }
}

/**
 * Desbloquear um IP (AdminCP)
 */
async function unblockIP(ip, unblockedBy) {
  try {
    const normalizedIP = ip.replace(/^::ffff:/, '');

    const updateSQL = `
      UPDATE blocked_ips
      SET status = 'inactive', unblocked_by = ?, unblocked_at = NOW()
      WHERE ip_address = ? AND status = 'active'
    `;
    const updateResult = await executeQueryWeb(updateSQL, [unblockedBy, normalizedIP]);

    if (updateResult.success) {
      // Invalidar cache
      cacheLastUpdate = null;
      await loadBlockedIPs();

      console.log(`✅ IP desbloqueado: ${normalizedIP} por ${unblockedBy}`);
      return {
        success: true,
        message: 'IP desbloqueado com sucesso',
        ip: normalizedIP
      };
    } else {
      throw new Error('Erro ao desbloquear IP');
    }
  } catch (error) {
    console.error('❌ Erro ao desbloquear IP:', error);
    return {
      success: false,
      message: 'Erro ao desbloquear IP',
      error: error.message
    };
  }
}

/**
 * Listar IPs bloqueados (AdminCP)
 */
async function listBlockedIPs(page = 1, limit = 50, status = 'active') {
  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let sql = `
      SELECT 
        id,
        ip_address,
        reason,
        blocked_by,
        blocked_at,
        expires_at,
        status,
        unblocked_by,
        unblocked_at
      FROM blocked_ips
    `;

    const params = [];

    if (status !== 'all') {
      sql += ` WHERE status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY blocked_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const result = await executeQueryWeb(sql, params);

    if (!result.success) {
      throw new Error('Erro ao buscar IPs bloqueados');
    }

    // Contar total
    let countSQL = `SELECT COUNT(*) as total FROM blocked_ips`;
    if (status !== 'all') {
      countSQL += ` WHERE status = ?`;
    }
    const countParams = status !== 'all' ? [status] : [];
    const countResult = await executeQueryWeb(countSQL, countParams);
    const total = countResult.success ? countResult.data[0].total : 0;

    return {
      success: true,
      data: {
        ips: result.data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    };
  } catch (error) {
    console.error('❌ Erro ao listar IPs bloqueados:', error);
    return {
      success: false,
      message: 'Erro ao listar IPs bloqueados',
      error: error.message
    };
  }
}

/**
 * Limpar IPs expirados
 */
async function cleanExpiredIPs() {
  try {
    const sql = `
      UPDATE blocked_ips
      SET status = 'expired'
      WHERE status = 'active'
        AND expires_at IS NOT NULL
        AND expires_at <= NOW()
    `;

    const result = await executeQueryWeb(sql);

    if (result.success) {
      // Invalidar cache
      cacheLastUpdate = null;
      await loadBlockedIPs();

      console.log(`✅ IPs expirados limpos: ${result.affectedRows || 0}`);
    }
  } catch (error) {
    console.error('❌ Erro ao limpar IPs expirados:', error);
  }
}

// Limpar IPs expirados a cada 10 minutos
setInterval(cleanExpiredIPs, 600000);

module.exports = {
  ipBlockingMiddleware,
  isIPBlocked,
  blockIP,
  unblockIP,
  listBlockedIPs,
  cleanExpiredIPs,
  loadBlockedIPs
};
