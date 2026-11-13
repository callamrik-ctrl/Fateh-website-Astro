<?php
// Shared booking code for /api/slots.php, /api/book.php and /api/setup-check.php.
// No secrets live in this file. The Google service-account key is read from a
// private folder OUTSIDE the website folder (see bk_key_paths()).

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === realpath(__FILE__)) { http_response_code(404); exit; }

// ---------------- Settings ----------------
const BK_TZ          = 'America/Toronto';
const BK_CALENDAR_ID = 'fatehplumelec@gmail.com';
const BK_NOTIFY_TO   = 'info@fatehplumelec.com';   // where new-booking emails go
const BK_FROM        = 'info@fatehplumelec.com';
const BK_BUSINESS    = 'Fateh Plumbing & Electric';
const BK_PHONE       = '647-980-9211';
const BK_WINDOWS     = [['09:00', '9–11 AM'], ['11:00', '11 AM–1 PM'], ['13:00', '1–3 PM'], ['15:00', '3–5 PM']];
const BK_WINDOW_HOURS = 2;
const BK_LEAD_HOURS   = 12;   // same as the Google booking page
const BK_DAYS_AHEAD   = 14;
const BK_AREA_CODES   = ['416', '647', '437', '942', '905', '289', '365', '742'];
const BK_CITIES       = ['Brampton', 'Mississauga', 'Caledon', 'Vaughan', 'Etobicoke', 'Toronto', 'Other'];
const BK_SERVICES     = ['Faucet / tap install or repair', 'Clogged drain or toilet', 'Toilet repair or install', 'Water heater', 'Leak',
                         'Sump pump / backwater valve', 'Water softener / RO system', 'Electrical', 'Other'];
const BK_MAX_PHOTOS   = 3;
const BK_MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const BK_RATE_LIMIT   = 5;    // bookings per IP per hour

date_default_timezone_set(BK_TZ);

// Local testing only: BOOKING_MOCK=1 fakes Google and email. Never set on Hostinger.
function bk_mock(): bool { return getenv('BOOKING_MOCK') === '1'; }

function bk_json($data, int $code = 200): void {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  header('X-Robots-Tag: noindex, nofollow');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function bk_tz(): DateTimeZone { return new DateTimeZone(BK_TZ); }

// ---------------- Google service account ----------------
function bk_key_paths(): array {
  $doc = rtrim($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__), '/');
  $p = [];
  if (getenv('GOOGLE_SA_FILE')) $p[] = getenv('GOOGLE_SA_FILE');
  $p[] = dirname($doc) . '/booking-private/service-account.json';
  $p[] = dirname($doc, 2) . '/booking-private/service-account.json';
  if (getenv('HOME')) $p[] = rtrim(getenv('HOME'), '/') . '/booking-private/service-account.json';
  return array_values(array_unique($p));
}

function bk_load_key(): ?array {
  $env = getenv('GOOGLE_SA_JSON');
  if ($env) { $k = json_decode($env, true); if (!empty($k['private_key'])) return $k + ['_source' => 'env']; }
  foreach (bk_key_paths() as $i => $path) {
    if (@is_readable($path)) {
      $k = json_decode((string) file_get_contents($path), true);
      if (!empty($k['private_key']) && !empty($k['client_email'])) return $k + ['_source' => 'file #' . ($i + 1)];
    }
  }
  return null;
}

function bk_b64url(string $s): string { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }

function bk_http(string $method, string $url, $body = null, array $headers = []): array {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_HTTPHEADER => $headers,
  ]);
  if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
  $raw = curl_exec($ch);
  $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err = curl_error($ch);
  curl_close($ch);
  if ($raw === false) throw new RuntimeException('Network error: ' . $err);
  $data = json_decode($raw, true) ?? [];
  if ($code >= 400) {
    $msg = $data['error_description'] ?? ($data['error']['message'] ?? ($data['error'] ?? 'HTTP ' . $code));
    throw new RuntimeException(is_string($msg) ? $msg : 'HTTP ' . $code);
  }
  return $data;
}

