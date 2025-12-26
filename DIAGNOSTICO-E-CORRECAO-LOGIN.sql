-- ═══════════════════════════════════════════════════════════════
-- MEUMU ONLINE - DIAGNÓSTICO E CORREÇÃO DE LOGIN/REGISTRO
-- ═══════════════════════════════════════════════════════════════
-- Execute estas queries no MariaDB para diagnosticar e corrigir
-- ═══════════════════════════════════════════════════════════════

USE muonline;

-- ═══════════════════════════════════════════════════════════════
-- PARTE 1: DIAGNÓSTICO DA ESTRUTURA
-- ═══════════════════════════════════════════════════════════════

-- 1.1 - Verificar estrutura da tabela accounts
DESCRIBE accounts;

-- 1.2 - Verificar se é Season 6 ou Season 19
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'Season 19 (account, password, email)'
        ELSE 'Season 6 (memb___id, memb__pwd, mail_addr)'
    END as estrutura
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'muonline' 
  AND TABLE_NAME = 'accounts' 
  AND COLUMN_NAME = 'account';

-- 1.3 - Contar quantas contas existem
SELECT COUNT(*) as total_contas FROM accounts;

-- 1.4 - Mostrar primeiras 5 contas (verificar estrutura dos dados)
-- Season 19:
-- SELECT account, password, email, blocked, created_at FROM accounts LIMIT 5;

-- Season 6:
SELECT memb___id, memb__pwd, mail_addr, bloc_code, appl_days FROM accounts LIMIT 5;

-- ═══════════════════════════════════════════════════════════════
-- PARTE 2: VERIFICAR PROBLEMAS COMUNS
-- ═══════════════════════════════════════════════════════════════

-- 2.1 - Verificar contas com senha vazia ou NULL
SELECT 
    memb___id,
    CASE 
        WHEN memb__pwd IS NULL THEN 'NULL'
        WHEN memb__pwd = '' THEN 'VAZIO'
        WHEN CHAR_LENGTH(memb__pwd) = 32 THEN 'MD5 OK'
        ELSE CONCAT('TAMANHO ERRADO: ', CHAR_LENGTH(memb__pwd))
    END as status_senha
FROM accounts
LIMIT 10;

-- 2.2 - Verificar contas bloqueadas
SELECT COUNT(*) as contas_bloqueadas 
FROM accounts 
WHERE bloc_code = '1';

-- ═══════════════════════════════════════════════════════════════
-- PARTE 3: CRIAR CONTA DE TESTE PARA LOGIN
-- ═══════════════════════════════════════════════════════════════

-- 3.1 - Deletar conta de teste se já existir
DELETE FROM accounts WHERE memb___id = 'testefab';

-- 3.2 - Criar conta de teste
-- Username: testefab
-- Senha: senha123
-- MD5: e10adc3949ba59abbe56e057f20f883e

INSERT INTO accounts (
    memb___id, 
    memb__pwd, 
    memb_name, 
    sno__numb, 
    post_code, 
    addr_info, 
    addr_deta, 
    tel__numb, 
    phon_numb, 
    mail_addr, 
    fpas_ques, 
    fpas_answ, 
    job__code, 
    appl_days, 
    modi_days, 
    out__days, 
    true_days, 
    mail_chek, 
    bloc_code, 
    ctl1_code, 
    AccountLevel, 
    AccountExpireDate, 
    CashCredits
) VALUES (
    'testefab',                           -- memb___id
    'e10adc3949ba59abbe56e057f20f883e',   -- memb__pwd (MD5 de "senha123")
    'testefab',                           -- memb_name
    '0000000000000',                      -- sno__numb
    '000000',                             -- post_code
    'N/A',                                -- addr_info
    'N/A',                                -- addr_deta
    '000-0000-0000',                      -- tel__numb
    '000-0000-0000',                      -- phon_numb
    'testefab@meumu.com',                 -- mail_addr
    '',                                   -- fpas_ques
    '',                                   -- fpas_answ
    '',                                   -- job__code
    NOW(),                                -- appl_days
    NOW(),                                -- modi_days
    NOW(),                                -- out__days
    NOW(),                                -- true_days
    '1',                                  -- mail_chek
    '0',                                  -- bloc_code (0 = desbloqueado)
    '0',                                  -- ctl1_code (0 = usuário normal)
    '0',                                  -- AccountLevel
    NULL,                                 -- AccountExpireDate
    0                                     -- CashCredits
);

-- 3.3 - Verificar se a conta foi criada
SELECT 
    memb___id,
    memb__pwd,
    CHAR_LENGTH(memb__pwd) as tamanho_hash,
    mail_addr,
    bloc_code,
    appl_days
FROM accounts 
WHERE memb___id = 'testefab';

-- ═══════════════════════════════════════════════════════════════
-- PARTE 4: GERAR HASHES MD5 PARA SENHAS COMUNS
-- ═══════════════════════════════════════════════════════════════

-- Se você quiser usar MySQL para gerar hashes:
SELECT 
    'senha123' as senha,
    MD5('senha123') as hash_md5,
    CHAR_LENGTH(MD5('senha123')) as tamanho;

SELECT 
    '123456' as senha,
    MD5('123456') as hash_md5;

SELECT 
    'admin' as senha,
    MD5('admin') as hash_md5;

-- ═══════════════════════════════════════════════════════════════
-- PARTE 5: ATUALIZAR SENHA DE CONTA EXISTENTE
-- ═══════════════════════════════════════════════════════════════

-- Se você já tem uma conta e quer atualizar a senha:
-- (Substitua 'seunome' pelo username e use o hash MD5 da senha desejada)

-- Exemplo: Atualizar senha de 'fabricio' para 'senha123'
-- UPDATE accounts 
-- SET memb__pwd = 'e10adc3949ba59abbe56e057f20f883e' 
-- WHERE memb___id = 'fabricio';

-- ═══════════════════════════════════════════════════════════════
-- PARTE 6: VERIFICAR TABELA DE GUILDS (para o ranking)
-- ═══════════════════════════════════════════════════════════════

-- 6.1 - Verificar estrutura da tabela guild
DESCRIBE guild_list;

-- 6.2 - Adicionar colunas se não existirem
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS member_count INT DEFAULT 0;
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS emblem VARBINARY(32) DEFAULT NULL;

-- 6.3 - Verificar guilds cadastradas
SELECT name, score, member_count, emblem
FROM guild_list
ORDER BY score DESC
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════
-- PARTE 7: CRIAR DATABASE 'meuweb' SE NÃO EXISTIR
-- ═══════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS meuweb 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- RESUMO DE SENHAS COMUNS EM MD5
-- ═══════════════════════════════════════════════════════════════
/*
senha123    = e10adc3949ba59abbe56e057f20f883e
123456      = e10adc3949ba59abbe56e057f20f883e
admin       = 21232f297a57a5a743894a0e4a801fc3
password    = 5f4dcc3b5aa765d61d8327deb882cf99
muonline    = 7c6a180b36896a0a8c02787eeafb0e4c
*/

-- ═══════════════════════════════════════════════════════════════
-- FIM DO SCRIPT
-- ═══════════════════════════════════════════════════════════════
