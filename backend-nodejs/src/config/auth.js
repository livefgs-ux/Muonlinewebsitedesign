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
    accounts: process.env.TABLE_ACCOUNTS || 'MEMB_INFO',
    characters: process.env.TABLE_CHARACTERS || 'Character',
    guild: process.env.TABLE_GUILD || 'Guild',
    guildMember: process.env.TABLE_GUILD_MEMBER || 'GuildMember',
    cashShop: process.env.TABLE_CASH_SHOP || 'CashShopData'
  }
};