function bk_token(): string {
  static $token = null;
  if ($token) return $token;
  $cache = sys_get_temp_dir() . '/bk_tok_' . md5(__DIR__) . '.json';
  if (@is_readable($cache)) {
    $c = json_decode((string) file_get_contents($cache), true);
    if (!empty($c['token']) && ($c['exp'] ?? 0) > time() + 120) return $token = $c['token'];
  }
  $k = bk_load_key();
  if (!$k) throw new RuntimeException('Service account key file not found');
  $now = time();
  $aud = $k['token_uri'] ?? 'https://oauth2.googleapis.com/token';
  $jwt = bk_b64url(json_encode(['alg' => 'RS256', 'typ' => 'JWT'])) . '.' . bk_b64url(json_encode([
    'iss' => $k['client_email'], 'scope' => 'https://www.googleapis.com/auth/calendar',
    'aud' => $aud, 'iat' => $now, 'exp' => $now + 3600,
  ]));
  if (!openssl_sign($jwt, $sig, $k['private_key'], 'sha256WithRSAEncryption')) throw new RuntimeException('Could not sign token');
  $jwt .= '.' . bk_b64url($sig);
  $r = bk_http('POST', $aud, http_build_query(['grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'assertion' => $jwt]),
               ['Content-Type: application/x-www-form-urlencoded']);
  if (empty($r['access_token'])) throw new RuntimeException('Google did not return a token');
  @file_put_contents($cache, json_encode(['token' => $r['access_token'], 'exp' => $now + (int) ($r['expires_in'] ?? 3600)]));
  @chmod($cache, 0600);
  return $token = $r['access_token'];
}

function bk_api(string $method, string $url, ?array $data = null): array {
  return bk_http($method, $url, $data === null ? null : json_encode($data),
                 ['Authorization: Bearer ' . bk_token(), 'Content-Type: application/json']);
}

// ---------------- Calendar ----------------
/** @return array<int, array{0: DateTimeImmutable, 1: DateTimeImmutable}> */
function bk_busy(DateTimeImmutable $from, DateTimeImmutable $to): array {
  if (bk_mock()) {
    // Fake: the first weekday's 9–11 window is taken
    $d = $from;
    while ((int) $d->format('N') >= 6 || $d < new DateTimeImmutable('now', bk_tz())) $d = $d->modify('+1 day')->setTime(0, 0);
    return [[$d->setTime(9, 0), $d->setTime(11, 0)]];
  }
  $r = bk_api('POST', 'https://www.googleapis.com/calendar/v3/freeBusy', [
    'timeMin' => $from->format(DATE_RFC3339), 'timeMax' => $to->format(DATE_RFC3339),
    'timeZone' => BK_TZ, 'items' => [['id' => BK_CALENDAR_ID]],
  ]);
  $cal = $r['calendars'][BK_CALENDAR_ID] ?? [];
  if (!empty($cal['errors'])) throw new RuntimeException('Calendar not reachable: ' . ($cal['errors'][0]['reason'] ?? 'unknown') . ' (is it shared with the service account?)');
  $out = [];
  foreach ($cal['busy'] ?? [] as $b) $out[] = [new DateTimeImmutable($b['start']), new DateTimeImmutable($b['end'])];
  return $out;
}

function bk_overlaps(DateTimeImmutable $s, DateTimeImmutable $e, array $busy): bool {
  foreach ($busy as [$bs, $be]) if ($s < $be && $e > $bs) return true;
  return false;
}

/** Window start for a date + "HH:MM", or null if that window does not exist. */
function bk_window(string $date, string $start): ?array {
  if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) return null;
  foreach (BK_WINDOWS as [$hm, $label]) {
    if ($hm !== $start) continue;
    $s = DateTimeImmutable::createFromFormat('Y-m-d H:i', "$date $hm", bk_tz());
    if (!$s) return null;
    return [$s, $s->modify('+' . BK_WINDOW_HOURS . ' hours'), $label];
  }
  return null;
}

function bk_window_bookable(DateTimeImmutable $s): bool {
  $now = new DateTimeImmutable('now', bk_tz());
  if ((int) $s->format('N') >= 6) return false;
  if ($s < $now->modify('+' . BK_LEAD_HOURS . ' hours')) return false;
  if ($s > $now->setTime(0, 0)->modify('+' . (BK_DAYS_AHEAD + 1) . ' days')) return false;
  return true;
}

function bk_slots(): array {
  $start = (new DateTimeImmutable('now', bk_tz()))->setTime(0, 0);
  $end = $start->modify('+' . (BK_DAYS_AHEAD + 1) . ' days');
  $busy = bk_busy($start, $end);
  $days = [];
  for ($i = 0; $i <= BK_DAYS_AHEAD; $i++) {
    $d = $start->modify("+$i days");
    if ((int) $d->format('N') >= 6) continue;
    $wins = [];
    foreach (BK_WINDOWS as [$hm, $label]) {
      [$s, $e] = bk_window($d->format('Y-m-d'), $hm);
      $wins[] = ['start' => $hm, 'label' => $label, 'available' => bk_window_bookable($s) && !bk_overlaps($s, $e, $busy)];
    }
    if (array_filter($wins, fn($w) => $w['available'])) $days[] = ['date' => $d->format('Y-m-d'), 'windows' => $wins];
  }
  return $days;
}

function bk_create_event(array $b, DateTimeImmutable $s, DateTimeImmutable $e): array {
  $addr = $b['address'] . ($b['unit'] ? ', ' . $b['unit'] : '') . ', ' . $b['city'] . ', ON ' . $b['postal'];
  $desc = implode("\n", [
    'Booked online (website form). Confirm with the customer by text.',
    '',
    'Customer: ' . $b['firstName'] . ' ' . $b['lastName'],
    'Phone: ' . $b['phone'],
    'Email: ' . $b['email'],
    'Address: ' . $addr,
    'Service: ' . $b['service'],
    '',
    'Details:',
    $b['details'],
    '',
    'Photos: ' . ($b['photoCount'] ? $b['photoCount'] . ' sent to ' . BK_NOTIFY_TO : 'none'),
  ]);
  $event = [
    'summary' => 'NEW: ' . $b['service'] . ' – ' . $b['firstName'] . ' ' . $b['lastName'] . ' (' . $b['city'] . ')',
    'location' => $addr,
    'description' => $desc,
    'start' => ['dateTime' => $s->format(DATE_RFC3339), 'timeZone' => BK_TZ],
    'end' => ['dateTime' => $e->format(DATE_RFC3339), 'timeZone' => BK_TZ],
    'colorId' => '5', // yellow = new online booking, still to confirm
  ];
  if (bk_mock()) { @file_put_contents(sys_get_temp_dir() . '/bk_mock_events.log', json_encode($event) . "\n", FILE_APPEND); return ['id' => 'mock-' . uniqid()]; }
  return bk_api('POST', 'https://www.googleapis.com/calendar/v3/calendars/' . rawurlencode(BK_CALENDAR_ID) . '/events', $event);
}

// ---------------- Validation ----------------
function bk_clean_phone(string $v): string {
  $d = preg_replace('/\D/', '', $v);
  if (strlen($d) === 11 && $d[0] === '1') $d = substr($d, 1);
  return $d;
}

function bk_validate(array $in): array {
  $t = fn($k, $max = 200) => mb_substr(trim((string) ($in[$k] ?? '')), 0, $max);
  $b = [
    'date' => $t('date', 10), 'start' => $t('start', 5),
    'firstName' => $t('firstName', 60), 'lastName' => $t('lastName', 60),
    'phone' => bk_clean_phone($t('phone', 30)), 'email' => $t('email', 120),
    'address' => $t('address', 160), 'unit' => $t('unit', 60), 'city' => $t('city', 40),
    'postal' => strtoupper(preg_replace('/\s/', '', $t('postal', 10))),
    'service' => $t('service', 80), 'details' => $t('details', 2000),
  ];
  $err = [];
  foreach (['firstName', 'lastName'] as $f) if (!preg_match("/^[\p{L}' .-]{2,60}$/u", $b[$f])) $err[$f] = 'Letters only, at least 2.';
  if (strlen($b['phone']) !== 10) $err['phone'] = 'Enter a 10-digit phone number.';
  elseif (!in_array(substr($b['phone'], 0, 3), BK_AREA_CODES, true)) $err['phone'] = 'Please use a local GTA number.';
  elseif (preg_match('/^(\d)\1{6}$/', substr($b['phone'], 3)) || substr($b['phone'], 3) === '5551234') $err['phone'] = 'Please enter a real phone number.';
  if (!filter_var($b['email'], FILTER_VALIDATE_EMAIL)) $err['email'] = 'Enter a valid email.';
  if (mb_strlen($b['address']) < 5) $err['address'] = 'Enter your street address.';
  if (!in_array($b['city'], BK_CITIES, true)) $err['city'] = 'Choose a city.';
  if (!preg_match('/^[LM]\d[A-Z]\d[A-Z]\d$/', $b['postal'])) $err['postal'] = 'Enter a GTA postal code (starts with L or M).';
  if (!in_array($b['service'], BK_SERVICES, true)) $err['service'] = 'Choose the type of work.';
  if (mb_strlen($b['details']) < 10) $err['details'] = 'Tell us a little more (10+ characters).';
  $b['phone'] = substr($b['phone'], 0, 3) . '-' . substr($b['phone'], 3, 3) . '-' . substr($b['phone'], 6);
  $b['postal'] = substr($b['postal'], 0, 3) . ' ' . substr($b['postal'], 3);
  return [$b, $err];
}

/** Validated photo uploads: list of [name, mime, bytes] */
function bk_photos(): array {
  if (empty($_FILES['photos'])) return [];
  $f = $_FILES['photos'];
  $names = (array) $f['name']; $tmps = (array) $f['tmp_name']; $errs = (array) $f['error']; $sizes = (array) $f['size'];
  $out = [];
  $finfo = new finfo(FILEINFO_MIME_TYPE);
  foreach ($names as $i => $name) {
    if ($errs[$i] === UPLOAD_ERR_NO_FILE) continue;
    if ($errs[$i] !== UPLOAD_ERR_OK) throw new InvalidArgumentException('A photo could not be uploaded. Try a smaller photo.');
    if (count($out) >= BK_MAX_PHOTOS) throw new InvalidArgumentException('Up to 3 photos, please.');
    if ($sizes[$i] > BK_MAX_PHOTO_BYTES) throw new InvalidArgumentException('Each photo must be under 8 MB.');
    $mime = $finfo->file($tmps[$i]);
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif'], true)) throw new InvalidArgumentException('Photos must be images.');
    $ext = explode('/', $mime)[1];
    $out[] = ['photo-' . ($i + 1) . '.' . ($ext === 'jpeg' ? 'jpg' : $ext), $mime, (string) file_get_contents($tmps[$i])];
  }
  return $out;
}

// ---------------- Abuse protection ----------------
function bk_client_ip(): string { return $_SERVER['HTTP_CF_CONNECTING_IP'] ?? ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'); }

function bk_rate_limited(): bool {
  $file = sys_get_temp_dir() . '/bk_rate_' . md5(bk_client_ip()) . '.json';
  $now = time();
  $hits = array_filter((array) json_decode((string) @file_get_contents($file), true), fn($t) => $t > $now - 3600);
  if (count($hits) >= BK_RATE_LIMIT) return true;
  $hits[] = $now;
  @file_put_contents($file, json_encode(array_values($hits)));
  return false;
}

function bk_origin_ok(): bool {
  $o = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($o === '') return true;
  $host = parse_url($o, PHP_URL_HOST) ?: '';
  return $host === 'fatehplumelec.com' || $host === 'www.fatehplumelec.com' || $host === 'localhost' || $host === '127.0.0.1';
}

// ---------------- Email ----------------
function bk_mail(string $to, string $subject, string $text, array $attachments = [], ?string $replyTo = null): bool {
  $boundary = 'bk_' . bin2hex(random_bytes(8));
  $headers = [
    'From: ' . BK_BUSINESS . ' <' . BK_FROM . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
  ];
  if ($replyTo) $headers[] = 'Reply-To: ' . $replyTo;
  $body = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n" . $text . "\r\n";
  foreach ($attachments as [$name, $mime, $bytes]) {
    $body .= "--$boundary\r\nContent-Type: $mime; name=\"$name\"\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"$name\"\r\n\r\n"
           . chunk_split(base64_encode($bytes)) . "\r\n";
  }
  $body .= "--$boundary--";
  $subj = '=?UTF-8?B?' . base64_encode($subject) . '?=';
  if (bk_mock()) { @file_put_contents(sys_get_temp_dir() . '/bk_mock_mail.log', "TO: $to\nSUBJECT: $subject\nATTACHMENTS: " . count($attachments) . "\n$text\n----\n", FILE_APPEND); return true; }
  return @mail($to, $subj, $body, implode("\r\n", $headers), '-f' . BK_FROM);
}
