/**
 * 🎮 AdminCP - Character Management Routes
 * Edição completa de personagens
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');

/**
 * GET /api/admin/characters
 * Lista todos os personagens com filtros
 */
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 20, accountId, minLevel } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        Name as name,
        AccountID as accountId,
        cLevel as level,
        Class as class,
        LevelUpPoint as points,
        Strength as strength,
        Dexterity as dexterity,
        Vitality as vitality,
        Energy as energy,
        Leadership as command,
        Resets as resets,
        MasterResets as masterResets,
        Money as zen,
        MapNumber as map,
        MapPosX as x,
        MapPosY as y,
        PkLevel as pkLevel,
        CtlCode as ctlCode
      FROM Character
      WHERE 1=1
    `;
    
    const params = [];

    if (search) {
      query += ` AND (Name LIKE ? OR AccountID LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (accountId) {
      query += ` AND AccountID = ?`;
      params.push(accountId);
    }

    if (minLevel) {
      query += ` AND cLevel >= ?`;
      params.push(parseInt(minLevel));
    }

    query += ` ORDER BY cLevel DESC, Resets DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [characters] = await db.query(query, params);

    // Total count
    let countQuery = 'SELECT COUNT(*) as total FROM Character WHERE 1=1';
    const countParams = [];
    
    if (search) {
      countQuery += ` AND (Name LIKE ? OR AccountID LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (accountId) {
      countQuery += ` AND AccountID = ?`;
      countParams.push(accountId);
    }

    if (minLevel) {
      countQuery += ` AND cLevel >= ?`;
      countParams.push(parseInt(minLevel));
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: characters,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar personagens',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/characters/:name
 * Detalhes de um personagem específico
 */
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;

    const [characters] = await db.query(`
      SELECT 
        Name as name,
        AccountID as accountId,
        cLevel as level,
        Class as class,
        Experience as experience,
        LevelUpPoint as points,
        Strength as strength,
        Dexterity as dexterity,
        Vitality as vitality,
        Energy as energy,
        Leadership as command,
        Resets as resets,
        MasterResets as masterResets,
        Money as zen,
        MapNumber as map,
        MapPosX as x,
        MapPosY as y,
        PkLevel as pkLevel,
        PkCount as pkCount,
        PkTime as pkTime,
        CtlCode as ctlCode,
        MasterLevel as masterLevel,
        MasterExperience as masterExperience,
        MasterPoint as masterPoints
      FROM Character
      WHERE Name = ?
    `, [name]);

    if (characters.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Personagem não encontrado'
      });
    }

    // Get inventory (simplified)
    const [inventory] = await db.query(`
      SELECT Items as items
      FROM Character
      WHERE Name = ?
    `, [name]);

    res.json({
      success: true,
      data: {
        character: characters[0],
        inventory: inventory[0] || null
      }
    });

  } catch (error) {
    console.error('Error fetching character details:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar detalhes do personagem',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/characters/:name
 * Atualiza informações de um personagem
 */
router.put('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { 
      level, points, strength, dexterity, vitality, energy, command,
      zen, resets, masterResets, pkLevel, ctlCode
    } = req.body;

    const updates = [];
    const params = [];

    if (level !== undefined) {
      updates.push('cLevel = ?');
      params.push(level);
    }

    if (points !== undefined) {
      updates.push('LevelUpPoint = ?');
      params.push(points);
    }

    if (strength !== undefined) {
      updates.push('Strength = ?');
      params.push(strength);
    }

    if (dexterity !== undefined) {
      updates.push('Dexterity = ?');
      params.push(dexterity);
    }

    if (vitality !== undefined) {
      updates.push('Vitality = ?');
      params.push(vitality);
    }

    if (energy !== undefined) {
      updates.push('Energy = ?');
      params.push(energy);
    }

    if (command !== undefined) {
      updates.push('Leadership = ?');
      params.push(command);
    }

    if (zen !== undefined) {
      updates.push('Money = ?');
      params.push(zen);
    }

    if (resets !== undefined) {
      updates.push('Resets = ?');
      params.push(resets);
    }

    if (masterResets !== undefined) {
      updates.push('MasterResets = ?');
      params.push(masterResets);
    }

    if (pkLevel !== undefined) {
      updates.push('PkLevel = ?');
      params.push(pkLevel);
    }

    if (ctlCode !== undefined) {
      updates.push('CtlCode = ?');
      params.push(ctlCode);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma atualização fornecida'
      });
    }

    params.push(name);

    await db.query(`
      UPDATE Character
      SET ${updates.join(', ')}
      WHERE Name = ?
    `, params);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'character_update', ?, NOW())
    `, [req.user.username, JSON.stringify({ characterName: name, updates: req.body })]);

    res.json({
      success: true,
      message: 'Personagem atualizado com sucesso'
    });

  } catch (error) {
    console.error('Error updating character:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar personagem',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/characters/:name/teleport
 * Teleportar personagem para uma localização
 */
router.post('/:name/teleport', async (req, res) => {
  try {
    const { name } = req.params;
    const { map, x, y } = req.body;

    await db.query(`
      UPDATE Character
      SET MapNumber = ?, MapPosX = ?, MapPosY = ?
      WHERE Name = ?
    `, [map, x, y, name]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'character_teleport', ?, NOW())
    `, [req.user.username, JSON.stringify({ characterName: name, map, x, y })]);

    res.json({
      success: true,
      message: 'Personagem teleportado com sucesso'
    });

  } catch (error) {
    console.error('Error teleporting character:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao teleportar personagem',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/characters/:name/reset
 * Resetar personagem (admin reset)
 */
router.post('/:name/reset', async (req, res) => {
  try {
    const { name } = req.params;
    const { type = 'normal' } = req.body; // normal or master

    if (type === 'master') {
      await db.query(`
        UPDATE Character
        SET MasterResets = MasterResets + 1,
            MasterLevel = 0,
            MasterExperience = 0,
            MasterPoint = 0
        WHERE Name = ?
      `, [name]);
    } else {
      await db.query(`
        UPDATE Character
        SET Resets = Resets + 1,
            cLevel = 1,
            Experience = 0,
            LevelUpPoint = 0
        WHERE Name = ?
      `, [name]);
    }

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'character_reset', ?, NOW())
    `, [req.user.username, JSON.stringify({ characterName: name, resetType: type })]);

    res.json({
      success: true,
      message: `Personagem resetado com sucesso (${type})`
    });

  } catch (error) {
    console.error('Error resetting character:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao resetar personagem',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/characters/:name
 * Deletar personagem
 */
router.delete('/:name', async (req, res) => {
  try {
    const { name } = req.params;

    await db.query(`
      DELETE FROM Character
      WHERE Name = ?
    `, [name]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'character_delete', ?, NOW())
    `, [req.user.username, JSON.stringify({ characterName: name })]);

    res.json({
      success: true,
      message: 'Personagem deletado com sucesso'
    });

  } catch (error) {
    console.error('Error deleting character:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar personagem',
      error: error.message
    });
  }
});

module.exports = router;
