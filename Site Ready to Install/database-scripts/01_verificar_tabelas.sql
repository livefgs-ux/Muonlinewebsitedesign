-- ============================================================================
-- Script 1: Verificar Tabelas do MU Online
-- ============================================================================
-- Este script verifica se todas as tabelas necessárias existem no banco
-- Data: 20/12/2024
-- ============================================================================

-- Usar o banco de dados do MU Online
USE MuOnline;

-- Mostrar banner
SELECT '================================================' AS '';
SELECT '  VERIFICAÇÃO DE TABELAS - MeuMU Online' AS '';
SELECT '================================================' AS '';
SELECT '' AS '';

-- Verificar tabela MEMB_INFO (Contas)
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ MEMB_INFO - OK'
        ELSE '❌ MEMB_INFO - NÃO ENCONTRADA'
    END AS Status,
    COUNT(*) AS Total_Registros
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'MuOnline' 
  AND TABLE_NAME = 'MEMB_INFO';

-- Verificar tabela Character (Personagens)
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Character - OK'
        ELSE '❌ Character - NÃO ENCONTRADA'
    END AS Status,
    COUNT(*) AS Total_Registros
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'MuOnline' 
  AND TABLE_NAME = 'Character';

-- Verificar tabela MEMB_STAT (Status Online)
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ MEMB_STAT - OK'
        ELSE '⚠️ MEMB_STAT - NÃO ENCONTRADA (Opcional)'
    END AS Status
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'MuOnline' 
  AND TABLE_NAME = 'MEMB_STAT';

-- Verificar tabela Guild (Guilds)
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Guild - OK'
        ELSE '❌ Guild - NÃO ENCONTRADA'
    END AS Status,
    COUNT(*) AS Total_Registros
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'MuOnline' 
  AND TABLE_NAME = 'Guild';

-- Verificar tabela News (Nova tabela)
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ News - JÁ EXISTE'
        ELSE '⚠️ News - PRECISA CRIAR (Execute script 02)'
    END AS Status
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'MuOnline' 
  AND TABLE_NAME = 'News';

-- Banner final
SELECT '' AS '';
SELECT '================================================' AS '';
SELECT '  VERIFICAÇÃO CONCLUÍDA' AS '';
SELECT '================================================' AS '';
SELECT '' AS '';
SELECT 'Se todas as tabelas obrigatórias (✅) existem,' AS 'IMPORTANTE:';
SELECT 'você pode continuar com a instalação!' AS '';
SELECT '' AS '';
SELECT 'Se alguma está faltando (❌),' AS '';
SELECT 'verifique sua instalação do MU Online.' AS '';
SELECT '' AS '';

-- Contar registros nas tabelas principais
SELECT '================================================' AS '';
SELECT '  ESTATÍSTICAS DO BANCO' AS '';
SELECT '================================================' AS '';

SELECT 'MEMB_INFO' AS Tabela, COUNT(*) AS Total_Registros 
FROM MEMB_INFO;

SELECT 'Character' AS Tabela, COUNT(*) AS Total_Registros 
FROM `Character`;

SELECT 'Guild' AS Tabela, COUNT(*) AS Total_Registros 
FROM Guild;

-- Mostrar versão do MySQL
SELECT VERSION() AS 'Versão do MySQL';

-- Fim do script
SELECT '' AS '';
SELECT '✅ Script executado com sucesso!' AS '';
