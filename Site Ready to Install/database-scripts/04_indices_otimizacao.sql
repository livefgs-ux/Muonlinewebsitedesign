-- ============================================================================
-- Script 4: Índices e Otimizações
-- ============================================================================
-- Este script cria índices para melhorar a performance do banco
-- Data: 20/12/2024
-- ============================================================================

-- Usar o banco de dados do MU Online
USE MuOnline;

-- Banner
SELECT '================================================' AS '';
SELECT '  OTIMIZAÇÃO DO BANCO DE DADOS' AS '';
SELECT '================================================' AS '';
SELECT '' AS '';

-- ============================================================================
-- ÍNDICES NA TABELA MEMB_INFO
-- ============================================================================
SELECT '📊 Otimizando tabela MEMB_INFO...' AS '';

-- Índice para login (busca por usuário)
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'MEMB_INFO' 
       AND INDEX_NAME = 'idx_login') = 0,
    'CREATE INDEX idx_login ON MEMB_INFO(memb_name, memb__pwd)',
    'SELECT ''Índice idx_login já existe'' AS Status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índice para admin_level
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'MEMB_INFO' 
       AND INDEX_NAME = 'idx_admin_level') = 0,
    'CREATE INDEX idx_admin_level ON MEMB_INFO(admin_level)',
    'SELECT ''Índice idx_admin_level já existe'' AS Status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índice para email
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'MEMB_INFO' 
       AND INDEX_NAME = 'idx_email') = 0,
    'CREATE INDEX idx_email ON MEMB_INFO(mail_addr)',
    'SELECT ''Índice idx_email já existe'' AS Status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índice para status (bloc_code)
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'MEMB_INFO' 
       AND INDEX_NAME = 'idx_status') = 0,
    'CREATE INDEX idx_status ON MEMB_INFO(bloc_code)',
    'SELECT ''Índice idx_status já existe'' AS Status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT '✅ Tabela MEMB_INFO otimizada!' AS '';
SELECT '' AS '';

-- ============================================================================
-- ÍNDICES NA TABELA Character
-- ============================================================================
SELECT '📊 Otimizando tabela Character...' AS '';

-- Índice para ranking de resets
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'Character' 
       AND INDEX_NAME = 'idx_resets') = 0,
    'CREATE INDEX idx_resets ON `Character`(Resets DESC, cLevel DESC)',
    'SELECT ''Índice idx_resets já existe'' AS Status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índice para ranking PK
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'Character' 
       AND INDEX_NAME = 'idx_pk') = 0,
    'CREATE INDEX idx_pk ON `Character`(PkCount DESC)',
    'SELECT ''Índice idx_pk já existe'' AS Status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índice para busca por conta
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'Character' 
       AND INDEX_NAME = 'idx_account') = 0,
    'CREATE INDEX idx_account ON `Character`(AccountID)',
    'SELECT ''Índice idx_account já existe'' AS Status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índice para guild
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'Character' 
       AND INDEX_NAME = 'idx_guild') = 0,
    'CREATE INDEX idx_guild ON `Character`(G_Name)',
    'SELECT ''Índice idx_guild já existe'' AS Status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índice para status online
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'Character' 
       AND INDEX_NAME = 'idx_online') = 0,
    'CREATE INDEX idx_online ON `Character`(ConnectStat)',
    'SELECT ''Índice idx_online já existe'' AS Status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT '✅ Tabela Character otimizada!' AS '';
SELECT '' AS '';

-- ============================================================================
-- ÍNDICES NA TABELA Guild
-- ============================================================================
SELECT '📊 Otimizando tabela Guild...' AS '';

-- Índice para ranking de guilds
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'Guild' 
       AND INDEX_NAME = 'idx_guild_score') = 0,
    'CREATE INDEX idx_guild_score ON Guild(G_Score DESC)',
    'SELECT ''Índice idx_guild_score já existe'' AS Status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índice para busca por mestre
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'Guild' 
       AND INDEX_NAME = 'idx_guild_master') = 0,
    'CREATE INDEX idx_guild_master ON Guild(G_Master)',
    'SELECT ''Índice idx_guild_master já existe'' AS Status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT '✅ Tabela Guild otimizada!' AS '';
SELECT '' AS '';

