<?php
// Twilio calls this when a customer WhatsApp message changes status.
// If WhatsApp could not deliver it (for example the number has no WhatsApp),
// the same message is sent once as a plain text message (SMS).
require __DIR__ . '/_booking.php';

function ts_done(int $code = 204): void { http_response_code($code); exit; }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') ts_done(405);

// 1) Our own signed code: says which message to resend and to whom
$f = (string) ($_GET['f'] ?? '');
$k = (string) ($_GET['k'] ?? '');
try {
  if ($f === '' || !hash_equals(bk_sig('fallback|' . $f), $k)) ts_done(403);
} catch (Throwable $e) { ts_done(503); }

// 2) Twilio's signature: proves the call really came from Twilio
if (!bk_mock()) {
  $token = bk_twilio_token();
  $url = BK_SITE . ($_SERVER['REQUEST_URI'] ?? '');
  $params = $_POST;
  ksort($params);
  $data = $url;
  foreach ($params as $key => $val) $data .= $key . $val;
  $expected = base64_encode(hash_hmac('sha1', $data, (string) $token, true));
  if (!hash_equals($expected, (string) ($_SERVER['HTTP_X_TWILIO_SIGNATURE'] ?? ''))) {
    error_log('[booking] twilio-status: bad signature');
    ts_done(403);
  }
}

$status = (string) ($_POST['MessageStatus'] ?? '');
if (!in_array($status, ['failed', 'undelivered'], true)) ts_done(); // sent / delivered / read: nothing to do

// Only once per WhatsApp message (Twilio can report "failed" more than once)
$sid = preg_replace('/[^A-Za-z0-9]/', '', (string) ($_POST['MessageSid'] ?? 'x'));
$once = sys_get_temp_dir() . '/bk_fallback_' . $sid;
if (file_exists($once)) ts_done();
@touch($once);

$d = json_decode((string) base64_decode(strtr($f, '-_', '+/')), true);
$text = is_array($d) ? bk_sms_text((string) ($d['t'] ?? ''), (array) ($d['v'] ?? [])) : '';
if ($text === '' || empty($d['p'])) ts_done();

try {
  bk_sms((string) $d['p'], $text);
  error_log('[booking] WhatsApp ' . $status . ' (' . ($_POST['ErrorCode'] ?? '') . '), sent as SMS instead');
} catch (Throwable $e) {
  error_log('[booking] SMS fallback failed: ' . $e->getMessage());
}
ts_done();
