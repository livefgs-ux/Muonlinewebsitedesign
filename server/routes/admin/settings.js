/**
 * ⚙️ AdminCP - Settings Management Routes
 * Configurações globais do sistema
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');

/**
 * GET /api/admin/settings
 * Obter todas as configurações
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT 
        id,
        key_name as key,
        value,
        category,
        description,
        type,
        updated_at as updatedAt
      FROM webmu_settings
    `;

    const params = [];

    if (category) {
      query += ` WHERE category = ?`;
      params.push(category);
    }

    query += ` ORDER BY category, key_name`;

    const [settings] = await db.query(query, params);

    // Group by category
    const grouped = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        settings: settings,
        grouped: grouped
      }
    });

  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar configurações',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/settings/:key
 * Obter configuração específica
 */
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const [settings] = await db.query(`
      SELECT 
        id,
        key_name as key,
        value,
        category,
        description,
        type,
        updated_at as updatedAt
      FROM webmu_settings
      WHERE key_name = ?
    `, [key]);

    if (settings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Configuração não encontrada'
      });
    }

    res.json({
      success: true,
      data: settings[0]
    });

  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar configuração',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/settings/:key
 * Atualizar configuração específica
 */
router.put('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Valor não fornecido'
      });
    }

    // Check if setting exists
    const [existing] = await db.query(`
      SELECT id, value FROM webmu_settings WHERE key_name = ?
    `, [key]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Configuração não encontrada'
      });
    }

    const oldValue = existing[0].value;

    // Update setting
    await db.query(`
      UPDATE webmu_settings
      SET value = ?, updated_at = NOW()
      WHERE key_name = ?
    `, [value, key]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'setting_update', ?, NOW())
    `, [req.user.username, JSON.stringify({ 
      key, 
      oldValue, 
      newValue: value 
    })]);

    res.json({
      success: true,
      message: 'Configuração atualizada com sucesso'
    });

  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar configuração',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/settings
 * Criar nova configuração
 */
router.post('/', async (req, res) => {
  try {
    const { key, value, category, description, type = 'string' } = req.body;

    if (!key || value === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios não fornecidos'
      });
    }

    // Check if setting already exists
    const [existing] = await db.query(`
      SELECT id FROM webmu_settings WHERE key_name = ?
    `, [key]);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Configuração já existe'
      });
    }

    // Insert new setting
    const [result] = await db.query(`
      INSERT INTO webmu_settings (key_name, value, category, description, type, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [key, value, category, description || '', type]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'setting_create', ?, NOW())
    `, [req.user.username, JSON.stringify({ key, value, category })]);

    res.json({
      success: true,
      message: 'Configuração criada com sucesso',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Error creating setting:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar configuração',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/settings/bulk-update
 * Atualizar múltiplas configurações de uma vez
 */
router.post('/bulk-update', async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || !Array.isArray(settings) || settings.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lista de configurações não fornecida'
      });
    }

    // Update each setting
    for (const setting of settings) {
      await db.query(`
        UPDATE webmu_settings
        SET value = ?, updated_at = NOW()
        WHERE key_name = ?
      `, [setting.value, setting.key]);
    }

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'settings_bulk_update', ?, NOW())
    `, [req.user.username, JSON.stringify({ count: settings.length })]);

    res.json({
      success: true,
      message: `${settings.length} configurações atualizadas com sucesso`
    });

  } catch (error) {
    console.error('Error bulk updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar configurações',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/settings/:key
 * Deletar configuração
 */
router.delete('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    await db.query(`
      DELETE FROM webmu_settings WHERE key_name = ?
    `, [key]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'setting_delete', ?, NOW())
    `, [req.user.username, JSON.stringify({ key })]);

    res.json({
      success: true,
      message: 'Configuração deletada com sucesso'
    });

  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar configuração',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/settings/categories/list
 * Lista todas as categorias disponíveis
 */
router.get('/categories/list', async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM webmu_settings
      GROUP BY category
      ORDER BY category
    `);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar categorias',
      error: error.message
    });
  }
});

module.exports = router;
