# Fateh Worker Check-In Setup

This private worker check-in page lives at:

`/worker-check-in.html`

It is intentionally not linked in the public menu and includes `noindex,nofollow`.

## Google Sheet Tabs

Create or import a Google Sheet with these two tabs:

### Worker Check-ins

Headers:

`Timestamp, Worker Name, PIN, Job Address, Job Type, Payment Received, Payment Type, Worker Job Cost, Notes, Page URL, User Agent, Status, Admin Notes`

### Workers

Headers:

`PIN, Worker Name, Status, Notes`

Worker rows should use `Active` in the Status column. Use `Inactive` or `Paused` to stop a PIN from working.

## Apps Script

Copy `docs/google-apps-script-worker-checkins.js` into Google Apps Script.

The worker sheet is:

`https://docs.google.com/spreadsheets/d/1Q-zhxZojqNEzfYXQQpEUtTAQ-YAwF8PH1d57rTEAmCI/edit`

Set these two values at the top:

```js
const SPREADSHEET_ID = "1Q-zhxZojqNEzfYXQQpEUtTAQ-YAwF8PH1d57rTEAmCI";
const NOTIFICATION_EMAIL = "info@fatehplumelec.com";
```

Run `setupWorkerCheckinSheets()` once. It only creates missing headers and does not overwrite manual entries.

Deploy as a Web App:

- Execute as: Me
- Who has access: Anyone

Copy the Web App URL and paste it into:

`public/worker-checkin-config.js`

```js
window.FATEH_WORKER_CHECKIN_ENDPOINT = "https://script.google.com/macros/s/AKfycbx-s3vu2YJEAnht0gFKRMlLDpEIC8APj00buiQlKwo-n9X0V6KKzqEZtPNM0uTb1btj_Q/exec";
```

## Testing

Use the sample PIN `1111` only for preview testing. Replace it with real worker PINs before sharing the page.
