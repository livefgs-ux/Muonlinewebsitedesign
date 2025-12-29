/**
 * TESTE: Verificar conta "admin" no banco
 * 
 * Este script verifica:
 * 1. Se a conta "admin" existe
 * 2. Qual o valor de web_admin
 * 3. Se o login está reconhecendo como admin
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testAdminAccount() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  TESTE: VERIFICAR CONTA ADMIN NO BANCO                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  let connection;
  
  try {
    // Conectar ao banco MU
    console.log('🔌 Conectando ao banco MySQL...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'muonline',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ Conectado ao banco!\n');
    
    // ========================================================================
    // TESTE 1: Verificar estrutura da tabela
    // ========================================================================
    console.log('📊 TESTE 1: Estrutura da tabela accounts');
    console.log('═'.repeat(60));
    
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'accounts'
      AND COLUMN_NAME IN ('guid', 'account', 'password', 'email', 'blocked', 'web_admin')
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'muonline']);
    
    console.table(columns);
    
    // ========================================================================
    // TESTE 2: Buscar conta "admin"
    // ========================================================================
    console.log('\n🔍 TESTE 2: Buscar conta "admin"');
    console.log('═'.repeat(60));
    
    const [accounts] = await connection.query(`
      SELECT guid, account, email, blocked, web_admin
      FROM accounts
      WHERE account = ?
    `, ['admin']);
    
    if (accounts.length === 0) {
      console.log('❌ Conta "admin" NÃO ENCONTRADA!');
      console.log('');
      console.log('💡 SOLUÇÃO:');
      console.log('Execute no MySQL:');
      console.log('');
      console.log('UPDATE accounts SET web_admin = 1 WHERE account = \'admin\';');
      console.log('');
    } else {
      console.log('✅ Conta encontrada!');
      console.table(accounts);
      
      const account = accounts[0];
      
      // Verificar se é admin
      const isAdmin = account.web_admin === 1 || account.web_admin === '1' || account.web_admin > 0;
      
      console.log('');
      console.log('📊 ANÁLISE:');
      console.log('═'.repeat(60));
      console.log(`Username: ${account.account}`);
      console.log(`Email: ${account.email || '(vazio)'}`);
      console.log(`GUID: ${account.guid}`);
      console.log(`Blocked: ${account.blocked === 1 ? '🔴 SIM (BLOQUEADO!)' : '✅ Não'}`);
      console.log(`web_admin: ${account.web_admin}`);
      console.log(`É Admin? ${isAdmin ? '✅ SIM' : '❌ NÃO'}`);
      console.log('');
      
      if (!isAdmin) {
        console.log('⚠️  PROBLEMA ENCONTRADO!');
        console.log('');
        console.log('A conta "admin" existe, mas web_admin = ' + account.web_admin);
        console.log('Para transformar em admin, execute:');
        console.log('');
        console.log('UPDATE accounts SET web_admin = 1 WHERE account = \'admin\';');
        console.log('');
      } else {
        console.log('✅ TUDO CERTO! A conta é admin.');
        console.log('');
        console.log('Se o site ainda não mostra AdminCP, verifique:');
        console.log('1. Faça logout e login novamente');
        console.log('2. Limpe cache do navegador (Ctrl+Shift+Delete)');
        console.log('3. Verifique console do backend (pm2 logs meumu-backend)');
        console.log('');
      }
    }
    
    // ========================================================================
    // TESTE 3: Listar TODAS as contas com web_admin > 0
    // ========================================================================
    console.log('\n👑 TESTE 3: Todas as contas admin');
    console.log('═'.repeat(60));
    
    const [admins] = await connection.query(`
      SELECT guid, account, email, web_admin
      FROM accounts
      WHERE web_admin > 0
      ORDER BY web_admin DESC, account
    `);
    
    if (admins.length === 0) {
      console.log('❌ NENHUMA CONTA ADMIN ENCONTRADA!');
      console.log('');
      console.log('💡 Para criar um admin, execute:');
      console.log('UPDATE accounts SET web_admin = 1 WHERE account = \'seuusername\';');
      console.log('');
    } else {
      console.log(`✅ ${admins.length} conta(s) admin encontrada(s):`);
      console.table(admins);
    }
    
    console.log('\n✅ Teste concluído!\n');
    
  } catch (error) {
    console.error('\n❌ ERRO:');
    console.error('═'.repeat(60));
    console.error(error);
    console.error('');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Verifique as credenciais do banco no .env:');
      console.log('   DB_HOST, DB_USER, DB_PASS, DB_NAME');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 MySQL não está rodando ou porta incorreta');
    }
    
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexão fechada.\n');
    }
  }
}

// Executar teste
testAdminAccount().catch(console.error);
