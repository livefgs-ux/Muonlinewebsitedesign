/**
 * 🚀 EXEMPLOS DE USO DO SISTEMA DE VALIDAÇÃO
 * 
 * Este arquivo demonstra como usar o validador de módulos
 * no dia-a-dia do desenvolvimento.
 */

import validator from './module-validator';

// ==================== EXEMPLO 1: Validar Código Antes de Criar ====================

const exampleRankingCode = `
import { useState, useEffect } from 'react';
import { Card } from './ui/card';

export function RankingTable() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchRankings();
  }, []);
  
  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/rankings');
      const data = await response.json();
      setRankings(data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      {loading ? 'Loading...' : <div>{/* render rankings */}</div>}
    </Card>
  );
}
`;

// Valida antes de criar
const result = validator.validateNewModule(
  exampleRankingCode,
  'Ranking Table Component',
  'frontend',
  'Rankings'
);

console.log('\n📋 RESULTADO:');
console.log(`Duplicado: ${result.duplicate}`);
console.log(`Similaridade: ${result.similarity}%`);
console.log(`Recomendação: ${result.recommendation}`);

if (result.match) {
  console.log(`\n🎯 Match encontrado: ${result.match.name}`);
  console.log(`   Arquivos: ${result.match.files?.join(', ')}`);
}

// ==================== EXEMPLO 2: Adicionar Módulo ao Registro ====================

if (!result.duplicate || result.recommendation === 'create') {
  console.log('\n✅ Adicionando módulo ao registro...');
  
  validator.addModule({
    id: 'ranking_table_component',
    name: 'Ranking Table Component',
    type: 'frontend',
    category: 'Rankings',
    files: ['./src/app/components/ranking-table.tsx'],
    version: '1.0.0',
    complexity: 45,
    projects: ['MeuMU Online'],
    dependencies: ['react'],
    status: 'stable',
  }, result.tokens);
}

// ==================== EXEMPLO 3: Atualizar Módulo Existente ====================

// Quando você modificar um módulo existente:
const updatedCode = `
// ... código atualizado ...
`;

const updatedTokens = validator.extractTokens(updatedCode);

validator.updateModule(
  'authSystem', // ID do módulo
  {
    version: '1.1.0', // Nova versão
    complexity: 90, // Nova complexidade
    features: ['2FA support', 'OAuth login'], // Novas features
  },
  updatedTokens // Novos tokens
);

// ==================== EXEMPLO 4: Listar Todos os Módulos ====================

console.log('\n📦 LISTANDO TODOS OS MÓDULOS:');
validator.listModules();

// ==================== EXEMPLO 5: Workflow Completo ====================

async function addNewFeature(filePath: string, featureName: string) {
  console.log(`\n🚀 Adicionando nova feature: ${featureName}`);
  console.log('━'.repeat(60));
  
  // 1. Lê o código do arquivo
  const fs = await import('fs');
  const code = fs.readFileSync(filePath, 'utf-8');
  
  // 2. Valida
  const validation = validator.validateNewModule(code, featureName);
  
  // 3. Decide baseado no resultado
  if (validation.duplicate) {
    if (validation.similarity >= 70) {
      console.log('🚫 BLOQUEADO: Similaridade muito alta!');
      console.log(`   Use o módulo existente: ${validation.match?.name}`);
      return false;
    } else if (validation.similarity >= 40) {
      console.log('⚠️  ATENÇÃO: Similaridade moderada.');
      console.log(`   Considere versionar: ${validation.match?.name}`);
      // Aqui você pode pedir confirmação do usuário
    }
  }
  
  // 4. Adiciona ao registro
  const tokens = validator.extractTokens(code);
  validator.addModule({
    id: featureName.toLowerCase().replace(/\s+/g, '_'),
    name: featureName,
    type: 'frontend',
    category: 'Feature',
    files: [filePath],
    version: '1.0.0',
    complexity: Math.min(100, Math.round(code.split('\n').length / 10)),
    projects: ['MeuMU Online'],
    status: 'stable',
  }, tokens);
  
  console.log('✅ Feature adicionada com sucesso!');
  return true;
}

// ==================== EXEMPLO 6: CI/CD Hook ====================

/**
 * Hook para validar arquivos modificados em um PR
 */
async function validatePullRequest(changedFiles: string[]): Promise<boolean> {
  console.log('\n🔍 VALIDANDO PULL REQUEST');
  console.log('━'.repeat(60));
  
  let hasIssues = false;
  
  for (const file of changedFiles) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const fs = await import('fs');
      
      if (!fs.existsSync(file)) continue;
      
      const code = fs.readFileSync(file, 'utf-8');
      const fileName = file.split('/').pop()?.replace(/\.(tsx|ts)$/, '') || 'unknown';
      
      const result = validator.validateNewModule(code, fileName);
      
      if (result.similarity >= 70) {
        console.log(`\n❌ ${file}`);
        console.log(`   Similaridade ${result.similarity}% com "${result.match?.name}"`);
        console.log(`   Ação: Revisar ou reutilizar módulo existente`);
        hasIssues = true;
      } else if (result.similarity >= 40) {
        console.log(`\n⚠️  ${file}`);
        console.log(`   Similaridade ${result.similarity}% com "${result.match?.name}"`);
        console.log(`   Ação: Considerar versionamento`);
      } else {
        console.log(`\n✅ ${file} - OK`);
      }
    }
  }
  
  console.log('━'.repeat(60));
  
  if (hasIssues) {
    console.log('\n🚫 PR bloqueado: Corrija as duplicações antes de fazer merge.');
    return false;
  } else {
    console.log('\n✅ PR aprovado: Nenhuma duplicação crítica detectada.');
    return true;
  }
}

// Export para uso em outros arquivos
export {
  addNewFeature,
  validatePullRequest,
};
