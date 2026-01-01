#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# MEUMU ONLINE - CORREÇÃO RÁPIDA DE PERMISSÕES MYSQL V629
# ═══════════════════════════════════════════════════════════════
# 
# 🔥 PROBLEMA:
#    UPDATE command denied to user 'webuser'@'localhost' 
#    for table `muonline`.`character_info`
# 
# ✅ SOLUÇÃO:
#    Adicionar permissão UPDATE em character_info e accounts
# 
# ═══════════════════════════════════════════════════════════════

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

clear
echo -e "${BOLD}${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${YELLOW}    🔐 CORREÇÃO PERMISSÕES MYSQL - V629                    ${NC}"
echo -e "${BOLD}${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}🔥 PROBLEMA IDENTIFICADO:${NC}"
echo -e "${RED}   ❌ UPDATE command denied to user 'webuser'@'localhost'${NC}"
echo -e "${RED}      for table \`muonline\`.\`character_info\`${NC}"
echo ""
echo -e "${CYAN}🎯 FUNCIONALIDADES AFETADAS:${NC}"
echo -e "${YELLOW}   • Distribuir pontos de atributos${NC}"
echo -e "${YELLOW}   • Reset de personagem${NC}"
echo -e "${YELLOW}   • Unstick (destravar personagem)${NC}"
echo -e "${YELLOW}   • Clear PK${NC}"
echo -e "${YELLOW}   • Trocar senha${NC}"
echo ""
echo -e "${CYAN}✅ SOLUÇÃO:${NC}"
echo -e "${GREEN}   Adicionar permissão UPDATE específica em:${NC}"
echo -e "${GREEN}   - muonline.character_info (distribuir pontos, reset, unstick)${NC}"
echo -e "${GREEN}   - muonline.accounts (trocar senha, ban/unban)${NC}"
echo ""
echo -e "${CYAN}🔒 SEGURANÇA MANTIDA:${NC}"
echo -e "${GREEN}   ✅ Apenas UPDATE em 2 tabelas específicas${NC}"
echo -e "${GREEN}   ✅ SEM permissões perigosas (DROP, CREATE, ALTER, GRANT)${NC}"
echo -e "${GREEN}   ✅ Princípio de menor privilégio respeitado${NC}"
echo ""
echo -e "${YELLOW}Pressione ENTER para continuar...${NC}"
read

# Verificar se arquivo SQL existe
SQL_FILE="/home/meumu.com/public_html/backend-nodejs/scripts/fix-mysql-permissions-V629.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}❌ Arquivo SQL de correção não encontrado!${NC}"
    echo -e "${YELLOW}   Esperado: $SQL_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}🔧 Aplicando correções de permissões...${NC}"
echo ""

# Executar script SQL
if sudo mysql < "$SQL_FILE" 2>/tmp/mysql_perms_fix.log; then
    echo -e "${GREEN}✅ Permissões aplicadas com sucesso!${NC}"
    echo ""
    
    # Mostrar permissões atuais
    echo -e "${CYAN}📋 Permissões atuais do webuser:${NC}"
    sudo mysql -e "SHOW GRANTS FOR 'webuser'@'localhost';" 2>/dev/null | grep -E "(GRANT|character_info|accounts)" || true
    echo ""
    
    echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${GREEN}           ✅ CORREÇÃO CONCLUÍDA COM SUCESSO!               ${NC}"
    echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${CYAN}⚡ EFEITO IMEDIATO:${NC}"
    echo -e "${GREEN}   • Não precisa reiniciar o backend Node.js${NC}"
    echo -e "${GREEN}   • Não precisa reiniciar o MySQL${NC}"
    echo -e "${GREEN}   • FLUSH PRIVILEGES já aplicado${NC}"
    echo ""
    echo -e "${CYAN}🧪 TESTE AGORA:${NC}"
    echo -e "${YELLOW}   1. Acesse o site e faça login${NC}"
    echo -e "${YELLOW}   2. Vá para 'Pontos' no painel do jogador${NC}"
    echo -e "${YELLOW}   3. Distribua alguns pontos${NC}"
    echo -e "${YELLOW}   4. Deve funcionar sem erro 500!${NC}"
    echo ""
else
    echo -e "${RED}❌ Erro ao aplicar permissões!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Log de erro:${NC}"
    cat /tmp/mysql_perms_fix.log
    echo ""
    echo -e "${YELLOW}💡 Possíveis causas:${NC}"
    echo -e "${RED}   • MySQL não está rodando${NC}"
    echo -e "${RED}   • Usuário webuser não existe${NC}"
    echo -e "${RED}   • Sem permissão de root (execute com sudo)${NC}"
    echo ""
    echo -e "${CYAN}🔧 Tente executar manualmente:${NC}"
    echo -e "${YELLOW}   sudo mysql < $SQL_FILE${NC}"
    echo ""
    exit 1
fi

echo -e "${CYAN}Pressione ENTER para finalizar...${NC}"
read
