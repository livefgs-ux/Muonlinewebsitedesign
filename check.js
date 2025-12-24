#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════
 *  MEUMU ONLINE - FERRAMENTA DE DIAGNÓSTICO E MANUTENÇÃO
 *  Funciona em: Windows, Linux, macOS
 * 
 *  FUNCIONALIDADES:
 *  - Diagnóstico completo do sistema
 *  - Fix automático de problemas
 *  - Deploy (desenvolvimento e produção)
 *  - Scan de segurança
 *  - Backup do banco de dados
 *  - Logs e auditoria
 * ═══════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cores
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.blue}${'═'.repeat(60)}${colors.reset}\n  ${msg}\n${colors.blue}${'═'.repeat(60)}${colors.reset}\n`)
};

// Executar comando
function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      cwd: options.cwd || process.cwd(),
      shell: true
    });
    return { success: true, output: result ? result.toString() : '' };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      output: error.stdout ? error.stdout.toString() : ''
    };
  }
}

// Verificar se comando existe
function commandExists(command) {
  const checkCmd = process.platform === 'win32' 
    ? `where ${command}` 
    : `which ${command}`;
  const result = runCommand(checkCmd, { silent: true });
  return result.success;
}

// ═══════════════════════════════════════════════════════════════
// 1. DIAGNÓSTICO COMPLETO
// ═══════════════════════════════════════════════════════════════

function diagnosticSystem() {
  log.title('🔍 DIAGNÓSTICO DO SISTEMA');
  
  const checks = [];
  let hasIssues = false;
  
  // Node.js
  if (commandExists('node')) {
    const result = runCommand('node --version', { silent: true });
    const version = result.output.trim();
    const versionNum = parseInt(version.replace('v', '').split('.')[0]);
    
    if (versionNum >= 18) {
      log.success(`Node.js: ${version}`);
      checks.push({ name: 'Node.js', status: 'OK', version });
    } else {
      log.error(`Node.js: ${version} (requer 18+)`);
      checks.push({ name: 'Node.js', status: 'OUTDATED', version });
      hasIssues = true;
    }
  } else {
    log.error('Node.js: NÃO INSTALADO');
    checks.push({ name: 'Node.js', status: 'MISSING' });
    hasIssues = true;
  }
  
  // npm
  if (commandExists('npm')) {
    const result = runCommand('npm --version', { silent: true });
    const version = result.output.trim();
    log.success(`npm: ${version}`);
    checks.push({ name: 'npm', status: 'OK', version });
  } else {
    log.error('npm: NÃO INSTALADO');
    checks.push({ name: 'npm', status: 'MISSING' });
    hasIssues = true;
  }
  
  // Git
  if (commandExists('git')) {
    const result = runCommand('git --version', { silent: true });
    const version = result.output.trim();
    log.success(`Git: ${version}`);
    checks.push({ name: 'Git', status: 'OK', version });
  } else {
    log.warn('Git: NÃO INSTALADO (opcional)');
    checks.push({ name: 'Git', status: 'OPTIONAL' });
  }
  
  // PM2 (opcional para produção)
  if (commandExists('pm2')) {
    const result = runCommand('pm2 --version', { silent: true });
    const version = result.output.trim();
    log.success(`PM2: ${version}`);
    checks.push({ name: 'PM2', status: 'OK', version });
  } else {
    log.warn('PM2: NÃO INSTALADO (opcional para produção)');
    checks.push({ name: 'PM2', status: 'OPTIONAL' });
  }
  
  console.log('');
  return { checks, hasIssues };
}

function diagnosticBackend() {
  log.title('📦 DIAGNÓSTICO DO BACKEND');
  
  const backendPath = path.join(process.cwd(), 'backend-nodejs');
  const checks = [];
  let hasIssues = false;
  
  // Verificar estrutura
  const requiredFiles = [
    'package.json',
    'src/server.js',
    'src/config/database.js',
    '.env.example'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(backendPath, file);
    if (fs.existsSync(filePath)) {
      log.success(file);
      checks.push({ file, status: 'OK' });
    } else {
      log.error(`${file} - NÃO EXISTE`);
      checks.push({ file, status: 'MISSING' });
      hasIssues = true;
    }
  }
  
  // Verificar .env
  const envPath = path.join(backendPath, '.env');
  if (fs.existsSync(envPath)) {
    log.success('.env');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const required = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD'];
    
    for (const varName of required) {
      const regex = new RegExp(`^${varName}=.+`, 'm');
      if (regex.test(envContent)) {
        log.success(`  ${varName} configurado`);
      } else {
        log.warn(`  ${varName} NÃO configurado`);
        hasIssues = true;
      }
    }
  } else {
    log.error('.env - NÃO EXISTE');
    checks.push({ file: '.env', status: 'MISSING' });
    hasIssues = true;
  }
  
  // Verificar node_modules
  const nodeModulesPath = path.join(backendPath, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    log.success('node_modules (dependências instaladas)');
    checks.push({ file: 'node_modules', status: 'OK' });
  } else {
    log.error('node_modules - NÃO EXISTE (execute npm install)');
    checks.push({ file: 'node_modules', status: 'MISSING' });
    hasIssues = true;
  }
  
  console.log('');
  return { checks, hasIssues };
}

// ═══════════════════════════════════════════════════════════════
// 2. FIX AUTOMÁTICO
// ═══════════════════════════════════════════════════════════════

function fixProblems() {
  log.title('🔧 FIX AUTOMÁTICO');
  
  const backendPath = path.join(process.cwd(), 'backend-nodejs');
  let fixCount = 0;
  
  console.log(`${colors.cyan}[DEBUG]${colors.reset} Backend path: ${backendPath}\n`);
  
  // Fix 1: Criar .env.example se não existir
  const envExamplePath = path.join(backendPath, '.env.example');
  
  console.log(`${colors.cyan}[DEBUG]${colors.reset} Verificando: ${envExamplePath}`);
  
  if (!fs.existsSync(envExamplePath)) {
    log.info('📝 Criando .env.example...');
    
    const envExampleTemplate = `# ════════════════════════════════════════
