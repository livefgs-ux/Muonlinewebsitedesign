/**
 * Controller de Rankings - CORRIGIDO PARA ESTRUTURA REAL DO BANCO
 */

const { executeQueryMU } = require('../config/database');
const { tables } = require('../config/auth');
const { getClassName, successResponse, errorResponse } = require('../utils/helpers');

/**
 * Top Resets - USANDO NOMES CORRETOS DAS COLUNAS
 */
const getTopResets = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const sql = `
      SELECT 
        name,
        level,
        race,
        reset as resets,
        level_master as grandResets,
        pk_level as pkLevel,
        online
      FROM ${tables.characters}
      ORDER BY reset DESC, level_master DESC, level DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await executeQueryMU(sql, [limit, offset]);
    
    if (!result.success) {
      console.error('❌ Erro SQL:', result.error);
      return errorResponse(res, 'Erro ao buscar ranking de resets', 500);
    }
    
    const rankings = result.data.map((char, index) => ({
      position: offset + index + 1,
      name: char.name,
      level: char.level,
      class: getClassName(char.race),
      classNumber: char.race,
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
 * Top PK (Player Killers) - USANDO NOMES CORRETOS DAS COLUNAS
 */
const getTopPK = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const sql = `
      SELECT 
        name,
        level,
        race,
        pk_level as pkLevel,
        pk_count as kills,
        reset as resets,
        online
      FROM ${tables.characters}
      ORDER BY pk_level DESC, pk_count DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await executeQueryMU(sql, [limit, offset]);
    
    if (!result.success) {
      console.error('❌ Erro SQL:', result.error);
      return errorResponse(res, 'Erro ao buscar ranking de PK', 500);
    }
    
    const rankings = result.data.map((char, index) => ({
      position: offset + index + 1,
      name: char.name,
      level: char.level,
      class: getClassName(char.race),
      classNumber: char.race,
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
 * Top Level - USANDO NOMES CORRETOS DAS COLUNAS
 */
const getTopLevel = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const sql = `
      SELECT 
        name,
        level,
        race,
        reset as resets,
        level_master as grandResets,
        experience as exp,
        online
      FROM ${tables.characters}
      ORDER BY level DESC, experience DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await executeQueryMU(sql, [limit, offset]);
    
    if (!result.success) {
      console.error('❌ Erro SQL:', result.error);
      return errorResponse(res, 'Erro ao buscar ranking de level', 500);
    }
    
    const rankings = result.data.map((char, index) => ({
      position: offset + index + 1,
      name: char.name,
      level: char.level,
      class: getClassName(char.race),
      classNumber: char.race,
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
 * Top Guilds - USANDO NOMES CORRETOS DAS COLUNAS
 */
const getTopGuilds = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    // DETECTAR ESTRUTURA DA TABELA GUILD AUTOMATICAMENTE
    const checkColumnsSQL = `SHOW COLUMNS FROM ${tables.guild}`;
    const columnsResult = await executeQueryMU(checkColumnsSQL);
    
    if (!columnsResult.success) {
      console.error('❌ Erro ao verificar colunas da tabela guild:', columnsResult.error);
      return errorResponse(res, 'Erro ao verificar estrutura da tabela de guilds', 500);
    }
    
    const columns = columnsResult.data.map(col => col.Field.toLowerCase());
    console.log('🔍 Colunas disponíveis em guild:', columns);
    
    // Detectar nomes das colunas
    const scoreCol = columns.includes('score') ? 'score' : 
                     columns.includes('guild_score') ? 'guild_score' : 
                     '0';
    
    const membersCol = columns.includes('member_count') ? 'member_count' :
                       columns.includes('members') ? 'members' :
                       columns.includes('total_members') ? 'total_members' :
                       '0';
    
    const emblemCol = columns.includes('emblem') ? 'emblem' :
                      columns.includes('guild_emblem') ? 'guild_emblem' :
                      'NULL';
    
    const masterCol = columns.includes('master') ? 'master' :
                      columns.includes('guild_master') ? 'guild_master' :
                      columns.includes('master_name') ? 'master_name' :
                      'NULL';
    
    // QUERY DINÂMICA baseada nas colunas disponíveis
    const sql = `
      SELECT 
        name,
        ${emblemCol} as emblem,
        ${scoreCol} as score,
        ${membersCol} as members,
        ${masterCol} as master
      FROM ${tables.guild}
      ORDER BY ${scoreCol} DESC
      LIMIT ? OFFSET ?
    `;
    
    console.log('📊 SQL Guilds:', sql);
    
    const result = await executeQueryMU(sql, [limit, offset]);
    
    if (!result.success) {
      console.error('❌ Erro SQL no ranking de guilds:', result.error);
      return errorResponse(res, 'Erro ao buscar ranking de guilds', 500);
    }
    
    // Se não houver dados, retornar array vazio
    if (!result.data || result.data.length === 0) {
      console.log('⚠️  Nenhuma guild encontrada no banco');
      return successResponse(res, []);
    }
    
    const rankings = result.data.map((guild, index) => ({
      position: offset + index + 1,
      name: guild.name || 'Unknown',
      master: guild.master || 'N/A',
      score: parseInt(guild.score) || 0,
      members: parseInt(guild.members) || 0,
      emblem: guild.emblem || null
    }));
    
    return successResponse(res, rankings);
    
  } catch (error) {
    console.error('❌ Erro no ranking de guilds:', error);
    return errorResponse(res, 'Erro ao buscar ranking de guilds', 500);
  }
};

/**
 * Top por Classe Específica - USANDO NOMES CORRETOS DAS COLUNAS
 */
const getTopByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    // Validar classId (race no banco)
    const validClasses = [0, 1, 16, 17, 32, 33, 48, 49, 64, 65, 80, 81, 96, 97, 112, 113, 128, 129, 144, 145];
    const classIdNum = parseInt(classId);
    
    if (!validClasses.includes(classIdNum)) {
      return errorResponse(res, 'Classe inválida', 400);
    }
    
    const sql = `
      SELECT 
        name,
        level,
        race,
        reset as resets,
        level_master as grandResets,
        pk_level as pkLevel,
        pk_count as kills,
        online
      FROM ${tables.characters}
      WHERE race = ?
      ORDER BY reset DESC, level DESC, experience DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await executeQueryMU(sql, [classIdNum, limit, offset]);
    
    if (!result.success) {
      console.error('❌ Erro SQL:', result.error);
      return errorResponse(res, 'Erro ao buscar ranking por classe', 500);
    }
    
    const rankings = result.data.map((char, index) => ({
      position: offset + index + 1,
      name: char.name,
      level: char.level,
      class: getClassName(char.race),
      classNumber: char.race,
      resets: char.resets,
      grandResets: char.grandResets,
      pkLevel: char.pkLevel,
      kills: char.kills,
      online: char.online === 1
    }));
    
    return successResponse(res, rankings);
    
  } catch (error) {
    console.error('❌ Erro no ranking por classe:', error);
    return errorResponse(res, 'Erro ao buscar ranking', 500);
  }
};

/**
 * Buscar posição de um personagem específico no ranking
 */
const getCharacterRank = async (req, res) => {
  try {
    const { name } = req.params;
    const { type } = req.query;
    
    let sql = '';
    
    switch (type) {
      case 'resets':
        sql = `
          SELECT COUNT(*) + 1 as position
          FROM ${tables.characters}
          WHERE (reset > (SELECT reset FROM ${tables.characters} WHERE name = ?))
             OR (reset = (SELECT reset FROM ${tables.characters} WHERE name = ?)
                 AND level_master > (SELECT level_master FROM ${tables.characters} WHERE name = ?))
             OR (reset = (SELECT reset FROM ${tables.characters} WHERE name = ?)
                 AND level_master = (SELECT level_master FROM ${tables.characters} WHERE name = ?)
                 AND level > (SELECT level FROM ${tables.characters} WHERE name = ?))
        `;
        break;
        
      case 'pk':
        sql = `
          SELECT COUNT(*) + 1 as position
          FROM ${tables.characters}
          WHERE (pk_level > (SELECT pk_level FROM ${tables.characters} WHERE name = ?))
             OR (pk_level = (SELECT pk_level FROM ${tables.characters} WHERE name = ?)
                 AND pk_count > (SELECT pk_count FROM ${tables.characters} WHERE name = ?))
        `;
        break;
        
      case 'level':
      default:
        sql = `
          SELECT COUNT(*) + 1 as position
          FROM ${tables.characters}
          WHERE (level > (SELECT level FROM ${tables.characters} WHERE name = ?))
             OR (level = (SELECT level FROM ${tables.characters} WHERE name = ?)
                 AND experience > (SELECT experience FROM ${tables.characters} WHERE name = ?))
        `;
        break;
    }
    
    const params = type === 'resets' 
      ? [name, name, name, name, name, name]
      : [name, name, name];
    
    const result = await executeQueryMU(sql, params);
    
    if (!result.success) {
      console.error('❌ Erro SQL:', result.error);
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

/**
 * Top Grand Resets - NOVO (WebEngine Integration)
 * ✅ BASEADO NO WEBENGINE: Top Grand Resets Ranking
 */
const getTopGrandResets = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    console.log('\n🔄 ========================================');
    console.log('🔄 TOP GRAND RESETS REQUEST');
    console.log('🔄 ========================================');
    console.log(`🔄 Limit: ${limit}, Offset: ${offset}`);
    
    // Verificar cache primeiro
    const { getRankingsCache, updateRankingsCache } = require('../utils/cacheManager');
    const cacheKey = `grand_resets_${limit}_${offset}`;
    const cached = getRankingsCache('GRAND_RESETS');
    
    if (cached && cached[cacheKey]) {
      console.log('✅ Cache HIT: Top Grand Resets');
      return successResponse(res, cached[cacheKey]);
    }
    
    console.log('❌ Cache MISS: Top Grand Resets - Buscando no banco');
    
    const sql = `
      SELECT 
        name,
        level,
        race,
        reset as resets,
        greset as grandResets,
        level_master as masterLevel,
        pk_level as pkLevel,
        online
      FROM ${tables.characters}
      WHERE greset > 0
      ORDER BY greset DESC, reset DESC, level DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await executeQueryMU(sql, [limit, offset]);
    
    if (!result.success) {
      console.error('❌ Erro SQL:', result.error);
      return errorResponse(res, 'Erro ao buscar ranking de grand resets', 500);
    }
    
    const rankings = result.data.map((char, index) => ({
      position: offset + index + 1,
      name: char.name,
      level: char.level,
      class: getClassName(char.race),
      classNumber: char.race,
      grandResets: char.grandResets,
      resets: char.resets,
      masterLevel: char.masterLevel,
      pkLevel: char.pkLevel,
      online: char.online === 1
    }));
    
    // Atualizar cache
    const cacheData = { [cacheKey]: rankings };
    await updateRankingsCache('GRAND_RESETS', cacheData);
    
    console.log(`✅ Top Grand Resets: ${rankings.length} resultados`);
    
    return successResponse(res, rankings);
    
  } catch (error) {
    console.error('❌ Erro no ranking de grand resets:', error);
    return errorResponse(res, 'Erro ao buscar ranking', 500);
  }
};

module.exports = {
  getTopResets,
  getTopPK,
  getTopLevel,
  getTopGuilds,
  getTopByClass,
  getCharacterRank,
  getTopGrandResets  // ← NOVO
};