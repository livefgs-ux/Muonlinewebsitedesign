/**
 * DOWNLOADS CONTROLLER - MEUMU ONLINE
 * Gerenciamento de arquivos para download (Client, Patch, Launcher)
 */

const { poolWEB } = require('../config/database');
const { validateRequired } = require('../utils/validators');

/**
 * Listar todos os downloads ativos (público)
 * GET /api/downloads
 */
exports.getActiveDownloads = async (req, res, next) => {
  try {
    const [downloads] = await poolWEB.query(`
      SELECT 
        id, name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
        description, description_en, description_es, description_de,
        description_zh, description_ru, description_fil, description_vi,
        type, version, size, download_url, mirror_url,
        icon, priority, download_count
      FROM downloads
      WHERE is_active = TRUE
      ORDER BY priority DESC, name ASC
    `);

    res.json({
      success: true,
      data: downloads
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obter download por ID
 * GET /api/downloads/:id
 */
exports.getDownloadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [downloads] = await poolWEB.query(`
      SELECT * FROM downloads WHERE id = ?
    `, [id]);

    if (downloads.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Download não encontrado'
      });
    }

    // Incrementar contador de downloads
    await poolWEB.query(`
      UPDATE downloads SET download_count = download_count + 1 WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      data: downloads[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ==========================================
 * ADMIN ENDPOINTS
 * ==========================================
 */

/**
 * Listar todos os downloads (incluindo inativos) - Admin
 * GET /api/admin/downloads
 */
exports.getAllDownloadsAdmin = async (req, res, next) => {
  try {
    const [downloads] = await poolWEB.query(`
      SELECT * FROM downloads
      ORDER BY priority DESC, name ASC
    `);

    res.json({
      success: true,
      data: downloads
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Criar novo download
 * POST /api/admin/downloads
 */
exports.createDownload = async (req, res, next) => {
  try {
    const {
      name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
      description, description_en, description_es, description_de,
      description_zh, description_ru, description_fil, description_vi,
      type, version, size, download_url, mirror_url,
      icon, priority, is_active
    } = req.body;

    // Validações
    const validation = validateRequired({ name, type, download_url });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Inserir download
    const [result] = await poolWEB.query(`
      INSERT INTO downloads (
        name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
        description, description_en, description_es, description_de,
        description_zh, description_ru, description_fil, description_vi,
        type, version, size, download_url, mirror_url,
        icon, priority, is_active, download_count,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `, [
      name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
      description, description_en, description_es, description_de,
      description_zh, description_ru, description_fil, description_vi,
      type, version || '1.0', size || 'Unknown', download_url, mirror_url,
      icon || 'Download', priority || 0, is_active !== false,
      req.user?.username || 'admin'
    ]);

    res.status(201).json({
      success: true,
      message: 'Download criado com sucesso',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualizar download existente
 * PUT /api/admin/downloads/:id
 */
exports.updateDownload = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verificar se download existe
    const [existing] = await poolWEB.query('SELECT id FROM downloads WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Download não encontrado'
      });
    }

    // Construir query de atualização dinamicamente
    const allowedFields = [
      'name', 'name_en', 'name_es', 'name_de', 'name_zh', 'name_ru', 'name_fil', 'name_vi',
      'description', 'description_en', 'description_es', 'description_de',
      'description_zh', 'description_ru', 'description_fil', 'description_vi',
      'type', 'version', 'size', 'download_url', 'mirror_url',
      'icon', 'priority', 'is_active'
    ];

    const updateFields = [];
    const updateValues = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updates[field]);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo para atualizar'
      });
    }

    updateValues.push(id);

    await poolWEB.query(`
      UPDATE downloads 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues);

    res.json({
      success: true,
      message: 'Download atualizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletar download
 * DELETE /api/admin/downloads/:id
 */
exports.deleteDownload = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await poolWEB.query('DELETE FROM downloads WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Download não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Download deletado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Alternar status do download (ativar/desativar)
 * PATCH /api/admin/downloads/:id/toggle
 */
exports.toggleDownloadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    await poolWEB.query(`
      UPDATE downloads 
      SET is_active = NOT is_active
      WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Status do download alterado'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obter estatísticas de downloads
 * GET /api/admin/downloads/stats
 */
exports.getDownloadStats = async (req, res, next) => {
  try {
    const [stats] = await poolWEB.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active,
        SUM(download_count) as total_downloads,
        COUNT(DISTINCT type) as types
      FROM downloads
    `);

    const [byType] = await poolWEB.query(`
      SELECT 
        type,
        COUNT(*) as count,
        SUM(download_count) as downloads
      FROM downloads
      WHERE is_active = TRUE
      GROUP BY type
    `);

    res.json({
      success: true,
      data: {
        summary: stats[0],
        byType
      }
    });
  } catch (error) {
    next(error);
  }
};
