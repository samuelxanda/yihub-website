/**
 * Shared Airtable utilities for Netlify Functions.
 * Keeps the Airtable Personal Access Token server-side only.
 */

// Support both env var names (AIRTABLE_API_KEY from .env.local, AIRTABLE_TOKEN on Netlify)
const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY ?? process.env.AIRTABLE_TOKEN!;
// Strip any /tblXXX/viwXXX suffix — only the appXXX part is the base ID
const AIRTABLE_BASE_ID = (process.env.AIRTABLE_BASE_ID ?? '').split('/')[0];
const API_BASE = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

// Table names (configurable via env, with sensible defaults)
export const TABLE_EVENTS = process.env.AIRTABLE_TABLE_EVENTS ?? 'Events';
export const TABLE_PARTICIPANTS = process.env.AIRTABLE_TABLE_PARTICIPANTS ?? 'Participants';
export const TABLE_PROJECTS = process.env.AIRTABLE_TABLE_PROJECTS ?? 'Projects';

interface AirtableListParams {
  filterByFormula?: string;
  sort?: { field: string; direction: 'asc' | 'desc' }[];
  fields?: string[];
  maxRecords?: number;
}

export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

/**
 * Fetch all records from an Airtable table (handles pagination).
 */
export async function fetchRecords(
  table: string,
  params: AirtableListParams = {}
): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`${API_BASE}/${encodeURIComponent(table)}`);

    if (params.filterByFormula) {
      url.searchParams.set('filterByFormula', params.filterByFormula);
    }
    if (params.maxRecords) {
      url.searchParams.set('maxRecords', String(params.maxRecords));
    }
    if (params.fields) {
      params.fields.forEach((f) => url.searchParams.append('fields[]', f));
    }
    if (params.sort) {
      params.sort.forEach((s, i) => {
        url.searchParams.set(`sort[${i}][field]`, s.field);
        url.searchParams.set(`sort[${i}][direction]`, s.direction);
      });
    }
    if (offset) {
      url.searchParams.set('offset', offset);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Airtable API error ${res.status}: ${errorText}`);
    }

    const data: AirtableListResponse = await res.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

/**
 * Standard cache headers for public GET responses (5 minutes).
 */
export const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};

/**
 * Standard CORS + JSON response headers.
 */
export function jsonHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    ...CACHE_HEADERS,
  };
}
