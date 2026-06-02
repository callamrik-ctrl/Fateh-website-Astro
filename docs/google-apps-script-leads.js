const SPREADSHEET_ID = "1zZ4FXlTk-GdzLintGN5hXwKIlF-WHkHpE0Dpk2jKOFc";
const NOTIFICATION_EMAIL = "info@fatehplumelec.com";

function doPost(event) {
  const payload = JSON.parse(event.postData.contents || "{}");
  const submittedAt = new Date();
  const sourceForm = String(payload.sourceForm || "");
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);

  if (sourceForm === "Newsletter Signup") {
    sheet.getSheetByName("Newsletter Signups").appendRow([
      submittedAt,
      sourceForm,
      payload.name || "",
      payload.email || "",
      payload.pageUrl || "",
      payload.consent || "",
      "New",
      ""
    ]);
  } else {
    sheet.getSheetByName("Contact Leads").appendRow([
      submittedAt,
      sourceForm || "Contact Form",
      payload.name || "",
      payload.phone || "",
      payload.email || "",
      payload.service || "",
      payload.message || "",
      payload.pageUrl || "",
      payload.consent || "",
      "New",
      ""
    ]);
  }

  const subject = sourceForm === "Newsletter Signup"
    ? "New website newsletter signup"
    : "New website service request";

  const body = [
    "A new website submission was received.",
    "",
    "Source: " + (sourceForm || "Contact Form"),
    "Name: " + (payload.name || ""),
    "Phone: " + (payload.phone || ""),
    "Email: " + (payload.email || ""),
    "Service: " + (payload.service || ""),
    "Page: " + (payload.pageUrl || ""),
    "",
    "Message:",
    payload.message || "",
    "",
    "Spreadsheet:",
    "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID
  ].join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
