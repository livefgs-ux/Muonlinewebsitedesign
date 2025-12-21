/**
 * 🧙‍♂️ Setup Wizard API - MeuMU Online
 * 
 * Endpoints para detecção, verificação e configuração automática
 */

const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Executar comando shell e retornar output
 */
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, error: error.message, stderr });
      } else {
        resolve({ success: true, stdout: stdout.trim(), stderr });
      }
    });
  });
}

/**
 * Verificar se arquivo existe
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detectar tipo de ambiente
 */
async function detectEnvironmentType() {
  // CyberPanel
  if (await fileExists('/usr/local/CyberCP')) {
    return 'cyberpanel';
  }
  
  // XAMPP
  if (await fileExists('/opt/lampp') || await fileExists('C:\\xampp')) {
    return 'xampp';
  }
  
  // Docker
  if (await fileExists('/.dockerenv')) {
    return 'docker';
  }
  
  // VPS Bare
  return 'vps';
}

/**
 * Detectar servidor web
 */
async function detectWebServer() {
  // LiteSpeed
  const lsws = await execCommand('which lsws');
  if (lsws.success) return 'litespeed';
  
  // Nginx
  const nginx = await execCommand('which nginx');
  if (nginx.success) return 'nginx';
  
  // Apache
  const apache = await execCommand('which apache2 || which httpd');
  if (apache.success) return 'apache';
  
  return 'unknown';
}

/**
 * Detectar paths
 */
async function detectPaths(envType) {
  let webRoot = '';
  let backend = '';
  
  switch (envType) {
    case 'cyberpanel':
      webRoot = '/home/meumu.com/public_html';
      backend = '/home/meumu.com/public_html/backend-nodejs';
      break;
      
    case 'xampp':
      webRoot = await fileExists('/opt/lampp/htdocs') ? '/opt/lampp/htdocs' : 'C:\\xampp\\htdocs';
      backend = path.join(webRoot, 'backend-nodejs');
      break;
      
    case 'docker':
      webRoot = '/var/www/html';
      backend = '/var/www/html/backend-nodejs';
      break;
      
    default: // VPS
      webRoot = '/var/www/html';
      backend = '/var/www/html/backend-nodejs';
  }
  
  return { webRoot, backend };
}

// ============================================
// ROTAS
// ============================================

/**
 * POST /setup-api/detect-environment
 * Detecta automaticamente o ambiente do servidor
 */
