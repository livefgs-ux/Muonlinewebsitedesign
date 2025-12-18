<?php
/**
 * Ranking de Levels
 * Gera JSON com top 100 personagens por level
 */

if (!defined('DB_HOST')) {
    require_once __DIR__ . '/config.php';
}

try {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $conn = new PDO($dsn, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "SELECT
                c.Name as name,
                c.cLevel as level,
                c.Resets as resets,
                c.Class as classId,
                CASE c.Class
                    WHEN 0 THEN 'Dark Wizard'
                    WHEN 1 THEN 'Soul Master'
                    WHEN 2 THEN 'Grand Master'
                    WHEN 16 THEN 'Dark Knight'
                    WHEN 17 THEN 'Blade Knight'
                    WHEN 18 THEN 'Blade Master'
                    WHEN 32 THEN 'Fairy Elf'
                    WHEN 33 THEN 'Muse Elf'
                    WHEN 34 THEN 'High Elf'
                    WHEN 48 THEN 'Magic Gladiator'
                    WHEN 49 THEN 'Duel Master'
                    WHEN 64 THEN 'Dark Lord'
                    WHEN 65 THEN 'Lord Emperor'
                    WHEN 80 THEN 'Summoner'
                    WHEN 81 THEN 'Bloody Summoner'
                    WHEN 82 THEN 'Dimension Master'
                    WHEN 96 THEN 'Rage Fighter'
                    WHEN 97 THEN 'Fist Master'
                    ELSE 'Unknown'
                END as class
            FROM Character c
            WHERE c.CtlCode = 0
            ORDER BY c.cLevel DESC, c.Resets DESC
            LIMIT 100";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $ranking = [];
    foreach ($results as $index => $row) {
        $ranking[] = [
            'rank' => $index + 1,
            'name' => $row['name'],
            'class' => $row['class'],
            'level' => (int)$row['level'],
            'resets' => (int)$row['resets']
        ];
    }
    
    $json_data = [
        'updated_at' => date('Y-m-d H:i:s'),
        'total' => count($ranking),
        'data' => $ranking
    ];
    
    file_put_contents(__DIR__ . '/data/levels_ranking.json', json_encode($json_data, JSON_PRETTY_PRINT));
    
    echo "Levels ranking updated: " . count($ranking) . " players\n";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>