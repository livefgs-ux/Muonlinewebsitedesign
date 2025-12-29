/**
 * 🎨 Site Editor Controller
 * Gerenciamento de configurações visuais do site
 * V563 - Implementação completa
 */

const { executeQueryWEB } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * GET /api/admin/site-editor/config
 * Busca todas as configurações do site
 */
exports.getConfig = async (req, res) => {
  try {
    const result = await executeQueryWEB(
      `SELECT config_key, config_value, config_group 
       FROM site_config 
       ORDER BY config_group, config_key`
    );

    if (!result.success) {
      throw new Error('Falha ao buscar configurações');
    }

    // Agrupar por categoria
    const grouped = {};
    result.data.forEach(row => {
      const group = row.config_group || 'general';
      if (!grouped[group]) {
        grouped[group] = {};
      }
      grouped[group][row.config_key] = row.config_value;
    });

    res.json({
      success: true,
      data: {
        raw: result.data,
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
      await executeQueryWEB(
        `INSERT INTO site_config (config_key, config_value, config_group) 
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)`,
        [update.key, update.value, update.group]
      );
    }

    return successResponse(res, { message: 'Banner da home atualizado com sucesso!' });

  } catch (error) {
    console.error('❌ Erro ao atualizar banner da home:', error);
    return errorResponse(res, 'Erro ao atualizar banner da home', 500);
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
      await executeQueryWEB(
        `INSERT INTO site_config (config_key, config_value, config_group) \n         VALUES (?, ?, ?)\n         ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)`,
        [update.key, update.value, update.group]
      );
    }

    return successResponse(res, { message: 'Links sociais atualizados com sucesso!' });

  } catch (error) {
    console.error('❌ Erro ao atualizar links sociais:', error);
    return errorResponse(res, 'Erro ao atualizar links sociais', 500);
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
      return errorResponse(res, 'Formato inválido. Esperado array de configs.', 400);
    }

    for (const config of configs) {
      await executeQueryWEB(
        `INSERT INTO site_config (config_key, config_value, config_group) 
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)`,
        [config.key, config.value, config.group || 'site']
      );
    }

    return successResponse(res, { message: `${configs.length} configurações atualizadas com sucesso!` });

  } catch (error) {
    console.error('❌ Erro ao atualizar configurações em massa:', error);
    return errorResponse(res, 'Erro ao atualizar configurações', 500);
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
      return errorResponse(res, 'URL do background é obrigatória', 400);
    }

    await executeQueryWEB(
      `INSERT INTO site_config (config_key, config_value, config_group) 
       VALUES ('backgroundImage', ?, 'visual')
       ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)`,
      [backgroundUrl]
    );

    return successResponse(res, { message: 'Background atualizado com sucesso!' });

  } catch (error) {
    console.error('❌ Erro ao atualizar background:', error);
    return errorResponse(res, 'Erro ao atualizar background', 500);
  }
};

/**
 * GET /api/site-editor/background
 * Busca background atual (rota pública)
 */
exports.getBackground = async (req, res) => {
  try {
    const result = await executeQueryWEB(
      `SELECT config_value 
       FROM site_config 
       WHERE config_key = 'backgroundImage'
       LIMIT 1`
    );

    return successResponse(res, {
      backgroundUrl: (result.success && result.data && result.data.length > 0) 
        ? result.data[0].config_value 
        : null
    });

  } catch (error) {
    console.error('❌ Erro ao buscar background:', error);
    return errorResponse(res, 'Erro ao buscar background', 500);
  }
};