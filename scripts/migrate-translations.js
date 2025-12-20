#!/usr/bin/env node

/**
 * ============================================
 * 📋 SCRIPT: Migrate Translation System
 * 🔧 PROPÓSITO: Migrar de t.key.subkey para t('key.subkey')
 * 🚀 VERSÃO: 1.0.0
 * ============================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.join(__dirname, '../src/app/components');
const DRY_RUN = process.argv.includes('--dry-run');

console.log('🔄 Iniciando migração do sistema de tradução...\n');

if (DRY_RUN) {
  console.log('🔍 MODO DRY-RUN - Nenhum arquivo será modificado\n');
}

/**
 * Get all .tsx files recursively
 */
function getAllTsxFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllTsxFiles(fullPath, files);
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  });

  return files;
}

/**
 * Migrate a file
 */
function migrateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);

  // Patterns to migrate
  const patterns = [
    // Pattern 1: {t.key.subkey}
    {
      regex: /\{t\.([a-zA-Z_]+)\.([a-zA-Z_]+)\}/g,
      replacement: "{t('$1.$2')}",
      description: 'JSX: {t.key.subkey} → {t(\'key.subkey\')}',
    },
    // Pattern 2: t.key.subkey (not in JSX)
    {
      regex: /(?<!\.)\bt\.([a-zA-Z_]+)\.([a-zA-Z_]+)\b(?!\()/g,
      replacement: "t('$1.$2')",
      description: 'JS: t.key.subkey → t(\'key.subkey\')',
    },
    // Pattern 3: {t.key.subkey.thirdkey} (3 levels)
    {
      regex: /\{t\.([a-zA-Z_]+)\.([a-zA-Z_]+)\.([a-zA-Z_]+)\}/g,
      replacement: "{t('$1.$2.$3')}",
      description: 'JSX 3-levels: {t.a.b.c} → {t(\'a.b.c\')}',
    },
    // Pattern 4: t.key.subkey.thirdkey (3 levels, not in JSX)
    {
      regex: /(?<!\.)\bt\.([a-zA-Z_]+)\.([a-zA-Z_]+)\.([a-zA-Z_]+)\b(?!\()/g,
      replacement: "t('$1.$2.$3')",
      description: 'JS 3-levels: t.a.b.c → t(\'a.b.c\')',
    },
  ];

  let newContent = content;
  let totalChanges = 0;
  const changes = [];

  patterns.forEach(pattern => {
    const matches = [...content.matchAll(pattern.regex)];
    
    if (matches.length > 0) {
      changes.push({
        description: pattern.description,
        count: matches.length,
        examples: matches.slice(0, 3).map(m => m[0]),
      });
      
      totalChanges += matches.length;
      newContent = newContent.replace(pattern.regex, pattern.replacement);
    }
  });

  if (totalChanges > 0) {
    console.log(`\n📝 ${relativePath}`);
    console.log(`   ✅ ${totalChanges} alterações encontradas:\n`);
    
    changes.forEach(change => {
      console.log(`   • ${change.description} (${change.count}x)`);
      change.examples.forEach(example => {
        console.log(`     - ${example}`);
      });
    });

    if (!DRY_RUN) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log(`   💾 Arquivo atualizado com sucesso!`);
    }
  }

  return totalChanges;
}

/**
 * Main function
 */
function main() {
  const files = getAllTsxFiles(COMPONENTS_DIR);
  
  console.log(`📂 Arquivos encontrados: ${files.length}\n`);
  console.log('='.repeat(60));

  let totalFiles = 0;
  let totalChanges = 0;

  files.forEach(file => {
    const changes = migrateFile(file);
    if (changes > 0) {
      totalFiles++;
      totalChanges += changes;
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 RESUMO DA MIGRAÇÃO\n');
  console.log(`Arquivos processados: ${files.length}`);
  console.log(`Arquivos modificados: ${totalFiles}`);
  console.log(`Total de alterações: ${totalChanges}`);

  if (DRY_RUN) {
    console.log('\n🔍 Modo DRY-RUN ativado - nenhum arquivo foi modificado');
    console.log('Execute novamente sem --dry-run para aplicar as mudanças\n');
  } else {
    console.log('\n✅ Migração concluída com sucesso!\n');
    console.log('🧪 Próximos passos:');
    console.log('   1. Execute: npm run dev');
    console.log('   2. Teste todas as traduções');
    console.log('   3. Teste mudança de idioma');
    console.log('   4. Verifique o console por warnings\n');
  }
}

// Execute
main();
