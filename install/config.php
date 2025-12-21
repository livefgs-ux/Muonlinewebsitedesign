<?php
/**
 * MeuMU Online
 * Season 19-2-3 Épico
 * 
 * @version 2.0.0
 * @author MeuMU Team
 * @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
 * 
 * Licensed under the MIT license
 * http://opensource.org/licenses/MIT
 */

if(!defined('access') or !access or access != 'install') die();

/**
 * INSTALLER_VERSION
 */
define('INSTALLER_VERSION', '2.0.0');

/**
 * INSTALLER_NAME
 */
define('INSTALLER_NAME', 'MeuMU Online Installer');

/**
 * WEBMU_CONFIGURATION_FILE
 */
define('WEBMU_CONFIGURATION_FILE', 'webmu.json');

/**
 * WEBMU_DEFAULT_CONFIGURATION_FILE
 */
define('WEBMU_DEFAULT_CONFIGURATION_FILE', 'webmu.json.default');

/**
 * WEBMU_WRITABLE_PATHS_FILE
 */
define('WEBMU_WRITABLE_PATHS_FILE', 'writable.paths.json');

/**
 * Tabelas WEBMU a serem criadas
 */
$install['sql_list'] = array(
	'WEBMU_NEWS' => 'WEBMU_NEWS',
	'WEBMU_NEWS_TRANSLATIONS' => 'WEBMU_NEWS_TRANSLATIONS',
	'WEBMU_BANS' => 'WEBMU_BANS',
	'WEBMU_BAN_LOG' => 'WEBMU_BAN_LOG',
	'WEBMU_BLOCKED_IP' => 'WEBMU_BLOCKED_IP',
	'WEBMU_VOTES' => 'WEBMU_VOTES',
	'WEBMU_VOTE_LOGS' => 'WEBMU_VOTE_LOGS',
	'WEBMU_VOTE_SITES' => 'WEBMU_VOTE_SITES',
	'WEBMU_DOWNLOADS' => 'WEBMU_DOWNLOADS',
	'WEBMU_REGISTER_ACCOUNT' => 'WEBMU_REGISTER_ACCOUNT',
	'WEBMU_PASSCHANGE_REQUEST' => 'WEBMU_PASSCHANGE_REQUEST',
	'WEBMU_CREDITS_CONFIG' => 'WEBMU_CREDITS_CONFIG',
	'WEBMU_CREDITS_LOGS' => 'WEBMU_CREDITS_LOGS',
	'WEBMU_PAYPAL_TRANSACTIONS' => 'WEBMU_PAYPAL_TRANSACTIONS',
	'WEBMU_PLUGINS' => 'WEBMU_PLUGINS',
	'WEBMU_CRON' => 'WEBMU_CRON',
	'WEBMU_ACCOUNT_COUNTRY' => 'WEBMU_ACCOUNT_COUNTRY',
	'WEBMU_FLA' => 'WEBMU_FLA',
);

/**
 * Steps do instalador
 */
$install['step_list'] = array(
	array('step_1_intro.php', 'Bem-vindo'),
	array('step_2_requirements.php', 'Requisitos'),
	array('step_3_database.php', 'Database'),
	array('step_4_tables.php', 'Criar Tabelas'),
	array('step_5_admin.php', 'Admin (Opcional)'),
	array('step_6_auto.php', 'Instalação Auto'),
	array('step_7_final.php', 'Concluído'),
);

/**
 * Cron Jobs padrão
 */
$install['cron_jobs'] = array(
	// nome, descrição, arquivo, tempo(segundos), status, protegido
	array('Ranking de Níveis', 'Atualiza ranking de níveis', 'levels_ranking.php', '300', '1', '0'),
	array('Ranking de Resets', 'Atualiza ranking de resets', 'resets_ranking.php', '300', '1', '0'),
	array('Ranking de Killers', 'Atualiza ranking de assassinos', 'killers_ranking.php', '300', '1', '0'),
	array('Ranking de Master', 'Atualiza ranking de master level', 'masterlevel_ranking.php', '300', '1', '0'),
	array('Ranking de Guilds', 'Atualiza ranking de guilds', 'guilds_ranking.php', '300', '1', '0'),
	array('Ranking de Grand Resets', 'Atualiza ranking de grand resets', 'grandresets_ranking.php', '300', '1', '0'),
	array('Ranking de Votos', 'Atualiza ranking de votos', 'votes_ranking.php', '300', '1', '0'),
	array('Sistema de Ban', 'Remove bans temporários expirados', 'temporal_bans.php', '300', '1', '0'),
	array('Info do Servidor', 'Atualiza estatísticas do servidor', 'server_info.php', '300', '1', '0'),
	array('País da Conta', 'Detecta país pelo IP', 'account_country.php', '60', '1', '0'),
	array('País do Personagem', 'Cache de país dos personagens', 'character_country.php', '300', '1', '0'),
	array('Personagens Online', 'Cache de personagens online', 'online_characters.php', '300', '1', '0'),
);

/**
 * Requisitos mínimos do servidor
 */
$install['requirements'] = array(
	'php_version' => '8.1.0',
	'extensions' => array(
		'pdo',
		'pdo_mysql',
		'openssl',
		'curl',
		'gd',
		'xml',
		'json',
		'mbstring',
	),
);