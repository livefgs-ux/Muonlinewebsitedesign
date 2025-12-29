/**
 * BANS CONTROLLER - MEUMU ONLINE
 * Sistema completo de banimentos (AdminCP)
 */

const { poolMU, poolWEB } = require('../config/database');
const { validateRequired } = require('../utils/validators');

/**
 * Buscar bans
 * GET /api/admin/bans/search?username=xxx
 */
exports.searchBans = async (req, res, next) => {
  try {
    const { username } = req.query;

    let sql = `
      SELECT 
        account as username,
        banned,
        ban_reason,
        ban_date,
        ban_expires,
        banned_by
      FROM accounts
      WHERE banned = 1
    `;

    const params = [];

    if (username) {
      sql += ` AND account LIKE ?`;
      params.push(`%${username}%`);
    }

    sql += ` ORDER BY ban_date DESC LIMIT 50`;

    const [bans] = await poolMU.query(sql, params);

    res.json({
      success: true,
      data: bans
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar últimos bans
 * GET /api/admin/bans/latest?limit=20
 */
exports.getLatestBans = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const [bans] = await poolMU.query(`
      SELECT 
        account as username,
        email,
        ban_reason,
        ban_date,
        ban_expires,
        banned_by
      FROM accounts
      WHERE banned = 1
      ORDER BY ban_date DESC
      LIMIT ?
    `, [limit]);

    res.json({
      success: true,
      data: bans
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Banir conta
 * POST /api/admin/bans/ban
 */
exports.banAccount = async (req, res, next) => {
  try {
    const { username, reason, duration } = req.body; // duration em dias (0 = permanente)
    const bannedBy = req.user?.username || 'System';

    const validation = validateRequired({ username, reason });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Verificar se conta existe
    const [accounts] = await poolMU.query(`
      SELECT guid FROM accounts WHERE account = ?
    `, [username]);

    if (accounts.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conta não encontrada'
      });
    }

    // Calcular data de expiração
    let banExpires = null;
    if (duration && duration > 0) {
      banExpires = new Date();
      banExpires.setDate(banExpires.getDate() + duration);
    }

    // Banir conta
    const [result] = await poolMU.query(`
      UPDATE accounts
      SET 
        banned = 1,
        ban_reason = ?,
        ban_date = NOW(),
        ban_expires = ?,
        banned_by = ?
      WHERE account = ?
    `, [reason, banExpires, bannedBy, username]);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao banir conta'
      });
    }

    // Desconectar todos os personagens
    await poolMU.query(`
      UPDATE character_info
      SET online = 0
      WHERE account_id = ?
    `, [accounts[0].guid]);

    res.json({
      success: true,
      message: 'Conta banida com sucesso',
      data: {
        username,
        reason,
        duration: duration || 'Permanente',
        bannedBy
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Desbanir conta
 * POST /api/admin/bans/unban
 */
exports.unbanAccount = async (req, res, next) => {
  try {
    const { username } = req.body;

    const validation = validateRequired({ username });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const [result] = await poolMU.query(`
      UPDATE accounts
      SET 
        banned = 0,
        ban_reason = NULL,
        ban_date = NULL,
        ban_expires = NULL,
        banned_by = NULL
      WHERE account = ?
    `, [username]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conta não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Conta desbanida com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar IPs bloqueados (site)
 * GET /api/admin/bans/blocked-ips
 */
exports.getBlockedIPs = async (req, res, next) => {
  try {
    const [ips] = await poolWEB.query(`
      SELECT 
        ip_address,
        reason,
        blocked_at,
        blocked_by
      FROM blocked_ips
      ORDER BY blocked_at DESC
    `);

    res.json({
      success: true,
      data: ips
    });
  } catch (error) {
    // Se tabela não existir, retornar array vazio
    console.error('Erro ao buscar IPs bloqueados:', error);
    res.json({
      success: true,
      data: [],
      message: 'Tabela de IPs bloqueados não encontrada'
    });
  }
};

/**
 * Bloquear IP (site)
 * POST /api/admin/bans/block-ip
 */
exports.blockIP = async (req, res, next) => {
  try {
    const { ip, reason } = req.body;
    const blockedBy = req.user?.username || 'System';

    const validation = validateRequired({ ip, reason });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Criar tabela se não existir
    await poolWEB.query(`
      CREATE TABLE IF NOT EXISTS blocked_ips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) UNIQUE NOT NULL,
        reason TEXT,
        blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        blocked_by VARCHAR(50)
      )
    `);

    // Inserir IP
    const [result] = await poolWEB.query(`
      INSERT INTO blocked_ips (ip_address, reason, blocked_by)
      VALUES (?, ?, ?)
    `, [ip, reason, blockedBy]);

    res.json({
      success: true,
      message: 'IP bloqueado com sucesso',
      data: {
        ip,
        reason,
        blockedBy
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: 'IP já está bloqueado'
      });
    }
    next(error);
  }
};

/**
 * Desbloquear IP
 * DELETE /api/admin/bans/block-ip/:ip
 */
exports.unblockIP = async (req, res, next) => {
  try {
    const { ip } = req.params;

    const [result] = await poolWEB.query(`
      DELETE FROM blocked_ips WHERE ip_address = ?
    `, [ip]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'IP não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'IP desbloqueado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Estatísticas de bans
 * GET /api/admin/bans/stats
 */
exports.getBanStats = async (req, res, next) => {
  try {
    const [stats] = await poolMU.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN ban_expires IS NULL OR ban_expires > NOW() THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN ban_expires IS NOT NULL AND ban_expires <= NOW() THEN 1 ELSE 0 END) as expired,
        SUM(CASE WHEN DATE(ban_date) = CURDATE() THEN 1 ELSE 0 END) as today
      FROM accounts
      WHERE banned = 1
    `);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    next(error);
  }
};
