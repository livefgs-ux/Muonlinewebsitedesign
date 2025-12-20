#!/usr/bin/env node

/**
 * 🛠️ CLI para Validação de Módulos
 * 
 * Uso:
 *   npm run validate <arquivo>
 *   npm run validate:list
 *   npm run validate:add <arquivo> <nome> <tipo>
 * 
 * Exemplos:
 *   npm run validate ./src/app/components/new-component.tsx
 *   npm run validate:list
 *   npm run validate:add ./src/app/components/ranking.tsx "Ranking System" frontend
 */

import * as fs from 'fs';
import * as path from 'path';
import validator, { Module, ValidationResult } from './module-validator';

// ==================== CORES PARA CLI ====================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ==================== FUNÇÕES CLI ====================

async function validateFile(filePath: string): Promise<void> {
  try {
    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
      log('red', `❌ Arquivo não encontrado: ${filePath}`);
      process.exit(1);
    }

    // Lê o conteúdo do arquivo
    const code = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, path.extname(filePath));
    
    log('cyan', `\n🔍 Validando arquivo: ${filePath}`);
    
    // Determina o tipo baseado no caminho
    let type: Module['type'] = 'frontend';
    if (filePath.includes('backend') || filePath.includes('server')) {
      type = 'backend';
    } else if (filePath.includes('/ui/')) {
      type = 'ui';
    }
    
    // Valida o módulo
    const result = validator.validateNewModule(code, fileName, type);
    
    // Mostra resultado
    console.log('\n' + '═'.repeat(80));
    log('bright', '📋 RESULTADO DA VALIDAÇÃO');
    console.log('═'.repeat(80));
    
    if (result.duplicate) {
      log('yellow', `\n⚠️  DUPLICAÇÃO DETECTADA (${result.similarity}%)`);
      
      if (result.match) {
        log('yellow', `\n📦 Módulo Similar:`);
        console.log(`   Nome: ${result.match.name}`);
        console.log(`   ID: ${result.match.id}`);
        console.log(`   Similaridade: ${result.match.score}%`);
        
        if (result.match.files && result.match.files.length > 0) {
          console.log(`\n   📁 Arquivos Existentes:`);
          result.match.files.forEach(file => console.log(`      - ${file}`));
        }
      }
      
      log('magenta', `\n💡 Recomendação: ${result.recommendation?.toUpperCase()}`);
      
      if (result.recommendation === 'merge') {
        log('yellow', '\n   → Considere fazer MERGE com o módulo existente');
        log('yellow', '   → Ou adicionar funcionalidade ao módulo existente');
      } else if (result.recommendation === 'version') {
        log('yellow', '\n   → Considere criar uma nova versão do módulo existente');
        log('yellow', '   → Use versionamento semântico (ex: 1.1.0, 2.0.0)');
      }
      
      log('dim', '\n💬 Deseja adicionar mesmo assim? Use: npm run validate:add');
      
    } else {
      log('green', '\n✅ MÓDULO ÚNICO');
      log('green', '   Este módulo não possui duplicação significativa!');
      log('green', '   Pode ser adicionado com segurança ao projeto.');
      
      log('cyan', `\n📊 Informações:`);
      console.log(`   Tokens únicos: ${result.tokens.length}`);
      console.log(`   Fingerprint: ${result.fingerprint}`);
      console.log(`   Similaridade máxima: ${result.similarity}%`);
      
      log('dim', '\n💬 Para adicionar ao registro: npm run validate:add <arquivo> <nome> <tipo>');
    }
    
    console.log('═'.repeat(80) + '\n');
    
  } catch (error) {
    log('red', `❌ Erro durante validação: ${error}`);
    process.exit(1);
  }
}

async function addModuleToRegistry(
  filePath: string,
  name: string,
  type: Module['type'] = 'frontend',
  category: string = 'General'
): Promise<void> {
  try {
    if (!fs.existsSync(filePath)) {
      log('red', `❌ Arquivo não encontrado: ${filePath}`);
      process.exit(1);
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    const tokens = validator.extractTokens(code);
    
    // Calcula complexidade baseada no tamanho do código
    const lines = code.split('\n').length;
    const complexity = Math.min(100, Math.round((lines / 10) + (tokens.length / 5)));
    
    const module: Omit<Module, 'createdAt' | 'lastModified' | 'fingerprint'> = {
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name,
      type,
      category,
      functionality: tokens,
      files: [filePath],
      version: '1.0.0',
      complexity,
      projects: ['MeuMU Online'],
      dependencies: extractDependencies(code),
      status: 'stable',
    };
    
    validator.addModule(module, tokens);
    
    log('green', `\n✅ Módulo "${name}" adicionado com sucesso!`);
    log('dim', `   ID: ${module.id}`);
    log('dim', `   Tipo: ${type}`);
    log('dim', `   Complexidade: ${complexity}`);
    
  } catch (error) {
    log('red', `❌ Erro ao adicionar módulo: ${error}`);
    process.exit(1);
  }
}

function extractDependencies(code: string): string[] {
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  const dependencies = new Set<string>();
  
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    const dep = match[1];
    // Adiciona apenas dependências externas (não relativas)
    if (!dep.startsWith('.') && !dep.startsWith('/')) {
      const packageName = dep.split('/')[0];
      dependencies.add(packageName);
    }
  }
  
  return Array.from(dependencies);
}

// ==================== MAIN ====================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    log('yellow', '\n📚 USO DO VALIDADOR DE MÓDULOS\n');
    console.log('Comandos disponíveis:');
    console.log('  npm run validate <arquivo>                   - Valida um arquivo');
    console.log('  npm run validate:list                        - Lista todos os módulos');
    console.log('  npm run validate:add <arquivo> <nome> <tipo> - Adiciona ao registro');
    console.log('\nExemplos:');
    console.log('  npm run validate ./src/app/components/ranking.tsx');
    console.log('  npm run validate:list');
    console.log('  npm run validate:add ./src/app/components/ranking.tsx "Ranking System" frontend\n');
    process.exit(0);
  }
  
  switch (command) {
    case 'list':
      validator.listModules();
      break;
      
    case 'add':
      const [, filePath, name, type] = args;
      if (!filePath || !name) {
        log('red', '❌ Uso: npm run validate:add <arquivo> <nome> [tipo]');
        process.exit(1);
      }
      await addModuleToRegistry(
        filePath,
        name,
        (type as Module['type']) || 'frontend'
      );
      break;
      
    default:
      // Assume que é um caminho de arquivo
      await validateFile(command);
      break;
  }
}

// Executa
main().catch(error => {
  log('red', `❌ Erro fatal: ${error}`);
  process.exit(1);
});
