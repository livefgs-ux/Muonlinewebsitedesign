-- ═══════════════════════════════════════════════════════════════
-- MIGRATION 005 (ALTERNATIVA): Criar tabela de bans separada
-- Data: 2025-12-30
-- Autor: Sistema MeuMU Online V577
-- Database: meuweb (database do site)
-- ═══════════════════════════════════════════════════════════════
-- Esta abordagem NÃO modifica a tabela accounts do servidor MU
-- ═══════════════════════════════════════════════════════════════

USE meuweb;

-- Criar tabela de bans se não existir
CREATE TABLE IF NOT EXISTS account_bans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_name VARCHAR(50) NOT NULL UNIQUE,
  account_email VARCHAR(255) DEFAULT NULL,
  banned TINYINT(1) DEFAULT 1 NOT NULL,
  ban_reason TEXT NULL,
  ban_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ban_expires TIMESTAMP NULL,
  banned_by VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_account_name (account_name),
  INDEX idx_banned (banned),
  INDEX idx_ban_expires (ban_expires)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT '✅ Tabela account_bans criada com sucesso!' AS status;

-- Mostrar estrutura
DESCRIBE account_bans;
