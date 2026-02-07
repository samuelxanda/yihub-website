/**
 * API client for the Events → Projects showcase feature.
 * Calls Netlify Functions endpoints; keeps the frontend clean.
 */

import type { EventSummary, ProjectSummary, ProjectDetail, SchoolSummary } from './showcase-types';

const API = '/.netlify/functions';

/**
 * Fetch JSON from an Airtable-backed endpoint with cache-busting.
 * - Appends a timestamp query param to bypass any intermediate cache
 * - Uses cache: "no-store" to prevent browser caching
 */
async function fetchJSON<T>(url: string): Promise<T> {
  const separator = url.includes('?') ? '&' : '?';
  const bustUrl = `${url}${separator}_t=${Date.now()}`;
  const res = await fetch(bustUrl, { cache: 'no-store' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error ?? `Request failed (${res.status})`);
  }
  return res.json();
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
