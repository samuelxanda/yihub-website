import type { Handler } from '@netlify/functions';
import { fetchRecords, TABLE_PROJECTS, jsonHeaders } from './utils/airtable';

/**
 * GET /.netlify/functions/schools
 * Returns unique school names derived from Approved projects.
 */
const handler: Handler = async () => {
  try {
    // NOTE: The Airtable 'school' column actually holds thumbnailUrl
    // due to shifted columns. There is no dedicated school column.
    // We return an empty list until the Airtable schema is fixed.
    const schools: { name: string; slug: string }[] = [];

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
