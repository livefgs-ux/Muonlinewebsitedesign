-- ═══════════════════════════════════════════════════════════════════
-- 🔄 CONVERSÃO MySQL → SQL Server 2019
-- ═══════════════════════════════════════════════════════════════════
-- 
-- Este script contém as conversões necessárias para migrar do MySQL
-- para SQL Server 2019
--
-- INSTRUÇÕES:
-- 1. Use SQL Server Migration Assistant (SSMA) para migração automática
-- 2. OU aplique estas conversões manualmente nos scripts SQL
--
-- ═══════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════
-- CONVERSÕES DE TIPOS DE DADOS
-- ═══════════════════════════════════════════════════════════════════

/*
MySQL                    →  SQL Server 2019
─────────────────────────────────────────────────────────────────────
INT AUTO_INCREMENT       →  INT IDENTITY(1,1)
BIGINT AUTO_INCREMENT    →  BIGINT IDENTITY(1,1)
VARCHAR(n)               →  NVARCHAR(n)         -- Unicode support
TEXT                     →  NVARCHAR(MAX)
MEDIUMTEXT               →  NVARCHAR(MAX)
LONGTEXT                 →  NVARCHAR(MAX)
TINYINT(1)               →  BIT                 -- Boolean
TINYINT                  →  TINYINT
SMALLINT                 →  SMALLINT
INT                      →  INT
BIGINT                   →  BIGINT
FLOAT                    →  FLOAT
DOUBLE                   →  FLOAT
DECIMAL(p,s)             →  DECIMAL(p,s)
DATETIME                 →  DATETIME2           -- Mais preciso
DATE                     →  DATE
TIME                     →  TIME
TIMESTAMP                →  DATETIME2
BLOB                     →  VARBINARY(MAX)
ENUM('a','b')            →  NVARCHAR(50) CHECK (col IN ('a','b'))
*/

-- ═══════════════════════════════════════════════════════════════════
-- EXEMPLO: Converter Tabela MEMB_INFO
-- ═══════════════════════════════════════════════════════════════════

-- MySQL Original:
/*
CREATE TABLE IF NOT EXISTS `MEMB_INFO` (
  `memb_guid` INT AUTO_INCREMENT PRIMARY KEY,
  `memb___id` VARCHAR(10) NOT NULL UNIQUE,
  `memb__pwd` VARCHAR(10) NOT NULL,
  `memb_name` VARCHAR(10) NOT NULL,
  `sno__numb` VARCHAR(18) DEFAULT '0',
  `post_code` VARCHAR(6) DEFAULT NULL,
  `addr_info` VARCHAR(50) DEFAULT NULL,
  `addr_deta` VARCHAR(50) DEFAULT NULL,
  `tel__numb` VARCHAR(20) DEFAULT NULL,
  `phon_numb` VARCHAR(15) DEFAULT NULL,
  `mail_addr` VARCHAR(50) DEFAULT NULL,
  `fpas_ques` VARCHAR(50) DEFAULT NULL,
  `fpas_answ` VARCHAR(50) DEFAULT NULL,
  `job__code` VARCHAR(50) DEFAULT NULL,
  `appl_days` DATETIME DEFAULT NULL,
  `modi_days` DATETIME DEFAULT NULL,
  `out__days` DATETIME DEFAULT NULL,
  `true_days` DATETIME DEFAULT NULL,
  `mail_chek` TINYINT(1) DEFAULT 0,
  `bloc_code` TINYINT(1) DEFAULT 0,
  `ctl1_code` TINYINT(1) DEFAULT 0,
  `AccountLevel` TINYINT DEFAULT 0,
  `AccountExpireDate` SMALLDATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
*/

-- SQL Server Convertido:
CREATE TABLE [MEMB_INFO] (
  [memb_guid] INT IDENTITY(1,1) PRIMARY KEY,
  [memb___id] NVARCHAR(10) NOT NULL UNIQUE,
  [memb__pwd] NVARCHAR(10) NOT NULL,
  [memb_name] NVARCHAR(10) NOT NULL,
  [sno__numb] NVARCHAR(18) DEFAULT '0',
  [post_code] NVARCHAR(6) DEFAULT NULL,
  [addr_info] NVARCHAR(50) DEFAULT NULL,
  [addr_deta] NVARCHAR(50) DEFAULT NULL,
  [tel__numb] NVARCHAR(20) DEFAULT NULL,
  [phon_numb] NVARCHAR(15) DEFAULT NULL,
  [mail_addr] NVARCHAR(50) DEFAULT NULL,
  [fpas_ques] NVARCHAR(50) DEFAULT NULL,
  [fpas_answ] NVARCHAR(50) DEFAULT NULL,
  [job__code] NVARCHAR(50) DEFAULT NULL,
  [appl_days] DATETIME2 DEFAULT NULL,
  [modi_days] DATETIME2 DEFAULT NULL,
  [out__days] DATETIME2 DEFAULT NULL,
  [true_days] DATETIME2 DEFAULT NULL,
  [mail_chek] BIT DEFAULT 0,
  [bloc_code] BIT DEFAULT 0,
  [ctl1_code] BIT DEFAULT 0,
  [AccountLevel] TINYINT DEFAULT 0,
  [AccountExpireDate] SMALLDATETIME DEFAULT NULL
);

