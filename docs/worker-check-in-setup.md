# Fateh Contractor Job Portal Setup

This private contractor job portal lives at:

`/contractor-job-portal.html`

The old `/worker-check-in.html` URL redirects to the new contractor portal URL so older private links do not break.

It is intentionally not linked in the public menu and includes `noindex,nofollow`.

## Google Sheet Tabs

Create or import a Google Sheet with these tabs. The setup function creates missing tabs and headers only.

### Contractor Job Entries

Headers:

`Timestamp, Contractor Name, PIN, Customer Name, Job Address, Job Type, Payment Received, Payment Type, Contractor Amount, Notes, Page URL, User Agent, Status, Admin Notes, Confirmation Number`

This tab keeps every contractor entry together in one place.

### Contractors

Headers:

`PIN, Contractor Name, Status, Notes`

Contractor rows should use `Active` in the Status column. Use `Inactive` or `Paused` to stop a PIN from working.

### Contractor Summary

Headers:

`Contractor Name, Total Jobs, Total Payment Received, Total Contractor Amount, Cash Received, Transfer Received, Machine Received, Last Entry`

This tab is rebuilt from the main entries after each new submission so totals stay easy to check.

### Per-Contractor Tabs

When a contractor submits a job, the script also creates or updates a separate tab named like:

`Contractor - Contractor Name`

Each contractor tab uses the same headers as `Contractor Job Entries`, so each person's work stays easy to review.

If an older `Worker Check-ins` tab still exists from testing, the current portal does not need it. After one new test entry appears in `Contractor Job Entries`, you can delete the old `Worker Check-ins` tab if you do not need those sample rows.

## Apps Script

Copy `docs/google-apps-script-worker-checkins.js` into Google Apps Script.

The contractor job portal sheet is:

`https://docs.google.com/spreadsheets/d/1Q-zhxZojqNEzfYXQQpEUtTAQ-YAwF8PH1d57rTEAmCI/edit`

Set these two values at the top:

```js
const SPREADSHEET_ID = "1Q-zhxZojqNEzfYXQQpEUtTAQ-YAwF8PH1d57rTEAmCI";
const NOTIFICATION_EMAIL = "info@fatehplumelec.com";
```

Run `setupContractorJobPortalSheets()` once. It creates missing tabs and headers, adds the confirmation number column, and formats payment columns as dollars. It does not overwrite manual job entries or contractor rows.

The old helper name `setupWorkerCheckinSheets()` still works as an alias.

Deploy as a Web App:

- Execute as: Me
- Who has access: Anyone

After editing an existing Apps Script deployment, use `Deploy > Manage deployments > Edit > Version > New version > Deploy`. Saving the code alone does not update the live web app URL.

Copy the Web App URL and paste it into:

`public/worker-checkin-config.js`

```js
window.FATEH_WORKER_CHECKIN_ENDPOINT = "https://script.google.com/macros/s/AKfycbx-s3vu2YJEAnht0gFKRMlLDpEIC8APj00buiQlKwo-n9X0V6KKzqEZtPNM0uTb1btj_Q/exec";
```

## Google Address Autocomplete

The address field works as a normal manual address field by default.

To enable Google-style address suggestions, create a Google Maps Platform API key with Places API enabled, then add it in:

`public/worker-checkin-config.js`

```js
window.FATEH_GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_PLACES_API_KEY";
```

Keep the key restricted in Google Cloud for your website domain:

- `https://fatehplumelec.com/*`
- `http://localhost:4321/*` for local testing if needed

If this key is blank, the address field will still work, but Google address suggestions will not appear.

## Testing

Use the sample PIN `1111` only for preview testing. Replace it with real contractor PINs before sharing the page.
