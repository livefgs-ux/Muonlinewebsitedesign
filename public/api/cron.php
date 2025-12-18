<?php
/**
 * MU Online - Sistema de Cron Principal
 * Este arquivo executa todos os rankings automaticamente
 * Configure no cPanel: */5 * * * * /usr/bin/php /path/to/cron.php
 */

// ATIVA SISTEMA DE PROTEÇÃO (exceto para cron interno)
// O cron roda no servidor, não precisa de rate limiting
// Mas mantém proteção contra SQL injection

// Configuração do banco de dados
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // MySQL user
define('DB_PASS', 'sua_senha'); // MySQL password
define('DB_NAME', 'MuOnline');
define('DB_PORT', '3306'); // MySQL port
define('DB_CHARSET', 'utf8mb4');

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Inicia execução
$start_time = microtime(true);
echo "=== MU Online Cron Started at " . date('Y-m-d H:i:s') . " ===\n";

// Lista de arquivos de ranking para executar
$ranking_files = [
    'resets_ranking.php',
    'grandresets_ranking.php',
    'levels_ranking.php',
    'masterlevel_ranking.php',
    'killers_ranking.php',
    'guilds_ranking.php',
    'gens_ranking.php',
    'castle_siege.php',
    'online_ranking.php',
    'online_characters.php',
    'server_info.php',
    'votes_ranking.php',
    'account_country.php',
    'character_country.php',
    'temporal_bans.php'
];

// Executa cada arquivo
foreach ($ranking_files as $file) {
    $file_path = __DIR__ . '/' . $file;
    
    if (file_exists($file_path)) {
        echo "Executing: $file ... ";
        $file_start = microtime(true);
        
        include $file_path;
        
        $file_time = round(microtime(true) - $file_start, 3);
        echo "Done! ({$file_time}s)\n";
    } else {
        echo "Skipping: $file (not found)\n";
    }
}

// Finaliza
$total_time = round(microtime(true) - $start_time, 3);
echo "\n=== Cron Finished! Total time: {$total_time}s ===\n";
echo "Next execution: " . date('Y-m-d H:i:s', strtotime('+5 minutes')) . "\n";
?>