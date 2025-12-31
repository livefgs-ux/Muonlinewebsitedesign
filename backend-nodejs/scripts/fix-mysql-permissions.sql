-- ═══════════════════════════════════════════════════════════
-- MEUMU ONLINE - CORREÇÃO DE PERMISSÕES V619
-- ═══════════════════════════════════════════════════════════
-- PROBLEMA: webuser não tinha permissão UPDATE em muonline
-- SOLUÇÃO: Dar UPDATE em tabelas específicas (character_info, MEMB_INFO, etc)
-- DATA: 2025-12-31
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- 1️⃣ VERIFICAR USUÁRIO WEBUSER
-- ═══════════════════════════════════════════════════════════

SELECT CONCAT('✅ Verificando usuário webuser...') AS 'Status';
SELECT User, Host FROM mysql.user WHERE User = 'webuser';

-- Se não existir, descomente e crie:
-- CREATE USER 'webuser'@'localhost' IDENTIFIED BY 'SUA_SENHA_FORTE_AQUI';

-- ═══════════════════════════════════════════════════════════
-- 2️⃣ LIMPAR PERMISSÕES ANTIGAS
-- ═══════════════════════════════════════════════════════════

SELECT CONCAT('🧹 Limpando permissões antigas...') AS 'Status';

REVOKE ALL PRIVILEGES ON *.* FROM 'webuser'@'localhost';
REVOKE ALL PRIVILEGES ON muonline.* FROM 'webuser'@'localhost';
REVOKE ALL PRIVILEGES ON meuweb.* FROM 'webuser'@'localhost';

-- ═══════════════════════════════════════════════════════════
-- 3️⃣ DATABASE MUONLINE - PERMISSÕES SELETIVAS
-- ═══════════════════════════════════════════════════════════

SELECT CONCAT('✅ Configurando permissões para DATABASE muonline...') AS 'Status';

-- ✅ TABELAS QUE PRECISAM UPDATE (Site modifica)
-- Distribuir pontos, reset, alterar senha, etc

GRANT SELECT, UPDATE ON muonline.character_info TO 'webuser'@'localhost';
SELECT CONCAT('  ✓ character_info: SELECT + UPDATE') AS '';

GRANT SELECT, UPDATE ON muonline.MEMB_INFO TO 'webuser'@'localhost';
SELECT CONCAT('  ✓ MEMB_INFO: SELECT + UPDATE') AS '';

GRANT SELECT, UPDATE ON muonline.MEMB_STAT TO 'webuser'@'localhost';
SELECT CONCAT('  ✓ MEMB_STAT: SELECT + UPDATE') AS '';

GRANT SELECT, UPDATE ON muonline.warehouse TO 'webuser'@'localhost';
SELECT CONCAT('  ✓ warehouse: SELECT + UPDATE') AS '';

-- ✅ TABELAS SOMENTE LEITURA (Site apenas consulta)
-- Rankings, listagens, estatísticas

GRANT SELECT ON muonline.Character TO 'webuser'@'localhost';
SELECT CONCAT('  ✓ Character: SELECT') AS '';

GRANT SELECT ON muonline.AccountCharacter TO 'webuser'@'localhost';
SELECT CONCAT('  ✓ AccountCharacter: SELECT') AS '';

GRANT SELECT ON muonline.Guild TO 'webuser'@'localhost';
SELECT CONCAT('  ✓ Guild: SELECT') AS '';

GRANT SELECT ON muonline.GuildMember TO 'webuser'@'localhost';
SELECT CONCAT('  ✓ GuildMember: SELECT') AS '';

GRANT SELECT ON muonline.Gens TO 'webuser'@'localhost';
SELECT CONCAT('  ✓ Gens: SELECT') AS '';

-- ⚠️ ADICIONE MAIS TABELAS SE NECESSÁRIO
-- Exemplo: GRANT SELECT ON muonline.EventsTable TO 'webuser'@'localhost';

-- ═══════════════════════════════════════════════════════════
-- 4️⃣ DATABASE MEUWEB - PERMISSÕES COMPLETAS
-- ═══════════════════════════════════════════════════════════

SELECT CONCAT('✅ Configurando permissões para DATABASE meuweb...') AS 'Status';

GRANT SELECT, INSERT, UPDATE, DELETE ON meuweb.* TO 'webuser'@'localhost';
SELECT CONCAT('  ✓ meuweb.*: SELECT, INSERT, UPDATE, DELETE') AS '';

-- ═══════════════════════════════════════════════════════════
-- 5️⃣ APLICAR MUDANÇAS
-- ═══════════════════════════════════════════════════════════

SELECT CONCAT('🔄 Aplicando mudanças...') AS 'Status';
FLUSH PRIVILEGES;

-- ═══════════════════════════════════════════════════════════
-- 6️⃣ VERIFICAR PERMISSÕES
-- ═══════════════════════════════════════════════════════════

SELECT CONCAT('') AS '';
SELECT CONCAT('════════════════════════════════════════') AS '';
SELECT CONCAT('✅ PERMISSÕES CONFIGURADAS COM SUCESSO!') AS '';
SELECT CONCAT('════════════════════════════════════════') AS '';
SELECT CONCAT('') AS '';

SELECT CONCAT('📋 Permissões atuais para webuser@localhost:') AS '';
SHOW GRANTS FOR 'webuser'@'localhost';

-- ═══════════════════════════════════════════════════════════
-- 7️⃣ TESTE RÁPIDO (OPCIONAL)
-- ═══════════════════════════════════════════════════════════

SELECT CONCAT('') AS '';
SELECT CONCAT('🧪 TESTE RÁPIDO:') AS '';
SELECT CONCAT('1. Execute: mysql -u webuser -p') AS '';
SELECT CONCAT('2. Digite: USE muonline;') AS '';
SELECT CONCAT('3. Teste UPDATE: UPDATE character_info SET points = points WHERE name = "TestChar" LIMIT 1;') AS '';
SELECT CONCAT('4. Se funcionar: ✅ Permissões OK!') AS '';
SELECT CONCAT('5. Se falhar: ❌ Revise o script') AS '';

-- ═══════════════════════════════════════════════════════════
-- FIM DO SCRIPT
-- ═══════════════════════════════════════════════════════════
