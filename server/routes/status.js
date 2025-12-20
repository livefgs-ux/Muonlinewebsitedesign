/**
 * 📡 API de Status do Servidor MU Online
 * 
 * Este endpoint retorna informações REAIS do banco de dados:
 * - Players online (ConnectStat = 1 na tabela MEMB_STAT)
 * - Total de contas (MEMB_INFO)
 * - Total de personagens (Character)
 * - Status do servidor
 */

import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

/**
 * GET /api/status
 * Retorna status completo do servidor MU Online
 */
router.get('/', async (req, res) => {
  try {
    // Consulta players online (TABELA REAL: MEMB_STAT)
    const [onlineResult] = await pool.query(`
      SELECT COUNT(*) AS online 
      FROM MEMB_STAT 
      WHERE ConnectStat = 1
    `);

    // Total de contas registradas (TABELA REAL: MEMB_INFO)
    const [accountsResult] = await pool.query(`
      SELECT COUNT(*) AS total 
      FROM MEMB_INFO
    `);

    // Total de personagens criados (TABELA REAL: Character)
    const [charsResult] = await pool.query(`
      SELECT COUNT(*) AS total 
      FROM Character
    `);

    // Monta resposta com dados REAIS
    const data = {
      status: 'Online',
      onlinePlayers: onlineResult[0].online || 0,
      totalAccounts: accountsResult[0].total || 0,
      totalCharacters: charsResult[0].total || 0,
      timestamp: new Date().toISOString(),
      server: {
        name: 'MeuMU Online',
        season: '19-2-3',
        mode: 'Épico'
      }
    };

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('❌ Erro ao buscar status do servidor:', error);
    
    res.status(500).json({
      success: false,
      error: 'Falha ao obter status do servidor',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/status/detailed
 * Retorna status detalhado com informações adicionais
 */
router.get('/detailed', async (req, res) => {
  try {
    // Players online por servidor/channel
    const [onlineByServer] = await pool.query(`
      SELECT ServerName, COUNT(*) AS count
      FROM MEMB_STAT 
      WHERE ConnectStat = 1
      GROUP BY ServerName
    `);

    // Top 5 guilds com mais membros online
    const [topGuilds] = await pool.query(`
      SELECT g.G_Name AS guildName, COUNT(c.Name) AS membersOnline
      FROM Guild g
      INNER JOIN GuildMember gm ON g.G_Name = gm.G_Name
      INNER JOIN Character c ON gm.Name = c.Name
      INNER JOIN MEMB_STAT ms ON c.AccountID = ms.memb___id
      WHERE ms.ConnectStat = 1
      GROUP BY g.G_Name
      ORDER BY membersOnline DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        onlineByServer: onlineByServer || [],
        topActiveGuilds: topGuilds || [],
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar status detalhado:', error);
    
    res.status(500).json({
      success: false,
      error: 'Falha ao obter status detalhado',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
