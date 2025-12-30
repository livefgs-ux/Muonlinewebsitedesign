-- ═══════════════════════════════════════════════════════════════
-- DIAGNÓSTICO: Estrutura da tabela accounts
-- ═══════════════════════════════════════════════════════════════

USE muonline;

-- Mostrar estrutura completa da tabela accounts
DESCRIBE accounts;

-- Mostrar todas as colunas
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'muonline' 
  AND TABLE_NAME = 'accounts'
ORDER BY ORDINAL_POSITION;
