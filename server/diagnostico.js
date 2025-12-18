// Script de Diagnóstico Completo da Conexão MySQL
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  connectTimeout: 10000 // 10 segundos
};

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 DIAGNÓSTICO COMPLETO DA CONEXÃO MYSQL');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('📋 CONFIGURAÇÕES DETECTADAS:\n');
console.log(`   Host: ${config.host}`);
console.log(`   Porta: ${config.port}`);
console.log(`   Usuário: ${config.user}`);
console.log(`   Senha: ${config.password ? '***' + config.password.slice(-3) : '⚠️  VAZIA'}`);
console.log(`   Database 1: ${process.env.DB_NAME || 'não configurado'}`);
console.log(`   Database 2: ${process.env.DB_NAME_WEB || 'não configurado'}\n`);

async function testConnection() {
  let connection;

  try {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('PASSO 1: Testando conexão com o servidor MySQL');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log(`🔌 Conectando em ${config.host}:${config.port}...`);
    
    connection = await mysql.createConnection(config);
    
    console.log('✅ CONEXÃO ESTABELECIDA COM SUCESSO!\n');

    // Verifica versão do MySQL
    console.log('═══════════════════════════════════════════════════════════');
    console.log('PASSO 2: Verificando versão do MySQL');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    const [versionResult] = await connection.query('SELECT VERSION() as version');
    console.log(`✅ Versão MySQL: ${versionResult[0].version}\n`);

    // Lista todos os bancos de dados
    console.log('═══════════════════════════════════════════════════════════');
    console.log('PASSO 3: Listando bancos de dados disponíveis');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('📁 Bancos de dados encontrados:');
    databases.forEach(db => {
      const dbName = db.Database || db.SCHEMA_NAME;
      const isTarget = dbName === 'muonline' || dbName === 'webmu';
      console.log(`   ${isTarget ? '🎯' : '  '} ${dbName}`);
    });
    console.log('');

    // Verifica se os bancos necessários existem
    const dbNames = databases.map(db => db.Database || db.SCHEMA_NAME);
    const hasMuonline = dbNames.includes('muonline');
    const hasWebmu = dbNames.includes('webmu');

    if (!hasMuonline && !hasWebmu) {
      console.log('⚠️  ATENÇÃO: Nenhum dos bancos "muonline" ou "webmu" foi encontrado!');
      console.log('   Bancos disponíveis:', dbNames.join(', '));
      console.log('\n💡 Você pode estar usando outro nome. Veja a lista acima.\n');
    }

    // Testa banco "muonline"
    if (hasMuonline) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('PASSO 4: Testando banco "muonline"');
      console.log('═══════════════════════════════════════════════════════════\n');
      
      await connection.query('USE muonline');
      
      // Lista tabelas
      const [tables] = await connection.query('SHOW TABLES');
      console.log(`✅ Banco "muonline" acessado com sucesso!`);
      console.log(`📊 Total de tabelas: ${tables.length}\n`);
      
      console.log('🔍 Procurando tabelas importantes do MU Online:\n');
      
      const tableNames = tables.map(t => Object.values(t)[0]);
      
      // Tabelas esperadas
      const expectedTables = [
        'MEMB_INFO',
        'MEMB_STAT', 
        'Character',
        'Guild',
        'AccountCharacter',
        'warehouse'
      ];

      for (const tableName of expectedTables) {
        const exists = tableNames.some(t => t.toLowerCase() === tableName.toLowerCase());
        console.log(`   ${exists ? '✅' : '❌'} ${tableName}`);
        
        if (exists) {
          // Conta registros
          const actualTableName = tableNames.find(t => t.toLowerCase() === tableName.toLowerCase());
          try {
            const [countResult] = await connection.query(`SELECT COUNT(*) as total FROM \`${actualTableName}\``);
            console.log(`      └─ ${countResult[0].total} registros`);
          } catch (err) {
            console.log(`      └─ Erro ao contar: ${err.message}`);
          }
        }
      }
      console.log('');

      // Testa players online
      const onlineTableExists = tableNames.some(t => t.toLowerCase() === 'memb_stat');
      if (onlineTableExists) {
        const actualTableName = tableNames.find(t => t.toLowerCase() === 'memb_stat');
        try {
          console.log('🎮 Testando query de players online...');
          const [onlineResult] = await connection.query(
            `SELECT COUNT(*) as total FROM \`${actualTableName}\` WHERE ConnectStat = 1`
          );
          console.log(`   ✅ Players online: ${onlineResult[0].total}\n`);
        } catch (err) {
          console.log(`   ⚠️  Erro: ${err.message}`);
          console.log(`   💡 A tabela existe mas pode ter estrutura diferente\n`);
        }
      }

      // Testa ranking
      const charTableExists = tableNames.some(t => t.toLowerCase() === 'character');
      if (charTableExists) {
        const actualTableName = tableNames.find(t => t.toLowerCase() === 'character');
        try {
          console.log('🏆 Testando query de ranking...');
          const [rankResult] = await connection.query(
            `SELECT Name, cLevel FROM \`${actualTableName}\` ORDER BY cLevel DESC LIMIT 3`
          );
          console.log(`   ✅ Top 3 players:`);
          rankResult.forEach((player, i) => {
            console.log(`      ${i + 1}. ${player.Name} - Level ${player.cLevel}`);
          });
          console.log('');
        } catch (err) {
          console.log(`   ⚠️  Erro: ${err.message}`);
          console.log(`   💡 Tentando com estrutura alternativa...\n`);
          
          // Tenta descobrir estrutura
          try {
            const [columns] = await connection.query(`SHOW COLUMNS FROM \`${actualTableName}\``);
            console.log(`   📋 Colunas da tabela Character:`);
            columns.slice(0, 10).forEach(col => {
              console.log(`      - ${col.Field} (${col.Type})`);
            });
            console.log('');
          } catch (e) {
            console.log(`   ❌ Não foi possível listar colunas\n`);
          }
        }
      }
    }

    // Testa banco "webmu"
    if (hasWebmu) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('PASSO 5: Testando banco "webmu"');
      console.log('═══════════════════════════════════════════════════════════\n');
      
      await connection.query('USE webmu');
      
      const [webTables] = await connection.query('SHOW TABLES');
      console.log(`✅ Banco "webmu" acessado com sucesso!`);
      console.log(`📊 Total de tabelas: ${webTables.length}\n`);
      
      if (webTables.length > 0) {
        console.log('📋 Primeiras 10 tabelas:');
        webTables.slice(0, 10).forEach(t => {
          console.log(`   - ${Object.values(t)[0]}`);
        });
        console.log('');
      }
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ DIAGNÓSTICO CONCLUÍDO COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('🎯 PRÓXIMOS PASSOS:\n');
    console.log('   1. Anote o nome correto dos bancos de dados');
    console.log('   2. Verifique se as tabelas importantes existem');
    console.log('   3. Execute: npm run server');
    console.log('   4. Teste a API: http://localhost:3001/api/stats/online\n');

  } catch (error) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('❌ ERRO NA CONEXÃO');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log(`🔴 Tipo: ${error.code || 'UNKNOWN'}`);
    console.log(`📝 Mensagem: ${error.message}\n`);

    console.log('🔍 POSSÍVEIS CAUSAS:\n');

    if (error.code === 'ECONNREFUSED') {
      console.log('❌ MySQL não está aceitando conexões');
      console.log('   Soluções:');
      console.log('   1. Verifique se MySQL está rodando no servidor:');
      console.log('      sudo systemctl status mysql');
      console.log('   2. Verifique se a porta 3306 está aberta:');
      console.log('      sudo netstat -tlnp | grep 3306');
      console.log('   3. Verifique bind-address no /etc/mysql/my.cnf');
      console.log('      bind-address = 0.0.0.0  (permite conexões remotas)');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      console.log('❌ Não consegue alcançar o servidor');
      console.log('   Soluções:');
      console.log('   1. Verifique se o IP está correto: ' + config.host);
      console.log('   2. Teste ping ao servidor:');
      console.log(`      ping ${config.host}`);
      console.log('   3. Verifique firewall no servidor VPS:');
      console.log('      sudo ufw status');
      console.log('      sudo ufw allow 3306/tcp');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('❌ Usuário ou senha incorretos');
      console.log('   Soluções:');
      console.log('   1. Verifique credenciais no arquivo .env');
      console.log('   2. Teste login manual:');
      console.log(`      mysql -h ${config.host} -u ${config.user} -p`);
      console.log('   3. Verifique permissões do usuário no MySQL:');
      console.log(`      GRANT ALL PRIVILEGES ON *.* TO '${config.user}'@'%';`);
      console.log('      FLUSH PRIVILEGES;');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('❌ Banco de dados não existe');
      console.log('   Soluções:');
      console.log('   1. Verifique nome do banco no .env');
      console.log('   2. Liste bancos disponíveis:');
      console.log('      SHOW DATABASES;');
    }

    console.log('\n📖 Documentação completa: GUIA_CONEXAO_MYSQL.md\n');
    process.exit(1);

  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexão encerrada.\n');
    }
  }
}

testConnection();
