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
    //
    // IMPORTANT: Airtable columns after shortDescription are still
    // shifted by one position. shortDescription is now its own column.
    const projectRecords = await fetchRecords(TABLE_PROJECTS, {
      filterByFormula: `AND({slug} = "${slug}", {status} = "Approved")`,
      maxRecords: 1,
      fields: [
        'title',
        'slug',
        'category',
        'shortDescription',   // ✅ now correct
        'fullDescription',     // actually holds old short desc (ignored)
        'projectUrl',          // actually holds fullDescription
        'githubUrl',           // actually holds projectUrl
        'thumbnailUrl',        // actually holds githubUrl
        'school',              // actually holds thumbnailUrl
        'staffNotes',          // actually holds submittedAt
        'teamMemberEmails',    // actually holds teamLeadEmail
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

    const f = projectRecords[0].fields;

    // 2. Resolve linked event
    let eventData = null;
    const eventIds: string[] = f.event ?? [];
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

    // Remap shifted Airtable columns → correct frontend fields
    const project = {
      id: projectRecords[0].id,
      title: f.title,
      slug: f.slug,
      category: f.category ?? [],
      shortDescription: f.shortDescription ?? '',
      fullDescription: f.projectUrl ?? null,
      projectUrl: f.githubUrl ?? null,
      githubUrl: f.thumbnailUrl ?? null,
      thumbnailUrl: f.school ?? null,
      school: null,
      teamLeadEmail: f.teamMemberEmails ?? null,
      teamMemberEmails: null,
      submittedAt: f.staffNotes ?? null,
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
