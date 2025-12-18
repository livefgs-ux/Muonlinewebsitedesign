<?php
/**
 * Sistema de Proteção Unificado
 * Inclui todas as camadas de segurança em um único arquivo
 */

// Carrega todos os módulos de segurança
require_once __DIR__ . '/anti_ddos.php';
require_once __DIR__ . '/anti_sql_injection.php';
require_once __DIR__ . '/firewall.php';

class SecurityProtection {
    
    private $antiDDoS;
    private $antiSQL;
    private $firewall;
    
    public function __construct() {
        // Inicializa módulos
        $this->antiDDoS = new AntiDDoS();
        $this->antiSQL = new AntiSQLInjection();
        $this->firewall = new WebFirewall();
        
        // Aplica proteções
        $this->applyProtection();
    }
    
    /**
     * Aplica todas as proteções
     */
    private function applyProtection() {
        // 1. Verifica IP banido
        $ban_status = $this->antiDDoS->isIPBanned();
        if ($ban_status['banned']) {
            $this->antiDDoS->blockResponse(
                "IP Banido: " . $ban_status['reason'],
                403
            );
        }
        
        // 2. Verifica rate limit
        $rate_limit = $this->antiDDoS->checkRateLimit();
        if (!$rate_limit['allowed']) {
            $this->antiDDoS->blockResponse(
                "Muitas requisições: {$rate_limit['requests']}/{$rate_limit['limit']}",
                429
            );
        }
        
        // 3. Valida inputs contra SQL Injection
        $this->validateInputs();
    }
    
    /**
     * Valida todos os inputs
     */
    private function validateInputs() {
        $inputs = array_merge($_GET, $_POST);
        
        foreach ($inputs as $key => $value) {
            if (!$this->antiSQL->validate($value)) {
                $this->blockMaliciousRequest("SQL Injection detectado em: $key");
            }
        }
    }
    
    /**
     * Bloqueia requisição maliciosa
     */
    private function blockMaliciousRequest($reason) {
        http_response_code(403);
        header('Content-Type: application/json');
        
        echo json_encode([
            'error' => true,
            'message' => 'Acesso negado',
            'reason' => $reason,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
        $this->logSecurity("BLOCKED: $reason");
        exit;
    }
    
    /**
     * Log de segurança
     */
    private function logSecurity($message) {
        $log_file = __DIR__ . '/../data/security_main.log';
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $log_message = "[$timestamp] [$ip] $message\n";
        file_put_contents($log_file, $log_message, FILE_APPEND);
    }
    
    /**
     * Sanitiza input
     */
    public function sanitize($input) {
        return $this->antiSQL->sanitize($input);
    }
    
    /**
     * Valida username
     */
    public function validateUsername($username) {
        return $this->antiSQL->validateUsername($username);
    }
    
    /**
     * Valida email
     */
    public function validateEmail($email) {
        return $this->antiSQL->validateEmail($email);
    }
    
    /**
     * Valida nome de personagem
     */
    public function validateCharacterName($name) {
        return $this->antiSQL->validateCharacterName($name);
    }
    
    /**
     * Obtém estatísticas de segurança
     */
    public function getSecurityStats() {
        $banned_file = __DIR__ . '/../data/banned_ips.json';
        $rate_limit_file = __DIR__ . '/../data/rate_limit.json';
        
        $banned = file_exists($banned_file) 
            ? json_decode(file_get_contents($banned_file), true) 
            : [];
            
        $rate_limits = file_exists($rate_limit_file)
            ? json_decode(file_get_contents($rate_limit_file), true)
            : [];
        
        return [
            'total_banned_ips' => count($banned),
            'total_monitored_ips' => count($rate_limits),
            'banned_ips' => $banned
        ];
    }
}

// Inicializa proteção automaticamente
$security = new SecurityProtection();
?>
