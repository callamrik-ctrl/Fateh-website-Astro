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
// Mon–Fri: all five 2-hour windows. Saturday: only the morning ones (BK_SAT_WINDOWS). Sunday: closed.
const BK_WINDOWS     = [['09:00', '9–11 AM'], ['11:00', '11 AM–1 PM'], ['13:00', '1–3 PM'], ['15:00', '3–5 PM'], ['17:00', '5–7 PM']];
const BK_SAT_WINDOWS = ['09:00', '11:00'];
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
const BK_SITE         = 'https://fatehplumelec.com';
const BK_COLOR_NEW       = '5';   // Google Calendar "Banana" (yellow): waiting for owner to confirm
const BK_COLOR_CONFIRMED = '10';  // Google Calendar "Basil" (green): confirmed, WhatsApp sent
const BK_COLOR_MOVED     = '3';   // Google Calendar "Grape" (purple): old time of a rescheduled booking, kept for the record, slot free again
const BK_COLOR_CANCELLED = '8';   // Google Calendar "Graphite" (grey): declined/cancelled, kept for the record, slot free again

// Google Sheet that logs every booking (one row per booking, status kept up to date).
// The service account must be an Editor on the sheet, and the Google Sheets API must be
// enabled in its Google Cloud project. Empty = logging off. A failed log never blocks a booking.
const BK_SHEET_ID  = '1uLvMSr-6OfiWMuWvZXQLhEAm8o_0cGfjysHmUu3pkPY'; // "Fateh Bookings Log" (owned by callamrik@gmail.com)
const BK_SHEET_TAB = 'Bookings';

