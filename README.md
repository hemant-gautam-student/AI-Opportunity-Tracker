# AI Opportunity Tracker

A **Builder Assignment & MCP Demonstration Project** showcasing modern React development with MCP (Model Context Protocol) integration patterns.

---

## ⚡ Purpose

This project demonstrates:

- ✅ Modern React Development (Vite, Components, Hooks)
- ✅ State Management (useState, useCallback, useMemo)
- ✅ Conditional Rendering (Interview fields)
- ✅ Data Persistence (localStorage)
- ✅ Clean Architecture (Service Layer Pattern)
- ✅ **MCP Integration Patterns** (Airtable, Google Calendar)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.jsx                                 │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────────┐  │
│  │   State     │────→│    UI        │     │  MCP Services   │  │
│  │  (localStorage)   │  Components  │←────│  (Simulated)    │  │
│  └─────────────┘     └──────────────┘     └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Tree

```
App.jsx
├── Navbar.jsx              # Logo + dark/light toggle
├── StatsCards.jsx          # 5 stat cards (metrics)
├── OpportunityForm.jsx     # Add/Edit form with conditional fields
├── SearchBar.jsx           # Real-time search
├── FilterBar.jsx           # Category + Status filters
└── OpportunityList.jsx
    ├── ConfirmDialog.jsx   # Delete confirmation
    └── Empty state         # No opportunities
```

### Service Layer

```
src/services/
├── airtableMcpService.js   # Airtable MCP tool simulation
└── calendarMcpService.js   # Google Calendar MCP tool simulation
```

---

## 🔧 MCP Integration

### Airtable MCP Service

Simulates MCP tool calls for:

| Function | MCP Tool Name | Description |
|----------|---------------|-------------|
| `createOpportunity()` | `airtable_create_record` | Create new record |
| `updateOpportunity()` | `airtable_update_record` | Update existing record |
| `deleteOpportunity()` | `airtable_delete_record` | Delete record |
| `fetchOpportunities()` | `airtable_list_records` | List all records |

### Google Calendar MCP Service

Simulates MCP tool calls for:

| Function | MCP Tool Name | Description |
|----------|---------------|-------------|
| `createInterviewEvent()` | `google_calendar_create_event` | Create interview event |
| `updateInterviewEvent()` | `google_calendar_update_event` | Update event |
| `deleteInterviewEvent()` | `google_calendar_delete_event` | Delete event |

---

## 🔄 Save Workflow

```
User clicks "Save Opportunity"
         │
         ▼
┌─────────────────┐
│ 1. Validate     │
│    Form Data    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Save to      │
│    React State  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Persist to   │
│    localStorage │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. Airtable MCP │
│    create/update│
└────────┬────────┘
         │
         ▼
    Is Status
     "Interview"?
         │
    ┌────┴────┐
    │         │
   No        Yes
    │         │
    │         ▼
    │  ┌──────────────────┐
    │  │ Calendar MCP     │
    │  │ create event     │
    │  └──────────────────┘
    │
    ▼
  Finish
```

---

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173/`

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
ai-opportunity-tracker/
├── index.html                  # Entry HTML
├── vite.config.js              # Vite + React + Tailwind v4
├── package.json                # Dependencies
├── src/
│   ├── main.jsx                # React root
│   ├── index.css               # Tailwind v4 + theme
│   ├── App.jsx                 # Main orchestrator
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── StatsCards.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterBar.jsx
│   │   ├── OpportunityForm.jsx
│   │   ├── OpportunityList.jsx
│   │   └── ConfirmDialog.jsx
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js  # localStorage persistence
│   │
│   ├── services/
│   │   ├── airtableMcpService.js   # Airtable MCP wrapper
│   │   └── calendarMcpService.js   # Calendar MCP wrapper
│   │
│   └── utils/
│       ├── constants.js        # Categories, statuses, colors
│       └── validators.js       # Validation, search, filter
│
└── README.md
```

---

## 🎨 Features

### Dashboard
- [x] Statistics cards (Total, Applied, Interviews, Accepted, Rejected)
- [x] Add/Edit opportunity form
- [x] Search by name/organization
- [x] Filter by category/status
- [x] Sortable opportunity table
- [x] Delete confirmation dialog
- [x] Empty state

### Form Features
- [x] Conditional interview fields (Date + Time)
- [x] Real-time validation
- [x] Error messages
- [x] Loading states

### Data Features
- [x] localStorage persistence
- [x] Automatic state sync
- [x] MCP service simulation logging

### UI/UX
- [x] Dark/Light mode toggle
- [x] Responsive design
- [x] Toast notifications
- [x] Smooth animations
- [x] Accessible components

---

## 🔍 MCP Demonstration

Open browser console to see MCP tool calls logged:

```
[MCP] → airtable_create_record { base: 'CareerTracker', table: 'Opportunities', fields: {...} }
[MCP] → google_calendar_create_event { summary: '...', start: {...}, end: {...} }
[MCP] → airtable_delete_record { base: 'CareerTracker', table: 'Opportunities', recordId: '...' }
```

This demonstrates where real MCP tool invocations would occur when connected to:
- `@modelcontextprotocol/server-airtable`
- `@modelcontextprotocol/server-google-calendar`

---

## 📝 Testing Scenarios

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1 | Add opportunity | Fill form → Save | Appears in table + localStorage |
| 2 | Edit opportunity | Click edit → Modify → Update | Changes reflected |
| 3 | Delete opportunity | Click delete → Confirm | Removed from table |
| 4 | Search | Type in search box | Results filter in real-time |
| 5 | Filter | Select category/status | Filtered results shown |
| 6 | Interview workflow | Status = Interview → Fill date/time → Save | Calendar event logged |
| 7 | Dark mode | Click moon icon | Theme persists on reload |
| 8 | Empty state | Delete all | Empty state message shown |
| 9 | Validation | Submit empty form | Error messages displayed |
| 10 | MCP logging | Open console → Add opportunity | `[MCP]` logs visible |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite 6 | Build Tool + Dev Server |
| Tailwind CSS v4 | Styling |
| Lucide React | Icons |
| Sonner | Toast Notifications |

---

## 📌 Notes

- **No API keys or environment variables required** — runs entirely client-side
- **MCP services are simulated** — logs show where real MCP calls would happen
- **localStorage is primary persistence** — ensures offline functionality
- **Portfolio-ready** — clean code, documented, production-quality UI

---

## 🔮 Future Enhancements

- [ ] Connect real MCP servers (Airtable, Google Calendar)
- [ ] Resume attachment support
- [ ] AI-powered opportunity scoring
- [ ] Application deadline reminders
- [ ] Chrome extension for one-click save
- [ ] Multi-user authentication
- [ ] Analytics dashboard
- [ ] Email notifications

---

**Built for:** W1 AI Job Application Tracker — Builder Assignment  
**Author:** Hemant Gautam  
**Date:** June 2026