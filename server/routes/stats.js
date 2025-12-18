// Rotas para estatísticas em tempo real do MU Online
import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET /api/stats/online - Retorna players online em tempo real
router.get('/online', async (req, res) => {
  try {
    // Consulta REAL de players online
    // Tabela MEMB_STAT armazena status de conexão dos usuários
    const [rows] = await pool.query(`
      SELECT COUNT(*) as playersOnline 
      FROM MEMB_STAT 
      WHERE ConnectStat = 1
    `);

    const playersOnline = rows[0]?.playersOnline || 0;

    res.json({
      success: true,
      data: {
        playersOnline,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao buscar players online:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar players online',
      playersOnline: 0
    });
  }
});

// GET /api/stats/server - Retorna estatísticas gerais do servidor
router.get('/server', async (req, res) => {
  try {
    // Total de contas registradas
    const [accountsResult] = await pool.query(`
      SELECT COUNT(*) as totalAccounts 
      FROM MEMB_INFO
    `);

    // Total de personagens criados
    const [charsResult] = await pool.query(`
      SELECT COUNT(*) as totalCharacters 
      FROM Character
    `);

    // Total de guilds
    const [guildsResult] = await pool.query(`
      SELECT COUNT(*) as totalGuilds 
      FROM Guild
    `);

    // Players online
    const [onlineResult] = await pool.query(`
      SELECT COUNT(*) as playersOnline 
      FROM MEMB_STAT 
      WHERE ConnectStat = 1
    `);

    res.json({
      success: true,
      data: {
        totalAccounts: accountsResult[0]?.totalAccounts || 0,
        totalCharacters: charsResult[0]?.totalCharacters || 0,
        totalGuilds: guildsResult[0]?.totalGuilds || 0,
        playersOnline: onlineResult[0]?.playersOnline || 0,
        serverStatus: 'online', // Pode ser verificado com lógica adicional
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do servidor:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas do servidor'
    });
  }
});

// GET /api/stats/castle-siege - Retorna informações do Castle Siege
router.get('/castle-siege', async (req, res) => {
  try {
    // Busca informações do Castle Siege da tabela MuCastleData
    const [castleData] = await pool.query(`
      SELECT 
        SIEGE_START_DATE,
        SIEGE_END_DATE,
        SIEGE_GUILDLIST_SETTED,
        CASTLE_OCCUPY
      FROM MuCastleData
      WHERE MAP_SVR_GROUP = 0
      LIMIT 1
    `);

    // Busca guild dona do castelo
    let ownerGuild = null;
    if (castleData[0]?.CASTLE_OCCUPY) {
      const [guildInfo] = await pool.query(`
        SELECT G_Name 
        FROM Guild 
        WHERE G_Name = ?
      `, [castleData[0].CASTLE_OCCUPY]);
      
      ownerGuild = guildInfo[0]?.G_Name || null;
    }

    res.json({
      success: true,
      data: {
        startDate: castleData[0]?.SIEGE_START_DATE || null,
        endDate: castleData[0]?.SIEGE_END_DATE || null,
        ownerGuild: ownerGuild,
        registrationOpen: castleData[0]?.SIEGE_GUILDLIST_SETTED === 1,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dados do Castle Siege:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar dados do Castle Siege'
    });
  }
});

export default router;
