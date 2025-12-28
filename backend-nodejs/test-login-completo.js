/**
 * TESTE COMPLETO DE LOGIN - SEASON 19 DV TEAMS
 * Versão: 527
 * Data: 2025-12-28
 */

require('dotenv').config();
const { executeQueryMU } = require('./src/config/database');
const { comparePassword } = require('./src/utils/helpers');
const { tables, columns } = require('./src/config/auth');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║  TESTE COMPLETO DE LOGIN - SEASON 19 DV TEAMS (V.527)        ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// ═══════════════════════════════════════════════════════════════
// CONFIGURAÇÃO DO TESTE
// ═══════════════════════════════════════════════════════════════

const TEST_USERNAME = 'tiongas';  // ← MUDE AQUI SE NECESSÁRIO
const TEST_PASSWORD = '123123';   // ← MUDE AQUI SE NECESSÁRIO

console.log(`📌 Testando login:`);
console.log(`   Username: ${TEST_USERNAME}`);
console.log(`   Password: ${TEST_PASSWORD}\n`);

// ═══════════════════════════════════════════════════════════════
// ETAPA 1: VERIFICAR CONEXÃO COM BANCO
// ═══════════════════════════════════════════════════════════════

async function testDatabaseConnection() {
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('ETAPA 1: VERIFICAR CONEXÃO COM BANCO');
  console.log('─────────────────────────────────────────────────────────────────\n');
  
  try {
    const testSql = 'SELECT 1 as test';
    const result = await executeQueryMU(testSql);
    
    if (result.success) {
      console.log('✅ Conexão com banco OK');
      console.log(`   Database: ${process.env.DB_MU_DATABASE || 'muonline'}`);
      console.log(`   Host: ${process.env.DB_MU_HOST || 'localhost'}\n`);
      return true;
    } else {
      console.log('❌ Erro na conexão:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ ERRO CRÍTICO:', error.message);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// ETAPA 2: VERIFICAR SE TABELA 'accounts' EXISTE
// ═══════════════════════════════════════════════════════════════

async function checkTableExists() {
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('ETAPA 2: VERIFICAR ESTRUTURA DO BANCO');
  console.log('─────────────────────────────────────────────────────────────────\n');
  
  try {
    // Verificar se tabela 'accounts' existe
    const checkTableSql = `SHOW TABLES LIKE 'accounts'`;
    const result = await executeQueryMU(checkTableSql);
    
    if (result.success && result.data.length > 0) {
      console.log('✅ Tabela "accounts" encontrada');
      
      // Mostrar estrutura da tabela
      const descSql = `DESCRIBE accounts`;
      const descResult = await executeQueryMU(descSql);
      
      if (descResult.success) {
        console.log('\n📊 Estrutura da tabela "accounts":');
        console.log('┌─────────────────────┬─────────────────────┬──────┐');
        console.log('│ Campo               │ Tipo                │ Null │');
        console.log('├─────────────────────┼─────────────────────┼──────┤');
        descResult.data.forEach(col => {
          const field = col.Field.padEnd(19);
          const type = col.Type.padEnd(19);
          const nullable = col.Null.padEnd(4);
          console.log(`│ ${field} │ ${type} │ ${nullable} │`);
        });
        console.log('└─────────────────────┴─────────────────────┴──────┘\n');
      }
      
      return true;
    } else {
      console.log('❌ Tabela "accounts" NÃO ENCONTRADA!');
      console.log('⚠️  Verificando se é Season 6 (MEMB_INFO)...\n');
      
      // Verificar se é Season 6
      const checkMemb = `SHOW TABLES LIKE 'MEMB_INFO'`;
      const membResult = await executeQueryMU(checkMemb);
      
      if (membResult.success && membResult.data.length > 0) {
        console.log('✅ Encontrada tabela "MEMB_INFO" (Season 6)');
        console.log('⚠️  ATENÇÃO: Seu banco é Season 6, não Season 19!');
        console.log('   Você precisa ajustar o auth.js para usar MEMB_INFO\n');
      } else {
        console.log('❌ Nenhuma tabela de contas encontrada!');
      }
      
      return false;
    }
  } catch (error) {
    console.log('❌ ERRO ao verificar tabela:', error.message);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// ETAPA 3: BUSCAR USUÁRIO NO BANCO
// ═══════════════════════════════════════════════════════════════

async function findUser() {
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('ETAPA 3: BUSCAR USUÁRIO NO BANCO');
  console.log('─────────────────────────────────────────────────────────────────\n');
  
  try {
    const sql = `
      SELECT 
        ${columns.accounts.username} as username,
        ${columns.accounts.password} as password,
        ${columns.accounts.guid} as guid,
        ${columns.accounts.email} as email,
        ${columns.accounts.blocked} as blocked
      FROM ${tables.accounts}
      WHERE ${columns.accounts.username} = ?
    `;
    
    console.log('📝 SQL Query:');
    console.log(sql.replace(/\s+/g, ' ').trim());
    console.log(`   Parâmetro: ['${TEST_USERNAME}']\n`);
    
    const result = await executeQueryMU(sql, [TEST_USERNAME]);
    
    if (result.success && result.data.length > 0) {
      const user = result.data[0];
      
      console.log('✅ Usuário encontrado!');
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email || 'NÃO DEFINIDO'}`);
      console.log(`   GUID: ${user.guid}`);
      console.log(`   Blocked: ${user.blocked === 0 ? 'NÃO' : 'SIM'}`);
      console.log(`   Password Hash: ${user.password}`);
      console.log(`   Hash Length: ${user.password.length} chars\n`);
      
      // Detectar tipo de hash
      const hashLen = user.password.replace(/[^a-fA-F0-9]/g, '').length;
      if (hashLen === 64) {
        console.log('🔐 Tipo de Hash: SHA-256 (64 chars)');
      } else if (hashLen === 32) {
        console.log('🔐 Tipo de Hash: MD5 (32 chars)');
      } else if (user.password.startsWith('$2')) {
        console.log('🔐 Tipo de Hash: Bcrypt');
      } else {
        console.log('🔐 Tipo de Hash: DESCONHECIDO');
      }
      
      console.log('');
      return user;
    } else {
      console.log(`❌ Usuário "${TEST_USERNAME}" NÃO ENCONTRADO no banco!\n`);
      return null;
    }
  } catch (error) {
    console.log('❌ ERRO ao buscar usuário:', error.message);
    console.log('   Stack:', error.stack);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// ETAPA 4: TESTAR VALIDAÇÃO DE SENHA
// ═══════════════════════════════════════════════════════════════

async function testPasswordValidation(user) {
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('ETAPA 4: TESTAR VALIDAÇÃO DE SENHA');
  console.log('─────────────────────────────────────────────────────────────────\n');
  
  if (!user) {
    console.log('⚠️  Pulando (usuário não encontrado)\n');
    return false;
  }
  
  try {
    console.log(`🧪 Comparando senha "${TEST_PASSWORD}" com hash do banco...`);
    console.log(`   Hash: ${user.password}`);
    console.log(`   GUID: ${user.guid}\n`);
    
    // Chamar comparePassword (que testa 6 algoritmos)
    const isValid = await comparePassword(TEST_PASSWORD, user.password, user.guid.toString());
    
    console.log('\n─────────────────────────────────────────────────────────────────');
    if (isValid) {
      console.log('✅✅✅ SENHA VÁLIDA! LOGIN OK! ✅✅✅');
    } else {
      console.log('❌❌❌ SENHA INVÁLIDA! LOGIN FALHOU! ❌❌❌');
    }
    console.log('─────────────────────────────────────────────────────────────────\n');
    
    return isValid;
  } catch (error) {
    console.log('❌ ERRO ao validar senha:', error.message);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// ETAPA 5: TESTAR ALGORITMOS MANUALMENTE
// ═══════════════════════════════════════════════════════════════

async function testAllAlgorithms(user) {
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('ETAPA 5: TESTE MANUAL DE TODOS OS ALGORITMOS');
  console.log('─────────────────────────────────────────────────────────────────\n');
  
  if (!user) {
    console.log('⚠️  Pulando (usuário não encontrado)\n');
    return;
  }
  
  const crypto = require('crypto');
  const cleanHash = user.password.toString().replace(/[^a-fA-F0-9]/g, '');
  
  console.log(`🔐 Hash do banco (limpo): ${cleanHash}`);
  console.log(`📏 Tamanho: ${cleanHash.length} caracteres\n`);
  
  const algorithms = [
    {
      name: 'MD5 puro',
      hash: crypto.createHash('md5').update(TEST_PASSWORD).digest('hex')
    },
    {
      name: 'SHA-256 puro',
      hash: crypto.createHash('sha256').update(TEST_PASSWORD).digest('hex')
    },
    {
      name: 'SHA-256(MD5(password))',
      hash: crypto.createHash('sha256').update(
        crypto.createHash('md5').update(TEST_PASSWORD).digest('hex')
      ).digest('hex')
    },
    {
      name: `SHA-256(${user.guid} + ${TEST_PASSWORD})`,
      hash: crypto.createHash('sha256').update(user.guid.toString() + TEST_PASSWORD).digest('hex')
    },
    {
      name: `SHA-256(${TEST_PASSWORD} + ${user.guid})`,
      hash: crypto.createHash('sha256').update(TEST_PASSWORD + user.guid.toString()).digest('hex')
    },
    {
      name: 'Plain Text (hex)',
      hash: Buffer.from(TEST_PASSWORD, 'utf8').toString('hex')
    }
  ];
  
  console.log('📊 Testando algoritmos:\n');
  
  let foundMatch = false;
  algorithms.forEach((algo, index) => {
    const match = algo.hash.toLowerCase() === cleanHash.toLowerCase();
    const icon = match ? '✅ MATCH!' : '❌';
    
    console.log(`${index + 1}. ${algo.name}`);
    console.log(`   Hash: ${algo.hash}`);
    console.log(`   ${icon}\n`);
    
    if (match) foundMatch = true;
  });
  
  if (!foundMatch) {
    console.log('⚠️  NENHUM ALGORITMO CONHECIDO BATEU!');
    console.log('   Isso significa que o servidor usa um algoritmo customizado.');
    console.log('   Possíveis causas:');
    console.log('   1. Salt customizado (não é o GUID)');
    console.log('   2. XOR encryption');
    console.log('   3. Varbinary encoding');
    console.log('   4. Algoritmo proprietário do DV Teams\n');
  }
}

// ═══════════════════════════════════════════════════════════════
// EXECUTAR TODOS OS TESTES
// ═══════════════════════════════════════════════════════════════

async function runAllTests() {
  try {
    // Etapa 1
    const dbOk = await testDatabaseConnection();
    if (!dbOk) {
      console.log('❌ Teste abortado: Erro na conexão com banco\n');
      process.exit(1);
    }
    
    // Etapa 2
    const tableOk = await checkTableExists();
    if (!tableOk) {
      console.log('❌ Teste abortado: Tabela "accounts" não encontrada\n');
      process.exit(1);
    }
    
    // Etapa 3
    const user = await findUser();
    
    // Etapa 4
    const loginOk = await testPasswordValidation(user);
    
    // Etapa 5
    await testAllAlgorithms(user);
    
    // Resumo final
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║  RESUMO FINAL                                                  ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    console.log('📊 Status dos Testes:');
    console.log(`   ✅ Conexão com banco: ${dbOk ? 'OK' : 'FALHOU'}`);
    console.log(`   ✅ Tabela "accounts": ${tableOk ? 'OK' : 'FALHOU'}`);
    console.log(`   ✅ Usuário encontrado: ${user ? 'SIM' : 'NÃO'}`);
    console.log(`   ✅ Login funcional: ${loginOk ? 'SIM' : 'NÃO'}\n`);
    
    if (loginOk) {
      console.log('🎉 SUCESSO! O sistema de login está funcionando!\n');
      process.exit(0);
    } else {
      console.log('❌ FALHA! O sistema de login NÃO está funcionando.\n');
      console.log('📋 Próximos passos:');
      console.log('   1. Verifique o hash no banco manualmente');
      console.log('   2. Consulte a documentação do DV Teams');
      console.log('   3. Verifique arquivos do GameServer (HashAlgorithm.txt)\n');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════════════════
// INICIAR TESTES
// ═══════════════════════════════════════════════════════════════

runAllTests();
