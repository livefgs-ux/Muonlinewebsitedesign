<?php
/**
 * Relatório de Segurança
 * Gera estatísticas sobre tentativas de ataque e IPs banidos
 */

require_once __DIR__ . '/../config.php';

class SecurityReport {
    
    private $data_dir;
    
    public function __construct() {
        $this->data_dir = __DIR__ . '/../data/';
    }
    
    /**
     * Gera relatório completo
     */
    public function generateReport() {
        return [
            'timestamp' => date('Y-m-d H:i:s'),
            'banned_ips' => $this->getBannedIPs(),
            'sql_injection_attempts' => $this->getSQLInjectionAttempts(),
            'firewall_blocks' => $this->getFirewallBlocks(),
            'rate_limit_stats' => $this->getRateLimitStats(),
            'top_attacking_ips' => $this->getTopAttackingIPs()
        ];
    }
    
    /**
     * IPs banidos
     */
    private function getBannedIPs() {
        $file = $this->data_dir . 'banned_ips.json';
        
        if (!file_exists($file)) {
            return [
                'total' => 0,
                'ips' => []
            ];
        }
        
        $banned = json_decode(file_get_contents($file), true);
        
        return [
            'total' => count($banned),
            'ips' => $banned
        ];
    }
    
    /**
     * Tentativas de SQL Injection
     */
    private function getSQLInjectionAttempts() {
        $file = $this->data_dir . 'sql_injection_attempts.log';
        
        if (!file_exists($file)) {
            return [
                'total' => 0,
                'recent' => []
            ];
        }
        
        $content = file_get_contents($file);
        $attempts = explode('---', $content);
        
        return [
            'total' => count($attempts) - 1,
            'recent' => array_slice($attempts, -5)
        ];
    }
    
    /**
     * Bloqueios do Firewall
     */
    private function getFirewallBlocks() {
        $file = $this->data_dir . 'firewall.log';
        
        if (!file_exists($file)) {
            return [
                'total' => 0,
                'recent' => []
            ];
        }
        
        $content = file_get_contents($file);
        $blocks = explode('---', $content);
        
        return [
            'total' => count($blocks) - 1,
            'recent' => array_slice($blocks, -5)
        ];
    }
    
    /**
     * Estatísticas de Rate Limit
     */
    private function getRateLimitStats() {
        $file = $this->data_dir . 'rate_limit.json';
        
        if (!file_exists($file)) {
            return [
                'monitored_ips' => 0,
                'total_requests' => 0
            ];
        }
        
        $data = json_decode(file_get_contents($file), true);
        $total_requests = 0;
        
        foreach ($data as $ip => $info) {
            $total_requests += count($info['requests']);
        }
        
        return [
            'monitored_ips' => count($data),
            'total_requests' => $total_requests
        ];
    }
    
    /**
     * Top IPs atacantes
     */
    private function getTopAttackingIPs() {
        $attacks = [];
        
        // Conta ataques de SQL Injection
        $sql_file = $this->data_dir . 'sql_injection_attempts.log';
        if (file_exists($sql_file)) {
            $content = file_get_contents($sql_file);
            preg_match_all('/\[([0-9\.]+)\]/', $content, $matches);
            foreach ($matches[1] as $ip) {
                $attacks[$ip] = ($attacks[$ip] ?? 0) + 1;
            }
        }
        
        // Conta bloqueios do firewall
        $fw_file = $this->data_dir . 'firewall.log';
        if (file_exists($fw_file)) {
            $content = file_get_contents($fw_file);
            preg_match_all('/\[([0-9\.]+)\]/', $content, $matches);
            foreach ($matches[1] as $ip) {
                $attacks[$ip] = ($attacks[$ip] ?? 0) + 1;
            }
        }
        
        // Ordena por número de ataques
        arsort($attacks);
        
        return array_slice($attacks, 0, 10, true);
    }
    
    /**
     * Salva relatório em JSON
     */
    public function saveReport() {
        $report = $this->generateReport();
        $file = $this->data_dir . 'security_report.json';
        file_put_contents($file, json_encode($report, JSON_PRETTY_PRINT));
        return $report;
    }
    
