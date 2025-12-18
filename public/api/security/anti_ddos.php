<?php
/**
 * Sistema Anti-DDoS e Rate Limiting
 * Protege contra ataques de negação de serviço
 */

class AntiDDoS {
    
    private $max_requests = 60; // Máximo de requisições
    private $time_window = 60; // Janela de tempo em segundos
    private $ban_duration = 3600; // Duração do ban em segundos (1 hora)
    private $data_file = __DIR__ . '/../data/rate_limit.json';
    private $ban_file = __DIR__ . '/../data/banned_ips.json';
    
    public function __construct() {
        // Cria arquivos se não existirem
        if (!file_exists($this->data_file)) {
            file_put_contents($this->data_file, json_encode([]));
        }
        if (!file_exists($this->ban_file)) {
            file_put_contents($this->ban_file, json_encode([]));
        }
    }
    
    /**
     * Obtém IP real do usuário (considera proxies)
     */
    private function getRealIP() {
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            return $_SERVER['HTTP_CF_CONNECTING_IP']; // Cloudflare
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ips[0]);
        }
        if (!empty($_SERVER['HTTP_X_REAL_IP'])) {
            return $_SERVER['HTTP_X_REAL_IP'];
        }
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
    
    /**
     * Verifica se IP está banido
     */
    public function isIPBanned() {
        $ip = $this->getRealIP();
        $banned = json_decode(file_get_contents($this->ban_file), true);
        
        if (isset($banned[$ip])) {
            $ban_time = $banned[$ip]['time'];
            $duration = $banned[$ip]['duration'] ?? $this->ban_duration;
            
            // Verifica se o ban expirou
            if (time() - $ban_time < $duration) {
                return [
                    'banned' => true,
                    'reason' => $banned[$ip]['reason'] ?? 'Excesso de requisições',
                    'expires_in' => $duration - (time() - $ban_time)
                ];
            } else {
                // Remove ban expirado
                unset($banned[$ip]);
                file_put_contents($this->ban_file, json_encode($banned));
            }
        }
        
        return ['banned' => false];
    }
    
    /**
     * Bane um IP
     */
    private function banIP($reason = 'DDoS Attack Detected') {
        $ip = $this->getRealIP();
        $banned = json_decode(file_get_contents($this->ban_file), true);
        
        $banned[$ip] = [
            'time' => time(),
            'duration' => $this->ban_duration,
            'reason' => $reason,
            'requests' => $this->getRequestCount()
        ];
        
        file_put_contents($this->ban_file, json_encode($banned, JSON_PRETTY_PRINT));
        
        // Log do ban
        $this->logSecurity("IP BANNED: $ip - Reason: $reason");
    }
    
    /**
     * Conta requisições do IP
     */
    private function getRequestCount() {
        $ip = $this->getRealIP();
        $data = json_decode(file_get_contents($this->data_file), true);
        
        if (isset($data[$ip])) {
            return count($data[$ip]['requests']);
        }
        
        return 0;
    }
    
    /**
     * Verifica rate limit
     */
    public function checkRateLimit() {
        $ip = $this->getRealIP();
        $current_time = time();
        
        // Carrega dados
        $data = json_decode(file_get_contents($this->data_file), true);
        
        // Inicializa IP se não existir
        if (!isset($data[$ip])) {
            $data[$ip] = [
                'requests' => [],
                'first_request' => $current_time
            ];
        }
        
        // Remove requisições antigas (fora da janela de tempo)
        $data[$ip]['requests'] = array_filter($data[$ip]['requests'], function($timestamp) use ($current_time) {
            return ($current_time - $timestamp) < $this->time_window;
        });
        
        // Adiciona requisição atual
        $data[$ip]['requests'][] = $current_time;
        
        // Conta requisições
        $request_count = count($data[$ip]['requests']);
        
        // Salva dados
        file_put_contents($this->data_file, json_encode($data));
        
        // Verifica se excedeu o limite
        if ($request_count > $this->max_requests) {
            $this->banIP("Excesso de requisições: $request_count em {$this->time_window}s");
            return [
                'allowed' => false,
                'reason' => 'Too many requests',
                'requests' => $request_count,
                'limit' => $this->max_requests
            ];
        }
        
        return [
            'allowed' => true,
            'requests' => $request_count,
            'limit' => $this->max_requests,
            'remaining' => $this->max_requests - $request_count
        ];
    }
    
    /**
     * Log de segurança
     */
    private function logSecurity($message) {
        $log_file = __DIR__ . '/../data/security.log';
        $timestamp = date('Y-m-d H:i:s');
        $ip = $this->getRealIP();
        $log_message = "[$timestamp] [$ip] $message\n";
        file_put_contents($log_file, $log_message, FILE_APPEND);
    }
    
    /**
     * Retorna resposta de bloqueio
     */
    public function blockResponse($reason = 'Access Denied', $code = 429) {
        http_response_code($code);
        header('Content-Type: application/json');
        
        $response = [
            'error' => true,
            'message' => $reason,
            'code' => $code,
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        echo json_encode($response);
        exit;
    }
    
    /**
     * Limpa dados antigos (executar no cron)
     */
    public function cleanup() {
        $current_time = time();
        
        // Limpa rate limits
        $data = json_decode(file_get_contents($this->data_file), true);
        foreach ($data as $ip => $info) {
            if (($current_time - $info['first_request']) > 86400) { // 24 horas
                unset($data[$ip]);
            }
        }
        file_put_contents($this->data_file, json_encode($data));
        
        // Limpa bans expirados
        $banned = json_decode(file_get_contents($this->ban_file), true);
        foreach ($banned as $ip => $info) {
            if (($current_time - $info['time']) > $info['duration']) {
                unset($banned[$ip]);
            }
        }
        file_put_contents($this->ban_file, json_encode($banned));
        
        $this->logSecurity("Cleanup executed");
    }
}

// Uso básico (incluir em todas as páginas da API)
$antiDDoS = new AntiDDoS();

// Verifica se IP está banido
$ban_status = $antiDDoS->isIPBanned();
if ($ban_status['banned']) {
    $antiDDoS->blockResponse(
        "Você foi banido por: " . $ban_status['reason'] . 
        ". Expira em: " . gmdate('H:i:s', $ban_status['expires_in']),
        403
    );
}

// Verifica rate limit
$rate_limit = $antiDDoS->checkRateLimit();
if (!$rate_limit['allowed']) {
    $antiDDoS->blockResponse(
        "Muitas requisições. Limite: {$rate_limit['limit']} por minuto. Você fez: {$rate_limit['requests']}",
        429
    );
}

// Adiciona headers de rate limit
header("X-RateLimit-Limit: {$rate_limit['limit']}");
header("X-RateLimit-Remaining: {$rate_limit['remaining']}");
header("X-RateLimit-Reset: 60");
?>
