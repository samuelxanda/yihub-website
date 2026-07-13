import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Upload,
  X,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import ShowcaseLayout from '../components/ShowcaseLayout';
import { getEventWithProjects, checkRegistration, postJSON } from '../lib/api';
import type { EventSummary } from '../lib/showcase-types';

const CATEGORY_OPTIONS = [
  'AI/ML',
  'Web',
  'Mobile',
  'IoT',
  'Hardware',
  'Game',
  'Data Science',
  'Cybersecurity',
  'Education',
  'Health',
  'Environment',
  'Finance',
  'Social Impact',
  'Other',
];

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#438CAF] transition-colors';

const ProjectSubmissionPage: React.FC = () => {
  const { eventSlug } = useParams<{ eventSlug: string }>();

  // Event data
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [projectUrl, setProjectUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [school, setSchool] = useState('');
  const [teamLeadEmail, setTeamLeadEmail] = useState('');
  const [memberEmailInput, setMemberEmailInput] = useState('');
  const [teamMemberEmails, setTeamMemberEmails] = useState<string[]>([]);
  const [memberEmailError, setMemberEmailError] = useState<string | null>(null);

  // Form state
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ message: string; slug: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [submissionClosed, setSubmissionClosed] = useState(false);

  // Registration verification gate
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    setVerifying(true);
    try {
      const isRegistered = await checkRegistration(eventSlug!, verifyEmail.trim());
      if (isRegistered) {
        setVerified(true);
        setTeamLeadEmail(verifyEmail.trim().toLowerCase());
      } else {
        setVerifyError('This email is not registered for this event. You must register before submitting a project.');
      }
    } catch {
      setVerifyError('Could not verify registration. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    setVerified(false);
    setVerifyEmail('');
    setVerifyError(null);
    setTeamLeadEmail('');
    setSubmissionClosed(false);
  }, [eventSlug]);

  useEffect(() => {
    if (!eventSlug) return;
    getEventWithProjects(eventSlug)
      .then(({ event: e }) => {
        setEvent(e);
        if (!e.submissionOpen) setSubmissionClosed(true);
        document.title = `Submit Project — ${e.name} — Youth Innovators Hub`;
      })
      .catch((err) => setEventError(err.message))
      .finally(() => setLoadingEvent(false));
  }, [eventSlug]);

  // ── Team member email chip management ─────────────────
  const addMemberEmail = () => {
    const trimmed = memberEmailInput.trim().toLowerCase();
    if (!trimmed) {
      setMemberEmailError('Enter an email to add.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMemberEmailError('Enter a valid email address.');
      return;
    }
    if (teamMemberEmails.includes(trimmed)) {
      setMemberEmailError('That email is already added.');
      return;
    }
    setTeamMemberEmails([...teamMemberEmails, trimmed]);
    setMemberEmailInput('');
    setMemberEmailError(null);
  };

  const removeMemberEmail = (email: string) => {
    setTeamMemberEmails(teamMemberEmails.filter((e) => e !== email));
  };

  const handleMemberKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addMemberEmail();
    }
  };

  // ── Category toggle ───────────────────────────────────
  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // ── Submit ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors([]);
    setSubmitting(true);

    try {
      const data = await postJSON<{
        message: string;
        project?: { slug: string };
      }>('/submit-project', {
        eventSlug,
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim() || undefined,
        category: categories,
        projectUrl: projectUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        school: school.trim(),
        teamLeadEmail: teamLeadEmail.trim(),
        teamMemberEmails,
      });

      setSuccess({ message: data.message, slug: data.project?.slug ?? '' });
    } catch (err: any) {
      if (err.status === 403) {
        setSubmissionClosed(true);
      }
      if (err.details) setFieldErrors(err.details);
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ───────────────────────────────────────────
  if (loadingEvent) {
    return (
      <ShowcaseLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white/40 gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest">Loading event…</p>
        </div>
      </ShowcaseLayout>
    );
  }

  if (eventError || !event) {
    return (
      <ShowcaseLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-lg font-bold text-red-400">{eventError ?? 'Event not found'}</p>
          <Link
            to="/events"
            className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#438CAF] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
        </div>
      </ShowcaseLayout>
    );
  }

  // ── Submissions closed ────────────────────────────────
  if (submissionClosed) {
    return (
      <ShowcaseLayout>
        <div className="px-4 md:px-8 lg:px-16 pt-6">
          <div className="max-w-2xl mx-auto">
            <Link
              to={`/events/${eventSlug}`}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-[#438CAF] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to {event.name}
            </Link>
          </div>
        </div>
        <section className="px-4 md:px-8 lg:px-16 py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
              Submissions Closed
            </h1>
            <p className="text-white/60 text-base mb-8">
              Project submissions are no longer being accepted for <span className="text-[#438CAF] font-bold">{event.name}</span>. Contact the organisers if you believe this is an error.
            </p>
            <Link
              to={`/events/${eventSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/10 text-white text-sm font-black uppercase tracking-widest hover:border-[#438CAF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Event
            </Link>
          </div>
        </section>
      </ShowcaseLayout>
    );
  }

  // ── Success state ─────────────────────────────────────
  if (success) {
    return (
      <ShowcaseLayout>
        <div className="px-4 md:px-8 lg:px-16 pt-6">
          <div className="max-w-2xl mx-auto">
            <Link
              to={`/events/${eventSlug}`}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-[#438CAF] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to {event.name}
            </Link>
          </div>
        </div>
        <section className="px-4 md:px-8 lg:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
              Project Submitted!
            </h1>
            <p className="text-white/60 text-base mb-4">{success.message}</p>
            <div className="inline-block px-4 py-2 rounded-full bg-amber-500/15 text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-500/30 mb-8">
              Status: Pending Review
            </div>
            <br />
            <Link
              to={`/events/${eventSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#438CAF] text-white text-sm font-black uppercase tracking-widest hover:bg-[#438CAF]/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Event
            </Link>
          </motion.div>
        </section>
      </ShowcaseLayout>
    );
  }

  // ── Registration verification gate ────────────────────
  if (!verified) {
    return (
      <ShowcaseLayout>
        <div className="px-4 md:px-8 lg:px-16 pt-6">
          <div className="max-w-2xl mx-auto">
            <Link
              to={`/events/${eventSlug}`}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-[#438CAF] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to {event.name}
            </Link>
          </div>
        </div>

        <section className="px-4 md:px-8 lg:px-16 pt-8 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className="flex items-center gap-3 mb-2">
              <Upload className="w-6 h-6 text-[#438CAF]" />
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                Submit Project
              </h1>
            </div>
            <p className="text-white/50 text-sm mb-8">
              To submit a project for <span className="text-[#438CAF] font-bold">{event.name}</span>, you must first be a registered participant.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
              <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-4">
                Verify Your Registration
              </p>
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-1.5">
                    Your Registered Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={verifyEmail}
                    onChange={(e) => { setVerifyEmail(e.target.value); setVerifyError(null); }}
                    className={inputClass}
                    placeholder="Enter the email you registered with"
                  />
                </div>

                {verifyError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm">
                    <p className="text-red-400 font-bold text-xs mb-2">{verifyError}</p>
                    <Link
                      to={`/events/${eventSlug}/register`}
                      className="inline-flex items-center gap-1.5 text-[#438CAF] text-xs font-black uppercase tracking-widest hover:underline"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" /> Register for this event first
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full py-3 rounded-full bg-[#438CAF] text-white text-sm font-black uppercase tracking-widest hover:bg-[#438CAF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Checking…</>
                  ) : (
                    <><ShieldAlert className="w-4 h-4" /> Verify &amp; Continue</>
                  )}
                </button>
              </form>
            </div>

            <p className="text-center text-white/30 text-xs mt-6">
              Not registered yet?{' '}
              <Link to={`/events/${eventSlug}/register`} className="text-[#438CAF] font-bold hover:underline">
                Register here
              </Link>
            </p>
          </motion.div>
        </section>
      </ShowcaseLayout>
    );
  }

  // ── Form (shown only after registration is verified) ──
  return (
    <ShowcaseLayout>
      {/* Breadcrumb */}
      <div className="px-4 md:px-8 lg:px-16 pt-6">
        <div className="max-w-2xl mx-auto">
          <Link
            to={`/events/${eventSlug}`}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-[#438CAF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {event.name}
          </Link>
        </div>
      </div>

      <section className="px-4 md:px-8 lg:px-16 pt-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-2">
            <Upload className="w-6 h-6 text-[#438CAF]" />
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Submit Project
            </h1>
          </div>
          <p className="text-white/50 text-sm mb-2">
            Submit your project for <span className="text-[#438CAF] font-bold">{event.name}</span>. It will be reviewed by our team before appearing publicly.
          </p>
          <p className="text-xs text-emerald-400/70 font-bold mb-8 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified as {teamLeadEmail}
          </p>

          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <p className="font-bold mb-1">{formError}</p>
              {fieldErrors.length > 0 && (
                <ul className="list-disc list-inside text-red-400/80 text-xs space-y-0.5">
                  {fieldErrors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── Team Info ──────────────────────────── */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 pt-2">Team Information</p>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Team Lead Email
              </label>
              <input
                type="email"
                value={teamLeadEmail}
                readOnly
                className={`${inputClass} opacity-60 cursor-not-allowed`}
              />
              <p className="text-[10px] text-white/30 mt-1">Verified from your registration. This cannot be changed.</p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Team Member Emails
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={memberEmailInput}
                  onChange={(e) => {
                    setMemberEmailInput(e.target.value);
                    setMemberEmailError(null);
                  }}
                  onKeyDown={handleMemberKeyDown}
                  className={`flex-1 ${inputClass}`}
                  placeholder="member@school.edu — press Enter to add"
                />
                <button
                  type="button"
                  onClick={addMemberEmail}
                  className="px-3 rounded-xl bg-white/10 border border-white/10 text-white hover:border-[#438CAF] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {teamMemberEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {teamMemberEmails.map((em) => (
                    <span
                      key={em}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#438CAF]/15 text-[#438CAF] text-xs font-bold border border-[#438CAF]/20"
                    >
                      {em}
                      <button type="button" onClick={() => removeMemberEmail(em)} className="hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {memberEmailError && (
                <p className="text-[10px] text-red-400 mt-2">{memberEmailError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                School / Institution <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                minLength={2}
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className={inputClass}
                placeholder="e.g. University of Rwanda"
              />
            </div>

            <hr className="border-white/10" />

            {/* ── Project Details ────────────────────── */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 pt-2">Project Details</p>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Project Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                minLength={3}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="e.g. SmartBin — IoT Waste Management"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
                      categories.includes(cat)
                        ? 'bg-[#438CAF]/20 text-[#438CAF] border-[#438CAF]/40'
                        : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {categories.length === 0 && (
                <p className="text-[10px] text-white/30 mt-1">Select at least one category</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Short Description <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                minLength={10}
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="One or two sentences about what your project does."
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Full Description
              </label>
              <textarea
                rows={4}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="Detailed explanation — how it works, technologies used, impact…"
              />
            </div>

            <hr className="border-white/10" />

            {/* ── Links ──────────────────────────────── */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 pt-2">Links</p>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Live Project URL
              </label>
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className={inputClass}
                placeholder="https://myproject.example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className={inputClass}
                placeholder="https://github.com/your-org/your-repo"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className={inputClass}
                placeholder="https://res.cloudinary.com/…/image/upload/…"
              />
              <p className="text-[10px] text-white/30 mt-1">
                Upload your image to{' '}
                <a
                  href="https://cloudinary.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#438CAF] underline"
                >
                  Cloudinary
                </a>{' '}
                and paste the URL here. Recommended size: 800×450px.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || categories.length === 0}
              className="w-full py-3.5 rounded-full bg-[#438CAF] text-white text-sm font-black uppercase tracking-widest hover:bg-[#438CAF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Submit Project
                </>
              )}
            </button>
          </form>
        </motion.div>
      </section>
    </ShowcaseLayout>
  );
};

export default ProjectSubmissionPage;