-- ═══════════════════════════════════════════════════════════════════
-- CONVERSÕES DE SINTAXE
-- ═══════════════════════════════════════════════════════════════════

/*
MySQL                              →  SQL Server 2019
─────────────────────────────────────────────────────────────────────
`table`                            →  [table]
`column`                           →  [column]
LIMIT 10                           →  TOP 10
LIMIT 10 OFFSET 5                  →  OFFSET 5 ROWS FETCH NEXT 10 ROWS ONLY
NOW()                              →  GETDATE()
CURDATE()                          →  CAST(GETDATE() AS DATE)
CONCAT('a', 'b')                   →  'a' + 'b'
IFNULL(x, y)                       →  ISNULL(x, y)
IF(cond, x, y)                     →  CASE WHEN cond THEN x ELSE y END
DATE_ADD(date, INTERVAL 1 DAY)     →  DATEADD(day, 1, date)
DATE_SUB(date, INTERVAL 1 DAY)     →  DATEADD(day, -1, date)
YEAR(date)                         →  YEAR(date)           -- Igual
MONTH(date)                        →  MONTH(date)          -- Igual
DAY(date)                          →  DAY(date)            -- Igual
LENGTH(str)                        →  LEN(str)
SUBSTRING(str, pos, len)           →  SUBSTRING(str, pos, len)  -- Igual
LCASE(str) / LOWER(str)            →  LOWER(str)           -- Igual
UCASE(str) / UPPER(str)            →  UPPER(str)           -- Igual
RAND()                             →  RAND()               -- Igual
MD5(str)                           →  HASHBYTES('MD5', str)
AUTO_INCREMENT                     →  IDENTITY(1,1)
ENGINE=InnoDB                      →  (remover)
DEFAULT CHARSET=utf8mb4            →  (remover, NVARCHAR já é Unicode)
*/

-- ═══════════════════════════════════════════════════════════════════
-- EXEMPLO: Converter Query SELECT
-- ═══════════════════════════════════════════════════════════════════

-- MySQL:
SELECT * FROM `Character` 
WHERE `cLevel` >= 400 
ORDER BY `Resets` DESC 
LIMIT 10;

-- SQL Server:
SELECT TOP 10 * FROM [Character] 
WHERE [cLevel] >= 400 
ORDER BY [Resets] DESC;

-- ───────────────────────────────────────────────────────────────────

-- MySQL com OFFSET:
SELECT * FROM `Character` 
ORDER BY `cLevel` DESC 
LIMIT 10 OFFSET 20;

-- SQL Server:
SELECT * FROM [Character] 
ORDER BY [cLevel] DESC 
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;

-- ═══════════════════════════════════════════════════════════════════
-- EXEMPLO: Converter Query INSERT
-- ═══════════════════════════════════════════════════════════════════

-- MySQL:
INSERT INTO `player_activities` 
(`account_id`, `activity_type`, `description`, `created_at`) 
VALUES 
(?, ?, ?, NOW());

-- SQL Server:
INSERT INTO [player_activities] 
([account_id], [activity_type], [description], [created_at]) 
VALUES 
(@p0, @p1, @p2, GETDATE());

-- ═══════════════════════════════════════════════════════════════════
-- EXEMPLO: Converter Query UPDATE
-- ═══════════════════════════════════════════════════════════════════

-- MySQL:
UPDATE `Character` 
SET `cLevel` = `cLevel` + 1, 
    `Experience` = 0 
WHERE `Name` = ?;

-- SQL Server:
UPDATE [Character] 
SET [cLevel] = [cLevel] + 1, 
    [Experience] = 0 
WHERE [Name] = @p0;

