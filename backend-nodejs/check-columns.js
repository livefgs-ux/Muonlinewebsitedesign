/**
 * Script: Verificar Estrutura das Tabelas Principais
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkColumns() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'muonline'
    });

    console.log('\n📊 ESTRUTURA DAS TABELAS PRINCIPAIS\n');
    console.log('='.repeat(80));

    const tablesToCheck = [
      'accounts',
      'character_info',
      'guild_list',
      'guild_members',
      'account_cash_shop_item',
      'event_ranking'
    ];

    for (const table of tablesToCheck) {
      console.log(`\n📋 Tabela: ${table}`);
      console.log('-'.repeat(80));
      
      try {
        const [columns] = await connection.execute(`DESCRIBE ${table}`);
        
        columns.forEach(col => {
          const nullable = col.Null === 'YES' ? '(null)' : '(NOT NULL)';
          const key = col.Key ? `[${col.Key}]` : '';
          console.log(`  ${col.Field.padEnd(30)} ${col.Type.padEnd(20)} ${nullable.padEnd(12)} ${key}`);
        });
        
        // Pegar exemplo de dados
        const [sample] = await connection.execute(`SELECT * FROM ${table} LIMIT 1`);
        if (sample.length > 0) {
          console.log('\n  📌 Exemplo de colunas disponíveis:');
          console.log('  ', Object.keys(sample[0]).join(', '));
        }
        
      } catch (error) {
        console.log(`  ❌ Erro: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ Verificação concluída!\n');

    await connection.end();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkColumns();
