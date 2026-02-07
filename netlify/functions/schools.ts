import type { Handler } from '@netlify/functions';
import { fetchRecords, TABLE_PROJECTS, jsonHeaders } from './utils/airtable';

/**
 * GET /.netlify/functions/schools
 * Returns unique school names derived from Approved projects.
 */
const handler: Handler = async () => {
  try {
    const records = await fetchRecords(TABLE_PROJECTS, {
      filterByFormula: `{status} = "Approved"`,
      fields: ['school'],
    });

    const schoolSet = new Set<string>();
    for (const r of records) {
      const school = r.fields.school;
      if (school && typeof school === 'string' && school.trim()) {
        schoolSet.add(school.trim());
      }
    }

    const schools = Array.from(schoolSet)
      .sort()
      .map((name) => ({
        name,
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      }));

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
