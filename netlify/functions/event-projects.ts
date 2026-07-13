import type { Handler } from '@netlify/functions';
import { fetchRecords, TABLE_EVENTS, TABLE_PROJECTS, jsonHeaders, PROJECT_FIELDS, normaliseProject, escapeFormulaValue } from './utils/airtable';

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
      filterByFormula: `{slug} = "${escapeFormulaValue(slug)}"`,
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

    if ((eventRec.fields.status ?? '') === 'Hidden') {
      return {
        statusCode: 404,
        headers: jsonHeaders(),
        body: JSON.stringify({ error: 'Event not found' }),
      };
    }

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

    // 2. Fetch approved projects, then filter by event link in JS
    //    (ARRAYJOIN doesn't work on linked-record fields in Airtable API filters)
    const allApproved = await fetchRecords(TABLE_PROJECTS, {
      filterByFormula: `{status} = "Approved"`,
      sort: [{ field: 'title', direction: 'asc' }],
      fields: [...PROJECT_FIELDS, 'event'],
    });

    const projectRecords = allApproved.filter((r) => {
      const linked: string[] = (r.fields.event as string[]) ?? [];
      return linked.includes(eventRec.id);
    });

    const projects = projectRecords.map((r) => {
      const n = normaliseProject(r.fields);
      return {
        id: r.id,
        title: r.fields.title,
        slug: r.fields.slug,
        category: r.fields.category ?? [],
        shortDescription: n.shortDescription,
        projectUrl: n.projectUrl,
        thumbnailUrl: n.thumbnailUrl,
        school: n.school,
        submittedAt: n.submittedAt,
      };
    });

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
