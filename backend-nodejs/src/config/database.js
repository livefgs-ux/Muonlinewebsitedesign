/**
 * Configuração de Conexão com MariaDB/MySQL
 * Pool de conexões para melhor performance
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Criar pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',  // Forçar IPv4 ao invés de localhost
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'muonline',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Forçar IPv4
  family: 4
});

// Testar conexão
const testConnection = async () => {
  try {
    console.log('🔍 Tentando conectar ao MariaDB...');
    console.log(`   Host: ${process.env.DB_HOST || '127.0.0.1'}`);
    console.log(`   Port: ${process.env.DB_PORT || 3306}`);
    console.log(`   User: ${process.env.DB_USER || 'root'}`);
    console.log(`   Database: ${process.env.DB_NAME || 'muonline'}`);
    
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao MariaDB com sucesso!');
    console.log(`📊 Database: ${process.env.DB_NAME || 'muonline'}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar no MariaDB:', error.message);
    console.error('💡 Dicas de diagnóstico:');
    console.error('   1. Verifique se o MariaDB está rodando: systemctl status mariadb');
    console.error('   2. Verifique as credenciais no arquivo .env');
    console.error('   3. Verifique se o usuário tem permissão para acessar o banco');
    console.error('   4. Teste a conexão manualmente: mysql -u root -p -h 127.0.0.1');
    return false;
  }
};

// Executar query com tratamento de erro
const executeQuery = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return { success: true, data: rows };
  } catch (error) {
    console.error('❌ Erro na query:', error.message);
    console.error('SQL:', sql);
    return { success: false, error: error.message };
  }
};

// Executar múltiplas queries em transação
const executeTransaction = async (queries) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { sql, params } of queries) {
      const [rows] = await connection.execute(sql, params);
      results.push(rows);
    }
    
    await connection.commit();
    return { success: true, data: results };
  } catch (error) {
    await connection.rollback();
    console.error('❌ Erro na transação:', error.message);
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
};

// Fechar pool (para uso em shutdown gracioso)
const closePool = async () => {
  try {
    await pool.end();
    console.log('🔌 Pool de conexões fechado');
  } catch (error) {
    console.error('❌ Erro ao fechar pool:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  executeTransaction,
  closePool
};