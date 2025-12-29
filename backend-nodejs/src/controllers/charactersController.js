/**
 * Controller de Personagens
 * ✅ SEASON 19 DV TEAMS - ESTRUTURA REAL DO MUONLINE.SQL
 * Fonte: muonline.sql dump completo (2025-12-29)
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
    
    console.log(`📊 Buscando personagens da conta: ${accountId}`);
    
    // ========================================================================
    // SEASON 19 DV TEAMS - ESTRUTURA REAL DO MUONLINE.SQL
    // ========================================================================
    // Tabela character_info:
    //   - guid (PK)
    //   - account_id (FK → accounts.guid, mas busca por account name!)
    //   - name
    //   - race (class)
    //   - level, level_master, level_majestic
    //   - money (zen)
    //   - reset (⚠️ SÓ TEM "reset", NÃO TEM "greset"!)
    //   - points, points_master, points_majestic
    //   - strength, agility (NÃO dexterity!), vitality, energy, leadership
    //   - pk_count, pk_level
    //   - online (0/1)
    // ========================================================================
    
    // Primeiro, buscar o GUID da conta pelo username
    const getGuidSql = `SELECT guid FROM accounts WHERE account = ?`;
    const guidResult = await executeQueryMU(getGuidSql, [accountId]);
    
    if (!guidResult.success || guidResult.data.length === 0) {
      console.log(`❌ Conta não encontrada: ${accountId}`);
      return successResponse(res, []); // Retorna array vazio ao invés de erro
    }
    
    const accountGuid = guidResult.data[0].guid;
    console.log(`✅ Account GUID: ${accountGuid}`);
    
    const sql = `
      SELECT 
        name,
        account_id,
        race as class,
        level,
        level_master as masterLevel,
        level_majestic as majesticLevel,
        money as zen,
        reset as resets,
        points,
        points_master as masterPoints,
        points_majestic as majesticPoints,
        strength as str,
        agility as dex,
        vitality as vit,
        energy as ene,
        leadership as cmd,
        pk_count as pkCount,
        pk_level as pkLevel,
        online
      FROM ${tables.characterInfo}
      WHERE account_id = ?
      ORDER BY name ASC
    `;
    
    const result = await executeQueryMU(sql, [accountGuid]);
    
    if (!result.success) {
      console.error(`❌ Erro SQL ao buscar personagens:`, result.error);
      return errorResponse(res, 'Erro ao buscar personagens', 500);
    }
    
    console.log(`✅ Encontrados ${result.data.length} personagens`);
    
    const characters = result.data.map(char => ({
      name: char.name,
      level: char.level,
      masterLevel: char.masterLevel || 0,
      majesticLevel: char.majesticLevel || 0,
      class: getClassName(char.class),
      classNumber: char.class,
      stats: {
        strength: char.str,
        dexterity: char.dex,
        vitality: char.vit,
        energy: char.ene,
        command: char.cmd
      },
      points: char.points,
      masterPoints: char.masterPoints || 0,
      majesticPoints: char.majesticPoints || 0,
      zen: char.zen,
      resets: char.resets,
      pk: {
        level: char.pkLevel,
        kills: char.pkCount
      },
      online: char.online === 1
    }));
    
    return successResponse(res, characters);
    
  } catch (error) {
    console.error('❌ Exception ao buscar personagens:', error);
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
    
    console.log(`📊 Buscando detalhes do personagem: ${name} (conta: ${accountId})`);
    
    const sql = `
      SELECT 
        name,
        account_id,
        race as class,
        level,
        level_master as masterLevel,
        level_majestic as majesticLevel,
        money as zen,
        reset as resets,
        points,
        points_master as masterPoints,
        points_majestic as majesticPoints,
        strength as str,
        agility as dex,
        vitality as vit,
        energy as ene,
        leadership as cmd,
        pk_count as pkCount,
        pk_level as pkLevel,
        online
      FROM ${tables.characterInfo}
      WHERE name = ? AND account_id = ?
    `;
    
    const result = await executeQueryMU(sql, [name, accountId]);
    
    if (!result.success) {
      console.error(`❌ Erro SQL ao buscar personagem:`, result.error);
      return errorResponse(res, 'Erro ao buscar personagem', 500);
    }
    
    if (result.data.length === 0) {
      return errorResponse(res, 'Personagem não encontrado ou não pertence a esta conta', 404);
    }
    
    const char = result.data[0];
    
    return successResponse(res, {
      name: char.name,
      level: char.level,
      masterLevel: char.masterLevel || 0,
      majesticLevel: char.majesticLevel || 0,
      class: getClassName(char.class),
      classNumber: char.class,
      stats: {
        strength: char.str,
        dexterity: char.dex,
        vitality: char.vit,
        energy: char.ene,
        command: char.cmd
      },
      points: char.points,
      masterPoints: char.masterPoints || 0,
      majesticPoints: char.majesticPoints || 0,
      zen: char.zen,
      resets: char.resets,
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
    
    console.log(`🎯 Distribuindo pontos para ${name}:`, { strength, dexterity, vitality, energy, command });
    
    // Calcular total de pontos a distribuir
    const totalPoints = (strength || 0) + (dexterity || 0) + (vitality || 0) + (energy || 0) + (command || 0);
    
    if (totalPoints === 0) {
      return errorResponse(res, 'Nenhum ponto para distribuir', 400);
    }
    
    // Verificar se o personagem existe e pertence à conta
    const checkSql = `
      SELECT points, online
      FROM ${tables.characterInfo}
      WHERE name = ? AND account_id = ?
    `;
    
    const checkResult = await executeQueryMU(checkSql, [name, accountId]);
    
    if (!checkResult.success || checkResult.data.length === 0) {
      console.log(`❌ Personagem não encontrado: ${name}`);
      return errorResponse(res, 'Personagem não encontrado', 404);
    }
    
    const character = checkResult.data[0];
    
    // Verificar se está online
    if (character.online === 1) {
      console.log(`⚠️ Personagem online, não pode distribuir pontos: ${name}`);
      return errorResponse(res, 'Não é possível distribuir pontos com personagem online', 400);
    }
    
    // Verificar se tem pontos suficientes
    if (character.points < totalPoints) {
      console.log(`⚠️ Pontos insuficientes: tem ${character.points}, precisa ${totalPoints}`);
      return errorResponse(res, 'Pontos insuficientes', 400);
    }
    
    // Atualizar stats
    const updateSql = `
      UPDATE ${tables.characterInfo}
      SET 
        strength = strength + ?,
        agility = agility + ?,
        vitality = vitality + ?,
        energy = energy + ?,
        leadership = leadership + ?,
        points = points - ?
      WHERE name = ? AND account_id = ?
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
      console.error(`❌ Erro ao distribuir pontos:`, updateResult.error);
      return errorResponse(res, 'Erro ao distribuir pontos', 500);
    }
    
    console.log(`✅ Pontos distribuídos com sucesso para ${name}`);
    
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
    console.error('❌ Exception ao distribuir pontos:', error);
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
    
    console.log(`🔄 Tentando resetar personagem: ${name}`);
    
    // Verificar se o personagem existe e pode resetar
    const checkSql = `
      SELECT 
        level,
        reset as resets,
        online,
        money as zen
      FROM ${tables.characterInfo}
      WHERE name = ? AND account_id = ?
    `;
    
    const checkResult = await executeQueryMU(checkSql, [name, accountId]);
    
    if (!checkResult.success || checkResult.data.length === 0) {
      console.log(`❌ Personagem não encontrado: ${name}`);
      return errorResponse(res, 'Personagem não encontrado', 404);
    }
    
    const character = checkResult.data[0];
    
    // Verificar se está online
    if (character.online === 1) {
      console.log(`⚠️ Personagem online, não pode resetar: ${name}`);
      return errorResponse(res, 'Não é possível resetar personagem online', 400);
    }
    
    // Verificar requisitos de reset (level 400)
    const requiredLevel = 400;
    if (character.level < requiredLevel) {
      console.log(`⚠️ Level insuficiente: ${character.level} < ${requiredLevel}`);
      return errorResponse(res, `Level mínimo para reset: ${requiredLevel}`, 400);
    }
    
    // Custo de reset (pode ser configurável)
    const resetCost = 5000000; // 5kk zen
    if (character.zen < resetCost) {
      console.log(`⚠️ Zen insuficiente: ${character.zen} < ${resetCost}`);
      return errorResponse(res, 'Zen insuficiente para reset', 400);
    }
    
    // Realizar reset
    const resetSql = `
      UPDATE ${tables.characterInfo}
      SET 
        level = 1,
        reset = reset + 1,
        points = points + 500,
        money = money - ?
      WHERE name = ? AND account_id = ?
    `;
    
    const resetResult = await executeQueryMU(resetSql, [resetCost, name, accountId]);
    
    if (!resetResult.success) {
      console.error(`❌ Erro ao resetar:`, resetResult.error);
      return errorResponse(res, 'Erro ao realizar reset', 500);
    }
    
    console.log(`✅ Reset realizado com sucesso: ${name} → Reset #${character.resets + 1}`);
    
    return successResponse(res, {
      newResetCount: character.resets + 1,
      bonusPoints: 500,
      zenSpent: resetCost
    }, 'Reset realizado com sucesso');
    
  } catch (error) {
    console.error('❌ Exception ao resetar personagem:', error);
    return errorResponse(res, 'Erro ao realizar reset', 500);
  }
};

module.exports = {
  getAccountCharacters,
  getCharacterDetails,
  distributePoints,
  resetCharacter
};