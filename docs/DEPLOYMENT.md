# Deployment Guide — AI Opportunity Tracker

## Vercel Deployment

### Prerequisites

- GitHub repository (created in Phase 3)
- Airtable Personal Access Token
- Vercel account (https://vercel.com)

---

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git remote add origin https://github.com/<your-username>/ai-opportunity-tracker.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository (`ai-opportunity-tracker`)
4. Vercel will auto-detect Vite configuration

### 3. Configure Build Settings

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### 4. Set Environment Variables

In the Vercel project dashboard → Settings → Environment Variables:

| Name | Value | Environment |
|------|-------|-------------|
| `AIRTABLE_PAT` | `patYOUR_TOKEN_HERE` | Production, Preview, Development |

Generate a PAT at https://airtable.com/create/tokens

Required scopes:
- `data.records:read`
- `data.records:write`
- `schema.bases:read`

### 5. Vercel Configuration File

Create `vercel.json` in the project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/airtable/:baseId/:table",
      "destination": "https://api.airtable.com/v0/:baseId/:table"
    }
  ]
}
```

### 6. Deploy API Proxy

**Important:** The Vite dev proxy only works in development. For production, you need one of:

**Option A — Vercel Rewrites (Recommended)**
The `vercel.json` rewrites above handle API proxying in production. They forward `/api/airtable/*` to `api.airtable.com`. Set the `AIRTABLE_PAT` env var on Vercel, and update `src/services/airtableMcpService.js` to call the Vercel rewrite path with a Bearer token from the Vercel environment.

**Option B — Vercel Serverless Function**
Create `api/airtable-proxy.js`:
```js
export default async function handler(req, res) {
  const path = req.url.replace('/api/airtable-proxy', '');
  const response = await fetch(`https://api.airtable.com/v0${path}`, {
    method: req.method,
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
  });
  res.status(response.status).json(await response.json());
}
```

### 7. Deploy

Click **Deploy** on Vercel. The app will be live at `https://ai-opportunity-tracker.vercel.app`.

---

## Required Environment Variables

| Variable | Required | Source |
|----------|----------|--------|
| `AIRTABLE_PAT` | ✅ Yes | https://airtable.com/create/tokens |

---

## Build Verification

```bash
# Local production build
npm run build

# Preview the built app
npm run preview
```

The build should complete without errors and output to the `dist/` directory.

---

## Post-Deployment Checklist

- [ ] Verify the app loads at the Vercel URL
- [ ] Test adding an opportunity (check Airtable for new record)
- [ ] Test editing an opportunity
- [ ] Test deleting an opportunity
- [ ] Verify search and filters work
- [ ] Test dark mode toggle
- [ ] Check mobile responsiveness

---

## Troubleshooting

### "Airtable create failed: 401"

The PAT is missing or invalid. Verify `AIRTABLE_PAT` is set in Vercel environment variables.

### "Airtable create failed: 403"

The PAT doesn't have write access to the base. Verify scopes: `data.records:write` and ensure the base is selected in the PAT's access settings.

### "Airtable create failed: 404"

The base ID or table name is wrong. Verify `BASE_ID` is `appyy1Aeo1gibcStS` and `TABLE_NAME` is `Opportunities`.

### CORS errors

Verify the Vercel rewrites or serverless function is correctly configured. The Airtable REST API does not allow direct browser calls.

---

Deploy URL: **https://vercel.com/new**
Post-deployment: Verify at **https://airtable.com/appyy1Aeo1gibcStS/tblKjkz7eSgNbnBn9**