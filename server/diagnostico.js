/**
 * 🔍 DIAGNÓSTICO DO SISTEMA - MeuMU Online
 * 
 * Este script verifica:
 * - Conexão com banco de dados
 * - Estrutura de tabelas
 * - Variáveis de ambiente
 * - Configurações do servidor
 */

import dotenv from 'dotenv';
import pool from './config/database.js';

dotenv.config();

console.log('\n⚔️  MeuMU Online - Season 19-2-3 Épico');
console.log('🔍 DIAGNÓSTICO DO SISTEMA\n');
console.log('='.repeat(60));

// Verifica variáveis de ambiente
async function checkEnvironment() {
  console.log('\n📋 1. VERIFICANDO VARIÁVEIS DE AMBIENTE...\n');
  
  const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
  let allOk = true;
  
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value || value === 'sua_senha_aqui' || value === 'sua_chave_secreta_jwt_aqui') {
      console.log(`   ❌ ${varName} - NÃO CONFIGURADO`);
      allOk = false;
    } else {
      // Oculta senha e JWT_SECRET por segurança
      if (varName === 'DB_PASSWORD' || varName === 'JWT_SECRET') {
        console.log(`   ✅ ${varName} - Configurado (****)`);
      } else {
        console.log(`   ✅ ${varName} - ${value}`);
      }
    }
  }
  
  return allOk;
}

// Testa conexão com banco
async function checkDatabaseConnection() {
  console.log('\n📡 2. TESTANDO CONEXÃO COM BANCO DE DADOS...\n');
  
  try {
    const connection = await pool.getConnection();
    console.log('   ✅ Conexão estabelecida com sucesso!');
    
    // Testa query simples
    const [result] = await connection.query('SELECT VERSION() as version');
    console.log(`   ℹ️  MySQL/MariaDB versão: ${result[0].version}`);
    
    connection.release();
    return true;
  } catch (error) {
    console.log('   ❌ ERRO ao conectar:', error.message);
    console.log('\n   💡 Dicas:');
    console.log('      - Verifique se o MySQL está rodando');
    console.log('      - Confirme as credenciais no arquivo .env');
    console.log('      - Teste manualmente: mysql -u sa -p -h localhost MuOnline');
    return false;
  }
}

