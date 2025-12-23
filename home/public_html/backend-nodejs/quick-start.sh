#!/bin/bash
# Script sem emojis - apenas ASCII puro

cd /home/meumu.com/public_html/backend-nodejs

echo "Parando PM2..."
pm2 stop meumu-backend 2>/dev/null || true
pm2 delete meumu-backend 2>/dev/null || true

echo "Iniciando backend..."
pm2 start src/server.js --name meumu-backend --update-env

sleep 3

echo ""
echo "Status:"
pm2 status

echo ""
echo "Teste API:"
curl -s http://127.0.0.1:3001/health

echo ""
echo "Pronto!"
