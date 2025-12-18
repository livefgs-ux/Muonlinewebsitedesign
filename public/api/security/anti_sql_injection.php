<?php
/**
 * Sistema Anti SQL Injection
 * Protege contra injeção de SQL
 */

class AntiSQLInjection {
    
    private $dangerous_patterns = [
        '/(\s|^)(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|eval)(\s|$)/i',
        '/(;|\||&&|`|>|<|\|)/i',
        '/(\bor\b|\band\b).*?=/i',
        '/--/',
        '/\/\*.*?\*\//',
        '/\bxp_/',
        '/\bsp_/',
    ];
    
    /**
     * Sanitiza input contra SQL Injection
     */
    public function sanitize($input) {
        if (is_array($input)) {
            return array_map([$this, 'sanitize'], $input);
        }
        
        // Remove null bytes
        $input = str_replace(chr(0), '', $input);
        
        // Remove tags HTML/PHP
        $input = strip_tags($input);
        
        // Escapa caracteres especiais
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
        
        return $input;
    }
    
    /**
     * Valida input contra padrões perigosos
     */
    public function validate($input) {
        if (is_array($input)) {
            foreach ($input as $value) {
                if (!$this->validate($value)) {
                    return false;
                }
            }
            return true;
        }
        
        foreach ($this->dangerous_patterns as $pattern) {
            if (preg_match($pattern, $input)) {
                $this->logAttempt($input, $pattern);
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Valida e sanitiza
     */
    public function clean($input) {
        if (!$this->validate($input)) {
            throw new Exception('Entrada contém caracteres inválidos ou potencialmente perigosos');
        }
        return $this->sanitize($input);
    }
    
    /**
     * Log de tentativas de ataque
     */
    private function logAttempt($input, $pattern) {
        $log_file = __DIR__ . '/../data/sql_injection_attempts.log';
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $log_message = "[$timestamp] [$ip] SQL Injection attempt detected\nPattern: $pattern\nInput: $input\n---\n";
        file_put_contents($log_file, $log_message, FILE_APPEND);
    }
    
    /**
     * Valida email
     */
    public function validateEmail($email) {
        $email = $this->sanitize($email);
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    /**
     * Valida username (apenas letras, números e _)
     */
    public function validateUsername($username) {
        $username = $this->sanitize($username);
        return preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username);
    }
    
    /**
     * Valida caracteres de personagem MU
     */
    public function validateCharacterName($name) {
        $name = $this->sanitize($name);
        return preg_match('/^[a-zA-Z0-9]{3,10}$/', $name);
    }
}

// Função helper global
function sanitize_input($input) {
    $anti_sql = new AntiSQLInjection();
    return $anti_sql->sanitize($input);
}

function validate_input($input) {
    $anti_sql = new AntiSQLInjection();
    return $anti_sql->validate($input);
}
?>
