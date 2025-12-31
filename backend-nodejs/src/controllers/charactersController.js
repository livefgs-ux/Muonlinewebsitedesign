/**
 * Controller de Personagens
 * ✅ SEASON 19 DV TEAMS - ESTRUTURA REAL DO MUONLINE.SQL
 * Fonte: muonline.sql dump completo (2025-12-29)
 */

const { executeQueryMU, executeQueryWEB } = require('../config/database');
const { tables } = require('../config/auth');
const { getClassName, successResponse, errorResponse } = require('../utils/helpers');

/**
 * Helper: Buscar GUID da conta a partir do username
 * ✅ SEASON 19 DV TEAMS: account_id é INTEGER (GUID), não STRING!
 */
const getAccountGuid = async (accountUsername) => {
  console.log(`\n🔍 ========================================`);
  console.log(`🔍 [getAccountGuid] BUSCANDO GUID`);
  console.log(`🔍 ========================================`);
  console.log(`🔍 Account Username recebido: "${accountUsername}"`);
  console.log(`🔍 Tipo: ${typeof accountUsername}`);
  
  const sql = `SELECT guid FROM ${tables.accounts} WHERE BINARY account = ?`;
  console.log(`🔍 SQL: ${sql}`);
  console.log(`🔍 Parâmetros: ["${accountUsername}"]`);
  
  const result = await executeQueryMU(sql, [accountUsername]);
  
  console.log(`🔍 Query executada - Success: ${result.success}`);
  console.log(`🔍 Resultados encontrados: ${result.data ? result.data.length : 0}`);
  
  if (!result.success || result.data.length === 0) {
    console.error(`❌ Conta NÃO ENCONTRADA: "${accountUsername}"`);
    console.log(`❌ ========================================\n`);
    return null;
  }
  
  const guid = result.data[0].guid;
  console.log(`✅ GUID ENCONTRADO: ${guid}`);
  console.log(`✅ Tipo do GUID: ${typeof guid}`);
  console.log(`✅ ========================================\n`);
  
  return guid;
};

/**
 * Listar personagens de uma conta
 */
const getAccountCharacters = async (req, res) => {
  try {
    const { accountId } = req.user;
    
    console.log(`\n📊 ========================================`);
    console.log(`📊 BUSCANDO PERSONAGENS`);
    console.log(`📊 ========================================`);
    console.log(`📊 Account ID (do JWT): ${accountId}`);
    console.log(`📊 Account ID Type: ${typeof accountId}`);
    console.log(`📊 Tabela: ${tables.characterInfo}`);
    
    // ========================================================================
    // ✅ SEASON 19 DV TEAMS: account_id é INTEGER (GUID), NÃO STRING!
    // ========================================================================
    // CORREÇÃO CRÍTICA:
    //   - character_info.account_id é FK para accounts.guid (INTEGER)
    //   - JWT armazena accountId como STRING (nome da conta)
    //   - Precisamos buscar o GUID da conta PRIMEIRO!
    // ========================================================================
    
    // Buscar GUID da conta
    const accountGuid = await getAccountGuid(accountId);
    
    if (!accountGuid) {
      console.log(`❌ Conta não encontrada: ${accountId}`);
      return errorResponse(res, 'Conta não encontrada', 404);
    }
    
    console.log(`✅ GUID da conta encontrado: ${accountGuid}`);
    
    // Agora buscar personagens usando o GUID
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
    
    console.log(`📊 SQL Query:`);
    console.log(sql);
    console.log(`📊 Parâmetros: [${accountGuid}] (GUID INTEGER)`);
    
    const result = await executeQueryMU(sql, [accountGuid]);  // ✅ USAR GUID!
    
    console.log(`📊 Query executada!`);
    console.log(`📊 Success: ${result.success}`);
    console.log(`📊 Data length: ${result.data ? result.data.length : 0}`);
    
    if (result.data && result.data.length > 0) {
      console.log(`📊 Personagens encontrados:`);
      result.data.forEach((char, idx) => {
        console.log(`   ${idx + 1}. ${char.name} (account_id: ${char.account_id}, level: ${char.level})`);
      });
    } else {
      console.log(`⚠️  Nenhum personagem encontrado!`);
      console.log(`⚠️  Verificando se problema é SQL ou dados...`);
      
      // DEBUG: Buscar QUALQUER personagem para ver se a tabela tem dados
      const debugSql = `SELECT name, account_id FROM ${tables.characterInfo} LIMIT 5`;
      const debugResult = await executeQueryMU(debugSql, []);
      
      if (debugResult.success && debugResult.data.length > 0) {
        console.log(`⚠️  DEBUG: Tabela TEM personagens:`);
        debugResult.data.forEach((char, idx) => {
          console.log(`   ${idx + 1}. ${char.name} → account_id: "${char.account_id}" (type: ${typeof char.account_id})`);
        });
      } else {
        console.log(`⚠️  DEBUG: Tabela está VAZIA ou erro SQL`);
      }
    }
    
    if (!result.success) {
      console.error(`❌ Erro SQL ao buscar personagens:`, result.error);
      console.log(`❌ ========================================\n`);
      return errorResponse(res, 'Erro ao buscar personagens', 500);
    }
    
    console.log(`✅ Retornando ${result.data.length} personagens`);
    console.log(`✅ ========================================\n`);
    
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
    
    // Buscar GUID da conta
    const accountGuid = await getAccountGuid(accountId);
    
    if (!accountGuid) {
      console.log(`❌ Conta não encontrada: ${accountId}`);
      return errorResponse(res, 'Conta não encontrada', 404);
    }
    
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
    
    const result = await executeQueryMU(sql, [name, accountGuid]);  // ✅ USAR GUID!
    
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
    
    // Buscar GUID da conta
    const accountGuid = await getAccountGuid(accountId);
    
    if (!accountGuid) {
      console.log(`❌ Conta não encontrada: ${accountId}`);
      return errorResponse(res, 'Conta não encontrada', 404);
    }
    
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
    
    const checkResult = await executeQueryMU(checkSql, [name, accountGuid]);  // ✅ USAR GUID!
    
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
      accountGuid  // ✅ USAR GUID!
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
    
    // Buscar GUID da conta
    const accountGuid = await getAccountGuid(accountId);
    
    if (!accountGuid) {
      console.log(`❌ Conta não encontrada: ${accountId}`);
      return errorResponse(res, 'Conta não encontrada', 404);
    }
    
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
    
    const checkResult = await executeQueryMU(checkSql, [name, accountGuid]);  // ✅ USAR GUID!
    
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
    
    const resetResult = await executeQueryMU(resetSql, [resetCost, name, accountGuid]);  // ✅ USAR GUID!
    
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