    /**
     * Retorna relatório em HTML
     */
    public function getHTMLReport() {
        $report = $this->generateReport();
        
        $html = '<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatório de Segurança - MeuMU Online</title>
    <style>
        body { font-family: Arial, sans-serif; background: #1a1a2e; color: #eee; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
        h2 { color: #5a9fd4; margin-top: 30px; }
        .card { background: #16213e; border: 1px solid #333; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .stat { display: inline-block; margin: 10px 20px 10px 0; }
        .stat-value { font-size: 2em; font-weight: bold; color: #d4af37; }
        .stat-label { color: #aaa; font-size: 0.9em; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #333; }
        th { background: #0f3460; color: #d4af37; }
        .ip { font-family: monospace; color: #5a9fd4; }
        .danger { color: #ff6b6b; }
        .success { color: #51cf66; }
        pre { background: #0d1117; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 0.85em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ Relatório de Segurança - MeuMU Online</h1>
        <p>Gerado em: ' . $report['timestamp'] . '</p>
        
        <div class="card">
            <h2>📊 Estatísticas Gerais</h2>
            <div class="stat">
                <div class="stat-value danger">' . $report['banned_ips']['total'] . '</div>
                <div class="stat-label">IPs Banidos</div>
            </div>
            <div class="stat">
                <div class="stat-value danger">' . $report['sql_injection_attempts']['total'] . '</div>
                <div class="stat-label">SQL Injection</div>
            </div>
            <div class="stat">
                <div class="stat-value danger">' . $report['firewall_blocks']['total'] . '</div>
                <div class="stat-label">Firewall Blocks</div>
            </div>
            <div class="stat">
                <div class="stat-value">' . $report['rate_limit_stats']['monitored_ips'] . '</div>
                <div class="stat-label">IPs Monitorados</div>
            </div>
        </div>
        
        <div class="card">
            <h2>🚫 IPs Banidos</h2>';
        
        if ($report['banned_ips']['total'] > 0) {
            $html .= '<table>
                <tr>
                    <th>IP</th>
                    <th>Razão</th>
                    <th>Banido em</th>
                    <th>Duração</th>
                </tr>';
            
            foreach ($report['banned_ips']['ips'] as $ip => $info) {
                $html .= '<tr>
                    <td class="ip">' . $ip . '</td>
                    <td>' . $info['reason'] . '</td>
                    <td>' . date('Y-m-d H:i:s', $info['time']) . '</td>
                    <td>' . ($info['duration'] / 60) . ' minutos</td>
                </tr>';
            }
            
            $html .= '</table>';
        } else {
            $html .= '<p class="success">✅ Nenhum IP banido no momento</p>';
        }
        
        $html .= '</div>
        
        <div class="card">
            <h2>🔝 Top 10 IPs Atacantes</h2>';
        
        if (!empty($report['top_attacking_ips'])) {
            $html .= '<table>
                <tr>
                    <th>#</th>
                    <th>IP</th>
                    <th>Tentativas de Ataque</th>
                </tr>';
            
            $rank = 1;
            foreach ($report['top_attacking_ips'] as $ip => $count) {
                $html .= '<tr>
                    <td>' . $rank++ . '</td>
                    <td class="ip">' . $ip . '</td>
                    <td class="danger">' . $count . '</td>
                </tr>';
            }
            
            $html .= '</table>';
        } else {
            $html .= '<p class="success">✅ Nenhum ataque detectado</p>';
        }
        
        $html .= '</div>
    </div>
</body>
</html>';
        
        return $html;
    }
}

// Gera relatório
$security_report = new SecurityReport();

// Verifica se é requisição para visualizar HTML
if (isset($_GET['view']) && $_GET['view'] === 'html') {
    echo $security_report->getHTMLReport();
} else {
    // Retorna JSON
    header('Content-Type: application/json');
    echo json_encode($security_report->saveReport(), JSON_PRETTY_PRINT);
}
?>
