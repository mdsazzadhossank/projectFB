<?php
// api/conversations.php
require_once __DIR__ . '/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch all conversations
    try {
        $stmt = $pdo->query("SELECT * FROM conversations ORDER BY updated_at DESC");
        $conversations = $stmt->fetchAll();
        
        // Ensure JSON decoding for tags
        foreach ($conversations as &$conv) {
            $conv['tags'] = $conv['tags'] ? json_decode($conv['tags']) : [];
        }
        
        echo json_encode(["status" => "success", "data" => $conversations]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch conversations"]);
    }
}
?>
