<?php
// api/messages.php
require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/auth.php';

// GET: Fetch messages for a specific conversation
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $conversation_id = $_GET['conversation_id'] ?? null;
    if (!$conversation_id) {
        http_response_code(400);
        echo json_encode(["error" => "conversation_id is required"]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC");
        $stmt->execute([$conversation_id]);
        $messages = $stmt->fetchAll();

        echo json_encode(["status" => "success", "data" => $messages]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch messages"]);
    }
}

/**
 * Optionally forward a reply to the Meta Graph API (Messenger).
 * Only fires when BOTH MESSAGEHUB_FB_PAGE_ID / MESSAGEHUB_FB_PAGE_TOKEN are set
 * AND the client passes a recipient_id (the user's page-scoped ID).
 */
function send_to_meta(string $text, string $recipientId): void
{
    $pageId = mh_env('MESSAGEHUB_FB_PAGE_ID', '');
    $token  = mh_env('MESSAGEHUB_FB_PAGE_TOKEN', '');
    if ($pageId === '' || $token === '' || $recipientId === '') {
        return; // not configured or no recipient — silently skip
    }

    $url = "https://graph.facebook.com/v20.0/{$pageId}/messages";
    $payload = json_encode([
        'recipient' => ['id' => $recipientId],
        'message'   => ['text' => $text],
        'messaging_type' => 'RESPONSE',
    ]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token,
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
    ]);
    curl_exec($ch);
    curl_close($ch);
}

// POST: Send a new message
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_api_auth();

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['conversation_id']) || !isset($data['text'])) {
        http_response_code(400);
        echo json_encode(["error" => "conversation_id and text are required"]);
        exit();
    }

    $msg_id = uniqid('msg_');
    $timestamp = date("h:i A");

    try {
        // Save to Database
        $stmt = $pdo->prepare("INSERT INTO messages (id, conversation_id, sender, sender_name, text, timestamp, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$msg_id, $data['conversation_id'], 'agent', 'System Agent', $data['text'], $timestamp, 'delivered']);

        // Update conversation last message
        $updateStmt = $pdo->prepare("UPDATE conversations SET last_message = ?, updated_at = NOW() WHERE id = ?");
        $updateStmt->execute([$data['text'], $data['conversation_id']]);

        // Optionally forward to the customer via Messenger (guarded by env).
        // recipient_id can be passed explicitly, otherwise we derive it from the
        // conversation id, which the webhook creates as "conv_" + sender PSID.
        $recipientId = isset($data['recipient_id'])
            ? (string) $data['recipient_id']
            : (str_starts_with((string) $data['conversation_id'], 'conv_')
                ? substr((string) $data['conversation_id'], 5)
                : '');
        if ($recipientId !== '') {
            send_to_meta((string) $data['text'], $recipientId);
        }

        echo json_encode([
            "status" => "success",
            "data" => [
                "id" => $msg_id,
                "text" => $data['text'],
                "timestamp" => $timestamp
            ]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to send message: " . $e->getMessage()]);
    }
}
?>