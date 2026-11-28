<?php
// GET /api/resume.php?f=JA-...pdf&k=... → serves a resume saved by apply.php.
// Works only with the secret key written into the job applications sheet.
require __DIR__ . '/_booking.php';

header('X-Robots-Tag: noindex, nofollow');
$file = basename((string) ($_GET['f'] ?? ''));
$key  = (string) ($_GET['k'] ?? '');
if (!preg_match('/^JA-\d{6}-[0-9A-F]{6}\.(pdf|docx?|jpe?g|png)$/', $file)) { http_response_code(404); exit('Not found'); }
$k = bk_load_key();
$sig = substr(hash_hmac('sha256', $file, (string) ($k['private_key'] ?? 'x')), 0, 24);
if (!hash_equals($sig, $key)) { http_response_code(404); exit('Not found'); }

$doc = rtrim($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__), '/');
$path = dirname($doc) . '/job-applications/' . $file;
if (!is_file($path)) { http_response_code(404); exit('Not found'); }

$types = ['pdf' => 'application/pdf', 'doc' => 'application/msword',
  'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png'];
$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
header('Content-Type: ' . $types[$ext]);
header('Content-Disposition: inline; filename="' . $file . '"');
header('Content-Length: ' . filesize($path));
header('Cache-Control: private, no-store');
readfile($path);
