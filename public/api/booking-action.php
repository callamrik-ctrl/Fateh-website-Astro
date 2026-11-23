<?php
// Owner page for one online booking: Confirm / Change time / Decline.
// Opened from the new-booking email or the WhatsApp alert. The link carries a signed code,
// so only someone with the link can use it. Opening the link changes nothing: every action
// needs a button press (email scanners that "open" links can't confirm a booking by mistake).
require __DIR__ . '/_booking.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

function ba_h($s): string { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }

function ba_page(string $title, string $body, string $tone = ''): void {
  $colors = ['ok' => '#ecfdf3;border-color:#a7f3d0;color:#065f46', 'warn' => '#fffbeb;border-color:#fde68a;color:#92400e', 'bad' => '#fef2f2;border-color:#fecaca;color:#991b1b'];
  $box = $tone ? '<div class="msg" style="background:' . $colors[$tone] . '">' . ba_h($title) . '</div>' : '<h1>' . ba_h($title) . '</h1>';
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
     . '<meta name="robots" content="noindex,nofollow"><title>' . ba_h($title) . ' – ' . BK_BUSINESS . '</title><style>'
     . 'body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f3f4f6;margin:0;padding:16px;color:#111827}'
     . '.card{max-width:520px;margin:0 auto;background:#fff;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,.06)}'
     . 'h1{font-size:1.25rem;margin:0 0 12px}.msg{border:1px solid;border-radius:10px;padding:12px 14px;font-weight:600;margin-bottom:14px}'
     . 'dl{margin:0 0 16px;display:grid;grid-template-columns:90px 1fr;gap:6px 10px}dt{color:#6b7280}dd{margin:0;font-weight:600}'
     . 'button,select{width:100%;font-size:1.05rem;padding:14px;border-radius:10px;border:0;margin-top:10px;cursor:pointer}'
     . 'select{border:1px solid #d1d5db;background:#fff}.g{background:#16a34a;color:#fff}.b{background:#2563eb;color:#fff}.r{background:#fff;color:#b91c1c;border:1px solid #fca5a5}'
     . 'a{color:#2563eb}.small{color:#6b7280;font-size:.9rem;margin-top:12px}'
     . '.dist{background:#eff6ff;border-radius:10px;padding:12px 14px;margin-bottom:10px}.dist span{color:#6b7280;font-size:.85rem}'
     . '.map{width:100%;height:220px;border:0;border-radius:10px}.w{background:#fff;color:#111827;border:1px solid #d1d5db}'
     . '</style></head><body><div class="card">' . $box . $body . '</div></body></html>';
  exit;
}

// ---- Check the link ----
$code = (string) ($_REQUEST['b'] ?? '');
[$id, $sig] = array_pad(explode('.', $code, 2), 2, '');
try {
  if ($id === '' || !preg_match('/^[a-zA-Z0-9_-]{5,200}$/', $id) || !hash_equals(bk_sig($id), $sig)) {
    http_response_code(403);
    ba_page('This link is not valid.', '<p>Open the booking from the latest email or WhatsApp alert.</p>', 'bad');
  }
  $ev = bk_get_event($id);
} catch (Throwable $e) {
  error_log('[booking] action load: ' . $e->getMessage());
  ba_page('This booking could not be found.', '<p>It may have been deleted from the calendar already.</p>', 'bad');
}
if (($ev['status'] ?? '') === 'cancelled') ba_page('This booking was already declined and removed from the calendar.', '', 'warn');

$start = new DateTimeImmutable($ev['start']['dateTime'] ?? 'now', bk_tz());
$start = $start->setTimezone(bk_tz());
[$first, $phone] = bk_event_customer($ev);
[$date, $time] = bk_when_parts($start);
$addr = (string) ($ev['location'] ?? '');
$status = $ev['extendedProperties']['private']['bkStatus'] ?? 'new';
$name = preg_replace('/^(NEW|CONFIRMED|RESCHEDULED):\s*/', '', (string) ($ev['summary'] ?? ''));
$self = '?b=' . rawurlencode($code);
// Email, job details and photos, read from the calendar entry's description
$descText = (string) ($ev['description'] ?? '');
$email = preg_match('/^Email:\s*(\S+@\S+)/m', $descText, $m) ? $m[1] : '';
$jobDetails = preg_match('/^Details:\s*\n(.*?)(?:\n\s*\nPhotos:|\z)/ms', $descText, $m) ? trim($m[1]) : '';
$photoNote = preg_match('/^Photos:\s*(.+)$/m', $descText, $m) ? trim($m[1]) : '';
if ($photoNote !== '' && $photoNote !== 'none') $photoNote = preg_replace('/ sent to .*/', ' (in the booking email)', $photoNote);

