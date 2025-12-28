#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# SOLUÇÃO DEFINITIVA - RESOLVER MIME TYPE DE UMA VEZ
# ═══════════════════════════════════════════════════════════════

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
echo -e "${RED}  🔥 SOLUÇÃO DEFINITIVA - CHEGA DE MIME TYPE! 🔥${NC}"
echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
echo ""

BASE_DIR="/home/meumu.com/public_html"

# ═══════════════════════════════════════════════════════════════
# ETAPA 1: VERIFICAR SE DIST JÁ EXISTE
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[1/5]${NC} Verificando se dist/ existe..."
echo ""

if [ -d "$BASE_DIR/dist" ]; then
    echo -e "${GREEN}✅ dist/ JÁ EXISTE!${NC}"
    echo ""
    echo -e "${CYAN}Conteúdo de dist/:${NC}"
    ls -lha "$BASE_DIR/dist/"
    echo ""
    
    if [ -f "$BASE_DIR/dist/index.html" ]; then
        echo -e "${GREEN}✅ index.html existe em dist/!${NC}"
        echo ""
        echo -e "${CYAN}Conteúdo de index.html:${NC}"
        head -20 "$BASE_DIR/dist/index.html"
        echo ""
    else
        echo -e "${RED}❌ index.html NÃO EXISTE em dist/!${NC}"
        echo -e "${YELLOW}   O build está INCOMPLETO!${NC}"
    fi
    
    if [ -d "$BASE_DIR/dist/assets" ]; then
        echo -e "${GREEN}✅ pasta assets/ existe!${NC}"
        echo ""
        echo -e "${CYAN}Arquivos em assets/:${NC}"
        ls -lha "$BASE_DIR/dist/assets/"
        echo ""
    else
        echo -e "${RED}❌ pasta assets/ NÃO EXISTE!${NC}"
    fi
else
    echo -e "${RED}❌ dist/ NÃO EXISTE!${NC}"
    echo -e "${YELLOW}   Você disse que já buildou 100 vezes...${NC}"
    echo -e "${YELLOW}   Então o problema é que o build FALHA silenciosamente!${NC}"
    echo ""
fi

# ═══════════════════════════════════════════════════════════════
# ETAPA 2: FORÇAR BUILD DO ZERO (SEM CACHE)
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[2/5]${NC} Forçando build LIMPO (sem cache)..."
echo ""

cd "$BASE_DIR"

# Deletar TUDO relacionado a cache
echo -e "${CYAN}Limpando cache...${NC}"
rm -rf dist/ 2>/dev/null || true
rm -rf .vite/ 2>/dev/null || true
rm -rf node_modules/.vite/ 2>/dev/null || true

echo -e "${GREEN}✅ Cache limpo!${NC}"
echo ""

# Buildar com verbose
echo -e "${CYAN}Buildando com output verbose...${NC}"
echo ""

if npm run build 2>&1 | tee /tmp/build-output.log; then
    echo ""
    echo -e "${GREEN}✅ Build completou SEM ERRO!${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ BUILD FALHOU!${NC}"
    echo ""
    echo -e "${YELLOW}Log completo salvo em: /tmp/build-output.log${NC}"
    echo ""
    echo -e "${CYAN}Últimas 30 linhas do erro:${NC}"
    tail -30 /tmp/build-output.log
    echo ""
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
# ETAPA 3: VERIFICAR SE DIST FOI CRIADO
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[3/5]${NC} Verificando se dist/ foi criado..."
echo ""

if [ ! -d "$BASE_DIR/dist" ]; then
    echo -e "${RED}❌ ERRO CRÍTICO: dist/ NÃO FOI CRIADO!${NC}"
    echo ""
    echo -e "${YELLOW}Isso significa que o build falhou mas não mostrou erro.${NC}"
    echo -e "${YELLOW}Verifique: /tmp/build-output.log${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ dist/ foi criado!${NC}"
echo ""

# Verificar conteúdo
echo -e "${CYAN}Conteúdo de dist/:${NC}"
ls -lha "$BASE_DIR/dist/"
echo ""

if [ ! -f "$BASE_DIR/dist/index.html" ]; then
    echo -e "${RED}❌ ERRO: index.html NÃO existe!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ index.html existe!${NC}"
echo ""

if [ ! -d "$BASE_DIR/dist/assets" ]; then
    echo -e "${RED}❌ ERRO: pasta assets/ NÃO existe!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ pasta assets/ existe!${NC}"
echo ""

echo -e "${CYAN}Arquivos em assets/:${NC}"
ls -lha "$BASE_DIR/dist/assets/"
echo ""

# ═══════════════════════════════════════════════════════════════
# ETAPA 4: VERIFICAR O QUE index.html ESTÁ IMPORTANDO
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[4/5]${NC} Verificando imports no index.html..."
echo ""

echo -e "${CYAN}Conteúdo de dist/index.html:${NC}"
cat "$BASE_DIR/dist/index.html"
echo ""

