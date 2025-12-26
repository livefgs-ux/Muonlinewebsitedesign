/**
 * 🎛️ Controller de Configurações do Site
 * 
 * Gerencia todas as configurações editáveis do AdminCP:
 * - Server Info (Season, Rates, etc.)
 * - Site Settings (Nome, Links, etc.)
 * - Limites de Reset
 */

const { executeQueryWeb, executeQueryMU } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * ✅ Obter TODAS as configurações
 */
const getAllSettings = async (req, res) => {
  try {
    // Buscar configurações do banco meuweb
    const sql = `SELECT * FROM site_settings WHERE id = 1`;
    const result = await executeQueryWeb(sql);
    
    if (result.success && result.data && result.data.length > 0) {
      return successResponse(res, result.data[0]);
    } else {
      // Se não existir, criar configuração padrão
      const defaultSettings = {
        // Server Info
        server_name: 'MeuMU Online',
        server_season: 'Season 19-2-3 - Épico',
        exp_rate: '9999x',
        drop_rate: '60%',
        max_reset: 500,
        max_grand_reset: 50,
        
        // Site Info
        site_title: 'MeuMU Online',
        site_description: 'Complete experience with balanced rates, daily epic events and an active community.',
        site_tagline: 'Enter the legend. Dominate the realms. Become immortal.',
        
        // Social Links
        discord_link: 'https://discord.gg/meumu',
        whatsapp_link: '',
        facebook_link: '',
        instagram_link: '',
        
        // Download Links
        client_download_link: '',
        patch_download_link: '',
        launcher_download_link: '',
        
        // Theme Colors
        primary_color: '#FFB800',
        secondary_color: '#60A5FA',
        background_color: '#0A0A0A',
        
        // Footer
        copyright_text: '© 2024 MeuMU Online. Todos os direitos reservados.',
        
        updated_at: new Date()
      };
      
      return successResponse(res, defaultSettings);
    }
  } catch (error) {
    console.error('❌ Erro ao buscar configurações:', error);
    return errorResponse(res, 'Erro ao buscar configurações', 500);
  }
};

/**
 * ✅ Atualizar configurações
 */
const updateSettings = async (req, res) => {
  try {
    const {
      // Server Info
      server_name,
      server_season,
      exp_rate,
      drop_rate,
      max_reset,
      max_grand_reset,
      
      // Site Info
      site_title,
      site_description,
      site_tagline,
      
      // Social Links
      discord_link,
      whatsapp_link,
      facebook_link,
      instagram_link,
      
      // Download Links
      client_download_link,
      patch_download_link,
      launcher_download_link,
      
      // Theme Colors
      primary_color,
      secondary_color,
      background_color,
      
      // Footer
      copyright_text
    } = req.body;
    
    // Verificar se tabela existe
    const checkTableSql = `
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        
        -- Server Info
        server_name VARCHAR(255) DEFAULT 'MeuMU Online',
        server_season VARCHAR(255) DEFAULT 'Season 19-2-3 - Épico',
        exp_rate VARCHAR(50) DEFAULT '9999x',
        drop_rate VARCHAR(50) DEFAULT '60%',
        max_reset INT DEFAULT 500,
        max_grand_reset INT DEFAULT 50,
        
        -- Site Info
        site_title VARCHAR(255) DEFAULT 'MeuMU Online',
        site_description TEXT,
        site_tagline TEXT,
        
        -- Social Links
        discord_link VARCHAR(255),
        whatsapp_link VARCHAR(255),
        facebook_link VARCHAR(255),
        instagram_link VARCHAR(255),
        
        -- Download Links
        client_download_link TEXT,
        patch_download_link TEXT,
        launcher_download_link TEXT,
        
        -- Theme Colors
        primary_color VARCHAR(7) DEFAULT '#FFB800',
        secondary_color VARCHAR(7) DEFAULT '#60A5FA',
        background_color VARCHAR(7) DEFAULT '#0A0A0A',
        
        -- Footer
        copyright_text TEXT,
        
        -- Metadata
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await executeQueryWeb(checkTableSql);
    
    // Verificar se registro existe
    const checkSql = `SELECT id FROM site_settings WHERE id = 1`;
    const checkResult = await executeQueryWeb(checkSql);
    
    let sql;
    let params = [
      server_name,
      server_season,
      exp_rate,
      drop_rate,
      max_reset,
      max_grand_reset,
      site_title,
      site_description,
      site_tagline,
      discord_link,
      whatsapp_link,
      facebook_link,
      instagram_link,
      client_download_link,
      patch_download_link,
      launcher_download_link,
      primary_color,
      secondary_color,
      background_color,
      copyright_text
    ];
    
    if (checkResult.success && checkResult.data && checkResult.data.length > 0) {
      // UPDATE
      sql = `
        UPDATE site_settings SET
          server_name = ?,
          server_season = ?,
          exp_rate = ?,
          drop_rate = ?,
          max_reset = ?,
          max_grand_reset = ?,
          site_title = ?,
          site_description = ?,
          site_tagline = ?,
          discord_link = ?,
          whatsapp_link = ?,
          facebook_link = ?,
          instagram_link = ?,
          client_download_link = ?,
          patch_download_link = ?,
          launcher_download_link = ?,
          primary_color = ?,
          secondary_color = ?,
          background_color = ?,
          copyright_text = ?,
          updated_at = NOW()
        WHERE id = 1
      `;
    } else {
      // INSERT
      sql = `
        INSERT INTO site_settings (
          server_name, server_season, exp_rate, drop_rate, max_reset, max_grand_reset,
          site_title, site_description, site_tagline,
          discord_link, whatsapp_link, facebook_link, instagram_link,
          client_download_link, patch_download_link, launcher_download_link,
          primary_color, secondary_color, background_color, copyright_text
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
    }
    
    const result = await executeQueryWeb(sql, params);
    
    if (result.success) {
      console.log('✅ Configurações atualizadas com sucesso!');
      return successResponse(res, { message: 'Configurações atualizadas com sucesso!' });
    } else {
      throw new Error('Falha ao atualizar configurações');
    }
    
  } catch (error) {
    console.error('❌ Erro ao atualizar configurações:', error);
    return errorResponse(res, 'Erro ao atualizar configurações', 500);
  }
};

/**
 * ✅ Obter configurações de servidor (rates, season, etc.)
 * Usado pelo frontend público
 */
const getServerConfig = async (req, res) => {
  try {
    const sql = `SELECT 
      server_name, 
      server_season, 
      exp_rate, 
      drop_rate, 
      max_reset, 
      max_grand_reset 
    FROM site_settings WHERE id = 1`;
    
    const result = await executeQueryWeb(sql);
    
    if (result.success && result.data && result.data.length > 0) {
      return successResponse(res, result.data[0]);
    } else {
      // Fallback para valores padrão
      return successResponse(res, {
        server_name: 'MeuMU Online',
        server_season: 'Season 19-2-3 - Épico',
        exp_rate: '9999x',
        drop_rate: '60%',
        max_reset: 500,
        max_grand_reset: 50
      });
    }
  } catch (error) {
    console.error('❌ Erro ao buscar config do servidor:', error);
    return errorResponse(res, 'Erro ao buscar configurações', 500);
  }
};

module.exports = {
  getAllSettings,
  updateSettings,
  getServerConfig
};
