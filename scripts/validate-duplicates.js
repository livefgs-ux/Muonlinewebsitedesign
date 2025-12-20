#!/usr/bin/env node

/**
 * ============================================
 * 📋 SCRIPT: React/TS Duplicate Code Analyzer
 * 🔧 PROPÓSITO: Detectar funções, componentes e código duplicado
 * 🚀 VERSÃO: 1.0.0 - MeuMU Online Edition
 * 🧠 COMPATIBILIDADE: Node.js 18+
 * ============================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 Iniciando verificação de duplicidades no projeto MeuMU Online...\n");

// Configuração de pastas para análise
const SRC_DIR = path.join(__dirname, '../src');
const SERVER_DIR = path.join(__dirname, '../server');

// Coletores de dados
const functionNames = new Map();
const componentNames = new Map();
const interfaceNames = new Map();
const importPaths = new Map();
const utilityFunctions = new Map();
const validationPatterns = new Map();

// Regex patterns
const FUNCTION_REGEX = /(?:function|const|let)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=:]/g;
const COMPONENT_REGEX = /(?:export\s+)?(?:default\s+)?(?:function|const)\s+([A-Z][a-zA-Z0-9]*)\s*[=:(]/g;
const INTERFACE_REGEX = /interface\s+([A-Z][a-zA-Z0-9]*)/g;
const IMPORT_REGEX = /import\s+(?:{[^}]*}|[^'"]*)\s+from\s+['"]([^'"]+)['"]/g;

/**
 * Lê todos os arquivos recursivamente
 */
function getAllFiles(dirPath, arrayOfFiles = [], extensions = ['.tsx', '.ts', '.js', '.jsx']) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      // Ignorar node_modules e dist
      if (file !== 'node_modules' && file !== 'dist' && file !== 'build') {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles, extensions);
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

/**
 * Analisa um arquivo e extrai padrões
 */
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Funções
  let match;
  while ((match = FUNCTION_REGEX.exec(content)) !== null) {
    const funcName = match[1];
    if (!functionNames.has(funcName)) {
      functionNames.set(funcName, []);
    }
    functionNames.get(funcName).push(relativePath);
  }

  // Componentes React
  const componentRegex = new RegExp(COMPONENT_REGEX.source, 'g');
  while ((match = componentRegex.exec(content)) !== null) {
    const compName = match[1];
    if (!componentNames.has(compName)) {
      componentNames.set(compName, []);
    }
    componentNames.get(compName).push(relativePath);
  }

  // Interfaces
  const interfaceRegex = new RegExp(INTERFACE_REGEX.source, 'g');
  while ((match = interfaceRegex.exec(content)) !== null) {
    const intName = match[1];
    if (!interfaceNames.has(intName)) {
      interfaceNames.set(intName, []);
    }
    interfaceNames.get(intName).push(relativePath);
  }

  // Imports
  const importRegex = new RegExp(IMPORT_REGEX.source, 'g');
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!importPaths.has(importPath)) {
      importPaths.set(importPath, []);
    }
    importPaths.get(importPath).push(relativePath);
  }

  // Funções utilitárias comuns (detectar padrões)
  detectUtilityPatterns(content, relativePath);
  detectValidationPatterns(content, relativePath);
}

/**
 * Detecta padrões de funções utilitárias
 */
