/**
 * CRONS CONTROLLER - MEUMU ONLINE
 * Sistema de gerenciamento de Cron Jobs (AdminCP)
 */

const { poolWEB } = require('../config/database');
const { validateRequired } = require('../utils/validators');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Listar todos os cron jobs
 * GET /api/admin/crons
 */
exports.getAllCrons = async (req, res, next) => {
  try {
    // Criar tabela se não existir
    await poolWEB.query(`
      CREATE TABLE IF NOT EXISTS cron_jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        schedule VARCHAR(100) NOT NULL,
        command TEXT NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT true,
        last_run TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(50)
      )
    `);

    const [crons] = await poolWEB.query(`
      SELECT 
        id,
        name,
        schedule,
        command,
        description,
        active,
        last_run,
        created_at,
        created_by
      FROM cron_jobs
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: crons
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Criar novo cron job
 * POST /api/admin/crons
 */
exports.createCron = async (req, res, next) => {
  try {
    const { name, schedule, command, description } = req.body;
    const createdBy = req.user?.username || 'System';

    const validation = validateRequired({ name, schedule, command });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Validar formato do schedule (cron expression básica)
    const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
    
    if (!cronRegex.test(schedule)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de schedule inválido. Use formato cron: * * * * *'
      });
    }

    // Criar tabela se não existir
    await poolWEB.query(`
      CREATE TABLE IF NOT EXISTS cron_jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        schedule VARCHAR(100) NOT NULL,
        command TEXT NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT true,
        last_run TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(50)
      )
    `);

    const [result] = await poolWEB.query(`
      INSERT INTO cron_jobs (name, schedule, command, description, active, created_by)
      VALUES (?, ?, ?, ?, true, ?)
    `, [name, schedule, command, description || null, createdBy]);

    res.json({
      success: true,
      message: 'Cron job criado com sucesso',
      data: {
        id: result.insertId,
        name,
        schedule,
        command,
        description,
        active: true,
        createdBy
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Executar cron job manualmente
 * POST /api/admin/crons/:id/execute
 */
exports.executeCron = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar cron job
    const [crons] = await poolWEB.query(`
      SELECT * FROM cron_jobs WHERE id = ?
    `, [id]);

    if (crons.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cron job não encontrado'
      });
    }

    const cron = crons[0];

    // Executar comando (com timeout de 30 segundos)
    try {
      const { stdout, stderr } = await execPromise(cron.command, {
        timeout: 30000,
        cwd: process.cwd()
      });

      // Atualizar last_run
      await poolWEB.query(`
        UPDATE cron_jobs
        SET last_run = NOW()
        WHERE id = ?
      `, [id]);

      res.json({
        success: true,
        message: 'Cron job executado com sucesso',
        data: {
          stdout: stdout || 'Sem saída',
          stderr: stderr || 'Sem erros'
        }
      });
    } catch (execError) {
      // Ainda atualizar last_run mesmo com erro
      await poolWEB.query(`
        UPDATE cron_jobs
        SET last_run = NOW()
        WHERE id = ?
      `, [id]);

      return res.status(500).json({
        success: false,
        error: 'Erro ao executar comando',
        details: execError.message
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Deletar cron job
 * DELETE /api/admin/crons/:id
 */
exports.deleteCron = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await poolWEB.query(`
      DELETE FROM cron_jobs WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cron job não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Cron job deletado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ativar/desativar cron job
 * PATCH /api/admin/crons/:id/toggle
 */
exports.toggleCron = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    if (typeof active !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Campo "active" deve ser boolean'
      });
    }

    const [result] = await poolWEB.query(`
      UPDATE cron_jobs
      SET active = ?
      WHERE id = ?
    `, [active, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cron job não encontrado'
      });
    }

    res.json({
      success: true,
      message: `Cron job ${active ? 'ativado' : 'desativado'} com sucesso`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obter detalhes de um cron job
 * GET /api/admin/crons/:id
 */
exports.getCronById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [crons] = await poolWEB.query(`
      SELECT * FROM cron_jobs WHERE id = ?
    `, [id]);

    if (crons.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cron job não encontrado'
      });
    }

    res.json({
      success: true,
      data: crons[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualizar cron job
 * PUT /api/admin/crons/:id
 */
exports.updateCron = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, schedule, command, description } = req.body;

    const validation = validateRequired({ name, schedule, command });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const [result] = await poolWEB.query(`
      UPDATE cron_jobs
      SET 
        name = ?,
        schedule = ?,
        command = ?,
        description = ?
      WHERE id = ?
    `, [name, schedule, command, description || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cron job não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Cron job atualizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};
