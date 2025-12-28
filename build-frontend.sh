#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - BUILD DO FRONTEND
# ═══════════════════════════════════════════════════════════════

set -e  # Parar em caso de erro

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

BASE_DIR="/home/meumu.com/public_html"

echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}       🏗️  BUILD DO FRONTEND - MEUMU ONLINE${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo ""

# 1. Verificar se estamos no diretório correto
if [ ! -f "$BASE_DIR/package.json" ]; then
    echo -e "${RED}❌ ERRO: package.json não encontrado!${NC}"
    echo -e "${YELLOW}   Diretório atual: $(pwd)${NC}"
    echo -e "${YELLOW}   Esperado: $BASE_DIR${NC}"
    exit 1
fi

cd "$BASE_DIR"

# 2. Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules não encontrado! Instalando dependências...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
    echo ""
fi

# 3. Backup do dist antigo (se existir)
if [ -d "dist" ]; then
    BACKUP_NAME="dist.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${YELLOW}⚠️  Fazendo backup: $BACKUP_NAME${NC}"
    mv dist "$BACKUP_NAME"
    echo ""
fi

# 4. Verificar .env do frontend
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Criando .env do frontend...${NC}"
    cat > .env << 'EOF'
# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - CONFIGURAÇÃO DO FRONTEND (HTTPS)
# ═══════════════════════════════════════════════════════════════

# URL da API Backend (através do proxy OpenLiteSpeed)
# ⚠️  IMPORTANTE: Usar URL RELATIVA para funcionar com HTTPS!
# 
# ✅ CORRETO: /api (URL relativa - usa protocolo do site)
# ❌ ERRADO: http://meumu.com:3001/api (Mixed Content!)
# 
# Com URL relativa (/api):
# - Navegador usa HTTPS automaticamente
# - OpenLiteSpeed proxy redireciona para porta 3001
# - Sem erro de Mixed Content
# - Cadeado verde no navegador
#
VITE_API_URL=/api
EOF
    echo -e "${GREEN}✅ .env criado${NC}"
    echo ""
fi

# 5. BUILDAR
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}🔨 INICIANDO BUILD...${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}⏳ Isso pode levar alguns minutos, aguarde...${NC}"
echo ""

if npm run build; then
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅✅✅ BUILD CONCLUÍDO COM SUCESSO! ✅✅✅${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # 6. Verificar arquivos gerados
    echo -e "${CYAN}📁 Arquivos gerados em dist/:${NC}"
    echo ""
    ls -lh dist/
    echo ""
    
    if [ -d "dist/assets" ]; then
        echo -e "${CYAN}📁 Arquivos em dist/assets/:${NC}"
        echo ""
        ls -lh dist/assets/
        echo ""
    fi
    
    # 7. Ajustar permissões
    echo -e "${YELLOW}🔐 Ajustando permissões...${NC}"
    chmod -R 755 dist/
    find dist/ -type f -exec chmod 644 {} \;
    echo -e "${GREEN}✅ Permissões ajustadas (755 para pastas, 644 para arquivos)${NC}"
    echo ""
    
    # 8. Verificar tamanho dos arquivos
    if [ -f "dist/assets/index-"*.js ]; then
        JS_SIZE=$(ls -lh dist/assets/index-*.js | awk '{print $5}')
        echo -e "${CYAN}📊 JavaScript bundle: $JS_SIZE${NC}"
    fi
    
    if [ -f "dist/assets/index-"*.css ]; then
        CSS_SIZE=$(ls -lh dist/assets/index-*.css | awk '{print $5}')
        echo -e "${CYAN}📊 CSS bundle: $CSS_SIZE${NC}"
    fi
    echo ""
    
    # 9. Mostrar próximos passos
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}📋 PRÓXIMOS PASSOS:${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}1) Configurar servidor web para servir pasta dist/${NC}"
    echo -e "${CYAN}   - CyberPanel → Websites → meumu.com${NC}"
    echo -e "${CYAN}   - Document Root: /home/meumu.com/public_html/dist${NC}"
    echo ""
    echo -e "${YELLOW}2) Acessar site no navegador:${NC}"
    echo -e "${CYAN}   - https://meumu.com/${NC}"
    echo ""
    echo -e "${YELLOW}3) Verificar console do navegador (F12):${NC}"
    echo -e "${CYAN}   - DEVE estar LIMPO (sem erros)${NC}"
    echo -e "${CYAN}   - Se aparecer erro 'missing )', o build NÃO foi aplicado${NC}"
    echo ""
    echo -e "${YELLOW}4) Testar funcionalidades:${NC}"
    echo -e "${CYAN}   - Login/Cadastro${NC}"
    echo -e "${CYAN}   - Rankings${NC}"
    echo -e "${CYAN}   - Eventos${NC}"
    echo ""
    
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ BUILD FINALIZADO!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    
else
    echo ""
    echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}❌ ERRO AO BUILDAR FRONTEND!${NC}"
    echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}Verifique os erros acima.${NC}"
    echo ""
    echo -e "${YELLOW}Erros comuns:${NC}"
    echo -e "${CYAN}1) Falta de memória RAM (build precisa ~2GB)${NC}"
    echo -e "${CYAN}2) Erro de sintaxe em algum arquivo .tsx${NC}"
    echo -e "${CYAN}3) Dependência faltando (execute: npm install)${NC}"
    echo ""
    exit 1
fi
