<?php
// api/webhooks/meta.php
// Meta (Facebook Messenger / WhatsApp) webhook receiver.
// 1. GET  — handles the "subscribe" verification handshake Meta requires.
// 2. POST — ingests inbound messages, persists them, and pushes them to the
//    React app in realtime via the Pusher HTTP API (no SDK required).
//
// Config (env vars or api/config.local.php):
//   MESSAGEHUB_WEBHOOK_VERIFY_TOKEN  — the token you register in the Meta app.
//   PUSHER_APP_ID / PUSHER_KEY / PUSHER_SECRET / PUSHER_CLUSTER — server-side
//   Pusher credentials for the realtime broadcast.

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../db_connect.php';

$verify_token = mh_env('MESSAGEHUB_WEBHOOK_VERIFY_TOKEN', '');

// ----------------------------- verification -------------------------------
// Meta calls the webhook URL with ?hub_mode=subscribe&hub_verify_token=...&hub_challenge=...
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (
        isset($_GET['hub_mode'], $_GET['hub_verify_token'], $_GET['hub_challenge'])
        && $_GET['hub_mode'] === 'subscribe'
        && $verify_token !== ''
        && hash_equals($verify_token, (string) $_GET['hub_verify_token'])
    ) {
        echo $_GET['hub_challenge'];
        http_response_code(200);
        exit();
    }

    http_response_code(403);
    echo json_encode(['error' => 'Verification failed']);
    exit();
}

// ----------------------------- incoming payload ---------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        http_response_code(400);
        exit();
    }

    // Acknowledge receipt to Meta immediately (Meta requires a fast 200).
    http_response_code(200);

    if (!isset($data['object']) || !in_array($data['object'], ['page', 'whatsapp_business_account'], true)) {
        exit();
    }

    foreach ($data['entry'] as $entry) {
        $messaging_events = $entry['messaging'] ?? $entry['changes'] ?? [];

        foreach ($messaging_events as $event) {
            $sender_id = '';
            $text = '';
            $platform = 'facebook';

            if (isset($event['sender']['id'], $event['message']['text'])) {
                // Facebook Messenger format
                $sender_id = (string) $event['sender']['id'];
                $text = (string) $event['message']['text'];
                $platform = 'facebook';
            } elseif (isset($event['value']['messages'][0])) {
                // WhatsApp Cloud API format
                $wa_msg = $event['value']['messages'][0];
                $sender_id = (string) $wa_msg['from'];
                $text = isset($wa_msg['text']['body']) ? (string) $wa_msg['text']['body'] : '';
                $platform = 'whatsapp';
            }

            if ($text === '') {
                continue;
            }

            $timestamp = date("h:i A");
            $conversation_id = 'conv_' . $sender_id;
            $contact_id = 'cnt_' . $sender_id;

            try {
                // Ensure contact + conversation exist
                $checkConv = $pdo->prepare("SELECT id FROM conversations WHERE id = ?");
                $checkConv->execute([$conversation_id]);
                if (!$checkConv->fetch()) {
                    $stmtContact = $pdo->prepare("INSERT IGNORE INTO contacts (id, name, platform) VALUES (?, ?, ?)");
                    $stmtContact->execute([$contact_id, 'Customer ' . $sender_id, $platform]);

                    $stmtConv = $pdo->prepare("INSERT INTO conversations (id, contact_id, customer_name, platform) VALUES (?, ?, ?, ?)");
                    $stmtConv->execute([$conversation_id, $contact_id, 'Customer ' . $sender_id, $platform]);
                }

                $msg_id = uniqid('msg_in_');
                $stmt = $pdo->prepare("INSERT INTO messages (id, conversation_id, sender, sender_name, text, timestamp, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$msg_id, $conversation_id, 'customer', 'Customer', $text, $timestamp, 'delivered']);

                $updateStmt = $pdo->prepare("UPDATE conversations SET last_message = ?, updated_at = NOW(), unread_count = unread_count + 1 WHERE id = ?");
                $updateStmt->execute([$text, $conversation_id]);
            } catch (PDOException $e) {
                error_log('[meta webhook] DB write failed: ' . $e->getMessage());
                continue;
            }

            broadcast_to_pusher([
                'id' => $msg_id,
                'conversationId' => $conversation_id,
                'sender' => 'customer',
                'senderName' => 'New Facebook Customer',
                'text' => $text,
                'timestamp' => $timestamp,
                'platform' => $platform,
            ]);
        }
    }
}

/**
 * Push a new-message event to the React app via the Pusher HTTP API.
 * Uses curl directly so no composer dependency is needed — works on any
 * shared-hosting PHP 7+ setup. Fails silently if credentials are missing.
 */
function broadcast_to_pusher(array $payload): void
{
    $appId   = mh_env('PUSHER_APP_ID');
    $key     = mh_env('PUSHER_KEY');
    $secret  = mh_env('PUSHER_SECRET');
    $cluster = mh_env('PUSHER_CLUSTER', 'ap2');

    if ($appId === '' || $key === '' || $secret === '' || $payload === []) {
        return; // not configured
    }

    $body = json_encode([
        'name' => 'new-message',
        'channel' => 'chat',
        'data' => json_encode($payload),
    ]);

    // Build the query once and sign the exact string that is sent.
    $params = [
        'auth_key' => $key,
        'auth_timestamp' => time(),
        'auth_version' => '1.0',
        'body_md5' => md5($body),
    ];
    $stringToSign = 'POST' . "\n" . "/apps/{$appId}/events" . "\n" . http_build_query($params);
    $params['auth_signature'] = hash_hmac('sha256', $stringToSign, $secret);

    $url = "https://api-{$cluster}.pusher.com/apps/{$appId}/events?" . http_build_query($params);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
    ]);
    curl_exec($ch);
    curl_close($ch);
}
?>