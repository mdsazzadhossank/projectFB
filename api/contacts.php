<?php
// api/contacts.php
require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/auth.php';

// GET: Fetch all contacts
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM contacts ORDER BY updated_at DESC");
        $contacts = $stmt->fetchAll();

        // Ensure JSON decoding for tags & notes
        foreach ($contacts as &$cnt) {
            $cnt['tags'] = $cnt['tags'] ? json_decode($cnt['tags']) : [];
            $cnt['notes'] = $cnt['notes'] ? json_decode($cnt['notes']) : [];
        }

        echo json_encode(["status" => "success", "data" => $contacts]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch contacts"]);
    }
}

// POST: Create a new contact
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_api_auth();

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['name'])) {
        http_response_code(400);
        echo json_encode(["error" => "name is required"]);
        exit();
    }

    $id = uniqid('cnt_');
    $platform = in_array($input['platform'] ?? '', ['facebook', 'whatsapp'], true)
        ? $input['platform']
        : 'facebook';

    try {
        $stmt = $pdo->prepare(
            "INSERT INTO contacts (id, name, avatar, phone, email, location, platform, channel_name, tags)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $id,
            trim($input['name']),
            $input['avatar'] ?? null,
            $input['phone'] ?? null,
            $input['email'] ?? null,
            $input['location'] ?? null,
            $platform,
            $input['channel_name'] ?? null,
            json_encode($input['tags'] ?? [])
        ]);

        echo json_encode(["status" => "success", "message" => "Contact created", "data" => ["id" => $id]]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save contact: " . $e->getMessage()]);
    }
}