// ---------------- Twilio WhatsApp ----------------
// Account SID + Auth Token live in booking-private/twilio.json, next to
// service-account.json and OUTSIDE the website folder:
//   {"account_sid": "AC...", "auth_token": "..."}
const BK_TWILIO_FROM = '+13435120411';
const BK_WA_TEMPLATES = [
  'confirmed'   => 'HX77c62cda89e02dc911f79c6f563441d7', // booking_confirmed_v2   {{1}} name {{2}} date {{3}} time {{4}} address
  'rescheduled' => 'HXc8a50436ce719284dfc4caaaa14b3174', // booking_rescheduled_v2 {{1}} name {{2}} date {{3}} time {{4}} address
  'cancelled'   => 'HXf45930ac0ea7a14a9b0124d054f3ae47', // booking_cancelled_v2   {{1}} name {{2}} date {{3}} time
  // owner_booking_alert: new-booking alert to the owner's business WhatsApp, with an "Open booking" button.
  // {{1}} customer {{2}} phone {{3}} when {{4}} address {{5}} service {{6}} link code. Approved Nov 2026.
  'owner_alert' => 'HX228761227d133ac8d5acc976e73df131',
];
const BK_OWNER_WHATSAPP = '647-980-9211'; // business WhatsApp that gets the new-booking alert
const BK_OWNER_SMS      = '647-812-1111'; // backup: gets the new-booking SMS only if the WhatsApp alert fails
const BK_HOME_ADDRESS   = '18 Donald Stewart Rd, Brampton, ON'; // distance on the owner page is measured from here

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
  $cache = sys_get_temp_dir() . '/bk_tok2_' . md5(__DIR__) . '.json';
  if (@is_readable($cache)) {
    $c = json_decode((string) file_get_contents($cache), true);
    if (!empty($c['token']) && ($c['exp'] ?? 0) > time() + 120) return $token = $c['token'];
  }
  $k = bk_load_key();
  if (!$k) throw new RuntimeException('Service account key file not found');
  $now = time();
  $aud = $k['token_uri'] ?? 'https://oauth2.googleapis.com/token';
  $jwt = bk_b64url(json_encode(['alg' => 'RS256', 'typ' => 'JWT'])) . '.' . bk_b64url(json_encode([
    'iss' => $k['client_email'], 'scope' => 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/spreadsheets',
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

/** Windows offered on a given day: Mon–Fri all, Saturday morning only, Sunday none. */
function bk_day_windows(DateTimeImmutable $d): array {
  $n = (int) $d->format('N');
  if ($n === 7) return [];
  if ($n === 6) return array_values(array_filter(BK_WINDOWS, fn($w) => in_array($w[0], BK_SAT_WINDOWS, true)));
  return BK_WINDOWS;
}

/** Window start for a date + "HH:MM", or null if that window does not exist on that day. */
function bk_window(string $date, string $start): ?array {
  if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) return null;
  $day = DateTimeImmutable::createFromFormat('Y-m-d H:i', "$date 00:00", bk_tz());
  if (!$day) return null;
  foreach (bk_day_windows($day) as [$hm, $label]) {
    if ($hm !== $start) continue;
    $s = DateTimeImmutable::createFromFormat('Y-m-d H:i', "$date $hm", bk_tz());
    if (!$s) return null;
    return [$s, $s->modify('+' . BK_WINDOW_HOURS . ' hours'), $label];
  }
  return null;
}

/** $owner = true (owner "Change time" page): skip the 12-hour notice, so any window that has not started yet is offered. */
function bk_window_bookable(DateTimeImmutable $s, bool $owner = false): bool {
  $now = new DateTimeImmutable('now', bk_tz());
  if (!in_array($s->format('H:i'), array_column(bk_day_windows($s), 0), true)) return false;
  if ($s < ($owner ? $now : $now->modify('+' . BK_LEAD_HOURS . ' hours'))) return false;
  if ($s > $now->setTime(0, 0)->modify('+' . (BK_DAYS_AHEAD + 1) . ' days')) return false;
  return true;
}

// ---------------- Slots shown to customers ----------------
// Customers see only a few open windows per day (Mon–Fri 2, Saturday 1) so the page
// doesn't look empty. The rest show as taken. When a shown window gets booked, the
// next hidden one opens. The owner page and Google Calendar always show real times.
const BK_SHOW_WEEKDAY  = 2;
const BK_SHOW_SATURDAY = 1;
// Patterns Fateh picked by hand: date => windows shown first. Other weeks are made automatically.
const BK_SHOW_FIXED = [
  '2026-11-23' => ['09:00', '15:00'], '2026-11-24' => ['11:00', '17:00'], '2026-11-25' => ['13:00', '17:00'],
  '2026-11-26' => ['09:00', '13:00'], '2026-11-27' => ['11:00', '15:00'], '2026-11-28' => ['09:00'],
];

/** Same "random" number every time for the same seed, so everyone sees the same page. */
function bk_seed_int(string $seed, int $max): int {
  return hexdec(substr(hash('sha256', 'bk-show|' . $seed), 0, 8)) % $max;
}

/** Seeded shuffle: same seed → same order. */
function bk_seed_shuffle(array $list, string $seed): array {
  usort($list, fn($a, $b) => strcmp(hash('sha256', $seed . '|' . $a), hash('sha256', $seed . '|' . $b)));
  return $list;
}

/** Windows shown first on each day of one week, e.g. ['2026-11-30' => ['09:00', '15:00'], ...]. */
function bk_week_pattern(DateTimeImmutable $monday): array {
  $week = $monday->format('o-W');
  $morning = ['09:00', '11:00']; $afternoon = ['13:00', '15:00'];
  // Two weekdays get the evening 5–7 window (paired with a morning or afternoon one);
  // the other three get one morning + one afternoon, so each day's two are at different times.
  $eveningDays = array_slice(bk_seed_shuffle(['0', '1', '2', '3', '4'], "$week|eve"), 0, 2);
  $out = [];
  for ($i = 0; $i < 5; $i++) {
    $date = $monday->modify("+$i days")->format('Y-m-d');
    if (in_array((string) $i, $eveningDays, true)) {
      $other = array_merge($morning, $afternoon)[bk_seed_int("$date|o", 4)];
      $out[$date] = [$other, '17:00'];
    } else {
      $out[$date] = [$morning[bk_seed_int("$date|m", 2)], $afternoon[bk_seed_int("$date|a", 2)]];
    }
  }
  // Saturday swaps between 9–11 and 11–1 each week
  $out[$monday->modify('+5 days')->format('Y-m-d')] = [((int) $monday->format('W')) % 2 === 0 ? '09:00' : '11:00'];
  return $out;
}

/** Order in which a day's windows are offered to customers: the day's picks, then the rest in a mixed order. */
function bk_show_order(DateTimeImmutable $d): array {
  $date = $d->format('Y-m-d');
  $all = array_column(bk_day_windows($d), 0);
  if (isset(BK_SHOW_FIXED[$date])) {
    $first = BK_SHOW_FIXED[$date];
  } else {
    $monday = $d->modify('-' . ((int) $d->format('N') - 1) . ' days');
    $first = bk_week_pattern($monday)[$date] ?? [];
  }
  $first = array_values(array_intersect($first, $all));
  $rest = bk_seed_shuffle(array_values(array_diff($all, $first)), "$date|rest");
  return array_merge($first, $rest);
}

/** Start times ("HH:MM") a customer can book on this day, given the real free windows. */
function bk_customer_shown(DateTimeImmutable $d, array $freeStarts): array {
  $limit = (int) $d->format('N') === 6 ? BK_SHOW_SATURDAY : BK_SHOW_WEEKDAY;
  $shown = [];
  foreach (bk_show_order($d) as $hm) {
    if (count($shown) >= $limit) break;
    if (in_array($hm, $freeStarts, true)) $shown[] = $hm;
  }
  return $shown;
}

function bk_slots(bool $owner = false): array {
  $start = (new DateTimeImmutable('now', bk_tz()))->setTime(0, 0);
  $end = $start->modify('+' . (BK_DAYS_AHEAD + 1) . ' days');
  $busy = bk_busy($start, $end);
  $days = [];
  for ($i = 0; $i <= BK_DAYS_AHEAD; $i++) {
    $d = $start->modify("+$i days");
    $dayWins = bk_day_windows($d);
    if (!$dayWins) continue;
    $wins = [];
    foreach ($dayWins as [$hm, $label]) {
      [$s, $e] = bk_window($d->format('Y-m-d'), $hm);
      $booked = bk_overlaps($s, $e, $busy);
      $wins[] = ['start' => $hm, 'label' => $label, 'available' => bk_window_bookable($s, $owner) && !$booked, 'booked' => $booked];
    }
    if (!$owner) {
      // Customer page: only a few of the free windows are offered; the others look taken.
      $free = array_column(array_filter($wins, fn($w) => $w['available']), 'start');
      $shown = bk_customer_shown($d, $free);
      foreach ($wins as &$w) {
        if ($w['available'] && !in_array($w['start'], $shown, true)) { $w['available'] = false; $w['booked'] = true; }
      }
      unset($w);
    }
    // Every open day (Mon–Sat) is listed (full days too), so the page can show how busy each day is.
    // Days that are simply too soon (12-hour notice) are left out instead of looking "full".
    $timeOk = false;
    foreach ($dayWins as [$hm]) if (bk_window_bookable(bk_window($d->format('Y-m-d'), $hm)[0], $owner)) $timeOk = true;
    if ($timeOk) $days[] = ['date' => $d->format('Y-m-d'), 'windows' => $wins];
  }
  return $days;
}

function bk_create_event(array $b, DateTimeImmutable $s, DateTimeImmutable $e): array {
  $addr = $b['address'] . ($b['unit'] ? ', ' . $b['unit'] : '') . ', ' . $b['city'] . ', ON ' . $b['postal'];
  // Our own event id (Google allows 0-9 + a-v), so the signed owner link can go in the description
  $id = 'bk' . bin2hex(random_bytes(10));
  try { $link = bk_action_url($id); } catch (Throwable $e) { $link = ''; }
  $desc = implode("\n", [
    $link ? 'Open booking (Confirm / Change time / Decline): ' . $link : 'Booked online (website form). Confirm with the customer by text.',
    $link ? 'Make changes with this link, not in the calendar, so the customer gets the WhatsApp message.' : '',
    !empty($b['source']) ? 'Booked by: ' . $b['source'] : '',
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
    'id' => $id,
    'summary' => 'NEW: ' . $b['service'] . ' – ' . $b['firstName'] . ' ' . $b['lastName'] . ' (' . $b['city'] . ')',
    'location' => $addr,
    'description' => $desc,
    'start' => ['dateTime' => $s->format(DATE_RFC3339), 'timeZone' => BK_TZ],
    'end' => ['dateTime' => $e->format(DATE_RFC3339), 'timeZone' => BK_TZ],
    'colorId' => BK_COLOR_NEW, // yellow = new online booking, still to confirm
    // Kept on the event so the Confirm / Change time / Decline page can send the WhatsApp message
    'extendedProperties' => ['private' => [
      'bkFirst' => $b['firstName'], 'bkPhone' => $b['phone'], 'bkStatus' => 'new',
    ] + ($b['lat'] !== '' ? ['bkLat' => $b['lat'], 'bkLng' => $b['lng']] : [])],
  ];
  if (bk_mock()) { @file_put_contents(sys_get_temp_dir() . '/bk_mock_events.log', json_encode($event) . "\n", FILE_APPEND); return $event + ['created' => date(DATE_RFC3339)]; }
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
    'lat' => $t('lat', 12), 'lng' => $t('lng', 12),
  ];
  // Map point from the address picker: keep only if it is a real GTA point
  if (!is_numeric($b['lat']) || !is_numeric($b['lng']) || $b['lat'] < 43 || $b['lat'] > 44.5 || $b['lng'] < -80.5 || $b['lng'] > -78.5) $b['lat'] = $b['lng'] = '';
  $err = [];
  foreach (['firstName', 'lastName'] as $f) if (!preg_match("/^[\p{L}' .-]{2,60}$/u", $b[$f])) $err[$f] = 'Letters only, at least 2.';
  if (strlen($b['phone']) !== 10) $err['phone'] = 'Enter a 10-digit phone number.';
  elseif (!in_array(substr($b['phone'], 0, 3), BK_AREA_CODES, true)) $err['phone'] = 'Please use a local GTA number.';
  elseif (preg_match('/^(\d)\1{6}$/', substr($b['phone'], 3)) || substr($b['phone'], 3) === '5551234') $err['phone'] = 'Please enter a real phone number.';
  if (!filter_var($b['email'], FILTER_VALIDATE_EMAIL)) $err['email'] = 'Enter a valid email.';
  if (mb_strlen($b['address']) < 5) $err['address'] = 'Enter your street address.';
  // City now comes from the picked address (any GTA city), so check the format instead of a fixed list
  if (!preg_match("/^[\p{L}' .-]{2,40}$/u", $b['city'])) $err['city'] = 'Enter your city.';
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
function bk_mail(string $to, string $subject, string $text, array $attachments = [], ?string $replyTo = null, ?string $html = null): bool {
  $boundary = 'bk_' . bin2hex(random_bytes(8));
  $headers = [
    'From: ' . BK_BUSINESS . ' <' . BK_FROM . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
  ];
  if ($replyTo) $headers[] = 'Reply-To: ' . $replyTo;
  if ($html !== null) {
    // Plain text + HTML (HTML shows a real button); mail apps pick the one they can show
    $alt = 'bka_' . bin2hex(random_bytes(8));
    $body = "--$boundary\r\nContent-Type: multipart/alternative; boundary=\"$alt\"\r\n\r\n"
          . "--$alt\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($text)) . "\r\n"
          . "--$alt\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($html)) . "\r\n"
          . "--$alt--\r\n";
  } else {
    $body = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n" . $text . "\r\n";
  }
  foreach ($attachments as [$name, $mime, $bytes]) {
    $body .= "--$boundary\r\nContent-Type: $mime; name=\"$name\"\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"$name\"\r\n\r\n"
           . chunk_split(base64_encode($bytes)) . "\r\n";
  }
  $body .= "--$boundary--";
  $subj = '=?UTF-8?B?' . base64_encode($subject) . '?=';
  if (bk_mock()) { @file_put_contents(sys_get_temp_dir() . '/bk_mock_mail.log', "TO: $to\nSUBJECT: $subject\nATTACHMENTS: " . count($attachments) . "\n$text\n" . ($html ? "HTML: $html\n" : '') . "----\n", FILE_APPEND); return true; }
  return @mail($to, $subj, $body, implode("\r\n", $headers), '-f' . BK_FROM);
}

// ---------------- Twilio WhatsApp ----------------
/** @return array{0: string, 1: string}|null  [account SID, auth token] */
function bk_twilio_keys(): ?array {
  if (getenv('TWILIO_ACCOUNT_SID') && getenv('TWILIO_AUTH_TOKEN')) return [getenv('TWILIO_ACCOUNT_SID'), getenv('TWILIO_AUTH_TOKEN')];
  foreach (bk_key_paths() as $path) {
    $path = dirname($path) . '/twilio.json';
    if (@is_readable($path)) {
      $k = json_decode((string) file_get_contents($path), true);
      if (!empty($k['account_sid']) && !empty($k['auth_token'])) return [trim($k['account_sid']), trim($k['auth_token'])];
    }
  }
  return null;
}

function bk_twilio_token(): ?string { return bk_twilio_keys()[1] ?? null; }

/** "647-555-1234" → "+16475551234" */
function bk_e164(string $phone): string { return '+1' . bk_clean_phone($phone); }

/** POST to Twilio's Messages API. Returns the message SID. */
function bk_twilio_send(array $post, string $what): string {
  if (bk_mock()) { @file_put_contents(sys_get_temp_dir() . '/bk_mock_whatsapp.log', json_encode($post) . "\n", FILE_APPEND); return 'SM-mock'; }
  $keys = bk_twilio_keys();
  if (!$keys) throw new RuntimeException('Twilio key file (booking-private/twilio.json) not found');
  [$sid, $token] = $keys;
  $ch = curl_init('https://api.twilio.com/2010-04-01/Accounts/' . rawurlencode($sid) . '/Messages.json');
  curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20,
    CURLOPT_USERPWD => $sid . ':' . $token,
    CURLOPT_POSTFIELDS => http_build_query($post),
  ]);
  $raw = curl_exec($ch);
  $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  $r = json_decode((string) $raw, true) ?? [];
  if ($code >= 400 || empty($r['sid'])) throw new RuntimeException($what . ' not sent: ' . ($r['message'] ?? 'HTTP ' . $code));
  return $r['sid'];
}

/** Plain SMS from the Twilio number (no Meta approval needed). */
function bk_sms(string $phone, string $text): string {
  return bk_twilio_send(['From' => BK_TWILIO_FROM, 'To' => bk_e164($phone), 'Body' => $text], 'SMS');
}

/** Send an approved WhatsApp template. Returns the Twilio message SID. */
function bk_whatsapp(string $phone, string $template, array $vars): string {
  $vars = array_combine(array_map('strval', range(1, count($vars))), array_map('strval', array_values($vars)));
  $post = [
    'From' => 'whatsapp:' . BK_TWILIO_FROM,
    'To' => 'whatsapp:' . bk_e164($phone),
    'ContentSid' => BK_WA_TEMPLATES[$template],
    'ContentVariables' => json_encode($vars, JSON_UNESCAPED_UNICODE),
  ];
  // Customer messages: if WhatsApp can't deliver (no WhatsApp on that number), Twilio calls
  // /api/twilio-status.php, which sends the same message as a plain text instead.
  if (bk_sms_text($template, array_values($vars)) !== '') {
    try { $post['StatusCallback'] = bk_fallback_url($phone, $template, array_values($vars)); } catch (Throwable $e) { /* no key: no fallback */ }
  }
  return bk_twilio_send($post, 'WhatsApp');
}

/** Same words as the WhatsApp templates, for the text-message fallback. */
function bk_sms_text(string $template, array $v): string {
  $v = array_map(fn($x) => str_replace('–', '-', (string) $x), array_pad($v, 4, '')); // plain dash keeps the SMS cheap
  switch ($template) {
    case 'confirmed':
      return "Hi {$v[0]}, your booking with " . BK_BUSINESS . " is confirmed for {$v[1]} at {$v[2]}.\nAddress: {$v[3]}\nNeed to reschedule or cancel? Call or text us at " . BK_PHONE . '.';
    case 'rescheduled':
      return "Hi {$v[0]}, your appointment with " . BK_BUSINESS . " has been rescheduled to {$v[1]} at {$v[2]}.\nAddress: {$v[3]}\nQuestions? Call or text us at " . BK_PHONE . '.';
    case 'cancelled':
      return "Hi {$v[0]}, your appointment with " . BK_BUSINESS . " on {$v[1]} at {$v[2]} has been cancelled.\nTo book a new time, call or text us at " . BK_PHONE . '.';
  }
  return '';
}

function bk_fallback_url(string $phone, string $template, array $vars): string {
  $f = bk_b64url(json_encode(['p' => $phone, 't' => $template, 'v' => $vars], JSON_UNESCAPED_UNICODE));
  return BK_SITE . '/api/twilio-status.php?f=' . $f . '&k=' . bk_sig('fallback|' . $f);
}

// ---------------- Owner action links (Confirm / Change time / Decline) ----------------
function bk_sig(string $eventId): string {
  $key = bk_twilio_token() ?: (bk_mock() ? 'mock-key' : '');
  if ($key === '') throw new RuntimeException('Twilio key file not found');
  return substr(hash_hmac('sha256', 'booking-action|' . $eventId, $key), 0, 32);
}

/** Short code used in links: "<eventId>.<signature>" */
function bk_link_code(string $eventId): string { return $eventId . '.' . bk_sig($eventId); }

function bk_action_url(string $eventId, string $action = ''): string {
  return BK_SITE . '/api/booking-action.php?b=' . rawurlencode(bk_link_code($eventId)) . ($action ? '&a=' . $action : '');
}

function bk_event_url(string $eventId): string {
  return 'https://www.googleapis.com/calendar/v3/calendars/' . rawurlencode(BK_CALENDAR_ID) . '/events/' . rawurlencode($eventId);
}

function bk_get_event(string $eventId): array {
  if (bk_mock()) {
    $s = (new DateTimeImmutable('tomorrow 10:00', bk_tz()));
    return ['id' => $eventId, 'status' => 'confirmed', 'summary' => 'NEW: Leak – Test Customer (Brampton)', 'location' => '1 Main St, Brampton, ON L6X 1A1',
            'start' => ['dateTime' => $s->format(DATE_RFC3339)], 'end' => ['dateTime' => $s->modify('+2 hours')->format(DATE_RFC3339)],
            'description' => "Booked online (website form). Confirm with the customer by text.\n\nCustomer: Test Customer\nPhone: 647-555-0199\nEmail: test@example.com\nAddress: 1 Main St, Brampton, ON L6X 1A1\nService: Leak\n\nDetails:\nKitchen sink leaking\nunder the cabinet\n\nPhotos: 2 sent to info@fatehplumelec.com", 'extendedProperties' => ['private' => ['bkFirst' => 'Test', 'bkPhone' => '647-555-0199', 'bkStatus' => 'new']]];
  }
  return bk_api('GET', bk_event_url($eventId));
}

function bk_patch_event(string $eventId, array $changes): array {
  if (bk_mock()) { @file_put_contents(sys_get_temp_dir() . '/bk_mock_events.log', 'PATCH ' . json_encode($changes) . "\n", FILE_APPEND); return $changes; }
  return bk_api('PATCH', bk_event_url($eventId), $changes);
}

/** Insert a full event (used for the new entry when a booking is moved). */
function bk_insert_event(array $event): array {
  if (bk_mock()) { @file_put_contents(sys_get_temp_dir() . '/bk_mock_events.log', 'INSERT ' . json_encode($event) . "\n", FILE_APPEND); return $event; }
  return bk_api('POST', 'https://www.googleapis.com/calendar/v3/calendars/' . rawurlencode(BK_CALENDAR_ID) . '/events', $event);
}

function bk_delete_event(string $eventId): void {
  if (bk_mock()) { @file_put_contents(sys_get_temp_dir() . '/bk_mock_events.log', "DELETE $eventId\n", FILE_APPEND); return; }
  bk_api('DELETE', bk_event_url($eventId));
}

/** Customer first name + phone from the event (older bookings: read from the description). */
function bk_event_customer(array $ev): array {
  $p = $ev['extendedProperties']['private'] ?? [];
  $first = $p['bkFirst'] ?? '';
  $phone = $p['bkPhone'] ?? '';
  $desc = (string) ($ev['description'] ?? '');
  if ($first === '' && preg_match('/^Customer:\s*(\S+)/m', $desc, $m)) $first = $m[1];
  if ($phone === '' && preg_match('/^Phone:\s*([\d -]+)/m', $desc, $m)) $phone = trim($m[1]);
  return [$first ?: 'there', $phone];
}

/** WhatsApp-friendly date + time for an event start, e.g. ["Wed, Nov 18", "9–11 AM"] */
function bk_when_parts(DateTimeImmutable $s): array {
  $time = $s->format('g:i A');
  foreach (BK_WINDOWS as [$hm, $label]) if ($hm === $s->format('H:i')) $time = $label;
  return [$s->format('D, M j'), $time];
}

// ---------------- Distance from home (owner page) ----------------
// Free services, no key: OpenStreetMap Nominatim (address → map point, only when the
// booking has no point from the address picker) and OSRM (driving km + minutes, no traffic).
function bk_cached_get(string $url, int $ttl = 2592000): ?array {
  $file = sys_get_temp_dir() . '/bk_geo_' . md5($url) . '.json';
  if (@is_readable($file) && filemtime($file) > time() - $ttl) return json_decode((string) file_get_contents($file), true);
  $ch = curl_init($url);
  curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8,
    CURLOPT_HTTPHEADER => ['User-Agent: fatehplumelec.com booking page (info@fatehplumelec.com)']]);
  $raw = curl_exec($ch);
  $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($raw === false || $code >= 400) return null;
  $data = json_decode((string) $raw, true);
  if ($data) @file_put_contents($file, $raw);
  return $data;
}

