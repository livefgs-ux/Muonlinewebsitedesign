-- ============================================================================
-- Script 3: Criar Usuário Admin
-- ============================================================================
-- Este script cria/atualiza um usuário admin para acessar o AdminCP
-- Data: 20/12/2024
-- ============================================================================

-- Usar o banco de dados do MU Online
USE MuOnline;

-- Banner
SELECT '================================================' AS '';
SELECT '  CRIAÇÃO DE USUÁRIO ADMIN' AS '';
SELECT '================================================' AS '';
SELECT '' AS '';

-- ============================================================================
-- OPÇÃO 1: Atualizar usuário existente para admin
-- ============================================================================
-- Descomente as linhas abaixo e substitua 'seu_usuario' pelo nome da sua conta

-- UPDATE MEMB_INFO 
-- SET admin_level = 1 
-- WHERE memb_name = 'seu_usuario';

-- SELECT 
--     memb___id AS 'ID',
--     memb_name AS 'Usuário',
--     admin_level AS 'Nível Admin',
--     mail_addr AS 'Email',
--     '✅ Usuário atualizado para Admin!' AS 'Status'
-- FROM MEMB_INFO 
-- WHERE memb_name = 'seu_usuario';

-- ============================================================================
-- OPÇÃO 2: Criar nova conta admin (use se não tiver conta)
-- ============================================================================
-- AVISO: Ajuste os valores conforme necessário!
-- Senha padrão: admin123 (ALTERE IMEDIATAMENTE APÓS PRIMEIRO LOGIN!)

-- Verificar se já existe
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '⚠️ Usuário "admin" JÁ EXISTE'
        ELSE '✅ Criando usuário admin...'
    END AS Status
FROM MEMB_INFO 
WHERE memb_name = 'admin';

-- Inserir novo admin (se não existir)
INSERT INTO MEMB_INFO (
    memb___id,
    memb_name,
    memb__pwd,
    mail_addr,
    bloc_code,
    ctl1_code,
    admin_level,
    vip_level,
    cash_point,
    appl_days
)
SELECT 
    'admin' AS memb___id,
    'admin' AS memb_name,
    'admin123' AS memb__pwd,  -- ⚠️ ALTERE ESTA SENHA!
    'admin@meumu.com' AS mail_addr,
    0 AS bloc_code,  -- 0 = ativo, 1 = banido
    0 AS ctl1_code,
    1 AS admin_level,  -- 1 = admin
    0 AS vip_level,
    0 AS cash_point,
    NOW() AS appl_days
WHERE NOT EXISTS (
    SELECT 1 FROM MEMB_INFO WHERE memb_name = 'admin'
);

-- ============================================================================
-- Adicionar coluna admin_level se não existir
-- ============================================================================
-- Esta coluna pode não existir em algumas versões do MU

-- Verificar se coluna existe
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Coluna admin_level JÁ EXISTE'
        ELSE '⚠️ Coluna admin_level NÃO EXISTE - Criando...'
    END AS Status
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'MuOnline' 
  AND TABLE_NAME = 'MEMB_INFO' 
  AND COLUMN_NAME = 'admin_level';

-- Criar coluna se não existir
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS 
     WHERE TABLE_SCHEMA = 'MuOnline' 
       AND TABLE_NAME = 'MEMB_INFO' 
       AND COLUMN_NAME = 'admin_level') = 0,
    'ALTER TABLE MEMB_INFO ADD COLUMN admin_level INT NOT NULL DEFAULT 0 COMMENT ''Nível de administrador: 0=user, 1=admin, 2=super-admin'' AFTER mail_addr',
    'SELECT ''Coluna admin_level já existe'' AS Status'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- Mostrar usuários admin
-- ============================================================================
SELECT '' AS '';
SELECT '================================================' AS '';
SELECT '  USUÁRIOS ADMIN CADASTRADOS' AS '';
SELECT '================================================' AS '';

SELECT 
    memb___id AS 'ID',
    memb_name AS 'Usuário',
    admin_level AS 'Nível',
    mail_addr AS 'Email',
    CASE 
        WHEN bloc_code = 0 THEN '✅ Ativo'
        ELSE '❌ Banido'
    END AS 'Status',
    appl_days AS 'Data Criação'
FROM MEMB_INFO 
WHERE admin_level > 0
ORDER BY admin_level DESC, appl_days DESC;

-- Verificar se existe pelo menos um admin
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN CONCAT('✅ Encontrados ', COUNT(*), ' usuário(s) admin')
        ELSE '❌ NENHUM USUÁRIO ADMIN ENCONTRADO!'
    END AS Status
FROM MEMB_INFO 
WHERE admin_level > 0;

-- ============================================================================
-- Instruções finais
-- ============================================================================
SELECT '' AS '';
SELECT '================================================' AS '';
SELECT '  INSTRUÇÕES IMPORTANTES' AS '';
SELECT '================================================' AS '';
SELECT '' AS '';
SELECT '1. Se você criou o usuário "admin", a senha padrão é: admin123' AS 'ATENÇÃO:';
SELECT '2. ALTERE A SENHA IMEDIATAMENTE após o primeiro login!' AS '';
SELECT '3. Para alterar a senha, use o painel AdminCP ou execute:' AS '';
SELECT '   UPDATE MEMB_INFO SET memb__pwd = ''nova_senha'' WHERE memb_name = ''admin'';' AS '';
SELECT '' AS '';
SELECT '4. Para tornar outro usuário admin:' AS '';
SELECT '   UPDATE MEMB_INFO SET admin_level = 1 WHERE memb_name = ''seu_usuario'';' AS '';
SELECT '' AS '';
SELECT '5. Níveis de admin:' AS '';
SELECT '   0 = Usuário normal' AS '';
SELECT '   1 = Administrador' AS '';
SELECT '   2 = Super-admin (futuro)' AS '';
SELECT '' AS '';

-- Banner final
SELECT '================================================' AS '';
SELECT '  ✅ CONFIGURAÇÃO DE ADMIN CONCLUÍDA!' AS '';
SELECT '================================================' AS '';
SELECT '' AS '';
SELECT 'Agora você pode fazer login no AdminCP com:' AS 'PRÓXIMO PASSO:';
SELECT 'URL: http://seu-site.com/admin' AS '';
SELECT 'Usuário: admin (ou o que você configurou)' AS '';
SELECT 'Senha: admin123 (ou a que você definiu)' AS '';
SELECT '' AS '';

-- Fim do script
SELECT '✅ Script executado com sucesso!' AS '';
