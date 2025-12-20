/**
 * 🧠 MODULE VALIDATOR - Sistema de Validação Inteligente
 * 
 * Previne duplicação de código analisando fingerprints e similaridade funcional
 * antes de inserir novos módulos no projeto.
 * 
 * @author MeuMU Online Development Team
 * @version 1.0.0
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// ==================== TIPOS ====================

export interface Module {
  id: string;
  name: string;
  type: 'backend' | 'frontend' | 'shared' | 'ui';
  category: string;
  functionality: string[];
  files?: string[];
  version: string;
  complexity: number;
  projects: string[];
  fingerprint: string;
  createdAt: string;
  lastModified: string;
  dependencies?: string[];
  status: 'draft' | 'stable' | 'deprecated';
  features?: string[];
  reusable?: boolean;
}

export interface Registry {
  projectInfo: {
    name: string;
    version: string;
    lastUpdated: string;
    description: string;
  };
  modules: Module[];
  components: Module[];
  decisions: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    reason: string;
    impact: string;
    status: string;
  }>;
  metadata: {
    totalModules: number;
    totalComponents: number;
    totalDecisions: number;
    averageComplexity: number;
    codeHealth: string;
    lastValidation: string;
  };
}

export interface ValidationResult {
  duplicate: boolean;
  similarity: number;
  match?: {
    name: string;
    id: string;
    score: number;
    hash: string;
    files?: string[];
  };
  recommendation?: 'reuse' | 'version' | 'merge' | 'create';
  fingerprint: string;
  tokens: string[];
}

// ==================== CONFIGURAÇÃO ====================

const REGISTRY_PATH = path.join(process.cwd(), 'shared', 'registry.json');
const SIMILARITY_THRESHOLD = 40; // % de similaridade para considerar duplicado
const HIGH_SIMILARITY_THRESHOLD = 70; // % para recomendar merge

// ==================== FUNÇÕES AUXILIARES ====================

/**
 * Extrai tokens significativos do código
 */
export function extractTokens(code: string): string[] {
  // Remove comentários
  const withoutComments = code
    .replace(/\/\*[\s\S]*?\*\//g, '') // /* ... */
    .replace(/\/\/.*/g, ''); // // ...

  // Extrai palavras (variáveis, funções, etc)
  const words = withoutComments.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
  
  // Remove palavras comuns (keywords do JS/TS)
  const commonWords = new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'import', 'export', 'default', 'class', 'interface', 'type', 'enum',
    'true', 'false', 'null', 'undefined', 'new', 'this', 'super',
    'async', 'await', 'try', 'catch', 'finally', 'throw',
    'public', 'private', 'protected', 'static', 'readonly',
  ]);

  const filteredWords = words
    .map(w => w.toLowerCase())
    .filter(w => !commonWords.has(w) && w.length > 2);

  // Retorna tokens únicos
  return Array.from(new Set(filteredWords));
}

/**
 * Calcula fingerprint (hash SHA1) dos tokens
 */
export function calculateFingerprint(tokens: string[]): string {
  const sortedTokens = tokens.sort().join('|');
  return crypto.createHash('sha1').update(sortedTokens).digest('hex').substring(0, 16);
}

/**
 * Calcula similaridade entre dois conjuntos de tokens (Jaccard Similarity)
 */
export function calculateSimilarity(tokens1: string[], tokens2: string[]): number {
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  if (union.size === 0) return 0;
  
  return Math.round((intersection.size / union.size) * 100);
}

/**
 * Carrega o registro do arquivo JSON
 */
export function loadRegistry(): Registry {
  try {
    if (!fs.existsSync(REGISTRY_PATH)) {
      throw new Error('Registry file not found');
    }
    const data = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Erro ao carregar registry.json:', error);
    throw error;
  }
}

/**
 * Salva o registro no arquivo JSON
 */
