/**
 * 🔌 AdminCP - Plugin Manager Routes
 * Sistema de plugins modular e extensível
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const AdmZip = require('adm-zip');

// Configure multer for plugin uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../plugins/temp');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos .zip são permitidos'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

/**
 * GET /api/admin/plugins
 * Lista todos os plugins instalados
 */
router.get('/', async (req, res) => {
  try {
    const [plugins] = await db.query(`
      SELECT 
        id,
        name,
        slug,
        version,
        author,
        description,
        status,
        compatible_versions as compatibleVersions,
        entry_point as entryPoint,
        installed_at as installedAt,
        updated_at as updatedAt
      FROM webmu_plugins
      ORDER BY name ASC
    `);

    res.json({
      success: true,
      data: plugins
    });

  } catch (error) {
    console.error('Error fetching plugins:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar plugins',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/plugins/:id
 * Detalhes de um plugin específico
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [plugins] = await db.query(`
      SELECT 
        id,
        name,
        slug,
        version,
        author,
        description,
        status,
        compatible_versions as compatibleVersions,
        entry_point as entryPoint,
        config_schema as configSchema,
        installed_at as installedAt,
        updated_at as updatedAt
      FROM webmu_plugins
      WHERE id = ?
    `, [id]);

    if (plugins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plugin não encontrado'
      });
    }

    res.json({
      success: true,
      data: plugins[0]
    });

  } catch (error) {
    console.error('Error fetching plugin details:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar detalhes do plugin',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/plugins/install
 * Instalar novo plugin via upload .zip
 */
router.post('/install', upload.single('plugin'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Arquivo de plugin não fornecido'
      });
    }

    const zipPath = req.file.path;
    const zip = new AdmZip(zipPath);
    
    // Extract and read manifest.json
    const zipEntries = zip.getEntries();
    const manifestEntry = zipEntries.find(entry => entry.entryName.endsWith('manifest.json'));
    
    if (!manifestEntry) {
      await fs.unlink(zipPath);
      return res.status(400).json({
        success: false,
        message: 'manifest.json não encontrado no plugin'
      });
    }

    const manifest = JSON.parse(manifestEntry.getData().toString('utf8'));

    // Validate manifest
    if (!manifest.name || !manifest.version || !manifest.entry) {
      await fs.unlink(zipPath);
      return res.status(400).json({
        success: false,
        message: 'manifest.json inválido'
      });
    }

    // Check if plugin already exists
    const [existing] = await db.query(`
      SELECT id FROM webmu_plugins WHERE slug = ?
    `, [manifest.slug || manifest.name.toLowerCase().replace(/\s+/g, '-')]);

    if (existing.length > 0) {
      await fs.unlink(zipPath);
      return res.status(400).json({
        success: false,
        message: 'Plugin já instalado'
      });
    }

    // Extract plugin to plugins directory
    const pluginDir = path.join(__dirname, '../../../plugins', manifest.slug || manifest.name);
    await fs.mkdir(pluginDir, { recursive: true });
    zip.extractAllTo(pluginDir, true);

    // Insert plugin to database
    const [result] = await db.query(`
      INSERT INTO webmu_plugins (
        name, slug, version, author, description,
        status, compatible_versions, entry_point,
        config_schema, installed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      manifest.name,
      manifest.slug || manifest.name.toLowerCase().replace(/\s+/g, '-'),
      manifest.version,
      manifest.author || 'Unknown',
      manifest.description || '',
      'disabled',
      JSON.stringify(manifest.compatible || []),
      manifest.entry,
      JSON.stringify(manifest.config || {})
    ]);

    // Clean up temp file
    await fs.unlink(zipPath);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'plugin_install', ?, NOW())
    `, [req.user.username, JSON.stringify({ pluginName: manifest.name, version: manifest.version })]);

    res.json({
      success: true,
      message: 'Plugin instalado com sucesso',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Error installing plugin:', error);
    
    // Clean up temp file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao instalar plugin',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/plugins/:id/toggle
 * Ativar/Desativar plugin
 */
router.post('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    // Get current status
    const [plugins] = await db.query(`
      SELECT status FROM webmu_plugins WHERE id = ?
    `, [id]);

    if (plugins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plugin não encontrado'
      });
    }

    const newStatus = plugins[0].status === 'enabled' ? 'disabled' : 'enabled';

    await db.query(`
      UPDATE webmu_plugins
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `, [newStatus, id]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'plugin_toggle', ?, NOW())
    `, [req.user.username, JSON.stringify({ pluginId: id, newStatus })]);

    res.json({
      success: true,
      message: `Plugin ${newStatus === 'enabled' ? 'ativado' : 'desativado'} com sucesso`,
      data: { status: newStatus }
    });

  } catch (error) {
    console.error('Error toggling plugin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao alternar status do plugin',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/plugins/:id
 * Desinstalar plugin
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get plugin details
    const [plugins] = await db.query(`
      SELECT slug FROM webmu_plugins WHERE id = ?
    `, [id]);

    if (plugins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plugin não encontrado'
      });
    }

    const pluginSlug = plugins[0].slug;

    // Delete plugin files
    const pluginDir = path.join(__dirname, '../../../plugins', pluginSlug);
    try {
      await fs.rm(pluginDir, { recursive: true, force: true });
    } catch (fsError) {
      console.error('Error deleting plugin files:', fsError);
    }

    // Delete from database
    await db.query(`
      DELETE FROM webmu_plugins WHERE id = ?
    `, [id]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'plugin_uninstall', ?, NOW())
    `, [req.user.username, JSON.stringify({ pluginId: id, pluginSlug })]);

    res.json({
      success: true,
      message: 'Plugin desinstalado com sucesso'
    });

  } catch (error) {
    console.error('Error uninstalling plugin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao desinstalar plugin',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/plugins/:id/config
 * Atualizar configuração do plugin
 */
router.put('/:id/config', async (req, res) => {
  try {
    const { id } = req.params;
    const { config } = req.body;

    await db.query(`
      UPDATE webmu_plugins
      SET config_schema = ?, updated_at = NOW()
      WHERE id = ?
    `, [JSON.stringify(config), id]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'plugin_config_update', ?, NOW())
    `, [req.user.username, JSON.stringify({ pluginId: id })]);

    res.json({
      success: true,
      message: 'Configuração do plugin atualizada com sucesso'
    });

  } catch (error) {
    console.error('Error updating plugin config:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar configuração do plugin',
      error: error.message
    });
  }
});

module.exports = router;
