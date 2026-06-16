/**
 * # PROJECT: TRIAD ORCHID SOCIETY (TOS) SOCIAL MEDIA HUB & TOOLKIT
 * # AUTHOR:  Rebecca Short (Ailis inghean Ui Riagain)
 * # ROLE:    Digital Strategy Lead / Tech Wiz / Digital Steward
 * # DATE:    May 2026
 * # VERSION: 4.2.0-PROD (Sanitized for Public Repository)
 * -------------------------------------------------------------------------
 * ABSTRACT: 
 * Combined backend engine managing the TOS Content Dashboard, 
 * Management Sidebar, and Digital Steward Planning Reports.
 * Environment properties abstracted to Script Properties for secure hosting.
 * -------------------------------------------------------------------------
 */

// --- GLOBAL CONFIGURATION VIA SCRIPT PROPERTIES ---
const SCRIPT_PROP_SERVICE = PropertiesService.getScriptProperties();
const CONFIG = {
  MAIN_PLANNER_TAB: SCRIPT_PROP_SERVICE.getProperty('MAIN_PLANNER_TAB') || 'Weekly Planner',
  TARGET_DAILY_TABS: (SCRIPT_PROP_SERVICE.getProperty('TARGET_DAILY_TABS') || 'Weekly Planner,Monday,Tuesday,Wednesday,Thursday,Friday').split(','),
  ORGANIZATION_NAME: SCRIPT_PROP_SERVICE.getProperty('ORGANIZATION_NAME') || 'Triad Orchid Society'
};

// --- SECTION 1: WEB APP & UI ROUTING ---

/**
 * Serves the uniform grid UI for the Web App Dashboard.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(CONFIG.ORGANIZATION_NAME + ' - Social Media Content Dashboard')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * MASTER MENU: Consolidates Tech Wiz and Digital Steward tools.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🛡️ Digital Steward')
    .addItem('📱 Open Management Sidebar', 'showSidebar')
    .addSeparator()
    .addItem('🗂️ Sync Daily Tabs', 'syncDailyTabs') 
    .addSeparator()
    .addItem('📅 Run Planning Gap Report', 'reportAllAvailableDates')
    .addItem('📊 Run Content Status Report', 'reportContentStatus')
    .addSeparator()
    .addItem('🔄 Sync Published Status', 'autoUpdatePostStatus')
    .addItem('📧 Email Summary to Me', 'emailFullReport')
    .addToUi();
}

/**
 * Launches the Sidebar UI for navigation and sorting.
 */
function showSidebar() {
  const html = HtmlService.createTemplateFromFile('Sidebar')
    .evaluate()
    .setTitle(CONFIG.ORGANIZATION_NAME + ' Content Management')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

// --- SECTION 2: CONTENT RETRIEVAL (DASHBOARD) ---

/**
 * Fetches and sanitizes social media layout records from the primary matrix.
 * Forces safety normalization on workflow statuses to ensure correct UI filtering.
 */
function getPlannerData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.MAIN_PLANNER_TAB); 
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues().slice(1); 
  
  return rows.map((row, index) => {
    let rawStatus = String(row[0] || "").trim();
    
    // Normalize "Draft" vs "Drafts" discrepancies between Sheet metrics and UI
    if (rawStatus.toLowerCase() === "draft") {
      rawStatus = "Drafts";
    }

    return {
      status: rawStatus,
      series: String(row[1] || "").trim(),
      date: row[2] instanceof Date ? Utilities.formatDate(row[2], ss.getSpreadsheetTimeZone(), "MMM dd") : String(row[2]),
      content: String(row[3] || ""),
      mediaLink: String(row[4] || "").trim(),
      rowId: index + 2 
    };
  }).filter(item => item.status !== "");
}

// --- SECTION 3: MEDIA PROXY ENGINE ---

/**
 * Converts internal Google Drive file links to secure Base64 image streams for UI display.
 */
function getThumbnail(rawLink) {
  if (!rawLink || rawLink === "") return "https://lh3.googleusercontent.com/d/1mMZ5kqH6Tk_7SVfuvXhquvcUMEyAOwLe"; 
  const match = rawLink.match(/[-\w]{25,}/);
  if (match) {
    try {
      const file = DriveApp.getFileById(match[0]);
      const blob = file.getBlob();
      return "data:" + blob.getContentType() + ";base64," + Utilities.base64Encode(blob.getBytes());
    } catch (e) { return "https://via.placeholder.com/400x220?text=Access+Error"; }
  }
  return rawLink;
}

