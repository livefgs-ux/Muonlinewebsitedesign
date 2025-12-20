/**
 * 📋 AdminCP - Logs & Roadmap Routes
 * Sistema de logs e histórico de ações
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');

/**
 * GET /api/admin/logs
 * Lista todos os logs com filtros
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      action, 
      adminUser, 
      startDate, 
      endDate 
    } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        id,
        admin_user as adminUser,
        action,
        details,
        ip_address as ipAddress,
        user_agent as userAgent,
        created_at as createdAt
      FROM webmu_logs
      WHERE 1=1
    `;
    
    const params = [];

    if (action) {
      query += ` AND action = ?`;
      params.push(action);
    }

    if (adminUser) {
      query += ` AND admin_user = ?`;
      params.push(adminUser);
    }

    if (startDate) {
      query += ` AND created_at >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND created_at <= ?`;
      params.push(endDate);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [logs] = await db.query(query, params);

    // Total count
    let countQuery = 'SELECT COUNT(*) as total FROM webmu_logs WHERE 1=1';
    const countParams = [];
    
    if (action) {
      countQuery += ` AND action = ?`;
      countParams.push(action);
    }
    
    if (adminUser) {
      countQuery += ` AND admin_user = ?`;
      countParams.push(adminUser);
    }

    if (startDate) {
      countQuery += ` AND created_at >= ?`;
      countParams.push(startDate);
    }

    if (endDate) {
      countQuery += ` AND created_at <= ?`;
      countParams.push(endDate);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar logs',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/logs/:id
 * Detalhes de um log específico
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [logs] = await db.query(`
      SELECT 
        id,
        admin_user as adminUser,
        action,
        details,
        ip_address as ipAddress,
        user_agent as userAgent,
        created_at as createdAt
      FROM webmu_logs
      WHERE id = ?
    `, [id]);

    if (logs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Log não encontrado'
      });
    }

    res.json({
      success: true,
      data: logs[0]
    });

  } catch (error) {
    console.error('Error fetching log details:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar detalhes do log',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/logs/actions/list
 * Lista todas as ações únicas registradas
 */
