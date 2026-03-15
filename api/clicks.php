<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $pdo = getDB();

    // POST — クリックを記録
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $app = isset($input['app']) ? trim($input['app']) : '';

        if ($app === '') {
            http_response_code(400);
            echo json_encode(['error' => 'app is required']);
            exit;
        }

        $now = round(microtime(true) * 1000); // ms timestamp
        $dt  = new DateTime('now', new DateTimeZone('Asia/Tokyo'));
        $label = $dt->format('Y/m/d H:i:s');

        $stmt = $pdo->prepare('INSERT INTO clicks (app, ts, label) VALUES (:app, :ts, :label)');
        $stmt->execute(['app' => $app, 'ts' => $now, 'label' => $label]);

        echo json_encode(['ok' => true]);
        exit;
    }

    // GET — 統計を取得
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 500) : 50;
        if ($limit < 1) $limit = 50;

        // アプリ別集計
        $apps = $pdo->query(
            'SELECT app, COUNT(*) AS count FROM clicks GROUP BY app ORDER BY count DESC'
        )->fetchAll();

        // 合計
        $total = (int)$pdo->query('SELECT COUNT(*) FROM clicks')->fetchColumn();

        // 最新履歴
        $stmt = $pdo->prepare('SELECT app, ts, label FROM clicks ORDER BY ts DESC LIMIT :lim');
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $recent = $stmt->fetchAll();

        echo json_encode(['total' => $total, 'apps' => $apps, 'recent' => $recent]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