// Verifica estrutura de tabelas
async function checkTables() {
  console.log('\n📊 3. VERIFICANDO ESTRUTURA DE TABELAS...\n');
  
  const requiredTables = [
    'MEMB_INFO',
    'MEMB_STAT',
    'Character',
    'Guild',
    'GuildMember'
  ];
  
  let allTablesOk = true;
  
  try {
    for (const tableName of requiredTables) {
      try {
        const [rows] = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   ✅ ${tableName.padEnd(20)} - ${rows[0].count} registros`);
      } catch (error) {
        console.log(`   ❌ ${tableName.padEnd(20)} - NÃO ENCONTRADA`);
        allTablesOk = false;
      }
    }
    
    return allTablesOk;
  } catch (error) {
    console.log('   ❌ Erro ao verificar tabelas:', error.message);
    return false;
  }
}

// Verifica estrutura de colunas importantes
async function checkColumns() {
  console.log('\n🔧 4. VERIFICANDO COLUNAS IMPORTANTES...\n');
  
  try {
    // Verifica coluna de resets
    const [charColumns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Character' 
      AND COLUMN_NAME IN ('Resets', 'resets', 'MasterResets')
    `);
    
    if (charColumns.length > 0) {
      charColumns.forEach(col => {
        console.log(`   ✅ Character.${col.COLUMN_NAME} - Encontrada`);
      });
    } else {
      console.log('   ⚠️  Coluna "Resets" não encontrada na tabela Character');
      console.log('      O sistema de reset pode não funcionar corretamente.');
    }
    
    // Verifica coluna de status online
    const [statColumns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'MEMB_STAT' 
      AND COLUMN_NAME = 'ConnectStat'
    `);
    
    if (statColumns.length > 0) {
      console.log(`   ✅ MEMB_STAT.ConnectStat - Encontrada`);
    } else {
      console.log('   ⚠️  Coluna "ConnectStat" não encontrada na tabela MEMB_STAT');
      console.log('      Contagem de players online pode não funcionar.');
    }
    
    return true;
  } catch (error) {
    console.log('   ❌ Erro ao verificar colunas:', error.message);
    return false;
  }
}

// Testa consultas de exemplo
async function testSampleQueries() {
  console.log('\n🧪 5. TESTANDO CONSULTAS DE EXEMPLO...\n');
  
  try {
    // Conta total de contas
    const [accounts] = await pool.query('SELECT COUNT(*) as total FROM MEMB_INFO');
    console.log(`   ✅ Total de contas registradas: ${accounts[0].total}`);
    
    // Conta total de personagens
    const [chars] = await pool.query('SELECT COUNT(*) as total FROM Character');
    console.log(`   ✅ Total de personagens: ${chars[0].total}`);
    
    // Conta players online
    const [online] = await pool.query('SELECT COUNT(*) as total FROM MEMB_STAT WHERE ConnectStat = 1');
    console.log(`   ✅ Players online no momento: ${online[0].total}`);
    
    // Top 3 characters por level
    const [topChars] = await pool.query(`
      SELECT Name, cLevel, COALESCE(Resets, 0) as resets 
      FROM Character 
      WHERE CtlCode = 0 
      ORDER BY cLevel DESC 
      LIMIT 3
    `);
    
    console.log('\n   🏆 Top 3 Characters por Nível:');
    topChars.forEach((char, idx) => {
      console.log(`      ${idx + 1}. ${char.Name} - Lvl ${char.cLevel} (${char.resets} resets)`);
    });
    
    return true;
  } catch (error) {
    console.log('   ❌ Erro ao executar consultas:', error.message);
    return false;
  }
}

// Verifica configurações de segurança
async function checkSecurity() {
  console.log('\n🔐 6. VERIFICANDO CONFIGURAÇÕES DE SEGURANÇA...\n');
  
  const isProduction = process.env.NODE_ENV === 'production';
  const sslEnabled = process.env.SSL_ENABLED === 'true';
  const jwtSecret = process.env.JWT_SECRET;
  
  if (isProduction) {
    console.log('   ℹ️  Modo: PRODUÇÃO');
    
    if (sslEnabled) {
      console.log('   ✅ SSL/HTTPS habilitado');
    } else {
      console.log('   ⚠️  SSL/HTTPS desabilitado - RECOMENDADO EM PRODUÇÃO');
    }
  } else {
    console.log('   ℹ️  Modo: DESENVOLVIMENTO');
  }
  
  if (jwtSecret && jwtSecret.length >= 32) {
    console.log('   ✅ JWT_SECRET configurado com comprimento adequado');
  } else {
    console.log('   ⚠️  JWT_SECRET muito curto ou não configurado');
    console.log('      Execute: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  }
  
  return true;
}

// Relatório final
async function showSummary(results) {
  console.log('\n' + '='.repeat(60));
  console.log('\n📝 RESUMO DO DIAGNÓSTICO\n');
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const successRate = ((passedTests / totalTests) * 100).toFixed(0);
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`   ${icon} ${result.name}`);
  });
  
  console.log(`\n   Taxa de Sucesso: ${successRate}%`);
  
  if (successRate === '100') {
    console.log('\n   🎉 TUDO PRONTO! O sistema está configurado corretamente.');
    console.log('   Execute "npm run dev:all" para iniciar o servidor.\n');
  } else {
    console.log('\n   ⚠️  ATENÇÃO! Alguns problemas foram encontrados.');
    console.log('   Corrija-os antes de iniciar o servidor.\n');
  }
  
  console.log('='.repeat(60) + '\n');
}

// Executa todos os testes
async function runDiagnostics() {
  const results = [];
  
  try {
    // 1. Variáveis de ambiente
    const envOk = await checkEnvironment();
    results.push({ name: 'Variáveis de Ambiente', passed: envOk });
    
    // 2. Conexão com banco
    const dbOk = await checkDatabaseConnection();
    results.push({ name: 'Conexão com Banco de Dados', passed: dbOk });
    
    if (!dbOk) {
      console.log('\n❌ Não é possível continuar sem conexão com o banco.\n');
      await showSummary(results);
      process.exit(1);
    }
    
    // 3. Tabelas
    const tablesOk = await checkTables();
    results.push({ name: 'Estrutura de Tabelas', passed: tablesOk });
    
    // 4. Colunas
    const columnsOk = await checkColumns();
    results.push({ name: 'Colunas Importantes', passed: columnsOk });
    
    // 5. Consultas de teste
    const queriesOk = await testSampleQueries();
    results.push({ name: 'Consultas de Teste', passed: queriesOk });
    
    // 6. Segurança
    const securityOk = await checkSecurity();
    results.push({ name: 'Configurações de Segurança', passed: securityOk });
    
    // Relatório final
    await showSummary(results);
    
  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO:', error);
    console.log('\nEntre em contato com o suporte técnico.\n');
  } finally {
    await pool.end();
    process.exit(0);
  }
}

// Inicia diagnóstico
runDiagnostics();
