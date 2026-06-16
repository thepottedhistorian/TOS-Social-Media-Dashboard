/**
 * ============================================================
 * TOS DAILY DISTRIBUTION ENGINE
 * Version: 2.3
 * Role:     Digital Steward / Content Router
 * Purpose: Sync Weekly Planner → Daily Tabs with formatting,
 * status dropdown, series dropdown, and color coding.
 * Sanitized for public hosting in digital archives.
 * ============================================================
 */


/**
 * ------------------------------------------------------------
 * MAIN ENTRY POINT
 * Triggered manually via menu: "🗂️ Sync Daily Tabs"
 * ------------------------------------------------------------
 */
function syncDailyTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Decoupled script property mapping setups
  const mainPlannerTab = PropertiesService.getScriptProperties().getProperty('MAIN_PLANNER_TAB') || 'Weekly Planner';
  const targetDailyTabs = (PropertiesService.getScriptProperties().getProperty('TARGET_DAILY_TABS') || 'Weekly Planner,Monday,Tuesday,Wednesday,Thursday,Friday').split(',');
  
  const master = ss.getSheetByName(mainPlannerTab);

  const lastRow = master.getLastRow();
  if (lastRow < 2) return;

  const colCount = master.getLastColumn();
  const data = master.getRange(1, 1, lastRow, colCount).getValues();
  const headers = data[0];

  /**
   * ------------------------------------------------------------
   * TAG → SHEET MAPPING
   * Fallback mapping references the indexed target tab positions
   * ------------------------------------------------------------
   */
  const tagMap = {
    "Monday Mix": targetDailyTabs[1] ? targetDailyTabs[1].trim() : "Monday",
    "Troubleshoot Tuesday": targetDailyTabs[2] ? targetDailyTabs[2].trim() : "Tuesday",
    "Wednesdays Genus and Species Gallery": targetDailyTabs[3] ? targetDailyTabs[3].trim() : "Wednesday",
    "Thirsty Thursdays": targetDailyTabs[4] ? targetDailyTabs[4].trim() : "Thursday",
    "Fun Fact Friday": targetDailyTabs[5] ? targetDailyTabs[5].trim() : "Friday",
    "Member Spotlight": "Other",
    "Other": "Other",
    "Orchid Show": "Other"
  };

  /**
   * ------------------------------------------------------------
   * STORAGE BUCKETS FOR EACH DAILY TAB
   * ------------------------------------------------------------
   */
  const buckets = {
    "Other": []
  };
  
  // Dynamically allocate initialization arrays tracking back to active script properties
  targetDailyTabs.forEach((tabName, index) => {
    if (index > 0) { // Skips the master layout index position
      buckets[tabName.trim()] = [];
    }
  });

  /**
   * ------------------------------------------------------------
   * PROCESS EACH ROW IN WEEKLY PLANNER
   * Handles multi-select dropdown chips correctly
   * ------------------------------------------------------------
   */
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const seriesCell = row[1]; // Column B

    if (!seriesCell) continue;

    // Normalize dropdown chips → array of strings
    let tags = Array.isArray(seriesCell)
      ? seriesCell
      : seriesCell.toString().split(",").map(t => t.trim());

    let matched = false;

    // Assign row to all matching sheets
    tags.forEach(tag => {
      if (tagMap[tag] && buckets[tagMap[tag]]) {
        buckets[tagMap[tag]].push(row);
        matched = true;
      }
    });

    // If no recognized tag → send to Other
    if (!matched) {
      buckets["Other"].push(row);
    }
  }

  /**
   * ------------------------------------------------------------
   * WRITE TO DAILY SHEETS
   * ------------------------------------------------------------
   */
  Object.keys(buckets).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);

    sheet.clear();
    sheet.appendRow(headers);

    const rows = buckets[sheetName];
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

      // Sort by date (Column C = 3)
      sheet.getRange(2, 1, rows.length, headers.length)
           .sort({ column: 3, ascending: true });
    }

    // Apply formatting
    applyDailyFormatting(sheet, headers.length);

    // Apply status dropdown + colors
    applyStatusDropdown(sheet, sheet.getLastRow());

    // Apply series dropdown (Column B)
    applySeriesDropdown(sheet, sheet.getLastRow());
  });

  SpreadsheetApp.getUi().alert("Daily tabs synced, formatted, and dropdowns applied.");
}



