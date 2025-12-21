<?php
/**
 * 🔌 API Proxy - MeuMU Online
 * 
 * Proxy reverso simples em PHP para contornar limitações do .htaccess
 * Redireciona todas as requisições /api/* para http://localhost:3001/api/*
 */

// Habilitar CORS
header('Access-Control-Allow-Origin: https://meumu.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Responder a preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Construir URL do backend
$backend_url = 'http://127.0.0.1:3001';
$request_uri = $_SERVER['REQUEST_URI'];

// Remover query string
$path = strtok($request_uri, '?');

// URL completa
$url = $backend_url . $path;

// Adicionar query string se existir
if (!empty($_SERVER['QUERY_STRING'])) {
    $url .= '?' . $_SERVER['QUERY_STRING'];
}

// Inicializar cURL
$ch = curl_init();

// Configurar cURL
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

// Headers
$headers = [];
foreach (getallheaders() as $name => $value) {
    if (strtolower($name) !== 'host') {
        $headers[] = "$name: $value";
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Body (para POST, PUT, etc.)
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH'])) {
    $body = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

// Executar requisição
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

// Verificar erros
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

// Retornar resposta
http_response_code($http_code);
if ($content_type) {
    header('Content-Type: ' . $content_type);
}
echo $response;
