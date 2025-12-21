<?php
/**
 * API Proxy - MeuMU Online
 * Diretório /api/ que redireciona para backend Node.js
 */

// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Backend URL
$backend = 'http://127.0.0.1:3001';

// Pegar path após /api/
$uri = $_SERVER['REQUEST_URI'];
$path = preg_replace('#^/api/?#', '', $uri);

// URL completa
$url = $backend . '/api/' . $path;

// cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

// Headers
$headers = [];
foreach (getallheaders() as $k => $v) {
    if (strtolower($k) !== 'host') {
        $headers[] = "$k: $v";
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Body
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

// Executar
$response = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

if (curl_errno($ch)) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'Backend não disponível',
        'message' => curl_error($ch),
        'backend_url' => $url
    ]);
    curl_close($ch);
    exit;
}

curl_close($ch);

http_response_code($code);
if ($type) {
    header('Content-Type: ' . $type);
}
echo $response;
?>
