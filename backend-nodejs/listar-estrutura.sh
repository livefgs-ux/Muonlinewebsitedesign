#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "  LISTANDO ESTRUTURA DE PASTAS"
echo "════════════════════════════════════════════════════════"
echo ""

cd /home/meumu.com/public_html

echo "Estrutura de /home/meumu.com/public_html:"
tree -L 2 -d 2>/dev/null || find . -maxdepth 2 -type d | head -30

echo ""
echo "════════════════════════════════════════════════════════"
