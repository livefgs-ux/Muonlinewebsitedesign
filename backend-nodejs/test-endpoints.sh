#!/bin/bash
# Teste de endpoints após V.530

echo "====================================="
echo "TESTE DE ENDPOINTS - V.530"
echo "====================================="

# 1. Fazer login
echo -e "\n1️⃣ Login..."
LOGIN_RESPONSE=$(curl -s -X POST https://meumu.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"lorack","password":"123123"}')

echo "$LOGIN_RESPONSE" | jq '.'

# Extrair token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Erro: Token não recebido!"
  exit 1
fi

echo "✅ Token recebido: ${TOKEN:0:20}..."

# 2. Verificar token
echo -e "\n2️⃣ Verificando token (GET /api/auth/verify)..."
curl -s -X GET https://meumu.com/api/auth/verify \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 3. Obter informações da conta
echo -e "\n3️⃣ Obtendo informações da conta (GET /api/auth/account)..."
curl -s -X GET https://meumu.com/api/auth/account \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 4. Listar personagens
echo -e "\n4️⃣ Listando personagens (GET /api/characters)..."
curl -s -X GET https://meumu.com/api/characters \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 5. Pacotes WCoin
echo -e "\n5️⃣ Listando pacotes WCoin (GET /api/wcoin/packages)..."
curl -s -X GET https://meumu.com/api/wcoin/packages | jq '.'

echo -e "\n====================================="
echo "TESTES CONCLUÍDOS"
echo "====================================="
