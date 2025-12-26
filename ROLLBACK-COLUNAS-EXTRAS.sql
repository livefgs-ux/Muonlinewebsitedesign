-- ═══════════════════════════════════════════════════════════════
-- MEUMU ONLINE - ROLLBACK DE COLUNAS EXTRAS
-- ═══════════════════════════════════════════════════════════════
-- 
-- 🎯 REGRA DE OURO: Nunca adapte o banco para o código errado.
--                  Sempre adapte o código ao banco do servidor.
--
-- Este script REMOVE colunas que foram adicionadas incorretamente
-- para "forçar" compatibilidade com editores antigos ou scripts mal
-- escritos.
--
-- ✅ Use este script para LIMPAR o banco e mantê-lo no padrão
--    DV-Team Season 19 normalizado.
--
-- ⚠️  IMPORTANTE: Execute APENAS se você tiver adicionado colunas
--                extras manualmente antes.
--
-- Data: 26 de dezembro de 2024
-- Autor: Fabricio (Root)
-- ═══════════════════════════════════════════════════════════════

USE muonline;

-- ═══════════════════════════════════════════════════════════════
-- ROLLBACK 1: Remover colunas extras da tabela accounts
-- ═══════════════════════════════════════════════════════════════

SELECT '🔍 Verificando colunas extras na tabela accounts...' AS status;

-- Remover coluna 'blocked' se foi adicionada (DV-Team pode não ter)
-- Nota: Algumas versões DV-Team usam 'ban' ou não tem esse campo
ALTER TABLE accounts DROP COLUMN IF EXISTS blocked;

-- Remover coluna 'vip_level' se foi adicionada
ALTER TABLE accounts DROP COLUMN IF EXISTS vip_level;

-- Remover coluna 'cash_credits' se foi adicionada
ALTER TABLE accounts DROP COLUMN IF EXISTS cash_credits;

SELECT '✅ Rollback de colunas extras na tabela accounts concluído' AS status;

-- ═══════════════════════════════════════════════════════════════
-- ROLLBACK 2: Remover colunas extras da tabela character_info
-- ═══════════════════════════════════════════════════════════════

SELECT '🔍 Verificando colunas extras na tabela character_info...' AS status;

-- Remover 'goblin_points' (coluna inexistente no DV-Team Season 19)
-- Esta coluna é de editores antigos e NÃO deve existir
ALTER TABLE character_info DROP COLUMN IF EXISTS goblin_points;

-- Remover 'resets_mensais' (não é padrão DV-Team)
ALTER TABLE character_info DROP COLUMN IF EXISTS resets_mensais;

-- Remover 'resets_semanais' (não é padrão DV-Team)
ALTER TABLE character_info DROP COLUMN IF EXISTS resets_semanais;

SELECT '✅ Rollback de colunas extras na tabela character_info concluído' AS status;

-- ═══════════════════════════════════════════════════════════════
-- VERIFICAÇÃO FINAL: Mostrar estrutura das tabelas
-- ═══════════════════════════════════════════════════════════════

SELECT '📊 ESTRUTURA FINAL DA TABELA accounts:' AS status;
DESCRIBE accounts;

SELECT '📊 ESTRUTURA FINAL DA TABELA character_info:' AS status;
DESCRIBE character_info;

-- ═══════════════════════════════════════════════════════════════
-- CONCLUSÃO
-- ═══════════════════════════════════════════════════════════════

SELECT '✅✅✅ ROLLBACK COMPLETO!' AS status;
SELECT 'Seu banco de dados está LIMPO e no padrão DV-Team Season 19' AS info;
SELECT '🎯 Agora o código do site se adapta ao banco (e não o contrário)' AS regra_de_ouro;

-- ═══════════════════════════════════════════════════════════════
-- PRÓXIMOS PASSOS
-- ═══════════════════════════════════════════════════════════════

SELECT 'PRÓXIMOS PASSOS:' AS titulo;
SELECT '1. Reiniciar backend: pm2 restart meumu-backend' AS passo_1;
SELECT '2. Testar registro: curl -X POST https://meumu.com/api/auth/register ...' AS passo_2;
SELECT '3. Criar personagem: Usar CLIENT do jogo (não o site)' AS passo_3;
SELECT '4. Site APENAS cria conta (tabela accounts)' AS passo_4;
SELECT '5. Personagem é criado pelo jogador dentro do jogo' AS passo_5;
