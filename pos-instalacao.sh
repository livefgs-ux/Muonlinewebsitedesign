#!/bin/bash

#═══════════════════════════════════════════════════════════════════
# MeuMU Online - Script Pós-Instalação
# Execute APÓS concluir o instalador PHP
# 
# @version 2.0.1
# @author MeuMU Team
#═══════════════════════════════════════════════════════════════════

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

clear
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║          🎮 MeuMU Online - Pós-Instalação 🎮                 ║"
echo "║                  Season 19-2-3 Épico                         ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Verificar se está na raiz
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto!${NC}"
    exit 1
fi

# Verificar se instalador foi executado
if [ ! -f "config.php" ]; then
    echo -e "${RED}❌ Erro: Arquivo config.php não encontrado!${NC}"
    echo -e "${YELLOW}Execute o instalador PHP primeiro: http://seudominio.com/install${NC}"
    exit 1
fi

if [ ! -f "backend-nodejs/.env" ]; then
    echo -e "${RED}❌ Erro: Arquivo .env não encontrado no backend!${NC}"
    echo -e "${YELLOW}Execute o instalador PHP primeiro: http://seudominio.com/install${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Arquivos de configuração encontrados!${NC}"
echo ""

# PASSO 1: BUILD FRONTEND
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 1/3: Buildar Frontend React                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}📦 Instalando dependências do frontend...${NC}"
npm install
echo -e "${GREEN}✅ Dependências instaladas!${NC}"
echo ""

echo -e "${YELLOW}🔨 Buildando para produção...${NC}"
npm run build
echo -e "${GREEN}✅ Build concluído! Pasta /dist criada.${NC}"
echo ""

# PASSO 2: BACKEND
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 2/3: Configurar Backend Node.js                      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}📦 Instalando dependências do backend...${NC}"
cd backend-nodejs
npm install
cd ..
echo -e "${GREEN}✅ Dependências do backend instaladas!${NC}"
echo ""

echo -e "${YELLOW}Como deseja iniciar o backend?${NC}"
echo "1) PM2 (Recomendado - reinicia automaticamente)"
echo "2) Node Standalone (simples, precisa manter terminal aberto)"
echo "3) Não iniciar agora (vou fazer manualmente depois)"
echo ""
read -p "Opção (1-3): " BACKEND_OPTION

case $BACKEND_OPTION in
    1)
        # PM2
        if ! command -v pm2 &> /dev/null; then
            echo ""
            echo -e "${YELLOW}PM2 não instalado. Instalando...${NC}"
            npm install -g pm2
        fi
        
        echo ""
        echo -e "${YELLOW}🚀 Iniciando backend com PM2...${NC}"
        cd backend-nodejs
        pm2 delete meumu-backend 2>/dev/null || true
        pm2 start src/server.js --name meumu-backend
        pm2 save
        cd ..
        
        echo ""
        echo -e "${GREEN}✅ Backend iniciado com PM2!${NC}"
        echo ""
        echo -e "${BLUE}Comandos úteis:${NC}"
        echo "  pm2 status           # Ver status"
        echo "  pm2 logs meumu-backend  # Ver logs"
        echo "  pm2 restart meumu-backend  # Reiniciar"
        echo "  pm2 stop meumu-backend     # Parar"
        echo ""
        ;;
    2)
        # Node standalone
        echo ""
        echo -e "${GREEN}✅ Backend configurado!${NC}"
        echo ""
        echo -e "${YELLOW}Para iniciar o backend, execute:${NC}"
        echo -e "${BLUE}cd backend-nodejs && npm start${NC}"
        echo ""
        echo -e "${RED}⚠️  O terminal precisa ficar aberto!${NC}"
        echo ""
        ;;
    3)
        echo ""
        echo -e "${GREEN}✅ Backend configurado!${NC}"
        echo ""
        echo -e "${YELLOW}Para iniciar o backend manualmente:${NC}"
        echo -e "${BLUE}cd backend-nodejs && npm start${NC}"
        echo ""
        ;;
    *)
        echo -e "${RED}Opção inválida! Pulando...${NC}"
        ;;
esac

# PASSO 3: SERVIDOR WEB
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PASSO 3/3: Configurar Servidor Web                         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}⚠️  ATENÇÃO: Configure seu servidor web MANUALMENTE!${NC}"
echo ""
echo -e "${BLUE}Apache:${NC}"
echo "  DocumentRoot \"/caminho/completo/para/meumu/dist\""
echo ""
echo -e "${BLUE}Nginx:${NC}"
echo "  root /caminho/completo/para/meumu/dist;"
echo ""
echo -e "${YELLOW}Após configurar, reinicie o servidor web:${NC}"
echo "  sudo systemctl restart apache2    # Apache"
echo "  sudo systemctl reload nginx       # Nginx"
echo ""

# SEGURANÇA
echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║  🔒 SEGURANÇA: Deletar pasta /install                        ║${NC}"
echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ -d "install" ]; then
    echo -e "${YELLOW}Deseja deletar a pasta /install agora? (s/N)${NC}"
    read -p "Opção: " DELETE_INSTALL
    
    if [ "$DELETE_INSTALL" = "s" ] || [ "$DELETE_INSTALL" = "S" ]; then
        rm -rf install/
        echo -e "${GREEN}✅ Pasta /install deletada!${NC}"
    else
        echo -e "${YELLOW}⚠️  Lembre-se de deletar manualmente: rm -rf install/${NC}"
    fi
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ PÓS-INSTALAÇÃO CONCLUÍDA! ✅                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📊 Resumo:${NC}"
echo "  ✅ Frontend buildado em /dist"
echo "  ✅ Backend configurado"
if [ "$BACKEND_OPTION" = "1" ]; then
    echo "  ✅ Backend rodando com PM2"
fi
echo "  ⚠️  Servidor web: configure manualmente"
echo ""

echo -e "${YELLOW}📝 Próximos passos:${NC}"
echo "  1. Configure DocumentRoot/root para /dist"
echo "  2. Reinicie o servidor web"
echo "  3. Acesse: http://seudominio.com"
echo "  4. Teste backend: curl http://localhost:3001/api/health"
echo ""

echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}       🎮 MeuMU Online v2.0.1 - Pronto para jogar! 🎮${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
