<?php
// api/integrations.php
require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, platform, account_name, identifier, is_connected, webhook_status, messages_today, last_sync FROM integrations");
        $integrations = $stmt->fetchAll();

        echo json_encode(["status" => "success", "data" => $integrations]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch integrations"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_api_auth();

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['platform']) || !isset($data['identifier'])) {
        http_response_code(400);
        echo json_encode(["error" => "platform and identifier are required"]);
        exit();
    }

    $id = uniqid('int_');

    // Never store a raw access token unless explicitly provided; the app only
    // uses the token to configure outbound sends, which live in env vars instead.
    $token = isset($data['access_token']) && $data['access_token'] !== '' ? $data['access_token'] : null;

    try {
        $stmt = $pdo->prepare("INSERT INTO integrations (id, platform, account_name, identifier, access_token, is_connected, webhook_status) VALUES (?, ?, ?, ?, ?, ?, ?)
                               ON DUPLICATE KEY UPDATE account_name=VALUES(account_name), identifier=VALUES(identifier), is_connected=1, webhook_status='operational'");

        $stmt->execute([
            $id,
            $data['platform'],
            $data['account_name'] ?? 'Unknown Account',
            $data['identifier'],
            $token,
            1,
            'operational'
        ]);

        echo json_encode(["status" => "success", "message" => "Integration saved successfully"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save integration: " . $e->getMessage()]);
    }
}
?>