# MEUMU ONLINE - CONFIGURAÇÃO DO BACKEND
# ════════════════════════════════════════

# SERVIDOR
PORT=3001
NODE_ENV=development

# AUTENTICAÇÃO JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# DATABASE 1: MUONLINE (Servidor MU - READONLY)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME_MUONLINE=MuOnline

# DATABASE 2: WEBMU (Website - READ/WRITE)
DB_NAME_WEBMU=webmu

# CONFIGURAÇÕES DE CONEXÃO
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0
DB_TIMEOUT=10000

# CORS (Frontend)
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:3001

# RATE LIMITING
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_WINDOW_MS=900000
RATE_LIMIT_AUTH_MAX_REQUESTS=5

# SEGURANÇA
SECURITY_MODE=development
SECURITY_LOGS_ENABLED=true
SECURITY_ALERTS_ENABLED=true
LOGS_DIR=./logs

# BCRYPT
BCRYPT_ROUNDS=12

# TABELAS DO MU ONLINE
TABLE_ACCOUNTS=MEMB_INFO
TABLE_CHARACTERS=Character
TABLE_GUILDS=Guild

# ADMIN CP
ADMIN_EMAIL=admin@meumu.com
ADMIN_PASSWORD=AdminMeuMU2024!

# BACKUP
BACKUP_ENABLED=false
BACKUP_DIR=./backups
BACKUP_RETENTION_DAYS=7

