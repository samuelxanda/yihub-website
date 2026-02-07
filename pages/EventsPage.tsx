import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Loader2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import ShowcaseLayout from '../components/ShowcaseLayout';
import { getEvents } from '../lib/api';
import type { EventSummary } from '../lib/showcase-types';

const statusColor: Record<string, string> = {
  Upcoming: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Live: 'bg-red-500/20 text-red-300 border-red-500/40',
  Past: 'bg-white/10 text-white/60 border-white/20',
};

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Events — Youth Innovators Hub';
    getEvents()
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ShowcaseLayout>
      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-16 pt-12 md:pt-20 pb-12">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-[#438CAF]/20 border border-[#438CAF]/30 text-[#438CAF] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
              Events
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Where the magic<br />
              <span className="text-[#438CAF]">happens.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Hackathons, workshops, meetups — every YIHUB event is a launchpad for student
              builders. Explore past &amp; upcoming events and the projects that came out of them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 md:px-8 lg:px-16 pb-24">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 text-white/40 gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-bold uppercase tracking-widest">Loading events…</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-red-400">
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-white/40 gap-4">
              <Calendar className="w-10 h-10" />
              <p className="text-sm font-bold uppercase tracking-widest">No events yet — stay tuned!</p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link
                    to={`/events/${event.slug}`}
                    className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#438CAF]/40 transition-all duration-300 hover:-translate-y-1"
                  >
                    {event.coverImageUrl ? (
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={event.coverImageUrl}
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#193441] to-transparent" />
                      </div>
                    ) : (
                      <div className="h-28 bg-gradient-to-br from-[#438CAF]/20 to-transparent" />
                    )}

                    <div className="p-5 md:p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusColor[event.status] ?? statusColor.Past}`}>
                          {event.status}
                        </span>
                        {event.submissionOpen && (
                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Submissions Open
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg md:text-xl font-black uppercase tracking-tight mb-2 group-hover:text-[#438CAF] transition-colors leading-tight">
                        {event.name}
                      </h2>

                      {event.description && (
                        <p className="text-sm text-white/50 line-clamp-2 mb-4">{event.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40 font-bold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.location}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center text-xs font-black uppercase tracking-widest text-[#438CAF] opacity-0 group-hover:opacity-100 transition-opacity">
                        View Projects <ArrowRight className="w-3.5 h-3.5 ml-1" />
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

export default EventsPage;
