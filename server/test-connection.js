// Script para testar conexão com o banco de dados MySQL
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'MuOnline',
  connectTimeout: 10000 // 10 segundos timeout
};

async function testConnection() {
  console.log('🔍 Testando conexão com MySQL...\n');
  console.log('📋 Configuração:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Porta: ${config.port}`);
  console.log(`   Usuário: ${config.user}`);
  console.log(`   Banco: ${config.database}`);
  console.log(`   Senha: ${config.password ? '***configurada***' : '⚠️  NÃO CONFIGURADA'}\n`);

  let connection;

  try {
    // Tenta conectar
    console.log('🔌 Conectando...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Testa query básica
    console.log('📊 Testando queries básicas...\n');

    // 1. Testa tabela MEMB_INFO
    console.log('1️⃣ Testando tabela MEMB_INFO (Contas)...');
    try {
      const [accountsResult] = await connection.query('SELECT COUNT(*) as total FROM MEMB_INFO');
      console.log(`   ✅ Total de contas: ${accountsResult[0].total}\n`);
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}\n`);
    }

    // 2. Testa tabela Character
    console.log('2️⃣ Testando tabela Character (Personagens)...');
    try {
      const [charsResult] = await connection.query('SELECT COUNT(*) as total FROM Character');
      console.log(`   ✅ Total de personagens: ${charsResult[0].total}\n`);
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}\n`);
    }

    // 3. Testa tabela MEMB_STAT (Players Online)
    console.log('3️⃣ Testando tabela MEMB_STAT (Players Online)...');
    try {
      const [onlineResult] = await connection.query(
        'SELECT COUNT(*) as total FROM MEMB_STAT WHERE ConnectStat = 1'
      );
      console.log(`   ✅ Players online: ${onlineResult[0].total}\n`);
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}\n`);
    }

    // 4. Testa tabela Guild
    console.log('4️⃣ Testando tabela Guild (Guilds)...');
    try {
      const [guildsResult] = await connection.query('SELECT COUNT(*) as total FROM Guild');
      console.log(`   ✅ Total de guilds: ${guildsResult[0].total}\n`);
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}\n`);
    }

    // 5. Testa top 3 players
    console.log('5️⃣ Testando ranking (Top 3 players)...');
    try {
      const [topPlayers] = await connection.query(`
        SELECT Name, cLevel, COALESCE(resets, 0) as resets, Class
        FROM Character
        WHERE CtlCode = 0
        ORDER BY cLevel DESC, resets DESC
        LIMIT 3
      `);
      
      if (topPlayers.length > 0) {
        console.log('   ✅ Top 3 players:');
        topPlayers.forEach((player, i) => {
          console.log(`      ${i + 1}. ${player.Name} - Level ${player.cLevel} (${player.resets} resets)`);
        });
        console.log('');
      } else {
        console.log('   ⚠️  Nenhum personagem encontrado\n');
      }
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}\n`);
    }

    console.log('═══════════════════════════════════════════════════');
    console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('🚀 Próximo passo: Execute "npm run server" para iniciar a API\n');

  } catch (error) {
    console.log('═══════════════════════════════════════════════════');
    console.log('❌ ERRO NA CONEXÃO!');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('Detalhes do erro:');
    console.log(error.message);
    console.log('\n📝 Verifique:');
    console.log('   1. MySQL está rodando?');
    console.log('   2. Credenciais no arquivo .env estão corretas?');
    console.log('   3. Firewall permite conexão na porta 3306?');
    console.log('   4. Usuário tem permissão de acesso ao banco?\n');
    console.log('💡 Teste manual:');
    console.log(`   mysql -h ${config.host} -u ${config.user} -p ${config.database}\n`);
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();