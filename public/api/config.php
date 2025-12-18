<?php
/**
 * Configuração do Banco de Dados MySQL/MariaDB
 * Edite este arquivo com suas credenciais
 */

// Configurações do MySQL/MariaDB
define('DB_HOST', 'localhost'); // ou IP do servidor MySQL
define('DB_USER', 'root'); // usuário do MySQL
define('DB_PASS', 'sua_senha_aqui'); // senha do MySQL
define('DB_NAME', 'MuOnline'); // nome do banco de dados
define('DB_PORT', '3306'); // porta do MySQL (padrão 3306)
define('DB_CHARSET', 'utf8mb4'); // charset

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Cria pasta data se não existir
if (!file_exists(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
}
?>