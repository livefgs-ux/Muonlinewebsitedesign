-- =====================================================
-- TABELA DE PACOTES DE WCOIN
-- Sistema configurável de pacotes de WCoin para venda
-- =====================================================

CREATE TABLE IF NOT EXISTS wcoin_packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Informações do Pacote
  name VARCHAR(100) NOT NULL COMMENT 'Nome do pacote (ex: Pacote Iniciante)',
  wcoin_amount INT NOT NULL COMMENT 'Quantidade de WCoin do pacote',
  bonus_amount INT DEFAULT 0 COMMENT 'Quantidade de WCoin bônus',
  
  -- Preço
  price DECIMAL(10, 2) NOT NULL COMMENT 'Preço do pacote',
  currency VARCHAR(10) DEFAULT 'BRL' COMMENT 'Moeda (BRL, USD, EUR, etc)',
  
  -- Link de Compra
  purchase_link VARCHAR(500) DEFAULT '#' COMMENT 'URL para comprar o pacote',
  
  -- Controles
  is_active TINYINT(1) DEFAULT 1 COMMENT 'Pacote ativo (1) ou inativo (0)',
  display_order INT DEFAULT 0 COMMENT 'Ordem de exibição (menor primeiro)',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices
  INDEX idx_active (is_active),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DADOS PADRÃO (Exemplo com preços brasileiros)
-- =====================================================

INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, display_order) VALUES
('Pacote Iniciante', 100, 0, 10.00, 'BRL', '#', 1),
('Pacote Bronze', 300, 20, 30.00, 'BRL', '#', 2),
('Pacote Prata', 600, 50, 60.00, 'BRL', '#', 3),
('Pacote Ouro', 1200, 150, 120.00, 'BRL', '#', 4),
('Pacote Platina', 3000, 500, 300.00, 'BRL', '#', 5),
('Pacote Diamante', 6000, 1200, 600.00, 'BRL', '#', 6);

-- =====================================================
-- NOTAS DE USO
-- =====================================================

-- Para adicionar um novo pacote:
-- INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, display_order)
-- VALUES ('Pacote VIP', 10000, 2500, 1000.00, 'BRL', 'https://mercadopago.com.br/checkout/...', 7);

-- Para desativar um pacote:
-- UPDATE wcoin_packages SET is_active = 0 WHERE id = 1;

-- Para reativar um pacote:
-- UPDATE wcoin_packages SET is_active = 1 WHERE id = 1;

-- Para alterar preço:
-- UPDATE wcoin_packages SET price = 15.00 WHERE id = 1;

-- Para alterar link de compra:
-- UPDATE wcoin_packages SET purchase_link = 'https://nova-url.com' WHERE id = 1;

-- Para listar apenas pacotes ativos ordenados:
-- SELECT * FROM wcoin_packages WHERE is_active = 1 ORDER BY display_order ASC;
