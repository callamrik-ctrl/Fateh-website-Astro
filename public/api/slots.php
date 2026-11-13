<?php
// GET /api/slots.php → open 2-hour arrival windows for the next 14 days, read from Google Calendar.
require __DIR__ . '/_booking.php';

try {
  bk_json(['ok' => true, 'days' => bk_slots()]);
} catch (Throwable $e) {
  error_log('[booking] slots: ' . $e->getMessage());
  bk_json(['ok' => false, 'error' => 'Online booking is not available right now. Please call ' . BK_PHONE . '.'], 503);
}
