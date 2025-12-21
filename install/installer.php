<?php
/**
 * MeuMU Online - Instalador Backend
 * Processa a instalação do sistema com 2 databases
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Ler JSON
$input = file_get_contents('php://input');
$request = json_decode($input, true);

$action = $request['action'] ?? '';
$data = $request['data'] ?? [];

// Funções auxiliares
function respond($success, $message, $extra = []) {
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message
    ], $extra));
    exit;
}

function checkPermissions() {
    $errors = [];
    
    // Verificar pasta backend-nodejs
    $backendPath = __DIR__ . '/../backend-nodejs';
    if (!is_dir($backendPath)) {
        $errors[] = "Pasta 'backend-nodejs' não encontrada";
    } elseif (!is_writable($backendPath)) {
        $errors[] = "Pasta 'backend-nodejs' não tem permissão de escrita";
    }
    
    // Verificar raiz do projeto
    $rootPath = __DIR__ . '/..';
    if (!is_writable($rootPath)) {
        $errors[] = "Pasta raiz do projeto não tem permissão de escrita";
    }
    
    return [
        'success' => empty($errors),
        'errors' => $errors,
        'instructions' => empty($errors) ? null : 'Execute: chmod -R 775 ' . realpath($rootPath)
    ];
}

function testDatabaseConnection($host, $port, $database, $user, $password) {
    try {
        $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return ['success' => true, 'pdo' => $pdo];
    } catch (PDOException $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

function createDatabaseIfNotExists($host, $port, $user, $password, $dbName) {
    try {
        // Conectar sem especificar database
        $dsn = "mysql:host={$host};port={$port};charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        
        // Criar database se não existir
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        
        return ['success' => true];
    } catch (PDOException $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

function executeSchemaSQL($pdo, $sqlFile) {
    try {
        $sql = file_get_contents($sqlFile);
        
        // Dividir por statements (separados por ;)
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            function($stmt) {
                return !empty($stmt) && 
                       !preg_match('/^\s*--/', $stmt) && 
                       !preg_match('/^\s*\/\*/', $stmt);
            }
        );
        
        foreach ($statements as $statement) {
            if (!empty($statement)) {
                $pdo->exec($statement);
            }
        }
        
        return ['success' => true];
    } catch (PDOException $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

function createEnvFile($data) {
    $envContent = "# MeuMU Online - Configuração do Backend\n";
    $envContent .= "# Gerado automaticamente pelo instalador\n\n";
    $envContent .= "# Database MU (Read Only)\n";
    $envContent .= "DB_MU_HOST={$data['database']['db_host']}\n";
    $envContent .= "DB_MU_PORT={$data['database']['db_port']}\n";
    $envContent .= "DB_MU_NAME={$data['database']['db_mu']}\n";
    $envContent .= "DB_MU_USER={$data['database']['db_user']}\n";
    $envContent .= "DB_MU_PASSWORD={$data['database']['db_password']}\n\n";
    $envContent .= "# Database Web (Read + Write)\n";
    $envContent .= "DB_WEB_HOST={$data['database']['db_host']}\n";
    $envContent .= "DB_WEB_PORT={$data['database']['db_port']}\n";
    $envContent .= "DB_WEB_NAME={$data['database']['db_web']}\n";
    $envContent .= "DB_WEB_USER={$data['database']['db_user']}\n";
    $envContent .= "DB_WEB_PASSWORD={$data['database']['db_password']}\n\n";
    $envContent .= "# JWT\n";
    $envContent .= "JWT_SECRET=" . bin2hex(random_bytes(32)) . "\n\n";
    $envContent .= "# Server\n";
    $envContent .= "PORT=3001\n";
    $envContent .= "NODE_ENV=production\n\n";
    $envContent .= "# CORS\n";
    $envContent .= "ALLOWED_ORIGINS={$data['backend']['site_url']},http://localhost:5173\n";
    
    $envPath = __DIR__ . '/../backend-nodejs/.env';
    return file_put_contents($envPath, $envContent) !== false;
}

function createConfigFile($data) {
    $configContent = "<?php\n";
    $configContent .= "// MeuMU Online - Configuração\n";
    $configContent .= "// Gerado automaticamente pelo instalador\n\n";
    $configContent .= "// Database MU (Read Only)\n";
    $configContent .= "define('DB_MU_HOST', '{$data['database']['db_host']}');\n";
    $configContent .= "define('DB_MU_PORT', '{$data['database']['db_port']}');\n";
    $configContent .= "define('DB_MU_NAME', '{$data['database']['db_mu']}');\n";
    $configContent .= "define('DB_MU_USER', '{$data['database']['db_user']}');\n";
    $configContent .= "define('DB_MU_PASSWORD', '{$data['database']['db_password']}');\n\n";
    $configContent .= "// Database Web (Read + Write)\n";
    $configContent .= "define('DB_WEB_HOST', '{$data['database']['db_host']}');\n";
    $configContent .= "define('DB_WEB_PORT', '{$data['database']['db_port']}');\n";
    $configContent .= "define('DB_WEB_NAME', '{$data['database']['db_web']}');\n";
    $configContent .= "define('DB_WEB_USER', '{$data['database']['db_user']}');\n";
    $configContent .= "define('DB_WEB_PASSWORD', '{$data['database']['db_password']}');\n\n";
    $configContent .= "// Site\n";
    $configContent .= "define('SITE_URL', '{$data['backend']['site_url']}');\n";
    $configContent .= "define('BACKEND_PORT', '3001');\n";
    $configContent .= "define('BACKEND_MODE', '{$data['backend']['mode']}');\n";
    $configContent .= "?>";
    
    $configPath = __DIR__ . '/../config.php';
    return file_put_contents($configPath, $configContent) !== false;
}

function startBackend($mode) {
    $backendPath = __DIR__ . '/../backend-nodejs';
    
    // Verificar se node_modules existe
    if (!is_dir($backendPath . '/node_modules')) {
        // Instalar dependências
        exec("cd $backendPath && npm install 2>&1", $output, $returnCode);
        if ($returnCode !== 0) {
            return ['success' => false, 'error' => 'Falha ao instalar dependências npm'];
        }
    }
    
    if ($mode === 'pm2') {
        // Verificar se PM2 está instalado
        exec('which pm2', $output, $returnCode);
        if ($returnCode !== 0) {
            // Instalar PM2
            exec('npm install -g pm2 2>&1', $output, $returnCode);
            if ($returnCode !== 0) {
                return ['success' => false, 'error' => 'Falha ao instalar PM2'];
            }
        }
        
        // Iniciar com PM2
        exec("cd $backendPath && pm2 delete meumu-backend 2>/dev/null && pm2 start src/server.js --name meumu-backend && pm2 save", $output, $returnCode);
        return ['success' => $returnCode === 0, 'mode' => 'pm2'];
    } else {
        // Iniciar standalone (background)
        exec("cd $backendPath && node src/server.js > /dev/null 2>&1 &", $output, $returnCode);
        return ['success' => true, 'mode' => 'standalone'];
    }
}

// Processar ações
switch ($action) {
    case 'check_permissions':
        $permissions = checkPermissions();
        respond($permissions['success'], 
            $permissions['success'] ? 'Permissões OK' : 'Permissões insuficientes',
            $permissions
        );
        break;
    
    case 'test_database':
        $db = $data;
        
        // Testar database MU
        $resultMU = testDatabaseConnection(
            $db['db_host'],
            $db['db_port'],
            $db['db_mu'],
            $db['db_user'],
            $db['db_password']
        );
        
        if (!$resultMU['success']) {
            respond(false, 'Erro ao conectar database MU: ' . $resultMU['error']);
        }
        
        // Verificar se tabela accounts existe
        try {
            $pdo = $resultMU['pdo'];
            $stmt = $pdo->query("SHOW TABLES LIKE 'accounts'");
            if ($stmt->rowCount() === 0) {
                respond(false, 'Tabela "accounts" não encontrada no database MU');
            }
        } catch (PDOException $e) {
            respond(false, 'Erro ao verificar tabelas: ' . $e->getMessage());
        }
        
        // Database Web não precisa existir (será criada)
        respond(true, 'Conexão estabelecida com sucesso! Database MU verificado.');
        break;
        
    case 'install':
        // 1. Verificar permissões
        $permissions = checkPermissions();
        if (!$permissions['success']) {
            respond(false, 'Permissões insuficientes', $permissions);
        }
        
        // 2. Criar database Web se não existir
        $createWebDB = createDatabaseIfNotExists(
            $data['database']['db_host'],
            $data['database']['db_port'],
            $data['database']['db_user'],
            $data['database']['db_password'],
            $data['database']['db_web']
        );
        
        if (!$createWebDB['success']) {
            respond(false, 'Erro ao criar database Web: ' . $createWebDB['error']);
        }
        
        // 3. Conectar ao database Web e executar schema
        $resultWeb = testDatabaseConnection(
            $data['database']['db_host'],
            $data['database']['db_port'],
            $data['database']['db_web'],
            $data['database']['db_user'],
            $data['database']['db_password']
        );
        
        if (!$resultWeb['success']) {
            respond(false, 'Erro ao conectar database Web: ' . $resultWeb['error']);
        }
        
        // 4. Executar schema SQL
        $schemaFile = __DIR__ . '/webmu_schema.sql';
        $schemaResult = executeSchemaSQL($resultWeb['pdo'], $schemaFile);
        
        if (!$schemaResult['success']) {
            respond(false, 'Erro ao criar tabelas: ' . $schemaResult['error']);
        }
        
        // 5. Criar arquivo .env
        if (!createEnvFile($data)) {
            respond(false, 'Erro ao criar arquivo .env');
        }
        
        // 6. Criar config.php
        if (!createConfigFile($data)) {
            respond(false, 'Erro ao criar arquivo config.php');
        }
        
        // 7. Iniciar backend
        $backendResult = startBackend($data['backend']['mode']);
        if (!$backendResult['success']) {
            respond(false, 'Erro ao iniciar backend: ' . $backendResult['error']);
        }
        
        // 8. Criar arquivo .installed para evitar reinstalação
        file_put_contents(__DIR__ . '/.installed', date('Y-m-d H:i:s'));
        
        respond(true, 'Instalação concluída com sucesso!', [
            'backend_mode' => $backendResult['mode'],
            'database_web_created' => true
        ]);
        break;
        
    default:
        respond(false, 'Ação inválida');
}
?>
