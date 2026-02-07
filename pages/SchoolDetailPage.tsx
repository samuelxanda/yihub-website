import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  School,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import ShowcaseLayout from '../components/ShowcaseLayout';
import { getSchoolProjects } from '../lib/api';
import type { ProjectSummary } from '../lib/showcase-types';

const SchoolDetailPage: React.FC = () => {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  const [schoolName, setSchoolName] = useState('');
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolSlug) return;
    getSchoolProjects(schoolSlug)
      .then(({ school, projects: p }) => {
        setSchoolName(school);
        setProjects(p);
        document.title = `${school} Projects — Youth Innovators Hub`;
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [schoolSlug]);

  if (loading) {
    return (
      <ShowcaseLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white/40 gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest">Loading school…</p>
        </div>
      </ShowcaseLayout>
    );
  }

  if (error) {
    return (
      <ShowcaseLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-lg font-bold text-red-400">{error}</p>
          <Link
            to="/schools"
            className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#438CAF] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Schools
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
            to="/schools"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-[#438CAF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Schools
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-16 pt-8 md:pt-12 pb-12">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#438CAF]/15 border border-[#438CAF]/20 flex items-center justify-center">
                <School className="w-7 h-7 text-[#438CAF]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
                  {schoolName}
                </h1>
                <p className="text-sm text-white/40 font-bold mt-1">{projects.length} approved project{projects.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="px-4 md:px-8 lg:px-16 pb-24">
        <div className="max-w-6xl mx-auto">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/30 gap-4 border border-dashed border-white/10 rounded-2xl">
              <FolderOpen className="w-10 h-10" />
              <p className="text-sm font-bold uppercase tracking-widest">No approved projects from this school yet.</p>
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

export default SchoolDetailPage;
