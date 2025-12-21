const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'muonline'
    });

    console.log('\n📊 TABELAS NO BANCO:', process.env.DB_NAME || 'muonline');
    console.log('='.repeat(60));

    const [tables] = await connection.execute('SHOW TABLES');
    
    const tableNames = tables.map(row => Object.values(row)[0]);
    tableNames.forEach((tableName, index) => {
      console.log(`${(index + 1).toString().padStart(3, ' ')}. ${tableName}`);
    });

    console.log('='.repeat(60));
    console.log(`\n✅ Total: ${tables.length} tabelas encontradas\n`);

    // Tentar identificar tabelas importantes
    console.log('🔍 IDENTIFICANDO TABELAS DO MU ONLINE:');
    console.log('='.repeat(60));

    const patterns = {
      accounts: ['MEMB_INFO', 'AccountCharacter', 'ACCOUNT', 'Account'],
      characters: ['Character', 'CharacterInfo', 'CHARACTER'],
      guild: ['Guild', 'GuildInfo', 'GUILD'],
      warehouse: ['warehouse', 'WareHouse', 'WAREHOUSE']
    };

    for (const [type, possibleNames] of Object.entries(patterns)) {
      console.log(`\n${type.toUpperCase()}:`);
      const found = tableNames.filter(t => 
        possibleNames.some(p => t.toLowerCase().includes(p.toLowerCase()))
      );
      if (found.length > 0) {
        found.forEach(t => console.log(`  ✅ ${t}`));
      } else {
        console.log(`  ❌ Não encontrada`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n💡 Cole a lista completa de tabelas para atualizar a configuração!\n');

    await connection.end();
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('\n💡 Verifique:');
    console.error('   1. Se o arquivo .env existe e tem as credenciais corretas');
    console.error('   2. Se o MariaDB está rodando');
    console.error('   3. Se o banco "muonline" existe');
  }
}

checkTables();
