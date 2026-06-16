/**
 * -----------------------------------------------------------------------------
 * DIGITAL STEWARD - SOCIAL MEDIA PLANNER TOOLKIT (CONSOLIDATED)
 * -----------------------------------------------------------------------------
 * Version: 2.0
 * Layout: Col A: Status | Col B: Series | Col C: Date | Col D: Content
 * Author: Gemini (for Ailis inghean Ui Riagain / Rebecca Short)
 * -----------------------------------------------------------------------------
 */

/*
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🛡️ Digital Steward')
      .addItem('📅 Run Planning Gap Report', 'reportAllAvailableDates')
      .addItem('📊 Run Content Status Report', 'reportContentStatus')
      .addSeparator()
      .addItem('📧 Email Summary to Me', 'emailFullReport')
      .addToUi();
}

/ **
 * Scans for weekdays (M-F) with no content assigned.
 * /
function getAvailabilityData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const planner = ss.getSheetByName("Weekly Planner");
  if (!planner) return "Error: 'Weekly Planner' tab not found.";

  const data = planner.getDataRange().getValues();
  let availableDates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i < data.length; i++) {
    let rawDate = data[i][2]; // Column C: Date
    let content = data[i][3]; // Column D: Content
    
    if (rawDate instanceof Date) {
      let date = new Date(rawDate);
      let day = date.getDay();
      
      if (date >= today && day >= 1 && day <= 5 && (!content || content.toString().trim() === "")) {
        availableDates.push(Utilities.formatDate(date, ss.getSpreadsheetTimeZone(), "EEE, MMM d"));
      }
    }
  }
  return availableDates;
}

/ **
 * Summarizes post counts based on Status (Column A).
 * /
function getStatusData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const planner = ss.getSheetByName("Weekly Planner");
  if (!planner) return null;

  const data = planner.getDataRange().getValues();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let counts = { "Scheduled": 0, "Published": 0, "Needs Content": 0, "Under Review": 0, "Draft": 0 };

  for (let i = 1; i < data.length; i++) {
    let date = new Date(data[i][2]); // Column C: Date
    let status = data[i][0] ? data[i][0].toString().trim() : ""; // Column A: Status

    if (date >= today && counts.hasOwnProperty(status)) {
      counts[status]++;
    }
  }
  return counts;
}

// --- Menu Command Functions ---

function reportAllAvailableDates() {
  const dates = getAvailabilityData();
  const message = Array.isArray(dates) && dates.length > 0 
    ? "The following weekdays are currently unscheduled:\n\n" + dates.join("\n")
    : "Your social media calendar is fully booked! 🐝";
  SpreadsheetApp.getUi().alert("Planning Gap Report", message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function reportContentStatus() {
  const counts = getStatusData();
  if (!counts) return;
  const report = Object.keys(counts).map(k => k + ": " + counts[k]).join("\n");
  SpreadsheetApp.getUi().alert("Status Summary", report, SpreadsheetApp.getUi().ButtonSet.OK);
}

function emailFullReport() {
  const recipient = Session.getActiveUser().getEmail();
  const dates = getAvailabilityData();
  const counts = getStatusData();
  
  const statusBody = Object.keys(counts).map(k => "• " + k + ": " + counts[k]).join("\n");
  const gapBody = Array.isArray(dates) ? dates.join("\n") : "None";

  const emailBody = "🛡️ DIGITAL STEWARD: SOCIAL MEDIA OVERSIGHT REPORT\n" +
                    "--------------------------------------------------\n\n" +
                    "CURRENT CONTENT STATUS:\n" + statusBody + "\n\n" +
                    "PLANNING GAPS (Unscheduled Weekdays):\n" + gapBody + "\n\n" +
                    "--------------------------------------------------\n" +
                    "Report generated for Triad Orchid Society oversight.";

  MailApp.sendEmail(recipient, "Social Media Planning Report", emailBody);
  SpreadsheetApp.getUi().alert("Report emailed to " + recipient);
}
*/