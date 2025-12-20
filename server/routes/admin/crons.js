/**
 * ⏰ AdminCP - Cron Manager Routes
 * Gerenciamento de tarefas agendadas
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');

/**
 * GET /api/admin/crons
 * Lista todos os cron jobs
 */
router.get('/', async (req, res) => {
  try {
    const [crons] = await db.query(`
      SELECT 
        id,
        name,
        slug,
        description,
        interval_minutes as intervalMinutes,
        status,
        last_run as lastRun,
        next_run as nextRun,
        average_duration as averageDuration,
        total_executions as totalExecutions,
        failed_executions as failedExecutions,
        created_at as createdAt,
        updated_at as updatedAt
      FROM webmu_crons
      ORDER BY name ASC
    `);

    res.json({
      success: true,
      data: crons
    });

  } catch (error) {
    console.error('Error fetching crons:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar cron jobs',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/crons/:id
 * Detalhes de um cron job específico
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [crons] = await db.query(`
      SELECT 
        id,
        name,
        slug,
        description,
        interval_minutes as intervalMinutes,
        status,
        last_run as lastRun,
        next_run as nextRun,
        average_duration as averageDuration,
        total_executions as totalExecutions,
        failed_executions as failedExecutions,
        last_error as lastError,
        created_at as createdAt,
        updated_at as updatedAt
      FROM webmu_crons
      WHERE id = ?
    `, [id]);

    if (crons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cron job não encontrado'
      });
    }

    // Get execution history
    const [history] = await db.query(`
      SELECT 
        id,
        status,
        duration,
        error_message as errorMessage,
        executed_at as executedAt
      FROM webmu_cron_executions
      WHERE cron_id = ?
      ORDER BY executed_at DESC
      LIMIT 50
    `, [id]);

    res.json({
      success: true,
      data: {
        cron: crons[0],
        history: history
      }
    });

  } catch (error) {
    console.error('Error fetching cron details:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar detalhes do cron job',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/crons/:id/execute
 * Executar cron job manualmente
 */
router.post('/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;

    // Get cron details
    const [crons] = await db.query(`
      SELECT slug, name FROM webmu_crons WHERE id = ?
    `, [id]);

    if (crons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cron job não encontrado'
      });
    }

    const cron = crons[0];
    const startTime = Date.now();

    try {
      // Execute the cron job based on slug
      await executeCronJob(cron.slug);
      
      const duration = Date.now() - startTime;

      // Update cron job stats
      await db.query(`
        UPDATE webmu_crons
        SET 
          last_run = NOW(),
          total_executions = total_executions + 1,
          average_duration = (average_duration * total_executions + ?) / (total_executions + 1)
        WHERE id = ?
      `, [duration, id]);

      // Log execution
      await db.query(`
        INSERT INTO webmu_cron_executions (cron_id, status, duration, executed_at)
        VALUES (?, 'success', ?, NOW())
      `, [id, duration]);

      // Log the action
      await db.query(`
        INSERT INTO webmu_logs (admin_user, action, details, created_at)
        VALUES (?, 'cron_manual_execute', ?, NOW())
      `, [req.user.username, JSON.stringify({ cronId: id, cronName: cron.name, duration })]);

      res.json({
        success: true,
        message: 'Cron job executado com sucesso',
        data: { duration }
      });

    } catch (execError) {
      const duration = Date.now() - startTime;

      // Update failed execution count
      await db.query(`
        UPDATE webmu_crons
        SET 
          failed_executions = failed_executions + 1,
          last_error = ?
        WHERE id = ?
      `, [execError.message, id]);

      // Log failed execution
      await db.query(`
        INSERT INTO webmu_cron_executions (cron_id, status, duration, error_message, executed_at)
        VALUES (?, 'failed', ?, ?, NOW())
      `, [id, duration, execError.message]);

      throw execError;
    }

  } catch (error) {
    console.error('Error executing cron:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar cron job',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/crons/:id/toggle
 * Ativar/Pausar cron job
 */
router.post('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    // Get current status
    const [crons] = await db.query(`
      SELECT status, name FROM webmu_crons WHERE id = ?
    `, [id]);

    if (crons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cron job não encontrado'
      });
    }

    const newStatus = crons[0].status === 'active' ? 'paused' : 'active';

    await db.query(`
      UPDATE webmu_crons
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `, [newStatus, id]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'cron_toggle', ?, NOW())
    `, [req.user.username, JSON.stringify({ cronId: id, cronName: crons[0].name, newStatus })]);

    res.json({
      success: true,
      message: `Cron job ${newStatus === 'active' ? 'ativado' : 'pausado'} com sucesso`,
      data: { status: newStatus }
    });

  } catch (error) {
    console.error('Error toggling cron:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao alternar status do cron job',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/crons/:id
 * Atualizar configuração do cron job
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { intervalMinutes, description } = req.body;

    const updates = [];
    const params = [];

    if (intervalMinutes !== undefined) {
      updates.push('interval_minutes = ?');
      params.push(intervalMinutes);
    }

    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma atualização fornecida'
      });
    }

    updates.push('updated_at = NOW()');
    params.push(id);

    await db.query(`
      UPDATE webmu_crons
      SET ${updates.join(', ')}
      WHERE id = ?
    `, params);

    // Recalculate next run if interval changed
    if (intervalMinutes !== undefined) {
      await db.query(`
        UPDATE webmu_crons
        SET next_run = DATE_ADD(NOW(), INTERVAL ? MINUTE)
        WHERE id = ?
      `, [intervalMinutes, id]);
    }

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'cron_update', ?, NOW())
    `, [req.user.username, JSON.stringify({ cronId: id, updates: req.body })]);

    res.json({
      success: true,
      message: 'Cron job atualizado com sucesso'
    });

  } catch (error) {
    console.error('Error updating cron:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar cron job',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/crons/:id/history
 * Histórico de execuções de um cron job
 */
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const [history] = await db.query(`
      SELECT 
        id,
        status,
        duration,
        error_message as errorMessage,
        executed_at as executedAt
      FROM webmu_cron_executions
      WHERE cron_id = ?
      ORDER BY executed_at DESC
      LIMIT ? OFFSET ?
    `, [id, parseInt(limit), parseInt(offset)]);

    // Total count
    const [countResult] = await db.query(`
      SELECT COUNT(*) as total FROM webmu_cron_executions WHERE cron_id = ?
    `, [id]);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: history,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching cron history:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico do cron job',
      error: error.message
    });
  }
});

/**
 * Helper function to execute cron jobs
 */
async function executeCronJob(slug) {
  switch (slug) {
    case 'rank_update':
      // Update rankings
      await db.query(`
        UPDATE Character 
        SET ranking = (
          SELECT COUNT(*) + 1
          FROM Character c2
          WHERE c2.cLevel > Character.cLevel 
            OR (c2.cLevel = Character.cLevel AND c2.Resets > Character.Resets)
        )
      `);
      break;

    case 'event_status':
      // Sync Castle Siege status
      // This would sync with MuCastleData table
      break;

    case 'log_cleanup':
      // Delete old logs (older than 30 days)
      await db.query(`
        DELETE FROM webmu_logs 
        WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);
      break;

    case 'backup_sync':
      // Backup webmu database
      // This would trigger a backup process
      break;

    default:
      throw new Error(`Unknown cron job: ${slug}`);
  }
}

module.exports = router;
