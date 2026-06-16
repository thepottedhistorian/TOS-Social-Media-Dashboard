/**
 * ==========================================================================================
 * DIGITAL CONTENT HUB & TOOLKIT
 * DEVELOPER AUDIT & VERSION CONTROL LOG
 * ==========================================================================================
 * Role:    Digital Strategy Lead / Tech Wiz / Digital Steward
 * Target:  Google Apps Script (Internal Backend)
 * Updated: June 15, 2026
 * ==========================================================================================
 */

/*
  ┌────────────────────────────────────────────────────────────────────────────────────────┐
  │  V4.0+ SECURE DEPLOYMENT PHASE (SEARCH ENGINE & ENVIRONMENTAL ARCHIVING)               │
  └────────────────────────────────────────────────────────────────────────────────────────┘
*/

/**
 * 🟩 [CURRENT] 2026-06-15 | v4.2.0-PROD
 * ------------------------------------------------------------------------------------------
 * SCOPE:    Real-Time Client-Side Search Engine & Environmental Sanitization
 * CHANGES:  - FEAT: Integrated a real-time, instantaneous client-side search input bar directly 
 * into the dashboard interface layout (Index.html).
 * - LOGIC: Expanded the renderCards() data-filtering pipeline to multi-match text 
 * queries simultaneously against card content text bodies, series tags, and dates.
 * - UX/UI: Added a clean, modern input design pattern leveraging Bootstrap groups, 
 * and designed an informative empty-state view when search items yield zero matches.
 * - SANITIZATION: Stripped hardcoded environment identifiers, personal metadata footprints, 
 * and distinct tracking values from all core repository components (Code.gs, strategy.gs, 
 * Index.html, Sidebar.html, distribution.gs).
 * - CONFIG: Shifted structural identifiers over to PropertiesService via central Script 
 * Properties (`STRATEGY_TAB`, `MAIN_PLANNER_TAB`, `ORGANIZATION_NAME`, `TARGET_DAILY_TABS`).
 * - STABILITY: Patched timezone parsing variances in Code.gs by replacing static values 
 * with native ss.getSpreadsheetTimeZone() configurations.
 * ------------------------------------------------------------------------------------------
 */

/*
  ┌────────────────────────────────────────────────────────────────────────────────────────┐
  │  V3.0 PRODUCTION PHASE (STABILIZATION & UI POLISH)                                     │
  └────────────────────────────────────────────────────────────────────────────────────────┘
*/

/**
 * 🟦 [ARCHIVED] 2026-04-07 | v3.5.0-PROD
 * ------------------------------------------------------------------------------------------
 * SCOPE:    Modular Architecture, Workflow Visibility & UI Restoration
 * CHANGES:  - FEAT: Integrated "Needs Content" status filter with high-visibility 
 * red styling (#dc3545) for card borders and dashboard filter buttons.
 * - SYNC: Restored long-form "Campaign Breakdown" formatting in the Strategy 
 * Modal to match exact multi-line Board standards (Monday-Friday breakdown).
 * - BRAND: Updated Wednesday filter and modal text to "Wednesday's Genus & 
 * Species Gallery" per feedback on specific species entries.
 * - ARCH: Decoupled logic by creating Strategy.gs to handle roadmap mapping 
 * independent of Code.gs. Implemented reverse-chronological sorting for 
 * the ChangeLog and scrubbed all log references from Index.html.
 * - DATA: Aligned getStrategyData() to Status-First column structure (Col A) 
 * and verified sanitization for new "Needs Content" and "Drafts" strings.
 * - WORKFLOW: Introduced "Drafts" status with gray color-coding (#6c757d) 
 * and a dedicated UI filter for content holding/repurposing.
 * - UX/UI: Enforced strict 200px aspect-ratio for card thumbnails (object-fit) 
 * and implemented CSS "Loading Pulse" (@keyframes) for media latency.
 * - ACCESSIBILITY: Injected "Read More →" CSS labels to the bottom of all 
 * dashboard cards to improve board-member navigation.
 * ------------------------------------------------------------------------------------------
 */

/*
  ┌────────────────────────────────────────────────────────────────────────────────────────┐
  │  V1.0 - V2.0 FOUNDATION PHASE (CORE BUILD & AUTOMATION)                                │
  └────────────────────────────────────────────────────────────────────────────────────────┘
*/

/**
 * 🟧 [STABLE] 2026-04-05 | v2.0.0-STABLE
 * ------------------------------------------------------------------------------------------
 * SCOPE:    Automation & Strategy Integration
 * CHANGES:  - MODAL: Developed the first iteration of the "Campaign Strategy Brief" modal.
 * - AUTOMATION: Established autoUpdatePostStatus() time-driven trigger to 
 * automatically move "Scheduled" rows to "Published" in real-time.
 * - LOGIC: Added .substring(0,300) truncation to content strings to ensure 
 * uniformity in the card-grid view.
 * ------------------------------------------------------------------------------------------
 *
 * 🟨 [DEV] 2026-04-03 | v1.5.0-DEV
 * ------------------------------------------------------------------------------------------
 * SCOPE:    Frontend Development (Bootstrap Migration)
 * CHANGES:  - FRAMEWORK: Migrated from static HTML tables to Bootstrap 5 responsive grid.
 * - PROXY: Created getThumbnail() Base64 engine to bypass Google Drive 
 * CORS issues for high-resolution images.
 * - FILTERING: Developed setFilter() JS function for Status/Series navigation.
 * ------------------------------------------------------------------------------------------
 *
 * 🟥 [BETA] 2026-04-01 | v1.0.0-BETA
 * ------------------------------------------------------------------------------------------
 * SCOPE:    Initial Proof of Concept
 * CHANGES:  - CORE: Initial Google Sheets "Weekly Planner" integration.
 * - ROUTING: Basic Apps Script doGet() setup for web app deployment.
 * ------------------------------------------------------------------------------------------
 */