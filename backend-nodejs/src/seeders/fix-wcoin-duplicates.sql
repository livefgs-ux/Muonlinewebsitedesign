-- ═════════════════════════════════════════════════════════════════
-- MEUMU ONLINE - FIX WCOIN DUPLICATES
-- Remove pacotes de WCoin duplicados e recria corretamente
-- ═════════════════════════════════════════════════════════════════

USE meuweb;

-- 1. MOSTRAR PACOTES ATUAIS (para backup mental)
SELECT '📊 PACOTES ATUAIS (ANTES DA LIMPEZA):' AS info;
SELECT id, name, wcoin_amount, price, currency, is_active FROM wcoin_packages ORDER BY price ASC;

-- 2. DELETAR TODOS OS PACOTES (CUIDADO!)
DELETE FROM wcoin_packages;

-- 3. RESETAR AUTO_INCREMENT
ALTER TABLE wcoin_packages AUTO_INCREMENT = 1;

-- 4. CRIAR PACOTES CORRETOS (1 de cada valor)

-- Pacote R$ 10
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Iniciante', 1000, 0, '10.00', 'BRL', '#', 1, 1);

-- Pacote R$ 30
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Bronze', 3000, 300, '30.00', 'BRL', '#', 1, 2);

-- Pacote R$ 60
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Prata', 6000, 900, '60.00', 'BRL', '#', 1, 3);

-- Pacote R$ 120
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Ouro', 12000, 2400, '120.00', 'BRL', '#', 1, 4);

-- Pacote R$ 300
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Diamante', 30000, 7500, '300.00', 'BRL', '#', 1, 5);

-- Pacote R$ 600
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Lendário', 60000, 18000, '600.00', 'BRL', '#', 1, 6);

-- 5. VERIFICAR RESULTADO
SELECT '✅ PACOTES APÓS CORREÇÃO:' AS info;
SELECT id, name, wcoin_amount, bonus_amount, price, currency, is_active, display_order 
FROM wcoin_packages 
ORDER BY display_order ASC;

SELECT CONCAT('✅ Total de pacotes: ', COUNT(*)) AS resultado FROM wcoin_packages;
