import type { Handler } from '@netlify/functions';
import {
  fetchRecords,
  TABLE_EVENTS,
  TABLE_PARTICIPANTS,
  jsonHeaders,
  escapeFormulaValue,
} from './utils/airtable';

/**
 * GET /.netlify/functions/check-registration?eventSlug=xxx&email=yyy
 * Returns { registered: boolean } — never exposes participant details.
 */
const handler: Handler = async (event) => {
  const email = event.queryStringParameters?.email?.toLowerCase().trim();
  const eventSlug = event.queryStringParameters?.eventSlug;

  if (!email || !eventSlug) {
    return {
      statusCode: 400,
      headers: jsonHeaders(),
      body: JSON.stringify({ error: 'Missing email or eventSlug', registered: false }),
    };
  }

  try {
    // 1. Look up event
    const eventRecords = await fetchRecords(TABLE_EVENTS, {
      filterByFormula: `{slug} = "${escapeFormulaValue(eventSlug)}"`,
      maxRecords: 1,
      fields: ['slug', 'status'],
    });

    if (eventRecords.length === 0 || (eventRecords[0].fields.status ?? '') === 'Hidden') {
      return {
        statusCode: 404,
        headers: jsonHeaders(),
        body: JSON.stringify({ error: 'Event not found', registered: false }),
      };
    }

    const eventId = eventRecords[0].id

    // 2. Check if a participant with this email is linked to this event
    const participants = await fetchRecords(TABLE_PARTICIPANTS, {
      filterByFormula: `{email} = "${escapeFormulaValue(email)}"`,
      maxRecords: 100,
      fields: ['email', 'event'],
    });

    const registered = participants.some((p) => {
      const linked: string[] = (p.fields.event as string[]) ?? [];
      return linked.includes(eventId);
    });

    return {
      statusCode: 200,
      headers: jsonHeaders(),
      body: JSON.stringify({ registered }),
    };
  } catch (err: any) {
    console.error('check-registration error:', err);
    return {
      statusCode: 500,
      headers: jsonHeaders(),
      body: JSON.stringify({ error: 'Check failed', registered: false }),
    };
  }
};

export { handler };
