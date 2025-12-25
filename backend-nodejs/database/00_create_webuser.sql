-- ═══════════════════════════════════════════════════════════════
-- MEUMU ONLINE - CRIAÇÃO DO USUÁRIO SEGURO 'webuser'
-- ═══════════════════════════════════════════════════════════════
-- 
-- Este script cria um usuário MySQL com permissões limitadas:
-- 
-- ✅ Database 'muonline': SELECT (READ-ONLY)
--    - Não pode alterar dados do servidor MU
--    - Pode apenas ler rankings, personagens, etc.
-- 
-- ✅ Database 'webmu': SELECT, INSERT, UPDATE, DELETE (READ+WRITE)
--    - Pode gerenciar dados do website
--    - Contas, notícias, logs, etc.
-- 
-- ❌ SEM permissões perigosas:
--    - DROP (deletar databases/tabelas)
--    - CREATE (criar databases/tabelas)
--    - ALTER (modificar estrutura)
--    - GRANT (dar permissões a outros usuários)
-- 
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- PASSO 1: REMOVER USUÁRIO SE JÁ EXISTIR (idempotência)
-- ═══════════════════════════════════════════════════════════════

DROP USER IF EXISTS 'webuser'@'localhost';
DROP USER IF EXISTS 'webuser'@'127.0.0.1';
DROP USER IF EXISTS 'webuser'@'%';

FLUSH PRIVILEGES;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 2: CRIAR USUÁRIO 'webuser' COM SENHA FORTE
-- ═══════════════════════════════════════════════════════════════

-- Criar usuário para conexões localhost (mais seguro)
CREATE USER 'webuser'@'localhost' IDENTIFIED BY '@meusite123@';

-- Criar usuário para conexões 127.0.0.1 (compatibilidade)
CREATE USER 'webuser'@'127.0.0.1' IDENTIFIED BY '@meusite123@';

-- ═══════════════════════════════════════════════════════════════
-- PASSO 3: PERMISSÕES NO DATABASE 'muonline' (READ-ONLY)
-- ═══════════════════════════════════════════════════════════════

-- Apenas SELECT (leitura) - não pode alterar dados do servidor MU
GRANT SELECT ON muonline.* TO 'webuser'@'localhost';
GRANT SELECT ON muonline.* TO 'webuser'@'127.0.0.1';

-- ═══════════════════════════════════════════════════════════════
-- PASSO 4: PERMISSÕES NO DATABASE 'webmu' (READ+WRITE)
-- ═══════════════════════════════════════════════════════════════

-- SELECT, INSERT, UPDATE, DELETE - gerenciar dados do website
GRANT SELECT, INSERT, UPDATE, DELETE ON webmu.* TO 'webuser'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON webmu.* TO 'webuser'@'127.0.0.1';

-- ═══════════════════════════════════════════════════════════════
-- PASSO 5: APLICAR PERMISSÕES
-- ═══════════════════════════════════════════════════════════════

FLUSH PRIVILEGES;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 6: VERIFICAR USUÁRIO E PERMISSÕES (VALIDAÇÃO)
-- ═══════════════════════════════════════════════════════════════

-- Verificar se usuário foi criado
SELECT User, Host FROM mysql.user WHERE User = 'webuser';

-- Verificar permissões no database 'muonline'
SHOW GRANTS FOR 'webuser'@'localhost';

-- ═══════════════════════════════════════════════════════════════
-- OBSERVAÇÕES IMPORTANTES
-- ═══════════════════════════════════════════════════════════════
-- 
-- 📋 RESUMO DAS PERMISSÕES:
-- 
-- ✅ webuser@localhost:
--    - muonline: SELECT (read-only)
--    - webmu: SELECT, INSERT, UPDATE, DELETE (read+write)
-- 
-- ❌ SEM PERMISSÕES PERIGOSAS:
--    - DROP (não pode deletar tabelas/databases)
--    - CREATE (não pode criar tabelas/databases)
--    - ALTER (não pode modificar estrutura)
--    - GRANT (não pode dar permissões a outros)
--    - SUPER (não pode executar comandos administrativos)
-- 
-- 🔒 SEGURANÇA:
--    - Princípio de menor privilégio
--    - Se backend for comprometido, danos são limitados
--    - Não pode alterar dados do servidor MU
--    - Não pode dropar databases ou tabelas
-- 
-- 📝 COMO EXECUTAR ESTE SCRIPT:
-- 
--    1. Via linha de comando:
--       mysql -u root -p@mysql123@ < 00_create_webuser.sql
-- 
--    2. Via MySQL CLI:
--       mysql -u root -p@mysql123@
--       source /caminho/para/00_create_webuser.sql
-- 
--    3. Via phpMyAdmin:
--       - Importar arquivo SQL
-- 
-- ⚠️  TROCAR SENHA EM PRODUÇÃO:
--    - A senha '@meusite123@' é apenas para desenvolvimento
--    - Antes de abrir para público, gere senha forte:
--      openssl rand -base64 32
-- 
-- ═══════════════════════════════════════════════════════════════
