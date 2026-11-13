<?php
// Temporary check: can this hosting run server code (PHP)?
// Open https://fatehplumelec.com/server-test.php
//  - Shows JSON with "ok": true  → server code works here (booking backend can run on Hostinger)
//  - Shows this file's text, downloads it, or 404 → PHP does not run for this site
// Safe to delete after the check. Contains no keys or private data.
header('Content-Type: application/json');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
echo json_encode([
  'ok' => true,
  'php' => PHP_VERSION,
  'curl' => function_exists('curl_init'),
  'openssl' => function_exists('openssl_sign'),
  'time' => date('c'),
]);