// --- SECTION 4: BACKGROUND AUTOMATION & DATA LOGIC ---

/**
 * Automatically updates status from "Scheduled" to "Published" across all relevant tabs.
 * Wrapped in try/catch to ensure hourly triggers succeed without UI errors.
 */
function autoUpdatePostStatus() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const targetSheets = CONFIG.TARGET_DAILY_TABS;
  const now = new Date();
  let totalCount = 0;

  targetSheets.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName.trim());
    if (!sheet) return;

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === "Scheduled" && data[i][2] instanceof Date && data[i][2] <= now) {
        sheet.getRange(i + 1, 1).setValue("Published");
        totalCount++;
      }
    }
  });

  if (totalCount > 0) {
    try {
      SpreadsheetApp.getUi().alert('🛡️ Stewardship Sync: ' + totalCount + ' posts updated across all tabs.');
    } catch (e) {
      console.log('Automated Multi-Tab Sync Complete: ' + totalCount + ' updates.');
    }
  }
}

/**
 * Scans for weekdays (M-F) with no content assigned.
 */
function getAvailabilityData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const planner = ss.getSheetByName(CONFIG.MAIN_PLANNER_TAB);
  if (!planner) return "Error: Target calendar tab not found.";

  const data = planner.getDataRange().getValues();
  let availableDates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i < data.length; i++) {
    let rawDate = data[i][2]; 
    let content = data[i][3]; 
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

/**
 * Summarizes post counts based on Status (Column A).
 */
function getStatusData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const planner = ss.getSheetByName(CONFIG.MAIN_PLANNER_TAB);
  if (!planner) return null;

  const data = planner.getDataRange().getValues();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let counts = { "Scheduled": 0, "Published": 0, "Needs Content": 0, "Under Review": 0, "Draft": 0 };

  for (let i = 1; i < data.length; i++) {
    let date = new Date(data[i][2]); 
    let status = data[i][0] ? data[i][0].toString().trim() : ""; 
    if (date >= today && counts.hasOwnProperty(status)) {
      counts[status]++;
    }
  }
  return counts;
}

// --- SECTION 5: SIDEBAR NAVIGATION & SORTING ---

function jumpToDate(dateString) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.MAIN_PLANNER_TAB);
  if (!sheet) return;
  const data = sheet.getRange("C:C").getValues();
  const targetDate = new Date(dateString).setHours(0,0,0,0);
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] instanceof Date && data[i][0].setHours(0,0,0,0) === targetDate) {
      sheet.setActiveRange(sheet.getRange(i + 1, 3));
      return "Found";
    }
  }
  throw new Error("Date not found in the planner.");
}

function sortPlanner(colIndex) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.MAIN_PLANNER_TAB);
  if (!sheet) return;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  const range = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
  range.sort({column: colIndex, ascending: true});
}

// --- SECTION 6: REPORTING COMMANDS ---

function reportAllAvailableDates() {
  const dates = getAvailabilityData();
  const message = Array.isArray(dates) && dates.length > 0 
    ? "The following weekdays are currently unscheduled:\n\n" + dates.join("\n")
    : "Your social media calendar is fully booked! 🐝";
  try {
    SpreadsheetApp.getUi().alert("Planning Gap Report", message);
  } catch (e) {
    console.log("Planning Gap Report (Background Run)");
  }
}

function reportContentStatus() {
  const counts = getStatusData();
  if (!counts) return;
  const report = Object.keys(counts).map(k => k + ": " + counts[k]).join("\n");
  try {
    SpreadsheetApp.getUi().alert("Status Summary", report);
  } catch (e) {
    console.log("Status Summary (Background Run)");
  }
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
                    "Report generated for " + CONFIG.ORGANIZATION_NAME + " oversight.";

  MailApp.sendEmail(recipient, CONFIG.ORGANIZATION_NAME + " Social Media Planning Report", emailBody);
  try {
    SpreadsheetApp.getUi().alert("Report emailed to " + recipient);
  } catch (e) {
    console.log("Report emailed successfully.");
  }
}