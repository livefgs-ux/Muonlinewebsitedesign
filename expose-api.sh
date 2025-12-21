#!/bin/bash

##############################################
# 🌐 EXPOR API NA PORTA 3001 - MeuMU Online
##############################################

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🌐 Expondo API na Porta 3001         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

cd /home/meumu.com/public_html/backend-nodejs

##############################################
# 1. Abrir porta no firewall
##############################################
echo -e "${YELLOW}[1/3]${NC} Configurando firewall..."

# UFW
if command -v ufw &> /dev/null; then
    sudo ufw allow 3001/tcp
    echo -e "${GREEN}✅ UFW: Porta 3001 aberta${NC}"
fi

# Firewalld
if command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-port=3001/tcp
    sudo firewall-cmd --reload
    echo -e "${GREEN}✅ Firewalld: Porta 3001 aberta${NC}"
fi

# CyberPanel
if [ -d "/usr/local/CyberCP" ]; then
    echo -e "${YELLOW}⚠️  Configure manualmente no CyberPanel:${NC}"
    echo -e "   CyberPanel → Security → Firewall → Allow Port 3001"
fi

echo ""

##############################################
# 2. Configurar CORS no backend
##############################################
echo -e "${YELLOW}[2/3]${NC} Configurando CORS..."

# Backup do server.js
cp src/server.js src/server.js.backup

# Verificar se já tem CORS configurado
if grep -q "Access-Control-Allow-Origin" src/server.js; then
    echo -e "${GREEN}✅ CORS já configurado${NC}"
else
    echo -e "${YELLOW}Adicionando CORS...${NC}"
    
    # Adicionar CORS após a linha do express()
    sed -i "/const app = express();/a\\
\\
// CORS - Permitir requisições do frontend\\
app.use((req, res, next) => {\\
  res.header('Access-Control-Allow-Origin', '*');\\
  res.header('Access-Control-Allow-Credentials', 'true');\\
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');\\
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');\\
  \\
  if (req.method === 'OPTIONS') {\\
    return res.sendStatus(200);\\
  }\\
  \\
  next();\\
});" src/server.js
    
    echo -e "${GREEN}✅ CORS adicionado${NC}"
fi

echo ""

##############################################
# 3. Reiniciar backend
##############################################
echo -e "${YELLOW}[3/3]${NC} Reiniciando backend..."

pm2 restart meumu-backend

sleep 2

echo -e "${GREEN}✅ Backend reiniciado${NC}"
echo ""

##############################################
# 4. Testar
##############################################
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🧪 Testando API                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Pegar IP público
PUBLIC_IP=$(curl -s ifconfig.me)

echo -e "${CYAN}URLs disponíveis:${NC}"
echo -e "  Local:   ${GREEN}http://localhost:3001/api/server/info${NC}"
echo -e "  Pública: ${GREEN}http://$PUBLIC_IP:3001/api/server/info${NC}"
echo -e "  Domain:  ${GREEN}http://meumu.com:3001/api/server/info${NC}"
echo ""

# Testar
echo -e "${CYAN}Testando...${NC}"
RESPONSE=$(curl -s http://localhost:3001/api/server/info)

if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ API funcionando!${NC}"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null | head -15
else
    echo -e "${RED}❌ API não respondeu corretamente${NC}"
    echo "$RESPONSE"
fi

echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo -e "   Agora você precisa REBUILD o frontend para usar a porta 3001 diretamente!"
echo ""
