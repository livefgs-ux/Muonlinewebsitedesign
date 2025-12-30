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

/**
 * POST /api/admin/plugins/install
 * Instala plugin a partir de arquivo ZIP
 */
exports.installPlugin = async (req, res) => {
  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');
  const AdmZip = require('adm-zip');

  try {
    // Configurar multer para upload
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads/plugins');
        
        // Criar diretório se não existir
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

    const upload = multer({ 
      storage: storage,
      fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() !== '.zip') {
          return cb(new Error('Apenas arquivos .zip são permitidos'));
        }
        cb(null, true);
      }
    }).single('plugin');

    // Processar upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Erro ao fazer upload do plugin'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum arquivo enviado'
        });
      }

      try {
        const zipPath = req.file.path;
        const pluginsDir = path.join(process.cwd(), 'plugins');
        
        // Criar diretório de plugins se não existir
        if (!fs.existsSync(pluginsDir)) {
          fs.mkdirSync(pluginsDir, { recursive: true });
        }

        // Extrair ZIP
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(pluginsDir, true);

        // Tentar ler manifest.json
        const extractedFiles = fs.readdirSync(pluginsDir);
        let pluginInfo = {
          name: req.file.originalname.replace('.zip', ''),
          version: '1.0.0',
          author: 'Unknown',
          description: 'Plugin instalado via upload'
        };

        // Procurar por manifest.json
        for (const file of extractedFiles) {
          const manifestPath = path.join(pluginsDir, file, 'manifest.json');
          if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            pluginInfo = {
              name: manifest.name || pluginInfo.name,
              version: manifest.version || pluginInfo.version,
              author: manifest.author || pluginInfo.author,
              description: manifest.description || pluginInfo.description
            };
            break;
          }
        }

        // Salvar no banco de dados
        const [result] = await pool.query(
          `INSERT INTO plugins (name, description, version, author, enabled, created_at) 
           VALUES (?, ?, ?, ?, true, NOW())`,
          [pluginInfo.name, pluginInfo.description, pluginInfo.version, pluginInfo.author]
        );

        // Remover arquivo ZIP temporário
        fs.unlinkSync(zipPath);

        res.json({
          success: true,
          message: 'Plugin instalado com sucesso!',
          data: {
            id: result.insertId,
            ...pluginInfo
          }
        });

      } catch (error) {
        // Limpar arquivo temporário em caso de erro
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        console.error('❌ Erro ao processar plugin:', error);
        res.status(500).json({
          success: false,
          message: 'Erro ao processar plugin: ' + error.message
        });
      }
    });

  } catch (error) {
    console.error('❌ Erro ao instalar plugin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao instalar plugin'
    });
  }
};