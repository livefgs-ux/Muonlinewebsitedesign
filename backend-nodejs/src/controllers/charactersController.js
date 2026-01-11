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

/**
 * Grand Reset de Personagem
 * ✅ BASEADO NO WEBENGINE: CharacterReset (Grand Reset variant)
 * Requisitos: Level 400 + Reset máximo (configurável)
 */
const grandResetCharacter = async (req, res) => {
  try {
    const { name } = req.body;
    const { accountId } = req.user;
    
    console.log(`\n🔄 ========================================`);
    console.log(`🔄 GRAND RESET REQUEST`);
    console.log(`🔄 ========================================`);
    console.log(`🔄 Account: ${accountId}`);
    console.log(`🔄 Character: ${name}`);
    
    if (!name) {
      return errorResponse(res, 'Nome do personagem é obrigatório', 400);
    }
    
    // Buscar GUID da conta
    const accountGuid = await getAccountGuid(accountId);
    
    if (!accountGuid) {
      console.log(`❌ Conta não encontrada: ${accountId}`);
      return errorResponse(res, 'Conta não encontrada', 404);
    }
    
    // Verificar se o personagem existe e pode grand resetar
    const checkSql = `
      SELECT 
        level,
        reset as resets,
        greset as grandResets,
        online,
        money as zen
      FROM ${tables.characterInfo}
      WHERE name = ? AND account_id = ?
    `;
    
    const checkResult = await executeQueryMU(checkSql, [name, accountGuid]);
    
    if (!checkResult.success || checkResult.data.length === 0) {
      console.log(`❌ Personagem não encontrado: ${name}`);
      return errorResponse(res, 'Personagem não encontrado', 404);
    }
    
    const character = checkResult.data[0];
    
    // Verificar se está online
    if (character.online === 1) {
      console.log(`⚠️ Personagem online, não pode grand resetar: ${name}`);
      return errorResponse(res, 'Não é possível grand resetar personagem online', 400);
    }
    
    // Requisitos de grand reset
    const requiredLevel = 400;
    const requiredResets = 10; // Configurável
    const grandResetCost = 50000000; // 50kk zen
    
    if (character.level < requiredLevel) {
      console.log(`⚠️ Level insuficiente: ${character.level} < ${requiredLevel}`);
      return errorResponse(res, `Level mínimo para grand reset: ${requiredLevel}`, 400);
    }
    
    if (character.resets < requiredResets) {
      console.log(`⚠️ Resets insuficientes: ${character.resets} < ${requiredResets}`);
      return errorResponse(res, `Resets mínimos para grand reset: ${requiredResets}`, 400);
    }
    
    if (character.zen < grandResetCost) {
      console.log(`⚠️ Zen insuficiente: ${character.zen} < ${grandResetCost}`);
      return errorResponse(res, 'Zen insuficiente para grand reset', 400);
    }
    
    // Realizar grand reset (limpa level + resets, adiciona grand reset)
    const grandResetSql = `
      UPDATE ${tables.characterInfo}
      SET 
        level = 1,
        reset = 0,
        greset = greset + 1,
        points = points + 1000,
        money = money - ?
      WHERE name = ? AND account_id = ?
    `;
    
    const grandResetResult = await executeQueryMU(grandResetSql, [grandResetCost, name, accountGuid]);
    
    if (!grandResetResult.success) {
      console.error(`❌ Erro ao grand resetar:`, grandResetResult.error);
      return errorResponse(res, 'Erro ao realizar grand reset', 500);
    }
    
    console.log(`✅ Grand Reset realizado com sucesso: ${name} → Grand Reset #${character.grandResets + 1}`);
    
    return successResponse(res, {
      newGrandResetCount: character.grandResets + 1,
      resetCount: 0,
      level: 1,
      bonusPoints: 1000,
      zenSpent: grandResetCost
    }, 'Grand Reset realizado com sucesso');
    
  } catch (error) {
    console.error('❌ Exception ao grand resetar personagem:', error);
    return errorResponse(res, 'Erro ao realizar grand reset', 500);
  }
};

/**
 * Reset Stats de Personagem
 * ✅ BASEADO NO WEBENGINE: CharacterResetStats
 * Reseta stats para base da classe, retorna pontos
 */
