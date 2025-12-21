require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testando Conexão com MariaDB...\n');
  
  // Mostrar configurações
  console.log('📋 Configurações:');
  console.log(`   DB_HOST: ${process.env.DB_HOST || '127.0.0.1'}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT || 3306}`);
  console.log(`   DB_USER: ${process.env.DB_USER || 'root'}`);
  console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '****' : '(vazia)'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || 'muonline'}`);
  console.log('');

  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'muonline',
    family: 4
  };

  try {
    console.log('⏳ Tentando conectar...');
    const connection = await mysql.createConnection(config);
    console.log('✅ CONEXÃO ESTABELECIDA COM SUCESSO!\n');

    // Testar query
    console.log('🔍 Testando query...');
    const [rows] = await connection.execute('SELECT VERSION() as version');
    console.log(`✅ MariaDB Version: ${rows[0].version}\n`);

    // Listar databases
    console.log('📊 Databases disponíveis:');
    const [databases] = await connection.execute('SHOW DATABASES');
    databases.forEach(db => {
      console.log(`   - ${db.Database}`);
    });

    await connection.end();
    console.log('\n✅ Teste concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO NA CONEXÃO:');
    console.error(`   Código: ${error.code}`);
    console.error(`   Mensagem: ${error.message}`);
    console.error(`   SQL State: ${error.sqlState || 'N/A'}`);
    console.error('\n💡 Dicas:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   - MariaDB não está rodando ou não aceita conexões');
      console.error('   - Verifique: systemctl status mariadb');
      console.error('   - Inicie: systemctl start mariadb');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   - Usuário ou senha incorretos');
      console.error('   - Verifique as credenciais no arquivo .env');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   - Database não existe');
      console.error('   - Crie com: CREATE DATABASE MuOnline;');
    }
    
    process.exit(1);
  }
}

testConnection();