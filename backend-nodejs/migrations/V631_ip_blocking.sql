/**
 * SQL SCHEMA - V.631
 * Tabelas necessárias para novas funcionalidades
 * Database: meuweb (website database)
 */

-- ============================================================================
-- TABELA: blocked_ips
-- Sistema de bloqueio de IP (WebEngine Integration)
-- ============================================================================

CREATE TABLE IF NOT EXISTS `blocked_ips` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_address` VARCHAR(45) NOT NULL COMMENT 'IP bloqueado (IPv4 ou IPv6)',
  `reason` VARCHAR(500) NOT NULL COMMENT 'Motivo do bloqueio',
  `blocked_by` VARCHAR(50) NOT NULL COMMENT 'Admin que bloqueou',
  `blocked_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data do bloqueio',
  `expires_at` DATETIME NULL DEFAULT NULL COMMENT 'Data de expiração (NULL = permanente)',
  `status` ENUM('active', 'inactive', 'expired') NOT NULL DEFAULT 'active' COMMENT 'Status do bloqueio',
  `unblocked_by` VARCHAR(50) NULL DEFAULT NULL COMMENT 'Admin que desbloqueou',
  `unblocked_at` DATETIME NULL DEFAULT NULL COMMENT 'Data do desbloqueio',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip_address` (`ip_address`, `status`),
  KEY `idx_status` (`status`),
  KEY `idx_blocked_at` (`blocked_at`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Sistema de bloqueio de IPs - V.631';

-- ============================================================================
-- TABELA: blocked_ip_attempts
-- Log de tentativas de acesso de IPs bloqueados
-- ============================================================================

CREATE TABLE IF NOT EXISTS `blocked_ip_attempts` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_address` VARCHAR(45) NOT NULL COMMENT 'IP que tentou acessar',
  `attempted_url` VARCHAR(500) NOT NULL COMMENT 'URL que tentou acessar',
  `attempted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data da tentativa',
  PRIMARY KEY (`id`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_attempted_at` (`attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Log de tentativas de acesso bloqueadas - V.631';

-- ============================================================================
-- VERIFICAÇÕES E ÍNDICES
-- ============================================================================

-- Verificar se tabela existe
SELECT 
  TABLE_NAME, 
  ENGINE, 
  TABLE_ROWS, 
  CREATE_TIME
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'meuweb' 
  AND TABLE_NAME IN ('blocked_ips', 'blocked_ip_attempts');

-- ============================================================================
-- DADOS DE EXEMPLO (OPCIONAL - REMOVER EM PRODUÇÃO)
-- ============================================================================

-- Exemplo de IP bloqueado
INSERT IGNORE INTO `blocked_ips` 
  (`ip_address`, `reason`, `blocked_by`, `blocked_at`, `expires_at`, `status`)
VALUES 
  ('192.168.1.100', 'Tentativas excessivas de login', 'admin', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'active');

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

SELECT 
  '✅ Tabelas criadas com sucesso!' as status,
  'blocked_ips, blocked_ip_attempts' as tables_created,
  NOW() as migration_date,
  'V.631' as version;
