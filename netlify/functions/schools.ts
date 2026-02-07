import type { Handler } from '@netlify/functions';
import { fetchRecords, TABLE_PROJECTS, jsonHeaders, PROJECT_FIELDS, normaliseProject } from './utils/airtable';

/**
 * GET /.netlify/functions/schools
 * Returns unique school names derived from Approved projects.
 */
const handler: Handler = async () => {
  try {
    const records = await fetchRecords(TABLE_PROJECTS, {
      filterByFormula: `{status} = "Approved"`,
      fields: PROJECT_FIELDS,
    });

    const slugify = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const seen = new Set<string>();
    const schools: { name: string; slug: string }[] = [];

    for (const r of records) {
      const n = normaliseProject(r.fields);
      const name = n.school;
      if (name && !seen.has(name)) {
        seen.add(name);
        schools.push({ name, slug: slugify(name) });
      }
    }

    schools.sort((a, b) => a.name.localeCompare(b.name));

    return {
      statusCode: 200,
      headers: jsonHeaders(),
      body: JSON.stringify({ schools }),
    };
  } catch (err: any) {
    console.error('Error fetching schools:', err);
    return {
      statusCode: 500,
      headers: jsonHeaders(),
      body: JSON.stringify({ error: 'Failed to fetch schools' }),
    };
  }
};

export { handler };
