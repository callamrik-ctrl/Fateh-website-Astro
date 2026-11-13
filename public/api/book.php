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
  bk_create_event($b, $start, $end);
} catch (Throwable $e) {
  error_log('[booking] book: ' . $e->getMessage());
  bk_json(['ok' => false, 'error' => 'We could not save your booking. Please call ' . BK_PHONE . '.'], 503);
}

$when = $start->format('l, F j') . ', ' . $label;
$addr = $b['address'] . ($b['unit'] ? ', ' . $b['unit'] : '') . ', ' . $b['city'] . ', ON ' . $b['postal'];

// Email to the business (with photos). A failed email does not undo the booking.
bk_mail(BK_NOTIFY_TO, 'New online booking: ' . $when . ' – ' . $b['firstName'] . ' ' . $b['lastName'], implode("\n", [
  'New booking from the website form. It is on the calendar (yellow).',
  '',
  'When: ' . $when,
  'Customer: ' . $b['firstName'] . ' ' . $b['lastName'],
  'Phone: ' . $b['phone'],
  'Email: ' . $b['email'],
  'Address: ' . $addr,
  'Service: ' . $b['service'],
  '',
  'Details:',
  $b['details'],
  '',
  $photos ? count($photos) . ' photo(s) attached.' : 'No photos.',
]), $photos, $b['email']);

// Confirmation to the customer
bk_mail($b['email'], 'Your service visit request – ' . BK_BUSINESS, implode("\n", [
  'Hi ' . $b['firstName'] . ',',
  '',
  'Thanks for booking with ' . BK_BUSINESS . '. We received your request:',
  '',
  'When: ' . $when . ' (2-hour arrival window)',
  'Address: ' . $addr,
  'Service: ' . $b['service'],
  '',
  'We will text you at ' . $b['phone'] . ' to confirm. If we are arriving earlier or later within the day, we will text you.',
  '',
  'Need to change something? Call or text ' . BK_PHONE . '.',
  '',
  BK_BUSINESS,
  'fatehplumelec.com',
]), [], BK_NOTIFY_TO);

bk_json(['ok' => true, 'when' => $when, 'address' => $addr]);
