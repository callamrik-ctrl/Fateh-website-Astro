// Fateh Plumbing & Electric contractor job portal Google Apps Script.
//
// Setup:
// 1. Create a Google Sheet for contractor job entries.
// 2. Paste that sheet ID below.
// 3. Paste this whole file into Apps Script.
// 4. Run setupContractorJobPortalSheets once.
// 5. Add contractor PINs and names in the Contractors tab.
// 6. Deploy as Web App: Execute as Me, Who has access: Anyone.
// 7. Paste the Web App URL into public/worker-checkin-config.js.

const SPREADSHEET_ID = "1Q-zhxZojqNEzfYXQQpEUtTAQ-YAwF8PH1d57rTEAmCI";
const NOTIFICATION_EMAIL = "info@fatehplumelec.com";
const CHECKINS_SHEET = "Contractor Job Entries";
const WORKERS_SHEET = "Contractors";

const CHECKIN_HEADERS = [
  "Timestamp",
  "Contractor Name",
  "PIN",
  "Customer Name",
  "Job Address",
  "Job Type",
  "Payment Received",
  "Payment Type",
  "Contractor Amount",
  "Notes",
  "Page URL",
  "User Agent",
  "Status",
  "Admin Notes"
];

const WORKER_HEADERS = [
  "PIN",
  "Contractor Name",
  "Status",
  "Notes"
];

function setupContractorJobPortalSheets() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureSheet_(spreadsheet, CHECKINS_SHEET, CHECKIN_HEADERS);
  ensureSheet_(spreadsheet, WORKERS_SHEET, WORKER_HEADERS);
}

function setupWorkerCheckinSheets() {
  setupContractorJobPortalSheets();
}

function doGet(event) {
  const params = event && event.parameter ? event.parameter : {};
  const callback = safeCallback_(params.callback || "callback");
  let result = { ok: false, message: "Unknown request" };

  if (params.action === "worker") {
    result = findWorkerByPin_(params.pin || "");
  }

  return ContentService
    .createTextOutput(callback + "(" + JSON.stringify(result) + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(event) {
  const payload = JSON.parse((event.postData && event.postData.contents) || "{}");
  const worker = findWorkerByPin_(payload.pin || "");

  if (!worker.ok) {
    return json_({ ok: false, message: "Invalid or inactive contractor PIN" });
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ensureSheet_(spreadsheet, CHECKINS_SHEET, CHECKIN_HEADERS);
  const submittedAt = new Date();

  sheet.appendRow([
    submittedAt,
    worker.workerName,
    payload.pin || "",
    payload.customerName || "",
    payload.jobAddress || "",
    payload.jobType || "",
    payload.paymentReceived || "",
    payload.paymentType || "Cash",
    payload.workerJobCost || "",
    payload.notes || "",
    payload.pageUrl || "",
    payload.userAgent || "",
    "New",
    ""
  ]);

  const subject = "New contractor job entry";
  const body = [
    "A contractor submitted a job entry.",
    "",
    "Contractor: " + worker.workerName,
    "Customer name: " + (payload.customerName || ""),
    "Job address: " + (payload.jobAddress || ""),
    "Job type: " + (payload.jobType || ""),
    "Payment received: " + (payload.paymentReceived || ""),
    "Payment type: " + (payload.paymentType || "Cash"),
    "Contractor amount: " + (payload.workerJobCost || ""),
    "",
    "Notes:",
    payload.notes || "",
    "",
    "Spreadsheet:",
    "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID
  ].join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);

  return json_({ ok: true });
}

function findWorkerByPin_(pin) {
  const cleanPin = String(pin || "").trim();
  if (!cleanPin) return { ok: false, message: "Missing PIN" };

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ensureSheet_(spreadsheet, WORKERS_SHEET, WORKER_HEADERS);
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    const rowPin = String(rows[i][0] || "").trim();
    const workerName = String(rows[i][1] || "").trim();
    const status = String(rows[i][2] || "Active").trim().toLowerCase();

    if (rowPin === cleanPin && workerName && status !== "inactive" && status !== "paused") {
      return { ok: true, workerName: workerName };
    }
  }

  return { ok: false, message: "PIN not found or inactive" };
}

function ensureSheet_(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function safeCallback_(callback) {
  const clean = String(callback || "callback").trim();
  return /^[A-Za-z_$][0-9A-Za-z_$]*(\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(clean)
    ? clean
    : "callback";
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
