<?php
/**
 * Firewall de Aplicação Web (WAF)
 * Proteção completa contra diversos tipos de ataques
 */

class WebFirewall {
    
    private $blocked_user_agents = [
        'sqlmap',
        'nikto',
        'nmap',
        'masscan',
        'metasploit',
        'burp',
        'havij',
        'acunetix',
        'nessus',
        'openvas',
        'vega',
        'grabber',
        'webinspect'
    ];
    
    private $suspicious_patterns = [
        'file_get_contents',
        'eval(',
        'base64_decode',
        'gzinflate',
        'system(',
        'exec(',
        'passthru(',
        'shell_exec',
        'phpinfo',
        'proc_open',
        '../',
        '..\\',
        '/etc/passwd',
        '/proc/self/environ',
        'cmd.exe',
        'powershell'
    ];
    
    /**
     * Inicializa firewall
     */
    public function __construct() {
        $this->checkSecurityHeaders();
        $this->checkUserAgent();
        $this->checkRequestMethod();
        $this->checkSuspiciousPatterns();
        $this->checkFileUpload();
    }
    
    /**
     * Adiciona headers de segurança
     */
    private function checkSecurityHeaders() {
        // Previne clickjacking
        header('X-Frame-Options: SAMEORIGIN');
        
        // Previne MIME sniffing
        header('X-Content-Type-Options: nosniff');
        
        // XSS Protection
        header('X-XSS-Protection: 1; mode=block');
        
        // Content Security Policy
        header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
        
        // Referrer Policy
        header('Referrer-Policy: strict-origin-when-cross-origin');
        
        // Permissions Policy
        header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
    }
    
    /**
     * Verifica User Agent suspeito
     */
    private function checkUserAgent() {
        $user_agent = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
        
        foreach ($this->blocked_user_agents as $blocked) {
            if (strpos($user_agent, $blocked) !== false) {
                $this->blockRequest("Blocked User Agent: $blocked");
            }
        }
        
        // Bloqueia se não tem user agent
        if (empty($user_agent)) {
            $this->blockRequest("Empty User Agent");
        }
    }
    
    /**
     * Verifica método de requisição
     */
    private function checkRequestMethod() {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $allowed_methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
        
        if (!in_array($method, $allowed_methods)) {
            $this->blockRequest("Invalid Request Method: $method");
        }
    }
    
    /**
     * Verifica padrões suspeitos em todas as entradas
     */
    private function checkSuspiciousPatterns() {
        $inputs = array_merge($_GET, $_POST, $_COOKIE);
        
        foreach ($inputs as $key => $value) {
            if (is_string($value)) {
                foreach ($this->suspicious_patterns as $pattern) {
                    if (stripos($value, $pattern) !== false) {
                        $this->blockRequest("Suspicious pattern detected: $pattern in $key");
                    }
                }
            }
        }
    }
    
    /**
     * Verifica upload de arquivos suspeitos
     */
    private function checkFileUpload() {
        if (!empty($_FILES)) {
            foreach ($_FILES as $file) {
                if (isset($file['name'])) {
                    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                    $dangerous_extensions = ['php', 'phtml', 'php3', 'php4', 'php5', 'exe', 'bat', 'sh', 'cgi', 'pl'];
                    
                    if (in_array($ext, $dangerous_extensions)) {
                        $this->blockRequest("Dangerous file upload attempt: .$ext");
                    }
                }
            }
        }
    }
    
    /**
     * Bloqueia requisição
     */
    private function blockRequest($reason) {
        $this->logAttack($reason);
        
        http_response_code(403);
        header('Content-Type: application/json');
        
        echo json_encode([
            'error' => true,
            'message' => 'Access Forbidden',
            'code' => 403
        ]);
        
        exit;
    }
    
    /**
     * Log de ataques
     */
    private function logAttack($reason) {
        $log_file = __DIR__ . '/../data/firewall.log';
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $uri = $_SERVER['REQUEST_URI'] ?? 'Unknown';
        $method = $_SERVER['REQUEST_METHOD'] ?? 'Unknown';
        
        $log_message = "[$timestamp] [$ip] BLOCKED: $reason\n";
        $log_message .= "URI: $uri\n";
        $log_message .= "Method: $method\n";
        $log_message .= "User-Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'None') . "\n";
        $log_message .= "---\n";
        
        file_put_contents($log_file, $log_message, FILE_APPEND);
    }
    
    /**
     * Verifica se IP está em whitelist
     */
    public function isWhitelisted($ip = null) {
        $ip = $ip ?? $_SERVER['REMOTE_ADDR'];
        $whitelist_file = __DIR__ . '/../data/whitelist.json';
        
        if (file_exists($whitelist_file)) {
            $whitelist = json_decode(file_get_contents($whitelist_file), true);
            return in_array($ip, $whitelist);
        }
        
        return false;
    }
    
    /**
     * Adiciona IP à whitelist
     */
    public function addToWhitelist($ip) {
        $whitelist_file = __DIR__ . '/../data/whitelist.json';
        $whitelist = [];
        
        if (file_exists($whitelist_file)) {
            $whitelist = json_decode(file_get_contents($whitelist_file), true);
        }
        
        if (!in_array($ip, $whitelist)) {
            $whitelist[] = $ip;
            file_put_contents($whitelist_file, json_encode($whitelist, JSON_PRETTY_PRINT));
        }
    }
}

// Inicializa firewall automaticamente
$firewall = new WebFirewall();
?>
