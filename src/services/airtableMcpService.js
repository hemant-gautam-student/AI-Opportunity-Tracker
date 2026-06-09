/**
 * Airtable Service
 *
 * Calls the Airtable REST API through the Vite dev proxy.
 * The proxy injects the PAT server-side, keeping the token out of the browser.
 *
 * Architecture:
 *   React Component → airtableMcpService → /api/airtable/* (Vite Proxy)
 *                                          → api.airtable.com (PAT added server-side)
 *
 * Base:  appyy1Aeo1gibcStS (AI Opportunity Tracker)
 * Table: Opportunities (tblKjkz7eSgNbnBn9)
 */

const BASE_ID = 'appyy1Aeo1gibcStS';
const TABLE_NAME = 'Opportunities';
const PROXY_PATH = `/api/airtable/${BASE_ID}/${TABLE_NAME}`;

/**
 * Map frontend form keys → Airtable field names
 */
function toAirtableFields(formData) {
  return removeEmpty({
    'Opportunity Name': formData.name,
    Organization: formData.organization,
    'Opportunity Link': formData.link || undefined,
    Category: formData.category || undefined,
    Status: formData.status,
    'Interview Date': formData.interviewDate || undefined,
    'Interview Time': formData.interviewTime || undefined,
    Notes: formData.notes || undefined,
  });
}

/**
 * Map Airtable field names → frontend form keys
 */
function fromAirtableFields(record) {
  const f = record.fields;
  return {
    id: record.id,
    airtableId: record.id,
    name: f['Opportunity Name'] || '',
    organization: f['Organization'] || '',
    link: f['Opportunity Link'] || '',
    category: f['Category'] || '',
    status: f['Status'] || 'Interested',
    interviewDate: f['Interview Date'] || '',
    interviewTime: f['Interview Time'] || '',
    notes: f['Notes'] || '',
    createdAt: f['Created At'] || record.createdTime,
    updatedAt: f['Last Updated'] || '',
  };
}

/** Strip undefined/null/empty-string values */
function removeEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );
}

/**
 * Create a new opportunity record in Airtable
 */
export async function createOpportunity(opportunity) {
  const body = { records: [{ fields: toAirtableFields(opportunity) }] };

  const res = await fetch(PROXY_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Airtable create failed: ${res.status}`);
  }

  const data = await res.json();
  const created = fromAirtableFields(data.records[0]);

  return { ...opportunity, airtableId: created.airtableId };
}

/**
 * Update an existing opportunity record in Airtable
 * @param {string} recordId - The Airtable record ID
 * @param {Object} data - Updated fields
 */
export async function updateOpportunity(recordId, data) {
  const body = { fields: toAirtableFields(data) };

  const res = await fetch(`${PROXY_PATH}/${recordId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Airtable update failed: ${res.status}`);
  }

  const result = await res.json();
  return fromAirtableFields(result);
}

/**
 * Delete an opportunity record from Airtable
 * @param {string} recordId - The Airtable record ID
 */
export async function deleteOpportunity(recordId) {
  const res = await fetch(`${PROXY_PATH}/${recordId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Airtable delete failed: ${res.status}`);
  }

  return true;
}

/**
 * List all opportunity records from Airtable
 */
export async function listOpportunities() {
  const res = await fetch(PROXY_PATH);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Airtable list failed: ${res.status}`);
  }

  const data = await res.json();
  return data.records.map(fromAirtableFields);
}