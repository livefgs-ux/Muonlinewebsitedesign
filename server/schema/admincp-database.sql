-- ============================================================
-- AdminCP - Database Schema (webmu database)
-- MeuMU Online - Season 19-2-3
-- Sistema completo de gerenciamento administrativo
-- ============================================================

-- Cria banco webmu se não existir
CREATE DATABASE IF NOT EXISTS webmu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE webmu;

-- ============================================================
-- TABELA: webmu_news
-- Notícias com suporte multiidioma
-- ============================================================
CREATE TABLE IF NOT EXISTS webmu_news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL DEFAULT 'updates',
  author VARCHAR(50) NOT NULL,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  visible_home BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_published (published_at),
  INDEX idx_category (category),
  INDEX idx_visible_home (visible_home)
) ENGINE=InnoDB;

-- ============================================================
-- TABELA: webmu_news_translations
-- Traduções das notícias
-- ============================================================
CREATE TABLE IF NOT EXISTS webmu_news_translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  news_id INT NOT NULL,
  language VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  FOREIGN KEY (news_id) REFERENCES webmu_news(id) ON DELETE CASCADE,
  UNIQUE KEY unique_translation (news_id, language),
  INDEX idx_language (language)
) ENGINE=InnoDB;

-- ============================================================
-- TABELA: webmu_settings
-- Configurações globais do sistema
-- ============================================================
CREATE TABLE IF NOT EXISTS webmu_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  description VARCHAR(255),
  type VARCHAR(20) DEFAULT 'string',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB;

-- ============================================================
-- TABELA: webmu_site_config
-- Configuração visual do site (Site Editor)
-- ============================================================
CREATE TABLE IF NOT EXISTS webmu_site_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  key_name VARCHAR(100) NOT NULL,
  value TEXT,
  type VARCHAR(20) DEFAULT 'string',
  description VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_config (section, key_name),
  INDEX idx_section (section)
) ENGINE=InnoDB;

-- ============================================================
-- TABELA: webmu_plugins
-- Gerenciador de plugins
-- ============================================================
CREATE TABLE IF NOT EXISTS webmu_plugins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  version VARCHAR(20) NOT NULL,
  author VARCHAR(100),
  description TEXT,
  status ENUM('enabled', 'disabled') DEFAULT 'disabled',
  compatible_versions JSON,
  entry_point VARCHAR(255),
  config_schema JSON,
  installed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- TABELA: webmu_crons
-- Gerenciador de tarefas agendadas
-- ============================================================
CREATE TABLE IF NOT EXISTS webmu_crons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  interval_minutes INT NOT NULL DEFAULT 10,
  status ENUM('active', 'paused', 'disabled') DEFAULT 'active',
  last_run DATETIME,
  next_run DATETIME,
  average_duration INT DEFAULT 0,
  total_executions INT DEFAULT 0,
  failed_executions INT DEFAULT 0,
  last_error TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_next_run (next_run)
) ENGINE=InnoDB;

-- ============================================================
-- TABELA: webmu_cron_executions
-- Histórico de execuções de cron jobs
-- ============================================================
CREATE TABLE IF NOT EXISTS webmu_cron_executions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cron_id INT NOT NULL,
  status ENUM('success', 'failed') NOT NULL,
  duration INT,
  error_message TEXT,
  executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cron_id) REFERENCES webmu_crons(id) ON DELETE CASCADE,
  INDEX idx_cron_id (cron_id),
  INDEX idx_executed_at (executed_at)
) ENGINE=InnoDB;

-- ============================================================
-- TABELA: webmu_logs
-- Sistema de logs e auditoria
-- ============================================================
CREATE TABLE IF NOT EXISTS webmu_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_user VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  details JSON,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_user (admin_user),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- TABELA: webmu_roadmap
-- Roadmap de desenvolvimento
-- ============================================================
CREATE TABLE IF NOT EXISTS webmu_roadmap (
  id INT AUTO_INCREMENT PRIMARY KEY,
  version VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('planned', 'in_progress', 'completed', 'cancelled') DEFAULT 'planned',
  release_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_release_date (release_date)
) ENGINE=InnoDB;

-- ============================================================
-- INSERIR CONFIGURAÇÕES PADRÃO
-- ============================================================

-- Configurações de sistema
INSERT IGNORE INTO webmu_settings (key_name, value, category, description, type) VALUES
('server_name', 'MeuMU Online', 'general', 'Nome do servidor', 'string'),
('server_season', '19-2-3', 'general', 'Season do servidor', 'string'),
('server_exp', '1000', 'game', 'Taxa de experiência', 'number'),
('server_drop', '50', 'game', 'Taxa de drop', 'number'),
('reset_level', '400', 'game', 'Nível para reset', 'number'),
('reset_zen', '5000000', 'game', 'Custo de reset em Zen', 'number'),
('max_resets', '999', 'game', 'Máximo de resets', 'number'),
('discord_link', 'https://discord.gg/meumu', 'social', 'Link do Discord', 'string'),
('whatsapp_link', 'https://wa.me/5511999999999', 'social', 'Link do WhatsApp', 'string');

