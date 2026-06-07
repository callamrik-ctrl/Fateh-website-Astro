# Fateh Contractor Job Portal Setup

This private contractor job portal lives at:

`/contractor-job-portal.html`

The old `/worker-check-in.html` URL redirects to the new contractor portal URL so older private links do not break.

It is intentionally not linked in the public menu and includes `noindex,nofollow`.

## Google Sheet Tabs

Create or import a Google Sheet with these two tabs:

### Contractor Job Entries

Headers:

`Timestamp, Contractor Name, PIN, Customer Name, Job Address, Job Type, Payment Received, Payment Type, Contractor Amount, Notes, Page URL, User Agent, Status, Admin Notes`

### Contractors

Headers:

`PIN, Contractor Name, Status, Notes`

Contractor rows should use `Active` in the Status column. Use `Inactive` or `Paused` to stop a PIN from working.

## Apps Script

Copy `docs/google-apps-script-worker-checkins.js` into Google Apps Script.

The contractor job portal sheet is:

`https://docs.google.com/spreadsheets/d/1Q-zhxZojqNEzfYXQQpEUtTAQ-YAwF8PH1d57rTEAmCI/edit`

Set these two values at the top:

```js
const SPREADSHEET_ID = "1Q-zhxZojqNEzfYXQQpEUtTAQ-YAwF8PH1d57rTEAmCI";
const NOTIFICATION_EMAIL = "info@fatehplumelec.com";
```

Run `setupContractorJobPortalSheets()` once. It only creates missing headers and does not overwrite manual entries.

The old helper name `setupWorkerCheckinSheets()` still works as an alias.

Deploy as a Web App:

- Execute as: Me
- Who has access: Anyone

Copy the Web App URL and paste it into:

`public/worker-checkin-config.js`

```js
window.FATEH_WORKER_CHECKIN_ENDPOINT = "https://script.google.com/macros/s/AKfycbx-s3vu2YJEAnht0gFKRMlLDpEIC8APj00buiQlKwo-n9X0V6KKzqEZtPNM0uTb1btj_Q/exec";
```

## Google Address Autocomplete

The address field works as a normal manual address field by default.

To enable Google-style address suggestions, add a Google Maps Places API key in:

`public/worker-checkin-config.js`

```js
window.FATEH_GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_PLACES_API_KEY";
```

Keep the key restricted in Google Cloud for your website domain.

## Testing

Use the sample PIN `1111` only for preview testing. Replace it with real contractor PINs before sharing the page.
