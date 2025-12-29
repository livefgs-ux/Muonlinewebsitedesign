-- ═══════════════════════════════════════════════════════════════
-- MIGRATION 004: Criar tabela de plugins
-- V564 - Sistema de Plugins
-- ═══════════════════════════════════════════════════════════════

USE meuweb;

-- Criar tabela plugins
CREATE TABLE IF NOT EXISTS plugins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  version VARCHAR(50) DEFAULT '1.0.0',
  author VARCHAR(255) DEFAULT 'Admin',
  enabled BOOLEAN DEFAULT FALSE,
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir plugins padrão (exemplos)
INSERT INTO plugins (name, description, version, author, enabled) VALUES
('Anti-DDoS Protection', 'Proteção avançada contra ataques DDoS', '1.0.0', 'MeuMU Team', true),
('Auto Backup', 'Backup automático do banco de dados', '1.0.0', 'MeuMU Team', true),
('Discord Integration', 'Integração com Discord (webhook, comandos)', '1.0.0', 'MeuMU Team', false),
('Email Notifications', 'Notificações por email (novos users, doações)', '1.0.0', 'MeuMU Team', false),
('Analytics Dashboard', 'Dashboard avançado com Google Analytics', '1.0.0', 'MeuMU Team', false)

ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ✅ Sucesso!
SELECT 'Tabela plugins criada com sucesso!' AS status;
