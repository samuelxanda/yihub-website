import type { Handler } from '@netlify/functions';
import {
  fetchRecords,
  createRecord,
  TABLE_EVENTS,
  TABLE_PROJECTS,
  TABLE_PARTICIPANTS,
  writeHeaders,
} from './utils/airtable';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Turn a title into a URL-safe slug with a random suffix to avoid collisions. */
function makeSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

/**
 * POST /.netlify/functions/submit-project
 * Body: {
 *   eventSlug, title, shortDescription, fullDescription?,
 *   category[], projectUrl?, githubUrl?, thumbnailUrl?,
 *   school, teamLeadEmail, teamMemberEmails[]
 * }
 */
const handler: Handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: writeHeaders(), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: writeHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body ?? '{}');
    const {
      eventSlug,
      title,
      shortDescription,
      fullDescription,
      category,
      projectUrl,
      githubUrl,
      thumbnailUrl,
      school,
      teamLeadEmail,
      teamMemberEmails,
    } = body;

    // ── Validation ──────────────────────────────────────
    const errors: string[] = [];
    if (!eventSlug || typeof eventSlug !== 'string') errors.push('eventSlug is required');
    if (!title || typeof title !== 'string' || title.trim().length < 3) errors.push('title is required (min 3 chars)');
    if (!shortDescription || typeof shortDescription !== 'string' || shortDescription.trim().length < 10)
      errors.push('shortDescription is required (min 10 chars)');
    if (!category || !Array.isArray(category) || category.length === 0)
      errors.push('At least one category is required');
    if (!school || typeof school !== 'string' || school.trim().length < 2)
      errors.push('school is required');
    if (!teamLeadEmail || !isValidEmail(teamLeadEmail))
      errors.push('A valid teamLeadEmail is required');
    if (teamMemberEmails !== undefined && !Array.isArray(teamMemberEmails))
      errors.push('teamMemberEmails must be an array');

    if (errors.length > 0) {
      return {
        statusCode: 400,
        headers: writeHeaders(),
        body: JSON.stringify({ error: 'Validation failed', details: errors }),
      };
    }

    // ── Look up event by slug ───────────────────────────
    const eventRecords = await fetchRecords(TABLE_EVENTS, {
      filterByFormula: `{slug} = "${eventSlug}"`,
      maxRecords: 1,
      fields: ['name', 'slug', 'submissionOpen'],
    });

    if (eventRecords.length === 0) {
      return {
        statusCode: 404,
        headers: writeHeaders(),
        body: JSON.stringify({ error: 'Event not found' }),
      };
    }

    const eventRec = eventRecords[0];

    // ── Check submissions open ──────────────────────────
    if (!eventRec.fields.submissionOpen) {
      return {
        statusCode: 403,
        headers: writeHeaders(),
        body: JSON.stringify({
          error: 'Submissions are closed for this event.',
          message: 'Project submissions are no longer being accepted for this event. Contact the organiser if you believe this is an error.',
        }),
      };
    }

    // ── R6/H: Check if team lead is a registered participant ──
    const leadEmail = teamLeadEmail.toLowerCase().trim();
    let staffNotes = '';
    try {
      const participants = await fetchRecords(TABLE_PARTICIPANTS, {
        filterByFormula: `AND({email} = "${leadEmail}")`,
        maxRecords: 100,
        fields: ['email', 'event'],
      });
      const isRegistered = participants.some((p) => {
        const linked: string[] = (p.fields.event as string[]) ?? [];
        return linked.includes(eventRec.id);
      });
      if (!isRegistered) {
        staffNotes = 'Lead not registered as participant for this event';
      }
    } catch {
      // Non-blocking: if participant check fails, allow submission anyway
      staffNotes = 'Could not verify lead registration';
    }

    // ── Build fields ────────────────────────────────────
    const slug = makeSlug(title);
    const memberEmailsStr = Array.isArray(teamMemberEmails)
      ? teamMemberEmails.filter((e: string) => isValidEmail(e)).join(', ')
      : '';

    const fields: Record<string, any> = {
      title: title.trim(),
      slug,
      shortDescription: shortDescription.trim(),
      category, // multi-select array
      school: school.trim(),
      status: 'Pending',
      teamLeadEmail: leadEmail,
      submittedAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      event: [eventRec.id], // linked record
      ...(staffNotes ? { staffNotes } : {}),
    };

    if (fullDescription && typeof fullDescription === 'string' && fullDescription.trim().length > 0) {
      fields.fullDescription = fullDescription.trim();
    }
    if (projectUrl && typeof projectUrl === 'string') {
      fields.projectUrl = projectUrl.trim();
    }
    if (githubUrl && typeof githubUrl === 'string') {
      fields.githubUrl = githubUrl.trim();
    }
    if (thumbnailUrl && typeof thumbnailUrl === 'string') {
      fields.thumbnailUrl = thumbnailUrl.trim();
    }
    if (memberEmailsStr) {
      fields.teamMemberEmails = memberEmailsStr;
    }

    // ── Create Project record ───────────────────────────
    const created = await createRecord(TABLE_PROJECTS, fields);

    return {
      statusCode: 201,
      headers: writeHeaders(),
      body: JSON.stringify({
        success: true,
        project: {
          id: created.id,
          title: created.fields.title,
          slug: created.fields.slug,
          status: 'Pending',
        },
        message: 'Your project has been submitted and is pending review. Our team will review it shortly.',
      }),
    };
  } catch (err: any) {
    console.error('submit-project error:', err);
    return {
      statusCode: 500,
      headers: writeHeaders(),
      body: JSON.stringify({ error: 'Project submission failed. Please try again.' }),
    };
  }
};

export { handler };
