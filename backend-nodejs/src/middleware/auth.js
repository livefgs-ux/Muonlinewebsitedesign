/**
 * 🔧 WRAPPER DE COMPATIBILIDADE - AUTH MIDDLEWARE
 * 
 * Este arquivo é um wrapper criado automaticamente pelo install.sh
 * para garantir compatibilidade entre rotas e middleware.
 * 
 * PROBLEMA:
 * - Rotas esperam: const { requireAdmin } = require('../middleware/auth')
 * - Middleware exporta: { verifyToken, verifyAdmin, verifyTokenOptional }
 * 
 * SOLUÇÃO:
 * - Wrapper mapeia requireAdmin → verifyAdmin
 * - Mantém todos os exports originais
 * 
 * ⚠️ NÃO EDITE ESTE ARQUIVO MANUALMENTE!
 * Ele é regenerado automaticamente pelo instalador.
 */

const authMiddleware = require('./auth-middleware');

// ═══════════════════════════════════════════════════════════════
// EXPORTS COMPATÍVEIS
// ═══════════════════════════════════════════════════════════════

module.exports = {
  // ✅ Exports originais (mantém compatibilidade)
  verifyToken: authMiddleware.verifyToken,
  verifyAdmin: authMiddleware.verifyAdmin,
  verifyTokenOptional: authMiddleware.verifyTokenOptional,
  
  // ✅ Alias para compatibilidade com rotas antigas
  requireAdmin: authMiddleware.verifyAdmin,  // ← MAPEAMENTO CRÍTICO!
  
  // ✅ Alias adicionais (caso necessário)
  authenticate: authMiddleware.verifyToken,
  optionalAuth: authMiddleware.verifyTokenOptional
};
