<?php
/**
 * Limpeza Automática de Logs e Dados Antigos
 * Execute via cron diariamente
 */

require_once __DIR__ . '/../config.php';

class SecurityCleanup {
    
    private $data_dir;
    private $max_log_size = 10485760; // 10MB
    private $max_log_age = 2592000; // 30 dias
    
    public function __construct() {
        $this->data_dir = __DIR__ . '/../data/';
    }
    
    /**
     * Executa limpeza completa
     */
    public function run() {
        echo "=== Security Cleanup Started at " . date('Y-m-d H:i:s') . " ===\n";
        
        $this->cleanOldLogs();
        $this->rotateLargeLogs();
        $this->cleanExpiredBans();
        $this->cleanOldRateLimits();
        $this->optimizeJsonFiles();
        
        echo "=== Cleanup Finished! ===\n";
    }
    
    /**
     * Remove logs antigos
     */
    private function cleanOldLogs() {
        echo "Cleaning old logs... ";
        
        $log_files = [
            'security.log',
            'firewall.log',
            'sql_injection_attempts.log',
            'security_main.log'
        ];
        
        $cleaned = 0;
        foreach ($log_files as $file) {
            $filepath = $this->data_dir . $file;
            
            if (file_exists($filepath)) {
                $age = time() - filemtime($filepath);
                
                // Se log tem mais de 30 dias, arquiva
                if ($age > $this->max_log_age) {
                    $archive_name = $file . '.' . date('Y-m-d') . '.bak';
                    rename($filepath, $this->data_dir . $archive_name);
                    touch($filepath);
                    $cleaned++;
                }
            }
        }
        
        echo "Done! $cleaned logs archived.\n";
    }
    
    /**
     * Rotaciona logs grandes
     */
    private function rotateLargeLogs() {
        echo "Rotating large logs... ";
        
        $log_files = glob($this->data_dir . '*.log');
        $rotated = 0;
        
        foreach ($log_files as $filepath) {
            if (filesize($filepath) > $this->max_log_size) {
                $filename = basename($filepath);
                $archive_name = $filename . '.' . date('Ymd-His') . '.bak';
                
                copy($filepath, $this->data_dir . $archive_name);
                file_put_contents($filepath, '');
                
                $rotated++;
            }
        }
        
        echo "Done! $rotated logs rotated.\n";
    }
    
    /**
     * Remove bans expirados
     */
    private function cleanExpiredBans() {
        echo "Cleaning expired bans... ";
        
        $file = $this->data_dir . 'banned_ips.json';
        
        if (!file_exists($file)) {
            echo "No bans file.\n";
            return;
        }
        
        $banned = json_decode(file_get_contents($file), true);
        $original_count = count($banned);
        $current_time = time();
        
        foreach ($banned as $ip => $info) {
            $ban_age = $current_time - $info['time'];
            $duration = $info['duration'] ?? 3600;
            
            // Remove ban expirado
            if ($ban_age > $duration) {
                unset($banned[$ip]);
            }
        }
        
        file_put_contents($file, json_encode($banned, JSON_PRETTY_PRINT));
        
        $cleaned = $original_count - count($banned);
        echo "Done! $cleaned expired bans removed.\n";
    }
    
    /**
     * Limpa rate limits antigos
     */
    private function cleanOldRateLimits() {
        echo "Cleaning old rate limits... ";
        
        $file = $this->data_dir . 'rate_limit.json';
        
        if (!file_exists($file)) {
            echo "No rate limit file.\n";
            return;
        }
        
        $data = json_decode(file_get_contents($file), true);
        $original_count = count($data);
        $current_time = time();
        
        foreach ($data as $ip => $info) {
            $age = $current_time - $info['first_request'];
            
            // Remove se mais de 24 horas
            if ($age > 86400) {
                unset($data[$ip]);
            } else {
                // Remove requisições antigas (mais de 5 minutos)
                $data[$ip]['requests'] = array_filter($data[$ip]['requests'], function($timestamp) use ($current_time) {
                    return ($current_time - $timestamp) < 300;
                });
            }
        }
        
        file_put_contents($file, json_encode($data));
        
        $cleaned = $original_count - count($data);
        echo "Done! $cleaned old entries removed.\n";
    }
    
    /**
     * Otimiza arquivos JSON
     */
    private function optimizeJsonFiles() {
        echo "Optimizing JSON files... ";
        
        $json_files = glob($this->data_dir . '*.json');
        $optimized = 0;
        
        foreach ($json_files as $filepath) {
            $data = json_decode(file_get_contents($filepath), true);
            
            if ($data !== null) {
                // Reescreve com formatação otimizada
                file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT));
                $optimized++;
            }
        }
        
        echo "Done! $optimized files optimized.\n";
    }
    
    /**
     * Remove backups antigos (mais de 90 dias)
     */
    public function cleanOldBackups() {
        echo "Cleaning old backups... ";
        
        $backup_files = glob($this->data_dir . '*.bak');
        $removed = 0;
        
        foreach ($backup_files as $filepath) {
            $age = time() - filemtime($filepath);
            
            // Remove se mais de 90 dias
            if ($age > 7776000) {
                unlink($filepath);
                $removed++;
            }
        }
        
        echo "Done! $removed old backups removed.\n";
    }
    
    /**
     * Gera relatório de espaço
     */
    public function getStorageReport() {
        $total_size = 0;
        $files = glob($this->data_dir . '*');
        
        $report = [
            'total_files' => count($files),
            'files' => []
        ];
        
        foreach ($files as $filepath) {
            $size = filesize($filepath);
            $total_size += $size;
            
            $report['files'][] = [
                'name' => basename($filepath),
                'size' => $this->formatBytes($size),
                'modified' => date('Y-m-d H:i:s', filemtime($filepath))
            ];
        }
        
        $report['total_size'] = $this->formatBytes($total_size);
        
        return $report;
    }
    
    /**
     * Formata bytes para leitura humana
     */
    private function formatBytes($bytes) {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}

// Executa limpeza
$cleanup = new SecurityCleanup();
$cleanup->run();
$cleanup->cleanOldBackups();

// Mostra relatório de armazenamento
echo "\n=== Storage Report ===\n";
$report = $cleanup->getStorageReport();
echo "Total files: {$report['total_files']}\n";
echo "Total size: {$report['total_size']}\n";

// Salva relatório
file_put_contents(__DIR__ . '/../data/cleanup_report.json', json_encode($report, JSON_PRETTY_PRINT));
?>
