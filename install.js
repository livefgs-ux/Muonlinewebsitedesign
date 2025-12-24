#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════
 *  MEUMU ONLINE - INSTALADOR UNIVERSAL
 *  Funciona em: Windows, Linux, macOS
 *  Requisitos: Node.js 18+
 * ═══════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para terminal (funciona em Windows 10+ e Unix)
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.blue}${'═'.repeat(60)}${colors.reset}\n  ${msg}\n${colors.blue}${'═'.repeat(60)}${colors.reset}\n`)
};

// Executar comando de forma segura (cross-platform)
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

// Verificar requisitos
function checkRequirements() {
  log.title('🔍 VERIFICANDO REQUISITOS');
  
  const requirements = {
    node: { name: 'Node.js', cmd: 'node --version', required: true },
    npm: { name: 'npm', cmd: 'npm --version', required: true },
    git: { name: 'Git', cmd: 'git --version', required: false }
  };
  
  let allOk = true;
  
  for (const [key, req] of Object.entries(requirements)) {
    const exists = commandExists(key);
    
    if (exists) {
      const result = runCommand(req.cmd, { silent: true });
      const version = result.output.trim();
      log.success(`${req.name}: ${version}`);
    } else {
      if (req.required) {
        log.error(`${req.name}: NÃO INSTALADO (OBRIGATÓRIO)`);
        allOk = false;
      } else {
        log.warn(`${req.name}: NÃO INSTALADO (OPCIONAL)`);
      }
    }
  }
  
  if (!allOk) {
    log.error('\n❌ REQUISITOS FALTANDO!');
    log.info('\n📋 INSTALE:');
    log.info('   • Node.js 18+: https://nodejs.org');
    log.info('   • npm: (vem com Node.js)');
    log.info('\n💡 Depois execute: node install.js');
    process.exit(1);
  }
  
  log.success('\n✅ Todos os requisitos atendidos!\n');
}

// Verificar estrutura de pastas
function checkDirectories() {
  log.title('📁 VERIFICANDO ESTRUTURA');
  
  const requiredDirs = [
    'backend-nodejs',
    'backend-nodejs/src',
    'backend-nodejs/src/config',
    'backend-nodejs/src/routes',
    'backend-nodejs/src/middleware'
  ];
  
  let allOk = true;
  
  for (const dir of requiredDirs) {
    if (fs.existsSync(dir)) {
      log.success(`${dir}`);
    } else {
      log.error(`${dir} - NÃO EXISTE`);
      allOk = false;
    }
  }
  
  if (!allOk) {
    log.error('\n❌ ESTRUTURA INCOMPLETA!');
    log.info('\n💡 Execute este script da raiz do projeto');
    process.exit(1);
  }
  
  log.success('\n✅ Estrutura OK!\n');
}

// Instalar dependências do backend
function installBackendDependencies() {
  log.title('📦 INSTALANDO DEPENDÊNCIAS DO BACKEND');
  
  const backendPath = path.join(process.cwd(), 'backend-nodejs');
  
  if (!fs.existsSync(path.join(backendPath, 'package.json'))) {
    log.error('package.json não encontrado no backend!');
    process.exit(1);
  }
  
  log.info('Instalando dependências...');
  
  const result = runCommand('npm install', { cwd: backendPath });
  
  if (!result.success) {
    log.error('Falha ao instalar dependências!');
    log.info('\n💡 Tente manualmente:');
    log.info('   cd backend-nodejs');
    log.info('   npm install');
    process.exit(1);
  }
  
  log.success('\n✅ Dependências instaladas!\n');
}

// Verificar .env
function checkEnvFile() {
  log.title('⚙️  VERIFICANDO CONFIGURAÇÃO (.env)');
  
  const envPath = path.join(process.cwd(), 'backend-nodejs', '.env');
  const envExamplePath = path.join(process.cwd(), 'backend-nodejs', '.env.example');
  
  if (fs.existsSync(envPath)) {
    log.success('.env já existe');
    
    // Verificar variáveis obrigatórias
    const envContent = fs.readFileSync(envPath, 'utf8');
    const required = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME_MUONLINE'];
    
    let allOk = true;
    for (const varName of required) {
      const regex = new RegExp(`^${varName}=.+`, 'm');
      if (regex.test(envContent)) {
        log.success(`  ${varName} configurado`);
      } else {
        log.warn(`  ${varName} NÃO configurado`);
        allOk = false;
      }
    }
    
    if (!allOk) {
      log.warn('\n⚠️  Configure as variáveis faltantes em backend-nodejs/.env');
    }
    
  } else if (fs.existsSync(envExamplePath)) {
    log.warn('.env NÃO existe');
    log.info('Copiando .env.example → .env...');
    
    fs.copyFileSync(envExamplePath, envPath);
    log.success('.env criado a partir do .env.example');
    
    log.warn('\n⚠️  AÇÃO NECESSÁRIA:');
    log.info('   Edite backend-nodejs/.env e configure suas credenciais');
    log.info('   Depois execute: node install.js novamente');
    
  } else {
    log.error('.env e .env.example NÃO encontrados!');
    log.info('\n💡 Crie backend-nodejs/.env manualmente');
    process.exit(1);
  }
  
  console.log('');
}

// Configurar Git Hooks (se Git estiver disponível)
function setupGitHooks() {
  if (!commandExists('git')) {
    log.warn('Git não instalado - pulando configuração de hooks');
    return;
  }
  
  log.title('🔒 CONFIGURANDO GIT HOOKS (SEGURANÇA)');
  
  const gitDir = path.join(process.cwd(), '.git');
  if (!fs.existsSync(gitDir)) {
    log.warn('Não é um repositório Git - pulando');
    return;
  }
  
  const hookSource = path.join(process.cwd(), 'backend-nodejs', '.git-hooks', 'pre-commit');
  const hookDest = path.join(gitDir, 'hooks', 'pre-commit');
  
  if (!fs.existsSync(hookSource)) {
    log.warn('Hook pre-commit não encontrado - pulando');
    return;
  }
  
  // Criar diretório hooks se não existir
  const hooksDir = path.join(gitDir, 'hooks');
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }
  
  // Copiar hook
  fs.copyFileSync(hookSource, hookDest);
  
  // Dar permissão de execução (Unix) - no Windows não é necessário
  if (process.platform !== 'win32') {
    fs.chmodSync(hookDest, 0o755);
  }
  
  log.success('Git hook pre-commit configurado');
  log.info('  Proteção: Bloqueia commits com secrets');
  
  console.log('');
}

// Testar backend
function testBackend() {
  log.title('🧪 TESTANDO BACKEND');
  
  const serverPath = path.join(process.cwd(), 'backend-nodejs', 'src', 'server.js');
  
  if (!fs.existsSync(serverPath)) {
    log.error('server.js não encontrado!');
    process.exit(1);
  }
  
  log.info('Validando código...');
  
  // Verificar sintaxe
  const result = runCommand(`node --check "${serverPath}"`, { silent: true });
  
  if (!result.success) {
    log.error('Erro de sintaxe no código!');
    log.info(result.error);
    process.exit(1);
  }
  
  log.success('Código válido!\n');
}

// Exibir próximos passos
function showNextSteps() {
  log.title('✅ INSTALAÇÃO COMPLETA!');
  
  console.log(`${colors.green}Seu MeuMU Online está pronto para uso!${colors.reset}\n`);
  
  console.log(`${colors.cyan}📋 PRÓXIMOS PASSOS:${colors.reset}\n`);
  
  console.log('  1. Configure o .env:');
  console.log(`     ${colors.yellow}backend-nodejs/.env${colors.reset}`);
  console.log('');
  
  console.log('  2. Inicie o servidor:');
  console.log(`     ${colors.yellow}cd backend-nodejs${colors.reset}`);
  console.log(`     ${colors.yellow}npm start${colors.reset}`);
  console.log('');
  
  console.log('  3. Acesse:');
  console.log(`     ${colors.yellow}http://localhost:3001${colors.reset}`);
  console.log('');
  
  console.log(`${colors.cyan}🔧 FERRAMENTAS DISPONÍVEIS:${colors.reset}\n`);
  console.log(`  ${colors.yellow}node check.js${colors.reset} - Diagnóstico completo + Fix + Deploy`);
  console.log('');
  
  console.log(`${colors.cyan}📚 DOCUMENTAÇÃO:${colors.reset}\n`);
  console.log('  • /INCIDENT_RESPONSE.md - Resposta a incidentes');
  console.log('  • /MELHORIAS_IMPLEMENTADAS.md - Melhorias de segurança');
  console.log('  • /ANALISE_SEGURANCA.md - Análise de vulnerabilidades');
  console.log('');
  
  console.log(`${colors.green}🎮 BOM JOGO!${colors.reset}\n`);
}

// ═══════════════════════════════════════════════════════════════
// MAIN - EXECUÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.clear();
  
  console.log(`
${colors.cyan}╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🎮 MEUMU ONLINE - INSTALADOR 🎮              ║
║                                                            ║
║          Instalação Universal (Windows/Linux/macOS)       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝${colors.reset}
  `);
  
  try {
    checkRequirements();
    checkDirectories();
    installBackendDependencies();
    checkEnvFile();
    setupGitHooks();
    testBackend();
    showNextSteps();
    
  } catch (error) {
    log.error(`\n❌ ERRO DURANTE A INSTALAÇÃO:`);
    console.error(error);
    console.log('');
    log.info('💡 SOLUÇÃO:');
    log.info(`   Execute: ${colors.yellow}node check.js${colors.reset} para diagnóstico`);
    console.log('');
    process.exit(1);
  }
}

// Executar
main();
