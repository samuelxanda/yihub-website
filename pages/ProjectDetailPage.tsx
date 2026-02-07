import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Loader2,
  AlertCircle,
  Tag,
  School,
  Calendar,
} from 'lucide-react';
import ShowcaseLayout from '../components/ShowcaseLayout';
import { getProject } from '../lib/api';
import type { ProjectDetail } from '../lib/showcase-types';

const ProjectDetailPage: React.FC = () => {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectSlug) return;
    getProject(projectSlug)
      .then((p) => {
        setProject(p);
        document.title = `${p.title} — Youth Innovators Hub`;
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectSlug]);

  if (loading) {
    return (
      <ShowcaseLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white/40 gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest">Loading project…</p>
        </div>
      </ShowcaseLayout>
    );
  }

  if (error || !project) {
    return (
      <ShowcaseLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-lg font-bold text-red-400">{error ?? 'Project not found'}</p>
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
        <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40">
          <Link to="/events" className="hover:text-[#438CAF] transition-colors">Events</Link>
          {project.event && (
            <>
              <span>/</span>
              <Link to={`/events/${project.event.slug}`} className="hover:text-[#438CAF] transition-colors">
                {project.event.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-white/60">{project.title}</span>
        </div>
      </div>

      <section className="px-4 md:px-8 lg:px-16 pt-8 md:pt-12 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Thumbnail */}
            {project.thumbnailUrl && (
              <div className="relative rounded-2xl overflow-hidden mb-8 border border-white/10">
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-64 sm:h-80 md:h-[28rem] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#193441] via-transparent to-transparent" />
              </div>
            )}

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.category.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#438CAF]/15 text-[#438CAF] border border-[#438CAF]/20"
                >
                  <Tag className="w-3 h-3" />
                  {cat}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
              {project.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/50 font-bold mb-8">
              {project.school && (
                <span className="flex items-center gap-1.5">
                  <School className="w-4 h-4 text-[#438CAF]" />
                  <Link to={`/schools/${encodeURIComponent(project.school.toLowerCase().replace(/\s+/g, '-'))}`} className="hover:text-[#438CAF] transition-colors">
                    {project.school}
                  </Link>
                </span>
              )}
              {project.event && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#438CAF]" />
                  <Link to={`/events/${project.event.slug}`} className="hover:text-[#438CAF] transition-colors">
                    {project.event.name}
                  </Link>
                </span>
              )}
              {project.submittedAt && (
                <span className="text-white/30 text-xs">
                  Submitted {new Date(project.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
              <p className="text-base md:text-lg text-white/70 leading-relaxed mb-4">{project.shortDescription}</p>
              {project.fullDescription && (
                <p className="text-sm md:text-base text-white/50 leading-relaxed whitespace-pre-line">{project.fullDescription}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-12">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#438CAF] text-white px-6 py-3 rounded-xl font-black uppercase tracking-tight text-sm hover:bg-[#438CAF]/80 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                >
                  <ExternalLink className="w-4 h-4" /> View Live Project
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-black uppercase tracking-tight text-sm hover:bg-white/20 transition-colors border border-white/10"
                >
                  <Github className="w-4 h-4" /> Source Code
                </a>
              )}
            </div>

            {/* Back link */}
            {project.event && (
              <Link
                to={`/events/${project.event.slug}`}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-[#438CAF] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to {project.event.name}
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </ShowcaseLayout>
  );
};

export default ProjectDetailPage;
