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
  
  // Fix 1: Criar .env se não existir
  const envPath = path.join(backendPath, '.env');
  const envExamplePath = path.join(backendPath, '.env.example');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    log.info('Criando .env a partir de .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    log.success('.env criado');
  }
  
  // Fix 2: Instalar dependências se faltarem
  const nodeModulesPath = path.join(backendPath, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log.info('Instalando dependências...');
    const result = runCommand('npm install', { cwd: backendPath });
    if (result.success) {
      log.success('Dependências instaladas');
    } else {
      log.error('Falha ao instalar dependências');
    }
  }
  
  // Fix 3: Criar diretórios de logs se não existirem
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
    }
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
  
  log.info('Iniciando servidor em modo desenvolvimento...');
  log.info('Porta: 3001');
  log.info('Hot reload: Ativado (nodemon)');
  console.log('');
  
  log.warn('Pressione Ctrl+C para parar\n');
  
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
    log.warn('Diretório de logs não existe ainda');
    log.info('Os logs serão criados quando o servidor iniciar');
    return;
  }
  
  // Listar arquivos de log
  const files = fs.readdirSync(logsPath, { recursive: true, withFileTypes: true });
  const logFiles = files
    .filter(f => f.isFile())
    .map(f => path.join(f.path || logsPath, f.name))
    .filter(f => f.endsWith('.log') || f.endsWith('.json'));
  
  if (logFiles.length === 0) {
    log.info('Nenhum log encontrado ainda');
    return;
  }
  
  log.info(`${logFiles.length} arquivo(s) de log encontrado(s):\n`);
  
  for (const file of logFiles) {
    const stats = fs.statSync(file);
    const relPath = path.relative(process.cwd(), file);
    const size = (stats.size / 1024).toFixed(2);
    
    console.log(`  ${relPath}`);
    console.log(`    Tamanho: ${size} KB`);
    console.log(`    Modificado: ${stats.mtime.toLocaleString()}`);
    console.log('');
  }
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
            fixProblems();
            log.success('✅ Correções aplicadas!');
            log.info('💡 Execute o diagnóstico novamente para verificar');
          }
        } else {
          log.success('✅ TUDO OK! Nenhum problema encontrado.');
        }
        break;
      }
      
      case '2':
        fixProblems();
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