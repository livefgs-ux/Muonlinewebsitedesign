-- ═══════════════════════════════════════════════════════════════════
-- MeuMU Online - Schema da Database WEBMU
-- Criado automaticamente pelo instalador v2.0.0
-- ═══════════════════════════════════════════════════════════════════

-- Tabela de notícias
CREATE TABLE IF NOT EXISTS `WEBMU_NEWS` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `author` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `published` tinyint(1) NOT NULL DEFAULT 1,
  `views` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_published` (`published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de traduções de notícias
CREATE TABLE IF NOT EXISTS `WEBMU_NEWS_TRANSLATIONS` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `news_id` int(11) NOT NULL,
  `language` varchar(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_news_id` (`news_id`),
  KEY `idx_language` (`language`),
  CONSTRAINT `fk_news_translations` FOREIGN KEY (`news_id`) REFERENCES `WEBMU_NEWS` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de banimentos
CREATE TABLE IF NOT EXISTS `WEBMU_BANS` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) NOT NULL,
  `reason` varchar(500) NOT NULL,
  `banned_by` varchar(100) NOT NULL,
  `banned_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime DEFAULT NULL,
  `permanent` tinyint(1) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_account` (`account`),
  KEY `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de log de banimentos
CREATE TABLE IF NOT EXISTS `WEBMU_BAN_LOG` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ban_id` int(11) NOT NULL,
  `action` enum('created','updated','removed','expired') NOT NULL,
  `performed_by` varchar(100) NOT NULL,
  `performed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ban_id` (`ban_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de IPs bloqueados
CREATE TABLE IF NOT EXISTS `WEBMU_BLOCKED_IP` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `reason` varchar(500) NOT NULL,
  `blocked_by` varchar(100) NOT NULL,
  `blocked_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_ip_address` (`ip_address`),
  KEY `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de votos
CREATE TABLE IF NOT EXISTS `WEBMU_VOTES` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) NOT NULL,
  `site_id` int(11) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `voted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reward_claimed` tinyint(1) NOT NULL DEFAULT 0,
  `reward_amount` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_account` (`account`),
  KEY `idx_site_id` (`site_id`),
  KEY `idx_voted_at` (`voted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de log de votos
CREATE TABLE IF NOT EXISTS `WEBMU_VOTE_LOGS` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vote_id` int(11) NOT NULL,
  `action` enum('vote','reward_claimed') NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vote_id` (`vote_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de sites de votação
CREATE TABLE IF NOT EXISTS `WEBMU_VOTE_SITES` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `url` varchar(500) NOT NULL,
  `icon` varchar(500) DEFAULT NULL,
  `reward_amount` int(11) NOT NULL DEFAULT 0,
  `cooldown_hours` int(11) NOT NULL DEFAULT 12,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de downloads
CREATE TABLE IF NOT EXISTS `WEBMU_DOWNLOADS` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `file_url` varchar(500) NOT NULL,
  `file_size` varchar(50) DEFAULT NULL,
  `version` varchar(50) DEFAULT NULL,
  `downloads` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de registro de contas
CREATE TABLE IF NOT EXISTS `WEBMU_REGISTER_ACCOUNT` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `registered_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `verification_token` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_account` (`account`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de requisições de mudança de senha
CREATE TABLE IF NOT EXISTS `WEBMU_PASSCHANGE_REQUEST` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `requested_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `ip_address` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_token` (`token`),
  KEY `idx_account` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de configuração de créditos
CREATE TABLE IF NOT EXISTS `WEBMU_CREDITS_CONFIG` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `credit_name` varchar(50) NOT NULL,
  `credit_type` enum('wcoin','credits','goblin_points') NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `default_amount` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de logs de créditos
CREATE TABLE IF NOT EXISTS `WEBMU_CREDITS_LOGS` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) NOT NULL,
  `credit_type` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL,
  `reason` varchar(500) NOT NULL,
  `performed_by` varchar(100) DEFAULT NULL,
  `performed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_account` (`account`),
  KEY `idx_performed_at` (`performed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de transações PayPal
CREATE TABLE IF NOT EXISTS `WEBMU_PAYPAL_TRANSACTIONS` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `credits_received` int(11) NOT NULL,
  `status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_transaction_id` (`transaction_id`),
  KEY `idx_account` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de plugins
CREATE TABLE IF NOT EXISTS `WEBMU_PLUGINS` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `version` varchar(50) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 0,
  `settings` text,
  `installed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de cron jobs
CREATE TABLE IF NOT EXISTS `WEBMU_CRON` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_name` varchar(100) NOT NULL,
  `schedule` varchar(100) NOT NULL,
  `last_run` datetime DEFAULT NULL,
  `next_run` datetime DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `command` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_job_name` (`job_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de países das contas
CREATE TABLE IF NOT EXISTS `WEBMU_ACCOUNT_COUNTRY` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) NOT NULL,
  `country_code` varchar(2) NOT NULL,
  `country_name` varchar(100) NOT NULL,
  `detected_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_account` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela FLA (Failed Login Attempts)
CREATE TABLE IF NOT EXISTS `WEBMU_FLA` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) NOT NULL,
  `attempted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_agent` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_attempted_at` (`attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════════
-- DADOS INICIAIS
-- ═══════════════════════════════════════════════════════════════════

-- Notícia de boas-vindas
INSERT IGNORE INTO `WEBMU_NEWS` (`id`, `title`, `content`, `author`, `published`) VALUES
(1, 'Bem-vindo ao MeuMU Online!', 'Seu servidor MU Online Season 19-2-3 Épico está pronto! Configure eventos, rankings e muito mais através do AdminCP.', 'Sistema', 1);

-- Sites de votação exemplo
INSERT IGNORE INTO `WEBMU_VOTE_SITES` (`id`, `name`, `url`, `reward_amount`, `cooldown_hours`, `active`, `sort_order`) VALUES
(1, 'XtremeTop100', 'https://www.xtremetop100.com/', 10, 12, 0, 1),
(2, 'TopG', 'https://topg.org/', 10, 12, 0, 2);

-- Configuração de créditos padrão
INSERT IGNORE INTO `WEBMU_CREDITS_CONFIG` (`id`, `credit_name`, `credit_type`, `enabled`, `default_amount`) VALUES
(1, 'WCoins', 'wcoin', 1, 100),
(2, 'Créditos', 'credits', 1, 50),
(3, 'Goblin Points', 'goblin_points', 1, 25);

-- ═══════════════════════════════════════════════════════════════════
-- FIM DO SCHEMA
-- ═══════════════════════════════════════════════════════════════════