export function saveRegistry(registry: Registry): void {
  try {
    // Atualiza metadata
    registry.metadata.totalModules = registry.modules.length;
    registry.metadata.totalComponents = registry.components.length;
    registry.metadata.lastValidation = new Date().toISOString();
    
    if (registry.modules.length > 0) {
      const totalComplexity = registry.modules.reduce((sum, m) => sum + m.complexity, 0);
      registry.metadata.averageComplexity = Math.round(totalComplexity / registry.modules.length);
    }
    
    registry.projectInfo.lastUpdated = new Date().toISOString();
    
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
    console.log('✅ Registry atualizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao salvar registry.json:', error);
    throw error;
  }
}

// ==================== VALIDAÇÃO PRINCIPAL ====================

/**
 * Valida um novo módulo antes de adicioná-lo ao projeto
 */
export function validateNewModule(
  code: string,
  name: string,
  type: Module['type'] = 'frontend',
  category: string = 'General'
): ValidationResult {
  console.log('\n🔍 Validando módulo:', name);
  console.log('━'.repeat(60));
  
  // Extrai tokens e calcula fingerprint
  const tokens = extractTokens(code);
  const fingerprint = calculateFingerprint(tokens);
  
  console.log(`📊 Tokens extraídos: ${tokens.length}`);
  console.log(`🔐 Fingerprint: ${fingerprint}`);
  
  // Carrega registro
  const registry = loadRegistry();
  const allModules = [...registry.modules, ...registry.components];
  
  if (allModules.length === 0) {
    console.log('✅ Nenhum módulo existente. Este será o primeiro!');
    return {
      duplicate: false,
      similarity: 0,
      fingerprint,
      tokens,
      recommendation: 'create',
    };
  }
  
  // Calcula similaridade com todos os módulos existentes
  const similarities = allModules.map(module => {
    const similarity = calculateSimilarity(tokens, module.functionality);
    return {
      name: module.name,
      id: module.id,
      score: similarity,
      hash: module.fingerprint,
      files: module.files,
    };
  });
  
  // Encontra o mais similar
  const maxSimilarity = similarities.reduce((max, current) => 
    current.score > max.score ? current : max
  , { score: 0, name: '', id: '', hash: '', files: [] });
  
  console.log(`\n📈 Similaridade máxima: ${maxSimilarity.score}% com "${maxSimilarity.name}"`);
  
  // Determina recomendação baseada na similaridade
  let recommendation: ValidationResult['recommendation'] = 'create';
  
  if (maxSimilarity.score >= HIGH_SIMILARITY_THRESHOLD) {
    recommendation = 'merge';
    console.log(`⚠️  ALTA SIMILARIDADE (${maxSimilarity.score}%)`);
    console.log(`📦 Módulo similar: "${maxSimilarity.name}"`);
    console.log(`💡 RECOMENDAÇÃO: Considere fazer MERGE ou reutilizar o módulo existente`);
    if (maxSimilarity.files && maxSimilarity.files.length > 0) {
      console.log(`📁 Arquivos existentes:`);
      maxSimilarity.files.forEach(file => console.log(`   - ${file}`));
    }
  } else if (maxSimilarity.score >= SIMILARITY_THRESHOLD) {
    recommendation = 'version';
    console.log(`⚠️  SIMILARIDADE MODERADA (${maxSimilarity.score}%)`);
    console.log(`📦 Módulo similar: "${maxSimilarity.name}"`);
    console.log(`💡 RECOMENDAÇÃO: Considere criar uma VERSÃO do módulo existente`);
    if (maxSimilarity.files && maxSimilarity.files.length > 0) {
      console.log(`📁 Arquivos existentes:`);
      maxSimilarity.files.forEach(file => console.log(`   - ${file}`));
    }
  } else {
    console.log(`✅ Módulo é único! Pode ser adicionado com segurança.`);
  }
  
  console.log('━'.repeat(60));
  
  return {
    duplicate: maxSimilarity.score >= SIMILARITY_THRESHOLD,
    similarity: maxSimilarity.score,
    match: maxSimilarity.score >= SIMILARITY_THRESHOLD ? maxSimilarity : undefined,
    recommendation,
    fingerprint,
    tokens,
  };
}

/**
 * Adiciona um novo módulo ao registro
 */
