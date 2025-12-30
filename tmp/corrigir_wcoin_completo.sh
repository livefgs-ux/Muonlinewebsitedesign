#!/bin/bash
# Script para corrigir TODAS as ocorrências restantes de token no WCoinPackagesSection.tsx

FILE="/src/app/components/admincp/sections/WCoinPackagesSection.tsx"

echo "🔧 Corrigindo tokens no $FILE..."

# handleUpdate
sed -i 's/const token = localStorage.getItem('\''admin_token'\'');/const token = sessionStorage.getItem('\''auth_token'\'') || localStorage.getItem('\''admin_token'\'');\n      if (!token) throw new Error('\''Token não encontrado'\'');/g' "$FILE"

# handleDelete
sed -i '200s/const token = localStorage.getItem('\''admin_token'\'');/const token = sessionStorage.getItem('\''auth_token'\'') || localStorage.getItem('\''admin_token'\'');\n      if (!token) throw new Error('\''Token não encontrado'\'');/' "$FILE"

# handlePermanentDelete  
sed -i '228s/const token = localStorage.getItem('\''admin_token'\'');/const token = sessionStorage.getItem('\''auth_token'\'') || localStorage.getItem('\''admin_token'\'');\n      if (!token) throw new Error('\''Token não encontrado'\'');/' "$FILE"

# toggleActive
sed -i '254s/const token = localStorage.getItem('\''admin_token'\'');/const token = sessionStorage.getItem('\''auth_token'\'') || localStorage.getItem('\''admin_token'\'');\n      if (!token) throw new Error('\''Token não encontrado'\'');/' "$FILE"

echo "✅ Corrigido!"
