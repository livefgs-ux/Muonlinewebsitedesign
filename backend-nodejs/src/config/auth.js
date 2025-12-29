/**
 * Configuração de Autenticação JWT
 * ✅ SEASON 19 DV TEAMS - ESTRUTURA CORRETA
 */

require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'TROQUE_ISSO_POR_UMA_CHAVE_SECRETA_FORTE',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptSaltRounds: 10,
  
  // Configurações de segurança
  passwordMinLength: 6,
  passwordMaxLength: 20,
  usernameMinLength: 4,
  usernameMaxLength: 15,
  
  // ═══════════════════════════════════════════════════════════════
  // SEASON 19 DV TEAMS - NOMES CORRETOS DAS TABELAS E COLUNAS
  // Versão: 529 (2025-12-29 01:00)
  // Fix: Adicionados aliases para compatibilidade com controllers
  // ═══════════════════════════════════════════════════════════════
  
  // Tabelas do banco
  tables: {
    // Tabelas principais
    accounts: process.env.TABLE_ACCOUNTS || 'accounts',
    accountsStatus: 'accounts_status',
    accountData: 'account_data',
    characterInfo: process.env.TABLE_CHARACTERS || 'character_info',
    guildList: process.env.TABLE_GUILD || 'guild_list',
    guildMembers: process.env.TABLE_GUILD_MEMBER || 'guild_members',
    characterGens: 'character_gens',
    accountsSecurity: 'accounts_security',
    
    // ✅ ALIASES PARA COMPATIBILIDADE COM CONTROLLERS (V.529)
    // Os controllers usam nomes curtos, mas auth.js usa nomes descritivos
    get characters() { return this.characterInfo; },
    get guild() { return this.guildList; }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // COLUNAS DA TABELA ACCOUNTS (Season 19 DV Teams)
  // ═══════════════════════════════════════════════════════════════
  columns: {
    accounts: {
      username: 'account',      // _CLMN_USERNM_ / _CLMN_MEMBNAME_
      password: 'password',     // _CLMN_PASSWD_
      guid: 'guid',             // _CLMN_MEMBID_
      email: 'email',           // _CLMN_EMAIL_
      blocked: 'blocked',       // _CLMN_BLOCCODE_
      securityCode: 'security_code',  // _CLMN_SNONUMBER_
      ctlCode: 'ctl1_code'      // _CLMN_CTLCODE_
    },
    
    accountsStatus: {
      online: 'online',         // _CLMN_CONNSTAT_
      accountId: 'account_id',  // _CLMN_MS_MEMBID_
      currentServer: 'current_server',  // _CLMN_MS_GS_
      lastIp: 'last_ip'         // _CLMN_MS_IP_
    },
    
    accountData: {
      accountId: 'account_id',  // _CLMN_AC_ID_
      currentCharacter: 'current_character',  // _CLMN_GAMEIDC_
      expandedWarehouse: 'expanded_warehouse',  // _CLMN_WHEXPANSION_
      currentMac: 'current_mac',  // _CLMN_SECCODE_
      credits: 'credits'        // _CLMN_MC_CREDITS_
    },
    
    characterInfo: {
      name: 'name',             // _CLMN_CHR_NAME_
      accountId: 'account_id',  // _CLMN_CHR_ACCID_
      race: 'race',             // _CLMN_CHR_CLASS_ (class)
      money: 'money',           // _CLMN_CHR_ZEN_
      level: 'level',           // _CLMN_CHR_LVL_
      reset: 'reset',           // _CLMN_CHR_RSTS_
      greset: 'greset',         // _CLMN_CHR_GRSTS_
      points: 'points',         // _CLMN_CHR_LVLUP_POINT_
      strength: 'strength',     // _CLMN_CHR_STAT_STR_
      agility: 'agility',       // _CLMN_CHR_STAT_AGI_
      vitality: 'vitality',     // _CLMN_CHR_STAT_VIT_
      energy: 'energy',         // _CLMN_CHR_STAT_ENE_
      leadership: 'leadership', // _CLMN_CHR_STAT_CMD_
      pkCount: 'pk_count',      // _CLMN_CHR_PK_KILLS_
      pkLevel: 'pk_level',      // _CLMN_CHR_PK_LEVEL_
      firstTime: 'first_time',  // _CLMN_CHR_PK_TIME_
      world: 'world',           // _CLMN_CHR_MAP_
      worldX: 'world_x',        // _CLMN_CHR_MAP_X_
      worldY: 'world_y',        // _CLMN_CHR_MAP_Y_
      magicList: 'MagicList',   // _CLMN_CHR_MAGIC_L_
      inventory: 'Inventory',   // _CLMN_CHR_INV_
      quest: 'Quest',           // _CLMN_CHR_QUEST_
      online: 'online',         // _CLMN_CHR_ONLINE_
      guid: 'guid',             // _CLMN_CHR_GUID_
      levelMaster: 'level_master',  // _CLMN_ML_LVL_
      experienceMaster: 'experience_master',  // _CLMN_ML_EXP_
      pointsMaster: 'points_master',  // _CLMN_ML_POINT_
      pointsMajestic: 'points_majestic',  // _CLMN_ML_I4SP_
      levelMajestic: 'level_majestic'  // _CLMN_ML_MJLVL_
    },
    
    guildList: {
      name: 'name',             // _CLMN_GUILD_NAME_
      emblem: 'emblem',         // _CLMN_GUILD_LOGO_
      score: 'score',           // _CLMN_GUILD_SCORE_
      master: 'G_Master',       // _CLMN_GUILD_MASTER_
      notice: 'notice',         // _CLMN_GUILD_NOTICE_
      alliance: 'alliance'      // _CLMN_GUILD_UNION_
    },
    
    guildMembers: {
      name: 'Name',             // _CLMN_GUILDMEMB_CHAR_
      guildName: 'G_Name',      // _CLMN_GUILDMEMB_NAME_
      guildLevel: 'G_Level',    // _CLMN_GUILDMEMB_LEVEL_
      guildStatus: 'G_Status'   // _CLMN_GUILDMEMB_STATUS_
    },
    
    characterGens: {
      charId: 'char_id',        // _CLMN_GENS_ID_
      family: 'family',         // _CLMN_GENS_TYPE_
      level: 'level',           // _CLMN_GENS_RANK_
      contribution: 'contribution'  // _CLMN_GENS_POINT_
    },
    
    accountsSecurity: {
      accountId: 'account_id',  // _CLMN_CH_ID_
      account: 'account',       // _CLMN_CH_ACCID_
      ip: 'ip',                 // _CLMN_CH_IP_
      diskSerial: 'disk_serial' // _CLMN_CH_HWID_
    }
  }
};