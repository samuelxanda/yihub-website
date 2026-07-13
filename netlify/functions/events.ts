import type { Handler } from '@netlify/functions';
import { fetchRecords, TABLE_EVENTS, jsonHeaders } from './utils/airtable';

/**
 * GET /.netlify/functions/events
 * Returns all events, sorted by startDate descending.
 */
const handler: Handler = async () => {
  try {
    const records = await fetchRecords(TABLE_EVENTS, {
      sort: [{ field: 'startDate', direction: 'desc' }],
      fields: [
        'name',
        'slug',
        'startDate',
        'endDate',
        'location',
        'status',
        'submissionOpen',
        'description',
        'coverImageUrl',
      ],
    });

    // Omit Hidden events — set status to "Hidden" in Airtable to take an event offline
    const events = records
      .filter((r) => (r.fields.status ?? 'Upcoming') !== 'Hidden')
      .map((r) => ({
        id: r.id,
        name: r.fields.name,
        slug: r.fields.slug,
        startDate: r.fields.startDate,
        endDate: r.fields.endDate ?? null,
        location: r.fields.location ?? null,
        status: r.fields.status ?? 'Upcoming',
        submissionOpen: r.fields.submissionOpen ?? false,
        description: r.fields.description ?? null,
        coverImageUrl: r.fields.coverImageUrl ?? null,
      }));

    return {
      statusCode: 200,
      headers: jsonHeaders(),
      body: JSON.stringify({ events }),
    };
  } catch (err: any) {
    console.error('Error fetching events:', err);
    return {
      statusCode: 500,
      headers: jsonHeaders(),
      body: JSON.stringify({ error: 'Failed to fetch events' }),
    };
  }
};

export { handler };
