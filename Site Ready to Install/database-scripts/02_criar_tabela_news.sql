-- ============================================================================
-- Script 2: Criar Tabela de Notícias (News)
-- ============================================================================
-- Este script cria a tabela News para o sistema de notícias do site
-- Data: 20/12/2024
-- ============================================================================

-- Usar o banco de dados do MU Online
USE MuOnline;

-- Banner
SELECT '================================================' AS '';
SELECT '  CRIAÇÃO DA TABELA NEWS' AS '';
SELECT '================================================' AS '';
SELECT '' AS '';

-- Verificar se a tabela já existe
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '⚠️ Tabela News JÁ EXISTE - Pulando criação'
        ELSE '✅ Criando tabela News...'
    END AS Status
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'MuOnline' 
  AND TABLE_NAME = 'News';

-- Criar tabela News (se não existir)
CREATE TABLE IF NOT EXISTS `News` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL COMMENT 'Título da notícia',
  `content` TEXT NOT NULL COMMENT 'Conteúdo HTML da notícia',
  `excerpt` VARCHAR(500) NULL COMMENT 'Resumo curto para listagem',
  `author` VARCHAR(100) NOT NULL DEFAULT 'Admin' COMMENT 'Autor da notícia',
  `author_id` VARCHAR(10) NULL COMMENT 'ID da conta do autor (MEMB_INFO.memb___id)',
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de publicação',
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da última atualização',
  `imageUrl` VARCHAR(500) NULL COMMENT 'URL da imagem de capa',
  `publishTo` VARCHAR(100) NOT NULL DEFAULT 'all' COMMENT 'Onde publicar: all, home, news, events',
  `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published' COMMENT 'Status da notícia',
  `views` INT NOT NULL DEFAULT 0 COMMENT 'Número de visualizações',
  `category` VARCHAR(50) NULL DEFAULT 'general' COMMENT 'Categoria: general, update, event, maintenance',
  `featured` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Destacar na home (1=sim, 0=não)',
  `allow_comments` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Permitir comentários (1=sim, 0=não)',
  PRIMARY KEY (`id`),
  INDEX `idx_date` (`date` DESC),
  INDEX `idx_status` (`status`),
  INDEX `idx_category` (`category`),
  INDEX `idx_featured` (`featured`),
  INDEX `idx_author_id` (`author_id`),
  FULLTEXT INDEX `idx_search` (`title`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela de notícias do site';

-- Confirmar criação
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Tabela News criada com sucesso!'
        ELSE '❌ Erro ao criar tabela News'
    END AS Status
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'MuOnline' 
  AND TABLE_NAME = 'News';

-- Inserir notícias de exemplo
INSERT INTO `News` (`title`, `content`, `excerpt`, `author`, `category`, `featured`, `imageUrl`, `publishTo`) VALUES
(
    'Bem-vindo ao MeuMU Online!',
    '<h2>Servidor Aberto!</h2><p>Estamos felizes em anunciar a abertura oficial do <strong>MeuMU Online Season 19-2-3 Épico</strong>!</p><p>Características do servidor:</p><ul><li>Rates: 500x EXP</li><li>Drop: 40%</li><li>Sistema de Reset</li><li>Eventos automáticos</li><li>Suporte 24/7</li></ul><p>Venha fazer parte da nossa comunidade!</p>',
    'Bem-vindo ao servidor MeuMU Online Season 19-2-3! Rates altos, eventos automáticos e muito mais!',
    'Admin',
    'general',
    1,
    NULL,
    'all'
),
(
    'Evento de Inauguração',
    '<h2>Evento Especial de Inauguração!</h2><p>Para comemorar a abertura do servidor, preparamos um evento especial:</p><ul><li>🎁 Itens bônus para novos jogadores</li><li>🏆 Torneio PvP com prêmios exclusivos</li><li>💎 Dobro de drop durante 7 dias</li><li>⚡ Bônus de EXP aumentado</li></ul><p><strong>Data:</strong> 21/12/2024 às 20:00</p><p><strong>Local:</strong> Lorencia</p>',
    'Evento especial de inauguração com prêmios exclusivos! Não perca!',
    'Admin',
    'event',
    1,
    NULL,
    'all'
),
(
    'Sistema de Rankings Implementado',
    '<h2>Rankings em Tempo Real!</h2><p>Agora você pode acompanhar os <strong>rankings em tempo real</strong> direto pelo site:</p><ul><li>🏆 Top Resets</li><li>⚔️ Top PK</li><li>👥 Top Guilds</li><li>🎯 Eventos</li></ul><p>Todos os dados são atualizados automaticamente a cada minuto!</p><p>Acesse a seção de Rankings e veja sua posição!</p>',
    'Sistema de rankings em tempo real implementado! Veja sua posição no servidor.',
    'Admin',
    'update',
    0,
    NULL,
    'news'
),
(
    'Manutenção Programada',
    '<h2>Manutenção do Servidor</h2><p>Informamos que haverá uma manutenção programada:</p><p><strong>Data:</strong> 22/12/2024<br><strong>Horário:</strong> 03:00 às 05:00 (horário de Brasília)<br><strong>Duração estimada:</strong> 2 horas</p><p><strong>O que será feito:</strong></p><ul><li>Otimização do banco de dados</li><li>Atualização de segurança</li><li>Correção de bugs reportados</li><li>Implementação de melhorias</li></ul><p>Pedimos desculpas pelo transtorno!</p>',
    'Manutenção programada para 22/12/2024 das 03:00 às 05:00. Confira os detalhes.',
    'Admin',
    'maintenance',
    0,
    NULL,
    'all'
);

-- Mostrar notícias inseridas
SELECT '' AS '';
SELECT '================================================' AS '';
SELECT '  NOTÍCIAS DE EXEMPLO INSERIDAS' AS '';
SELECT '================================================' AS '';
SELECT 
    id,
    title,
    author,
    category,
    CASE WHEN featured = 1 THEN 'Sim' ELSE 'Não' END AS Destacada,
    date
FROM News
ORDER BY date DESC;

-- Estatísticas
SELECT '' AS '';
SELECT '================================================' AS '';
SELECT '  ESTATÍSTICAS' AS '';
SELECT '================================================' AS '';
SELECT COUNT(*) AS Total_Noticias FROM News;
SELECT COUNT(*) AS Noticias_Destacadas FROM News WHERE featured = 1;
SELECT COUNT(*) AS Noticias_Publicadas FROM News WHERE status = 'published';

-- Banner final
SELECT '' AS '';
SELECT '================================================' AS '';
SELECT '  ✅ TABELA NEWS CRIADA COM SUCESSO!' AS '';
SELECT '================================================' AS '';
SELECT '' AS '';
SELECT 'A tabela News foi criada e populada com' AS 'SUCESSO:';
SELECT 'notícias de exemplo.' AS '';
SELECT '' AS '';
SELECT 'Você pode editar/deletar essas notícias' AS 'IMPORTANTE:';
SELECT 'pelo painel administrativo do site.' AS '';
SELECT '' AS '';

-- Fim do script
SELECT '✅ Script executado com sucesso!' AS '';
