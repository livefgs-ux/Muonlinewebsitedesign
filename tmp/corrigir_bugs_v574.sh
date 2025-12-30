
# ══════════════════════════════════════════════════════════════
# 🔧 FUNÇÃO: CORRIGIR BUGS V574
# ═══════════════════════════════════════════════════════════════

corrigir_bugs_v574() {
    clear_screen
    
    echo -e "${BOLD}${MAGENTA}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${MAGENTA}          🔧 CORREÇÃO DE BUGS - V574                        ${NC}"
    echo -e "${BOLD}${MAGENTA}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}Esta função corrige os seguintes bugs:${NC}"
    echo ""
    echo -e "${CYAN}1) 🛒 Pacotes WCoin duplicados na loja${NC}"
    echo -e "${CYAN}   → Remove duplicatas e mantém apenas 6 pacotes únicos${NC}"
    echo ""
    echo -e "${CYAN}2) 🗓️  Tabela de eventos com campo 'color' incorreto${NC}"
    echo -e "${CYAN}   → Recria tabela aceitando cores personalizadas${NC}"
    echo ""
    echo -e "${RED}⚠️  ATENÇÃO: Isso irá:${NC}"
    echo -e "${YELLOW}   - DELETAR todos os pacotes WCoin existentes${NC}"
    echo -e "${YELLOW}   - Recriar a tabela 'events' (se existir)${NC}"
    echo ""
    
    read -r -p "$(echo -e ${BOLD}Deseja continuar? [s/N]: ${NC})" confirma
    
    if [[ ! "$confirma" =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}Operação cancelada.${NC}"
        pause
        return
    fi
    
    echo ""
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${CYAN}              INICIANDO CORREÇÕES                          ${NC}"
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # ═══════════════════════════════════════════════════════════════
    # CORREÇÃO 1: WCOIN DUPLICATES
    # ═══════════════════════════════════════════════════════════════
    
    echo -e "${YELLOW}[1/2]${NC} Corrigindo pacotes WCoin duplicados..."
    
    WCOIN_FIX_FILE="$BASE_DIR/backend-nodejs/src/seeders/fix-wcoin-duplicates.sql"
    
    if [ ! -f "$WCOIN_FIX_FILE" ]; then
        echo -e "${RED}❌ Arquivo não encontrado: $WCOIN_FIX_FILE${NC}"
        pause
        return 1
    fi
    
    # Executar script de correção
    if $MYSQL_ADMIN_CMD meuweb < "$WCOIN_FIX_FILE" 2>/tmp/wcoin_fix.log; then
        echo -e "${GREEN}✅ Pacotes WCoin corrigidos!${NC}"
        
        # Verificar resultado
        WCOIN_COUNT=$($MYSQL_ADMIN_CMD -e "SELECT COUNT(*) FROM meuweb.wcoin_packages;" 2>/dev/null | tail -1)
        echo -e "${CYAN}   📦 Total de pacotes agora: ${WCOIN_COUNT}${NC}"
        
        if [ "$WCOIN_COUNT" -eq 6 ]; then
            echo -e "${GREEN}   ✅ Quantidade correta (6 pacotes únicos)${NC}"
        else
            echo -e "${YELLOW}   ⚠️  Quantidade inesperada (esperado: 6, atual: ${WCOIN_COUNT})${NC}"
        fi
        
        # Mostrar pacotes criados
        echo ""
        echo -e "${CYAN}   📋 Pacotes criados:${NC}"
        $MYSQL_ADMIN_CMD -e "SELECT id, wcoin_amount AS 'WCoin', price AS 'Preço', currency AS 'Moeda' FROM meuweb.wcoin_packages ORDER BY price ASC;" 2>/dev/null
    else
        echo -e "${RED}❌ Erro ao corrigir WCoin!${NC}"
        echo -e "${YELLOW}Log de erro:${NC}"
        cat /tmp/wcoin_fix.log
        pause
        return 1
    fi
    
    echo ""
    
    # ═══════════════════════════════════════════════════════════════
    # CORREÇÃO 2: EVENTS TABLE COLOR FIELD
    # ═══════════════════════════════════════════════════════════════
    
    echo -e "${YELLOW}[2/2]${NC} Verificando tabela de eventos..."
    
    EVENTS_TABLE_FILE="$BASE_DIR/backend-nodejs/database/06_create_events_table.sql"
    
    if [ ! -f "$EVENTS_TABLE_FILE" ]; then
        echo -e "${YELLOW}⚠️  Arquivo de eventos não encontrado (OK se não usa eventos)${NC}"
    else
        # Verificar se tabela events existe
        EVENTS_EXISTS=$($MYSQL_ADMIN_CMD -e "SHOW TABLES FROM meuweb LIKE 'events';" 2>/dev/null | tail -n +2)
        
        if [ -n "$EVENTS_EXISTS" ]; then
            echo -e "${CYAN}   Tabela 'events' existe. Verificando estrutura...${NC}"
            
            # Verificar se campo color é ENUM ou VARCHAR
            COLOR_TYPE=$($MYSQL_ADMIN_CMD -e "SHOW COLUMNS FROM meuweb.events LIKE 'color';" 2>/dev/null | tail -1 | awk '{print $2}')
            
            if [[ "$COLOR_TYPE" =~ "enum" ]]; then
                echo -e "${YELLOW}   ⚠️  Campo 'color' está como ENUM (restritivo)${NC}"
                echo -e "${CYAN}   Convertendo para VARCHAR...${NC}"
                
                # Fazer backup da tabela
                echo -e "${CYAN}   📦 Fazendo backup da tabela events...${NC}"
                $MYSQL_ADMIN_CMD -e "CREATE TABLE IF NOT EXISTS meuweb.events_backup_v574 AS SELECT * FROM meuweb.events;" 2>/dev/null
                
                # Alterar campo color
                if $MYSQL_ADMIN_CMD -e "ALTER TABLE meuweb.events MODIFY COLUMN color VARCHAR(20) DEFAULT 'yellow';" 2>/tmp/events_alter.log; then
                    echo -e "${GREEN}   ✅ Campo 'color' atualizado para VARCHAR(20)${NC}"
                    
                    # Contar eventos
                    EVENTS_COUNT=$($MYSQL_ADMIN_CMD -e "SELECT COUNT(*) FROM meuweb.events;" 2>/dev/null | tail -1)
                    echo -e "${CYAN}   📊 Total de eventos: ${EVENTS_COUNT}${NC}"
                else
                    echo -e "${RED}   ❌ Erro ao alterar campo 'color'${NC}"
                    cat /tmp/events_alter.log
                fi
            else
                echo -e "${GREEN}   ✅ Campo 'color' já está correto (VARCHAR)${NC}"
            fi
        else
            echo -e "${CYAN}   Tabela 'events' não existe. Criando...${NC}"
            
            if $MYSQL_ADMIN_CMD meuweb < "$EVENTS_TABLE_FILE" 2>/tmp/events_create.log; then
                echo -e "${GREEN}   ✅ Tabela 'events' criada com sucesso!${NC}"
                
                # Contar eventos inseridos
                EVENTS_COUNT=$($MYSQL_ADMIN_CMD -e "SELECT COUNT(*) FROM meuweb.events;" 2>/dev/null | tail -1)
                echo -e "${CYAN}   📊 Eventos inseridos: ${EVENTS_COUNT}${NC}"
            else
                echo -e "${RED}   ❌ Erro ao criar tabela 'events'${NC}"
                echo -e "${YELLOW}   Log de erro:${NC}"
                cat /tmp/events_create.log
            fi
        fi
    fi
    
    echo ""
    echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${GREEN}           ✅ CORREÇÕES CONCLUÍDAS - V574                   ${NC}"
    echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${CYAN}📋 Resumo:${NC}"
    echo -e "${GREEN}   ✅ Pacotes WCoin corrigidos${NC}"
    echo -e "${GREEN}   ✅ Tabela events verificada${NC}"
    echo ""
    echo -e "${YELLOW}🔄 Próximo passo:${NC}"
    echo -e "${CYAN}   - Faça build do frontend (opção 4)${NC}"
    echo -e "${CYAN}   - Limpe o cache do navegador (Ctrl + Shift + Delete)${NC}"
    echo -e "${CYAN}   - Teste a loja (deve ter exatamente 6 pacotes)${NC}"
    echo ""
    
    pause
}
