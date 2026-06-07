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
const SUMMARY_SHEET = "Contractor Summary";
const CONTRACTOR_SHEET_PREFIX = "Contractor - ";

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
  "Admin Notes",
  "Confirmation Number"
];

const WORKER_HEADERS = [
  "PIN",
  "Contractor Name",
  "Status",
  "Notes"
];

const SUMMARY_HEADERS = [
  "Contractor Name",
  "Total Jobs",
  "Total Payment Received",
  "Total Contractor Amount",
  "Cash Received",
  "Transfer Received",
  "Machine Received",
  "Last Entry"
];

function setupContractorJobPortalSheets() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const checkinsSheet = ensureSheet_(spreadsheet, CHECKINS_SHEET, CHECKIN_HEADERS);
  ensureSheet_(spreadsheet, WORKERS_SHEET, WORKER_HEADERS);
  const summarySheet = ensureSheet_(spreadsheet, SUMMARY_SHEET, SUMMARY_HEADERS);
  formatCheckinMoneyColumns_(checkinsSheet);
  formatSummaryMoneyColumns_(summarySheet);

  spreadsheet.getSheets().forEach((sheet) => {
    if (sheet.getName().indexOf(CONTRACTOR_SHEET_PREFIX) === 0) {
      ensureSheet_(spreadsheet, sheet.getName(), CHECKIN_HEADERS);
      formatCheckinMoneyColumns_(sheet);
    }
  });
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
  const contractorSheet = ensureSheet_(spreadsheet, contractorSheetName_(worker.workerName), CHECKIN_HEADERS);
  const submittedAt = new Date();
  const confirmationNumber = String(payload.confirmationNumber || generateConfirmationNumber_()).trim();
  const paymentReceived = parseMoney_(payload.paymentReceived);
  const contractorAmount = payload.workerJobCost === "" || payload.workerJobCost == null
    ? ""
    : parseMoney_(payload.workerJobCost);
  const row = [
    submittedAt,
    worker.workerName,
    payload.pin || "",
    payload.customerName || "",
    payload.jobAddress || "",
    payload.jobType || "",
    paymentReceived,
    payload.paymentType || "Cash",
    contractorAmount,
    payload.notes || "",
    payload.pageUrl || "",
    payload.userAgent || "",
    "New",
    "",
    confirmationNumber
  ];

  sheet.appendRow(row);
  contractorSheet.appendRow(row);
  formatCheckinMoneyColumns_(sheet);
  formatCheckinMoneyColumns_(contractorSheet);
  updateContractorSummary_(spreadsheet);

  const subject = "New contractor job entry " + confirmationNumber;
  const body = [
    "A contractor submitted a job entry.",
    "",
    "Confirmation: " + confirmationNumber,
    "Contractor: " + worker.workerName,
    "Customer name: " + (payload.customerName || ""),
    "Job address: " + (payload.jobAddress || ""),
    "Job type: " + (payload.jobType || ""),
    "Payment received: " + formatMoneyText_(paymentReceived),
    "Payment type: " + (payload.paymentType || "Cash"),
    "Contractor amount: " + (contractorAmount === "" ? "" : formatMoneyText_(contractorAmount)),
    "",
    "Notes:",
    payload.notes || "",
    "",
    "Spreadsheet:",
    "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID
  ].join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);

  return json_({
    ok: true,
    confirmationNumber: confirmationNumber,
    workerName: worker.workerName
  });
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
  } else {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function updateContractorSummary_(spreadsheet) {
  const entriesSheet = ensureSheet_(spreadsheet, CHECKINS_SHEET, CHECKIN_HEADERS);
  const summarySheet = ensureSheet_(spreadsheet, SUMMARY_SHEET, SUMMARY_HEADERS);
  const rows = entriesSheet.getDataRange().getValues();
  const summary = {};

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const contractorName = String(row[1] || "").trim();
    if (!contractorName) continue;

    if (!summary[contractorName]) {
      summary[contractorName] = {
        jobs: 0,
        paymentReceived: 0,
        contractorAmount: 0,
        cash: 0,
        transfer: 0,
        machine: 0,
        lastEntry: row[0] || ""
      };
    }

    const item = summary[contractorName];
    const payment = parseMoney_(row[6]);
    const contractorAmount = parseMoney_(row[8]);
    const paymentType = String(row[7] || "").toLowerCase();

    item.jobs += 1;
    item.paymentReceived += payment;
    item.contractorAmount += contractorAmount;
    if (paymentType.indexOf("transfer") !== -1) item.transfer += payment;
    else if (paymentType.indexOf("machine") !== -1 || paymentType.indexOf("interac") !== -1) item.machine += payment;
    else item.cash += payment;
    item.lastEntry = row[0] || item.lastEntry;
  }

  const names = Object.keys(summary).sort();
  const values = names.map((name) => [
    name,
    summary[name].jobs,
    summary[name].paymentReceived,
    summary[name].contractorAmount,
    summary[name].cash,
    summary[name].transfer,
    summary[name].machine,
    summary[name].lastEntry
  ]);

  if (summarySheet.getLastRow() > 1) {
    summarySheet.getRange(2, 1, summarySheet.getLastRow() - 1, SUMMARY_HEADERS.length).clearContent();
  }

  if (values.length) {
    summarySheet.getRange(2, 1, values.length, SUMMARY_HEADERS.length).setValues(values);
    formatSummaryMoneyColumns_(summarySheet);
  }
}

function formatCheckinMoneyColumns_(sheet) {
  const rows = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, 7, rows, 1).setNumberFormat("$#,##0.00");
  sheet.getRange(2, 9, rows, 1).setNumberFormat("$#,##0.00");
}

function formatSummaryMoneyColumns_(sheet) {
  const rows = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, 3, rows, 5).setNumberFormat("$#,##0.00");
}

function generateConfirmationNumber_() {
  return "FJ-" + Utilities.getUuid().replace(/-/g, "").slice(0, 8).toUpperCase();
}

function formatMoneyText_(value) {
  const number = parseMoney_(value);
  return "$" + number.toFixed(2);
}

function contractorSheetName_(contractorName) {
  const cleanName = String(contractorName || "Unknown")
    .replace(/[\\/?*\[\]:]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 70);
  return (CONTRACTOR_SHEET_PREFIX + (cleanName || "Unknown")).slice(0, 95);
}

function parseMoney_(value) {
  const number = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
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
