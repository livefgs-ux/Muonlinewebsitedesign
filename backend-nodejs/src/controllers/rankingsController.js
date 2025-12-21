/**
 * Controller de Rankings
 */

const { executeQuery } = require('../config/database');
const { tables } = require('../config/auth');
const { getClassName, successResponse, errorResponse } = require('../utils/helpers');

/**
 * Top Resets
 */
const getTopResets = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const sql = `
      SELECT 
        Name,
        cLevel as level,
        Class,
        ResetCount as resets,
        MasterResetCount as grandResets,
        PkLevel as pkLevel,
        ctlcode as online
      FROM ${tables.characters}
      ORDER BY ResetCount DESC, MasterResetCount DESC, cLevel DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await executeQuery(sql, [limit, offset]);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao buscar ranking de resets', 500);
    }
    
    const rankings = result.data.map((char, index) => ({
      position: offset + index + 1,
      name: char.Name,
      level: char.level,
      class: getClassName(char.Class),
      classNumber: char.Class,
      resets: char.resets,
      grandResets: char.grandResets,
      pkLevel: char.pkLevel,
      online: char.online === 1
    }));
    
    return successResponse(res, rankings);
    
  } catch (error) {
    console.error('❌ Erro no ranking de resets:', error);
    return errorResponse(res, 'Erro ao buscar ranking', 500);
  }
};

/**
 * Top PK (Player Killers)
 */
const getTopPK = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const sql = `
      SELECT 
        Name,
        cLevel as level,
        Class,
        PkLevel as pkLevel,
        PkCount as kills,
        ResetCount as resets,
        ctlcode as online
      FROM ${tables.characters}
      ORDER BY PkLevel DESC, PkCount DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await executeQuery(sql, [limit, offset]);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao buscar ranking de PK', 500);
    }
    
    const rankings = result.data.map((char, index) => ({
      position: offset + index + 1,
      name: char.Name,
      level: char.level,
      class: getClassName(char.Class),
      classNumber: char.Class,
      pkLevel: char.pkLevel,
      kills: char.kills,
      resets: char.resets,
      online: char.online === 1
    }));
    
    return successResponse(res, rankings);
    
  } catch (error) {
    console.error('❌ Erro no ranking de PK:', error);
    return errorResponse(res, 'Erro ao buscar ranking', 500);
  }
};

/**
 * Top Level
 */
const getTopLevel = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const sql = `
      SELECT 
        Name,
        cLevel as level,
        Class,
        ResetCount as resets,
        MasterResetCount as grandResets,
        Experience as exp,
        ctlcode as online
      FROM ${tables.characters}
      ORDER BY cLevel DESC, Experience DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await executeQuery(sql, [limit, offset]);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao buscar ranking de level', 500);
    }
    
    const rankings = result.data.map((char, index) => ({
      position: offset + index + 1,
      name: char.Name,
      level: char.level,
      class: getClassName(char.Class),
      classNumber: char.Class,
      resets: char.resets,
      grandResets: char.grandResets,
      exp: char.exp,
      online: char.online === 1
    }));
    
    return successResponse(res, rankings);
    
  } catch (error) {
    console.error('❌ Erro no ranking de level:', error);
    return errorResponse(res, 'Erro ao buscar ranking', 500);
  }
};

/**
 * Top Guilds
 */
const getTopGuilds = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const sql = `
      SELECT 
        g.G_Name as name,
        g.G_Master as master,
        g.G_Score as score,
        g.G_Mark as emblem,
        COUNT(gm.Name) as members
      FROM ${tables.guild} g
      LEFT JOIN ${tables.guildMember} gm ON g.G_Name = gm.G_Name
      GROUP BY g.G_Name, g.G_Master, g.G_Score, g.G_Mark
      ORDER BY g.G_Score DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await executeQuery(sql, [limit, offset]);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao buscar ranking de guilds', 500);
    }
    
    const rankings = result.data.map((guild, index) => ({
      position: offset + index + 1,
      name: guild.name,
      master: guild.master,
      score: guild.score,
      members: guild.members,
      emblem: guild.emblem
    }));
    
    return successResponse(res, rankings);
    
  } catch (error) {
    console.error('❌ Erro no ranking de guilds:', error);
    return errorResponse(res, 'Erro ao buscar ranking', 500);
  }
};

/**
 * Buscar posição de um personagem específico no ranking
 */
const getCharacterRank = async (req, res) => {
  try {
    const { name } = req.params;
    const { type } = req.query; // resets, pk, level
    
    let sql = '';
    
    switch (type) {
      case 'resets':
        sql = `
          SELECT COUNT(*) + 1 as position
          FROM ${tables.characters}
          WHERE (ResetCount > (SELECT ResetCount FROM ${tables.characters} WHERE Name = ?))
             OR (ResetCount = (SELECT ResetCount FROM ${tables.characters} WHERE Name = ?)
                 AND MasterResetCount > (SELECT MasterResetCount FROM ${tables.characters} WHERE Name = ?))
             OR (ResetCount = (SELECT ResetCount FROM ${tables.characters} WHERE Name = ?)
                 AND MasterResetCount = (SELECT MasterResetCount FROM ${tables.characters} WHERE Name = ?)
                 AND cLevel > (SELECT cLevel FROM ${tables.characters} WHERE Name = ?))
        `;
        break;
        
      case 'pk':
        sql = `
          SELECT COUNT(*) + 1 as position
          FROM ${tables.characters}
          WHERE (PkLevel > (SELECT PkLevel FROM ${tables.characters} WHERE Name = ?))
             OR (PkLevel = (SELECT PkLevel FROM ${tables.characters} WHERE Name = ?)
                 AND PkCount > (SELECT PkCount FROM ${tables.characters} WHERE Name = ?))
        `;
        break;
        
      case 'level':
      default:
        sql = `
          SELECT COUNT(*) + 1 as position
          FROM ${tables.characters}
          WHERE (cLevel > (SELECT cLevel FROM ${tables.characters} WHERE Name = ?))
             OR (cLevel = (SELECT cLevel FROM ${tables.characters} WHERE Name = ?)
                 AND Experience > (SELECT Experience FROM ${tables.characters} WHERE Name = ?))
        `;
        break;
    }
    
    const params = type === 'resets' 
      ? [name, name, name, name, name, name]
      : [name, name, name];
    
    const result = await executeQuery(sql, params);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao buscar posição no ranking', 500);
    }
    
    return successResponse(res, {
      name,
      type,
      position: result.data[0].position
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar posição no ranking:', error);
    return errorResponse(res, 'Erro ao buscar posição', 500);
  }
};

module.exports = {
  getTopResets,
  getTopPK,
  getTopLevel,
  getTopGuilds,
  getCharacterRank
};
