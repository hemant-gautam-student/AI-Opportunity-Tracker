# AI Opportunity Tracker

**Track and manage your career pipeline** — a modern React application with real Airtable cloud persistence, MCP (Model Context Protocol) integration patterns, and a clean component architecture.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Airtable Integration](#airtable-integration)
- [MCP Integrations](#mcp-integrations)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

---

## Features

- ✅ **Full CRUD** — Create, read, update, and delete career opportunities
- ✅ **Cloud Persistence** — Data syncs to Airtable via REST API with Vite proxy
- ✅ **Local Fallback** — localStorage ensures data survives between sessions
- ✅ **Real-time Search** — Filter by name or organization as you type
- ✅ **Category & Status Filters** — Narrow down by Internship, Job, Hackathon, etc.
- ✅ **Conditional Interview Fields** — Date/time inputs appear only when status is "Interview"
- ✅ **Stats Dashboard** — Live counters for Total, Applied, Interviews, Accepted, Rejected
- ✅ **Dark Mode** — System-aware theme toggle with persistent preference
- ✅ **Form Validation** — Client-side validation for required fields and URLs
- ✅ **Responsive Design** — Works on desktop, tablet, and mobile
- ✅ **MCP-Ready Architecture** — Service layer designed for MCP tool consumption

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Notifications | Sonner |
| Persistence | localStorage + Airtable REST API |
| E2E Testing | Playwright (via MCP) |
| Proxy | Vite dev server proxy (PAT injection) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          App.jsx                                     │
│  ┌──────────────┐    ┌──────────────────┐    ┌────────────────────┐  │
│  │    State     │───→│   UI Components   │    │   Service Layer    │  │
│  │ localStorage │    │                   │←───│                    │  │
│  │              │    │ Navbar            │    │ airtableMcpService │  │
│  │ useLocalStore│    │ StatsCards        │    │ calendarMcpService │  │
│  │              │    │ OpportunityForm   │    └────────┬───────────┘  │
│  │ useCallback  │    │ SearchBar         │             │              │
│  │ useMemo      │    │ FilterBar         │    ┌────────▼───────────┐  │
│  │              │    │ OpportunityList   │    │  Vite Dev Proxy    │  │
│  └──────┬───────┘    └──────────────────┘    │  /api/airtable      │  │
│         │                                     │  → api.airtable.com │  │
│         │                                     └────────────────────┘  │
└─────────┼──────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────┐
│  Airtable Base      │
│  Opportunities Table │
└─────────────────────┘
```

### Data Flow

```
User fills form → React State updated → localStorage persisted
                                      → POST /api/airtable/... (Vite proxy)
                                      → Vite injects PAT server-side
                                      → api.airtable.com/v0
                                      → Record created in Airtable
```

### Component Tree

```
App.jsx
├── Navbar.jsx              # Logo + dark/light toggle
├── StatsCards.jsx          # 5 metric cards (Total, Applied, Interviews...)
├── OpportunityForm.jsx     # Add/Edit form with conditional fields
├── SearchBar.jsx           # Real-time search by name/org
├── FilterBar.jsx           # Category + Status dropdown filters
└── OpportunityList.jsx
    ├── ConfirmDialog.jsx   # Delete confirmation modal
    └── Empty state         # "No opportunities yet" placeholder
```

---

## Airtable Integration

### Schema — Opportunities Table

| Field | Type | Description |
|-------|------|-------------|
| **Opportunity Name** ★ | Single Line Text | Primary field |
| Organization | Single Line Text | Company or organization |
| Opportunity Link | URL | Job posting URL |
| Category | Single Select | Internship, Job, Hackathon, Fellowship, Freelance, Builder Program, Full-Time, Apprenticeship, Trainee, Part-Time, Contract |
| Status | Single Select | Interested → Applied → Interview Scheduled → Interview → Offer Received → Accepted / Rejected |
| Interview Date | Date | Scheduled interview date |
| Interview Time | Single Line Text | Scheduled time |
| Notes | Multi Line Text | Free-form notes |
| Priority | Single Select | ⬆ High / ➡ Medium / ⬇ Low |
| Created At | Created Time | Auto-generated timestamp |
| Last Updated | Last Modified | Auto-generated timestamp |
| Most Relevant Contact (AI) | AI Text | AI-generated contact suggestion |
| AI Application Status Tips | AI Text | AI-generated tips |
| Opportunity Category Tags (AI) | Multiple Selects | AI-generated tags |

### How the Vite Proxy Works

```js
// vite.config.js
server: {
  proxy: {
    '/api/airtable': {
      target: 'https://api.airtable.com/v0',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/airtable/, ''),
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('Authorization', `Bearer ${env.AIRTABLE_PAT}`)
        })
      },
    },
  },
}
```

- The browser calls `POST /api/airtable/{baseId}/{table}`
- Vite forwards to `https://api.airtable.com/v0/{baseId}/{table}`
- The PAT is injected server-side — **never exposed to the browser**
- Gitignored via `*.local` in `.gitignore`

