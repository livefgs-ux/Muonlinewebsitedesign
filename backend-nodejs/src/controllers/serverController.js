/**
 * Controller de Informações do Servidor
 */

const { executeQueryMU, testConnection } = require('../config/database');
const { tables } = require('../config/auth');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * Informações básicas do servidor
 */
const getServerInfo = async (req, res) => {
  try {
    return successResponse(res, {
      name: process.env.SERVER_NAME || 'MeuMU Online',
      version: process.env.SERVER_VERSION || 'Season 19-2-3 - Épico',
      rates: {
        exp: process.env.SERVER_RATES_EXP || '1000x',
        drop: process.env.SERVER_RATES_DROP || '50%'
      },
      limits: {
        maxReset: parseInt(process.env.SERVER_MAX_RESET) || 500,
        maxGrandReset: parseInt(process.env.SERVER_MAX_GRAND_RESET) || 50
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar info do servidor:', error);
    return errorResponse(res, 'Erro ao buscar informações', 500);
  }
};

/**
 * Estatísticas em tempo real - USANDO NOMES CORRETOS DAS COLUNAS
 */
const getServerStats = async (req, res) => {
  try {
    // Total de contas
    const totalAccountsSql = `SELECT COUNT(*) as total FROM ${tables.accounts}`;
    const accountsResult = await executeQueryMU(totalAccountsSql);
    
    // Total de personagens
    const totalCharsSql = `SELECT COUNT(*) as total FROM ${tables.characters}`;
    const charsResult = await executeQueryMU(totalCharsSql);
    
    // Players online (coluna 'online' não 'ctlcode')
    const onlineSql = `SELECT COUNT(*) as total FROM ${tables.characters} WHERE online = 1`;
    const onlineResult = await executeQueryMU(onlineSql);
    
    // Total de guilds
    const totalGuildsSql = `SELECT COUNT(*) as total FROM ${tables.guild}`;
    const guildsResult = await executeQueryMU(totalGuildsSql);
    
    // Personagem com mais resets (coluna 'reset' não 'ResetCount', 'name' não 'Name')
    const topResetSql = `
      SELECT name, reset 
      FROM ${tables.characters} 
      ORDER BY reset DESC 
      LIMIT 1
    `;
    const topResetResult = await executeQueryMU(topResetSql);
    
    return successResponse(res, {
      totalAccounts: accountsResult.data[0]?.total || 0,
      totalCharacters: charsResult.data[0]?.total || 0,
      playersOnline: onlineResult.data[0]?.total || 0,
      totalGuilds: guildsResult.data[0]?.total || 0,
      topReset: topResetResult.data[0] ? {
        Name: topResetResult.data[0].name,
        ResetCount: topResetResult.data[0].reset
      } : null,
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