const resetStats = async (req, res) => {
  try {
    const { name } = req.body;
    const { accountId } = req.user;
    
    console.log(`\n📊 ========================================`);
    console.log(`📊 RESET STATS REQUEST`);
    console.log(`📊 ========================================`);
    console.log(`📊 Account: ${accountId}`);
    console.log(`📊 Character: ${name}`);
    
    if (!name) {
      return errorResponse(res, 'Nome do personagem é obrigatório', 400);
    }
    
    // Buscar GUID da conta
    const accountGuid = await getAccountGuid(accountId);
    
    if (!accountGuid) {
      console.log(`❌ Conta não encontrada: ${accountId}`);
      return errorResponse(res, 'Conta não encontrada', 404);
    }
    
    // Verificar se o personagem existe
    const checkSql = `
      SELECT 
        race as class,
        level,
        level_master as masterLevel,
        strength as str,
        agility as dex,
        vitality as vit,
        energy as ene,
        leadership as cmd,
        points,
        online,
        money as zen
      FROM ${tables.characterInfo}
      WHERE name = ? AND account_id = ?
    `;
    
    const checkResult = await executeQueryMU(checkSql, [name, accountGuid]);
    
    if (!checkResult.success || checkResult.data.length === 0) {
      console.log(`❌ Personagem não encontrado: ${name}`);
      return errorResponse(res, 'Personagem não encontrado', 404);
    }
    
    const character = checkResult.data[0];
    
    // Verificar se está online
    if (character.online === 1) {
      console.log(`⚠️ Personagem online, não pode resetar stats: ${name}`);
      return errorResponse(res, 'Não é possível resetar stats de personagem online', 400);
    }
    
    // Custo de reset stats
    const resetStatsCost = 1000000; // 1kk zen
    
    if (character.zen < resetStatsCost) {
      console.log(`⚠️ Zen insuficiente: ${character.zen} < ${resetStatsCost}`);
      return errorResponse(res, 'Zen insuficiente para reset stats', 400);
    }
    
    // Base stats por classe (baseado no WebEngine custom character_class)
    const baseStats = {
      // DW (0-15)
      0: { str: 18, dex: 18, vit: 15, ene: 30, cmd: 0 },
      1: { str: 18, dex: 18, vit: 15, ene: 30, cmd: 0 },
      3: { str: 18, dex: 18, vit: 15, ene: 30, cmd: 0 },
      7: { str: 18, dex: 18, vit: 15, ene: 30, cmd: 0 },
      15: { str: 18, dex: 18, vit: 15, ene: 30, cmd: 0 },
      
      // DK (16-31)
      16: { str: 28, dex: 20, vit: 25, ene: 10, cmd: 0 },
      17: { str: 28, dex: 20, vit: 25, ene: 10, cmd: 0 },
      19: { str: 28, dex: 20, vit: 25, ene: 10, cmd: 0 },
      23: { str: 28, dex: 20, vit: 25, ene: 10, cmd: 0 },
      31: { str: 28, dex: 20, vit: 25, ene: 10, cmd: 0 },
      
      // ELF (32-47)
      32: { str: 22, dex: 25, vit: 15, ene: 20, cmd: 0 },
      33: { str: 22, dex: 25, vit: 15, ene: 20, cmd: 0 },
      35: { str: 22, dex: 25, vit: 15, ene: 20, cmd: 0 },
      39: { str: 22, dex: 25, vit: 15, ene: 20, cmd: 0 },
      47: { str: 22, dex: 25, vit: 15, ene: 20, cmd: 0 },
      
      // MG (48-63)
      48: { str: 26, dex: 26, vit: 26, ene: 16, cmd: 0 },
      51: { str: 26, dex: 26, vit: 26, ene: 16, cmd: 0 },
      55: { str: 26, dex: 26, vit: 26, ene: 16, cmd: 0 },
      63: { str: 26, dex: 26, vit: 26, ene: 16, cmd: 0 },
      
      // DL (64-79)
      64: { str: 26, dex: 20, vit: 20, ene: 15, cmd: 25 },
      67: { str: 26, dex: 20, vit: 20, ene: 15, cmd: 25 },
      71: { str: 26, dex: 20, vit: 20, ene: 15, cmd: 25 },
      79: { str: 26, dex: 20, vit: 20, ene: 15, cmd: 25 },
      
      // SUM (80-95)
      80: { str: 21, dex: 21, vit: 18, ene: 23, cmd: 0 },
      81: { str: 21, dex: 21, vit: 18, ene: 23, cmd: 0 },
      83: { str: 21, dex: 21, vit: 18, ene: 23, cmd: 0 },
      87: { str: 21, dex: 21, vit: 18, ene: 23, cmd: 0 },
      95: { str: 21, dex: 21, vit: 18, ene: 23, cmd: 0 },
      
      // RF (96-111)
      96: { str: 32, dex: 27, vit: 25, ene: 20, cmd: 0 },
      99: { str: 32, dex: 27, vit: 25, ene: 20, cmd: 0 },
      103: { str: 32, dex: 27, vit: 25, ene: 20, cmd: 0 },
      111: { str: 32, dex: 27, vit: 25, ene: 20, cmd: 0 },
      
      // GL (112-127)
      112: { str: 30, dex: 30, vit: 25, ene: 24, cmd: 0 },
      116: { str: 30, dex: 30, vit: 25, ene: 24, cmd: 0 },
      119: { str: 30, dex: 30, vit: 25, ene: 24, cmd: 0 },
      127: { str: 30, dex: 30, vit: 25, ene: 24, cmd: 0 },
      
      // RW (128-143)
      128: { str: 13, dex: 18, vit: 14, ene: 40, cmd: 0 },
      129: { str: 13, dex: 18, vit: 14, ene: 40, cmd: 0 },
      131: { str: 13, dex: 18, vit: 14, ene: 40, cmd: 0 },
      135: { str: 13, dex: 18, vit: 14, ene: 40, cmd: 0 },
      143: { str: 13, dex: 18, vit: 14, ene: 40, cmd: 0 },
      
      // SL (144-159)
      144: { str: 28, dex: 30, vit: 15, ene: 10, cmd: 0 },
      145: { str: 28, dex: 30, vit: 15, ene: 10, cmd: 0 },
      147: { str: 28, dex: 30, vit: 15, ene: 10, cmd: 0 },
      151: { str: 28, dex: 30, vit: 15, ene: 10, cmd: 0 },
      159: { str: 28, dex: 30, vit: 15, ene: 10, cmd: 0 },
      
      // GC (160-175)
      160: { str: 28, dex: 30, vit: 15, ene: 10, cmd: 0 },
      161: { str: 28, dex: 30, vit: 15, ene: 10, cmd: 0 },
      163: { str: 28, dex: 30, vit: 15, ene: 10, cmd: 0 },
      167: { str: 28, dex: 30, vit: 15, ene: 10, cmd: 0 },
      175: { str: 28, dex: 30, vit: 15, ene: 10, cmd: 0 },
      
      // LW (176-191)
      176: { str: 19, dex: 19, vit: 15, ene: 30, cmd: 0 },
      177: { str: 19, dex: 19, vit: 15, ene: 30, cmd: 0 },
      179: { str: 19, dex: 19, vit: 15, ene: 30, cmd: 0 },
      183: { str: 19, dex: 19, vit: 15, ene: 30, cmd: 0 },
      191: { str: 19, dex: 19, vit: 15, ene: 30, cmd: 0 },
      
      // LEM (192-207)
      192: { str: 18, dex: 18, vit: 19, ene: 30, cmd: 0 },
      193: { str: 18, dex: 18, vit: 19, ene: 30, cmd: 0 },
      195: { str: 18, dex: 18, vit: 19, ene: 30, cmd: 0 },
      199: { str: 18, dex: 18, vit: 19, ene: 30, cmd: 0 },
      207: { str: 18, dex: 18, vit: 19, ene: 30, cmd: 0 },
      
      // IK (208-223)
      208: { str: 25, dex: 28, vit: 15, ene: 10, cmd: 0 },
      209: { str: 25, dex: 28, vit: 15, ene: 10, cmd: 0 },
      211: { str: 25, dex: 28, vit: 15, ene: 10, cmd: 0 },
      215: { str: 25, dex: 28, vit: 15, ene: 10, cmd: 0 },
      223: { str: 25, dex: 28, vit: 15, ene: 10, cmd: 0 },
      
      // ALC (224-239)
      224: { str: 15, dex: 20, vit: 23, ene: 15, cmd: 0 },
      225: { str: 15, dex: 20, vit: 23, ene: 15, cmd: 0 },
      227: { str: 15, dex: 20, vit: 23, ene: 15, cmd: 0 },
      231: { str: 15, dex: 20, vit: 23, ene: 15, cmd: 0 },
      239: { str: 15, dex: 20, vit: 23, ene: 15, cmd: 0 }
    };
    
    const base = baseStats[character.class];
    
    if (!base) {
      console.log(`⚠️ Classe não encontrada: ${character.class}`);
      return errorResponse(res, 'Classe inválida', 400);
    }
    
    // Calcular pontos que serão retornados
    const currentStats = character.str + character.dex + character.vit + character.ene + character.cmd;
    const baseStatsSum = base.str + base.dex + base.vit + base.ene + base.cmd;
    const pointsToReturn = currentStats - baseStatsSum;
    
    // Calcular pontos de level e master level
    const levelPoints = (character.level - 1) * 5;
    const masterLevelPoints = character.masterLevel * 1;
    const totalAvailablePoints = character.points + pointsToReturn;
    
    console.log(`📊 Stats atuais: STR=${character.str}, DEX=${character.dex}, VIT=${character.vit}, ENE=${character.ene}, CMD=${character.cmd}`);
    console.log(`📊 Stats base: STR=${base.str}, DEX=${base.dex}, VIT=${base.vit}, ENE=${base.ene}, CMD=${base.cmd}`);
    console.log(`📊 Pontos a retornar: ${pointsToReturn}`);
    console.log(`📊 Pontos totais: ${totalAvailablePoints}`);
    
    // Resetar stats
    const resetStatsSql = `
      UPDATE ${tables.characterInfo}
      SET 
        strength = ?,
        agility = ?,
        vitality = ?,
        energy = ?,
        leadership = ?,
        points = ?,
        money = money - ?
      WHERE name = ? AND account_id = ?
    `;
    
    const resetStatsResult = await executeQueryMU(resetStatsSql, [
      base.str,
      base.dex,
      base.vit,
      base.ene,
      base.cmd,
      totalAvailablePoints,
      resetStatsCost,
      name,
      accountGuid
    ]);
    
    if (!resetStatsResult.success) {
      console.error(`❌ Erro ao resetar stats:`, resetStatsResult.error);
      return errorResponse(res, 'Erro ao resetar stats', 500);
    }
    
    console.log(`✅ Stats resetados com sucesso: ${name}`);
    
    return successResponse(res, {
      baseStats: base,
      pointsReturned: pointsToReturn,
      totalPoints: totalAvailablePoints,
      zenSpent: resetStatsCost
    }, 'Stats resetados com sucesso');
    
  } catch (error) {
    console.error('❌ Exception ao resetar stats:', error);
    return errorResponse(res, 'Erro ao resetar stats', 500);
  }
};

