<?php
/**
 * Informações do Servidor
 * Gera JSON com informações gerais do servidor (online, contas, etc)
 */

if (!defined('DB_HOST')) {
    require_once __DIR__ . '/config.php';
}

try {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $conn = new PDO($dsn, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Contar personagens online
    $sqlOnline = "SELECT COUNT(*) as total FROM MEMB_STAT WHERE ConnectStat = 1";
    $stmtOnline = $conn->prepare($sqlOnline);
    $stmtOnline->execute();
    $online = $stmtOnline->fetch(PDO::FETCH_ASSOC);
    
    // Contar total de contas
    $sqlAccounts = "SELECT COUNT(*) as total FROM MEMB_INFO";
    $stmtAccounts = $conn->prepare($sqlAccounts);
    $stmtAccounts->execute();
    $accounts = $stmtAccounts->fetch(PDO::FETCH_ASSOC);
    
    // Contar total de personagens
    $sqlChars = "SELECT COUNT(*) as total FROM Character WHERE CtlCode = 0";
    $stmtChars = $conn->prepare($sqlChars);
    $stmtChars->execute();
    $characters = $stmtChars->fetch(PDO::FETCH_ASSOC);
    
    // Contar total de guilds
    $sqlGuilds = "SELECT COUNT(*) as total FROM Guild";
    $stmtGuilds = $conn->prepare($sqlGuilds);
    $stmtGuilds->execute();
    $guilds = $stmtGuilds->fetch(PDO::FETCH_ASSOC);
    
    // Buscar Castle Siege info
    $sqlCastle = "SELECT * FROM MuCastleData LIMIT 1";
    $stmtCastle = $conn->prepare($sqlCastle);
    $stmtCastle->execute();
    $castle = $stmtCastle->fetch(PDO::FETCH_ASSOC);
    
    // Contar Bosses vivos (monsters com MapNumber específicos de bosses)
    // Boss maps: 6=Devias, 7=Dungeon, 8=Lost Tower, 10=Atlans, 24=Kalima, 34=Crywolf, 39=Kanturu, 51=Vulcanus
    $bossMapNumbers = [6, 7, 8, 10, 24, 34, 39, 51, 56, 57, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];
    $placeholders = implode(',', array_fill(0, count($bossMapNumbers), '?'));
    
    // Total de bosses configurados (aproximado - MU tem cerca de 100-150 bosses diferentes)
    $totalBosses = 120; // Total de bosses no jogo
    
    // Contar bosses vivos atualmente
    $sqlBosses = "SELECT COUNT(DISTINCT MapNumber) as alive_bosses 
                  FROM Monster 
                  WHERE MapNumber IN ($placeholders) 
                  AND Life > 0";
    $stmtBosses = $conn->prepare($sqlBosses);
    $stmtBosses->execute($bossMapNumbers);
    $bossesData = $stmtBosses->fetch(PDO::FETCH_ASSOC);
    $aliveBosses = (int)$bossesData['alive_bosses'];
    
    $server_info = [
        'status' => 'online',
        'players_online' => (int)$online['total'],
        'total_accounts' => (int)$accounts['total'],
        'total_characters' => (int)$characters['total'],
        'total_guilds' => (int)$guilds['total'],
        'castle_owner' => $castle ? $castle['OWNER_GUILD'] : 'Nenhuma',
        'total_bosses' => $totalBosses,
        'alive_bosses' => $aliveBosses,
        'server_name' => 'MeuMU Online',
        'season' => 'Season 19-2-3 - Épico',
        'exp_rate' => '9999x',
        'drop_rate' => '60%',
        'updated_at' => date('Y-m-d H:i:s')
    ];
    
    file_put_contents(__DIR__ . '/data/server_info.json', json_encode($server_info, JSON_PRETTY_PRINT));
    
    echo "Server info updated: {$online['total']} players online, {$aliveBosses}/{$totalBosses} bosses alive\n";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>