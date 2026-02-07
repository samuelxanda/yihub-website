import type { Handler } from '@netlify/functions';
import { fetchRecords, TABLE_PROJECTS, TABLE_EVENTS, jsonHeaders, PROJECT_FIELDS, normaliseProject } from './utils/airtable';

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
    const projectRecords = await fetchRecords(TABLE_PROJECTS, {
      filterByFormula: `AND({slug} = "${slug}", {status} = "Approved")`,
      maxRecords: 1,
      fields: PROJECT_FIELDS,
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

    const n = normaliseProject(f);
    // R12+R15: Never expose staffNotes or personal emails to public
    const project = {
      id: projectRecords[0].id,
      title: f.title,
      slug: f.slug,
      category: f.category ?? [],
      shortDescription: n.shortDescription,
      fullDescription: n.fullDescription,
      projectUrl: n.projectUrl,
      githubUrl: n.githubUrl,
      thumbnailUrl: n.thumbnailUrl,
      school: n.school,
      submittedAt: n.submittedAt,
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
