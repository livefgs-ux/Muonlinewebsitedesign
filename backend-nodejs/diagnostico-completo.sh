#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "  DIAGNÓSTICO COMPLETO - MeuMU Online Backend"
echo "════════════════════════════════════════════════════════════════"
echo ""

cd /home/meumu.com/public_html/backend-nodejs

# 1. Backend está rodando?
echo "[1/6] Verificando se backend está rodando..."
pm2 status | grep meumu-backend
if [ $? -eq 0 ]; then
    echo "✅ Backend encontrado no PM2"
else
    echo "❌ Backend NÃO está no PM2!"
fi
echo ""

# 2. Processo na porta 3001?
echo "[2/6] Verificando porta 3001..."
netstat -tulpn | grep :3001 || ss -tulpn | grep :3001
if [ $? -eq 0 ]; then
    echo "✅ Algo está escutando na porta 3001"
else
    echo "❌ NADA está escutando na porta 3001!"
fi
echo ""

# 3. Testar localhost
echo "[3/6] Testando API localmente (127.0.0.1)..."
RESPONSE=$(curl -s -w "\n%{http_code}" http://127.0.0.1:3001/health 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API responde localmente!"
    echo "$BODY" | head -5
else
    echo "❌ API NÃO responde localmente!"
    echo "HTTP Code: $HTTP_CODE"
    echo "$BODY"
fi
echo ""

# 4. Testar IP externo
echo "[4/6] Testando API externamente (IP público)..."
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "IP do servidor: $SERVER_IP"

RESPONSE_EXT=$(curl -s -w "\n%{http_code}" http://$SERVER_IP:3001/health 2>&1)
HTTP_CODE_EXT=$(echo "$RESPONSE_EXT" | tail -n1)

if [ "$HTTP_CODE_EXT" = "200" ]; then
    echo "✅ API responde via IP externo!"
else
    echo "❌ API NÃO responde via IP externo!"
    echo "Pode ser firewall bloqueando!"
fi
echo ""

# 5. Firewall
echo "[5/6] Verificando firewall (ufw/iptables)..."
if command -v ufw &> /dev/null; then
    echo "UFW Status:"
    ufw status | grep 3001
    if [ $? -ne 0 ]; then
        echo "⚠️  Porta 3001 NÃO encontrada no UFW!"
    fi
else
    echo "UFW não instalado"
fi

echo ""
echo "Iptables:"
iptables -L -n | grep 3001 || echo "Nenhuma regra encontrada"
echo ""

# 6. Logs do backend
echo "[6/6] Últimos logs do backend..."
pm2 logs meumu-backend --lines 10 --nostream 2>/dev/null || echo "PM2 não tem logs"
echo ""

# Resumo
echo "════════════════════════════════════════════════════════════════"
echo "  RESUMO"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Backend no PM2: $(pm2 status | grep meumu-backend > /dev/null && echo '✅ SIM' || echo '❌ NÃO')"
echo "Porta 3001 aberta: $(netstat -tulpn 2>/dev/null | grep :3001 > /dev/null && echo '✅ SIM' || echo '❌ NÃO')"
echo "API localhost: $(curl -s http://127.0.0.1:3001/health > /dev/null 2>&1 && echo '✅ OK' || echo '❌ FALHOU')"
echo "API IP externo: $(curl -s http://$SERVER_IP:3001/health > /dev/null 2>&1 && echo '✅ OK' || echo '❌ FALHOU')"
echo ""

# Ações sugeridas
echo "════════════════════════════════════════════════════════════════"
echo "  AÇÕES SUGERIDAS"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Se backend não está rodando
if ! pm2 status | grep -q meumu-backend; then
    echo "1. INICIAR BACKEND:"
    echo "   ./INSTALAR_E_INICIAR.sh"
    echo ""
fi

# Se API localhost falha
if ! curl -s http://127.0.0.1:3001/health > /dev/null 2>&1; then
    echo "2. VER LOGS DE ERRO:"
    echo "   pm2 logs meumu-backend --err"
    echo ""
fi

# Se API externa falha mas local funciona
if curl -s http://127.0.0.1:3001/health > /dev/null 2>&1 && ! curl -s http://$SERVER_IP:3001/health > /dev/null 2>&1; then
    echo "3. ABRIR PORTA 3001 NO FIREWALL:"
    echo "   ufw allow 3001/tcp"
    echo "   ufw reload"
    echo ""
    echo "   OU via painel de controle do servidor"
    echo ""
fi

echo "════════════════════════════════════════════════════════════════"
