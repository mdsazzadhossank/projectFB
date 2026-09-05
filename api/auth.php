<?php
// api/auth.php
// Shared authorization for write operations.
//
// In production, set MESSAGEHUB_API_SECRET (env var or api/config.local.php).
// Clients must send the secret in the `X-MessageHub-Secret` header. When no
// secret is configured, auth is disabled so local development works out of the box.

require_once __DIR__ . '/bootstrap.php';

function messagehub_api_secret(): string
{
    return mh_env('MESSAGEHUB_API_SECRET', '');
}

function require_api_auth(): void
{
    $secret = messagehub_api_secret();
    if ($secret === '') {
        return; // auth disabled when no secret configured (development mode)
    }

    // Prefer $_SERVER: headers are exposed as HTTP_<NAME> on EVERY PHP SAPI
    // (Apache module, FastCGI, PHP-FPM, LiteSpeed…). getallheaders() is only
    // guaranteed on the Apache module and is missing on many shared hosts —
    // relying on it alone makes valid requests fail with 401.
    $given = isset($_SERVER['HTTP_X_MESSAGEHUB_SECRET'])
        ? (string) $_SERVER['HTTP_X_MESSAGEHUB_SECRET']
        : '';

    // Fallback: parse raw headers when $_SERVER does not expose it (rare).
    if ($given === '' && function_exists('getallheaders')) {
        $headers = getallheaders();
        $given = isset($headers['X-MessageHub-Secret']) ? (string) $headers['X-MessageHub-Secret'] : '';
    }

    // Fallback: allow the secret in the JSON body for simple webhook clients.
    if ($given === '') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (is_array($input)) {
            $given = isset($input['api_secret']) ? (string) $input['api_secret'] : '';
        }
    }

    if (!hash_equals($secret, $given)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
}