-- Configuração do site
INSERT IGNORE INTO webmu_site_config (section, key_name, value, type) VALUES
('home_banner', 'title', 'MeuMU Online', 'string'),
('home_banner', 'subtitle', 'Season 19-2-3 - Épico', 'string'),
('home_banner', 'description', 'Servidor hardcore para quem gosta de emoção', 'string'),
('home_banner', 'button_text', 'Começar Agora', 'string'),
('home_banner', 'button_link', '#downloads', 'string'),
('social', 'discord', 'https://discord.gg/meumu', 'string'),
('social', 'whatsapp', 'https://wa.me/5511999999999', 'string'),
('social', 'facebook', '', 'string'),
('social', 'instagram', '', 'string'),
('social', 'youtube', '', 'string');

-- Cron jobs padrão
INSERT IGNORE INTO webmu_crons (name, slug, description, interval_minutes, next_run) VALUES
('Atualizar Rankings', 'rank_update', 'Atualiza o ranking de jogadores a cada 10 minutos', 10, NOW()),
('Status de Eventos', 'event_status', 'Sincroniza status de Castle Siege e eventos', 5, NOW()),
('Limpar Logs Antigos', 'log_cleanup', 'Remove logs com mais de 30 dias', 1440, NOW()),
('Backup WebMU', 'backup_sync', 'Realiza backup do banco webmu', 720, NOW());

-- Roadmap inicial
INSERT IGNORE INTO webmu_roadmap (version, title, description, status, release_date) VALUES
('1.0.0', 'Launch do AdminCP', 'Sistema administrativo completo com 10 módulos', 'completed', '2025-01-01'),
('1.1.0', 'Sistema de Plugins', 'Arquitetura modular com suporte a plugins', 'completed', '2025-01-15'),
('1.2.0', 'Editor Visual do Site', 'Editor integrado para personalização visual', 'completed', '2025-01-20'),
('1.3.0', 'Sistema de Logs Avançado', 'Auditoria completa de ações administrativas', 'completed', '2025-01-25'),
('2.0.0', 'AdminCP Mobile', 'Interface responsiva para administração mobile', 'planned', '2025-03-01');

-- ============================================================
-- VIEWS ÚTEIS
-- ============================================================

-- View de estatísticas de logs
CREATE OR REPLACE VIEW v_log_stats AS
SELECT 
  DATE(created_at) as date,
  admin_user,
  action,
  COUNT(*) as count
FROM webmu_logs
GROUP BY DATE(created_at), admin_user, action;

-- View de performance de crons
CREATE OR REPLACE VIEW v_cron_performance AS
SELECT 
  c.id,
  c.name,
  c.slug,
  c.status,
  c.total_executions,
  c.failed_executions,
  c.average_duration,
  ROUND((c.failed_executions / NULLIF(c.total_executions, 0)) * 100, 2) as failure_rate,
  c.last_run,
  c.next_run
FROM webmu_crons c;

-- ============================================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ============================================================

-- Logs
ALTER TABLE webmu_logs ADD INDEX idx_created_action (created_at, action);
ALTER TABLE webmu_logs ADD INDEX idx_admin_action (admin_user, action);

-- Crons
ALTER TABLE webmu_crons ADD INDEX idx_status_next (status, next_run);

-- News
ALTER TABLE webmu_news ADD INDEX idx_featured_published (featured, published_at);
ALTER TABLE webmu_news ADD INDEX idx_visible_published (visible_home, published_at);

-- ============================================================
-- TRIGGERS PARA AUDITORIA AUTOMÁTICA
-- ============================================================

DELIMITER //

-- Trigger para logar mudanças em configurações
CREATE TRIGGER IF NOT EXISTS tr_settings_audit
AFTER UPDATE ON webmu_settings
FOR EACH ROW
BEGIN
  INSERT INTO webmu_logs (admin_user, action, details, created_at)
  VALUES (
    COALESCE(@current_admin_user, 'SYSTEM'),
    'setting_auto_update',
    JSON_OBJECT(
      'key', NEW.key_name,
      'old_value', OLD.value,
      'new_value', NEW.value
    ),
    NOW()
  );
END//

DELIMITER ;

-- ============================================================
-- FIM DO SCHEMA
-- ============================================================

-- Mostrar resumo
SELECT 
  'AdminCP Database Schema criado com sucesso!' as message,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'webmu') as total_tables,
  (SELECT COUNT(*) FROM webmu_settings) as default_settings,
  (SELECT COUNT(*) FROM webmu_crons) as active_crons;
