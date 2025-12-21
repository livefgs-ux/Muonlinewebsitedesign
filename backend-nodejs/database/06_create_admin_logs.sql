-- =====================================================
-- TABELA DE LOGS ADMINISTRATIVOS (AUDIT TRAIL)
-- Sistema completo de auditoria de ações administrativas
-- =====================================================

CREATE TABLE IF NOT EXISTS AdminLogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Identificação do Admin
  admin_account VARCHAR(50) NOT NULL COMMENT 'Conta do administrador que realizou a ação',
  admin_email VARCHAR(100) DEFAULT NULL COMMENT 'Email do admin (se disponível)',
  
  -- Detalhes da Ação
  action_type VARCHAR(50) NOT NULL COMMENT 'Tipo de ação (CREATE, UPDATE, DELETE, BAN, etc)',
  action_category VARCHAR(50) DEFAULT 'GENERAL' COMMENT 'Categoria (USER, ITEM, CONFIG, SECURITY, etc)',
  description TEXT NOT NULL COMMENT 'Descrição detalhada da ação',
  
  -- Dados Técnicos
  target_table VARCHAR(50) DEFAULT NULL COMMENT 'Tabela afetada pela ação',
  target_id VARCHAR(100) DEFAULT NULL COMMENT 'ID do registro afetado',
  old_value TEXT DEFAULT NULL COMMENT 'Valor anterior (JSON)',
  new_value TEXT DEFAULT NULL COMMENT 'Novo valor (JSON)',
  
  -- Informações de Segurança
  ip_address VARCHAR(45) NOT NULL COMMENT 'IP do administrador',
  user_agent TEXT DEFAULT NULL COMMENT 'User Agent do navegador',
  session_id VARCHAR(100) DEFAULT NULL COMMENT 'ID da sessão',
  
  -- Severidade e Status
  severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM' COMMENT 'Nível de severidade',
  status ENUM('SUCCESS', 'FAILED', 'PENDING') DEFAULT 'SUCCESS' COMMENT 'Status da ação',
  
  -- Timestamp
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Data e hora da ação',
  
  -- Indexes
  INDEX idx_admin_account (admin_account),
  INDEX idx_action_type (action_type),
  INDEX idx_created_at (created_at),
  INDEX idx_severity (severity),
  INDEX idx_category (action_category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro completo de ações administrativas para auditoria';

-- =====================================================
-- INSERIR ALGUNS LOGS DE EXEMPLO (OPCIONAL)
-- =====================================================
INSERT INTO AdminLogs (admin_account, action_type, action_category, description, ip_address, severity) VALUES
('admin', 'LOGIN', 'SECURITY', 'Login no painel administrativo', '127.0.0.1', 'LOW'),
('admin', 'CREATE', 'EVENT', 'Criou novo evento: Blood Castle', '127.0.0.1', 'MEDIUM'),
('admin', 'UPDATE', 'CONFIG', 'Atualizou configurações de WCoin', '127.0.0.1', 'HIGH'),
('admin', 'BAN', 'USER', 'Baniu usuário TestUser123 por hack', '127.0.0.1', 'CRITICAL');