function detectUtilityPatterns(content, filePath) {
  const patterns = [
    { name: 'formatNumber', regex: /(?:function|const)\s+format(?:Number|Currency)\s*[=:(]/g },
    { name: 'formatDate', regex: /(?:function|const)\s+formatDate\s*[=:(]/g },
    { name: 'getStatusColor', regex: /(?:function|const)\s+getStatus(?:Color|Text|Icon)\s*[=:(]/g },
    { name: 'handleToggle', regex: /(?:function|const)\s+handleToggle\s*[=:(]/g },
    { name: 'handleSave', regex: /(?:function|const)\s+handleSave\s*[=:(]/g },
  ];

  patterns.forEach(({ name, regex }) => {
    if (regex.test(content)) {
      if (!utilityFunctions.has(name)) {
        utilityFunctions.set(name, []);
      }
      utilityFunctions.get(name).push(filePath);
    }
  });
}

/**
 * Detecta padrões de validação
 */
function detectValidationPatterns(content, filePath) {
  const patterns = [
    { name: 'emailValidation', regex: /['"]\^[\[\]\\w\.\-]+@[\[\]\\w\.\-]+\.[a-z]{2,}['"]/gi },
    { name: 'passwordValidation', regex: /password.*length.*[>=<]+.*\d+/gi },
    { name: 'levelValidation', regex: /level.*[>=<]+.*\d+/gi },
    { name: 'zenValidation', regex: /(?:zen|money).*[>=<]+.*\d+/gi },
  ];

  patterns.forEach(({ name, regex }) => {
    if (regex.test(content)) {
      if (!validationPatterns.has(name)) {
        validationPatterns.set(name, []);
      }
      validationPatterns.get(name).push(filePath);
    }
  });
}

/**
 * Reporta duplicidades
 */
function reportDuplicates(map, label, minOccurrences = 2) {
  const duplicates = Array.from(map.entries())
    .filter(([_, files]) => files.length >= minOccurrences)
    .sort((a, b) => b[1].length - a[1].length);

  if (duplicates.length > 0) {
    console.log(`\n⚠️  ${duplicates.length} duplicidades encontradas em ${label}:\n`);
    duplicates.forEach(([name, files]) => {
      console.log(`   📌 ${name} (${files.length}x)`);
      files.forEach((file) => {
        console.log(`      → ${file}`);
      });
      console.log('');
    });
    return duplicates.length;
  } else {
    console.log(`✅ Nenhuma duplicidade em ${label}.`);
    return 0;
  }
}

/**
 * Sugere refatorações
 */
function suggestRefactoring(map, label, targetFile) {
  const duplicates = Array.from(map.entries())
    .filter(([_, files]) => files.length >= 2);

  if (duplicates.length > 0) {
    console.log(`\n💡 Sugestões de Refatoração para ${label}:\n`);
    duplicates.forEach(([name, files]) => {
      console.log(`   🔧 Consolidar "${name}" em: ${targetFile}`);
      console.log(`      Remover de:`);
      files.forEach((file) => {
        console.log(`      ❌ ${file}`);
      });
      console.log('');
    });
  }
}

/**
 * Análise principal
 */
function main() {
  console.log("📂 Coletando arquivos...\n");

  // Coletar todos os arquivos
  const srcFiles = getAllFiles(SRC_DIR);
  const serverFiles = getAllFiles(SERVER_DIR);
  const allFiles = [...srcFiles, ...serverFiles];

  console.log(`📊 Total de arquivos para análise: ${allFiles.length}\n`);

  // Analisar cada arquivo
  allFiles.forEach((file) => analyzeFile(file));

  // Relatórios
  console.log("\n" + "=".repeat(60));
  console.log("📊 RELATÓRIO DE DUPLICIDADE - MeuMU Online");
  console.log("=".repeat(60));

  let totalDuplicates = 0;

  totalDuplicates += reportDuplicates(componentNames, "Componentes React", 2);
  totalDuplicates += reportDuplicates(interfaceNames, "Interfaces TypeScript", 2);
  totalDuplicates += reportDuplicates(utilityFunctions, "Funções Utilitárias", 2);
  totalDuplicates += reportDuplicates(validationPatterns, "Padrões de Validação", 2);

  // Sugestões de refatoração
  console.log("\n" + "=".repeat(60));
  console.log("💡 SUGESTÕES DE REFATORAÇÃO");
  console.log("=".repeat(60));

  suggestRefactoring(utilityFunctions, "Funções Utilitárias", "/src/utils/helpers.ts");
  suggestRefactoring(validationPatterns, "Validações", "/src/utils/validators.ts");
  suggestRefactoring(interfaceNames, "Interfaces", "/src/types/index.ts");

  // Estatísticas finais
  console.log("\n" + "=".repeat(60));
  console.log("📈 ESTATÍSTICAS FINAIS");
  console.log("=".repeat(60));
  console.log(`Total de funções únicas: ${functionNames.size}`);
  console.log(`Total de componentes únicos: ${componentNames.size}`);
  console.log(`Total de interfaces únicas: ${interfaceNames.size}`);
  console.log(`Total de duplicidades encontradas: ${totalDuplicates}`);
  console.log("=".repeat(60));

  if (totalDuplicates > 0) {
    console.log("\n⚠️  Ação recomendada: Refatorar código duplicado\n");
    process.exit(1);
  } else {
    console.log("\n✅ Código está limpo e sem duplicidades significativas!\n");
    process.exit(0);
  }
}

// Executar
main();
