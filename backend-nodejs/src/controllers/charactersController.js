/**
 * Controller de Personagens
 */

const { executeQueryMU, executeQueryWEB } = require('../config/database');
const { tables } = require('../config/auth');
const { getClassName, successResponse, errorResponse } = require('../utils/helpers');

/**
 * Listar personagens de uma conta
 */
const getAccountCharacters = async (req, res) => {
  try {
    const { accountId } = req.user;
    
    const sql = `
      SELECT 
        Name,
        cLevel as level,
        Class,
        Experience as exp,
        Strength as str,
        Dexterity as dex,
        Vitality as vit,
        Energy as ene,
        Leadership as cmd,
        LevelUpPoint as points,
        Money as zen,
        ResetCount as resets,
        MasterResetCount as grandResets,
        PkLevel as pkLevel,
        PkCount as pkCount,
        ctlcode as online,
        MapNumber as mapNumber,
        MapPosX as mapX,
        MapPosY as mapY
      FROM ${tables.characters}
      WHERE AccountID = ?
      ORDER BY Name ASC
    `;
    
    const result = await executeQueryMU(sql, [accountId]);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao buscar personagens', 500);
    }
    
    const characters = result.data.map(char => ({
      name: char.Name,
      level: char.level,
      class: getClassName(char.Class),
      classNumber: char.Class,
      exp: char.exp,
      stats: {
        strength: char.str,
        dexterity: char.dex,
        vitality: char.vit,
        energy: char.ene,
        command: char.cmd
      },
      points: char.points,
      zen: char.zen,
      resets: char.resets,
      grandResets: char.grandResets,
      pk: {
        level: char.pkLevel,
        kills: char.pkCount
      },
      online: char.online === 1,
      location: {
        map: char.mapNumber,
        x: char.mapX,
        y: char.mapY
      }
    }));
    
    return successResponse(res, characters);
    
  } catch (error) {
    console.error('❌ Erro ao buscar personagens:', error);
    return errorResponse(res, 'Erro ao buscar personagens', 500);
  }
};

/**
 * Obter detalhes de um personagem específico
 */
