/**
 * Configuração de Conexão com MariaDB/MySQL
 * Dual Database: muonline (readonly) + webmu (read/write)
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════
// POOL MUONLINE (Database do Servidor MU - Read Only)
// ═══════════════════════════════════════════════════════════════════

const poolMU = mysql.createPool({
  host: process.env.DB_MU_HOST || '127.0.0.1',
  port: process.env.DB_MU_PORT || 3306,
  user: process.env.DB_MU_USER || 'root',
  password: process.env.DB_MU_PASSWORD || '',
  database: process.env.DB_MU_NAME || 'muonline',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
  // Removido: family: 4 (não é opção válida no MySQL2)
});

// ═══════════════════════════════════════════════════════════════════
// POOL WEBMU (Database do Site - Read + Write)
// ═══════════════════════════════════════════════════════════════════

const poolWEB = mysql.createPool({
  host: process.env.DB_WEB_HOST || '127.0.0.1',
  port: process.env.DB_WEB_PORT || 3306,
  user: process.env.DB_WEB_USER || 'root',
  password: process.env.DB_WEB_PASSWORD || '',
  database: process.env.DB_WEB_NAME || 'webmu',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
  // Removido: family: 4 (não é opção válida no MySQL2)
});

// ═══════════════════════════════════════════════════════════════════
// TESTAR CONEXÕES
// ═══════════════════════════════════════════════════════════════════

const testConnection = async () => {
  let muOK = false;
  let webOK = false;
  
  // Testar Database MU
  try {
    console.log('🔍 Testando conexão com database MU...');
    console.log(`   Host: ${process.env.DB_MU_HOST || '127.0.0.1'}`)
;
    console.log(`   Port: ${process.env.DB_MU_PORT || 3306}`);
    console.log(`   User: ${process.env.DB_MU_USER || 'root'}`);
    console.log(`   Database: ${process.env.DB_MU_NAME || 'muonline'}`);
    
    const connMU = await poolMU.getConnection();
    console.log('✅ Conectado ao database MU com sucesso!');
    connMU.release();
    muOK = true;
  } catch (error) {
    console.error('❌ Erro ao conectar database MU:', error.message);
  }
  
  // Testar Database Web
  try {
    console.log('\n🔍 Testando conexão com database Web...');
    console.log(`   Host: ${process.env.DB_WEB_HOST || '127.0.0.1'}`);
    console.log(`   Port: ${process.env.DB_WEB_PORT || 3306}`);
    console.log(`   User: ${process.env.DB_WEB_USER || 'root'}`);
    console.log(`   Database: ${process.env.DB_WEB_NAME || 'webmu'}`);
    
    const connWEB = await poolWEB.getConnection();
    console.log('✅ Conectado ao database Web com sucesso!');
    connWEB.release();
    webOK = true;
  } catch (error) {
    console.error('❌ Erro ao conectar database Web:', error.message);
  }
  
  // Resultado
  if (muOK && webOK) {
    console.log('\n🎉 Ambas databases conectadas com sucesso!\n');
    return true;
  } else {
    console.error('\n💡 Dicas de diagnóstico:');
    console.error('   1. Verifique se o MariaDB está rodando');
    console.error('   2. Verifique as credenciais no arquivo .env');
    console.error('   3. Verifique se as databases existem');
    console.error('   4. Execute o instalador: http://seudominio.com/install\n');
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════════
// EXECUTAR QUERIES
// ═══════════════════════════════════════════════════════════════════

// Query no database MU (somente leitura)
const executeQueryMU = async (sql, params = []) => {
  try {
    const [rows] = await poolMU.execute(sql, params);
    return { success: true, data: rows };
  } catch (error) {
    console.error('❌ Erro na query MU:', error.message);
    console.error('SQL:', sql);
    return { success: false, error: error.message };
  }
};

// Query no database Web (leitura + escrita)
const executeQueryWEB = async (sql, params = []) => {
  try {
    const [rows] = await poolWEB.execute(sql, params);
    return { success: true, data: rows };
  } catch (error) {
    console.error('❌ Erro na query Web:', error.message);
    console.error('SQL:', sql);
    return { success: false, error: error.message };
  }
};

// Query genérica (compatibilidade com código antigo - usa poolMU)
const executeQuery = async (sql, params = []) => {
  return executeQueryMU(sql, params);
};

// ═══════════════════════════════════════════════════════════════════
// TRANSAÇÕES
// ═══════════════════════════════════════════════════════════════════

// Transação no database MU
const executeTransactionMU = async (queries) => {
  const connection = await poolMU.getConnection();
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
    console.error('❌ Erro na transação MU:', error.message);
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
};

// Transação no database Web
const executeTransactionWEB = async (queries) => {
  const connection = await poolWEB.getConnection();
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
    console.error('❌ Erro na transação Web:', error.message);
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
};

// Transação genérica (compatibilidade - usa poolMU)
const executeTransaction = async (queries) => {
  return executeTransactionMU(queries);
};

// ═══════════════════════════════════════════════════════════════════
// FECHAR CONEXÕES
// ═══════════════════════════════════════════════════════════════════

const closePool = async () => {
  try {
    await poolMU.end();
    console.log('🔌 Pool MU fechado');
    
    await poolWEB.end();
    console.log('🔌 Pool Web fechado');
  } catch (error) {
    console.error('❌ Erro ao fechar pools:', error.message);
  }
};

// ═══════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════

module.exports = {
  // Pools
  pool: poolMU,           // Compatibilidade com código antigo
  poolMU,
  poolWEB,
  
  // Testes
  testConnection,
  
  // Queries simples
  executeQuery,           // Compatibilidade (usa MU)
  executeQueryMU,
  executeQueryWEB,
  
  // Transações
  executeTransaction,     // Compatibilidade (usa MU)
  executeTransactionMU,
  executeTransactionWEB,
  
  // Utilitários
  closePool
};