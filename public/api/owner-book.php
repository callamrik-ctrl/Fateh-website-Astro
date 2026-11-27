<?php
// Owner-only booking: Fateh (or Claude, for him) books a customer he talked to by phone/WhatsApp.
// Creates the same yellow "NEW" calendar entry as a website booking, with the
// Open booking (Confirm / Change time / Decline) link. Nothing goes to the customer
// until he presses Confirm on that page.
//
// Protected by a secret key kept OUTSIDE the website folder:
//   booking-private/owner-key.txt   (one line, at least 20 characters)
// (or the OWNER_BOOK_KEY environment variable).
//
// GET  /api/owner-book.php                      → small form page (key remembered on this device)
// POST /api/owner-book.php  mode=day&date=...    → real free/busy windows for that date (JSON)
// POST /api/owner-book.php  (booking fields)     → creates the booking (JSON)
require __DIR__ . '/_booking.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

const OB_DAYS_AHEAD = 90;
const OB_MAX_BAD_KEYS = 10; // wrong keys per IP per hour

function ob_key(): string {
  if (getenv('OWNER_BOOK_KEY')) return trim((string) getenv('OWNER_BOOK_KEY'));
  foreach (bk_key_paths() as $path) {
    $path = dirname($path) . '/owner-key.txt';
    if (@is_readable($path)) return trim((string) file_get_contents($path));
  }
  return bk_mock() ? 'mock-owner-key-123456789' : '';
}

function ob_bad_key_count(bool $add): int {
  $file = sys_get_temp_dir() . '/bk_ownerbad_' . md5(bk_client_ip()) . '.json';
  $now = time();
  $hits = array_values(array_filter((array) json_decode((string) @file_get_contents($file), true), fn($t) => $t > $now - 3600));
  if ($add) { $hits[] = $now; @file_put_contents($file, json_encode($hits)); }
  return count($hits);
}

function ob_check_key(): void {
  $real = ob_key();
  if (strlen($real) < 20) bk_json(['ok' => false, 'error' => 'Owner key is not set up on the server (booking-private/owner-key.txt, 20+ characters).'], 503);
  if (ob_bad_key_count(false) >= OB_MAX_BAD_KEYS) bk_json(['ok' => false, 'error' => 'Too many wrong keys. Try again in an hour.'], 429);
  $given = (string) ($_SERVER['HTTP_X_OWNER_KEY'] ?? ($_POST['key'] ?? ''));
  if (!hash_equals($real, trim($given))) { ob_bad_key_count(true); bk_json(['ok' => false, 'error' => 'Wrong owner key.'], 403); }
}

/** "9-11", "9–11 AM", "5 pm", "17:00", "evening" → "HH:MM" window start, or '' */
function ob_window_start(string $v): string {
  $v = strtolower(trim($v));
  $words = ['morning' => '09:00', 'late morning' => '11:00', 'noon' => '11:00', 'afternoon' => '13:00', 'late afternoon' => '15:00', 'evening' => '17:00'];
  if (isset($words[$v])) return $words[$v];
  if (!preg_match('/^(\d{1,2})(?::(\d{2}))?/', $v, $m)) return '';
  $h = (int) $m[1];
  if ($h >= 1 && $h <= 7) $h += 12;           // 1, 3, 5 → afternoon/evening windows
  $hm = sprintf('%02d:%s', $h, $m[2] ?? '00');
  return in_array($hm, array_column(BK_WINDOWS, 0), true) ? $hm : '';
}

/** Real windows for one date (owner view: no 12-hour notice, no hidden slots). */
function ob_day(string $date): array {
  $day = DateTimeImmutable::createFromFormat('!Y-m-d', $date, bk_tz());
  if (!$day || $day->format('Y-m-d') !== $date) return [];
  $busy = bk_busy($day, $day->modify('+1 day'));
  $now = new DateTimeImmutable('now', bk_tz());
  $out = [];
  foreach (bk_day_windows($day) as [$hm, $label]) {
    [$s, $e] = bk_window($date, $hm);
    $taken = bk_overlaps($s, $e, $busy);
    $out[] = ['start' => $hm, 'label' => $label, 'free' => !$taken && $s > $now, 'booked' => $taken, 'past' => $s <= $now];
  }
  return $out;
}

// ---------------- Form page ----------------
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  $services = implode('', array_map(fn($s) => '<option>' . htmlspecialchars($s) . '</option>', BK_SERVICES));
  $windows = implode('', array_map(fn($w) => '<option value="' . $w[0] . '">' . htmlspecialchars($w[1]) . '</option>', BK_WINDOWS));
  ?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Owner booking – <?= BK_BUSINESS ?></title>
