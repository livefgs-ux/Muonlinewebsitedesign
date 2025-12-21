/**
 * Script Automático: Detectar e Corrigir Nomes das Tabelas
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function autoFixTables() {
  let connection;
  
  try {
    console.log('\n🔧 AUTO-FIX: Detectando nomes corretos das tabelas...\n');
    
    // Conectar ao banco
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'muonline'
    });

    console.log('✅ Conectado ao banco:', process.env.DB_NAME || 'muonline');
    
    // Buscar todas as tabelas
    const [tables] = await connection.execute('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    console.log(`📊 Total de tabelas encontradas: ${tableNames.length}\n`);

    // Detectar tabelas importantes
    const detected = {
      accounts: null,
      characters: null,
      guild: null,
      guildMember: null,
      cashShop: null
    };

    // Padrões de detecção (ordem de prioridade)
    const patterns = {
      accounts: [
        /^MEMB_INFO$/i,
        /^AccountCharacter$/i,
        /^ACCOUNT$/i,
        /Account/i
      ],
      characters: [
        /^Character$/i,
        /^CharacterInfo$/i,
        /^CHARACTER$/i,
        /Character/i
      ],
      guild: [
        /^Guild$/i,
        /^GuildInfo$/i,
        /^GUILD$/i
      ],
      guildMember: [
        /^GuildMember$/i,
        /^Guild_Member$/i,
        /^GUILDMEMBER$/i
      ],
      cashShop: [
        /^CashShopData$/i,
        /^T_CashShopData$/i,
        /^CashShop$/i,
        /CashShop/i
      ]
    };

    // Detectar cada tipo de tabela
    for (const [key, regexList] of Object.entries(patterns)) {
      for (const regex of regexList) {
        const found = tableNames.find(t => regex.test(t));
        if (found) {
          detected[key] = found;
          break;
        }
      }
    }

    // Mostrar resultados
    console.log('🔍 DETECÇÃO AUTOMÁTICA:');
    console.log('='.repeat(60));
    
    const allFound = Object.values(detected).every(v => v !== null);
    
    for (const [key, value] of Object.entries(detected)) {
      const status = value ? '✅' : '❌';
      const displayValue = value || 'NÃO ENCONTRADA';
      console.log(`${status} ${key.padEnd(15)}: ${displayValue}`);
    }
    
    console.log('='.repeat(60));

    if (!allFound) {
      console.log('\n⚠️  ATENÇÃO: Algumas tabelas não foram detectadas automaticamente.');
      console.log('📋 Lista completa de tabelas no banco:\n');
      tableNames.forEach((name, i) => {
        console.log(`   ${(i + 1).toString().padStart(3, ' ')}. ${name}`);
      });
      console.log('\n💡 Edite manualmente o arquivo .env ou src/config/auth.js');
      return;
    }

    // Gerar conteúdo para .env
    console.log('\n📝 CONFIGURAÇÃO DETECTADA:\n');
    const envContent = `
# === NOMES DAS TABELAS (Auto-detectado) ===
TABLE_ACCOUNTS=${detected.accounts}
TABLE_CHARACTERS=${detected.characters}
TABLE_GUILD=${detected.guild}
TABLE_GUILD_MEMBER=${detected.guildMember}
TABLE_CASH_SHOP=${detected.cashShop}
`;

    console.log(envContent);
    
    // Perguntar se deve aplicar
    console.log('='.repeat(60));
    console.log('✅ Todas as tabelas foram detectadas!');
    console.log('\n💡 Para aplicar, adicione ao arquivo .env:');
    console.log('   1. nano .env');
    console.log('   2. Cole as linhas acima');
    console.log('   3. Salve (Ctrl+O, Enter, Ctrl+X)');
    console.log('   4. Reinicie: npm restart\n');

    // Salvar em arquivo
    const configFile = path.join(__dirname, 'tables-config.env');
    await fs.writeFile(configFile, envContent.trim());
    console.log(`📄 Configuração salva em: ${configFile}`);
    console.log('\n🚀 Execute: cat tables-config.env >> .env\n');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error('\n💡 Verifique:');
    console.error('   1. Arquivo .env existe e tem credenciais corretas');
    console.error('   2. MariaDB está rodando: systemctl status mariadb');
    console.error('   3. Banco existe: mysql -u root -p -e "SHOW DATABASES;"');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

autoFixTables();
