<?php
// POST /api/apply.php → job application from /careers.html.
// Saves one row to the "Fateh Job Applications (Website)" Google Sheet, keeps the resume
// in a private folder OUTSIDE the website (link in the sheet works only with a secret key),
// emails the owner (resume attached) and sends the applicant a thank-you email.
require __DIR__ . '/_booking.php';

const JA_SHEET_ID  = '1bsw_HJfD3DMdlSrAzQ2M-QJidnsbHqACW7ynVO0EYDA'; // owned by callamrik@gmail.com, service account = Editor
const JA_SHEET_TAB = 'Applications';
const JA_MAX_RESUME = 5 * 1024 * 1024;
const JA_RESUME_TYPES = ['pdf' => 'application/pdf', 'doc' => 'application/msword',
  'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png'];
const JA_ROLES = ['Plumbing', 'Electrical', 'Co-op student'];

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') bk_json(['ok' => false, 'error' => 'Method not allowed'], 405);
if (!bk_origin_ok()) bk_json(['ok' => false, 'error' => 'Not allowed'], 403);
// Bot trap + too-fast submits: pretend it worked
if (!empty($_POST['website'])) bk_json(['ok' => true]);
if ((int) ($_POST['elapsed'] ?? 99) < 5) bk_json(['ok' => true]);

$p = fn(string $k, int $max = 200) => mb_substr(trim(preg_replace('/\s+/', ' ', (string) ($_POST[$k] ?? ''))), 0, $max);
$a = [];
foreach (['role', 'name', 'phone', 'email', 'address', 'city', 'postal', 'workAuth', 'adult', 'licence', 'transport', 'level',
          'years', 'workType', 'fullPart', 'startDate', 'pay', 'employer', 'position', 'empFrom', 'empTo', 'supervisor',
          'school', 'program', 'teacher', 'placeStart', 'placeEnd', 'hours', 'heard'] as $k) $a[$k] = $p($k);
$a['about'] = mb_substr(trim((string) ($_POST['about'] ?? '')), 0, 1500);
$a['days'] = implode(', ', array_slice(array_map(fn($d) => mb_substr(trim((string) $d), 0, 10), (array) ($_POST['days'] ?? [])), 0, 7));
$a['languages'] = implode(', ', array_slice(array_map(fn($d) => mb_substr(trim((string) $d), 0, 20), (array) ($_POST['languages'] ?? [])), 0, 6));

$e = [];
if (!in_array($a['role'], JA_ROLES, true)) $e['role'] = 'Choose what you are applying for.';
if (mb_strlen($a['name']) < 3) $e['name'] = 'Enter your full name.';
$digits = preg_replace('/\D/', '', $a['phone']);
if (strlen($digits) === 11 && $digits[0] === '1') $digits = substr($digits, 1);
if (strlen($digits) !== 10) $e['phone'] = 'Enter a 10-digit phone number.';
else $a['phone'] = substr($digits, 0, 3) . '-' . substr($digits, 3, 3) . '-' . substr($digits, 6);
if (!filter_var($a['email'], FILTER_VALIDATE_EMAIL)) $e['email'] = 'Enter a valid email.';
if (mb_strlen($a['address']) < 5) $e['address'] = 'Enter your home address.';
if ($a['workAuth'] === '') $e['workAuth'] = 'Please answer this.';
if ($a['role'] !== 'Co-op student') {
  if ($a['adult'] === '') $e['adult'] = 'Please answer this.';
  if ($a['level'] === '') $e['level'] = 'Choose your level.';
} else {
  if ($a['school'] === '') $e['school'] = 'Enter your school or college.';
}
if (empty($_POST['consent'])) $e['consent'] = 'Please tick the box to continue.';