$mkDetails = fn(string $st) => '<dl><dt>Job</dt><dd>' . ba_h($name) . '</dd><dt>When</dt><dd>' . ba_h($date . ', ' . $time) . '</dd>'
         . '<dt>Address</dt><dd>' . ba_h($addr) . '</dd><dt>Phone</dt><dd><a href="tel:' . ba_h(bk_e164($phone)) . '">' . ba_h($phone) . '</a></dd>'
         . ($email !== '' ? '<dt>Email</dt><dd><a href="mailto:' . ba_h($email) . '">' . ba_h($email) . '</a></dd>' : '')
         . ($jobDetails !== '' ? '<dt>Details</dt><dd style="font-weight:400;white-space:pre-line">' . ba_h($jobDetails) . '</dd>' : '')
         . ($photoNote !== '' ? '<dt>Photos</dt><dd style="font-weight:400">' . ba_h($photoNote) . '</dd>' : '')
         . '<dt>Status</dt><dd>' . ($st === 'new' ? '🟡 Waiting for you to confirm' : ($st === 'declined' ? '❌ Declined' : '🟢 Confirmed')) . '</dd></dl>';
$details = $mkDetails($status);

// Distance from home + map + Directions (main page only; never blocks the page)
$where = '';
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' && ($_REQUEST['a'] ?? '') === '') {
  try { $dist = bk_distance($ev); } catch (Throwable $e) { $dist = null; }
  if ($dist) {
    $d = 0.01;
    $where .= '<div class="dist">🚗 <b>' . ba_h($dist['km']) . ' km</b> from home · about <b>' . ba_h($dist['min']) . ' min</b> drive <span>(without traffic)</span></div>'
      . '<iframe class="map" loading="lazy" title="Job location" src="https://www.openstreetmap.org/export/embed.html?bbox='
      . ba_h(sprintf('%F,%F,%F,%F', $dist['lng'] - $d * 2, $dist['lat'] - $d, $dist['lng'] + $d * 2, $dist['lat'] + $d)) . '&layer=mapnik&marker=' . ba_h(sprintf('%F,%F', $dist['lat'], $dist['lng'])) . '"></iframe>';
  }
  if ($addr !== '') $where .= '<a href="' . ba_h(bk_directions_url($addr)) . '" target="_blank" rel="noopener"><button class="w" type="button">🗺️ Directions in Google Maps (live traffic)</button></a>';
}

/** Mark the event confirmed (green) and remember the status. */
function ba_mark(array $ev, array $extra = []): array {
  $priv = $ev['extendedProperties']['private'] ?? [];
  $priv['bkStatus'] = 'confirmed';
  $summary = preg_replace('/^(NEW|CONFIRMED|RESCHEDULED):\s*/', '', (string) ($ev['summary'] ?? ''));
  return ['colorId' => BK_COLOR_CONFIRMED, 'summary' => 'CONFIRMED: ' . $summary, 'extendedProperties' => ['private' => $priv]] + $extra;
}

function ba_send(string $phone, string $template, array $vars): string {
  try { bk_whatsapp($phone, $template, $vars); return ''; }
  catch (Throwable $e) {
    error_log('[booking] whatsapp ' . $template . ': ' . $e->getMessage());
    return '<div class="msg" style="background:#fffbeb;border-color:#fde68a;color:#92400e">⚠️ The WhatsApp message could not be sent (' . ba_h($e->getMessage()) . '). Please message the customer yourself.</div>';
  }
}

$action = (string) ($_REQUEST['a'] ?? '');

