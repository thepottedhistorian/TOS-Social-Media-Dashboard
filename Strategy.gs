/**
 * # MODULE: STRATEGY ENGINE
 * # AUTHOR:  Rebecca Short
 * # ROLE:    Digital Strategy Lead / Tech Wiz
 * # DATE:    April 2026
 * # VERSION: 3.6.0-PROD (Sanitized for Public Repository)
 * -------------------------------------------------------------------------
 * ABSTRACT: 
 * Isolated engine for the Campaign Strategy Roadmap. 
 * Environment tab properties decoupled for public code hosting.
 * DATA MAPPING PER SPREADSHEET A2:E8:
 * [Index 0] -> Status          (Col A)
 * [Index 1] -> Series Title    (Col B)
 * [Index 2] -> Frequency       (Col C)
 * [Index 3] -> Primary Goal    (Col D)
 * [Index 4] -> Target Audience (Col E)
 * -------------------------------------------------------------------------
 */

function getStrategyData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Fetch configuration property from script settings with a hardcoded fallback
  const strategyTabName = PropertiesService.getScriptProperties().getProperty('STRATEGY_TAB') || 'Campaign Strategy';
  
  const sheet = ss.getSheetByName(strategyTabName);
  if (!sheet) return [];
  const data = sheet.getRange("A2:E8").getValues();
  return data.map(row => {
    return {
      status: String(row[0] || ""),    
      title: String(row[1] || ""),     
      frequency: String(row[2] || ""), 
      goal: String(row[3] || ""),      
      audience: String(row[4] || "")   
    };
  }).filter(item => item.title !== "");
}