router.post('/detect-environment', async (req, res) => {
  try {
    console.log('🔍 [Setup] Detectando ambiente...');
    
    // Detectar tipo
    const type = await detectEnvironmentType();
    const webServer = await detectWebServer();
    
    // Versões
    const phpVersion = await execCommand('php -v | head -n1 | cut -d" " -f2');
    const nodeVersion = await execCommand('node -v');
    
    // Paths
    const paths = await detectPaths(type);
    
    // Sistema operacional
    const osInfo = `${os.type()} ${os.release()}`;
    
    const environment = {
      type,
      webServer,
      os: osInfo,
      phpVersion: phpVersion.success ? phpVersion.stdout : 'Não detectado',
      nodeVersion: nodeVersion.success ? nodeVersion.stdout : 'Não detectado',
      paths: {
        webRoot: paths.webRoot,
        backend: paths.backend,
        database: 'MariaDB/MySQL',
      },
    };
    
    console.log('✅ [Setup] Ambiente detectado:', environment);
    
    res.json({
      success: true,
      environment,
    });
  } catch (error) {
    console.error('❌ [Setup] Erro ao detectar ambiente:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /setup-api/check-dependencies
 * Verifica todas as dependências necessárias
 */
router.post('/check-dependencies', async (req, res) => {
  try {
    console.log('✅ [Setup] Verificando dependências...');
    
    const checks = [];
    
    // 1. Node.js
    const nodeCheck = await execCommand('node -v');
    checks.push({
      id: 'nodejs',
      name: 'Node.js',
      status: nodeCheck.success ? 'success' : 'error',
      message: nodeCheck.success ? `Instalado: ${nodeCheck.stdout}` : 'Node.js não encontrado',
      details: nodeCheck.success ? '' : 'Instale Node.js 18+ em nodejs.org',
      fixable: false,
    });
    
    // 2. NPM
    const npmCheck = await execCommand('npm -v');
    checks.push({
      id: 'npm',
      name: 'NPM',
      status: npmCheck.success ? 'success' : 'error',
      message: npmCheck.success ? `Versão ${npmCheck.stdout}` : 'NPM não encontrado',
      fixable: false,
    });
    
    // 3. PM2
    const pm2Check = await execCommand('pm2 -v');
    checks.push({
      id: 'pm2',
      name: 'PM2',
      status: pm2Check.success ? 'success' : 'warning',
      message: pm2Check.success ? `Versão ${pm2Check.stdout}` : 'PM2 não instalado',
      details: pm2Check.success ? '' : 'Execute: npm install -g pm2',
      fixable: true,
      autoFix: true,
    });
    
    // 4. PHP
    const phpCheck = await execCommand('php -v');
    checks.push({
      id: 'php',
      name: 'PHP',
      status: phpCheck.success ? 'success' : 'error',
      message: phpCheck.success ? `Instalado` : 'PHP não encontrado',
      fixable: false,
    });
    
    // 5. PHP cURL
    const curlCheck = await execCommand('php -m | grep curl');
    checks.push({
      id: 'php-curl',
      name: 'PHP cURL Extension',
      status: curlCheck.success ? 'success' : 'warning',
      message: curlCheck.success ? 'Habilitado' : 'cURL não encontrado',
      details: curlCheck.success ? '' : 'Necessário para proxy API',
      fixable: true,
    });
    
    // 6. MariaDB/MySQL Client
    const mysqlCheck = await execCommand('which mysql');
    checks.push({
      id: 'mysql',
      name: 'MariaDB/MySQL Client',
      status: mysqlCheck.success ? 'success' : 'warning',
      message: mysqlCheck.success ? 'Instalado' : 'Cliente MySQL não encontrado',
      fixable: false,
    });
    
    // 7. Git
    const gitCheck = await execCommand('git --version');
    checks.push({
      id: 'git',
      name: 'Git',
      status: gitCheck.success ? 'success' : 'warning',
      message: gitCheck.success ? `${gitCheck.stdout}` : 'Git não instalado',
      fixable: false,
    });
    
    // 8. Backend Node Modules
    const backendPath = path.join(process.cwd(), 'node_modules');
    const nodeModulesExist = await fileExists(backendPath);
    checks.push({
      id: 'node-modules',
      name: 'Backend Dependencies',
      status: nodeModulesExist ? 'success' : 'warning',
      message: nodeModulesExist ? 'Instalado' : 'node_modules não encontrado',
      details: nodeModulesExist ? '' : 'Execute: npm install',
      fixable: true,
      autoFix: true,
    });
    
    // 9. Permissões de escrita
    const webRoot = '/home/meumu.com/public_html';
    try {
      await fs.access(webRoot, fs.constants.W_OK);
      checks.push({
        id: 'write-permissions',
        name: 'Permissões de Escrita',
        status: 'success',
        message: `${webRoot} é gravável`,
      });
    } catch {
      checks.push({
        id: 'write-permissions',
        name: 'Permissões de Escrita',
        status: 'error',
        message: `Sem permissão de escrita em ${webRoot}`,
        details: 'Execute: sudo chown -R $USER:$USER /home/meumu.com/public_html',
        fixable: true,
      });
    }
    
    // 10. Porta 3001 disponível
    const portCheck = await execCommand('lsof -i :3001');
    const portInUse = portCheck.stdout.includes('node');
    checks.push({
      id: 'port-3001',
      name: 'Porta 3001',
      status: portInUse ? 'success' : 'warning',
      message: portInUse ? 'Backend rodando na porta 3001' : 'Porta 3001 livre',
      details: portInUse ? '' : 'Backend ainda não foi iniciado',
      fixable: true,
      autoFix: true,
    });
    
    console.log(`✅ [Setup] ${checks.length} verificações concluídas`);
    
    res.json({
      success: true,
      checks,
    });
  } catch (error) {
    console.error('❌ [Setup] Erro ao verificar dependências:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /setup-api/auto-fix
 * Corrige automaticamente um problema
 */
router.post('/auto-fix', async (req, res) => {
  try {
    const { checkId } = req.body;
    
    console.log(`🔧 [Setup] Auto-fix: ${checkId}`);
    
    let result = { success: false, message: 'Fix não implementado' };
    
    switch (checkId) {
      case 'pm2':
        // Instalar PM2
        result = await execCommand('npm install -g pm2');
        result.message = result.success ? 'PM2 instalado com sucesso' : 'Falha ao instalar PM2';
        break;
        
      case 'node-modules':
        // Instalar dependências do backend
        const backendPath = path.join(process.cwd());
        result = await execCommand(`cd ${backendPath} && npm install`);
        result.message = result.success ? 'Dependências instaladas' : 'Falha ao instalar dependências';
        break;
        
      case 'port-3001':
        // Iniciar backend com PM2
        result = await execCommand('pm2 start /home/meumu.com/public_html/backend-nodejs/src/server.js --name meumu-backend');
        result.message = result.success ? 'Backend iniciado' : 'Falha ao iniciar backend';
        break;
        
      case 'write-permissions':
        // Corrigir permissões
        result = await execCommand('sudo chown -R $USER:$USER /home/meumu.com/public_html');
        result.message = result.success ? 'Permissões corrigidas' : 'Falha ao corrigir permissões';
        break;
        
      default:
        result.message = `Fix não disponível para ${checkId}`;
    }
    
    res.json(result);
  } catch (error) {
    console.error('❌ [Setup] Erro ao auto-fix:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /setup-api/test-database-connection
 * Testa conexão com database
 */
router.post('/test-database-connection', async (req, res) => {
  try {
    const { host, port, database, username, password } = req.body;
    
    console.log(`🗄️ [Setup] Testando conexão: ${username}@${host}:${port}/${database}`);
    
    const mysql = require('mysql2/promise');
    
    try {
      const connection = await mysql.createConnection({
        host,
        port: parseInt(port),
        user: username,
        password,
        database,
      });
      
      await connection.ping();
      await connection.end();
      
      console.log('✅ [Setup] Conexão bem-sucedida!');
      
      res.json({
        success: true,
        message: `Conectado ao database ${database}`,
      });
    } catch (dbError) {
      console.error('❌ [Setup] Erro de conexão:', dbError.message);
      
      res.json({
        success: false,
        message: dbError.message,
      });
    }
  } catch (error) {
    console.error('❌ [Setup] Erro ao testar database:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /setup-api/configure-database
 * Salva configuração do database
 */
router.post('/configure-database', async (req, res) => {
  try {
    const config = req.body;
    
    console.log('💾 [Setup] Salvando configuração de database...');
    
    // Criar arquivo .env
    const envPath = path.join(process.cwd(), '.env');
    const envContent = `
DB_HOST=${config.host}
DB_PORT=${config.port}
DB_NAME=${config.database}
DB_USER=${config.username}
DB_PASSWORD=${config.password}
JWT_SECRET=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
PORT=3001
`.trim();
    
    await fs.writeFile(envPath, envContent);
    
    console.log('✅ [Setup] .env criado com sucesso');
    
    res.json({
      success: true,
      message: 'Configuração salva',
    });
  } catch (error) {
    console.error('❌ [Setup] Erro ao salvar config:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /setup-api/configure-api
 * Configura API/Proxy automaticamente
 */
router.post('/configure-api', async (req, res) => {
  try {
    const { environment } = req.body;
    
    console.log('🌐 [Setup] Configurando API e Proxy...');
    
    const webRoot = environment?.paths?.webRoot || '/home/meumu.com/public_html';
    const apiPath = path.join(webRoot, 'api');
    
    // 1. Criar pasta /api
    await fs.mkdir(apiPath, { recursive: true });
    console.log('✅ [Setup] Pasta /api criada');
    
    // 2. Criar api/index.php
    const phpContent = `<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
$backend = 'http://127.0.0.1:3001';
$uri = $_SERVER['REQUEST_URI'];
$path = preg_replace('#^/api/?#', '', $uri);
$url = $backend . '/api/' . $path;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
$headers = [];
foreach (getallheaders() as $k => $v) {
    if (strtolower($k) !== 'host') $headers[] = "$k: $v";
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}
$response = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
if (curl_errno($ch)) {
    http_response_code(502);
    header('Content-Type: application/json');
    die(json_encode(['error' => curl_error($ch)]));
}
curl_close($ch);
http_response_code($code);
if ($type) header('Content-Type: ' . $type);
echo $response;
?>`;
    
    await fs.writeFile(path.join(apiPath, 'index.php'), phpContent);
    console.log('✅ [Setup] api/index.php criado');
    
    // 3. Criar api/.htaccess
    const htaccessContent = `RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [L,QSA]`;
    
    await fs.writeFile(path.join(apiPath, '.htaccess'), htaccessContent);
    console.log('✅ [Setup] api/.htaccess criado');
    
    // 4. Configurar permissões
    await execCommand(`chmod 755 ${apiPath}`);
    await execCommand(`chmod 644 ${path.join(apiPath, 'index.php')}`);
    await execCommand(`chmod 644 ${path.join(apiPath, '.htaccess')}`);
    console.log('✅ [Setup] Permissões configuradas');
    
    // 5. Iniciar backend se não estiver rodando
    const pm2List = await execCommand('pm2 list');
    if (!pm2List.stdout.includes('meumu-backend')) {
      const backendPath = path.join(webRoot, 'backend-nodejs', 'src', 'server.js');
      await execCommand(`pm2 start ${backendPath} --name meumu-backend`);
      console.log('✅ [Setup] Backend iniciado com PM2');
    }
    
    res.json({
      success: true,
      message: 'API e Proxy configurados',
    });
  } catch (error) {
    console.error('❌ [Setup] Erro ao configurar API:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /setup-api/test-*
 * Testes finais
 */
router.post('/test-database', async (req, res) => {
  try {
    const db = require('../config/database');
    const pool = db.getPool();
    await pool.query('SELECT 1');
    
    res.json({ success: true, message: 'Database OK' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

router.post('/test-backend', async (req, res) => {
  try {
    const result = await execCommand('curl -s http://localhost:3001/health');
    const isOk = result.stdout.includes('ok') || result.stdout.includes('healthy');
    
    res.json({ success: isOk, message: isOk ? 'Backend OK' : 'Backend não respondeu' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

router.post('/test-proxy', async (req, res) => {
  try {
    const result = await execCommand('curl -s https://meumu.com/api/server/info');
    const isOk = result.stdout.includes('success') || result.stdout.includes('MeuMU');
    
    res.json({ success: isOk, message: isOk ? 'Proxy OK' : 'Proxy não funcionou' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

router.post('/test-frontend', async (req, res) => {
  try {
    const result = await execCommand('curl -s https://meumu.com/ -I');
    const isOk = result.stdout.includes('200 OK');
    
    res.json({ success: isOk, message: isOk ? 'Frontend OK' : 'Frontend não carregou' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

module.exports = router;
