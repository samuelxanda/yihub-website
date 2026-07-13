/**
 * API client for the Events → Projects showcase feature.
 * Calls Netlify Functions endpoints; keeps the frontend clean.
 */

import type { EventSummary, ProjectSummary, ProjectDetail, SchoolSummary } from './showcase-types';

const API = '/.netlify/functions';

const DEV_API_HINT =
  'API returned HTML instead of JSON. Run `npm run dev` (Netlify Dev) — plain Vite cannot serve /.netlify/functions.';

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (text.trimStart().startsWith('<')) {
    throw new Error(DEV_API_HINT);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON from API (${res.status})`);
  }
}

/**
 * Fetch JSON from an Airtable-backed endpoint with cache-busting.
 */
async function fetchJSON<T>(url: string): Promise<T> {
  const separator = url.includes('?') ? '&' : '?';
  const bustUrl = `${url}${separator}_t=${Date.now()}`;
  const res = await fetch(bustUrl, { cache: 'no-store' });
  const body = await parseJsonResponse<T & { error?: string }>(res);
  if (!res.ok) {
    throw new Error((body as { error?: string }).error ?? `Request failed (${res.status})`);
  }
  return body;
}

/** POST JSON to a Netlify Function and parse the response. */
export async function postJSON<T>(
  path: string,
  payload: unknown
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await parseJsonResponse<T & { error?: string; message?: string; details?: string[] }>(res);
  if (!res.ok) {
    const err = new Error(body.error ?? body.message ?? `Request failed (${res.status})`) as Error & {
      details?: string[];
      status?: number;
    };
    err.details = body.details;
    err.status = res.status;
    throw err;
  }
  return body;
}

// ─── Events ──────────────────────────────────────────────

export async function getEvents(): Promise<EventSummary[]> {
  const data = await fetchJSON<{ events: EventSummary[] }>(`${API}/events`);
  return data.events;
}

export async function getEventWithProjects(
  slug: string
): Promise<{ event: EventSummary; projects: ProjectSummary[] }> {
  const data = await fetchJSON<{ event: EventSummary; projects: ProjectSummary[] }>(
    `${API}/event-projects?slug=${encodeURIComponent(slug)}`
  );
  return data;
}

// ─── Projects ────────────────────────────────────────────

export async function getProject(slug: string): Promise<ProjectDetail> {
  const data = await fetchJSON<{ project: ProjectDetail }>(
    `${API}/project?slug=${encodeURIComponent(slug)}`
  );
  return data.project;
}

// ─── Schools ─────────────────────────────────────────────

export async function getSchools(): Promise<SchoolSummary[]> {
  const data = await fetchJSON<{ schools: SchoolSummary[] }>(`${API}/schools`);
  return data.schools;
}

export async function getSchoolProjects(
  schoolSlug: string
): Promise<{ school: string; projects: ProjectSummary[] }> {
  const data = await fetchJSON<{ school: string; projects: ProjectSummary[] }>(
    `${API}/school-projects?school=${encodeURIComponent(schoolSlug)}`
  );
  return data;
}

// ─── Registration check ─────────────────────────────────

export async function checkRegistration(
  eventSlug: string,
  email: string
): Promise<boolean> {
  const data = await fetchJSON<{ registered: boolean }>(
    `${API}/check-registration?eventSlug=${encodeURIComponent(eventSlug)}&email=${encodeURIComponent(email)}`
  );
  return data.registered;
}