/**
 * ============================================================
 * FORMATTING ENGINE
 * Applies your preferred layout to every daily sheet
 * ============================================================
 */
function applyDailyFormatting(sheet, colCount) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const dataRange = sheet.getRange(2, 1, lastRow - 1, colCount);

  /**
   * ------------------------------------------------------------
   * ALIGNMENT + WRAP
   * ------------------------------------------------------------
   */
  dataRange
    .setHorizontalAlignment("left")
    .setVerticalAlignment("middle")
    .setWrap(true);

  /**
   * ------------------------------------------------------------
   * COLUMN WIDTHS
   * ------------------------------------------------------------
   */
  sheet.setColumnWidth(1, 142); // Status
  sheet.setColumnWidth(2, 153); // Series
  sheet.setColumnWidth(3, 183); // Publish Date
  sheet.setColumnWidth(4, 781); // Title / Content
  sheet.setColumnWidth(5, 552); // Notes / Links

  /**
   * ------------------------------------------------------------
   * DATE FORMAT (Column C)
   * Example: 5 April 10:00
   * ------------------------------------------------------------
   */
  sheet.getRange(2, 3, lastRow - 1, 1)
       .setNumberFormat('d" "MMMM" 10:00"');

  /**
   * ------------------------------------------------------------
   * HEADER FORMATTING
   * ------------------------------------------------------------
   */
  sheet.getRange(1, 1, 1, colCount)
       .setFontWeight("bold")
       .setBackground("#f3f3f3")
       .setHorizontalAlignment("left");

  sheet.setFrozenRows(1);
}



/**
 * ============================================================
 * STATUS DROPDOWN + COLOR CODING (Column A)
 * ============================================================
 */
function applyStatusDropdown(sheet, lastRow) {
  if (lastRow < 2) return;

  const statusRange = sheet.getRange(2, 1, lastRow - 1, 1);

  // Dropdown options
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      "Needs Content",
      "Under Review",
      "Scheduled",
      "Published",
      "Drafts"
    ], true)
    .setAllowInvalid(false)
    .build();

  statusRange.setDataValidation(rule);

  // Build conditional formatting rules
  const rules = [];

  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Needs Content")
      .setBackground("#ffcccc")
      .setFontColor("#b00000")
      .setRanges([statusRange])
      .build()
  );

  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Under Review")
      .setBackground("#fff2cc")
      .setFontColor("#7a5c00")
      .setRanges([statusRange])
      .build()
  );

  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Scheduled")
      .setBackground("#d9ead3")
      .setFontColor("#0b6b00")
      .setRanges([statusRange])
      .build()
  );

  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Published")
      .setBackground("#cfe2f3")
      .setFontColor("#0b5394")
      .setRanges([statusRange])
      .build()
  );

  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Drafts")
      .setBackground("#e6e6e6")
      .setFontColor("#555555")
      .setRanges([statusRange])
      .build()
  );

  sheet.setConditionalFormatRules(rules);
}



/**
 * ============================================================
 * SERIES DROPDOWN (Column B)
 * Matches Weekly Planner multi-select options
 * ============================================================
 */
function applySeriesDropdown(sheet, lastRow) {
  if (lastRow < 2) return;

  const seriesRange = sheet.getRange(2, 2, lastRow - 1, 1); // Column B

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      "Monday Mix",
      "Troubleshoot Tuesday",
      "Wednesdays Genus and Species Gallery",
      "Thirsty Thursdays",
      "Fun Fact Friday",
      "Member Spotlight",
      "Other",
      "Orchid Show"
    ], true)
    .setAllowInvalid(false)
    .build();

  seriesRange.setDataValidation(rule);
}