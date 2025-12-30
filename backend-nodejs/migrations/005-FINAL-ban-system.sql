-- ═══════════════════════════════════════════════════════════════
-- MIGRATION 005: Sistema de Banimento - VERSÃO ULTRA SEGURA
-- Data: 2025-12-30
-- Autor: Sistema MeuMU Online V577
-- Database: muonline (database do servidor MU)
-- ═══════════════════════════════════════════════════════════════
-- Esta versão VERIFICA cada coluna individualmente antes de criar
-- ═══════════════════════════════════════════════════════════════

USE muonline;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 1: VERIFICAR E ADICIONAR COLUNA 'banned'
-- ═══════════════════════════════════════════════════════════════
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;

DELIMITER $$
CREATE PROCEDURE AddColumnIfNotExists()
BEGIN
  DECLARE column_exists INT;
  
  -- Verificar se coluna 'banned' existe
  SELECT COUNT(*) INTO column_exists
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'muonline'
    AND TABLE_NAME = 'accounts'
    AND COLUMN_NAME = 'banned';
  
  IF column_exists = 0 THEN
    ALTER TABLE accounts ADD COLUMN banned TINYINT(1) DEFAULT 0 NOT NULL;
    SELECT '✅ Coluna banned adicionada' AS resultado;
  ELSE
    SELECT '✅ Coluna banned já existe' AS resultado;
  END IF;
  
  -- Verificar se coluna 'ban_reason' existe
  SELECT COUNT(*) INTO column_exists
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'muonline'
    AND TABLE_NAME = 'accounts'
    AND COLUMN_NAME = 'ban_reason';
  
  IF column_exists = 0 THEN
    ALTER TABLE accounts ADD COLUMN ban_reason TEXT NULL;
    SELECT '✅ Coluna ban_reason adicionada' AS resultado;
  ELSE
    SELECT '✅ Coluna ban_reason já existe' AS resultado;
  END IF;
  
  -- Verificar se coluna 'ban_date' existe
  SELECT COUNT(*) INTO column_exists
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'muonline'
    AND TABLE_NAME = 'accounts'
    AND COLUMN_NAME = 'ban_date';
  
  IF column_exists = 0 THEN
    ALTER TABLE accounts ADD COLUMN ban_date TIMESTAMP NULL;
    SELECT '✅ Coluna ban_date adicionada' AS resultado;
  ELSE
    SELECT '✅ Coluna ban_date já existe' AS resultado;
  END IF;
  
  -- Verificar se coluna 'ban_expires' existe
  SELECT COUNT(*) INTO column_exists
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'muonline'
    AND TABLE_NAME = 'accounts'
    AND COLUMN_NAME = 'ban_expires';
  
  IF column_exists = 0 THEN
    ALTER TABLE accounts ADD COLUMN ban_expires TIMESTAMP NULL;
    SELECT '✅ Coluna ban_expires adicionada' AS resultado;
  ELSE
    SELECT '✅ Coluna ban_expires já existe' AS resultado;
  END IF;
  
  -- Verificar se coluna 'banned_by' existe
  SELECT COUNT(*) INTO column_exists
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'muonline'
    AND TABLE_NAME = 'accounts'
    AND COLUMN_NAME = 'banned_by';
  
  IF column_exists = 0 THEN
    ALTER TABLE accounts ADD COLUMN banned_by VARCHAR(50) NULL;
    SELECT '✅ Coluna banned_by adicionada' AS resultado;
  ELSE
    SELECT '✅ Coluna banned_by já existe' AS resultado;
  END IF;
  
END$$
DELIMITER ;

-- Executar procedure
CALL AddColumnIfNotExists();

-- Limpar
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;

-- ═══════════════════════════════════════════════════════════════
-- VERIFICAÇÃO FINAL
-- ═══════════════════════════════════════════════════════════════
SELECT 
  '✅ MIGRATION 005 CONCLUÍDA!' AS status,
  'Sistema de banimento instalado' AS mensagem;

-- Mostrar colunas relacionadas a ban
SELECT 
  COLUMN_NAME AS coluna,
  COLUMN_TYPE AS tipo,
  IS_NULLABLE AS nullable,
  COLUMN_DEFAULT AS valor_padrao
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'muonline' 
  AND TABLE_NAME = 'accounts'
  AND COLUMN_NAME IN ('banned', 'ban_reason', 'ban_date', 'ban_expires', 'banned_by')
ORDER BY COLUMN_NAME;
