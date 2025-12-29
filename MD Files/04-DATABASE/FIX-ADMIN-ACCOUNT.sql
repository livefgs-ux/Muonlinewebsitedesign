-- ═══════════════════════════════════════════════════════════════
-- FIX ADMIN ACCOUNT - SEASON 19 DV TEAMS
-- ═══════════════════════════════════════════════════════════════
-- Este script:
-- 1. Verifica se a conta "admin" existe
-- 2. Mostra o valor atual de web_admin
-- 3. Atualiza para web_admin = 1
-- 4. Verifica se funcionou
-- ═══════════════════════════════════════════════════════════════

USE muonline;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 1: Verificar conta "admin"
-- ═══════════════════════════════════════════════════════════════

SELECT 
  '🔍 VERIFICANDO CONTA ADMIN...' AS status;

SELECT 
  guid,
  account,
  email,
  blocked,
  web_admin,
  CASE 
    WHEN web_admin > 0 THEN '✅ É ADMIN'
    ELSE '❌ NÃO É ADMIN'
  END AS status_admin
FROM accounts
WHERE account = 'admin';

-- ═══════════════════════════════════════════════════════════════
-- PASSO 2: Atualizar para admin
-- ═══════════════════════════════════════════════════════════════

SELECT 
  '🔧 ATUALIZANDO PARA ADMIN...' AS status;

UPDATE accounts 
SET web_admin = 1 
WHERE account = 'admin';

-- ═══════════════════════════════════════════════════════════════
-- PASSO 3: Verificar se funcionou
-- ═══════════════════════════════════════════════════════════════

SELECT 
  '✅ VERIFICANDO RESULTADO...' AS status;

SELECT 
  guid,
  account,
  email,
  blocked,
  web_admin,
  CASE 
    WHEN web_admin > 0 THEN '✅ É ADMIN'
    ELSE '❌ NÃO É ADMIN'
  END AS status_admin
FROM accounts
WHERE account = 'admin';

-- ═══════════════════════════════════════════════════════════════
-- PASSO 4: Listar TODOS os admins
-- ═══════════════════════════════════════════════════════════════

SELECT 
  '👑 TODAS AS CONTAS ADMIN:' AS status;

SELECT 
  guid,
  account,
  email,
  web_admin
FROM accounts
WHERE web_admin > 0
ORDER BY web_admin DESC, account;

-- ═══════════════════════════════════════════════════════════════
-- RESULTADO ESPERADO
-- ═══════════════════════════════════════════════════════════════
-- Se tudo deu certo, você verá:
-- 
-- guid | account | email         | blocked | web_admin | status_admin
-- -----|---------|---------------|---------|-----------|-------------
-- 1    | admin   | admin@mu.com  | 0       | 1         | ✅ É ADMIN
-- 
-- ═══════════════════════════════════════════════════════════════
-- IMPORTANTE:
-- Após executar este SQL, você DEVE:
-- 1. Fazer logout no site
-- 2. Fazer login novamente com a conta "admin"
-- 3. Limpar cache do navegador (Ctrl+Shift+Delete)
-- 4. Verificar console do backend: pm2 logs meumu-backend
-- 
-- O log do backend deve mostrar:
-- 👤 Tipo de conta: ADMIN (web_admin: 1)
-- ═══════════════════════════════════════════════════════════════
