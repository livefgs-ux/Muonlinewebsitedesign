/**
 * 🔒 ENVIRONMENT VARIABLES VALIDATOR
 * Baseado em "Safe Vibe Coding" best practices
 * 
 * Valida variáveis de ambiente obrigatórias no startup
 * Previne erros de configuração em produção
 */

const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════
// VARIÁVEIS OBRIGATÓRIAS
// ═══════════════════════════════════════════════════════════════

const REQUIRED_ENV_VARS = [
  // Autenticação
  { name: 'JWT_SECRET', minLength: 32, description: 'Secret key para JWT' },
  
  // Database MU Online (readonly)
  { name: 'DB_HOST', description: 'Host do banco de dados' },
  { name: 'DB_USER', description: 'Usuário do banco de dados' },
  { name: 'DB_PASSWORD', minLength: 6, description: 'Senha do banco de dados' },
  { name: 'DB_NAME_MUONLINE', description: 'Nome do database do servidor MU' },
  
  // Database WebMU (read/write)
  { name: 'DB_NAME_WEBMU', description: 'Nome do database do site' },
  
  // Servidor
  { name: 'PORT', type: 'number', description: 'Porta do servidor' }
];

// Variáveis opcionais mas recomendadas
const OPTIONAL_ENV_VARS = [
  'NODE_ENV',
  'ALLOWED_ORIGINS',
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX_REQUESTS',
  'SESSION_SECRET',
  'SECURITY_ALERT_EMAIL'
];

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES DE VALIDAÇÃO
// ═══════════════════════════════════════════════════════════════

/**
 * Validar uma única variável de ambiente
 */
const validateEnvVar = (config) => {
  const { name, minLength, type, description } = config;
  const value = process.env[name];
  
  const errors = [];
  
  // Verificar se existe
  if (!value) {
    errors.push({
      variable: name,
      error: 'Variável ausente',
      description,
      severity: 'CRITICAL'
    });
    return errors;
  }
  
  // Verificar tamanho mínimo
  if (minLength && value.length < minLength) {
    errors.push({
      variable: name,
      error: `Muito curto (mínimo ${minLength} caracteres, atual ${value.length})`,
      description,
      severity: 'HIGH'
    });
  }
  
  // Verificar tipo
  if (type === 'number' && isNaN(Number(value))) {
    errors.push({
      variable: name,
      error: 'Deve ser um número',
      description,
      severity: 'HIGH'
    });
  }
  
  return errors;
};

/**
 * Validar força do JWT_SECRET
 */
const validateJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  const warnings = [];
  
  if (!secret) return warnings;
  
  // Verificar entropia (aleatoriedade)
  const entropy = crypto.createHash('sha256').update(secret).digest('hex');
  
  // Verificar se não é um padrão comum
  const commonPatterns = [
    'secret',
    'password',
    '123456',
    'qwerty',
    'default',
    'changeme',
    'test'
  ];
  
  const lowerSecret = secret.toLowerCase();
  commonPatterns.forEach(pattern => {
    if (lowerSecret.includes(pattern)) {
      warnings.push({
        variable: 'JWT_SECRET',
        error: `Contém padrão comum: "${pattern}"`,
        description: 'Use um secret verdadeiramente aleatório',
        severity: 'MEDIUM'
      });
    }
  });
  
  // Verificar se é apenas números
  if (/^\d+$/.test(secret)) {
    warnings.push({
      variable: 'JWT_SECRET',
      error: 'Secret composto apenas de números',
      description: 'Use combinação de letras, números e símbolos',
      severity: 'MEDIUM'
    });
  }
  
  // Verificar se é apenas letras
  if (/^[a-zA-Z]+$/.test(secret)) {
    warnings.push({
      variable: 'JWT_SECRET',
      error: 'Secret composto apenas de letras',
      description: 'Use combinação de letras, números e símbolos',
      severity: 'MEDIUM'
    });
  }
  
  return warnings;
};

/**
 * Gerar sugestão de JWT_SECRET seguro
 */
const generateSecureSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Validar configuração de ambiente em produção
 */
const validateProduction = () => {
  const errors = [];
  
  if (process.env.NODE_ENV === 'production') {
    // Verificar se DEBUG está desabilitado
    if (process.env.DEBUG === 'true') {
      errors.push({
        variable: 'DEBUG',
        error: 'Debug mode ativado em produção!',
        description: 'Desabilite debug mode em produção',
        severity: 'CRITICAL'
      });
    }
    
    // Verificar se tem HTTPS
    if (!process.env.FORCE_HTTPS && process.env.FORCE_HTTPS !== 'true') {
      errors.push({
        variable: 'FORCE_HTTPS',
        error: 'HTTPS não está forçado',
        description: 'Sempre use HTTPS em produção',
        severity: 'HIGH'
      });
    }
    
    // Verificar se tem rate limiting configurado
    if (!process.env.RATE_LIMIT_MAX_REQUESTS) {
      errors.push({
        variable: 'RATE_LIMIT_MAX_REQUESTS',
        error: 'Rate limiting não configurado',
        description: 'Configure rate limiting para proteção',
        severity: 'MEDIUM'
      });
    }
  }
  
  return errors;
};

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════════

