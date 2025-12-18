#!/bin/bash
# ============================================================
# Script Helper - Download de Assets do Figma
# Usa a API do Figma para baixar as imagens automaticamente
# ============================================================

echo "==============================================="
echo "   📥 Download de Assets do Figma"
echo "==============================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# IDs dos assets do Figma
HERO_BG_ID="7c77bece727042bfc957b9adbcf34e1fa973fbec"
CHAR_EX_ID="0481c7d9f941d688b911f1c81a92c821fe1a50e8"

# Caminhos de destino
HERO_BG_PATH="public/assets/backgrounds/hero-background.png"
CHAR_EX_PATH="public/assets/images/character-example.png"

echo -e "${YELLOW}⚠️  AVISO: Este script requer acesso ao Figma${NC}"
echo ""
echo "Para usar este script, você precisa:"
echo "  1. Token de acesso do Figma (Personal Access Token)"
echo "  2. ID do arquivo Figma do projeto"
echo ""
echo "Como obter:"
echo "  • Token: https://www.figma.com/developers/api#access-tokens"
echo "  • File ID: URL do Figma (após 'file/')"
echo ""
read -p "Você tem essas informações? (s/n): " HAS_INFO

if [[ "$HAS_INFO" != "s" && "$HAS_INFO" != "S" ]]; then
    echo ""
    echo -e "${YELLOW}📖 Alternativa: Download Manual${NC}"
    echo ""
    echo "Siga estes passos:"
    echo ""
    echo "1. Abra o projeto no Figma"
    echo ""
    echo "2. Encontre os assets:"
    echo "   • Background: hash $HERO_BG_ID"
    echo "   • Character: hash $CHAR_EX_ID"
    echo ""
    echo "3. Selecione cada asset"
    echo ""
    echo "4. Painel direito → Export → PNG → @2x"
    echo ""
    echo "5. Salve como:"
    echo "   • $HERO_BG_PATH"
    echo "   • $CHAR_EX_PATH"
    echo ""
    echo "6. Execute: ./verify-assets.sh"
    echo ""
    exit 0
fi

# Solicitar Token do Figma
echo ""
read -p "Cole seu Figma Personal Access Token: " FIGMA_TOKEN
echo ""

if [ -z "$FIGMA_TOKEN" ]; then
    echo -e "${RED}❌ Token não pode estar vazio!${NC}"
    exit 1
fi

# Solicitar File ID
read -p "Cole o Figma File ID (da URL): " FIGMA_FILE_ID
echo ""

if [ -z "$FIGMA_FILE_ID" ]; then
    echo -e "${RED}❌ File ID não pode estar vazio!${NC}"
    exit 1
fi

# Criar pastas se não existirem
mkdir -p public/assets/backgrounds
mkdir -p public/assets/images

echo -e "${BLUE}📡 Conectando ao Figma...${NC}"
echo ""

# Função para baixar asset do Figma
download_asset() {
    local ASSET_ID=$1
    local OUTPUT_PATH=$2
    local ASSET_NAME=$3
    
    echo -e "${YELLOW}📥 Baixando: $ASSET_NAME...${NC}"
    
    # Fazer request para API do Figma para obter URL da imagem
    RESPONSE=$(curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
        "https://api.figma.com/v1/images/$FIGMA_FILE_ID?ids=$ASSET_ID&format=png&scale=2")
    
    # Verificar se houve erro
    if echo "$RESPONSE" | grep -q '"err":'; then
        echo -e "${RED}❌ Erro ao obter URL da imagem${NC}"
        echo "Resposta da API: $RESPONSE"
        return 1
    fi
    
    # Extrair URL da imagem
    IMAGE_URL=$(echo "$RESPONSE" | grep -o '"'$ASSET_ID'":"[^"]*"' | cut -d'"' -f4)
    
    if [ -z "$IMAGE_URL" ]; then
        echo -e "${RED}❌ Não foi possível obter URL da imagem${NC}"
        echo "Resposta da API: $RESPONSE"
        return 1
    fi
    
    # Baixar imagem
    curl -s -L "$IMAGE_URL" -o "$OUTPUT_PATH"
    
    if [ -f "$OUTPUT_PATH" ]; then
        SIZE=$(du -h "$OUTPUT_PATH" | cut -f1)
        echo -e "${GREEN}✅ Baixado: $OUTPUT_PATH ($SIZE)${NC}"
        return 0
    else
        echo -e "${RED}❌ Falha ao baixar imagem${NC}"
        return 1
    fi
}

# Baixar background principal
echo -e "${BLUE}[1/2] Background Principal${NC}"
if download_asset "$HERO_BG_ID" "$HERO_BG_PATH" "hero-background.png"; then
    BG_SUCCESS=true
else
    BG_SUCCESS=false
fi
echo ""

# Baixar exemplo de personagem
echo -e "${BLUE}[2/2] Exemplo de Personagem${NC}"
if download_asset "$CHAR_EX_ID" "$CHAR_EX_PATH" "character-example.png"; then
    CHAR_SUCCESS=true
else
    CHAR_SUCCESS=false
fi
echo ""

# Resumo
echo "==============================================="
echo "           📊 RESUMO DO DOWNLOAD"
echo "==============================================="
echo ""

if [ "$BG_SUCCESS" = true ] && [ "$CHAR_SUCCESS" = true ]; then
    echo -e "${GREEN}✅ Todos os assets baixados com sucesso!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "  1. Verificar assets: ./verify-assets.sh"
    echo "  2. Instalar projeto: ./install.sh"
    echo "  3. Testar: npm run dev"
elif [ "$BG_SUCCESS" = true ]; then
    echo -e "${YELLOW}⚠️  Background baixado, mas character example falhou${NC}"
    echo ""
    echo "O site funcionará, mas a imagem de personagem não aparecerá."
    echo "Você pode adicionar manualmente depois."
else
    echo -e "${RED}❌ Falha ao baixar os assets${NC}"
    echo ""
    echo "Possíveis causas:"
    echo "  • Token inválido ou expirado"
    echo "  • File ID incorreto"
    echo "  • Asset IDs não correspondem ao arquivo"
    echo "  • Sem permissão para acessar o arquivo"
    echo ""
    echo "Tente o download manual (veja instruções acima)"
fi

echo ""
echo "==============================================="