/** @return array{0: float, 1: float}|null  [lat, lng] */
function bk_geocode(string $address): ?array {
  $tries = [$address, preg_replace('/,\s*[A-Z]\d[A-Z]\s?\d[A-Z]\d\s*$/i', '', $address)];
  foreach (array_unique($tries) as $q) {
    $r = bk_cached_get('https://nominatim.openstreetmap.org/search?' . http_build_query(['q' => $q, 'format' => 'json', 'limit' => 1, 'countrycodes' => 'ca']));
    if (!empty($r[0]['lat'])) return [(float) $r[0]['lat'], (float) $r[0]['lon']];
  }
  return null;
}

/** Driving distance from home: ['km' => 12.3, 'min' => 18, 'lat' => .., 'lng' => ..] or null */
function bk_distance(array $ev): ?array {
  if (bk_mock()) return ['km' => 12.3, 'min' => 18, 'lat' => 43.7, 'lng' => -79.75];
  $p = $ev['extendedProperties']['private'] ?? [];
  $to = isset($p['bkLat'], $p['bkLng']) ? [(float) $p['bkLat'], (float) $p['bkLng']] : bk_geocode((string) ($ev['location'] ?? ''));
  $from = bk_geocode(BK_HOME_ADDRESS);
  if (!$to || !$from) return null;
  $r = bk_cached_get(sprintf('https://router.project-osrm.org/route/v1/driving/%F,%F;%F,%F?overview=false', $from[1], $from[0], $to[1], $to[0]));
  if (empty($r['routes'][0])) return null;
  return ['km' => round($r['routes'][0]['distance'] / 1000, 1), 'min' => (int) round($r['routes'][0]['duration'] / 60), 'lat' => $to[0], 'lng' => $to[1]];
}

