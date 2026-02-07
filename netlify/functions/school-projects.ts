import type { Handler } from '@netlify/functions';
import { fetchRecords, TABLE_PROJECTS, jsonHeaders } from './utils/airtable';

/**
 * GET /.netlify/functions/school-projects?school=school-slug
 * Returns approved projects for a given school (matched by slug).
 */
const handler: Handler = async (event) => {
  const schoolSlug = event.queryStringParameters?.school;

  if (!schoolSlug) {
    return {
      statusCode: 400,
      headers: jsonHeaders(),
      body: JSON.stringify({ error: 'Missing "school" query parameter' }),
    };
  }

  try {
    // NOTE: The Airtable 'school' column actually holds thumbnailUrl
    // due to shifted columns. We remap fields for project cards.
    const records = await fetchRecords(TABLE_PROJECTS, {
      filterByFormula: `{status} = "Approved"`,
      sort: [{ field: 'title', direction: 'asc' }],
      fields: [
        'title',
        'slug',
        'category',
        'fullDescription',   // → shortDescription
        'githubUrl',          // → projectUrl
        'school',             // → thumbnailUrl
        'staffNotes',         // → submittedAt
      ],
    });

    // No real school column exists in the current Airtable schema,
    // so we return all approved projects for now.
    const projects = records.map((r) => ({
      id: r.id,
      title: r.fields.title,
      slug: r.fields.slug,
      category: r.fields.category ?? [],
      shortDescription: r.fields.fullDescription ?? '',
      projectUrl: r.fields.githubUrl ?? null,
      thumbnailUrl: r.fields.school ?? null,
      school: null,
      submittedAt: r.fields.staffNotes ?? null,
    }));

    const schoolName = schoolSlug;

    return {
      statusCode: 200,
      headers: jsonHeaders(),
      body: JSON.stringify({ school: schoolName, projects }),
    };
  } catch (err: any) {
    console.error('Error fetching school projects:', err);
    return {
      statusCode: 500,
      headers: jsonHeaders(),
      body: JSON.stringify({ error: 'Failed to fetch school projects' }),
    };
  }
};

export { handler };
