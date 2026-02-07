import type { Handler } from '@netlify/functions';
import { fetchRecords, TABLE_PROJECTS, jsonHeaders, PROJECT_FIELDS, normaliseProject } from './utils/airtable';

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
    const records = await fetchRecords(TABLE_PROJECTS, {
      filterByFormula: `{status} = "Approved"`,
      sort: [{ field: 'title', direction: 'asc' }],
      fields: PROJECT_FIELDS,
    });

    const projects = records.map((r) => {
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