function bk_directions_url(string $address): string {
  return 'https://www.google.com/maps/dir/?' . http_build_query(['api' => 1, 'origin' => BK_HOME_ADDRESS, 'destination' => $address, 'travelmode' => 'driving']);
}

// ---------------- Booking log (Google Sheet) ----------------
// Columns A–N: Booking ID | Booked at | Source | Status | Status changed | Job date | Arrival window |
//              Customer | Phone | Email | Address | Service | Details | Open booking link
function bk_sheet_url(string $range, string $suffix = ''): string {
  return 'https://sheets.googleapis.com/v4/spreadsheets/' . rawurlencode(BK_SHEET_ID) . '/values/' . rawurlencode($range) . $suffix;
}

/** Row number (1-based) of a booking ID in column A, or 0 if it is not in the sheet. */
/** [row of this booking ID or 0, last used row] from column A. */
function bk_sheet_row(string $id): array {
  $r = bk_api('GET', bk_sheet_url(BK_SHEET_TAB . '!A:A'));
  $vals = $r['values'] ?? [];
  foreach ($vals as $i => $v) if (($v[0] ?? '') === $id) return [$i + 1, count($vals)];
  return [0, count($vals)];
}

function bk_sheet_now(): string { return (new DateTimeImmutable('now', bk_tz()))->format('Y-m-d H:i'); }