export function addModule(
  module: Omit<Module, 'createdAt' | 'lastModified' | 'fingerprint'>,
  tokens: string[]
): void {
  const registry = loadRegistry();
  
  const newModule: Module = {
    ...module,
    fingerprint: calculateFingerprint(tokens),
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };
  
  if (module.type === 'ui') {
    registry.components.push(newModule);
    console.log(`✅ Componente "${module.name}" adicionado ao registro!`);
  } else {
    registry.modules.push(newModule);
    console.log(`✅ Módulo "${module.name}" adicionado ao registro!`);
  }
  
  saveRegistry(registry);
}

/**
 * Atualiza um módulo existente
 */
export function updateModule(
  moduleId: string,
  updates: Partial<Module>,
  newTokens?: string[]
): void {
  const registry = loadRegistry();
  
  const moduleIndex = registry.modules.findIndex(m => m.id === moduleId);
  const componentIndex = registry.components.findIndex(c => c.id === moduleId);
  
  if (moduleIndex === -1 && componentIndex === -1) {
    throw new Error(`Módulo com ID "${moduleId}" não encontrado!`);
  }
  
  const targetArray = moduleIndex !== -1 ? registry.modules : registry.components;
  const targetIndex = moduleIndex !== -1 ? moduleIndex : componentIndex;
  
  const updated = {
    ...targetArray[targetIndex],
    ...updates,
    lastModified: new Date().toISOString(),
  };
  
  if (newTokens) {
    updated.fingerprint = calculateFingerprint(newTokens);
    updated.functionality = newTokens;
  }
  
  targetArray[targetIndex] = updated;
  
  console.log(`✅ Módulo "${updated.name}" atualizado!`);
  saveRegistry(registry);
}

/**
 * Lista todos os módulos registrados
 */
export function listModules(): void {
  const registry = loadRegistry();
  
  console.log('\n📦 MÓDULOS REGISTRADOS');
  console.log('━'.repeat(80));
  
  if (registry.modules.length === 0) {
    console.log('Nenhum módulo registrado.');
  } else {
    registry.modules.forEach((module, index) => {
      console.log(`\n${index + 1}. ${module.name} (${module.id})`);
      console.log(`   Tipo: ${module.type} | Categoria: ${module.category}`);
      console.log(`   Versão: ${module.version} | Complexidade: ${module.complexity}`);
      console.log(`   Status: ${module.status} | Fingerprint: ${module.fingerprint}`);
      console.log(`   Funcionalidades: ${module.functionality.slice(0, 5).join(', ')}${module.functionality.length > 5 ? '...' : ''}`);
      if (module.files && module.files.length > 0) {
        console.log(`   Arquivos: ${module.files.length} arquivo(s)`);
      }
    });
  }
  
  console.log('\n🧩 COMPONENTES REGISTRADOS');
  console.log('━'.repeat(80));
  
  if (registry.components.length === 0) {
    console.log('Nenhum componente registrado.');
  } else {
    registry.components.forEach((component, index) => {
      console.log(`\n${index + 1}. ${component.name} (${component.id})`);
      console.log(`   Reutilizável: ${component.reusable ? 'Sim' : 'Não'} | Complexidade: ${component.complexity}`);
      console.log(`   Fingerprint: ${component.fingerprint}`);
    });
  }
  
  console.log('\n📊 ESTATÍSTICAS');
  console.log('━'.repeat(80));
  console.log(`Total de Módulos: ${registry.metadata.totalModules}`);
  console.log(`Total de Componentes: ${registry.metadata.totalComponents}`);
  console.log(`Complexidade Média: ${registry.metadata.averageComplexity}`);
  console.log(`Saúde do Código: ${registry.metadata.codeHealth}`);
  console.log(`Última Validação: ${new Date(registry.metadata.lastValidation).toLocaleString('pt-BR')}`);
  console.log('━'.repeat(80) + '\n');
}

// ==================== EXPORT ====================

export default {
  validateNewModule,
  addModule,
  updateModule,
  listModules,
  loadRegistry,
  saveRegistry,
  extractTokens,
  calculateFingerprint,
  calculateSimilarity,
};
