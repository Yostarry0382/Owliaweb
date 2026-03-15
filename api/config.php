<?php
// --- MySQL接続設定 ---
// phpMyAdminと同じ情報を入力してください
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');   // DB名
define('DB_USER', 'your_username');         // ユーザー名
define('DB_PASS', 'your_password');         // パスワード

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
    }
    return $pdo;
}