# Verificar se está importando arquivos corretos
if grep -q "/assets/index-.*\.js" "$BASE_DIR/dist/index.html"; then
    echo -e "${GREEN}✅ index.html importa JavaScript compilado!${NC}"
    
    # Extrair nome do arquivo
    JS_FILE=$(grep -o '/assets/index-[a-zA-Z0-9]*\.js' "$BASE_DIR/dist/index.html" | head -1)
    echo -e "${CYAN}   Arquivo: $JS_FILE${NC}"
    
    # Verificar se arquivo existe
    if [ -f "$BASE_DIR/dist$JS_FILE" ]; then
        echo -e "${GREEN}   ✅ Arquivo existe!${NC}"
        FILE_SIZE=$(stat -f%z "$BASE_DIR/dist$JS_FILE" 2>/dev/null || stat -c%s "$BASE_DIR/dist$JS_FILE")
        echo -e "${CYAN}   Tamanho: $FILE_SIZE bytes${NC}"
    else
        echo -e "${RED}   ❌ Arquivo NÃO EXISTE!${NC}"
    fi
else
    echo -e "${RED}❌ index.html NÃO importa arquivos corretos!${NC}"
    echo -e "${YELLOW}   Isso é muito estranho...${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# ETAPA 5: CONFIGURAR SERVIDOR PARA SERVIR dist/
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[5/5]${NC} Configurando servidor para servir dist/..."
echo ""

echo -e "${CYAN}O problema REAL é que o servidor está servindo a pasta ERRADA!${NC}"
echo ""
echo -e "${YELLOW}Você precisa fazer UMA das opções abaixo:${NC}"
echo ""

echo -e "${BOLD}OPÇÃO A: CyberPanel (Interface Gráfica)${NC}"
echo -e "${CYAN}1. Acesse: https://meumu.com:8090${NC}"
echo -e "${CYAN}2. Websites → meumu.com → Manage${NC}"
echo -e "${CYAN}3. Document Root → MUDAR PARA: /home/meumu.com/public_html/dist${NC}"
echo -e "${CYAN}4. Salvar${NC}"
echo -e "${CYAN}5. Restart LiteSpeed${NC}"
echo ""

echo -e "${BOLD}OPÇÃO B: Linha de Comando (EXPERIMENTAL)${NC}"
echo ""

# Verificar se o vhost do LiteSpeed existe
VHOST_CONF="/usr/local/lsws/conf/vhosts/meumu.com/vhconf.conf"

if [ -f "$VHOST_CONF" ]; then
    echo -e "${GREEN}✅ Arquivo vHost encontrado: $VHOST_CONF${NC}"
    echo ""
    
    echo -e "${YELLOW}Deseja que EU tente alterar automaticamente? (S/n): ${NC}"
    read -r RESPOSTA
    
    if [[ "$RESPOSTA" =~ ^[Ss]$ ]]; then
        echo -e "${CYAN}Fazendo backup do vHost...${NC}"
        sudo cp "$VHOST_CONF" "${VHOST_CONF}.backup.$(date +%Y%m%d_%H%M%S)"
        
        echo -e "${CYAN}Alterando document root...${NC}"
        sudo sed -i 's|vhRoot.*$|vhRoot                  /home/meumu.com/public_html/dist|g' "$VHOST_CONF"
        sudo sed -i 's|docRoot.*$|docRoot                  /home/meumu.com/public_html/dist|g' "$VHOST_CONF"
        
        echo -e "${GREEN}✅ vHost alterado!${NC}"
        echo ""
        
        echo -e "${CYAN}Reiniciando LiteSpeed...${NC}"
        sudo /usr/local/lsws/bin/lswsctrl restart
        
        echo -e "${GREEN}✅ LiteSpeed reiniciado!${NC}"
        echo ""
    else
        echo -e "${YELLOW}❌ Alteração cancelada. Configure manualmente via CyberPanel.${NC}"
    fi
else
    echo -e "${RED}❌ Arquivo vHost não encontrado em: $VHOST_CONF${NC}"
    echo -e "${YELLOW}   Configure manualmente via CyberPanel (Opção A).${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════════════════

echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ BUILD CONCLUÍDO!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BOLD}${CYAN}📋 CHECKLIST:${NC}"
echo ""
echo -e "☑ Build executado"
echo -e "☑ dist/ criado"
echo -e "☑ index.html existe"
echo -e "☑ assets/ existe"
echo ""

echo -e "${BOLD}${YELLOW}⚠️  PRÓXIMO PASSO OBRIGATÓRIO:${NC}"
echo ""
echo -e "${CYAN}1. Configure Document Root para: /home/meumu.com/public_html/dist${NC}"
echo -e "${CYAN}2. Reinicie LiteSpeed${NC}"
echo -e "${CYAN}3. Acesse: https://meumu.com/${NC}"
echo -e "${CYAN}4. Abra Console (F12) → DEVE ESTAR LIMPO!${NC}"
echo ""

echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🎉 FIM!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