<style>
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f3f4f6;margin:0;padding:16px;color:#111827}
.card{max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,.06)}
h1{font-size:1.25rem;margin:0 0 4px}p.sub{color:#6b7280;margin:0 0 14px;font-size:.9rem}
label{display:block;font-weight:600;font-size:.9rem;margin:12px 0 4px}
input,select,textarea{width:100%;box-sizing:border-box;font-size:1rem;padding:11px;border:1px solid #d1d5db;border-radius:9px;background:#fff}
textarea{min-height:80px}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
button{width:100%;font-size:1.05rem;padding:14px;border-radius:10px;border:0;margin-top:16px;cursor:pointer;background:#ca8a04;color:#fff;font-weight:700}
#slots{font-size:.9rem;margin-top:6px}#slots span{display:inline-block;margin:3px 4px 0 0;padding:4px 8px;border-radius:7px}
.f{background:#dcfce7;color:#166534}.t{background:#fee2e2;color:#991b1b;text-decoration:line-through}
#msg{margin-top:14px;padding:12px;border-radius:10px;display:none;white-space:pre-line}
.ok{background:#ecfdf3;color:#065f46;border:1px solid #a7f3d0}.bad{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
a{color:#2563eb;word-break:break-all}
</style></head><body><div class="card">
<h1>🟡 Owner booking</h1>
<p class="sub">Adds a yellow NEW booking to the company calendar. The customer gets nothing until you press Confirm.</p>
<form id="f" autocomplete="off">
<label>Owner key <small>(saved on this device)</small></label><input name="key" id="key" type="password" required>
<label>Customer name</label><input name="name" required>
<label>Phone</label><input name="phone" inputmode="tel" required>
<label>Email (optional)</label><input name="email" type="email">
<label>Street address (with unit if any)</label><input name="address" required>
<div class="row"><div><label>City</label><input name="city" required></div><div><label>Postal code</label><input name="postal" required></div></div>
<label>Service</label><input name="service" list="svc" required><datalist id="svc"><?= $services ?></datalist>
<label>Details</label><textarea name="details"></textarea>
<div class="row"><div><label>Date</label><input name="date" id="date" type="date" required></div>
<div><label>Time window</label><select name="window" id="win" required><?= $windows ?></select></div></div>
<div id="slots"></div>
<label style="font-weight:400"><input type="checkbox" name="alert" value="1" checked style="width:auto"> Send me the WhatsApp "Open booking" alert</label>
<button type="submit" id="go">Book it (yellow, not confirmed)</button>
</form><div id="msg"></div></div>
<script>
const f=document.getElementById('f'),k=document.getElementById('key'),msg=document.getElementById('msg'),slots=document.getElementById('slots');
try{k.value=localStorage.getItem('ownerBookKey')||''}catch(e){}
const show=(t,ok)=>{msg.className=ok?'ok':'bad';msg.style.display='block';msg.innerHTML=t};
async function post(fd){fd.set('key',k.value);try{localStorage.setItem('ownerBookKey',k.value)}catch(e){}
  const r=await fetch(location.pathname,{method:'POST',body:fd});return r.json();}
document.getElementById('date').addEventListener('change',async e=>{
  slots.textContent='Checking calendar…';const fd=new FormData();fd.set('mode','day');fd.set('date',e.target.value);
  const j=await post(fd);if(!j.ok){slots.textContent=j.error;return}
  slots.innerHTML=j.windows.length?j.windows.map(w=>'<span class="'+(w.free?'f':'t')+'">'+w.label+'</span>').join(''):'Closed that day.';});
f.addEventListener('submit',async e=>{e.preventDefault();const b=document.getElementById('go');b.disabled=true;b.textContent='Booking…';
  try{const j=await post(new FormData(f));
    if(j.ok)show('✅ Booked (yellow, waiting for you).\n'+j.when+'\n'+j.customer+'\n<a href="'+j.link+'">Open booking: Confirm / Change time / Decline</a>',true);
    else show('❌ '+j.error+(j.fields?'\n'+Object.values(j.fields).join('\n'):''),false);
  }catch(err){show('❌ Network error',false)}b.disabled=false;b.textContent='Book it (yellow, not confirmed)';});
</script></body></html><?php
  exit;
}

// ---------------- API ----------------
ob_check_key();

// Sheet check: tries to read the bookings sheet and reports the exact error (changes nothing)
if (($_POST['mode'] ?? '') === 'sheetcheck') {
  try { $r = bk_api('GET', bk_sheet_url(BK_SHEET_TAB . '!A1:A2')); bk_json(['ok' => true, 'sheet' => 'readable', 'a1' => $r['values'][0][0] ?? '']); }
  catch (Throwable $e) { bk_json(['ok' => false, 'sheet_error' => $e->getMessage()]); }
}

if (($_POST['mode'] ?? '') === 'day') {
  try { bk_json(['ok' => true, 'date' => (string) ($_POST['date'] ?? ''), 'windows' => ob_day((string) ($_POST['date'] ?? ''))]); }
  catch (Throwable $e) { bk_json(['ok' => false, 'error' => 'Calendar not reachable: ' . $e->getMessage()], 503); }
}

// Fields: name, phone, email (optional), address (+ unit), city, postal, service, details, date, window
$t = fn($k, $max = 200) => mb_substr(trim((string) ($_POST[$k] ?? '')), 0, $max);
$nameParts = preg_split('/\s+/', $t('name', 120), 2);
$phone = bk_clean_phone($t('phone', 30));
$postal = strtoupper(preg_replace('/\s/', '', $t('postal', 10)));
$b = [
  'firstName' => $nameParts[0] ?? '', 'lastName' => $nameParts[1] ?? '',
  'phone' => $phone, 'email' => $t('email', 120),
  'address' => $t('address', 160), 'unit' => $t('unit', 60), 'city' => $t('city', 40), 'postal' => $postal,
  'service' => $t('service', 80), 'details' => $t('details', 2000) ?: '(none given)',
  'lat' => '', 'lng' => '', 'photoCount' => 0,
  // Who made it: Claude passes by=claude; the form page used by hand = owner
  'source' => (($_POST['by'] ?? '') === 'claude') ? 'Booked by Claude' : 'Owner page – by owner',
];
$date = $t('date', 10);
$startHm = ob_window_start($t('window', 20) ?: $t('start', 5));

$err = [];
if (!preg_match("/^[\p{L}' .-]{2,60}$/u", $b['firstName'])) $err['name'] = 'Enter the customer name.';
if (strlen($phone) !== 10) $err['phone'] = 'Phone must have 10 digits.';
if ($b['email'] !== '' && !filter_var($b['email'], FILTER_VALIDATE_EMAIL)) $err['email'] = 'Email is not valid (leave it blank if none).';
if (mb_strlen($b['address']) < 5) $err['address'] = 'Enter the street address.';
if (!preg_match("/^[\p{L}' .-]{2,40}$/u", $b['city'])) $err['city'] = 'Enter the city.';
if (!preg_match('/^[A-Z]\d[A-Z]\d[A-Z]\d$/', $postal)) $err['postal'] = 'Postal code looks wrong (like L6X 1A1).';
if ($b['service'] === '') $err['service'] = 'Enter the service.';
$win = $startHm !== '' ? bk_window($date, $startHm) : null;
if (!$win) $err['window'] = 'Pick a real window for that day (Mon–Fri 9–11, 11–1, 1–3, 3–5, 5–7; Sat 9–11, 11–1; Sunday closed).';
elseif ($win[0] <= new DateTimeImmutable('now', bk_tz())) $err['window'] = 'That window has already started.';
elseif ($win[0] > (new DateTimeImmutable('today', bk_tz()))->modify('+' . OB_DAYS_AHEAD . ' days')) $err['window'] = 'Too far ahead (max ' . OB_DAYS_AHEAD . ' days).';
if ($err) bk_json(['ok' => false, 'error' => 'Please fix these:', 'fields' => $err], 422);

$b['phone'] = substr($phone, 0, 3) . '-' . substr($phone, 3, 3) . '-' . substr($phone, 6);
$b['postal'] = substr($postal, 0, 3) . ' ' . substr($postal, 3);
[$start, $end, $label] = $win;

try {
  $day = $start->setTime(0, 0);
  if (bk_overlaps($start, $end, bk_busy($day, $day->modify('+1 day')))) {
    $free = array_column(array_filter(ob_day($date), fn($w) => $w['free']), 'label');
    bk_json(['ok' => false, 'error' => 'That window is already taken in the calendar.', 'fields' => ['free' => 'Free that day: ' . ($free ? implode(', ', $free) : 'none')]], 409);
  }
  $event = bk_create_event($b, $start, $end);
  bk_sheet_log($event, 'New (yellow)');
} catch (Throwable $e) {
  error_log('[booking] owner-book: ' . $e->getMessage());
  bk_json(['ok' => false, 'error' => 'Could not save to the calendar: ' . $e->getMessage()], 503);
}

$id = (string) ($event['id'] ?? '');
$name = trim($b['firstName'] . ' ' . $b['lastName']);
$when = $start->format('l, F j') . ', ' . $label;
$addr = $b['address'] . ($b['unit'] ? ', ' . $b['unit'] : '') . ', ' . $b['city'] . ', ON ' . $b['postal'];
$link = '';
try { $link = bk_action_url($id); } catch (Throwable $e) { /* no key file: link missing */ }

// Owner WhatsApp alert (same as a website booking), so Confirm can be pressed from WhatsApp.
// Nothing is sent to the customer here.
$alert = 'off';
if ($link && !empty($_POST['alert'])) {
  try { bk_whatsapp(BK_OWNER_WHATSAPP, 'owner_alert', [$name, $b['phone'], $when, $addr, $b['service'], bk_link_code($id)]); $alert = 'sent'; }
  catch (Throwable $e) { $alert = 'failed: ' . $e->getMessage(); error_log('[booking] owner-book alert: ' . $e->getMessage()); }
}

bk_json(['ok' => true, 'when' => $when, 'customer' => $name . ' · ' . $b['phone'] . ' · ' . $addr, 'service' => $b['service'], 'link' => $link, 'alert' => $alert]);