# DEVELOPMENT/DEBUG
DEBUG=false
VERBOSE_ERRORS=true
`;
    
    try {
      fs.writeFileSync(envExamplePath, envExampleTemplate, 'utf8');
      log.success('.env.example criado com sucesso!');
      console.log(`${colors.cyan}[DEBUG]${colors.reset} Arquivo criado em: ${envExamplePath}`);
      fixCount++;
    } catch (error) {
      log.error(`Erro ao criar .env.example: ${error.message}`);
    }
  } else {
    log.info('.env.example já existe, pulando...');
  }
  
  console.log('');
  
  // Fix 2: Criar .env se não existir
  const envPath = path.join(backendPath, '.env');
  
  console.log(`${colors.cyan}[DEBUG]${colors.reset} Verificando: ${envPath}`);
  
  if (!fs.existsSync(envPath)) {
    log.info('📝 Criando .env a partir de .env.example...');
    
    if (fs.existsSync(envExamplePath)) {
      try {
        fs.copyFileSync(envExamplePath, envPath);
        log.success('.env criado com sucesso!');
        console.log(`${colors.cyan}[DEBUG]${colors.reset} Arquivo criado em: ${envPath}`);
        log.warn('⚠️  IMPORTANTE: Configure as credenciais em backend-nodejs/.env');
        fixCount++;
      } catch (error) {
        log.error(`Erro ao criar .env: ${error.message}`);
      }
    } else {
      log.error('Não foi possível criar .env (falta .env.example)');
    }
  } else {
    log.info('.env já existe, pulando...');
  }
  
  console.log('');
  
  // Fix 3: Instalar dependências se faltarem
  const nodeModulesPath = path.join(backendPath, 'node_modules');
  
  console.log(`${colors.cyan}[DEBUG]${colors.reset} Verificando: ${nodeModulesPath}`);
  
  if (!fs.existsSync(nodeModulesPath)) {
    log.info('📦 Instalando dependências do backend...');
    log.info('⏳ Isso pode levar alguns minutos...');
    console.log('');
    
    console.log(`${colors.cyan}[DEBUG]${colors.reset} Executando: npm install em ${backendPath}`);
    
    const result = runCommand('npm install', { cwd: backendPath });
    
    console.log(`${colors.cyan}[DEBUG]${colors.reset} Resultado: ${JSON.stringify(result)}`);
    
    if (result.success) {
      log.success('✅ Dependências instaladas com sucesso!');
      fixCount++;
    } else {
      log.error('❌ Falha ao instalar dependências');
      log.error(`Erro: ${result.error || 'Desconhecido'}`);
      log.info('💡 Tente manualmente: cd backend-nodejs && npm install');
    }
  } else {
    log.info('node_modules já existe, pulando...');
  }
  
  // Fix 4: Criar diretórios de logs se não existirem
  const logDirs = [
    path.join(backendPath, 'logs'),
    path.join(backendPath, 'logs', 'security'),
    path.join(backendPath, 'logs', 'audit'),
    path.join(backendPath, 'logs', 'alerts')
  ];
  
  for (const dir of logDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log.success(`Criado: ${path.relative(process.cwd(), dir)}`);
      fixCount++;
    }
  }
  
  console.log('');
  
  if (fixCount > 0) {
    log.success(`✅ ${fixCount} correção(ões) aplicada(s)!`);
  } else {
    log.info('✨ Nada para corrigir - tudo já está OK!');
  }
  
  console.log('');
}

// ═══════════════════════════════════════════════════════════════
// 3. SCAN DE SEGURANÇA
// ═══════════════════════════════════════════════════════════════

function securityScan() {
  log.title('🔒 SCAN DE SEGURANÇA');
  
  const backendPath = path.join(process.cwd(), 'backend-nodejs');
  
  // Scan 1: npm audit
  log.info('Verificando vulnerabilidades em dependências...');
  const auditResult = runCommand('npm audit --production', { 
    cwd: backendPath, 
    silent: true 
  });
  
  if (auditResult.output.includes('found 0 vulnerabilities')) {
    log.success('Nenhuma vulnerabilidade encontrada!');
  } else {
    log.warn('Vulnerabilidades detectadas:');
    console.log(auditResult.output);
    log.info('💡 Execute: npm audit fix (no diretório backend-nodejs)');
  }
  
  // Scan 2: Verificar .env no .gitignore
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (gitignoreContent.includes('.env')) {
      log.success('.env está no .gitignore');
    } else {
      log.error('.env NÃO está no .gitignore!');
      log.info('💡 Adicione ".env" ao .gitignore AGORA');
    }
  }
  
  // Scan 3: Verificar tamanho do JWT_SECRET
  const envPath = path.join(backendPath, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^JWT_SECRET=(.+)$/m);
    
    if (match) {
      const secret = match[1].trim();
      if (secret.length >= 32) {
        log.success(`JWT_SECRET: ${secret.length} caracteres (OK)`);
      } else {
        log.warn(`JWT_SECRET: ${secret.length} caracteres (recomendado 32+)`);
      }
    }
  }
  
  console.log('');
}

// ═══════════════════════════════════════════════════════════════
// 4. DEPLOY
// ═══════════════════════════════════════════════════════════════

function deployDev() {
  log.title('🚀 DEPLOY - DESENVOLVIMENTO');
  
  const backendPath = path.join(process.cwd(), 'backend-nodejs');
  const nodeModulesPath = path.join(backendPath, 'node_modules');
  
  // ✅ VERIFICAÇÃO OBRIGATÓRIA: node_modules DEVE EXISTIR
  if (!fs.existsSync(nodeModulesPath)) {
    log.error('❌ IMPOSSÍVEL INICIAR: node_modules não existe!');
    console.log('');
    log.warn('⚠️  As dependências NÃO foram instaladas.');
    console.log('');
    log.info('💡 SOLUÇÃO:');
    log.info('   1. Execute a opção 2 (Fix Automático) primeiro');
    log.info('   OU');
    log.info('   2. Instale manualmente:');
    log.info('      cd backend-nodejs');
    log.info('      npm install');
    console.log('');
    log.info('🔙 Voltando ao menu...');
    console.log('');
    return;
  }
  
  // ✅ VERIFICAÇÃO: .env DEVE EXISTIR
  const envPath = path.join(backendPath, '.env');
  if (!fs.existsSync(envPath)) {
    log.error('❌ IMPOSSÍVEL INICIAR: .env não existe!');
    console.log('');
    log.info('💡 Execute a opção 2 (Fix Automático) primeiro');
    console.log('');
    return;
  }
  
  log.success('✅ Dependências verificadas');
  log.success('✅ Configuração verificada');
  console.log('');
  
  // ═══════════════════════════════════════════════════════════════
  // INSTRUÇÕES CLARAS ANTES DE INICIAR
  // ═══════════════════════════════════════════════════════════════
  console.log(colors.cyan('╔══════════════════════════════════════════════════════════╗'));
  console.log(colors.cyan('║') + colors.yellow('  📋 IMPORTANTE: PRÓXIMOS PASSOS                          ') + colors.cyan('║'));
  console.log(colors.cyan('╠══════════════════════════════════════════════════════════╣'));
  console.log(colors.cyan('║') + '  1️⃣  O servidor vai INICIAR e OCUPAR este terminal    ' + colors.cyan('║'));
  console.log(colors.cyan('║') + '  2️⃣  DEIXE ESTA JANELA ABERTA (servidor rodando)      ' + colors.cyan('║'));
  console.log(colors.cyan('║') + '  3️⃣  ABRA OUTRO TERMINAL para continuar trabalhando   ' + colors.cyan('║'));
  console.log(colors.cyan('║') + '                                                       ' + colors.cyan('║'));
  console.log(colors.cyan('║') + colors.green('  🌐 Acesse o INSTALADOR WEB:                           ') + colors.cyan('║'));
  console.log(colors.cyan('║') + colors.white('     http://meumu.com:3001/install                      ') + colors.cyan('║'));
  console.log(colors.cyan('║') + colors.white('     OU: http://SEU-IP:3001/install                     ') + colors.cyan('║'));
  console.log(colors.cyan('║') + '                                                       ' + colors.cyan('║'));
  console.log(colors.cyan('║') + colors.yellow('  💡 DICA: Rodando em BACKGROUND                        ') + colors.cyan('║'));
  console.log(colors.cyan('║') + '     Para NÃO ocupar o terminal, use:                 ' + colors.cyan('║'));
  console.log(colors.cyan('║') + '     Opção 5 (Deploy Produção - PM2)                  ' + colors.cyan('║'));
  console.log(colors.cyan('║') + '                                                       ' + colors.cyan('║'));
  console.log(colors.cyan('║') + colors.red('  ⚠️  Para PARAR: Pressione Ctrl+C                      ') + colors.cyan('║'));
  console.log(colors.cyan('╚══════════════════════════════════════════════════════════╝'));
  console.log('');
  
  log.info('Iniciando servidor em modo desenvolvimento...');
  log.info('Porta: 3001');
  log.info('Hot reload: Ativado (nodemon)');
  console.log('');
  
  // Usar npm run dev se disponível, senão node direto
  const packageJsonPath = path.join(backendPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (packageJson.scripts && packageJson.scripts.dev) {
      runCommand('npm run dev', { cwd: backendPath });
    } else {
      runCommand('node src/server.js', { cwd: backendPath });
    }
  }
}

function deployProd() {
  log.title('🚀 DEPLOY - PRODUÇÃO');
  
  const backendPath = path.join(process.cwd(), 'backend-nodejs');
  
  // Verificar se PM2 está instalado
  if (!commandExists('pm2')) {
    log.error('PM2 não instalado!');
    log.info('\n💡 Instale PM2 globalmente:');
    log.info('   npm install -g pm2');
    log.info('\n💡 OU inicie manualmente:');
    log.info('   cd backend-nodejs');
    log.info('   npm start');
    return;
  }
  
  log.info('Iniciando com PM2...');
  
  // Parar se já estiver rodando
  runCommand('pm2 stop meumu-backend', { silent: true });
  runCommand('pm2 delete meumu-backend', { silent: true });
  
  // Iniciar
  const startCmd = `pm2 start src/server.js --name meumu-backend --time`;
  const result = runCommand(startCmd, { cwd: backendPath });
  
  if (result.success) {
    log.success('Servidor iniciado com PM2!');
    console.log('');
    log.info('Comandos úteis:');
    log.info('  pm2 logs meumu-backend  - Ver logs');
    log.info('  pm2 monit               - Monitorar');
    log.info('  pm2 restart meumu-backend - Reiniciar');
    log.info('  pm2 stop meumu-backend  - Parar');
  } else {
    log.error('Falha ao iniciar com PM2');
  }
  
  console.log('');
}

// ═══════════════════════════════════════════════════════════════
// 5. LOGS E RELATÓRIOS
// ═══════════════════════════════════════════════════════════════

function showLogs() {
  log.title('📊 LOGS DO SISTEMA');
  
  const backendPath = path.join(process.cwd(), 'backend-nodejs');
  const logsPath = path.join(backendPath, 'logs');
  
  if (!fs.existsSync(logsPath)) {
    log.warn('❌ Diretório de logs não existe ainda');
    console.log('');
    log.info('💡 Os logs serão criados quando:');
    log.info('   1. O servidor iniciar (npm start)');
    log.info('   2. Houver atividade de segurança');
    log.info('   3. Houver erros ou alertas');
    console.log('');
    log.info('🚀 Para iniciar o servidor:');
    log.info('   cd backend-nodejs');
    log.info('   npm start');
    console.log('');
    return;
  }
  
  // Listar arquivos de log
  let logFiles = [];
  
  try {
    const files = fs.readdirSync(logsPath, { recursive: true, withFileTypes: true });
    logFiles = files
      .filter(f => f.isFile())
      .map(f => path.join(f.path || logsPath, f.name))
      .filter(f => f.endsWith('.log') || f.endsWith('.json'));
  } catch (error) {
    log.error('Erro ao ler diretório de logs');
    return;
  }
  
  if (logFiles.length === 0) {
    log.warn('📁 Diretório de logs existe mas está vazio');
    console.log('');
    log.info('💡 Logs serão criados quando o servidor iniciar');
    log.info('');
    log.info('🚀 Para iniciar o servidor:');
    log.info('   cd backend-nodejs');
    log.info('   npm start');
    console.log('');
    return;
  }
  
  log.success(`✅ ${logFiles.length} arquivo(s) de log encontrado(s):\n`);
  
  for (const file of logFiles) {
    const stats = fs.statSync(file);
    const relPath = path.relative(process.cwd(), file);
    const size = (stats.size / 1024).toFixed(2);
    
    console.log(`  📄 ${relPath}`);
    console.log(`     Tamanho: ${size} KB`);
    console.log(`     Modificado: ${stats.mtime.toLocaleString()}`);
    console.log('');
  }
  
  log.info('💡 Para ver conteúdo dos logs:');
  log.info('   tail -f backend-nodejs/logs/security/security.log');
  console.log('');
}

// ═══════════════════════════════════════════════════════════════
// MENU INTERATIVO
// ═══════════════════════════════════════════════════════════════

function showMenu() {
  console.clear();
  
  console.log(`
