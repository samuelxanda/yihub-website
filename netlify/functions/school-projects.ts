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
    // Fetch all approved projects with school field
    const records = await fetchRecords(TABLE_PROJECTS, {
      filterByFormula: `{status} = "Approved"`,
      sort: [{ field: 'title', direction: 'asc' }],
      fields: [
        'title',
        'slug',
        'category',
        'shortDescription',
        'projectUrl',
        'thumbnailUrl',
        'school',
        'submittedAt',
      ],
    });

    // Filter client-side by slug match (since Airtable doesn't have a slug field for school)
    const toSlug = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const projects = records
      .filter((r) => {
        const school = r.fields.school;
        return school && toSlug(school) === schoolSlug;
      })
      .map((r) => ({
        id: r.id,
        title: r.fields.title,
        slug: r.fields.slug,
        category: r.fields.category ?? [],
        shortDescription: r.fields.shortDescription ?? '',
        projectUrl: r.fields.projectUrl ?? null,
        thumbnailUrl: r.fields.thumbnailUrl ?? null,
        school: r.fields.school,
        submittedAt: r.fields.submittedAt ?? null,
      }));

    // Derive the display name from the first matching project
    const schoolName = projects.length > 0 ? projects[0].school : schoolSlug;

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
