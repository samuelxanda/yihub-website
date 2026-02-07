import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Sparkles,
  FolderOpen,
} from 'lucide-react';
import ShowcaseLayout from '../components/ShowcaseLayout';
import { getEventWithProjects } from '../lib/api';
import type { EventSummary, ProjectSummary } from '../lib/showcase-types';

const statusColor: Record<string, string> = {
  Upcoming: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Live: 'bg-red-500/20 text-red-300 border-red-500/40',
  Past: 'bg-white/10 text-white/60 border-white/20',
};

const EventDetailPage: React.FC = () => {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventSlug) return;
    getEventWithProjects(eventSlug)
      .then(({ event: e, projects: p }) => {
        setEvent(e);
        setProjects(p);
        document.title = `${e.name} — Youth Innovators Hub`;
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [eventSlug]);

  if (loading) {
    return (
      <ShowcaseLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white/40 gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest">Loading event…</p>
        </div>
      </ShowcaseLayout>
    );
  }

  if (error || !event) {
    return (
      <ShowcaseLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-lg font-bold text-red-400">{error ?? 'Event not found'}</p>
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

  return (
    <ShowcaseLayout>
      {/* Breadcrumb */}
      <div className="px-4 md:px-8 lg:px-16 pt-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-[#438CAF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Events
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-16 pt-8 md:pt-12 pb-12">
        <div className="max-w-6xl mx-auto">
          {event.coverImageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-56 sm:h-72 md:h-96 rounded-2xl overflow-hidden mb-8 border border-white/10"
            >
              <img
                src={event.coverImageUrl}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#193441] via-[#193441]/40 to-transparent" />
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusColor[event.status] ?? statusColor.Past}`}>
                {event.status}
              </span>
              {event.submissionOpen && (
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Submissions Open
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
              {event.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/50 font-bold mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#438CAF]" />
                {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                {event.endDate && ` – ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#438CAF]" />
                  {event.location}
                </span>
              )}
            </div>

            {event.description && (
              <p className="text-base md:text-lg text-white/60 max-w-3xl leading-relaxed">{event.description}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="px-4 md:px-8 lg:px-16 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-5 h-5 text-[#438CAF]" />
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
              Projects <span className="text-white/30 ml-2">({projects.length})</span>
            </h2>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/30 gap-4 border border-dashed border-white/10 rounded-2xl">
              <FolderOpen className="w-10 h-10" />
              <p className="text-sm font-bold uppercase tracking-widest">No approved projects yet</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <Link
                    to={`/projects/${project.slug}`}
                    className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#438CAF]/40 transition-all duration-300 hover:-translate-y-1"
                  >
                    {project.thumbnailUrl ? (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={project.thumbnailUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#193441] to-transparent" />
                      </div>
                    ) : (
                      <div className="h-24 bg-gradient-to-br from-[#438CAF]/20 to-transparent" />
                    )}

                    <div className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.category.map((cat) => (
                          <span
                            key={cat}
                            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#438CAF]/15 text-[#438CAF] border border-[#438CAF]/20"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-base md:text-lg font-black uppercase tracking-tight mb-1.5 group-hover:text-[#438CAF] transition-colors leading-tight">
                        {project.title}
                      </h3>

                      <p className="text-xs text-white/40 line-clamp-2 mb-3">{project.shortDescription}</p>

                      {project.school && (
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{project.school}</p>
                      )}

                      <div className="mt-3 flex items-center text-xs font-black uppercase tracking-widest text-[#438CAF] opacity-0 group-hover:opacity-100 transition-opacity">
                        View Project <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </ShowcaseLayout>
  );
};

export default EventDetailPage;
