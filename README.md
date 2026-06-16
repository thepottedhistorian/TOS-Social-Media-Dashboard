# Social Media Content Hub & Automation Toolkit

An environment-agnostic, enterprise-ready content stewardship platform engineered with **Google Apps Script (V8 Engine)**, **Bootstrap 5**, and **CSS3**. This system bridges the gap between high-level editorial strategy and daily platform execution by converting a flat Google Sheets matrix into a dynamic, mobile-responsive dashboard. 

The architecture is entirely decoupled; all private organization branding, workspace tab names, and daily routing targets are managed securely via the Google Apps Script `PropertiesService`, leaving the source code clean, sanitized, and ready for public hosting or version control.

---

## 🏗️ System Architecture & File Layout

The platform splits operations into isolated frontend UI templates and backend data processors:

### Backend Engines (`.gs` files)
* **`Code.gs`**: The core controller routing the Web App interface (`doGet()`) and compiling custom user interface menus (`onOpen()`). It handles thumbnail caching, serves Base64-encoded binary media streams to bypass CORS, and generates on-demand planning gap and status metrics.
* **`Distribution.gs`**: The workspace router. It processes rows in the master calendar, unpacks comma-separated multi-select tags, and mirrors row records dynamically to their corresponding day tabs while executing custom column dimensions, typography rules, and cell dropdown data validations.
* **`Strategy.gs`**: An isolated lookup engine that maps raw row cells into standardized object arrays to safely populate the tactical campaign briefs without hardcoding metrics.
* **`ChangeLog.gs`**: A strict, reverse-chronological development log documenting the versioning history, UI polish, and feature milestones of the workspace ecosystem.

### Frontend User Interfaces (`.html` files)
* **`Index.html`**: The primary dashboard view. Styled with Bootstrap 5 and custom CSS layouts, it features a real-time client-side search engine, state-driven collection filter buttons, a responsive image-loading pulse skeleton grid, and rich modal expansion frames for deep content review.
* **`Sidebar.html`**: An internal workspace management container providing fast editor operations, including targeted calendar date-jumping and immediate sheet-sorting protocols.

---

## 🔄 Core Automation & Workflow Data Flow

The system guides content through a standardized operational pipeline:

1. **Strategic Entry**: Content is logged in the Master Planner sheet with standard metadata tags (Status, Series, Date, Body, Media Link).
2. **Distribution Sweeps**: The Steward manual sync reads the master tracking array, dynamically matches categories to target daily sheets, and builds distinct calendar logs complete with color-coded conditional safety states (e.g., Scheduled 🟢, Needs Content 🔴).
3. **Real-Time Visibility**: The Web App pulls this data instantaneously into memory. Editors can query thousands of characters of copy, series designations, or custom calendar dates concurrently using the instantaneous client-side search bar.
4. **Triggered Archiving**: A time-driven hourly script trigger continuously evaluates live posts. Any content marked as "Scheduled" with a timestamp matching or older than `now` is automatically promoted to "Published" across all target tracking tabs.

---

## ⚙️ Environment Properties Configuration

To deploy this repository into your Google Workspace project, navigate to **Project Settings > Script Properties** in the Apps Script editor and initialize the following Key/Value matrix:

| Property (Key) | Expected Value Format | Purpose / Placement |
| :--- | :--- | :--- |
| `ORGANIZATION_NAME` | `Your Group Name` | Injects global text branding into Web App headers, sidebars, and diagnostic email reports. |
| `MAIN_PLANNER_TAB` | `Weekly Planner` | Defines the master sheet string identifier the system reads during content rendering and routing. |
| `STRATEGY_TAB` | `Campaign Strategy` | Targets the strategy matrix row settings to populate backend marketing brief fields. |
| `TARGET_DAILY_TABS` | `Master,Day1,Day2,Day3...` | A strict comma-separated string list mapping sheet execution targets for status sweeps and daily distribution. |

---

## 🚀 Deployment Checklist

1. Clone or copy the sanitized files into your target Google Apps Script project.
2. Initialize your configuration keys inside the project's **Script Properties**.
3. Set up an **Hourly Time-Driven Trigger** in your Apps Script dashboard pointing to the `autoUpdatePostStatus` function to activate automated publishing sweeps.
4. Click **Deploy > New Deployment**, choose **Web App**, set access configurations, and execute the build to generate your dynamic dashboard link.

---

## 🛡️ License & Support
System architecture managed by the Digital Strategy Lead. For technical enhancements, architecture updates, or environmental refactoring notes, please consult the integrated system deployment log (`ChangeLog.gs`).
