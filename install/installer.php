<?php
/**
 * MeuMU Online - Instalador Backend
 * Processa a instalação do sistema
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

function createEnvFile($data) {
    $envContent = "# MeuMU Online - Configuração do Backend\n";
    $envContent .= "# Gerado automaticamente pelo instalador\n\n";
    $envContent .= "# Database\n";
    $envContent .= "DB_HOST={$data['database']['db_host']}\n";
    $envContent .= "DB_PORT={$data['database']['db_port']}\n";
    $envContent .= "DB_NAME={$data['database']['db_name']}\n";
    $envContent .= "DB_USER={$data['database']['db_user']}\n";
    $envContent .= "DB_PASSWORD={$data['database']['db_password']}\n\n";
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
    $configContent .= "define('DB_HOST', '{$data['database']['db_host']}');\n";
    $configContent .= "define('DB_PORT', '{$data['database']['db_port']}');\n";
    $configContent .= "define('DB_NAME', '{$data['database']['db_name']}');\n";
    $configContent .= "define('DB_USER', '{$data['database']['db_user']}');\n";
    $configContent .= "define('DB_PASSWORD', '{$data['database']['db_password']}');\n\n";
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

function createAdminUser($data) {
    $db = $data['database'];
    $admin = $data['admin'];
    
    $result = testDatabaseConnection($db['db_host'], $db['db_port'], $db['db_name'], $db['db_user'], $db['db_password']);
    if (!$result['success']) {
        return ['success' => false, 'error' => $result['error']];
    }
    
    $pdo = $result['pdo'];
    
    try {
        // Verificar se tabela MEMB_INFO existe
        $stmt = $pdo->query("SHOW TABLES LIKE 'MEMB_INFO'");
        if ($stmt->rowCount() === 0) {
            return ['success' => false, 'error' => 'Tabela MEMB_INFO não encontrada'];
        }
        
        // Hash da senha (MD5 para compatibilidade com MU Online)
        $password = md5($admin['admin_password']);
        
        // Inserir admin (ou atualizar se já existir)
        $stmt = $pdo->prepare("
            INSERT INTO MEMB_INFO (memb___id, memb__pwd, mail_addr, bloc_code, ctl1_code)
            VALUES (?, ?, ?, 0, 8)
            ON DUPLICATE KEY UPDATE
                memb__pwd = VALUES(memb__pwd),
                mail_addr = VALUES(mail_addr),
                ctl1_code = 8
        ");
        
        $stmt->execute([
            $admin['admin_user'],
            $password,
            $admin['admin_email']
        ]);
        
        return ['success' => true];
    } catch (PDOException $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

// Processar ações
switch ($action) {
    case 'test_database':
        $result = testDatabaseConnection(
            $data['db_host'],
            $data['db_port'],
            $data['db_name'],
            $data['db_user'],
            $data['db_password']
        );
        
        if ($result['success']) {
            respond(true, 'Conexão estabelecida com sucesso!');
        } else {
            respond(false, $result['error']);
        }
        break;
        
    case 'install':
        // 1. Criar arquivo .env
        if (!createEnvFile($data)) {
            respond(false, 'Erro ao criar arquivo .env');
        }
        
        // 2. Criar config.php
        if (!createConfigFile($data)) {
            respond(false, 'Erro ao criar arquivo config.php');
        }
        
        // 3. Criar usuário admin
        $adminResult = createAdminUser($data);
        if (!$adminResult['success']) {
            respond(false, 'Erro ao criar admin: ' . $adminResult['error']);
        }
        
        // 4. Iniciar backend
        $backendResult = startBackend($data['backend']['mode']);
        if (!$backendResult['success']) {
            respond(false, 'Erro ao iniciar backend: ' . $backendResult['error']);
        }
        
        // 5. Criar arquivo .installed para evitar reinstalação
        file_put_contents(__DIR__ . '/.installed', date('Y-m-d H:i:s'));
        
        respond(true, 'Instalação concluída com sucesso!', [
            'backend_mode' => $backendResult['mode']
        ]);
        break;
        
    default:
        respond(false, 'Ação inválida');
}
?>
