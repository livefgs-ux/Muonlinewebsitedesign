<?php
/**
 * Script de Teste - Sistema de Bosses
 * Execute: php test_bosses.php
 */

echo "=== TESTE DO SISTEMA DE BOSSES ===\n\n";

// 1. Testar conexão com banco
echo "1. Testando conexão com MySQL...\n";
require_once __DIR__ . '/config.php';

try {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $conn = new PDO($dsn, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "   ✓ Conexão OK\n\n";
} catch(PDOException $e) {
    echo "   ✗ Erro: " . $e->getMessage() . "\n\n";
    exit;
}

// 2. Testar se tabela Monster existe
echo "2. Verificando tabela Monster...\n";
try {
    $stmt = $conn->query("SHOW TABLES LIKE 'Monster'");
    $exists = $stmt->rowCount() > 0;
    
    if ($exists) {
        echo "   ✓ Tabela Monster encontrada\n";
        
        // Contar registros
        $stmt = $conn->query("SELECT COUNT(*) as total FROM Monster");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "   ℹ Total de registros: {$result['total']}\n\n";
    } else {
        echo "   ⚠ Tabela Monster NÃO encontrada\n";
        echo "   ℹ Isso é normal se seu servidor não usa essa tabela\n\n";
    }
} catch(PDOException $e) {
    echo "   ✗ Erro: " . $e->getMessage() . "\n\n";
}

// 3. Testar contagem de bosses
echo "3. Testando contagem de bosses...\n";
try {
    $bossMapNumbers = [6, 7, 8, 10, 24, 34, 39, 51, 56, 57, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];
    $placeholders = implode(',', array_fill(0, count($bossMapNumbers), '?'));
    
    $sqlBosses = "SELECT COUNT(DISTINCT MapNumber) as alive_bosses 
                  FROM Monster 
                  WHERE MapNumber IN ($placeholders) 
                  AND Life > 0";
    $stmtBosses = $conn->prepare($sqlBosses);
    $stmtBosses->execute($bossMapNumbers);
    $bossesData = $stmtBosses->fetch(PDO::FETCH_ASSOC);
    
    echo "   ✓ Bosses vivos: {$bossesData['alive_bosses']}\n";
    echo "   ℹ Total configurado: 120\n\n";
} catch(PDOException $e) {
    echo "   ✗ Erro: " . $e->getMessage() . "\n";
    echo "   ℹ Sua tabela Monster pode ter estrutura diferente\n\n";
}

// 4. Testar contagem de players online
echo "4. Testando contagem de players online...\n";
try {
    $sqlOnline = "SELECT COUNT(*) as total FROM MEMB_STAT WHERE ConnectStat = 1";
    $stmtOnline = $conn->prepare($sqlOnline);
    $stmtOnline->execute();
    $online = $stmtOnline->fetch(PDO::FETCH_ASSOC);
    
    echo "   ✓ Players online: {$online['total']}\n\n";
} catch(PDOException $e) {
    echo "   ✗ Erro: " . $e->getMessage() . "\n\n";
}

// 5. Testar geração de cache
echo "5. Testando geração de cache...\n";
$cacheFile = __DIR__ . '/data/server_info.json';

if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
    echo "   ℹ Pasta 'data' criada\n";
}

try {
    $testData = [
        'status' => 'online',
        'test' => true,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    file_put_contents($cacheFile, json_encode($testData, JSON_PRETTY_PRINT));
    
    if (file_exists($cacheFile)) {
        echo "   ✓ Cache criado com sucesso\n";
        echo "   ℹ Localização: $cacheFile\n\n";
    } else {
        echo "   ✗ Falha ao criar cache\n\n";
    }
} catch(Exception $e) {
    echo "   ✗ Erro: " . $e->getMessage() . "\n\n";
}

// 6. Testar execução completa do server_info.php
echo "6. Executando server_info.php completo...\n";
try {
    ob_start();
    include __DIR__ . '/server_info.php';
    $output = ob_get_clean();
    
    echo "   ✓ Executado com sucesso\n";
    echo "   ℹ Output: $output\n";
} catch(Exception $e) {
    echo "   ✗ Erro: " . $e->getMessage() . "\n\n";
}

// 7. Verificar conteúdo do cache
echo "\n7. Verificando conteúdo do cache...\n";
if (file_exists($cacheFile)) {
    $content = file_get_contents($cacheFile);
    $data = json_decode($content, true);
    
    echo "   ✓ Cache lido com sucesso\n";
    echo "   ℹ Conteúdo:\n";
    echo "   - Status: {$data['status']}\n";
    echo "   - Players: " . ($data['players_online'] ?? 'N/A') . "\n";
    echo "   - Bosses: " . ($data['alive_bosses'] ?? 'N/A') . "/" . ($data['total_bosses'] ?? 'N/A') . "\n";
    echo "   - Atualizado: " . ($data['updated_at'] ?? 'N/A') . "\n\n";
} else {
    echo "   ✗ Cache não encontrado\n\n";
}

echo "\n=== TESTE FINALIZADO ===\n";
echo "Se todos os testes passaram, o sistema está funcionando!\n";
echo "Configure o cron para executar automaticamente.\n\n";

echo "Comando sugerido para cron:\n";
echo "*/5 * * * * php " . __DIR__ . "/cron.php\n\n";
?>
