<?php
/**
 * Ranking de Resets - VERSÃO SEGURA
 * Com proteção anti-hack integrada
 */

// ATIVA TODAS AS PROTEÇÕES
require_once __DIR__ . '/security/protection.php';

// Inclui configuração se executado diretamente
if (!defined('DB_HOST')) {
    require_once __DIR__ . '/config.php';
}

try {
    // Cria conexão segura com PDO
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false, // Desabilita emulação (mais seguro)
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ];
    
    $conn = new PDO($dsn, DB_USER, DB_PASS, $options);
    
    // Sanitiza inputs (se houver filtros)
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
    $limit = min(max($limit, 10), 1000); // Entre 10 e 1000
    
    // Query preparada (previne SQL Injection)
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
            FROM `Character` c
            WHERE c.CtlCode = 0
            ORDER BY c.Resets DESC, c.cLevel DESC
            LIMIT :limit";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $results = $stmt->fetchAll();
    
    // Monta ranking
    $ranking = [];
    foreach ($results as $index => $row) {
        $ranking[] = [
            'rank' => $index + 1,
            'name' => htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'),
            'class' => htmlspecialchars($row['class'], ENT_QUOTES, 'UTF-8'),
            'resets' => (int)$row['resets'],
            'level' => (int)$row['level']
        ];
    }
    
    // Resposta JSON segura
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    
    $json_data = [
        'success' => true,
        'updated_at' => date('Y-m-d H:i:s'),
        'total' => count($ranking),
        'data' => $ranking
    ];
    
    echo json_encode($json_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch(PDOException $e) {
    // Não expõe detalhes do erro em produção
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error',
        'message' => 'Erro ao buscar rankings'
    ]);
    
    // Log do erro (não visível ao usuário)
    error_log("Database Error: " . $e->getMessage());
}
?>