// ---- Actions (button presses only) ----
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  // No Origin check here: the page sends no referrer, so browsers send "Origin: null".
  // The signed link code (checked above) is what protects these actions.
  try {
    if ($action === 'confirm') {
      if ($status !== 'new') ba_page('Already confirmed. No new message was sent.', $details, 'ok');
      bk_patch_event($id, ba_mark($ev));
      $warn = ba_send($phone, 'confirmed', [$first, $date, $time, $addr]);
      ba_page('✅ Confirmed. The calendar entry is now green' . ($warn ? '.' : ' and the customer got the WhatsApp confirmation.'), $warn . $mkDetails('confirmed'), 'ok');
    }
    if ($action === 'decline') {
      // Second step required: the first Decline press only opens the "Are you sure?" page
      if (($_POST['sure'] ?? '') !== 'yes') { header('Location: ' . $self . '&a=decline', true, 303); exit; }
      bk_delete_event($id);
      $warn = ba_send($phone, 'cancelled', [$first, $date, $time]);
      ba_page('❌ Declined. Removed from the calendar' . ($warn ? '.' : ' and the customer got the WhatsApp cancellation.'), $warn . $mkDetails('declined'), 'warn');
    }
    if ($action === 'reschedule') {
      $win = bk_window((string) ($_POST['date'] ?? ''), (string) ($_POST['start'] ?? ''));
      if (!$win) ba_page('Please pick a new time.', '<p><a href="' . ba_h($self) . '&a=reschedule">Go back</a></p>', 'bad');
      [$ns, $ne] = $win;
      if (!bk_window_bookable($ns, true)) ba_page('That time has already passed. Pick another one.', '<p><a href="' . ba_h($self) . '&a=reschedule">Go back</a></p>', 'bad');
      if (bk_overlaps($ns, $ne, bk_busy($ns->modify('-1 minute'), $ne->modify('+1 minute')))) {
        ba_page('That time is already taken. Pick another one.', '<p><a href="' . ba_h($self) . '&a=reschedule">Go back</a></p>', 'bad');
      }
      bk_patch_event($id, ba_mark($ev, [
        'start' => ['dateTime' => $ns->format(DATE_RFC3339), 'timeZone' => BK_TZ],
        'end' => ['dateTime' => $ne->format(DATE_RFC3339), 'timeZone' => BK_TZ],
      ]));
      [$nd, $nt] = bk_when_parts($ns);
      $warn = ba_send($phone, 'rescheduled', [$first, $nd, $nt, $addr]);
      ba_page('🔁 Moved to ' . $nd . ', ' . $nt . '. The calendar entry is green' . ($warn ? '.' : ' and the customer got the WhatsApp message.'), $warn, 'ok');
    }
  } catch (Throwable $e) {
    error_log('[booking] action ' . $action . ': ' . $e->getMessage());
    ba_page('Something went wrong. Nothing was sent to the customer.', '<p>' . ba_h($e->getMessage()) . '</p><p><a href="' . ba_h($self) . '">Try again</a></p>', 'bad');
  }
  ba_page('Unknown action.', '', 'bad');
}

// ---- Decline: ask "Are you sure?" first ----
if ($action === 'decline') {
  ba_page('Are you sure you want to decline this appointment?', $details
    . '<p style="color:#991b1b;font-weight:600">It will be removed from the calendar and the customer will get a WhatsApp cancellation message. This cannot be undone.</p>'
    . '<a href="' . ba_h($self) . '"><button class="g" type="button">↩️ No, keep this booking</button></a>'
    . '<form method="post" action="' . ba_h($self) . '" onsubmit="this.querySelector(\'button\').disabled=true">'
    . '<input type="hidden" name="a" value="decline"><input type="hidden" name="sure" value="yes">'
    . '<button class="r" type="submit">❌ Yes, decline and cancel</button></form>', 'warn');
}

// ---- Pick a new time ----
if ($action === 'reschedule') {
  // Owner view: also shows short-notice open times (e.g. later today), not only 12+ hours ahead
  try { $days = bk_slots(true); } catch (Throwable $e) { $days = []; }
  $opts = '';
  foreach ($days as $d) {
    $label = (new DateTimeImmutable($d['date'], bk_tz()))->format('D, M j');
    foreach ($d['windows'] as $w) if ($w['available']) $opts .= '<option value="' . ba_h($d['date'] . '|' . $w['start']) . '">' . ba_h($label . ', ' . $w['label']) . '</option>';
  }
  if ($opts === '') ba_page('No open times in the next 2 weeks.', '<p>Call the customer to set a time: <a href="tel:' . ba_h(bk_e164($phone)) . '">' . ba_h($phone) . '</a></p>', 'warn');
  ba_page('Change the time', $details
    . '<form method="post" action="' . ba_h($self) . '" onsubmit="var v=this.slot.value.split(\'|\');this.date.value=v[0];this.start.value=v[1];this.querySelector(\'button\').disabled=true">'
    . '<input type="hidden" name="a" value="reschedule"><input type="hidden" name="date"><input type="hidden" name="start">'
    . '<select name="slot" required>' . $opts . '</select>'
    . '<button class="b" type="submit">🔁 Move booking and send WhatsApp</button></form>'
    . '<p class="small"><a href="' . ba_h($self) . '">← Back</a></p>');
}

// ---- Main page ----
$btn = fn($a, $cls, $label, $confirm = '') => '<form method="post" action="' . ba_h($self) . '"' . ($confirm ? ' onsubmit="return confirm(\'' . $confirm . '\')"' : '')
  . '><input type="hidden" name="a" value="' . $a . '"><button class="' . $cls . '" type="submit">' . $label . '</button></form>';
ba_page('Online booking', $details . $where . '<hr style="border:0;border-top:1px solid #e5e7eb;margin:16px 0 6px">'
  . ($status === 'new' ? $btn('confirm', 'g', '✅ Confirm and send WhatsApp') : '')
  . '<a href="' . ba_h($self) . '&a=reschedule"><button class="b" type="button">🔁 Change time</button></a>'
  . '<a href="' . ba_h($self) . '&a=decline"><button class="r" type="button">❌ Decline / cancel</button></a>'
  . '<p class="small">The customer gets the WhatsApp message from ' . ba_h(BK_TWILIO_FROM) . '.</p>');
