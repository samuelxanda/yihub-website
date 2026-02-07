import type { Handler } from '@netlify/functions';
import { fetchRecords, TABLE_EVENTS, TABLE_PROJECTS, jsonHeaders } from './utils/airtable';

/**
 * GET /.netlify/functions/event-projects?slug=my-event-slug
 * Returns event details + approved projects for that event.
 */
const handler: Handler = async (event) => {
  const slug = event.queryStringParameters?.slug;

  if (!slug) {
    return {
      statusCode: 400,
      headers: jsonHeaders(),
      body: JSON.stringify({ error: 'Missing "slug" query parameter' }),
    };
  }

  try {
    // 1. Fetch the event by slug
    const eventRecords = await fetchRecords(TABLE_EVENTS, {
      filterByFormula: `{slug} = "${slug}"`,
      maxRecords: 1,
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

    if (eventRecords.length === 0) {
      return {
        statusCode: 404,
        headers: jsonHeaders(),
        body: JSON.stringify({ error: 'Event not found' }),
      };
    }

    const eventRec = eventRecords[0];
    const eventData = {
      id: eventRec.id,
      name: eventRec.fields.name,
      slug: eventRec.fields.slug,
      startDate: eventRec.fields.startDate,
      endDate: eventRec.fields.endDate ?? null,
      location: eventRec.fields.location ?? null,
      status: eventRec.fields.status ?? 'Upcoming',
      submissionOpen: eventRec.fields.submissionOpen ?? false,
      description: eventRec.fields.description ?? null,
      coverImageUrl: eventRec.fields.coverImageUrl ?? null,
    };

    // 2. Fetch approved projects linked to this event
    const projectRecords = await fetchRecords(TABLE_PROJECTS, {
      filterByFormula: `AND(FIND("${eventRec.id}", ARRAYJOIN(event)), {status} = "Approved")`,
      sort: [{ field: 'title', direction: 'asc' }],
      fields: [
        'title',
        'slug',
        'category',
        'shortDescription',
        'projectUrl',
        'thumbnailUrl',
        'school',
        'teamLeadEmail',
        'submittedAt',
      ],
    });

    const projects = projectRecords.map((r) => ({
      id: r.id,
      title: r.fields.title,
      slug: r.fields.slug,
      category: r.fields.category ?? [],
      shortDescription: r.fields.shortDescription ?? '',
      projectUrl: r.fields.projectUrl ?? null,
      thumbnailUrl: r.fields.thumbnailUrl ?? null,
      school: r.fields.school ?? null,
      submittedAt: r.fields.submittedAt ?? null,
    }));

    return {
      statusCode: 200,
      headers: jsonHeaders(),
      body: JSON.stringify({ event: eventData, projects }),
    };
  } catch (err: any) {
    console.error('Error fetching event projects:', err);
    return {
      statusCode: 500,
      headers: jsonHeaders(),
      body: JSON.stringify({ error: 'Failed to fetch event data' }),
    };
  }
};

export { handler };
