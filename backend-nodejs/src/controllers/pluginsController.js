/**
 * 🔌 Plugins Controller
 * Gerenciamento de plugins do sistema
 * V564 - Implementação completa
 */

const pool = require('../config/database');

/**
 * GET /api/admin/plugins
 * Lista todos os plugins disponíveis
 */
exports.getAllPlugins = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM plugins ORDER BY name ASC`
    );

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });

  } catch (error) {
    console.error('❌ Erro ao buscar plugins:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar plugins'
    });
  }
};

/**
 * POST /api/admin/plugins
 * Cria novo plugin
 */
exports.createPlugin = async (req, res) => {
  try {
    const { name, description, version, author, enabled } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nome do plugin é obrigatório'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO plugins (name, description, version, author, enabled, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, description || '', version || '1.0.0', author || 'Admin', enabled || false]
    );

    res.status(201).json({
      success: true,
      message: 'Plugin criado com sucesso!',
      data: {
        id: result.insertId,
        name,
        description,
        version,
        author,
        enabled
      }
    });

  } catch (error) {
    console.error('❌ Erro ao criar plugin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar plugin'
    });
  }
};

/**
 * PUT /api/admin/plugins/:id
 * Atualiza plugin existente
 */
exports.updatePlugin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, version, author, enabled } = req.body;

    const [result] = await pool.query(
      `UPDATE plugins 
       SET name = ?, description = ?, version = ?, author = ?, enabled = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, description, version, author, enabled, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plugin não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Plugin atualizado com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar plugin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar plugin'
    });
  }
};

/**
 * PUT /api/admin/plugins/:id/toggle
 * Ativa/desativa plugin
 */
exports.togglePlugin = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar status atual
    const [rows] = await pool.query(
      `SELECT enabled FROM plugins WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plugin não encontrado'
      });
    }

    const newStatus = !rows[0].enabled;

    await pool.query(
      `UPDATE plugins SET enabled = ?, updated_at = NOW() WHERE id = ?`,
      [newStatus, id]
    );

    res.json({
      success: true,
      message: `Plugin ${newStatus ? 'ativado' : 'desativado'} com sucesso!`,
      enabled: newStatus
    });

  } catch (error) {
    console.error('❌ Erro ao alternar plugin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao alternar plugin'
    });
  }
};

/**
 * DELETE /api/admin/plugins/:id
 * Remove plugin
 */
exports.deletePlugin = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM plugins WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plugin não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Plugin removido com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao remover plugin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover plugin'
    });
  }
};
