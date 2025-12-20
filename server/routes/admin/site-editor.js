/**
 * 🎨 AdminCP - Site Editor Routes
 * Editor visual integrado para gerenciar o frontend
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');

/**
 * GET /api/admin/site-editor/config
 * Obter configuração completa do site
 */
router.get('/config', async (req, res) => {
  try {
    const [config] = await db.query(`
      SELECT 
        id,
        section,
        key_name as key,
        value,
        type,
        updated_at as updatedAt
      FROM webmu_site_config
      ORDER BY section, key_name
    `);

    // Group by section
    const grouped = config.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = {};
      }
      acc[item.section][item.key] = item.value;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        config: config,
        grouped: grouped
      }
    });

  } catch (error) {
    console.error('Error fetching site config:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar configuração do site',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/site-editor/config/:section
 * Obter configuração de uma seção específica
 */
router.get('/config/:section', async (req, res) => {
  try {
    const { section } = req.params;

    const [config] = await db.query(`
      SELECT 
        id,
        section,
        key_name as key,
        value,
        type,
        description,
        updated_at as updatedAt
      FROM webmu_site_config
      WHERE section = ?
      ORDER BY key_name
    `, [section]);

    res.json({
      success: true,
      data: config
    });

  } catch (error) {
    console.error('Error fetching section config:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar configuração da seção',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/site-editor/config/:section/:key
 * Atualizar configuração específica
 */
router.put('/config/:section/:key', async (req, res) => {
  try {
    const { section, key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Valor não fornecido'
      });
    }

    // Check if config exists
    const [existing] = await db.query(`
      SELECT id, value FROM webmu_site_config 
      WHERE section = ? AND key_name = ?
    `, [section, key]);

    if (existing.length === 0) {
      // Insert new config
      await db.query(`
        INSERT INTO webmu_site_config (section, key_name, value, created_at)
        VALUES (?, ?, ?, NOW())
      `, [section, key, value]);
    } else {
      // Update existing config
      await db.query(`
        UPDATE webmu_site_config
        SET value = ?, updated_at = NOW()
        WHERE section = ? AND key_name = ?
      `, [value, section, key]);
    }

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'site_config_update', ?, NOW())
    `, [req.user.username, JSON.stringify({ 
      section, 
      key, 
      oldValue: existing[0]?.value,
      newValue: value 
    })]);

    res.json({
      success: true,
      message: 'Configuração atualizada com sucesso'
    });

  } catch (error) {
    console.error('Error updating site config:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar configuração',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/site-editor/config/bulk-update
 * Atualizar múltiplas configurações de uma vez
 */
router.post('/config/bulk-update', async (req, res) => {
  try {
    const { configs } = req.body;

    if (!configs || !Array.isArray(configs) || configs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lista de configurações não fornecida'
      });
    }

    // Update each config
    for (const config of configs) {
      const [existing] = await db.query(`
        SELECT id FROM webmu_site_config 
        WHERE section = ? AND key_name = ?
      `, [config.section, config.key]);

      if (existing.length === 0) {
        await db.query(`
          INSERT INTO webmu_site_config (section, key_name, value, created_at)
          VALUES (?, ?, ?, NOW())
        `, [config.section, config.key, config.value]);
      } else {
        await db.query(`
          UPDATE webmu_site_config
          SET value = ?, updated_at = NOW()
          WHERE section = ? AND key_name = ?
        `, [config.value, config.section, config.key]);
      }
    }

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'site_config_bulk_update', ?, NOW())
    `, [req.user.username, JSON.stringify({ count: configs.length })]);

    res.json({
      success: true,
      message: `${configs.length} configurações atualizadas com sucesso`
    });

  } catch (error) {
    console.error('Error bulk updating site config:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar configurações',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/site-editor/sections
 * Lista todas as seções disponíveis
 */
router.get('/sections', async (req, res) => {
  try {
    const [sections] = await db.query(`
      SELECT DISTINCT section, COUNT(*) as count
      FROM webmu_site_config
      GROUP BY section
      ORDER BY section
    `);

    res.json({
      success: true,
      data: sections
    });

  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar seções',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/site-editor/social-links
 * Atualizar links de redes sociais
 */
router.post('/social-links', async (req, res) => {
  try {
    const { discord, whatsapp, facebook, instagram, youtube } = req.body;

    const socialLinks = {
      discord: discord || '',
      whatsapp: whatsapp || '',
      facebook: facebook || '',
      instagram: instagram || '',
      youtube: youtube || ''
    };

    for (const [platform, url] of Object.entries(socialLinks)) {
      const [existing] = await db.query(`
        SELECT id FROM webmu_site_config 
        WHERE section = 'social' AND key_name = ?
      `, [platform]);

      if (existing.length === 0) {
        await db.query(`
          INSERT INTO webmu_site_config (section, key_name, value, created_at)
          VALUES ('social', ?, ?, NOW())
        `, [platform, url]);
      } else {
        await db.query(`
          UPDATE webmu_site_config
          SET value = ?, updated_at = NOW()
          WHERE section = 'social' AND key_name = ?
        `, [url, platform]);
      }
    }

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'social_links_update', ?, NOW())
    `, [req.user.username, JSON.stringify(socialLinks)]);

    res.json({
      success: true,
      message: 'Links de redes sociais atualizados com sucesso'
    });

  } catch (error) {
    console.error('Error updating social links:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar links de redes sociais',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/site-editor/home-banner
 * Atualizar banner da home
 */
router.post('/home-banner', async (req, res) => {
  try {
    const { title, subtitle, description, buttonText, buttonLink } = req.body;

    const bannerConfig = {
      title: title || '',
      subtitle: subtitle || '',
      description: description || '',
      buttonText: buttonText || '',
      buttonLink: buttonLink || ''
    };

    for (const [key, value] of Object.entries(bannerConfig)) {
      const [existing] = await db.query(`
        SELECT id FROM webmu_site_config 
        WHERE section = 'home_banner' AND key_name = ?
      `, [key]);

      if (existing.length === 0) {
        await db.query(`
          INSERT INTO webmu_site_config (section, key_name, value, created_at)
          VALUES ('home_banner', ?, ?, NOW())
        `, [key, value]);
      } else {
        await db.query(`
          UPDATE webmu_site_config
          SET value = ?, updated_at = NOW()
          WHERE section = 'home_banner' AND key_name = ?
        `, [value, key]);
      }
    }

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'home_banner_update', ?, NOW())
    `, [req.user.username, JSON.stringify(bannerConfig)]);

    res.json({
      success: true,
      message: 'Banner da home atualizado com sucesso'
    });

  } catch (error) {
    console.error('Error updating home banner:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar banner da home',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/site-editor/preview
 * Gerar preview das alterações
 */
router.get('/preview', async (req, res) => {
  try {
    // This would generate a preview of the current site configuration
    // For now, just return the current config
    const [config] = await db.query(`
      SELECT section, key_name as key, value
      FROM webmu_site_config
      ORDER BY section, key_name
    `);

    const grouped = config.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = {};
      }
      acc[item.section][item.key] = item.value;
      return acc;
    }, {});

    res.json({
      success: true,
      data: grouped
    });

  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar preview',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/site-editor/reset-section
 * Resetar uma seção para valores padrão
 */
router.post('/reset-section/:section', async (req, res) => {
  try {
    const { section } = req.params;

    // Delete all config for this section
    await db.query(`
      DELETE FROM webmu_site_config WHERE section = ?
    `, [section]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'site_section_reset', ?, NOW())
    `, [req.user.username, JSON.stringify({ section })]);

    res.json({
      success: true,
      message: `Seção ${section} resetada com sucesso`
    });

  } catch (error) {
    console.error('Error resetting section:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao resetar seção',
      error: error.message
    });
  }
});

module.exports = router;