const getCharacterDetails = async (req, res) => {
  try {
    const { name } = req.params;
    const { accountId } = req.user;
    
    const sql = `
      SELECT 
        Name,
        AccountID,
        cLevel as level,
        Class,
        Experience as exp,
        Strength as str,
        Dexterity as dex,
        Vitality as vit,
        Energy as ene,
        Leadership as cmd,
        LevelUpPoint as points,
        Money as zen,
        ResetCount as resets,
        MasterResetCount as grandResets,
        PkLevel as pkLevel,
        PkCount as pkCount,
        ctlcode as online
      FROM ${tables.characters}
      WHERE Name = ? AND AccountID = ?
    `;
    
    const result = await executeQueryMU(sql, [name, accountId]);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao buscar personagem', 500);
    }
    
    if (result.data.length === 0) {
      return errorResponse(res, 'Personagem não encontrado ou não pertence a esta conta', 404);
    }
    
    const char = result.data[0];
    
    return successResponse(res, {
      name: char.Name,
      level: char.level,
      class: getClassName(char.Class),
      classNumber: char.Class,
      exp: char.exp,
      stats: {
        strength: char.str,
        dexterity: char.dex,
        vitality: char.vit,
        energy: char.ene,
        command: char.cmd
      },
      points: char.points,
      zen: char.zen,
      resets: char.resets,
      grandResets: char.grandResets,
      pk: {
        level: char.pkLevel,
        kills: char.pkCount
      },
      online: char.online === 1
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar personagem:', error);
    return errorResponse(res, 'Erro ao buscar personagem', 500);
  }
};

/**
 * Distribuir pontos de status
 */
const distributePoints = async (req, res) => {
  try {
    const { name } = req.params;
    const { accountId } = req.user;
    const { strength, dexterity, vitality, energy, command } = req.body;
    
    // Calcular total de pontos a distribuir
    const totalPoints = (strength || 0) + (dexterity || 0) + (vitality || 0) + (energy || 0) + (command || 0);
    
    if (totalPoints === 0) {
      return errorResponse(res, 'Nenhum ponto para distribuir', 400);
    }
    
    // Verificar se o personagem existe e pertence à conta
    const checkSql = `
      SELECT LevelUpPoint as points, ctlcode as online
      FROM ${tables.characters}
      WHERE Name = ? AND AccountID = ?
    `;
    
    const checkResult = await executeQueryMU(checkSql, [name, accountId]);
    
    if (!checkResult.success || checkResult.data.length === 0) {
      return errorResponse(res, 'Personagem não encontrado', 404);
    }
    
    const character = checkResult.data[0];
    
    // Verificar se está online
    if (character.online === 1) {
      return errorResponse(res, 'Não é possível distribuir pontos com personagem online', 400);
    }
    
    // Verificar se tem pontos suficientes
    if (character.points < totalPoints) {
      return errorResponse(res, 'Pontos insuficientes', 400);
    }
    
    // Atualizar stats
    const updateSql = `
      UPDATE ${tables.characters}
      SET 
        Strength = Strength + ?,
        Dexterity = Dexterity + ?,
        Vitality = Vitality + ?,
        Energy = Energy + ?,
        Leadership = Leadership + ?,
        LevelUpPoint = LevelUpPoint - ?
      WHERE Name = ? AND AccountID = ?
    `;
    
    const updateResult = await executeQueryMU(updateSql, [
      strength || 0,
      dexterity || 0,
      vitality || 0,
      energy || 0,
      command || 0,
      totalPoints,
      name,
      accountId
    ]);
    
    if (!updateResult.success) {
      return errorResponse(res, 'Erro ao distribuir pontos', 500);
    }
    
    return successResponse(res, {
      pointsDistributed: totalPoints,
      stats: {
        strength: strength || 0,
        dexterity: dexterity || 0,
        vitality: vitality || 0,
        energy: energy || 0,
        command: command || 0
      }
    }, 'Pontos distribuídos com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao distribuir pontos:', error);
    return errorResponse(res, 'Erro ao distribuir pontos', 500);
  }
};

/**
 * Realizar reset de personagem
 */
const resetCharacter = async (req, res) => {
  try {
    const { name } = req.params;
    const { accountId } = req.user;
    
    // Verificar se o personagem existe e pode resetar
    const checkSql = `
      SELECT 
        cLevel as level,
        ResetCount as resets,
        ctlcode as online,
        Money as zen
      FROM ${tables.characters}
      WHERE Name = ? AND AccountID = ?
    `;
    
    const checkResult = await executeQueryMU(checkSql, [name, accountId]);
    
    if (!checkResult.success || checkResult.data.length === 0) {
      return errorResponse(res, 'Personagem não encontrado', 404);
    }
    
    const character = checkResult.data[0];
    
    // Verificar se está online
    if (character.online === 1) {
      return errorResponse(res, 'Não é possível resetar personagem online', 400);
    }
    
    // Verificar requisitos de reset (level 400)
    const requiredLevel = 400;
    if (character.level < requiredLevel) {
      return errorResponse(res, `Level mínimo para reset: ${requiredLevel}`, 400);
    }
    
    // Custo de reset (pode ser configurável)
    const resetCost = 5000000; // 5kk zen
    if (character.zen < resetCost) {
      return errorResponse(res, 'Zen insuficiente para reset', 400);
    }
    
    // Realizar reset
    const resetSql = `
      UPDATE ${tables.characters}
      SET 
        cLevel = 1,
        Experience = 0,
        ResetCount = ResetCount + 1,
        LevelUpPoint = LevelUpPoint + 500,
        Money = Money - ?
      WHERE Name = ? AND AccountID = ?
    `;
    
    const resetResult = await executeQueryMU(resetSql, [resetCost, name, accountId]);
    
    if (!resetResult.success) {
      return errorResponse(res, 'Erro ao realizar reset', 500);
    }
    
    return successResponse(res, {
      newResetCount: character.resets + 1,
      bonusPoints: 500,
      zenSpent: resetCost
    }, 'Reset realizado com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao resetar personagem:', error);
    return errorResponse(res, 'Erro ao realizar reset', 500);
  }
};

module.exports = {
  getAccountCharacters,
  getCharacterDetails,
  distributePoints,
  resetCharacter
};