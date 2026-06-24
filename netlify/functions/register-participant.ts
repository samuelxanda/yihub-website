import type { Handler } from '@netlify/functions';
import {
  fetchRecords,
  createRecord,
  TABLE_EVENTS,
  TABLE_PARTICIPANTS,
  writeHeaders,
  escapeFormulaValue,
} from './utils/airtable';

// Simple in-memory rate-limit: 5 submissions per email per 10 minutes
const recentSubmissions = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const timestamps = (recentSubmissions.get(email) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  recentSubmissions.set(email, timestamps);
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /.netlify/functions/register-participant
 * Body: { eventSlug, name, email, school, extraInfo? }
 */
const handler: Handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: writeHeaders(), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: writeHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body ?? '{}');
    const { eventSlug, name, email, school, extraInfo } = body;

    // ── Validation ──────────────────────────────────────
    const errors: string[] = [];
    if (!eventSlug || typeof eventSlug !== 'string') errors.push('eventSlug is required');
    if (!name || typeof name !== 'string' || name.trim().length < 2) errors.push('name is required (min 2 chars)');
    if (!email || !isValidEmail(email)) errors.push('A valid email is required');
    if (!school || typeof school !== 'string' || school.trim().length < 2) errors.push('school is required');

    if (errors.length > 0) {
      return {
        statusCode: 400,
        headers: writeHeaders(),
        body: JSON.stringify({ error: 'Validation failed', details: errors }),
      };
    }

    // ── Rate-limit ──────────────────────────────────────
    if (isRateLimited(email.toLowerCase().trim())) {
      return {
        statusCode: 429,
        headers: writeHeaders(),
        body: JSON.stringify({ error: 'Too many registrations. Please try again later.' }),
      };
    }

    // ── Look up event by slug ───────────────────────────
    const eventRecords = await fetchRecords(TABLE_EVENTS, {
      filterByFormula: `{slug} = "${escapeFormulaValue(eventSlug)}"`,
      maxRecords: 1,
      fields: ['name', 'slug', 'status'],
    });

    if (eventRecords.length === 0) {
      return {
        statusCode: 404,
        headers: writeHeaders(),
        body: JSON.stringify({ error: 'Event not found' }),
      };
    }

    const eventRec = eventRecords[0];

    // ── Create Participant record ───────────────────────
    const fields: Record<string, any> = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      school: school.trim(),
      event: [eventRec.id], // linked record
    };

    if (extraInfo && typeof extraInfo === 'string' && extraInfo.trim().length > 0) {
      fields.extraInfo = extraInfo.trim();
    }

    // Try creating the record. If Airtable rejects an unknown field
    // (e.g. extraInfo column doesn't exist yet), retry without it.
    let created;
    try {
      created = await createRecord(TABLE_PARTICIPANTS, fields);
    } catch (err: any) {
      if (fields.extraInfo && err.message?.includes('UNKNOWN_FIELD_NAME')) {
        delete fields.extraInfo;
        created = await createRecord(TABLE_PARTICIPANTS, fields);
      } else {
        throw err;
      }
    }

    return {
      statusCode: 201,
      headers: writeHeaders(),
      body: JSON.stringify({
        success: true,
        participant: {
          id: created.id,
          name: created.fields.name,
          school: created.fields.school,
          event: eventRec.fields.name,
        },
        message: `You're registered for ${eventRec.fields.name}! Check your email for updates.`,
      }),
    };
  } catch (err: any) {
    console.error('register-participant error:', err);
    return {
      statusCode: 500,
      headers: writeHeaders(),
      body: JSON.stringify({ error: 'Registration failed. Please try again.' }),
    };
  }
};

export { handler };
