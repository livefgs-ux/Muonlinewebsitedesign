// Rotas para rankings em tempo real do MU Online
import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET /api/rankings/players - Top players por nível/resets
router.get('/players', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const orderBy = req.query.orderBy || 'level'; // level, resets, kills

    let orderColumn = 'cLevel';
    if (orderBy === 'resets') orderColumn = 'resets';
    else if (orderBy === 'kills') orderColumn = 'PkCount';

    // Consulta REAL da tabela Character
    const [rows] = await pool.query(`
      SELECT 
        Name as name,
        cLevel as level,
        COALESCE(resets, 0) as resets,
        Class as characterClass,
        PkCount as kills,
        COALESCE(CtlCode, 0) as ctlCode,
        AccountID as accountId
      FROM Character
      WHERE CtlCode = 0
      ORDER BY ${orderColumn} DESC, cLevel DESC
      LIMIT ?
    `, [limit]);

    // Mapeia classe do char
    const getClassName = (classCode) => {
      const classes = {
        0: 'Dark Wizard', 16: 'Soul Master', 32: 'Grand Master',
        1: 'Dark Knight', 17: 'Blade Knight', 33: 'Blade Master',
        2: 'Elf', 18: 'Muse Elf', 34: 'High Elf',
        3: 'Magic Gladiator', 19: 'Duel Master',
        4: 'Dark Lord', 20: 'Lord Emperor',
        5: 'Summoner', 21: 'Bloody Summoner', 37: 'Dimension Master',
        6: 'Rage Fighter', 22: 'Fist Master'
      };
      return classes[classCode] || 'Unknown';
    };

    const rankings = rows.map((row, index) => ({
      rank: index + 1,
      name: row.name,
      level: row.level,
      resets: row.resets,
      class: getClassName(row.characterClass),
      kills: row.kills,
      accountId: row.accountId
    }));

    res.json({
      success: true,
      data: {
        rankings,
        total: rankings.length,
        orderBy,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao buscar ranking de players:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar ranking de players'
    });
  }
});

// GET /api/rankings/guilds - Top guilds
router.get('/guilds', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    // Consulta REAL da tabela Guild
    const [rows] = await pool.query(`
      SELECT 
        G_Name as name,
        G_Master as master,
        G_Score as score,
        G_Count as memberCount,
        G_Notice as notice
      FROM Guild
      ORDER BY G_Score DESC, G_Count DESC
      LIMIT ?
    `, [limit]);

    const rankings = rows.map((row, index) => ({
      rank: index + 1,
      name: row.name,
      master: row.master,
      score: row.score || 0,
      members: row.memberCount || 0,
      notice: row.notice || ''
    }));

    res.json({
      success: true,
      data: {
        rankings,
        total: rankings.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao buscar ranking de guilds:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar ranking de guilds'
    });
  }
});

// GET /api/rankings/killers - Top PKs (Player Killers)
router.get('/killers', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const [rows] = await pool.query(`
      SELECT 
        Name as name,
        cLevel as level,
        COALESCE(resets, 0) as resets,
        Class as characterClass,
        PkCount as kills,
        PkLevel as pkLevel
      FROM Character
      WHERE CtlCode = 0 AND PkCount > 0
      ORDER BY PkCount DESC, cLevel DESC
      LIMIT ?
    `, [limit]);

    const getClassName = (classCode) => {
      const classes = {
        0: 'Dark Wizard', 16: 'Soul Master', 32: 'Grand Master',
        1: 'Dark Knight', 17: 'Blade Knight', 33: 'Blade Master',
        2: 'Elf', 18: 'Muse Elf', 34: 'High Elf',
        3: 'Magic Gladiator', 19: 'Duel Master',
        4: 'Dark Lord', 20: 'Lord Emperor',
        5: 'Summoner', 21: 'Bloody Summoner', 37: 'Dimension Master',
        6: 'Rage Fighter', 22: 'Fist Master'
      };
      return classes[classCode] || 'Unknown';
    };

    const rankings = rows.map((row, index) => ({
      rank: index + 1,
      name: row.name,
      level: row.level,
      resets: row.resets,
      class: getClassName(row.characterClass),
      kills: row.kills,
      pkLevel: row.pkLevel || 0
    }));

    res.json({
      success: true,
      data: {
        rankings,
        total: rankings.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao buscar ranking de killers:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar ranking de killers'
    });
  }
});

// GET /api/rankings/gens - Ranking Gens (Duprian vs Vanert)
router.get('/gens', async (req, res) => {
  try {
    // Consulta estatísticas do Gens
    const [duprian] = await pool.query(`
      SELECT COUNT(*) as members
      FROM Character
      WHERE CtlCode = 0 AND G_Family = 1
    `);

    const [vanert] = await pool.query(`
      SELECT COUNT(*) as members
      FROM Character
      WHERE CtlCode = 0 AND G_Family = 2
    `);

    res.json({
      success: true,
      data: {
        duprian: {
          members: duprian[0]?.members || 0,
          percentage: 0 // Calcular depois
        },
        vanert: {
          members: vanert[0]?.members || 0,
          percentage: 0
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao buscar ranking Gens:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar ranking Gens'
    });
  }
});

export default router;