-- ============================================================================
-- ANÁLISE DE TABELAS (OPTIMIZE)
-- ============================================================================
SELECT '🔧 Analisando e otimizando tabelas...' AS '';
SELECT '' AS '';

ANALYZE TABLE MEMB_INFO;
ANALYZE TABLE `Character`;
ANALYZE TABLE Guild;
ANALYZE TABLE News;

SELECT '' AS '';
SELECT '✅ Análise concluída!' AS '';
SELECT '' AS '';

-- ============================================================================
-- ESTATÍSTICAS FINAIS
-- ============================================================================
SELECT '================================================' AS '';
SELECT '  ESTATÍSTICAS DO BANCO' AS '';
SELECT '================================================' AS '';

-- Total de índices criados
SELECT 
    TABLE_NAME AS 'Tabela',
    COUNT(DISTINCT INDEX_NAME) AS 'Total Índices'
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'MuOnline' 
  AND TABLE_NAME IN ('MEMB_INFO', 'Character', 'Guild', 'News')
GROUP BY TABLE_NAME
ORDER BY TABLE_NAME;

SELECT '' AS '';

-- Tamanho das tabelas
SELECT 
    TABLE_NAME AS 'Tabela',
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Tamanho (MB)',
    TABLE_ROWS AS 'Registros'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'MuOnline' 
  AND TABLE_NAME IN ('MEMB_INFO', 'Character', 'Guild', 'News')
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- ============================================================================
-- CONFIGURAÇÕES RECOMENDADAS DO MySQL
-- ============================================================================
SELECT '' AS '';
SELECT '================================================' AS '';
SELECT '  CONFIGURAÇÕES RECOMENDADAS' AS '';
SELECT '================================================' AS '';
SELECT '' AS '';
SELECT 'Para melhor performance, adicione no my.ini/my.cnf:' AS 'RECOMENDAÇÃO:';
SELECT '' AS '';
SELECT '[mysqld]' AS '';
SELECT 'innodb_buffer_pool_size = 256M' AS '';
SELECT 'max_connections = 200' AS '';
SELECT 'query_cache_size = 32M' AS '';
SELECT 'query_cache_limit = 2M' AS '';
SELECT 'tmp_table_size = 64M' AS '';
SELECT 'max_heap_table_size = 64M' AS '';
SELECT '' AS '';
SELECT 'Reinicie o MySQL após alterar:' AS '';
SELECT '  Linux:   sudo systemctl restart mysql' AS '';
SELECT '  Windows: net stop mysql && net start mysql' AS '';
SELECT '' AS '';

-- ============================================================================
-- DICAS DE MANUTENÇÃO
-- ============================================================================
SELECT '================================================' AS '';
SELECT '  DICAS DE MANUTENÇÃO' AS '';
SELECT '================================================' AS '';
SELECT '' AS '';
SELECT '1. Execute ANALYZE TABLE mensalmente:' AS 'MANUTENÇÃO:';
SELECT '   ANALYZE TABLE MEMB_INFO, Character, Guild, News;' AS '';
SELECT '' AS '';
SELECT '2. Execute OPTIMIZE TABLE trimestralmente:' AS '';
SELECT '   OPTIMIZE TABLE MEMB_INFO, Character, Guild, News;' AS '';
SELECT '' AS '';
SELECT '3. Faça backup diário do banco:' AS '';
SELECT '   mysqldump -u root -p MuOnline > backup.sql' AS '';
SELECT '' AS '';
SELECT '4. Monitore o tamanho dos logs:' AS '';
SELECT '   SHOW VARIABLES LIKE ''innodb_log_file_size'';' AS '';
SELECT '' AS '';

-- Banner final
SELECT '================================================' AS '';
SELECT '  ✅ OTIMIZAÇÃO CONCLUÍDA COM SUCESSO!' AS '';
SELECT '================================================' AS '';
SELECT '' AS '';
SELECT 'Seu banco de dados está otimizado para:' AS 'RESULTADO:';
SELECT '  ✅ Consultas mais rápidas' AS '';
SELECT '  ✅ Rankings em tempo real' AS '';
SELECT '  ✅ Melhor performance geral' AS '';
SELECT '' AS '';
SELECT 'A performance do site deve melhorar' AS 'IMPORTANTE:';
SELECT 'significativamente após esta otimização!' AS '';
SELECT '' AS '';

-- Fim do script
SELECT '✅ Script executado com sucesso!' AS '';