-- ═══════════════════════════════════════════════════════════════════
-- CONVERSÕES ESPECÍFICAS DO MU ONLINE
-- ═══════════════════════════════════════════════════════════════════

-- Tabela Character (principal)
-- MySQL → SQL Server (mantém estrutura similar)

-- Inventário (BLOB)
-- MySQL: `Inventory` BLOB
-- SQL Server: [Inventory] VARBINARY(MAX)

-- Warehouse (BLOB)
-- MySQL: `Warehouse` BLOB
-- SQL Server: [Warehouse] VARBINARY(MAX)

-- ═══════════════════════════════════════════════════════════════════
-- ÍNDICES
-- ═══════════════════════════════════════════════════════════════════

-- MySQL:
CREATE INDEX idx_character_level ON `Character` (`cLevel`);

-- SQL Server:
CREATE INDEX idx_character_level ON [Character] ([cLevel]);

-- ═══════════════════════════════════════════════════════════════════
-- CONSTRAINTS
-- ═══════════════════════════════════════════════════════════════════

-- MySQL:
ALTER TABLE `MEMB_INFO` 
ADD CONSTRAINT uc_memb_id UNIQUE (`memb___id`);

-- SQL Server:
ALTER TABLE [MEMB_INFO] 
ADD CONSTRAINT uc_memb_id UNIQUE ([memb___id]);

-- ═══════════════════════════════════════════════════════════════════
-- STORED PROCEDURES
-- ═══════════════════════════════════════════════════════════════════

-- MySQL:
/*
DELIMITER $$
CREATE PROCEDURE GetTopPlayers(IN limitCount INT)
BEGIN
  SELECT * FROM Character ORDER BY cLevel DESC LIMIT limitCount;
END$$
DELIMITER ;
*/

-- SQL Server:
CREATE PROCEDURE GetTopPlayers
  @limitCount INT
AS
BEGIN
  SELECT TOP (@limitCount) * FROM [Character] ORDER BY cLevel DESC;
END;
GO

-- ═══════════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════════

-- MySQL:
/*
DELIMITER $$
CREATE TRIGGER before_character_update
BEFORE UPDATE ON Character
FOR EACH ROW
BEGIN
  SET NEW.ModifyDate = NOW();
END$$
DELIMITER ;
*/

-- SQL Server:
CREATE TRIGGER before_character_update
ON [Character]
AFTER UPDATE
AS
BEGIN
  UPDATE [Character]
  SET ModifyDate = GETDATE()
  WHERE Name IN (SELECT Name FROM inserted);
END;
GO

-- ═══════════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════

-- MySQL:
/*
DELIMITER $$
CREATE FUNCTION CalculateTotalResets(charName VARCHAR(10))
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT;
  SELECT (Resets + GrandResets * 10) INTO total
  FROM Character WHERE Name = charName;
  RETURN total;
END$$
DELIMITER ;
*/

-- SQL Server:
CREATE FUNCTION CalculateTotalResets(@charName NVARCHAR(10))
RETURNS INT
AS
BEGIN
  DECLARE @total INT;
  SELECT @total = (Resets + GrandResets * 10)
  FROM [Character] WHERE Name = @charName;
  RETURN @total;
END;
GO

-- ═══════════════════════════════════════════════════════════════════
-- DICAS IMPORTANTES
-- ═══════════════════════════════════════════════════════════════════

/*
1. COLLATION:
   - MySQL: utf8mb4_general_ci (case insensitive)
   - SQL Server: SQL_Latin1_General_CP1_CI_AS (case insensitive)

2. CASE SENSITIVITY:
   - MySQL: Nomes de tabelas são case sensitive em Linux
   - SQL Server: Configurável (padrão: case insensitive)

3. RESERVEDWORDS:
   - Evite usar palavras reservadas
   - Use [colchetes] para nomes com espaços/palavras reservadas

4. NULL vs NOT NULL:
   - Mantenha consistência
   - SQL Server trata NULL diferente em comparações

5. DEFAULT VALUES:
   - Ambos suportam DEFAULT
   - SQL Server permite DEFAULT com GETDATE()

6. PRIMARY KEY:
   - MySQL: AUTO_INCREMENT separado
   - SQL Server: IDENTITY(1,1) inline

7. FOREIGN KEYS:
   - Ambos suportam
   - Sintaxe similar

8. TRANSACTIONS:
   - Ambos suportam ACID
   - SQL Server mais robusto em concorrência
*/

-- ═══════════════════════════════════════════════════════════════════
-- FIM DO SCRIPT
-- ═══════════════════════════════════════════════════════════════════