router.get('/actions/list', async (req, res) => {
  try {
    const [actions] = await db.query(`
      SELECT DISTINCT action, COUNT(*) as count
      FROM webmu_logs
      GROUP BY action
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: actions
    });

  } catch (error) {
    console.error('Error fetching actions:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar ações',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/logs/admins/list
 * Lista todos os admins que têm logs
 */
router.get('/admins/list', async (req, res) => {
  try {
    const [admins] = await db.query(`
      SELECT DISTINCT admin_user as adminUser, COUNT(*) as count
      FROM webmu_logs
      GROUP BY admin_user
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: admins
    });

  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar administradores',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/logs/stats
 * Estatísticas dos logs
 */
router.get('/stats/overview', async (req, res) => {
  try {
    // Total logs
    const [totalResult] = await db.query(`
      SELECT COUNT(*) as total FROM webmu_logs
    `);

    // Logs today
    const [todayResult] = await db.query(`
      SELECT COUNT(*) as today 
      FROM webmu_logs 
      WHERE DATE(created_at) = CURDATE()
    `);

    // Logs this week
    const [weekResult] = await db.query(`
      SELECT COUNT(*) as week 
      FROM webmu_logs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    // Most common actions
    const [topActions] = await db.query(`
      SELECT action, COUNT(*) as count
      FROM webmu_logs
      GROUP BY action
      ORDER BY count DESC
      LIMIT 10
    `);

    // Most active admins
    const [topAdmins] = await db.query(`
      SELECT admin_user as adminUser, COUNT(*) as count
      FROM webmu_logs
      GROUP BY admin_user
      ORDER BY count DESC
      LIMIT 10
    `);

    // Activity by day (last 7 days)
    const [activityByDay] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM webmu_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      data: {
        total: totalResult[0].total,
        today: todayResult[0].today,
        week: weekResult[0].week,
        topActions: topActions,
        topAdmins: topAdmins,
        activityByDay: activityByDay
      }
    });

  } catch (error) {
    console.error('Error fetching log stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas dos logs',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/logs/export
 * Exportar logs para JSON ou TXT
 */
router.post('/export', async (req, res) => {
  try {
    const { format = 'json', filters = {} } = req.body;

    let query = `
      SELECT 
        id,
        admin_user as adminUser,
        action,
        details,
        ip_address as ipAddress,
        user_agent as userAgent,
        created_at as createdAt
      FROM webmu_logs
      WHERE 1=1
    `;
    
    const params = [];

    if (filters.action) {
      query += ` AND action = ?`;
      params.push(filters.action);
    }

    if (filters.adminUser) {
      query += ` AND admin_user = ?`;
      params.push(filters.adminUser);
    }

    if (filters.startDate) {
      query += ` AND created_at >= ?`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ` AND created_at <= ?`;
      params.push(filters.endDate);
    }

    query += ` ORDER BY created_at DESC LIMIT 10000`; // Safety limit

    const [logs] = await db.query(query, params);

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="logs.json"');
      res.send(JSON.stringify(logs, null, 2));
    } else if (format === 'txt') {
      const txtContent = logs.map(log => {
        return `[${log.createdAt}] ${log.adminUser} - ${log.action}\n` +
               `Details: ${log.details}\n` +
               `IP: ${log.ipAddress || 'N/A'}\n` +
               `---\n`;
      }).join('\n');

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="logs.txt"');
      res.send(txtContent);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Formato inválido. Use "json" ou "txt"'
      });
    }

    // Log the export action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'logs_export', ?, NOW())
    `, [req.user.username, JSON.stringify({ format, filtersApplied: filters })]);

  } catch (error) {
    console.error('Error exporting logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao exportar logs',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/logs/cleanup
 * Limpar logs antigos
 */
router.delete('/cleanup', async (req, res) => {
  try {
    const { days = 30 } = req.body;

    const [result] = await db.query(`
      DELETE FROM webmu_logs 
      WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [days]);

    // Log the cleanup action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'logs_cleanup', ?, NOW())
    `, [req.user.username, JSON.stringify({ daysOld: days, deletedCount: result.affectedRows })]);

    res.json({
      success: true,
      message: `${result.affectedRows} logs deletados com sucesso`,
      data: { deletedCount: result.affectedRows }
    });

  } catch (error) {
    console.error('Error cleaning up logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao limpar logs',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/logs/roadmap
 * Roadmap de desenvolvimento (changelog)
 */
router.get('/roadmap/list', async (req, res) => {
  try {
    const [roadmap] = await db.query(`
      SELECT 
        id,
        version,
        title,
        description,
        status,
        release_date as releaseDate,
        created_at as createdAt
      FROM webmu_roadmap
      ORDER BY release_date DESC, created_at DESC
    `);

    res.json({
      success: true,
      data: roadmap
    });

  } catch (error) {
    console.error('Error fetching roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar roadmap',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/logs/roadmap
 * Adicionar item ao roadmap
 */
router.post('/roadmap', async (req, res) => {
  try {
    const { version, title, description, status = 'planned', releaseDate } = req.body;

    if (!version || !title) {
      return res.status(400).json({
        success: false,
        message: 'Versão e título são obrigatórios'
      });
    }

    const [result] = await db.query(`
      INSERT INTO webmu_roadmap (version, title, description, status, release_date, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [version, title, description || '', status, releaseDate || null]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'roadmap_create', ?, NOW())
    `, [req.user.username, JSON.stringify({ version, title })]);

    res.json({
      success: true,
      message: 'Item adicionado ao roadmap com sucesso',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Error creating roadmap item:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar item ao roadmap',
      error: error.message
    });
  }
});

module.exports = router;
