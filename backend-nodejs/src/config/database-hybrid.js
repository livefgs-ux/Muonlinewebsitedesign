/**
 * 🔀 SISTEMA HÍBRIDO DE DATABASE
 * 
 * Suporta MySQL/MariaDB E SQL Server 2019
 * Detecção automática do tipo de banco
 * Queries compatíveis com ambos
 * 
 * @version 1.0.0 - V622 Hybrid System
 */

require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════
// DETECÇÃO DO TIPO DE BANCO DE DADOS
// ═══════════════════════════════════════════════════════════════════

const DB_TYPE = (process.env.DB_TYPE || 'mysql').toLowerCase();

console.log(`\n🔀 ═══════════════════════════════════════════════════════`);
console.log(`🔀 HYBRID DATABASE SYSTEM`);
console.log(`🔀 ═══════════════════════════════════════════════════════`);
console.log(`📊 Database Type: ${DB_TYPE.toUpperCase()}`);
console.log(`🔀 ═══════════════════════════════════════════════════════\n`);

// ═══════════════════════════════════════════════════════════════════
// IMPORTAR DRIVERS BASEADO NO TIPO
// ═══════════════════════════════════════════════════════════════════

let poolMU = null;
let poolWEB = null;
let dbDriver = null;

if (DB_TYPE === 'mssql' || DB_TYPE === 'sqlserver') {
  // ═══════════════════════════════════════════════════════════════════
  // SQL SERVER 2019
  // ═══════════════════════════════════════════════════════════════════
  
  const sql = require('mssql');
  dbDriver = 'mssql';
  
  console.log('🔵 Inicializando SQL Server 2019...\n');
  
  // Config MU Database
  const configMU = {
    server: process.env.DB_MU_HOST || 'localhost',
    port: parseInt(process.env.DB_MU_PORT) || 1433,
    user: process.env.DB_MU_USER || 'sa',
    password: process.env.DB_MU_PASSWORD || '',
    database: process.env.DB_MU_NAME || 'MuOnline',
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true', // Azure requer true
      trustServerCertificate: process.env.DB_TRUST_CERT !== 'false', // true em dev
      enableArithAbort: true,
      connectionTimeout: 30000,
      requestTimeout: 30000
    },
    pool: {
      max: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };
  
  // Config Web Database
  const configWEB = {
    server: process.env.DB_WEB_HOST || 'localhost',
    port: parseInt(process.env.DB_WEB_PORT) || 1433,
    user: process.env.DB_WEB_USER || 'sa',
    password: process.env.DB_WEB_PASSWORD || '',
    database: process.env.DB_WEB_NAME || 'MeuWeb',
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_CERT !== 'false',
      enableArithAbort: true,
      connectionTimeout: 30000,
      requestTimeout: 30000
    },
    pool: {
      max: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };
  
  poolMU = new sql.ConnectionPool(configMU);
  poolWEB = new sql.ConnectionPool(configWEB);
  
} else {
  // ═══════════════════════════════════════════════════════════════════
  // MYSQL/MARIADB (PADRÃO)
  // ═══════════════════════════════════════════════════════════════════
  
  const mysql = require('mysql2/promise');
  dbDriver = 'mysql';
  
  console.log('🟢 Inicializando MySQL/MariaDB...\n');
  
  poolMU = mysql.createPool({
    host: process.env.DB_MU_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_MU_PORT) || 3306,
    user: process.env.DB_MU_USER || 'root',
    password: process.env.DB_MU_PASSWORD || '',
    database: process.env.DB_MU_NAME || 'muonline',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });
  
  poolWEB = mysql.createPool({
    host: process.env.DB_WEB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_WEB_PORT) || 3306,
    user: process.env.DB_WEB_USER || 'root',
    password: process.env.DB_WEB_PASSWORD || '',
    database: process.env.DB_WEB_NAME || 'meuweb',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });
}

// ═══════════════════════════════════════════════════════════════════
// TESTAR CONEXÕES
// ═══════════════════════════════════════════════════════════════════

