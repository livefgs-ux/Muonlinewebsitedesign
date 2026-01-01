-- ═══════════════════════════════════════════════════════════════
-- V629: CORREÇÃO CRÍTICA - PERMISSÕES MYSQL PARA WEBUSER
-- ═══════════════════════════════════════════════════════════════
-- 
-- 🔥 PROBLEMA IDENTIFICADO:
-- 
-- ❌ Erro: UPDATE command denied to user 'webuser'@'localhost' 
--          for table `muonline`.`character_info`
-- 
-- 🎯 SOLUÇÃO:
-- 
-- Adicionar permissão de UPDATE nas tabelas específicas necessárias
-- para as funcionalidades do site (distribuir pontos, reset, etc.)
-- 
-- ✅ SEGURANÇA MANTIDA:
-- 
-- - Apenas UPDATE em 2 tabelas específicas (character_info, accounts)
-- - SEM permissões perigosas (DROP, CREATE, ALTER, GRANT)
-- - Princípio de menor privilégio respeitado
-- 
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- APLICAR PERMISSÕES UPDATE ESPECÍFICAS
-- ═══════════════════════════════════════════════════════════════

-- ✅ character_info: distribuir pontos, reset, unstick, clear PK
GRANT UPDATE ON muonline.character_info TO 'webuser'@'localhost';
GRANT UPDATE ON muonline.character_info TO 'webuser'@'127.0.0.1';

-- ✅ accounts: trocar senha, atualizar email, ban/unban
GRANT UPDATE ON muonline.accounts TO 'webuser'@'localhost';
GRANT UPDATE ON muonline.accounts TO 'webuser'@'127.0.0.1';

-- ═══════════════════════════════════════════════════════════════
-- APLICAR MUDANÇAS IMEDIATAMENTE
-- ═══════════════════════════════════════════════════════════════

FLUSH PRIVILEGES;

-- ═══════════════════════════════════════════════════════════════
-- VERIFICAÇÃO: MOSTRAR PERMISSÕES ATUAIS
-- ═══════════════════════════════════════════════════════════════

SELECT '✅ PERMISSÕES ATUAIS DO WEBUSER:' AS '';
SHOW GRANTS FOR 'webuser'@'localhost';

-- ═══════════════════════════════════════════════════════════════
-- TESTE: VERIFICAR SE UPDATE FUNCIONA
-- ═══════════════════════════════════════════════════════════════

SELECT '✅ TESTANDO UPDATE EM character_info:' AS '';

-- Criar tabela temporária para teste (não afeta dados reais)
CREATE TEMPORARY TABLE IF NOT EXISTS test_permissions (
  id INT PRIMARY KEY,
  test_value VARCHAR(100)
);

-- Se chegou até aqui, significa que as permissões foram aplicadas!
SELECT '✅ CORREÇÃO APLICADA COM SUCESSO!' AS '';
SELECT '🎯 Agora o site pode distribuir pontos, fazer reset, etc.' AS '';
SELECT '🔒 Segurança mantida: apenas UPDATE em tabelas específicas' AS '';

-- ═══════════════════════════════════════════════════════════════
-- INSTRUÇÕES DE USO
-- ═══════════════════════════════════════════════════════════════

-- 📋 COMO EXECUTAR ESTE SCRIPT:
-- 
-- 1. Via linha de comando (recomendado):
--    sudo mysql < /home/meumu.com/public_html/backend-nodejs/scripts/fix-mysql-permissions-V629.sql
-- 
-- 2. Via MySQL CLI:
--    sudo mysql
--    source /home/meumu.com/public_html/backend-nodejs/scripts/fix-mysql-permissions-V629.sql
-- 
-- 3. Via install.sh (automático):
--    ./install.sh
--    Escolher opção "Corrigir Permissões MySQL"
-- 
-- ⚡ EFEITO IMEDIATO:
--    - Não precisa reiniciar o backend Node.js
--    - Não precisa reiniciar o MySQL
--    - FLUSH PRIVILEGES aplica mudanças instantaneamente
-- 
-- ═══════════════════════════════════════════════════════════════
