<?php
// POST /api/book.php → checks the form, re-checks the time is still free,
// adds the job to Google Calendar, and emails the business + the customer.
require __DIR__ . '/_booking.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') bk_json(['ok' => false, 'error' => 'Method not allowed'], 405);
if (!bk_origin_ok()) bk_json(['ok' => false, 'error' => 'Not allowed'], 403);

// Bot trap: real people never fill the hidden "website" field
if (!empty($_POST['website'])) bk_json(['ok' => true, 'fake' => true]);

[$b, $errors] = bk_validate($_POST);

$win = bk_window($b['date'], $b['start']);
if (!$win || !bk_window_bookable($win[0])) $errors['slot'] = 'Pick an available arrival window.';

try { $photos = bk_photos(); } catch (InvalidArgumentException $e) { $errors['photos'] = $e->getMessage(); $photos = []; }

if ($errors) bk_json(['ok' => false, 'error' => 'Please fix the highlighted fields.', 'fields' => $errors], 422);
if (bk_rate_limited()) bk_json(['ok' => false, 'error' => 'Too many bookings from this connection. Please call ' . BK_PHONE . '.'], 429);

[$start, $end, $label] = $win;
$b['photoCount'] = count($photos);

try {
  // Someone may have taken this window a moment ago
  if (bk_overlaps($start, $end, bk_busy($start->modify('-1 minute'), $end->modify('+1 minute')))) {
    bk_json(['ok' => false, 'error' => 'Sorry, that time was just taken. Please pick another window.', 'fields' => ['slot' => 'Just taken. Please pick another.'], 'refresh' => true], 409);
  }
  $event = bk_create_event($b, $start, $end);
} catch (Throwable $e) {
  error_log('[booking] book: ' . $e->getMessage());
  bk_json(['ok' => false, 'error' => 'We could not save your booking. Please call ' . BK_PHONE . '.'], 503);
}

$when = $start->format('l, F j') . ', ' . $label;
$addr = $b['address'] . ($b['unit'] ? ', ' . $b['unit'] : '') . ', ' . $b['city'] . ', ON ' . $b['postal'];

// Confirm / Change time / Decline link for the owner (needs booking-private/twilio.json)
$manage = '';
try { $manage = bk_action_url((string) ($event['id'] ?? '')); } catch (Throwable $e) { error_log('[booking] link: ' . $e->getMessage()); }

// WhatsApp alert to the business number. A failed alert does not undo the booking.
if ($manage && BK_WA_TEMPLATES['owner_alert'] !== '') {
  try {
    bk_whatsapp(BK_OWNER_WHATSAPP, 'owner_alert', [$b['firstName'] . ' ' . $b['lastName'], $b['phone'], $when, $addr, $b['service'], bk_link_code((string) $event['id'])]);
  } catch (Throwable $e) { error_log('[booking] owner alert: ' . $e->getMessage()); }
}

// SMS alert with the link (works without Meta approval). A failed SMS does not undo the booking,
// but the reason is shown at the top of the owner email.
$smsNote = '';
if ($manage) {
  try {
    bk_sms(BK_OWNER_SMS, 'New booking: ' . $b['firstName'] . ' ' . $b['lastName'] . ', ' . str_replace('–', '-', $when) . ', ' . $b['service'] . ' (' . $b['city'] . '). Confirm / change / decline: ' . $manage);
  } catch (Throwable $e) {
    error_log('[booking] owner sms: ' . $e->getMessage());
    $smsNote = 'Note: the SMS alert to ' . BK_OWNER_SMS . ' failed: ' . $e->getMessage();
  }
}

// Email to the business (with photos). A failed email does not undo the booking.
$ownerLines = [
  'When: ' . $when,
  'Customer: ' . $b['firstName'] . ' ' . $b['lastName'],
  'Phone: ' . $b['phone'],
  'Email: ' . $b['email'],
  'Address: ' . $addr,
  'Service: ' . $b['service'],
];
$e = fn($v) => htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8');
$ownerHtml = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#111827;max-width:560px">'
  . ($smsNote ? '<p style="background:#fffbeb;border:1px solid #fde68a;padding:10px;border-radius:8px;color:#92400e">⚠️ ' . $e($smsNote) . '</p>' : '')
  . '<p>New booking from the website form. It is on the calendar (<b>yellow</b>).</p>'
  . ($manage ? '<p><a href="' . $e($manage) . '" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:8px">Open booking: Confirm / Change time / Decline</a></p>' : '')
  . '<p>' . implode('<br>', array_map($e, $ownerLines)) . '</p>'
  . '<p><b>Details:</b><br>' . nl2br($e($b['details'])) . '</p>'
  . '<p>' . ($photos ? count($photos) . ' photo(s) attached.' : 'No photos.') . '</p></div>';

bk_mail(BK_NOTIFY_TO, 'New online booking: ' . $when . ' – ' . $b['firstName'] . ' ' . $b['lastName'], implode("\n", array_merge(
  $smsNote ? [$smsNote, ''] : [],
  ['New booking from the website form. It is on the calendar (yellow).', ''],
  $manage ? ['Confirm, change the time or decline (the customer gets a WhatsApp message):', $manage, ''] : ['Confirm with the customer by text.', ''],
  $ownerLines,
  ['', 'Details:', $b['details'], '', $photos ? count($photos) . ' photo(s) attached.' : 'No photos.']
)), $photos, $b['email'], $ownerHtml);

// Confirmation to the customer
bk_mail($b['email'], 'We received your request (not confirmed yet) – ' . BK_BUSINESS, implode("\n", [
  'Hi ' . $b['firstName'] . ',',
  '',
  'Thanks for choosing ' . BK_BUSINESS . '. We received your service request. It is not confirmed yet.',
  '',
  'Requested time: ' . $when . ' (2-hour arrival window)',
  'Address: ' . $addr,
  'Service: ' . $b['service'],
  '',
  'Next step: we will review your request and confirm your visit shortly by WhatsApp at ' . $b['phone'] . ' (or by text message if you do not use WhatsApp). If that time does not work for us, we will offer you a new time.',
  '',
  'Need to change something? Call or text ' . BK_PHONE . '.',
  '',
  BK_BUSINESS,
  'fatehplumelec.com',
]), [], BK_NOTIFY_TO);

bk_json(['ok' => true, 'when' => $when, 'address' => $addr]);
