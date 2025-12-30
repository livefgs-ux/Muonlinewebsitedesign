/**
 * 🎛️ Controller de Configurações do Site
 * 
 * Gerencia todas as configurações editáveis do AdminCP:
 * - Server Info (Season, Rates, etc.)
 * - Site Settings (Nome, Links, etc.)
 * - Limites de Reset
 */

const { executeQueryWEB, executeQueryMU } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * ✅ Obter TODAS as configurações
 */
const getAllSettings = async (req, res) => {
  try {
    // Buscar configurações do banco meuweb
    const sql = `SELECT * FROM site_settings WHERE id = 1`;
    const result = await executeQueryWEB(sql);
    
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
    
    await executeQueryWEB(checkTableSql);
    
    // Verificar se registro existe
    const checkSql = `SELECT id FROM site_settings WHERE id = 1`;
    const checkResult = await executeQueryWEB(checkSql);
    
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
    
    const result = await executeQueryWEB(sql, params);
    
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
    
    const result = await executeQueryWEB(sql);
    
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

/**
 * ✅ V564: Toggle do modo manutenção
 */
const toggleMaintenance = async (req, res) => {
  try {
    const { enabled } = req.body;

    const sql = `
      INSERT INTO site_config (config_key, config_value, config_group) 
      VALUES ('maintenanceMode', ?, 'site')
      ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)
    `;

    const result = await executeQueryWEB(sql, [enabled ? 'true' : 'false']);

    if (result.success) {
      console.log(`✅ Modo manutenção ${enabled ? 'ATIVADO' : 'DESATIVADO'}`);
      return successResponse(res, { 
        message: `Modo manutenção ${enabled ? 'ativado' : 'desativado'} com sucesso!`,
        maintenanceMode: enabled
      });
    } else {
      throw new Error('Falha ao alternar modo manutenção');
    }

  } catch (error) {
    console.error('❌ Erro ao alternar modo manutenção:', error);
    return errorResponse(res, 'Erro ao alternar modo manutenção', 500);
  }
};

/**
 * ✅ V564: Atualizar configurações de SMTP
 */
const updateSmtpSettings = async (req, res) => {
  try {
    const { host, port, user, password, from_email, from_name, enabled } = req.body;

    const updates = [
      { key: 'smtp_host', value: host, group: 'smtp' },
      { key: 'smtp_port', value: port, group: 'smtp' },
      { key: 'smtp_user', value: user, group: 'smtp' },
      { key: 'smtp_password', value: password, group: 'smtp' },
      { key: 'smtp_from_email', value: from_email, group: 'smtp' },
      { key: 'smtp_from_name', value: from_name, group: 'smtp' },
      { key: 'smtp_enabled', value: enabled ? 'true' : 'false', group: 'smtp' }
    ];

    for (const update of updates) {
      const sql = `
        INSERT INTO site_config (config_key, config_value, config_group) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)
      `;
      await executeQueryWEB(sql, [update.key, update.value, update.group]);
    }

    console.log('✅ Configurações SMTP atualizadas!');
    return successResponse(res, { message: 'Configurações SMTP atualizadas com sucesso!' });

  } catch (error) {
    console.error('❌ Erro ao atualizar configurações SMTP:', error);
    return errorResponse(res, 'Erro ao atualizar configurações SMTP', 500);
  }
};

/**
 * ✅ V564: Buscar status de manutenção (público)
 */
const getMaintenanceStatus = async (req, res) => {
  try {
    const sql = `
      SELECT config_value 
      FROM site_config 
      WHERE config_key = 'maintenanceMode'
      LIMIT 1
    `;

    const result = await executeQueryWEB(sql);

    const isInMaintenance = result.success && 
                             result.data && 
                             result.data.length > 0 && 
                             result.data[0].config_value === 'true';

    return successResponse(res, { 
      maintenanceMode: isInMaintenance,
      message: isInMaintenance ? 'Site em manutenção' : 'Site operacional'
    });

  } catch (error) {
    console.error('❌ Erro ao buscar status de manutenção:', error);
    return errorResponse(res, 'Erro ao buscar status de manutenção', 500);
  }
};

/**
 * ✅ V577: Atualizar configurações gerais
 * POST /api/admin/settings/general
 */
const updateGeneralSettings = async (req, res) => {
  try {
    const { siteName, discordLink, whatsappLink } = req.body;

    // Criar tabela se não existir
    await executeQueryWEB(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        server_name VARCHAR(255) DEFAULT 'MeuMU Online',
        discord_link VARCHAR(255),
        whatsapp_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Verificar se registro existe
    const checkResult = await executeQueryWEB(`SELECT id FROM site_settings WHERE id = 1`);
    
    if (checkResult.success && checkResult.data && checkResult.data.length > 0) {
      // UPDATE
      const sql = `
        UPDATE site_settings SET
          server_name = ?,
          discord_link = ?,
          whatsapp_link = ?,
          updated_at = NOW()
        WHERE id = 1
      `;
      await executeQueryWEB(sql, [siteName, discordLink || '', whatsappLink || '']);
    } else {
      // INSERT
      const sql = `
        INSERT INTO site_settings (server_name, discord_link, whatsapp_link)
        VALUES (?, ?, ?)
      `;
      await executeQueryWEB(sql, [siteName, discordLink || '', whatsappLink || '']);
    }

    console.log('✅ Configurações gerais atualizadas!');
    return successResponse(res, { message: 'Configurações gerais salvas com sucesso!' });

  } catch (error) {
    console.error('❌ Erro ao atualizar configurações gerais:', error);
    return errorResponse(res, 'Erro ao atualizar configurações gerais', 500);
  }
};

/**
 * ✅ V577: Atualizar configurações de banco de dados (.env)
 * POST /api/admin/settings/database
 * 
 * ⚠️ ATENÇÃO: Esta função modifica o arquivo .env
 */
const updateDatabaseSettings = async (req, res) => {
  const fs = require('fs');
  const path = require('path');

  try {
    const { dbHost, dbPort, dbName, dbUser, dbPassword } = req.body;

    // Validações
    if (!dbHost || !dbPort || !dbName) {
      return errorResponse(res, 'Host, Port e Nome do Banco são obrigatórios', 400);
    }

    // Caminho do arquivo .env
    const envPath = path.join(process.cwd(), '.env');
    
    if (!fs.existsSync(envPath)) {
      return errorResponse(res, 'Arquivo .env não encontrado', 404);
    }

    // Ler arquivo .env
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Atualizar variáveis
    const updates = {
      'DB_HOST': dbHost,
      'DB_PORT': dbPort,
      'DB_DATABASE': dbName,
    };

    // Atualizar usuário se fornecido
    if (dbUser) {
      updates['DB_USER'] = dbUser;
    }

    // Atualizar senha apenas se fornecida (não vazia)
    if (dbPassword && dbPassword.trim() !== '') {
      updates['DB_PASSWORD'] = dbPassword;
    }

    // Aplicar atualizações
    for (const [key, value] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    }

    // Salvar arquivo .env
    fs.writeFileSync(envPath, envContent, 'utf8');

    console.log('✅ Configurações de banco de dados atualizadas no .env!');
    console.log('⚠️  NOTA: Reinicie o servidor para aplicar as mudanças');

    return successResponse(res, { 
      message: 'Configurações de banco de dados salvas com sucesso!',
      warning: 'Reinicie o servidor para aplicar as mudanças'
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar configurações de banco:', error);
    return errorResponse(res, 'Erro ao atualizar configurações de banco de dados', 500);
  }
};

module.exports = {
  getAllSettings,
  updateSettings,
  getServerConfig,
  toggleMaintenance,
  updateSmtpSettings,
  getMaintenanceStatus,
  updateGeneralSettings,
  updateDatabaseSettings
};