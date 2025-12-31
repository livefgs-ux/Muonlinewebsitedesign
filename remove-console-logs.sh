#!/bin/bash

#######################################################################
# 🔒 V606 - SECURITY FIX: REMOVER TODOS CONSOLE.LOG
# 
# ❌ CRITICAL: 48+ console.log() vazando dados sensíveis
# ✅ SOLUÇÃO: Remover TODOS exceto console.error
#######################################################################

echo "🔒 V606 - Removendo console.log sensíveis..."
echo "════════════════════════════════════════════════════════════"

# Arquivos críticos (prioridade ALTA)
CRITICAL_FILES=(
  "src/app/App.tsx"
  "src/app/contexts/AuthContext.tsx"
  "src/app/components/login-section.tsx"
  "src/app/components/navigation.tsx"
  "src/app/components/admin-login.tsx"
)

# Comentar TODOS console.log/info/warn (mas NÃO console.error)
for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "🧹 Limpando: $file"
    
    # Comentar console.log (mas não console.error)
    sed -i.bak 's/console\.log(/\/\/ console.log(/g' "$file"
    sed -i.bak 's/console\.info(/\/\/ console.info(/g' "$file"
    sed -i.bak 's/console\.warn(/\/\/ console.warn(/g' "$file"
    sed -i.bak 's/console\.debug(/\/\/ console.debug(/g' "$file"
    
    echo "✅ $file limpo!"
  else
    echo "⚠️ Arquivo não encontrado: $file"
  fi
done

echo "════════════════════════════════════════════════════════════"
echo "✅ Limpeza concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Revisar arquivos modificados"
echo "2. Testar aplicação"
echo "3. Commit: 'V606: Security fix - Remove sensitive console.log'"
echo ""
echo "🔒 SEGURANÇA: Logs sensíveis removidos do production!"
