<?php
/**
 * Ranking de Guilds
 * Gera JSON com top 100 guilds por score
 */

if (!defined('DB_HOST')) {
    require_once __DIR__ . '/config.php';
}

try {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $conn = new PDO($dsn, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "SELECT
                g.G_Name as name,
                g.G_Master as master,
                g.G_Score as score,
                (SELECT COUNT(*) FROM GuildMember gm WHERE gm.G_Name = g.G_Name) as members
            FROM Guild g
            ORDER BY g.G_Score DESC
            LIMIT 100";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $ranking = [];
    foreach ($results as $index => $row) {
        $ranking[] = [
            'rank' => $index + 1,
            'name' => $row['name'],
            'master' => $row['master'],
            'members' => (int)$row['members'],
            'score' => (int)$row['score']
        ];
    }
    
    $json_data = [
        'updated_at' => date('Y-m-d H:i:s'),
        'total' => count($ranking),
        'data' => $ranking
    ];
    
    file_put_contents(__DIR__ . '/data/guilds_ranking.json', json_encode($json_data, JSON_PRETTY_PRINT));
    
    echo "Guilds ranking updated: " . count($ranking) . " guilds\n";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>