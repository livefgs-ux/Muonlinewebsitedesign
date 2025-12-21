/**
 * ADMIN LOGS CONTROLLER
 * Sistema completo de auditoria de ações administrativas
 * Registra todas as ações realizadas no AdminCP
 */

const db = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

// Diretório de logs
const LOG_DIR = path.join(__dirname, '../../logs');
const ADMIN_LOG_FILE = path.join(LOG_DIR, 'admin-actions.log');
const SECURITY_LOG_FILE = path.join(LOG_DIR, 'security.log');
const AUDIT_LOG_FILE = path.join(LOG_DIR, 'audit.log');

/**
 * Garantir que o diretório de logs existe
 */
async function ensureLogDirectory() {
  try {
    await fs.access(LOG_DIR);
  } catch {
    await fs.mkdir(LOG_DIR, { recursive: true });
  }
}

/**
 * Registrar ação administrativa (banco + arquivo)
 */
const logAdminAction = async (req, res) => {
  try {
    const {
      admin_account,
      admin_email,
      action_type,
      action_category = 'GENERAL',
      description,
      target_table,
      target_id,
      old_value,
      new_value,
      severity = 'MEDIUM',
      status = 'SUCCESS'
    } = req.body;

    // Validações
    if (!admin_account || !action_type || !description) {
      return res.status(400).json({
        success: false,
        error: 'Admin account, action type e description são obrigatórios'
      });
    }

    // Obter informações do request
    const ip_address = req.ip || req.connection.remoteAddress || '0.0.0.0';
    const user_agent = req.headers['user-agent'] || 'Unknown';
    const session_id = req.headers['x-session-id'] || null;

    // Registrar no banco de dados
    const [result] = await db.query(`
      INSERT INTO AdminLogs (
        admin_account, 
        admin_email,
        action_type, 
        action_category,
        description, 
        target_table,
        target_id,
        old_value,
        new_value,
        ip_address,
        user_agent,
        session_id,
        severity,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      admin_account,
      admin_email,
      action_type,
      action_category,
      description,
      target_table,
      target_id,
      old_value ? JSON.stringify(old_value) : null,
      new_value ? JSON.stringify(new_value) : null,
      ip_address,
      user_agent,
      session_id,
      severity,
      status
    ]);

    // Registrar em arquivo de log
    await ensureLogDirectory();
    const logEntry = `[${new Date().toISOString()}] ${admin_account}@${ip_address} — ${action_type} (${action_category}): ${description}\n`;
    
    // Escolher arquivo baseado na categoria
    let logFile = ADMIN_LOG_FILE;
    if (action_category === 'SECURITY' || severity === 'CRITICAL') {
      logFile = SECURITY_LOG_FILE;
    }
    
    await fs.appendFile(logFile, logEntry);
    
    // Log de auditoria completo (todos os dados)
    const auditEntry = {
      timestamp: new Date().toISOString(),
      admin: admin_account,
      ip: ip_address,
      action: action_type,
      category: action_category,
      description,
      severity,
      status,
      target: target_table ? `${target_table}:${target_id}` : null
    };
    await fs.appendFile(AUDIT_LOG_FILE, JSON.stringify(auditEntry) + '\n');

    res.json({
      success: true,
      data: {
        id: result.insertId,
        message: 'Ação registrada com sucesso'
      }
    });
  } catch (error) {
    console.error('Erro ao registrar log administrativo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao registrar ação administrativa'
    });
  }
};

/**
 * Listar logs com filtros e paginação
 */
const getAdminLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      admin_account,
      action_type,
      action_category,
      severity,
      start_date,
      end_date,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Construir query dinamicamente
    let whereConditions = [];
    let params = [];

    if (admin_account) {
      whereConditions.push('admin_account = ?');
      params.push(admin_account);
    }

    if (action_type) {
      whereConditions.push('action_type = ?');
      params.push(action_type);
    }

    if (action_category) {
      whereConditions.push('action_category = ?');
      params.push(action_category);
    }

    if (severity) {
      whereConditions.push('severity = ?');
      params.push(severity);
    }

    if (start_date) {
      whereConditions.push('created_at >= ?');
      params.push(start_date);
    }

    if (end_date) {
      whereConditions.push('created_at <= ?');
      params.push(end_date);
    }

    if (search) {
      whereConditions.push('(description LIKE ? OR admin_account LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ') 
      : '';

    // Query principal
    const [logs] = await db.query(`
      SELECT 
        id,
        admin_account,
        admin_email,
        action_type,
        action_category,
        description,
        target_table,
        target_id,
        ip_address,
        severity,
        status,
        created_at
      FROM AdminLogs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    // Contar total
    const [countResult] = await db.query(`
      SELECT COUNT(*) as total FROM AdminLogs ${whereClause}
    `, params);

    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar logs administrativos'
    });
  }
};

