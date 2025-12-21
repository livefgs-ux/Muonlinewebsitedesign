/**
 * Script: Detectar Estrutura e Gerar Mapeamento de Colunas
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function detectStructure() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'muonline'
    });

    console.log('\n🔍 DETECTANDO ESTRUTURA DO BANCO\n');
    console.log('='.repeat(80));

    // ============================================================
    // 1. TABELA DE CONTAS (accounts)
    // ============================================================
    console.log('\n📋 1. TABELA: accounts');
    console.log('-'.repeat(80));
    
    const [accountCols] = await connection.execute('DESCRIBE accounts');
    const accountFields = accountCols.map(c => c.Field);
    
    console.log('Colunas encontradas:', accountFields.join(', '));
    
    // Detectar colunas importantes
    const accountMapping = {
      id: findColumn(accountFields, ['id', 'account_id', 'memb___id', 'idx']),
      username: findColumn(accountFields, ['username', 'memb___idnum', 'account', 'login']),
      password: findColumn(accountFields, ['password', 'memb__pwd', 'pass']),
      email: findColumn(accountFields, ['email', 'mail_addr', 'mail']),
      status: findColumn(accountFields, ['status', 'bloc_code', 'account_status']),
      created: findColumn(accountFields, ['created_at', 'reg_date', 'sno__numb'])
    };
    
    console.log('\n✅ Mapeamento sugerido:');
    console.log(JSON.stringify(accountMapping, null, 2));

    // ============================================================
    // 2. TABELA DE PERSONAGENS (character_info)
    // ============================================================
    console.log('\n\n📋 2. TABELA: character_info');
    console.log('-'.repeat(80));
    
    const [charCols] = await connection.execute('DESCRIBE character_info');
    const charFields = charCols.map(c => c.Field);
    
    console.log('Colunas encontradas:', charFields.join(', '));
    
    const charMapping = {
      name: findColumn(charFields, ['Name', 'name', 'character_name']),
      class: findColumn(charFields, ['Class', 'class', 'cLevel']),
      level: findColumn(charFields, ['cLevel', 'level', 'Level']),
      reset: findColumn(charFields, ['ResetCount', 'reset', 'resets']),
      grandReset: findColumn(charFields, ['GrandResetCount', 'grand_reset', 'master_reset']),
      online: findColumn(charFields, ['ctlcode', 'ConnectStat', 'online']),
      accountId: findColumn(charFields, ['AccountID', 'memb___idnum', 'account_id']),
      strength: findColumn(charFields, ['Strength', 'str']),
      agility: findColumn(charFields, ['Dexterity', 'agi', 'dex']),
      vitality: findColumn(charFields, ['Vitality', 'vit']),
      energy: findColumn(charFields, ['Energy', 'ene'])
    };
    
    console.log('\n✅ Mapeamento sugerido:');
    console.log(JSON.stringify(charMapping, null, 2));

    // ============================================================
    // 3. TABELA DE GUILDS (guild_list)
    // ============================================================
    console.log('\n\n📋 3. TABELA: guild_list');
    console.log('-'.repeat(80));
    
    const [guildCols] = await connection.execute('DESCRIBE guild_list');
    const guildFields = guildCols.map(c => c.Field);
    
    console.log('Colunas encontradas:', guildFields.join(', '));
    
    const guildMapping = {
      name: findColumn(guildFields, ['G_Name', 'name', 'guild_name']),
      master: findColumn(guildFields, ['G_Master', 'master', 'owner']),
      mark: findColumn(guildFields, ['G_Mark', 'mark', 'emblem']),
      score: findColumn(guildFields, ['G_Score', 'score', 'points'])
    };
    
    console.log('\n✅ Mapeamento sugerido:');
    console.log(JSON.stringify(guildMapping, null, 2));

    // ============================================================
    // GERAR ARQUIVO DE CONFIGURAÇÃO
    // ============================================================
    console.log('\n\n' + '='.repeat(80));
    console.log('📄 GERANDO ARQUIVO DE CONFIGURAÇÃO...\n');
    
    const config = {
      tables: {
        accounts: 'accounts',
        characters: 'character_info',
        guild: 'guild_list',
        guildMembers: 'guild_members',
        cashShop: 'account_cash_shop_item',
        warehouse: 'account_warehouse',
        inventory: 'character_item_inventory'
      },
      columns: {
        accounts: accountMapping,
        characters: charMapping,
        guild: guildMapping
      }
    };
    
    const fs = require('fs').promises;
    await fs.writeFile(
      'database-mapping.json',
      JSON.stringify(config, null, 2)
    );
    
    console.log('✅ Configuração salva em: database-mapping.json');
    console.log('\n' + '='.repeat(80));
    console.log('\n🎯 Execute agora:');
    console.log('   1. cat tables-config.env >> .env');
    console.log('   2. node check-columns.js  (para ver detalhes)');
    console.log('   3. npm restart\n');

    await connection.end();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('\n💡 Verifique se o arquivo .env tem as credenciais corretas');
  }
}

// Helper: Encontrar coluna por nomes possíveis
function findColumn(fields, possibleNames) {
  for (const name of possibleNames) {
    const found = fields.find(f => 
      f.toLowerCase() === name.toLowerCase()
    );
    if (found) return found;
  }
  return possibleNames[0]; // Fallback para o primeiro nome sugerido
}

detectStructure();