---

## MCP Integrations

### Airtable MCP (Claude Code Tools)

| Tool | Purpose |
|------|---------|
| `list_bases` | Discover available Airtable bases |
| `list_tables_for_base` | Get table schema and field definitions |
| `list_records_for_table` | Query records with filters and sorting |
| `create_records_for_table` | Batch create records (up to 50) |
| `update_records_for_table` | Update existing records |
| `delete_records_for_table` | Delete records by ID |
| `create_field` | Add new fields to a table |

**Type:** HTTP MCP server at `https://mcp.airtable.com/mcp`
**Auth:** OAuth 2.0 (browser-based authorization flow)

### GitHub MCP

| Tool | Purpose |
|------|---------|
| `search_repositories` | Find repositories by name |
| `create_repository` | Create new GitHub repos |
| `create_or_update_file` | Push files to a repo |
| `create_branch` | Create new branches |
| `list_issues` | List repository issues |

**Type:** Stdio MCP server via `@modelcontextprotocol/server-github`
**Auth:** GitHub Personal Access Token in `env` block

### Playwright MCP

| Tool | Purpose |
|------|---------|
| `browser_navigate` | Navigate to URLs |
| `browser_snapshot` | Capture accessibility snapshots |
| `browser_take_screenshot` | Take screenshots |
| `browser_fill_form` | Fill form fields |
| `browser_click` | Click elements |

**Type:** Stdio MCP server via `@playwright/mcp`

### Context7 MCP

| Tool | Purpose |
|------|---------|
| Resolve-library-id | Look up libraries |
| Query-docs | Fetch documentation |

**Type:** Stdio MCP server via `@upstash/context7-mcp@latest`

---

## Installation

### Prerequisites

- Node.js 18+
- npm 9+
- Airtable account with a Personal Access Token

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd ai-opportunity-tracker

# 2. Install dependencies
npm install

# 3. Create .env.local with your Airtable PAT
echo AIRTABLE_PAT=patYOUR_TOKEN_HERE > .env.local

# 4. Start the dev server
npm run dev

# 5. Open http://localhost:5173
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AIRTABLE_PAT` | Yes | Airtable Personal Access Token |

Generate a PAT at: https://airtable.com/create/tokens
Required scopes: `data.records:read`, `data.records:write`, `schema.bases:read`

---

## Usage

### Adding an Opportunity

1. Fill in **Opportunity Name** and **Organization** (required)
2. Select a **Category** (required)
3. Optionally add a job posting **Link**
4. Select the current **Status**
5. If status is **Interview**, date and time fields appear
6. Click **Save Opportunity**

### Searching & Filtering

- Type in the search bar to filter by name or organization
- Use the Category dropdown to filter by type
- Use the Status dropdown to filter by pipeline stage
- Combine all three for precise filtering

### Editing & Deleting

- Click the **Edit** (pencil) icon on any row to modify
- Click the **Delete** (trash) icon to remove (with confirmation dialog)

---

## Screenshots

See [docs/screenshots/](docs/screenshots/) for all screenshots.

| Screenshot | Description |
|------------|-------------|
| `dashboard.png` | Main dashboard with stats, form, filters, and table |
| `form.png` | Add Opportunity form with all fields |
| `search-filter.png` | Search bar and filter dropdowns |
| `table.png` | Opportunity table with data rows |
| `airtable-verified.png` | Airtable base confirming record creation |

---

## Project Structure

```
ai-opportunity-tracker/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── ConfirmDialog.jsx
│   │   ├── FilterBar.jsx
│   │   ├── Navbar.jsx
│   │   ├── OpportunityForm.jsx
│   │   ├── OpportunityList.jsx
│   │   ├── SearchBar.jsx
│   │   └── StatsCards.jsx
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── services/
│   │   ├── airtableMcpService.js
│   │   └── calendarMcpService.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── docs/
│   ├── screenshots/
│   ├── mcp-automation.md
│   ├── PROJECT_SUMMARY.md
│   └── DEPLOYMENT.md
├── .gitignore
├── .env.local.example
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step Vercel deployment instructions.

---

## Future Improvements

- [ ] **Google Calendar MCP** — Real interview event creation (currently simulated)
- [ ] **Authentication** — User login with OAuth
- [ ] **Multi-user support** — Per-user opportunities
- [ ] **Email reminders** — Auto-reminders for upcoming interviews
- [ ] **Analytics dashboard** — Pipeline funnel charts
- [ ] **Import/Export** — CSV import/export
- [ ] **PWA** — Offline support with service workers
- [ ] **Unit tests** — Vitest + React Testing Library
- [ ] **CI/CD** — GitHub Actions for lint, test, build

---

Built with React, Vite, Tailwind CSS, and Airtable.
MCP integrations powered by Claude Code.