/** Full row for a booking, read from its calendar event. */
function bk_sheet_row_from_event(array $ev, string $status): array {
  $desc = (string) ($ev['description'] ?? '');
  $get = fn($label) => preg_match('/^' . $label . ':[ \t]*(.*)$/m', $desc, $m) ? trim($m[1]) : '';
  $details = preg_match('/^Details:\s*\n(.*?)(?:\n\s*\nPhotos:|\z)/ms', $desc, $m) ? trim($m[1]) : '';
  $s = (new DateTimeImmutable($ev['start']['dateTime'] ?? 'now'))->setTimezone(bk_tz());
  $e = (new DateTimeImmutable($ev['end']['dateTime'] ?? 'now'))->setTimezone(bk_tz());
  $id = (string) ($ev['id'] ?? '');
  try { $link = bk_action_url($id); } catch (Throwable $x) { $link = ''; }
  $created = isset($ev['created']) ? (new DateTimeImmutable($ev['created']))->setTimezone(bk_tz())->format('Y-m-d H:i') : bk_sheet_now();
  // Source: "Booked by:" line in the event (owner page / Claude); none = website form; not made by the booking system = manual
  $src = $get('Booked by');
  if ($src === '' ) $src = strpos($id, 'bk') === 0 ? 'Website – by customer' : 'Manual – by owner';
  elseif (strpos($src, 'Owner (phone') === 0 || stripos($src, 'Claude') !== false) $src = 'Booked by Claude';
  else $src = 'Owner page – by owner';
  return [$id, $created, $src,
          $status, bk_sheet_now(), $s->format('D, M j, Y'), $s->format('g:i A') . '–' . $e->format('g:i A'),
          $get('Customer'), $get('Phone'), $get('Email'), (string) ($ev['location'] ?? $get('Address')), $get('Service'),
          str_replace("\r", '', $details), $link];
}

/** Add the booking, or update its status (and time) if it is already in the sheet. Never throws. */
function bk_sheet_log(array $ev, string $status): void {
  if (BK_SHEET_ID === '' || bk_mock()) {
    if (bk_mock()) @file_put_contents(sys_get_temp_dir() . '/bk_mock_sheet.log', json_encode(bk_sheet_row_from_event($ev, $status), JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND);
    return;
  }
  try {
    $row = bk_sheet_row_from_event($ev, $status);
    [$n, $last] = bk_sheet_row($row[0]);
    if ($n === 0) {
      // Write on the first empty row under the list (the append API can land above the header when a filter is on)
      $n = max($last, 1) + 1;
      bk_api('PUT', bk_sheet_url(BK_SHEET_TAB . "!A$n:N$n", '?valueInputOption=RAW'), ['values' => [$row]]);
    } else {
      bk_api('PUT', bk_sheet_url(BK_SHEET_TAB . "!D$n:G$n", '?valueInputOption=RAW'), ['values' => [array_slice($row, 3, 4)]]);
    }
  } catch (Throwable $e) {
    error_log('[booking] sheet log: ' . $e->getMessage());
  }
}
