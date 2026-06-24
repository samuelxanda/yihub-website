/**
 * Shared Airtable utilities for Netlify Functions.
 * Keeps the Airtable Personal Access Token server-side only.
 */

// Support both env var names (AIRTABLE_API_KEY from .env.local, AIRTABLE_TOKEN on Netlify)
const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY ?? process.env.AIRTABLE_TOKEN!;
// Strip any /tblXXX/viwXXX suffix — only the appXXX part is the base ID
const AIRTABLE_BASE_ID = (process.env.AIRTABLE_BASE_ID ?? '').split('/')[0];
const API_BASE = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

export function escapeFormulaValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

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

/* ── Project field helpers ──────────────────────────────── */

/** All Project-table fields we ever need. */
export const PROJECT_FIELDS = [
  'title', 'slug', 'category',
  'shortDescription', 'fullDescription',
  'projectUrl', 'githubUrl', 'thumbnailUrl',
  'school', 'staffNotes', 'teamMemberEmails',
  'submittedAt', 'teamLeadEmail',
  'event',
];

/**
 * Auto-detect whether a project record's columns are still
 * shifted by one (missing shortDescription) and return a
 * normalised field map that always has the right values.
 */
export function normaliseProject(f: Record<string, any>) {
  const shifted =
    typeof f.school === 'string' && f.school.startsWith('http');

  if (shifted) {
    return {
      shortDescription: f.fullDescription ?? '',
      fullDescription:  f.projectUrl ?? null,
      projectUrl:       f.githubUrl ?? null,
      githubUrl:        f.thumbnailUrl ?? null,
      thumbnailUrl:     f.school ?? null,
      school:           null,
      submittedAt:      f.staffNotes ?? null,
      teamLeadEmail:    f.teamMemberEmails ?? null,
      teamMemberEmails: null,
      staffNotes:       null,
    };
  }

  return {
    shortDescription: f.shortDescription ?? '',
    fullDescription:  f.fullDescription ?? null,
    projectUrl:       f.projectUrl ?? null,
    githubUrl:        f.githubUrl ?? null,
    thumbnailUrl:     f.thumbnailUrl ?? null,
    school:           f.school ?? null,
    submittedAt:      f.submittedAt ?? null,
    teamLeadEmail:    f.teamLeadEmail ?? null,
    teamMemberEmails: f.teamMemberEmails ?? null,
    staffNotes:       f.staffNotes ?? null,
  };
}

/**
 * No-cache headers — ensures Airtable data changes appear instantly.
 * Prevents caching at Netlify CDN edge, browser, and intermediate proxies.
 */
const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

/**
 * Standard CORS + JSON response headers (no cache — instant updates).
 */
export function jsonHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    ...NO_CACHE_HEADERS,
  };
}

/**
 * Response headers for POST/write endpoints (no cache).
 */
export function writeHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  };
}

/**
 * Create a single record in an Airtable table. Returns the created record.
 * typecast=true lets Airtable auto-create new multi-select options etc.
 */
export async function createRecord(
  table: string,
  fields: Record<string, any>
): Promise<AirtableRecord> {
  const url = `${API_BASE}/${encodeURIComponent(table)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields, typecast: true }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Airtable create error ${res.status}: ${errorText}`);
  }

  return res.json();
}