${colors.cyan}╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        🔧 MEUMU ONLINE - DIAGNÓSTICO E MANUTENÇÃO 🔧      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝${colors.reset}

${colors.yellow}ESCOLHA UMA OPÇÃO:${colors.reset}

  ${colors.cyan}1.${colors.reset} Diagnóstico Completo
  ${colors.cyan}2.${colors.reset} Fix Automático
  ${colors.cyan}3.${colors.reset} Scan de Segurança
  ${colors.cyan}4.${colors.reset} Deploy (Desenvolvimento)
  ${colors.cyan}5.${colors.reset} Deploy (Produção - PM2)
  ${colors.cyan}6.${colors.reset} Ver Logs
  ${colors.cyan}7.${colors.reset} Executar Tudo (Diagnóstico + Fix + Scan)
  ${colors.cyan}0.${colors.reset} Sair

${colors.yellow}Digite o número da opção:${colors.reset} `);
}

async function interactiveMenu() {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    readline.question('', (answer) => {
      readline.close();
      resolve(answer.trim());
    });
  });
}

async function runInteractive() {
  while (true) {
    showMenu();
    const choice = await interactiveMenu();
    
    console.clear();
    
    switch (choice) {
      case '1': {
        // Executar diagnósticos
        const systemResult = diagnosticSystem();
        const backendResult = diagnosticBackend();
        
        // Verificar se há problemas
        const hasIssues = systemResult.hasIssues || backendResult.hasIssues;
        
        if (hasIssues) {
          console.log('');
          log.warn('⚠️  PROBLEMAS DETECTADOS!');
          console.log('');
          
          // Perguntar se quer corrigir automaticamente
          const readline = createInterface({
            input: process.stdin,
            output: process.stdout
          });
          
          const shouldFix = await new Promise((resolve) => {
            readline.question(
              `${colors.yellow}Deseja corrigir automaticamente? (S/n):${colors.reset} `,
              (answer) => {
                readline.close();
                resolve(answer.trim().toLowerCase() !== 'n');
              }
            );
          });
          
          if (shouldFix) {
            console.log('');
            console.log('═'.repeat(60));
            fixProblems();
            
            // VERIFICAR SE OS ARQUIVOS FORAM CRIADOS
            console.log('');
            log.info('🔍 Verificando correções...');
            console.log('');
            
            const backendPath = path.join(process.cwd(), 'backend-nodejs');
            const envExamplePath = path.join(backendPath, '.env.example');
            const envPath = path.join(backendPath, '.env');
            const nodeModulesPath = path.join(backendPath, 'node_modules');
            
            if (fs.existsSync(envExamplePath)) {
              log.success('.env.example ✓');
            } else {
              log.error('.env.example ainda não existe');
            }
            
            if (fs.existsSync(envPath)) {
              log.success('.env ✓');
            } else {
              log.error('.env ainda não existe');
            }
            
            if (fs.existsSync(nodeModulesPath)) {
              log.success('node_modules ✓');
            } else {
              log.error('❌ node_modules NÃO foi criado!');
              log.warn('');
              log.warn('POSSÍVEIS CAUSAS:');
              log.warn('  1. npm install falhou silenciosamente');
              log.warn('  2. Erro de permissão');
              log.warn('  3. Problema de rede');
              log.warn('');
              log.info('💡 Tente manualmente agora:');
              log.info('   cd backend-nodejs');
              log.info('   npm install');
            }
            
            console.log('');
            log.success('✅ Processo de correção concluído!');
            log.info('💡 Execute o diagnóstico novamente (opção 1) para confirmar');
          }
        } else {
          log.success('✅ TUDO OK! Nenhum problema encontrado.');
        }
        break;
      }
      
      case '2':
        fixProblems();
        
        // Verificar resultado após fix manual (opção 2)
        console.log('');
        log.info('🔍 Verificando correções...');
        console.log('');
        
        const backendPath = path.join(process.cwd(), 'backend-nodejs');
        const envExamplePath = path.join(backendPath, '.env.example');
        const envPath = path.join(backendPath, '.env');
        const nodeModulesPath = path.join(backendPath, 'node_modules');
        
        if (fs.existsSync(envExamplePath)) {
          log.success('.env.example ✓');
        } else {
          log.error('.env.example ainda não existe');
        }
        
        if (fs.existsSync(envPath)) {
          log.success('.env ✓');
        } else {
          log.error('.env ainda não existe');
        }
        
        if (fs.existsSync(nodeModulesPath)) {
          log.success('node_modules ✓');
        } else {
          log.error('❌ node_modules NÃO foi criado!');
        }
        break;
      
      case '3':
        securityScan();
        break;
      
      case '4':
        deployDev();
        return; // Sair após iniciar servidor
      
      case '5':
        deployProd();
        break;
      
      case '6':
        showLogs();
        break;
      
      case '7': {
        const systemResult = diagnosticSystem();
        const backendResult = diagnosticBackend();
        fixProblems();
        securityScan();
        log.success('\n✅ Tudo executado!');
        break;
      }
      
      case '0':
        console.log(`\n${colors.green}👋 Até logo!${colors.reset}\n`);
        process.exit(0);
      
      default:
        log.error('Opção inválida!');
    }
    
    console.log(`\n${colors.yellow}Pressione ENTER para continuar...${colors.reset}`);
    await interactiveMenu();
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);
  
  // Se passou argumentos, executar diretamente
  if (args.length > 0) {
    const command = args[0];
    
    switch (command) {
      case 'diagnostic':
      case 'diag':
        diagnosticSystem();
        diagnosticBackend();
        break;
      
      case 'fix':
        fixProblems();
        break;
      
      case 'security':
      case 'scan':
        securityScan();
        break;
      
      case 'dev':
        deployDev();
        break;
      
      case 'prod':
        deployProd();
        break;
      
      case 'logs':
        showLogs();
        break;
      
      case 'all':
        diagnosticSystem();
        diagnosticBackend();
        fixProblems();
        securityScan();
        break;
      
      default:
        console.log(`${colors.red}Comando desconhecido: ${command}${colors.reset}\n`);
        console.log('Comandos disponíveis:');
        console.log('  node check.js diagnostic  - Diagnóstico');
        console.log('  node check.js fix         - Fix automático');
        console.log('  node check.js security    - Scan de segurança');
        console.log('  node check.js dev         - Deploy dev');
        console.log('  node check.js prod        - Deploy produção');
        console.log('  node check.js logs        - Ver logs');
        console.log('  node check.js all         - Executar tudo');
        console.log('  node check.js             - Menu interativo');
    }
  } else {
    // Menu interativo
    await runInteractive();
  }
}

// Executar
main();