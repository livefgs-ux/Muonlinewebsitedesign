/**
 * 🎨 Site Editor Controller
 * Gerenciamento de configurações visuais do site
 * V563 - Implementação completa
 */

const pool = require('../config/database');

/**
 * GET /api/admin/site-editor/config
 * Busca todas as configurações do site
 */
exports.getConfig = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT config_key, config_value, config_group 
       FROM site_config 
       ORDER BY config_group, config_key`
    );

    // Agrupar por categoria
    const grouped = {};
    rows.forEach(row => {
      const group = row.config_group || 'general';
      if (!grouped[group]) {
        grouped[group] = {};
      }
      grouped[group][row.config_key] = row.config_value;
    });

    res.json({
      success: true,
      data: {
        raw: rows,
        grouped: grouped
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar configurações do site:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar configurações do site'
    });
  }
};

/**
 * POST /api/admin/site-editor/home-banner
 * Atualiza configurações do banner da home
 */
exports.updateHomeBanner = async (req, res) => {
  try {
    const { title, subtitle, description, buttonText, buttonLink } = req.body;

    const updates = [
      { key: 'title', value: title, group: 'home_banner' },
      { key: 'subtitle', value: subtitle, group: 'home_banner' },
      { key: 'description', value: description, group: 'home_banner' },
      { key: 'buttonText', value: buttonText, group: 'home_banner' },
      { key: 'buttonLink', value: buttonLink, group: 'home_banner' }
    ];

    for (const update of updates) {
      await pool.query(
        `INSERT INTO site_config (config_key, config_value, config_group) 
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)`,
        [update.key, update.value, update.group]
      );
    }

    res.json({
      success: true,
      message: 'Banner da home atualizado com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar banner da home:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar banner da home'
    });
  }
};

/**
 * POST /api/admin/site-editor/social-links
 * Atualiza links das redes sociais
 */
exports.updateSocialLinks = async (req, res) => {
  try {
    const { discord, whatsapp, facebook, instagram, youtube } = req.body;

    const updates = [
      { key: 'discord', value: discord, group: 'social' },
      { key: 'whatsapp', value: whatsapp, group: 'social' },
      { key: 'facebook', value: facebook, group: 'social' },
      { key: 'instagram', value: instagram, group: 'social' },
      { key: 'youtube', value: youtube, group: 'social' }
    ];

    for (const update of updates) {
      await pool.query(
        `INSERT INTO site_config (config_key, config_value, config_group) 
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)`,
        [update.key, update.value, update.group]
      );
    }

    res.json({
      success: true,
      message: 'Links sociais atualizados com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar links sociais:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar links sociais'
    });
  }
};

/**
 * POST /api/admin/site-editor/config/bulk-update
 * Atualização em massa de configurações
 */
exports.bulkUpdateConfig = async (req, res) => {
  try {
    const { configs } = req.body;

    if (!Array.isArray(configs)) {
      return res.status(400).json({
        success: false,
        message: 'Formato inválido. Esperado array de configs.'
      });
    }

    for (const config of configs) {
      await pool.query(
        `INSERT INTO site_config (config_key, config_value, config_group) 
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)`,
        [config.key, config.value, config.group || 'site']
      );
    }

    res.json({
      success: true,
      message: `${configs.length} configurações atualizadas com sucesso!`
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar configurações em massa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar configurações'
    });
  }
};

/**
 * POST /api/admin/site-editor/background
 * Atualiza imagem de background do site
 */
exports.updateBackground = async (req, res) => {
  try {
    const { backgroundUrl } = req.body;

    if (!backgroundUrl) {
      return res.status(400).json({
        success: false,
        message: 'URL do background é obrigatória'
      });
    }

    await pool.query(
      `INSERT INTO site_config (config_key, config_value, config_group) 
       VALUES ('backgroundImage', ?, 'visual')
       ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)`,
      [backgroundUrl]
    );

    res.json({
      success: true,
      message: 'Background atualizado com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar background:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar background'
    });
  }
};

/**
 * GET /api/site-editor/background
 * Busca background atual (rota pública)
 */
exports.getBackground = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT config_value 
       FROM site_config 
       WHERE config_key = 'backgroundImage'
       LIMIT 1`
    );

    res.json({
      success: true,
      backgroundUrl: rows.length > 0 ? rows[0].config_value : null
    });

  } catch (error) {
    console.error('❌ Erro ao buscar background:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar background'
    });
  }
};
