/**
 * Controller de Informações do Servidor
 * ✅ SEASON 19 DV TEAMS - ESTRUTURA CORRETA
 */

const { executeQueryMU, executeQueryWEB, testConnection } = require('../config/database');
const { tables, columns } = require('../config/auth');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * Informações básicas do servidor
 * ✅ AGORA busca do banco de dados meuweb (site_settings)
 */
const getServerInfo = async (req, res) => {
  try {
    // Buscar configurações do banco
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
      const settings = result.data[0];
      return successResponse(res, {
        name: settings.server_name,
        version: settings.server_season,
        rates: {
          exp: settings.exp_rate,
          drop: settings.drop_rate
        },
        limits: {
          maxReset: settings.max_reset,
          maxGrandReset: settings.max_grand_reset
        }
      });
    } else {
      // Fallback para valores padrão se não existir no banco
      return successResponse(res, {
        name: process.env.SERVER_NAME || 'MeuMU Online',
        version: process.env.SERVER_VERSION || 'Season 19-2-3 - Épico',
        rates: {
          exp: process.env.SERVER_RATES_EXP || '9999x',
          drop: process.env.SERVER_RATES_DROP || '60%'
        },
        limits: {
          maxReset: parseInt(process.env.SERVER_MAX_RESET) || 500,
          maxGrandReset: parseInt(process.env.SERVER_MAX_GRAND_RESET) || 50
        }
      });
    }
  } catch (error) {
    console.error('❌ Erro ao buscar info do servidor:', error);
    return errorResponse(res, 'Erro ao buscar informações', 500);
  }
};

/**
 * Estatísticas em tempo real - COMPATÍVEL COM SEASON 6 E SEASON 19
 */
const getServerStats = async (req, res) => {
  try {
    // Total de contas
    const totalAccountsSql = `SELECT COUNT(*) as total FROM ${tables.accounts}`;
    const accountsResult = await executeQueryMU(totalAccountsSql);
    
    // Total de personagens
    const totalCharsSql = `SELECT COUNT(*) as total FROM ${tables.characterInfo}`;
    const charsResult = await executeQueryMU(totalCharsSql);
    
    // ========================================================================
    // PLAYERS ONLINE - VALIDAÇÃO DE SERVIDOR REAL
    // ========================================================================
    let playersOnline = 0;
    let serverStatus = 'offline';
    
    // 🔧 VERIFICAR SE SERVIDOR MU ESTÁ REALMENTE RODANDO
    // Verifica porta padrão do MU (55901 ConnectServer ou 55960 GameServer)
    const net = require('net');
    const checkServerPort = (port) => {
      return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(1000); // 1 segundo timeout
        
        socket.on('connect', () => {
          socket.destroy();
          resolve(true);
        });
        
        socket.on('timeout', () => {
          socket.destroy();
          resolve(false);
        });
        
        socket.on('error', () => {
          resolve(false);
        });
        
        socket.connect(port, '127.0.0.1');
      });
    };
    
    // Verificar portas do MU (55901 ConnectServer, 55960 GameServer)
    const isConnectServerOnline = await checkServerPort(55901);
    const isGameServerOnline = await checkServerPort(55960);
    
    // ✅ SE SERVIDOR ESTÁ ONLINE, buscar players
    if (isConnectServerOnline || isGameServerOnline) {
      serverStatus = 'online';
      console.log('✅ Servidor MU Online detectado (porta 55901 ou 55960)');
      
      // Tentar Season 19 primeiro (accounts_status com coluna 'online')
      try {
        const onlineSeason19Sql = `SELECT COUNT(*) as total FROM accounts_status WHERE online = 1`;
        const onlineSeason19Result = await executeQueryMU(onlineSeason19Sql);
        
        if (onlineSeason19Result.success && onlineSeason19Result.data[0]) {
          playersOnline = onlineSeason19Result.data[0].total || 0;
          console.log(`✅ ${playersOnline} players online detectado via accounts_status (Season 19)`);
        }
      } catch (err) {
        console.log('⚠️  Tabela accounts_status não existe, tentando character_info...');
        
        // Fallback para Season 6 (character_info com coluna 'online')
        try {
          const onlineSeason6Sql = `SELECT COUNT(*) as total FROM ${tables.characterInfo} WHERE online = 1`;
          const onlineSeason6Result = await executeQueryMU(onlineSeason6Sql);
          
          if (onlineSeason6Result.success && onlineSeason6Result.data[0]) {
            playersOnline = onlineSeason6Result.data[0].total || 0;
            console.log(`✅ ${playersOnline} players online detectado via character_info (Season 6)`);
          }
        } catch (err2) {
          console.error('❌ Nenhuma tabela de status online encontrada');
          playersOnline = 0;
        }
      }
    } else {
      // ❌ SERVIDOR OFFLINE - Forçar 0 players
      serverStatus = 'offline';
      playersOnline = 0;
      console.log('❌ Servidor MU Offline (portas 55901 e 55960 não respondem)');
    }
    
    // Total de guilds
    const totalGuildsSql = `SELECT COUNT(*) as total FROM ${tables.guildList}`;
    const guildsResult = await executeQueryMU(totalGuildsSql);
    
    // Personagem com mais resets (coluna 'reset' não 'ResetCount', 'name' não 'Name')
    const topResetSql = `
      SELECT name, reset 
      FROM ${tables.characterInfo} 
      ORDER BY reset DESC 
      LIMIT 1
    `;
    const topResetResult = await executeQueryMU(topResetSql);
    
    // ✅ Buscar RATES do banco (para exibir no frontend)
    let rates = {
      expRate: '9999x',
      dropRate: '60%',
      uptime: '99.9%'
    };
    
    try {
      const settingsSql = `SELECT exp_rate, drop_rate FROM site_settings WHERE id = 1`;
      const settingsResult = await executeQueryWEB(settingsSql);
      
      if (settingsResult.success && settingsResult.data && settingsResult.data.length > 0) {
        rates.expRate = settingsResult.data[0].exp_rate;
        rates.dropRate = settingsResult.data[0].drop_rate;
      }
    } catch (err) {
      console.log('⚠️  Não foi possível buscar rates do site_settings');
    }
    
    return successResponse(res, {
      totalAccounts: accountsResult.data[0]?.total || 0,
      totalCharacters: charsResult.data[0]?.total || 0,
      playersOnline: playersOnline,
      serverStatus: serverStatus,        // ✅ NOVO: Status real do servidor (online/offline)
      totalGuilds: guildsResult.data[0]?.total || 0,
      topReset: topResetResult.data[0] ? {
        Name: topResetResult.data[0].name,
        ResetCount: topResetResult.data[0].reset
      } : null,
      expRate: rates.expRate,
      dropRate: rates.dropRate,
      uptime: rates.uptime,
      lastUpdate: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    console.error('❌ Detalhes do erro:', error.message);
    return errorResponse(res, 'Erro ao buscar estatísticas', 500);
  }
};

/**
 * Status da API (health check)
 */
const getHealthStatus = async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    return res.status(dbConnected ? 200 : 503).json({
      success: true,
      status: dbConnected ? 'healthy' : 'unhealthy',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
    
  } catch (error) {
    console.error('❌ Erro no health check:', error);
    return res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
};

module.exports = {
  getServerInfo,
  getServerStats,
  getHealthStatus
};