/**
 * Clear PK (Player Killer status)
 * ✅ BASEADO NO WEBENGINE: Clear PK functionality
 * Remove PK count e PK level do personagem
 */
const clearPK = async (req, res) => {
  try {
    const { name } = req.body;
    const { accountId } = req.user;
    
    console.log(`\n🕊️ ========================================`);
    console.log(`🕊️ CLEAR PK REQUEST`);
    console.log(`🕊️ ========================================`);
    console.log(`🕊️ Account: ${accountId}`);
    console.log(`🕊️ Character: ${name}`);
    
    if (!name) {
      return errorResponse(res, 'Nome do personagem é obrigatório', 400);
    }
    
    // Buscar GUID da conta
    const accountGuid = await getAccountGuid(accountId);
    
    if (!accountGuid) {
      console.log(`❌ Conta não encontrada: ${accountId}`);
      return errorResponse(res, 'Conta não encontrada', 404);
    }
    
    // Verificar se o personagem existe
    const checkSql = `
      SELECT 
        pk_count as pkCount,
        pk_level as pkLevel,
        online,
        money as zen
      FROM ${tables.characterInfo}
      WHERE name = ? AND account_id = ?
    `;
    
    const checkResult = await executeQueryMU(checkSql, [name, accountGuid]);
    
    if (!checkResult.success || checkResult.data.length === 0) {
      console.log(`❌ Personagem não encontrado: ${name}`);
      return errorResponse(res, 'Personagem não encontrado', 404);
    }
    
    const character = checkResult.data[0];
    
    // Verificar se está online
    if (character.online === 1) {
      console.log(`⚠️ Personagem online, não pode clear PK: ${name}`);
      return errorResponse(res, 'Não é possível clear PK de personagem online', 400);
    }
    
    // Verificar se tem PK para limpar
    if (character.pkCount === 0 && character.pkLevel === 0) {
      console.log(`⚠️ Personagem não possui PK: ${name}`);
      return errorResponse(res, 'Personagem não possui PK para limpar', 400);
    }
    
    // Custo de clear PK
    const clearPKCost = 5000000; // 5kk zen
    
    if (character.zen < clearPKCost) {
      console.log(`⚠️ Zen insuficiente: ${character.zen} < ${clearPKCost}`);
      return errorResponse(res, 'Zen insuficiente para clear PK', 400);
    }
    
    // Limpar PK
    const clearPKSql = `
      UPDATE ${tables.characterInfo}
      SET 
        pk_count = 0,
        pk_level = 0,
        money = money - ?
      WHERE name = ? AND account_id = ?
    `;
    
    const clearPKResult = await executeQueryMU(clearPKSql, [clearPKCost, name, accountGuid]);
    
    if (!clearPKResult.success) {
      console.error(`❌ Erro ao clear PK:`, clearPKResult.error);
      return errorResponse(res, 'Erro ao limpar PK', 500);
    }
    
    console.log(`✅ PK limpo com sucesso: ${name}`);
    
    return successResponse(res, {
      previousPKCount: character.pkCount,
      previousPKLevel: character.pkLevel,
      zenSpent: clearPKCost
    }, 'PK limpo com sucesso');
    
  } catch (error) {
    console.error('❌ Exception ao clear PK:', error);
    return errorResponse(res, 'Erro ao limpar PK', 500);
  }
};

module.exports = {
  getAccountCharacters,
  getCharacterDetails,
  distributePoints,
  resetCharacter,
  grandResetCharacter,
  resetStats,
  clearPK
};