/**
 * Vercel Serverless Function - Airtable Proxy
 *
 * Forwards requests to Airtable API with Authorization header injected server-side.
 * Environment variable: AIRTABLE_PAT (set in Vercel dashboard)
 *
 * Routes:
 *   GET    /api/airtable-proxy?records=true  → List records
 *   POST   /api/airtable-proxy               → Create record
 *   PUT    /api/airtable-proxy?id=recXXX     → Update record
 *   DELETE /api/airtable-proxy?id=recXXX     → Delete record
 */

const BASE_ID = 'appyy1Aeo1gibcStS';
const TABLE_NAME = 'Opportunities';

export default async function handler(req, res) {
  const { method, query, body } = req;

  // Get PAT from environment
  const pat = process.env.AIRTABLE_PAT;
  if (!pat) {
    return res.status(500).json({ error: 'AIRTABLE_PAT not configured' });
  }

  // Build Airtable URL
  let url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  // Append query params for GET/list
  if (method === 'GET' && query.records) {
    const params = new URLSearchParams();
    if (query.maxRecords) params.append('maxRecords', query.maxRecords);
    if (query.filterByFormula) params.append('filterByFormula', query.filterByFormula);
    if (query.sort) {
      const sorts = Array.isArray(query.sort) ? query.sort : [query.sort];
      sorts.forEach(s => params.append('sort[]', s));
    }
    if (query.fields) {
      const fields = Array.isArray(query.fields) ? query.fields : [query.fields];
      fields.forEach(f => params.append('fields[]', f));
    }
    if (query.offset) params.append('offset', query.offset);
    if (params.toString()) url += `?${params.toString()}`;
  }

  // Append ID for PUT/DELETE
  if ((method === 'PUT' || method === 'DELETE') && query.id) {
    url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}/${query.id}`;
  }

  try {
    const fetchOptions = {
      method,
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Content-Type': 'application/json',
      },
    };

    if (method === 'POST' || method === 'PUT') {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('[Airtable Proxy Error]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Disable body parsing for Vercel
export const config = {
  api: {
    bodyParser: true,
  },
};