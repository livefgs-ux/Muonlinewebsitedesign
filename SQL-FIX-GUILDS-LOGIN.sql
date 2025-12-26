-- ═══════════════════════════════════════════════════════════════
-- MEUMU ONLINE - SQL DE CORREÇÃO
-- ═══════════════════════════════════════════════════════════════
-- Execute estes comandos no MariaDB para corrigir os problemas
-- ═══════════════════════════════════════════════════════════════

USE muonline;

-- ───────────────────────────────────────────────────────────────
-- 1. CORRIGIR TABELA DE GUILDS (Erro 500 no ranking)
-- ───────────────────────────────────────────────────────────────

-- Verificar se a coluna 'score' existe, se não, criar
-- (Isso resolve o erro 500 no ranking de guilds)

-- Para Season 19:
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS member_count INT DEFAULT 0;
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS emblem VARBINARY(32) DEFAULT NULL;

-- Se você estiver usando Season 6, pode precisar de:
-- ALTER TABLE Guild ADD COLUMN IF NOT EXISTS G_Score INT DEFAULT 0;

-- ───────────────────────────────────────────────────────────────
-- 2. VERIFICAR ESTRUTURA DE ACCOUNTS (Erro 401 no login)
-- ───────────────────────────────────────────────────────────────

-- Mostrar estrutura da tabela de contas
DESCRIBE accounts;

-- Verificar se há contas cadastradas
SELECT account, password, email, blocked 
FROM accounts 
LIMIT 5;

-- Se a estrutura for Season 6 (memb___id), use:
-- SELECT memb___id, memb__pwd, mail_addr, bloc_code FROM accounts LIMIT 5;

-- ───────────────────────────────────────────────────────────────
-- 3. CRIAR CONTA DE TESTE (para testar login)
-- ───────────────────────────────────────────────────────────────

-- Senha: "senha123" em MD5 = "e10adc3949ba59abbe56e057f20f883e"

-- Para Season 19:
INSERT INTO accounts (account, password, email, created_at, blocked, vip_level, cash_credits)
VALUES ('testefab', 'e10adc3949ba59abbe56e057f20f883e', 'teste@meumu.com', NOW(), 0, 0, 0)
ON DUPLICATE KEY UPDATE password = 'e10adc3949ba59abbe56e057f20f883e';

-- Para Season 6:
-- INSERT INTO accounts (memb___id, memb__pwd, memb_name, sno__numb, mail_addr, bloc_code)
-- VALUES ('testefab', 'e10adc3949ba59abbe56e057f20f883e', 'testefab', '1234567890123', 'teste@meumu.com', '0')
-- ON DUPLICATE KEY UPDATE memb__pwd = 'e10adc3949ba59abbe56e057f20f883e';

-- ───────────────────────────────────────────────────────────────
-- 4. VERIFICAR SE A SENHA ESTÁ CORRETA
-- ───────────────────────────────────────────────────────────────

-- Verificar hash MD5 da conta de teste
SELECT 
    account,
    password,
    CHAR_LENGTH(password) as tamanho_hash,
    blocked
FROM accounts
WHERE account = 'testefab';

-- Se retornar tamanho_hash = 32, está em MD5 correto
-- Se retornar outro valor, a senha não está em MD5

-- ───────────────────────────────────────────────────────────────
-- 5. ATUALIZAR SENHA DE CONTA EXISTENTE PARA MD5
-- ───────────────────────────────────────────────────────────────

-- Se você já tem uma conta e quer atualizar a senha para MD5:
-- (Substitua 'seunome' pelo seu username e 'suasenha' pela senha desejada)

-- Gere o MD5 primeiro em: https://www.md5hashgenerator.com/
-- Exemplo: "senha123" = "e10adc3949ba59abbe56e057f20f883e"

-- Season 19:
-- UPDATE accounts SET password = 'e10adc3949ba59abbe56e057f20f883e' WHERE account = 'seunome';

-- Season 6:
-- UPDATE accounts SET memb__pwd = 'e10adc3949ba59abbe56e057f20f883e' WHERE memb___id = 'seunome';

-- ───────────────────────────────────────────────────────────────
-- 6. LISTAR TODAS AS GUILDS (verificar dados)
-- ───────────────────────────────────────────────────────────────

SELECT name, score, member_count, emblem
FROM guild_list
ORDER BY score DESC
LIMIT 10;

-- Se retornar erro "Unknown column", execute os ALTER TABLE acima

-- ═══════════════════════════════════════════════════════════════
-- FIM DO SCRIPT
-- ═══════════════════════════════════════════════════════════════

-- INSTRUÇÕES DE USO:
-- 1. Copie este arquivo para o servidor
-- 2. Execute: mysql -u root -p < SQL-FIX-GUILDS-LOGIN.sql
-- 3. Ou copie e cole no MySQL Workbench
-- 4. Reinicie o backend: pm2 restart all
