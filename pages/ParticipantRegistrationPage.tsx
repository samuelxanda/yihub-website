import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UserPlus,
} from 'lucide-react';
import ShowcaseLayout from '../components/ShowcaseLayout';
import { getEventWithProjects, postJSON } from '../lib/api';
import type { EventSummary } from '../lib/showcase-types';

const ParticipantRegistrationPage: React.FC = () => {
  const { eventSlug } = useParams<{ eventSlug: string }>();

  // Event data
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [level, setLevel] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState('');

  // Form state
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!eventSlug) return;
    getEventWithProjects(eventSlug)
      .then(({ event: e }) => {
        setEvent(e);
        document.title = `Register — ${e.name} — Youth Innovators Hub`;
      })
      .catch((err) => setEventError(err.message))
      .finally(() => setLoadingEvent(false));
  }, [eventSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors([]);
    setSubmitting(true);

    // Build extra info from optional fields
    const extraParts: string[] = [];
    if (level.trim()) extraParts.push(`Level: ${level.trim()}`);
    if (phone.trim()) extraParts.push(`Phone: ${phone.trim()}`);
    if (interests.trim()) extraParts.push(`Interests: ${interests.trim()}`);
    const extraInfo = extraParts.join('\n') || undefined;

    try {
      const data = await postJSON<{ message: string }>('/register-participant', {
        eventSlug,
        name: name.trim(),
        email: email.trim(),
        school: school.trim(),
        extraInfo,
      });

      setSuccess(data.message);
    } catch (err: any) {
      if (err.details) setFieldErrors(err.details);
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading state ─────────────────────────────────────
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
              You're Registered!
            </h1>
            <p className="text-white/60 text-base mb-8">{success}</p>
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

  // ── Form ──────────────────────────────────────────────
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
            <UserPlus className="w-6 h-6 text-[#438CAF]" />
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Register
            </h1>
          </div>
          <p className="text-white/50 text-sm mb-8">
            Register as a participant for <span className="text-[#438CAF] font-bold">{event.name}</span>
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
            {/* Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#438CAF] transition-colors"
                placeholder="e.g. Alice Uwimana"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#438CAF] transition-colors"
                placeholder="alice@school.edu"
              />
            </div>

            {/* School */}
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
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#438CAF] transition-colors"
                placeholder="e.g. University of Rwanda"
              />
            </div>

            <hr className="border-white/10" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Optional Info</p>

            {/* Level */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Level / Year
              </label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#438CAF] transition-colors"
                placeholder="e.g. Year 3, Senior 6, etc."
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#438CAF] transition-colors"
                placeholder="+250 7XX XXX XXX"
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-1.5">
                Areas of Interest
              </label>
              <textarea
                rows={2}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#438CAF] transition-colors resize-none"
                placeholder="e.g. AI/ML, Web Development, IoT, Hardware…"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#438CAF] text-white text-sm font-black uppercase tracking-widest hover:bg-[#438CAF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Register
                </>
              )}
            </button>
          </form>
        </motion.div>
      </section>
    </ShowcaseLayout>
  );
};

export default ParticipantRegistrationPage;
