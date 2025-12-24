#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════
 *  SCRIPT DE LIMPEZA - MEUMU ONLINE
 *  Remove arquivos desnecessários e organiza o projeto
 * ═══════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════`);
console.log(`  🧹 LIMPEZA DO PROJETO`);
console.log(`═══════════════════════════════════════════════════════════════${colors.reset}\n`);

// Arquivos .md duplicados/desnecessários para deletar
const mdToDelete = [
  'ANALISE_SEGURANCA.md',
  'DEPLOY_GITHUB.md',
  'INCIDENT_RESPONSE.md',
  'INSTALACAO_SEGURANCA.md',
  'INSTALAR_SITE_COMPLETO.md',
  'LEIA_AQUI.md',
  'LEIA_AQUI_INSTALACAO_SITE.md',
  'MELHORIAS_IMPLEMENTADAS.md',
  'PROBLEMA_E_SOLUCAO.md',
  'README_INSTALACAO.md',
  'REESTRUTURACAO_COMPLETA.md',
  'RESUMO_SEGURANCA.md',
  'REVISAO_FINAL.md',
  'SCRIPTS_LEGACY.md',
  'SEGURANCA_IMPLEMENTADA.md',
  'SOLUCAO_FINAL_INSTALADOR.md',
  'ATTRIBUTIONS.md' // Figma
];

// Arquivos .txt desnecessários
const txtToDelete = [
  'ACESSE_ASSIM.txt',
  'COMANDO_RAPIDO_INSTALAR_SITE.txt',
  'CORRIGIDO_CORS.txt',
  'EXECUTAR_AGORA_SIMPLES.txt',
  'EXECUTE_AGORA.txt',
  'EXECUTE_ESTE_COMANDO.txt',
  'PASSO_A_PASSO_FINAL.txt'
];

// Scripts .sh desnecessários (raiz)
const shToDelete = [
  'BUILDAR_AGORA_CORRIGIDO.sh',
  'BUILDAR_E_INSTALAR_AGORA.sh',
  'COPIAR_FRONTEND_PARA_SERVIDOR.sh',
  'INSTALACAO_AUTOMATICA_COMPLETA.sh',
  'INSTALAR_TUDO_AUTOMATICO.sh',
  'PREPARAR_FRONTEND_NO_SERVIDOR.sh',
  'instalacao.sh',
  'setup.sh'
];

// Pastas desnecessárias
const dirsToDelete = [
  'MD Files',
  'installation',
  'logs-criacao',
  'home/public_html',
  'Site Ready to install',
  'install' // instalador HTML antigo
];

let deletedCount = 0;

// Função para deletar arquivo
function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`${colors.red}✗${colors.reset} Deletado: ${filePath}`);
      deletedCount++;
      return true;
    }
    return false;
  } catch (error) {
    console.log(`${colors.yellow}⚠${colors.reset} Erro ao deletar ${filePath}: ${error.message}`);
    return false;
  }
}

// Função para deletar diretório recursivamente
function deleteDir(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`${colors.red}✗${colors.reset} Deletado diretório: ${dirPath}`);
      deletedCount++;
      return true;
    }
    return false;
  } catch (error) {
    console.log(`${colors.yellow}⚠${colors.reset} Erro ao deletar ${dirPath}: ${error.message}`);
    return false;
  }
}

console.log(`${colors.cyan}📋 Deletando arquivos .md duplicados...${colors.reset}\n`);
mdToDelete.forEach(file => deleteFile(path.join(process.cwd(), file)));

console.log(`\n${colors.cyan}📋 Deletando arquivos .txt desnecessários...${colors.reset}\n`);
txtToDelete.forEach(file => deleteFile(path.join(process.cwd(), file)));

console.log(`\n${colors.cyan}📋 Deletando scripts .sh antigos...${colors.reset}\n`);
shToDelete.forEach(file => deleteFile(path.join(process.cwd(), file)));

console.log(`\n${colors.cyan}📁 Deletando pastas desnecessárias...${colors.reset}\n`);
dirsToDelete.forEach(dir => deleteDir(path.join(process.cwd(), dir)));

// Deletar scripts .sh do backend (mantém só ecosystem.config.js e nginx-security.conf)
console.log(`\n${colors.cyan}📋 Limpando backend-nodejs/...${colors.reset}\n`);
const backendPath = path.join(process.cwd(), 'backend-nodejs');
if (fs.existsSync(backendPath)) {
  const backendFiles = fs.readdirSync(backendPath);
  backendFiles.forEach(file => {
    if (file.endsWith('.sh') && file !== 'nginx-security.conf') {
      deleteFile(path.join(backendPath, file));
    }
  });
  
  // Deletar README duplicados
  ['README_RAPIDO.md'].forEach(file => {
    deleteFile(path.join(backendPath, file));
  });
}

// Deletar scripts da pasta /scripts
console.log(`\n${colors.cyan}📋 Limpando /scripts...${colors.reset}\n`);
const scriptsPath = path.join(process.cwd(), 'scripts');
if (fs.existsSync(scriptsPath)) {
  const scriptFiles = [
    'deploy.sh',
    'fix-permissions.ps1',
    'fix-permissions.sh',
    'package-release.sh',
    'start-backend.sh'
  ];
  scriptFiles.forEach(file => deleteFile(path.join(scriptsPath, file)));
}

console.log(`\n${colors.green}═══════════════════════════════════════════════════════════════`);
console.log(`  ✅ LIMPEZA CONCLUÍDA!`);
console.log(`  📊 ${deletedCount} arquivo(s)/pasta(s) deletado(s)`);
console.log(`═══════════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.cyan}📁 ESTRUTURA FINAL:${colors.reset}\n`);
console.log('  /');
console.log('  ├── install.js ⭐ (Instalador)');
console.log('  ├── check.js ⭐ (Diagnóstico)');
console.log('  ├── cleanup.js (Este script)');
console.log('  ├── README.md (Documentação)');
console.log('  ├── CHANGELOG.md (Histórico)');
console.log('  ├── package.json');
console.log('  ├── backend-nodejs/');
console.log('  │   ├── .env.example');
console.log('  │   ├── src/');
console.log('  │   └── package.json');
console.log('  └── src/ (Frontend React)');
console.log('');

console.log(`${colors.yellow}💡 PRÓXIMO PASSO:${colors.reset}\n`);
console.log('  Commit as mudanças:');
console.log(`  ${colors.cyan}git add .${colors.reset}`);
console.log(`  ${colors.cyan}git commit -m "chore: limpeza completa do projeto"${colors.reset}`);
console.log('');