// Resume (optional)
$resume = null;
$f = $_FILES['resume'] ?? null;
if ($f && ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
  $ext = strtolower(pathinfo((string) $f['name'], PATHINFO_EXTENSION));
  if ($f['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) $e['resume'] = 'The resume did not upload. Please try again.';
  elseif ($f['size'] > JA_MAX_RESUME) $e['resume'] = 'Resume must be under 5 MB.';
  elseif (!isset(JA_RESUME_TYPES[$ext])) $e['resume'] = 'Upload a PDF, Word or photo file.';
  else $resume = [$ext, (string) file_get_contents($f['tmp_name'])];
}

if ($e) bk_json(['ok' => false, 'error' => 'Please fix the highlighted fields.', 'fields' => $e], 422);
if (bk_rate_limited()) bk_json(['ok' => false, 'error' => 'Too many applications from this connection. Please try again later.'], 429);

$id = 'JA-' . (new DateTimeImmutable('now', bk_tz()))->format('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));

// Keep the resume outside the public website folder; the sheet gets a signed download link
$resumeCell = '';
if ($resume) {
  $doc = rtrim($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__), '/');
  $dir = dirname($doc) . '/job-applications';
  if (!is_dir($dir)) @mkdir($dir, 0700, true);
  $file = $id . '.' . $resume[0];
  if (@file_put_contents("$dir/$file", $resume[1]) !== false) {
    $k = bk_load_key();
    $sig = substr(hash_hmac('sha256', $file, (string) ($k['private_key'] ?? 'x')), 0, 24);
    $resumeCell = BK_SITE . '/api/resume.php?f=' . rawurlencode($file) . '&k=' . $sig;
  } else {
    $resumeCell = 'Emailed to ' . BK_NOTIFY_TO;
  }
}

$isCoop = $a['role'] === 'Co-op student';
$row = [
  (new DateTimeImmutable('now', bk_tz()))->format('Y-m-d H:i'), 'New', $a['role'], $a['name'], $a['phone'], $a['email'],
  $a['address'], $a['city'], $a['postal'], $a['workAuth'], $isCoop ? '' : $a['adult'], $a['licence'], $a['transport'],
  $isCoop ? '' : $a['level'], $isCoop ? '' : $a['years'], $isCoop ? '' : $a['workType'], $a['days'], $a['fullPart'],
  $a['startDate'], $isCoop ? '' : $a['pay'], $a['employer'], $a['position'], $a['empFrom'], $a['empTo'], $a['supervisor'],
  $isCoop ? $a['school'] : '', $isCoop ? $a['program'] : '', $isCoop ? $a['teacher'] : '', $isCoop ? $a['placeStart'] : '',
  $isCoop ? $a['placeEnd'] : '', $isCoop ? $a['hours'] : '', $a['languages'], $a['heard'], $resumeCell, $a['about'], $id,
];
// Stop a cell from being read as a formula
$row = array_map(fn($v) => preg_match('/^[=+\-@]/', (string) $v) ? "'" . $v : $v, $row);

$saved = false;
try {
  if (bk_mock()) { @file_put_contents(sys_get_temp_dir() . '/ja_mock_rows.log', json_encode($row) . "\n", FILE_APPEND); $saved = true; }
  else {
    $url = 'https://sheets.googleapis.com/v4/spreadsheets/' . rawurlencode(JA_SHEET_ID) . '/values/'
         . rawurlencode(JA_SHEET_TAB . '!A1') . ':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS';
    $r = bk_api('POST', $url, ['values' => [$row]]);
    $saved = !empty($r['updates']);
  }
} catch (Throwable $t) { $saved = false; }

// Email the owner (always, so nothing is lost if the sheet is down)
$lines = ["New job application ($id)" . ($saved ? '' : ' – NOT saved to the sheet, please add it by hand'), ''];
$heads = ['Applying for', 'Full name', 'Phone', 'Email', 'Address', 'City', 'Postal code', 'Legally entitled to work', '18 or older',
  "Driver's licence", 'Can get to job sites', 'Level', 'Years of experience', 'Residential / commercial', 'Days available', 'Full / part time',
  'Can start', 'Expected pay ($/hr)', 'Last employer', 'Position', 'Worked from', 'Worked to', 'Supervisor & phone', 'School / college',
  'Program', 'Teacher / co-op contact', 'Placement start', 'Placement end', 'Hours per week', 'Languages', 'How they heard about us', 'Resume', 'About'];
foreach (array_slice($row, 2, 33) as $i => $v) if ((string) $v !== '') $lines[] = $heads[$i] . ': ' . $v;
$lines[] = ''; $lines[] = 'All applications: https://docs.google.com/spreadsheets/d/' . JA_SHEET_ID . '/edit';
$att = $resume ? [[$id . '-resume.' . $resume[0], JA_RESUME_TYPES[$resume[0]], $resume[1]]] : [];
bk_mail(BK_NOTIFY_TO, 'New job application – ' . $a['role'] . ' – ' . $a['name'], implode("\n", $lines), $att, $a['email']);

// Thank-you email to the applicant
$first = explode(' ', $a['name'])[0];
bk_mail($a['email'], 'We received your application – ' . BK_BUSINESS, implode("\n", [
  "Hi $first,", '',
  'Thank you for applying to ' . BK_BUSINESS . '. We have received your information.', '',
  'Your application is saved in our file. When a position that fits your experience opens up, we will contact you by phone or email.', '',
  'Reference: ' . $id, '',
  'Thank you,', BK_BUSINESS, BK_PHONE . ' · ' . BK_SITE,
]), [], BK_NOTIFY_TO);

bk_json(['ok' => true, 'id' => $id]);
