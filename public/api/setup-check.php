<?php
// GET /api/setup-check.php → step-by-step check of the booking setup.
// Shows no secrets. Delete this file once booking works.
require __DIR__ . '/_booking.php';

$out = ['php' => PHP_VERSION, 'curl' => function_exists('curl_init'), 'openssl' => function_exists('openssl_sign'), 'mail' => function_exists('mail')];

$doc = rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/');
$out['website_folder'] = $doc;
$out['put_key_here'] = dirname($doc) . '/booking-private/service-account.json';
$out['paths_checked'] = array_map(fn($p) => ['path' => $p, 'found' => @is_readable($p)], bk_key_paths());

$k = bk_load_key();
$out['1_key_found'] = (bool) $k;
if ($k) {
  $out['key_source'] = $k['_source'];
  $out['service_account'] = preg_replace('/^(.{4}).*(@.*)$/', '$1…$2', $k['client_email']);
  try { bk_token(); $out['2_google_login'] = 'OK'; }
  catch (Throwable $e) { $out['2_google_login'] = 'FAILED: ' . $e->getMessage(); }
  if ($out['2_google_login'] === 'OK') {
    try {
      $from = (new DateTimeImmutable('now', bk_tz()))->setTime(0, 0);
      $busy = bk_busy($from, $from->modify('+4 days'));
      $out['3_calendar_access'] = 'OK';
      $out['busy_next_3_days'] = array_map(fn($b) => $b[0]->format('D M j g:ia') . ' – ' . $b[1]->format('g:ia'), $busy);
      $out['open_windows'] = array_map(fn($d) => $d['date'] . ': ' . implode(', ', array_map(fn($w) => $w['label'], array_filter($d['windows'], fn($w) => $w['available']))), bk_slots());
    } catch (Throwable $e) { $out['3_calendar_access'] = 'FAILED: ' . $e->getMessage(); }
  }
}
bk_json($out);
