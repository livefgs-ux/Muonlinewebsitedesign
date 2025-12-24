#!/bin/bash

# ═══════════════════════════════════════════════════════════════
#  SETUP GIT HOOKS
#  Instala hooks de segurança no repositório Git
# ═══════════════════════════════════════════════════════════════

echo "🔧 Configurando Git Hooks de Segurança..."
echo ""

# Verificar se estamos em um repositório Git
if [ ! -d ".git" ]; then
    echo "❌ ERRO: Este não é um repositório Git"
    echo "   Execute este script da raiz do repositório"
    exit 1
fi

# Criar diretório de hooks se não existir
mkdir -p .git/hooks

# Copiar pre-commit hook
echo "📋 Instalando pre-commit hook..."
cp .git-hooks/pre-commit .git/hooks/pre-commit

# Dar permissão de execução
chmod +x .git/hooks/pre-commit

# Testar o hook
echo ""
echo "🧪 Testando hook..."
echo ""

if [ -f ".git/hooks/pre-commit" ] && [ -x ".git/hooks/pre-commit" ]; then
    echo "✅ Pre-commit hook instalado com sucesso!"
    echo ""
    echo "📊 Status:"
    echo "   Localização: .git/hooks/pre-commit"
    echo "   Permissões: $(ls -l .git/hooks/pre-commit | awk '{print $1}')"
    echo ""
    echo "🔒 PROTEÇÕES ATIVAS:"
    echo "   ✓ Detecção de senhas hardcoded"
    echo "   ✓ Detecção de API keys (OpenAI, Stripe, etc)"
    echo "   ✓ Detecção de JWT secrets"
    echo "   ✓ Detecção de credenciais de banco"
    echo "   ✓ Detecção de tokens"
    echo "   ✓ Bloqueio de arquivos .env"
    echo "   ✓ Detecção de private keys"
    echo ""
    echo "✅ Seu repositório agora está protegido!"
    echo "   Commits com secrets serão bloqueados automaticamente"
    echo ""
else
    echo "❌ ERRO: Falha ao instalar hook"
    exit 1
fi
