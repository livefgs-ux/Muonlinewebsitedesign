/**
 * MeuMU Online - API de Instalação
 * Endpoints para instalador web
 */

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const crypto = require('crypto');

// ════════════════════════════════════════════════════════════════
// HELPER: Executar comando shell
// ════════════════════════════════════════════════════════════════
async function runCommand(command) {
  try {
    const { stdout, stderr } = await execPromise(command);
    return { success: true, output: stdout, error: stderr };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ════════════════════════════════════════════════════════════════
// HELPER: Gerar secret aleatório
// ════════════════════════════════════════════════════════════════
function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

// ════════════════════════════════════════════════════════════════
// HELPER: Criar log
// ════════════════════════════════════════════════════════════════
async function createLog(type, content) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const logDir = path.join(__dirname, '../../../install/logs');
  const logFile = path.join(logDir, `install-${type}-${timestamp}.log`);
  
  try {
    await fs.mkdir(logDir, { recursive: true });
    
    const header = `════════════════════════════════════════════════════════════════
  MeuMU Online - Log de Instalação
  Data: ${new Date().toLocaleString('pt-BR')}
  Status: ${type.toUpperCase()}
════════════════════════════════════════════════════════════════

`;
    
    await fs.writeFile(logFile, header + content);
    return logFile;
  } catch (error) {
    console.error('Erro ao criar log:', error);
    return null;
  }
}

// ════════════════════════════════════════════════════════════════
// ENDPOINT: Verificar Requisitos
// ════════════════════════════════════════════════════════════════
router.post('/check-requirements', async (req, res) => {
  console.log('🔍 Verificando requisitos do sistema...');
  
  const checks = {
    os: { name: 'Sistema Operacional', status: 'checking', value: null },
    node: { name: 'Node.js', status: 'checking', value: null },
    pm2: { name: 'PM2', status: 'checking', value: null },
    mysql: { name: 'MySQL/MariaDB', status: 'checking', value: null },
    webserver: { name: 'Servidor Web', status: 'checking', value: null },
    permissions: { name: 'Permissões', status: 'checking', value: null }
  };
  
  try {
    // Sistema Operacional
    const osInfo = await runCommand('uname -a');
    if (osInfo.success) {
      checks.os.status = 'success';
      checks.os.value = osInfo.output.trim();
    } else {
      checks.os.status = 'error';
      checks.os.error = 'Não foi possível detectar o sistema';
    }
    
    // Node.js
    const nodeVersion = await runCommand('node --version');
    if (nodeVersion.success) {
      const version = nodeVersion.output.trim();
      const majorVersion = parseInt(version.slice(1).split('.')[0]);
      
      if (majorVersion >= 16) {
        checks.node.status = 'success';
        checks.node.value = version;
      } else {
        checks.node.status = 'warning';
        checks.node.value = version;
        checks.node.error = 'Recomendado Node.js 16+';
      }
    } else {
      checks.node.status = 'error';
      checks.node.error = 'Node.js não instalado';
    }
    
    // PM2
    const pm2Version = await runCommand('pm2 --version');
    if (pm2Version.success) {
      checks.pm2.status = 'success';
      checks.pm2.value = 'v' + pm2Version.output.trim();
    } else {
      checks.pm2.status = 'warning';
      checks.pm2.error = 'PM2 não instalado (será instalado automaticamente)';
    }
    
    // MySQL/MariaDB
    const mysqlVersion = await runCommand('mysql --version');
    if (mysqlVersion.success) {
      checks.mysql.status = 'success';
      checks.mysql.value = mysqlVersion.output.trim().split(',')[0];
    } else {
      checks.mysql.status = 'error';
      checks.mysql.error = 'MySQL/MariaDB não instalado';
    }
    
    // Servidor Web
    const lsws = await runCommand('systemctl is-active lsws');
    const nginx = await runCommand('systemctl is-active nginx');
    const apache = await runCommand('systemctl is-active apache2');
    
    if (lsws.success && lsws.output.trim() === 'active') {
      checks.webserver.status = 'success';
      checks.webserver.value = 'OpenLiteSpeed (CyberPanel)';
    } else if (nginx.success && nginx.output.trim() === 'active') {
      checks.webserver.status = 'success';
      checks.webserver.value = 'Nginx';
    } else if (apache.success && apache.output.trim() === 'active') {
      checks.webserver.status = 'success';
      checks.webserver.value = 'Apache';
    } else {
      checks.webserver.status = 'warning';
      checks.webserver.value = 'Nenhum servidor web detectado';
      checks.webserver.error = 'Site funcionará na porta 3001';
    }
    
    // Permissões (verifica se pode escrever no diretório)
    const testFile = path.join(__dirname, '../../../test-write.tmp');
    try {
      await fs.writeFile(testFile, 'test');
      await fs.unlink(testFile);
      checks.permissions.status = 'success';
      checks.permissions.value = 'Diretório gravável';
    } catch (error) {
      checks.permissions.status = 'error';
      checks.permissions.error = 'Sem permissão de escrita';
    }
    
    // Verificar se pode continuar
    const canContinue = !Object.values(checks).some(c => c.status === 'error');
    
    res.json({
      success: true,
      checks,
      canContinue,
      message: canContinue ? 'Sistema compatível!' : 'Corrija os erros antes de continuar'
    });
    
  } catch (error) {
    console.error('Erro ao verificar requisitos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ════════════════════════════════════════════════════════════════
// ENDPOINT: Testar Conexão Database
// ════════════════════════════════════════════════════════════════
router.post('/test-database', async (req, res) => {
  const { host, port, user, password, database, type } = req.body;
  
  console.log(`🔍 Testando conexão ${type}:`, { host, port, database });
  
  try {
    // Criar conexão temporária
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      connectTimeout: 5000
    });
    
    // Testar query
    const [result] = await connection.execute('SELECT 1 as test');
    
    // Contar tabelas
    const [tables] = await connection.execute('SHOW TABLES');
    
    // Detectar tabelas importantes (se for database MU)
    let importantTables = {};
    if (type === 'mu') {
      const tableNames = tables.map(t => Object.values(t)[0].toLowerCase());
      importantTables = {
        accounts: tableNames.some(t => t.includes('memb')),
        characters: tableNames.some(t => t.includes('character')),
        guild: tableNames.some(t => t.includes('guild')),
        warehouse: tableNames.some(t => t.includes('warehouse'))
      };
    }
    
    await connection.end();
    
    res.json({
      success: true,
      message: 'Conexão bem-sucedida!',
      tables: tables.length,
      importantTables
    });
    
  } catch (error) {
    console.error('Erro ao testar database:', error);
    
    let friendlyError = error.message;
    if (error.code === 'ECONNREFUSED') {
      friendlyError = 'Conexão recusada. Verifique se MySQL está rodando.';
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      friendlyError = 'Usuário ou senha incorretos.';
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      friendlyError = 'Database não existe.';
    }
    
    res.json({
      success: false,
      error: friendlyError,
      technicalError: error.message
    });
  }
});

// ════════════════════════════════════════════════════════════════
// ENDPOINT: Instalar
// ════════════════════════════════════════════════════════════════
router.post('/install', async (req, res) => {
  const { domain, installPath, dbMU, dbWEB } = req.body;
  
  console.log('🚀 Iniciando instalação...');
  console.log('Domínio:', domain);
  console.log('Local:', installPath);
  
  const log = [];
  const logEntry = (msg) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    log.push(`[${timestamp}] ${msg}`);
    console.log(msg);
  };
  
  try {
    // ════════════════════════════════════════════════════════════
    // 1. CRIAR ARQUIVO .ENV
    // ════════════════════════════════════════════════════════════
    logEntry('📝 Criando arquivo .env...');
    
    const envContent = `# MeuMU Online - Configuração Automática
# Gerado em: ${new Date().toISOString()}

# ═══════════════════════════════════════════════════════════════
# DATABASE MU ONLINE (READONLY)
# ═══════════════════════════════════════════════════════════════
DB_MU_HOST=${dbMU.host}
DB_MU_PORT=${dbMU.port}
DB_MU_USER=${dbMU.user}
DB_MU_PASSWORD=${dbMU.password}
DB_MU_NAME=${dbMU.database}
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# ═══════════════════════════════════════════════════════════════
# DATABASE WEB (READ/WRITE)
# ═══════════════════════════════════════════════════════════════
DB_WEB_HOST=${dbWEB.host}
DB_WEB_PORT=${dbWEB.port}
DB_WEB_USER=${dbWEB.user}
DB_WEB_PASSWORD=${dbWEB.password}
DB_WEB_NAME=${dbWEB.database}

# ═══════════════════════════════════════════════════════════════
# SERVIDOR
# ═══════════════════════════════════════════════════════════════
PORT=3001
NODE_ENV=production

# ═══════════════════════════════════════════════════════════════
# SEGURANÇA
# ═══════════════════════════════════════════════════════════════
JWT_SECRET=${generateSecret(64)}
ALLOWED_ORIGINS=http://localhost:3001,http://${domain},http://${domain}:3001,https://${domain}

# ═══════════════════════════════════════════════════════════════
# SERVIDOR MU ONLINE
# ═══════════════════════════════════════════════════════════════
SERVER_NAME=MeuMU Online
SERVER_VERSION=Season 19-2-3 - Épico
SERVER_RATES_EXP=1000x
SERVER_RATES_DROP=50%
SERVER_MAX_RESET=500
SERVER_MAX_GRAND_RESET=50
`;
    
    const envPath = path.join(__dirname, '../../.env');
    await fs.writeFile(envPath, envContent);
    await fs.chmod(envPath, 0o600);
    
    logEntry('✅ Arquivo .env criado com sucesso!');
    
    // ════════════════════════════════════════════════════════════
    // 2. CRIAR TABELAS NO DATABASE WEB
    // ════════════════════════════════════════════════════════════
    logEntry('📊 Criando tabelas no database Web...');
    
    const mysql = require('mysql2/promise');
    const connWeb = await mysql.createConnection({
      host: dbWEB.host,
      port: parseInt(dbWEB.port),
      user: dbWEB.user,
      password: dbWEB.password,
      database: dbWEB.database
    });
    
    // Tabela de configurações
    await connWeb.execute(`
      CREATE TABLE IF NOT EXISTS web_config (
        config_key VARCHAR(100) PRIMARY KEY,
        config_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Tabela de notícias
    await connWeb.execute(`
      CREATE TABLE IF NOT EXISTS web_news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        published BOOLEAN DEFAULT TRUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Tabela de downloads
    await connWeb.execute(`
      CREATE TABLE IF NOT EXISTS web_downloads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        file_url VARCHAR(500),
        version VARCHAR(20),
        size_mb DECIMAL(10,2),
        downloads INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    await connWeb.end();
    
    logEntry('✅ Tabelas criadas com sucesso!');
    
    // ════════════════════════════════════════════════════════════
    // 3. REINICIAR BACKEND COM PM2
    // ════════════════════════════════════════════════════════════
    logEntry('🔄 Reiniciando backend...');
    
    const pm2Restart = await runCommand('pm2 restart meumu-backend');
    if (pm2Restart.success) {
      logEntry('✅ Backend reiniciado com sucesso!');
    } else {
      logEntry('⚠️ Erro ao reiniciar backend (pode já estar rodando)');
    }
    
    // ════════════════════════════════════════════════════════════
    // 4. SALVAR LOG DE SUCESSO
    // ════════════════════════════════════════════════════════════
    const logFile = await createLog('success', log.join('\n'));
    
    res.json({
      success: true,
      message: 'Instalação concluída com sucesso!',
      logFile,
      log: log
    });
    
  } catch (error) {
    console.error('❌ Erro na instalação:', error);
    
    logEntry(`❌ ERRO: ${error.message}`);
    
    // Salvar log de erro
    const logContent = log.join('\n') + `

════════════════════════════════════════════════════════════════
  ERRO DETALHADO
════════════════════════════════════════════════════════════════

${error.stack}
`;
    
    const logFile = await createLog('error', logContent);
    
    res.status(500).json({
      success: false,
      error: error.message,
      logFile,
      log: log
    });
  }
});

// ════════════════════════════════════════════════════════════════
// ENDPOINT: Testar Proxy
// ════════════════════════════════════════════════════════════════
router.post('/test-proxy', async (req, res) => {
  const { domain } = req.body;
  
  console.log('🔍 Testando proxy reverso...');
  
  try {
    // Testar se backend responde direto
    const backendTest = await runCommand('curl -s http://localhost:3001/api/server/health');
    const backendWorks = backendTest.success && backendTest.output.includes('healthy');
    
    // Testar se proxy funciona
    const proxyTest = await runCommand(`curl -s http://${domain}/api/server/health`);
    const proxyWorks = proxyTest.success && proxyTest.output.includes('healthy');
    
    res.json({
      success: true,
      backend: {
        works: backendWorks,
        response: backendTest.output
      },
      proxy: {
        works: proxyWorks,
        response: proxyTest.output,
        error: !proxyWorks ? 'Proxy não está redirecionando para backend' : null
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ════════════════════════════════════════════════════════════════
// ENDPOINT: Remover Instalador
// ════════════════════════════════════════════════════════════════
router.post('/remove-installer', async (req, res) => {
  console.log('🗑️ Removendo pasta /install...');
  
  try {
    const installPath = path.join(__dirname, '../../../install');
    
    // Fazer backup dos logs antes
    const logsPath = path.join(installPath, 'logs');
    const backupPath = path.join(__dirname, '../../../install-logs-backup');
    
    const logsExist = await fs.access(logsPath).then(() => true).catch(() => false);
    if (logsExist) {
      await runCommand(`cp -r "${logsPath}" "${backupPath}"`);
    }
    
    // Remover pasta install
    await fs.rm(installPath, { recursive: true, force: true });
    
    res.json({
      success: true,
      message: 'Instalador removido com sucesso!',
      logsBackup: logsExist ? backupPath : null
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