const testConnection = async () => {
  // Se não tiver .env, não conectar (modo instalação)
  if (!process.env.DB_MU_PASSWORD && !process.env.DB_WEB_PASSWORD) {
    console.log('⚠️  Arquivo .env não configurado (modo instalação)');
    console.log('📦 Use o instalador em: http://seudominio.com:3001/install\n');
    return false;
  }
  
  let muOK = false;
  let webOK = false;
  
  if (dbDriver === 'mssql') {
    // ═══════════════════════════════════════════════════════════════
    // TESTAR SQL SERVER
    // ═══════════════════════════════════════════════════════════════
    
    try {
      console.log('🔍 Testando conexão com SQL Server MU...');
      console.log(`   Server: ${process.env.DB_MU_HOST || 'localhost'}`);
      console.log(`   Port: ${process.env.DB_MU_PORT || 1433}`);
      console.log(`   User: ${process.env.DB_MU_USER || 'sa'}`);
      console.log(`   Database: ${process.env.DB_MU_NAME || 'MuOnline'}`);
      
      await poolMU.connect();
      console.log('✅ Conectado ao SQL Server MU com sucesso!');
      muOK = true;
    } catch (error) {
      console.error('❌ Erro ao conectar SQL Server MU:', error.message);
    }
    
    try {
      console.log('\n🔍 Testando conexão com SQL Server Web...');
      console.log(`   Server: ${process.env.DB_WEB_HOST || 'localhost'}`);
      console.log(`   Port: ${process.env.DB_WEB_PORT || 1433}`);
      console.log(`   User: ${process.env.DB_WEB_USER || 'sa'}`);
      console.log(`   Database: ${process.env.DB_WEB_NAME || 'MeuWeb'}`);
      
      await poolWEB.connect();
      console.log('✅ Conectado ao SQL Server Web com sucesso!');
      webOK = true;
    } catch (error) {
      console.error('❌ Erro ao conectar SQL Server Web:', error.message);
    }
    
  } else {
    // ═══════════════════════════════════════════════════════════════
    // TESTAR MYSQL
    // ═══════════════════════════════════════════════════════════════
    
    try {
      console.log('🔍 Testando conexão com MySQL MU...');
      console.log(`   Host: ${process.env.DB_MU_HOST || '127.0.0.1'}`);
      console.log(`   Port: ${process.env.DB_MU_PORT || 3306}`);
      console.log(`   User: ${process.env.DB_MU_USER || 'root'}`);
      console.log(`   Database: ${process.env.DB_MU_NAME || 'muonline'}`);
      
      const connMU = await poolMU.getConnection();
      console.log('✅ Conectado ao MySQL MU com sucesso!');
      connMU.release();
      muOK = true;
    } catch (error) {
      console.error('❌ Erro ao conectar MySQL MU:', error.message);
    }
    
    try {
      console.log('\n🔍 Testando conexão com MySQL Web...');
      console.log(`   Host: ${process.env.DB_WEB_HOST || '127.0.0.1'}`);
      console.log(`   Port: ${process.env.DB_WEB_PORT || 3306}`);
      console.log(`   User: ${process.env.DB_WEB_USER || 'root'}`);
      console.log(`   Database: ${process.env.DB_WEB_NAME || 'meuweb'}`);
      
      const connWEB = await poolWEB.getConnection();
      console.log('✅ Conectado ao MySQL Web com sucesso!');
      connWEB.release();
      webOK = true;
    } catch (error) {
      console.error('❌ Erro ao conectar MySQL Web:', error.message);
    }
  }
  
  // Resultado
  if (muOK && webOK) {
    console.log(`\n🎉 Ambas databases ${dbDriver.toUpperCase()} conectadas com sucesso!\n`);
    return true;
  } else {
    console.error('\n💡 Dicas de diagnóstico:');
    if (dbDriver === 'mssql') {
      console.error('   1. Verifique se o SQL Server está rodando');
      console.error('   2. Verifique as credenciais no arquivo .env');
      console.error('   3. Verifique se TCP/IP está habilitado no SQL Server Configuration Manager');
      console.error('   4. Verifique se a porta 1433 está aberta no firewall');
    } else {
      console.error('   1. Verifique se o MariaDB/MySQL está rodando: sudo systemctl status mariadb');
      console.error('   2. Verifique as credenciais no arquivo .env');
      console.error('   3. Verifique se as databases existem: mysql -u root -p -e "SHOW DATABASES;"');
    }
    console.error('   5. Execute o instalador: http://seudominio.com:3001/install\n');
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════════
// EXECUTAR QUERIES (UNIVERSAL)
// ═══════════════════════════════════════════════════════════════════

const executeQueryMU = async (sql, params = []) => {
  try {
    if (dbDriver === 'mssql') {
      const request = poolMU.request();
      
      // Bind parameters (@p1, @p2, etc.)
      params.forEach((param, index) => {
        request.input(`p${index}`, param);
      });
      
      // Converter placeholders ? para @pX
      let sqlConverted = sql;
      params.forEach((_, index) => {
        sqlConverted = sqlConverted.replace('?', `@p${index}`);
      });
      
      const result = await request.query(sqlConverted);
      return { success: true, data: result.recordset };
      
    } else {
      const [rows] = await poolMU.execute(sql, params);
      return { success: true, data: rows };
    }
  } catch (error) {
    console.error('❌ Erro na query MU:', error.message);
    console.error('SQL:', sql);
    return { success: false, error: error.message };
  }
};

const executeQueryWEB = async (sql, params = []) => {
  try {
    if (dbDriver === 'mssql') {
      const request = poolWEB.request();
      
      params.forEach((param, index) => {
        request.input(`p${index}`, param);
      });
      
      let sqlConverted = sql;
      params.forEach((_, index) => {
        sqlConverted = sqlConverted.replace('?', `@p${index}`);
      });
      
      const result = await request.query(sqlConverted);
      return { success: true, data: result.recordset };
      
    } else {
      const [rows] = await poolWEB.execute(sql, params);
      return { success: true, data: rows };
    }
  } catch (error) {
    console.error('❌ Erro na query Web:', error.message);
    console.error('SQL:', sql);
    return { success: false, error: error.message };
  }
};

const executeQuery = async (sql, params = []) => {
  return executeQueryMU(sql, params);
};

// ═══════════════════════════════════════════════════════════════════
// TRANSAÇÕES (UNIVERSAL)
// ═══════════════════════════════════════════════════════════════════

const executeTransactionMU = async (queries) => {
  if (dbDriver === 'mssql') {
    const transaction = poolMU.transaction();
    try {
      await transaction.begin();
      
      const results = [];
      for (const { sql, params } of queries) {
        const request = transaction.request();
        
        params.forEach((param, index) => {
          request.input(`p${index}`, param);
        });
        
        let sqlConverted = sql;
        params.forEach((_, index) => {
          sqlConverted = sqlConverted.replace('?', `@p${index}`);
        });
        
        const result = await request.query(sqlConverted);
        results.push(result.recordset);
      }
      
      await transaction.commit();
      return { success: true, data: results };
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro na transação MU:', error.message);
      return { success: false, error: error.message };
    }
  } else {
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
  }
};

const executeTransactionWEB = async (queries) => {
  if (dbDriver === 'mssql') {
    const transaction = poolWEB.transaction();
    try {
      await transaction.begin();
      
      const results = [];
      for (const { sql, params } of queries) {
        const request = transaction.request();
        
        params.forEach((param, index) => {
          request.input(`p${index}`, param);
        });
        
        let sqlConverted = sql;
        params.forEach((_, index) => {
          sqlConverted = sqlConverted.replace('?', `@p${index}`);
        });
        
        const result = await request.query(sqlConverted);
        results.push(result.recordset);
      }
      
      await transaction.commit();
      return { success: true, data: results };
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro na transação Web:', error.message);
      return { success: false, error: error.message };
    }
  } else {
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
  }
};

const executeTransaction = async (queries) => {
  return executeTransactionMU(queries);
};

// ═══════════════════════════════════════════════════════════════════
// FECHAR CONEXÕES
// ═══════════════════════════════════════════════════════════════════

const closePool = async () => {
  try {
    if (dbDriver === 'mssql') {
      await poolMU.close();
      console.log('🔌 Pool MU (SQL Server) fechado');
      
      await poolWEB.close();
      console.log('🔌 Pool Web (SQL Server) fechado');
    } else {
      await poolMU.end();
      console.log('🔌 Pool MU (MySQL) fechado');
      
      await poolWEB.end();
      console.log('🔌 Pool Web (MySQL) fechado');
    }
  } catch (error) {
    console.error('❌ Erro ao fechar pools:', error.message);
  }
};

// ═══════════════════════════════════════════════════════════════════
// UTILITÁRIOS ESPECÍFICOS
// ═══════════════════════════════════════════════════════════════════

const getDbType = () => dbDriver;

const isMySQL = () => dbDriver === 'mysql';

const isMSSQL = () => dbDriver === 'mssql';

// ═══════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════

module.exports = {
  // Pools
  pool: poolMU,
  poolMU,
  poolWEB,
  
  // Testes
  testConnection,
  
  // Queries
  executeQuery,
  executeQueryMU,
  executeQueryWEB,
  
  // Transações
  executeTransaction,
  executeTransactionMU,
  executeTransactionWEB,
  
  // Utilitários
  closePool,
  getDbType,
  isMySQL,
  isMSSQL
};
