/**
 * Configuração de Autenticação JWT
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
  usernameMaxLength: 10,
  
  // Tabelas do banco
  tables: {
    accounts: process.env.TABLE_ACCOUNTS || 'accounts',
    characters: process.env.TABLE_CHARACTERS || 'character_info',
    guild: process.env.TABLE_GUILD || 'guild_list',
    guildMember: process.env.TABLE_GUILD_MEMBER || 'guild_members',
    cashShop: process.env.TABLE_CASH_SHOP || 'account_cash_shop_item',
    warehouse: process.env.TABLE_WAREHOUSE || 'account_warehouse',
    inventory: process.env.TABLE_INVENTORY || 'character_item_inventory',
    skills: process.env.TABLE_SKILLS || 'character_skill',
    ranking: process.env.TABLE_RANKING || 'event_ranking',
    serverSignal: process.env.TABLE_SERVER_SIGNAL || 'server_signal'
  }
};