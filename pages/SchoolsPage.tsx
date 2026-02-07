import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, School, ArrowRight, Sparkles } from 'lucide-react';
import ShowcaseLayout from '../components/ShowcaseLayout';
import { getSchools } from '../lib/api';
import type { SchoolSummary } from '../lib/showcase-types';

const SchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<SchoolSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Schools — Youth Innovators Hub';
    getSchools()
      .then(setSchools)
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
              Schools
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              The builders are<br />
              <span className="text-[#438CAF]">everywhere.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Schools across Rwanda are sending their best student builders to YIHUB events. Browse by school to see what each crew has shipped.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 md:px-8 lg:px-16 pb-24">
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 text-white/40 gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-bold uppercase tracking-widest">Loading schools…</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-red-400">
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          {!loading && !error && schools.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-white/40 gap-4">
              <School className="w-10 h-10" />
              <p className="text-sm font-bold uppercase tracking-widest">No schools listed yet.</p>
            </div>
          )}

          {!loading && !error && schools.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {schools.map((school, i) => (
                <motion.div
                  key={school.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <Link
                    to={`/schools/${school.slug}`}
                    className="group flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#438CAF]/40 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#438CAF]/15 border border-[#438CAF]/20 flex items-center justify-center flex-shrink-0">
                      <School className="w-5 h-5 text-[#438CAF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base md:text-lg font-black uppercase tracking-tight group-hover:text-[#438CAF] transition-colors truncate">
                        {school.name}
                      </h2>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#438CAF] transition-colors flex-shrink-0" />
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

export default SchoolsPage;
