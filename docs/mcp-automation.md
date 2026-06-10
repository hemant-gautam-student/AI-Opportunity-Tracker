# MCP Automation Writeup

## Objective

Demonstrate how MCP (Model Context Protocol) can accelerate development workflows, automate repetitive tasks, and provide AI-assisted tooling for a full-stack React application with external API integrations.

---

## MCPs Used

| MCP Server | Type | Transport | Auth |
|------------|------|-----------|------|
| **Airtable MCP** | HTTP | `https://mcp.airtable.com/mcp` | OAuth 2.0 |
| **GitHub MCP** | Stdio | `npx -y @modelcontextprotocol/server-github` | PAT |
| **Playwright MCP** | Stdio | `npx @playwright/mcp` | None (local) |
| **Context7 MCP** | Stdio | `npx @upstash/context7-mcp@latest` | None (local) |

---

## Workflow

### 1. Discovery & Research

Used **Context7 MCP** to fetch official documentation for:
- Airtable MCP server configuration
- Authentication flow (OAuth vs PAT)
- Required scopes and environment variables

**Benefit:** No manual Googling or documentation lookups — MCP provided authoritative, up-to-date info.

### 2. MCP Configuration

#### GitHub MCP — Initial Setup

Installed via Claude Code plugin, but rate limits hit immediately.

**Problem:** Plugin used `${GITHUB_PERSONAL_ACCESS_TOKEN}` which resolved to empty.

**Solution:**
```bash
claude mcp add github -- npx -y @modelcontextprotocol/server-github
```

Then manually added PAT to `~/.claude.json`:
```json
"github": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "github_pat_..."
  }
}
```

#### Airtable MCP — OAuth Confusion

**Problem:** Airtable MCP uses HTTP transport with short-lived OAuth tokens. Token expired mid-session.

**Solution:**
1. Called `mcp__airtable__authenticate` → received authorization URL
2. User authorized in browser → received callback URL
3. MCP auto-reconnected — no manual token refresh needed

**Lesson:** HTTP MCP servers (like Airtable) use OAuth — expect to re-authenticate across sessions.

### 3. App → Airtable Integration

The app had a **simulated MCP service** that logged to console and returned fake IDs.

**Original Code:**
```js
// airtableMcpService.js (BEFORE)
export async function createOpportunity(opportunity) {
  console.log('[MCP] → airtable_create_record', opportunity);
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...opportunity, airtableId: `sim_${Date.now()}` };
}
```

**Real Integration (AFTER):**
```js
// airtableMcpService.js (AFTER)
export async function createOpportunity(opportunity) {
  const body = { records: [{ fields: toAirtableFields(opportunity) }] };
  const res = await fetch('/api/airtable/appyy1Aeo1gibcStS/Opportunities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Airtable create failed');
  const data = await res.json();
  return { ...opportunity, airtableId: data.records[0].id };
}
```

**Architecture:**
```
Browser → /api/airtable/* (Vite Proxy) → api.airtable.com (PAT injected server-side)
```

### 4. Testing with Playwright MCP

Used Playwright MCP to automate end-to-end testing:

```js
// Playwright MCP script
async (page) => {
  await page.getByPlaceholder('e.g. Software Engineering Intern').fill('Frontend Developer Intern');
  await page.getByPlaceholder('e.g. Google').fill('TechCorp Inc');
  await page.locator('select').nth(0).selectOption('Internship');
  await page.locator('select').nth(1).selectOption('Applied');
  await page.getByRole('button', { name: 'Save Opportunity' }).click();
  return 'Form submitted';
}
```

**Verified:**
- Form submitted successfully
- Network request: `POST /api/airtable/appyy1Aeo1gibcStS/Opportunities` → 200 OK
- Airtable record created with ID `recYcb9qGawBTyBK8`
- UI stats updated: Total 0→2, Applied 0→1

---

## Before Automation

