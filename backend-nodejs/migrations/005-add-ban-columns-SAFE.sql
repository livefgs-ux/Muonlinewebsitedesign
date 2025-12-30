-- ═══════════════════════════════════════════════════════════════
-- MIGRATION 005: Adicionar sistema completo de banimento
-- Data: 2025-12-30
-- Autor: Sistema MeuMU Online V577
-- Database: muonline (database do servidor MU)
-- VERSÃO SEGURA: Cria TODAS as colunas necessárias
-- ═══════════════════════════════════════════════════════════════

USE muonline;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 1: Adicionar coluna 'banned' se não existir
-- ═══════════════════════════════════════════════════════════════
SET @dbname = DATABASE();
SET @tablename = "accounts";
SET @columnname = "banned";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT '✅ Coluna banned já existe' AS status",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " TINYINT(1) DEFAULT 0 NOT NULL")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 2: Adicionar coluna 'ban_reason' se não existir
-- ═══════════════════════════════════════════════════════════════
SET @columnname = "ban_reason";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT '✅ Coluna ban_reason já existe' AS status",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " TEXT NULL")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 3: Adicionar coluna 'ban_date' se não existir
-- ═══════════════════════════════════════════════════════════════
SET @columnname = "ban_date";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT '✅ Coluna ban_date já existe' AS status",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " TIMESTAMP NULL")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 4: Adicionar coluna 'ban_expires' se não existir
-- ═══════════════════════════════════════════════════════════════
SET @columnname = "ban_expires";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT '✅ Coluna ban_expires já existe' AS status",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " TIMESTAMP NULL")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 5: Adicionar coluna 'banned_by' se não existir
-- ═══════════════════════════════════════════════════════════════
SET @columnname = "banned_by";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT '✅ Coluna banned_by já existe' AS status",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " VARCHAR(50) NULL")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ═══════════════════════════════════════════════════════════════
-- VERIFICAÇÃO FINAL
-- ═══════════════════════════════════════════════════════════════
SELECT 
  '✅ MIGRATION 005 CONCLUÍDA COM SUCESSO!' AS status,
  'Sistema de banimento completo instalado' AS message;

-- Mostrar colunas adicionadas
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'muonline' 
  AND TABLE_NAME = 'accounts'
  AND COLUMN_NAME IN ('banned', 'ban_reason', 'ban_date', 'ban_expires', 'banned_by')
ORDER BY COLUMN_NAME;
