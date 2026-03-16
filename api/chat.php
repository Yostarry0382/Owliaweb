<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$API_URL = 'https://owlia-grimoire.dairab.local/api/v2-production';
$API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzY4ZDhjZi1lMWEzLTQxN2MtODVlMC1lNWI0NGQ3YTYyM2EiLCJhdWQiOiJhcGk6cGVyc29uYWwtYWNjZXNzIiwianRpIjoiYmJiMjBiYjUtMzdlMC00OWQzLThhZWItMjAzMzY3NDJlNDBlIiwic2NvcGUiOiJhcGk6cHVibGljIiwiZXhwIjoyMDg4NDY3NTE5fQ.d6grdiSxpE7EdtLOrTytUohiRdtT3Scb4UIWz0DQ7QE';

$input = file_get_contents('php://input');
$body = json_decode($input, true);

if (!$body || !isset($body['messages'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request body']);
    exit;
}

$isStreaming = !empty($body['is_streaming']);

$ch = curl_init($API_URL);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $API_TOKEN,
    ],
    CURLOPT_POSTFIELDS => $input,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => 0,
    CURLOPT_TIMEOUT => 120,
    CURLOPT_CONNECTTIMEOUT => 10,
]);

if ($isStreaming) {
    // Streaming: flush chunks to client as they arrive
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    header('Connection: keep-alive');

    // Disable output buffering
    while (ob_get_level()) ob_end_flush();

    curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($ch, $data) {
        echo $data;
        if (ob_get_level()) ob_flush();
        flush();
        return strlen($data);
    });

    curl_exec($ch);

    if (curl_errno($ch)) {
        echo 'data: ' . json_encode(['error' => curl_error($ch)]) . "\n\n";
        flush();
    }
} else {
    // Non-streaming: return full response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    header('Content-Type: application/json');

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        http_response_code(502);
        echo json_encode(['error' => 'Proxy error: ' . curl_error($ch)]);
    } else {
        http_response_code($httpCode);
        echo $response;
    }
}

curl_close($ch);
