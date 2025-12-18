<?php
/**
 * Gerador de Dados Demo
 * Útil para desenvolvimento quando não tem MySQL configurado
 * Execute: php generate_demo_data.php
 */

echo "=== GERADOR DE DADOS DEMO ===\n\n";

// Criar pasta data se não existir
if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
    echo "✓ Pasta 'data' criada\n";
}

// Gerar dados aleatórios realistas
$players_online = rand(800, 1500);
$alive_bosses = rand(60, 100);
$total_bosses = 120;

$demo_data = [
    'status' => 'online',
    'players_online' => $players_online,
    'total_accounts' => rand(3000, 8000),
    'total_characters' => rand(10000, 20000),
    'total_guilds' => rand(150, 400),
    'castle_owner' => ['DragonGuard', 'ShadowKings', 'EternalLegends', 'PhoenixRise'][rand(0, 3)],
    'total_bosses' => $total_bosses,
    'alive_bosses' => $alive_bosses,
    'server_name' => 'MeuMU Online',
    'season' => 'Season 19-2-3 - Épico',
    'exp_rate' => '9999x',
    'drop_rate' => '60%',
    'updated_at' => date('Y-m-d H:i:s')
];

// Salvar em JSON
$json_file = __DIR__ . '/data/server_info.json';
file_put_contents($json_file, json_encode($demo_data, JSON_PRETTY_PRINT));

echo "✓ Dados demo gerados:\n";
echo "  - Players Online: {$players_online}\n";
echo "  - Bosses Vivos: {$alive_bosses}/{$total_bosses}\n";
echo "  - Guild do Castelo: {$demo_data['castle_owner']}\n";
echo "  - Arquivo: $json_file\n\n";

echo "=== DADOS SALVOS COM SUCESSO ===\n";
echo "Agora você pode testar o widget sem banco de dados!\n";
echo "URL: http://localhost/api/data/server_info.json\n\n";

// Mostrar preview do JSON
echo "Preview do JSON:\n";
echo "─────────────────────────────────────────\n";
echo json_encode($demo_data, JSON_PRETTY_PRINT);
echo "\n─────────────────────────────────────────\n";
?>