/**
 * Validar todas as variáveis de ambiente
 * Bloqueia startup se houver erros críticos
 */
const validateEnv = () => {
  console.log('🔍 Validando variáveis de ambiente...');
  console.log('════════════════════════════════════════════════════════════════');
  
  const allErrors = [];
  const allWarnings = [];
  
  // Validar variáveis obrigatórias
  REQUIRED_ENV_VARS.forEach(config => {
    const errors = validateEnvVar(config);
    allErrors.push(...errors);
  });
  
  // Validar JWT_SECRET
  const jwtWarnings = validateJwtSecret();
  allWarnings.push(...jwtWarnings);
  
  // Validar configuração de produção
  const prodErrors = validateProduction();
  allErrors.push(...prodErrors);
  
  // Verificar variáveis opcionais
  const missingOptional = OPTIONAL_ENV_VARS.filter(name => !process.env[name]);
  
  // ─────────────────────────────────────────────────────────────
  // EXIBIR ERROS CRÍTICOS
  // ─────────────────────────────────────────────────────────────
  
  const criticalErrors = allErrors.filter(e => e.severity === 'CRITICAL');
  const highErrors = allErrors.filter(e => e.severity === 'HIGH');
  const mediumErrors = allErrors.filter(e => e.severity === 'MEDIUM');
  
  if (criticalErrors.length > 0) {
    console.log('\n❌ ERROS CRÍTICOS (STARTUP BLOQUEADO):');
    criticalErrors.forEach(err => {
      console.log(`\n   ${err.variable}:`);
      console.log(`   ├─ Erro: ${err.error}`);
      console.log(`   └─ ${err.description}`);
    });
  }
  
  if (highErrors.length > 0) {
    console.log('\n⚠️  ERROS DE ALTA PRIORIDADE:');
    highErrors.forEach(err => {
      console.log(`\n   ${err.variable}:`);
      console.log(`   ├─ Erro: ${err.error}`);
      console.log(`   └─ ${err.description}`);
    });
  }
  
  // ─────────────────────────────────────────────────────────────
  // EXIBIR WARNINGS
  // ─────────────────────────────────────────────────────────────
  
  if (allWarnings.length > 0) {
    console.log('\n⚡ AVISOS DE SEGURANÇA:');
    allWarnings.forEach(warn => {
      console.log(`\n   ${warn.variable}:`);
      console.log(`   ├─ Aviso: ${warn.error}`);
      console.log(`   └─ ${warn.description}`);
    });
  }
  
  if (mediumErrors.length > 0) {
    console.log('\n💡 RECOMENDAÇÕES:');
    mediumErrors.forEach(err => {
      console.log(`\n   ${err.variable}:`);
      console.log(`   ├─ ${err.error}`);
      console.log(`   └─ ${err.description}`);
    });
  }
  
  // ─────────────────────────────────────────────────────────────
  // VARIÁVEIS OPCIONAIS
  // ─────────────────────────────────────────────────────────────
  
  if (missingOptional.length > 0) {
    console.log('\n📋 Variáveis opcionais ausentes (recomendadas):');
    missingOptional.forEach(name => {
      console.log(`   • ${name}`);
    });
  }
  
  // ─────────────────────────────────────────────────────────────
  // DECISÃO FINAL
  // ─────────────────────────────────────────────────────────────
  
  console.log('\n════════════════════════════════════════════════════════════════');
  
  if (criticalErrors.length > 0 || highErrors.length > 0) {
    console.log('\n❌ VALIDAÇÃO FALHOU!');
    console.log('\n📝 AÇÕES NECESSÁRIAS:\n');
    console.log('   1. Configure as variáveis ausentes no arquivo .env');
    console.log('   2. Use .env.example como template');
    console.log('   3. Reinicie o servidor após configurar');
    
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      console.log('\n💡 SUGESTÃO DE JWT_SECRET SEGURO:');
      console.log(`\n   JWT_SECRET=${generateSecureSecret()}\n`);
    }
    
    console.log('════════════════════════════════════════════════════════════════\n');
    process.exit(1);
  }
  
  // Sucesso!
  console.log('\n✅ Todas as variáveis de ambiente validadas com sucesso!');
  
  if (allWarnings.length > 0 || mediumErrors.length > 0) {
    console.log('⚡ Existem avisos - revise quando possível');
  }
  
  console.log('════════════════════════════════════════════════════════════════\n');
};

// ═══════════════════════════════════════════════════════════════
// EXPORTAR
// ═══════════════════════════════════════════════════════════════

module.exports = {
  validateEnv,
  generateSecureSecret
};
