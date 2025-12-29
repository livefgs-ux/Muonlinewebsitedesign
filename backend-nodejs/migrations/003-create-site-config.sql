-- ═══════════════════════════════════════════════════════════════
-- MIGRATION 003: Criar tabela de configurações do site
-- V563 - Site Editor
-- ═══════════════════════════════════════════════════════════════

USE meuweb;

-- Criar tabela site_config
CREATE TABLE IF NOT EXISTS site_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  config_key VARCHAR(255) UNIQUE NOT NULL,
  config_value TEXT,
  config_group VARCHAR(50) DEFAULT 'general',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_group (config_group),
  INDEX idx_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir configurações padrão
INSERT INTO site_config (config_key, config_value, config_group) VALUES
-- Background
('backgroundImage', 'https://i.postimg.cc/1XHKxhv1/8393fd9b_a4f8_4ab5_a5c2_dafceeb7e666.png', 'visual'),
('particleColor', '#FFB800', 'visual'),

-- Home Banner
('title', 'MeuMU Online', 'home_banner'),
('subtitle', 'Season 19-2-3 - Épico', 'home_banner'),
('description', 'Servidor hardcore para quem gosta de emoção', 'home_banner'),
('buttonText', 'Começar Agora', 'home_banner'),
('buttonLink', '#downloads', 'home_banner'),

-- Social Links
('discord', 'https://discord.gg/meumu', 'social'),
('whatsapp', 'https://wa.me/5511999999999', 'social'),
('facebook', '', 'social'),
('instagram', '', 'social'),
('youtube', '', 'social'),

-- Site Settings
('serverName', 'MeuMU Online', 'site'),
('serverSeason', '19-2-3', 'site'),
('maintenanceMode', 'false', 'site'),
('googleAnalytics', '', 'site'),
('metaDescription', 'Melhor servidor de Mu Online - Season 19-2-3', 'site'),
('metaKeywords', 'mu online, muonline, servidor mu, season 19', 'site')

ON DUPLICATE KEY UPDATE config_value = VALUES(config_value);

-- ✅ Sucesso!
SELECT 'Tabela site_config criada com sucesso!' AS status;
