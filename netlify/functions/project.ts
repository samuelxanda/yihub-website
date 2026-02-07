import type { Handler } from '@netlify/functions';
import { fetchRecords, TABLE_PROJECTS, TABLE_EVENTS, jsonHeaders } from './utils/airtable';

/**
 * GET /.netlify/functions/project?slug=my-project-slug
 * Returns a single approved project's full details + its event info.
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
    // 1. Fetch project by slug (only if Approved)
    const projectRecords = await fetchRecords(TABLE_PROJECTS, {
      filterByFormula: `AND({slug} = "${slug}", {status} = "Approved")`,
      maxRecords: 1,
      fields: [
        'title',
        'slug',
        'category',
        'shortDescription',
        'fullDescription',
        'projectUrl',
        'githubUrl',
        'thumbnailUrl',
        'school',
        'teamLeadEmail',
        'teamMemberEmails',
        'submittedAt',
        'event',
      ],
    });

    if (projectRecords.length === 0) {
      return {
        statusCode: 404,
        headers: jsonHeaders(),
        body: JSON.stringify({ error: 'Project not found' }),
      };
    }

    const projRec = projectRecords[0];

    // 2. Resolve linked event
    let eventData = null;
    const eventIds: string[] = projRec.fields.event ?? [];
    if (eventIds.length > 0) {
      const eventRecords = await fetchRecords(TABLE_EVENTS, {
        filterByFormula: `RECORD_ID() = "${eventIds[0]}"`,
        maxRecords: 1,
        fields: ['name', 'slug'],
      });
      if (eventRecords.length > 0) {
        eventData = {
          id: eventRecords[0].id,
          name: eventRecords[0].fields.name,
          slug: eventRecords[0].fields.slug,
        };
      }
    }

    const project = {
      id: projRec.id,
      title: projRec.fields.title,
      slug: projRec.fields.slug,
      category: projRec.fields.category ?? [],
      shortDescription: projRec.fields.shortDescription ?? '',
      fullDescription: projRec.fields.fullDescription ?? null,
      projectUrl: projRec.fields.projectUrl ?? null,
      githubUrl: projRec.fields.githubUrl ?? null,
      thumbnailUrl: projRec.fields.thumbnailUrl ?? null,
      school: projRec.fields.school ?? null,
      teamLeadEmail: projRec.fields.teamLeadEmail ?? null,
      teamMemberEmails: projRec.fields.teamMemberEmails ?? null,
      submittedAt: projRec.fields.submittedAt ?? null,
      event: eventData,
    };

    return {
      statusCode: 200,
      headers: jsonHeaders(),
      body: JSON.stringify({ project }),
    };
  } catch (err: any) {
    console.error('Error fetching project:', err);
    return {
      statusCode: 500,
      headers: jsonHeaders(),
      body: JSON.stringify({ error: 'Failed to fetch project' }),
    };
  }
};

export { handler };