/**
 * Obter estatísticas de logs
 */
const getLogStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    // Total de ações por tipo
    const [actionTypes] = await db.query(`
      SELECT action_type, COUNT(*) as count
      FROM AdminLogs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY action_type
      ORDER BY count DESC
    `, [days]);

    // Total por categoria
    const [categories] = await db.query(`
      SELECT action_category, COUNT(*) as count
      FROM AdminLogs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY action_category
      ORDER BY count DESC
    `, [days]);

    // Total por severidade
    const [severities] = await db.query(`
      SELECT severity, COUNT(*) as count
      FROM AdminLogs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY severity
      ORDER BY FIELD(severity, 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW')
    `, [days]);

    // Admins mais ativos
    const [topAdmins] = await db.query(`
      SELECT admin_account, COUNT(*) as actions
      FROM AdminLogs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY admin_account
      ORDER BY actions DESC
      LIMIT 10
    `, [days]);

    // Ações críticas recentes
    const [criticalActions] = await db.query(`
      SELECT *
      FROM AdminLogs
      WHERE severity = 'CRITICAL'
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY created_at DESC
      LIMIT 10
    `, [days]);

    res.json({
      success: true,
      data: {
        period_days: days,
        action_types: actionTypes,
        categories,
        severities,
        top_admins: topAdmins,
        recent_critical: criticalActions
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas de logs'
    });
  }
};

/**
 * Exportar logs para CSV
 */
const exportLogsToCSV = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let whereClause = '';
    let params = [];

    if (start_date && end_date) {
      whereClause = 'WHERE created_at BETWEEN ? AND ?';
      params = [start_date, end_date];
    }

    const [logs] = await db.query(`
      SELECT * FROM AdminLogs ${whereClause} ORDER BY created_at DESC
    `, params);

    // Gerar CSV
    const headers = ['ID', 'Admin', 'Action', 'Category', 'Description', 'IP', 'Severity', 'Date'];
    const rows = logs.map(log => [
      log.id,
      log.admin_account,
      log.action_type,
      log.action_category,
      log.description.replace(/"/g, '""'), // Escape quotes
      log.ip_address,
      log.severity,
      new Date(log.created_at).toISOString()
    ]);

    let csv = headers.join(',') + '\n';
    csv += rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=admin-logs-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Erro ao exportar logs:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao exportar logs'
    });
  }
};

/**
 * Limpar logs antigos (apenas Super Admin)
 */
const cleanOldLogs = async (req, res) => {
  try {
    const { days = 90, admin_level } = req.body;

    // Apenas Super Admin pode limpar logs
    if (admin_level !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Apenas Super Admins podem limpar logs'
      });
    }

    const [result] = await db.query(`
      DELETE FROM AdminLogs 
      WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
        AND severity NOT IN ('CRITICAL', 'HIGH')
    `, [days]);

    res.json({
      success: true,
      data: {
        deleted: result.affectedRows,
        message: `${result.affectedRows} logs antigos foram removidos`
      }
    });
  } catch (error) {
    console.error('Erro ao limpar logs:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao limpar logs antigos'
    });
  }
};

module.exports = {
  logAdminAction,
  getAdminLogs,
  getLogStats,
  exportLogsToCSV,
  cleanOldLogs
};
