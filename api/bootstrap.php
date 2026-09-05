<?php
// api/bootstrap.php
// Single shared bootstrap: loads deploy config + exposes mh_env().
//
// Value priority: real environment variables > api/config.local.php > default.
// On cPanel/shared hosting there is no way to set real env vars, so you edit
// api/config.local.php instead (copy it from api/config.local.php.example).
// NEVER commit real credentials — config.local.php is git-ignored.

$__MH_CONFIG = [];
$__MH_CONFIG_FILE = __DIR__ . '/config.local.php';
if (is_file($__MH_CONFIG_FILE)) {
    $__MH_CONFIG = (array) include $__MH_CONFIG_FILE;
}

/**
 * Read a config value (env var wins over config.local.php).
 */
function mh_env(string $key, string $default = ''): string
{
    global $__MH_CONFIG;

    $env = getenv($key);
    if (is_string($env) && $env !== '') {
        return $env;
    }

    if (isset($__MH_CONFIG[$key]) && is_scalar($__MH_CONFIG[$key])) {
        $v = (string) $__MH_CONFIG[$key];
        if ($v !== '') {
            return $v;
        }
    }

    return $default;
}