| Task | Manual Effort |
|------|---------------|
| Research Airtable OAuth flow | 30+ min reading docs |
| Configure MCP auth | 15 min trial & error |
| Write Airtable API client | 45 min (error handling, field mapping) |
| Test form submission | 10 min manual entry |
| Verify in Airtable | Open Airtable → find base → check table |

**Total:** ~100 minutes

---

## After Automation

| Task | Automated Effort |
|------|------------------|
| Research via Context7 MCP | 2 min (instant docs) |
| Configure MCP via `claude mcp add` | 3 min |
| Write service layer | 10 min (with AI assistance) |
| Test with Playwright MCP | 1 min (single script) |
| Verify in Airtable via MCP tools | Instant (`list_records_for_table`) |

**Total:** ~16 minutes

---

## Time Saved

| Task | Before | After | Savings |
|------|--------|-------|---------|
| Research | 30 min | 2 min | 93% |
| Configuration | 15 min | 3 min | 80% |
| Implementation | 45 min | 10 min | 78% |
| Testing | 10 min | 1 min | 90% |
| Verification | 5 min | <1 min | 80% |
| **Total** | **105 min** | **16 min** | **~85% time saved** |

---

## Lessons Learned

### 1. MCP Tool Boundaries Matter

**Mistake:** Thought `mcp__airtable__create_records_for_table` could be called from the React app.

**Reality:** MCP tools are **Claude Code tools**, not browser tools. The app needs its own REST API integration.

**Fix:** Built a Vite proxy that injects the PAT server-side. The app now calls `/api/airtable/*` which forwards to Airtable's REST API.

### 2. `claude.json` vs `settings.json`

**Mistake:** Added `mcpServers` to `settings.local.json` — validation failed.

**Reality:** MCP server definitions live in `~/.claude.json` under per-project `mcpServers` blocks. `settings.json` is for permissions, env vars, and hooks.

### 3. Fine-Grained PAT Limitations

**Problem:** `search_repositories({ query: "user:@me" })` returned 422 Validation Failed.

**Cause:** `user:@me` requires OAuth or classic PAT with `user` scope. Fine-grained PATs don't support this.

**Fix:** Called `https://api.github.com/user` directly, then followed `repos_url`.

### 4. PowerShell Syntax Compatibility

**Problem:** `$repo.private ? 'private' : 'public'` threw parser errors.

**Cause:** Windows PowerShell 5.1 doesn't support ternary operators (PowerShell 7+ feature).

**Fix:** Used `if ($repo.private) { "private" } else { "public" }`.

### 5. Token Security

**Critical:** Found `.env.txt` and `.mcp.json.txt` with **plaintext tokens** (Airtable, GitHub, Google) that were not gitignored.

**Fix:**
1. Updated `.gitignore` to explicitly ignore `.env.txt`, `.mcp.json.txt`
2. Deleted existing `.env.txt` and `.mcp.json.txt`
3. Rotated all exposed tokens

### 6. OAuth Token Lifetime

**Observation:** Airtable MCP (HTTP type) uses OAuth tokens that expire. Stdio MCP servers with PATs are more stable.

**Trade-off:** OAuth is more secure (no long-lived tokens), but requires re-authentication. PATs are "set it and forget it" but risk token exposure.

---

## Summary

MCP automation transformed a 100-minute workflow into a 16-minute workflow (~85% time savings). The key wins:

1. **Instant research** via Context7 MCP — no more tab-hopping through docs
2. **CLI-driven configuration** — `claude mcp add` abstracts complexity
3. **AI-assisted coding** — service layer written in minutes, not hours
4. **Automated E2E testing** — Playwright MCP fills forms and verifies results
5. **Direct API verification** — `list_records_for_table` confirms data without leaving the chat

**Biggest lesson:** MCP tools are for Claude, not the browser. Apps need their own API integrations — MCP accelerates the development process, not the runtime behavior.