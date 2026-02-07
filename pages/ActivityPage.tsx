import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Terminal,
  Trophy,
  Coffee,
  Podcast,
  Flame,
  ArrowLeft,
  ChevronRight,
  Zap,
  Instagram,
  Linkedin,
  MessageSquare,
  Github,
  Users,
  Clock,
  MapPin,
  Star,
  Target,
  Lightbulb,
  Code,
  Heart,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

interface ActivityData {
  slug: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  description: string;
  highlights: { icon: LucideIcon; title: string; text: string }[];
  cta: string;
}

const ACTIVITIES: Record<string, ActivityData> = {
  hackathons: {
    slug: 'hackathons',
    title: 'Hackathons',
    tagline: 'Pure creation, caffeine, and zero sleep. Build fast, learn faster.',
    icon: Flame,
    description:
      "YIHUB hackathons are where ideas become real products — in hours, not months. Teams of student builders come together, pick a problem, and ship a working prototype before time runs out. It's messy, it's intense, and it's the fastest way to level up.",
    highlights: [
      { icon: Clock, title: 'Time-Boxed Chaos', text: '24–48 hours to go from zero to a working demo. No overthinking, just building.' },
      { icon: Users, title: 'Team Up', text: 'Find your squad on the spot. Designers, coders, hustlers — everyone has a role.' },
      { icon: Trophy, title: 'Ship & Present', text: 'Demo your project to judges and the community. Real feedback, real recognition.' },
      { icon: Lightbulb, title: 'Learn by Doing', text: "You'll pick up more in one hackathon weekend than a month of tutorials." },
    ],
    cta: 'Join the next hackathon',
  },
  workshops: {
    slug: 'workshops',
    title: 'Workshops',
    tagline: 'Practical skills for the modern builder. Hands-on, no boring slides.',
    icon: Terminal,
    description:
      "Forget death-by-PowerPoint. YIHUB workshops are live, hands-on sessions where you actually build something. Whether it's your first line of code or your tenth API integration, you leave with something that works.",
    highlights: [
      { icon: Code, title: 'Code Along', text: 'Every workshop is hands-on. You follow along, you build, you break things, you fix them.' },
      { icon: Target, title: 'Skill-Focused', text: 'Each session targets one skill: React, Python, Git, APIs, databases — you name it.' },
      { icon: Users, title: 'Peer-Led', text: 'Taught by students who just figured it out themselves. No gatekeeping, just real talk.' },
      { icon: Star, title: 'Walk Away With Something', text: 'Every workshop ends with a project you built yourself. Not notes — a project.' },
    ],
    cta: 'Join the next workshop',
  },
  codelift: {
    slug: 'codelift',
    title: 'CodeLift',
    tagline: 'Our outreach program bringing hands-on coding and tech skills to secondary school students across Rwanda.',
    icon: Rocket,
    description:
      "CodeLift is how we pay it forward. We go into secondary schools across Rwanda and introduce students to coding, tech thinking, and the builder mindset — before they even get to university. No lectures, just guided projects that spark curiosity.",
    highlights: [
      { icon: MapPin, title: 'Across Rwanda', text: 'We visit schools in Kigali and beyond, bringing tech access to students who need it most.' },
      { icon: Lightbulb, title: 'First Spark', text: "For many students, CodeLift is their first time writing real code. That moment changes everything." },
      { icon: Heart, title: 'Mentorship', text: 'YIHUB members mentor younger students 1-on-1, building lasting connections.' },
      { icon: Target, title: 'Project-Based', text: 'Students build a small project by the end of each session. Something they can show off.' },
    ],
    cta: 'Get involved with CodeLift',
  },
  showcase: {
    slug: 'showcase',
    title: 'Showcase',
    tagline: 'Flex your projects and get feedback from pros.',
    icon: Trophy,
    description:
      "Built something cool? Showcase is your stage. Present your projects to the YIHUB community, get honest feedback from experienced builders, and put your work on the map. It's demo day energy, every time.",
    highlights: [
      { icon: Star, title: 'Your Stage', text: 'Present to an audience of builders who actually understand what you made and why it matters.' },
      { icon: MessageSquare, title: 'Real Feedback', text: 'No "looks great!" fluff. Get actionable feedback that makes your project better.' },
      { icon: Users, title: 'Network', text: 'Showcase is where collabs start. Meet people who want to build with you.' },
      { icon: Trophy, title: 'Recognition', text: 'Stand-out projects get highlighted across our community channels.' },
    ],
    cta: 'Submit your project',
  },
  meetups: {
    slug: 'meetups',
    title: 'Meetups',
    tagline: 'Hang out with people who get your nerdy jokes.',
    icon: Coffee,
    description:
      "Not everything has to be a hackathon. Sometimes you just need to grab coffee with people who think debugging is fun. YIHUB meetups are casual hangouts where the community connects, shares ideas, and vibes.",
    highlights: [
      { icon: Coffee, title: 'Casual Vibes', text: 'No agenda, no pressure. Just builders hanging out and talking about what they are working on.' },
      { icon: Lightbulb, title: 'Idea Swaps', text: "Share what you're building, get inspired by what others are up to." },
      { icon: MapPin, title: 'Kigali-Based', text: 'We meet at cool spots around Kigali. Good coffee, good Wi-Fi, good people.' },
      { icon: Heart, title: 'Community First', text: "This is where friendships form. YIHUB isn't just a community — it's your crew." },
    ],
    cta: 'Come hang out',
  },
  'tech-talks': {
    slug: 'tech-talks',
    title: 'Tech Talks',
    tagline: 'Real people, real stories.',
    icon: Podcast,
    description:
      "Tech Talks bring in builders, founders, and engineers to share their stories with the YIHUB community. No corporate fluff — just honest conversations about building, failing, and shipping in the real world.",
    highlights: [
      { icon: Podcast, title: 'Speaker Sessions', text: 'Hear from people who have actually built things — their wins, their failures, their lessons.' },
      { icon: MessageSquare, title: 'Q&A', text: 'Every talk has an open Q&A. Ask anything. No question is too basic or too weird.' },
      { icon: Users, title: 'Diverse Speakers', text: 'Students, startup founders, engineers — we bring in voices from across the tech ecosystem.' },
      { icon: Star, title: 'Inspiration + Action', text: "Walk away with real insights you can apply to your own projects, not just motivation fluff." },
    ],
    cta: 'Attend the next talk',
  },
};

const ActivityPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activity = slug ? ACTIVITIES[slug] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Update document title
  useEffect(() => {
    if (activity) {
      document.title = `${activity.title} — Youth Innovators Hub (YIHUB) | Rwanda`;
    }
    return () => {
      document.title = "Youth Innovators Hub (YIHUB) — Rwanda's Youth Tech & Builders Community";
    };
  }, [activity]);

  if (!activity) {
    return (
      <div className="min-h-screen bg-[#193441] flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">404</h1>
        <p className="text-xl font-bold text-white/60 mb-8">This page doesn't exist.</p>
        <Link
          to="/"
          className="px-8 py-4 bg-[#438CAF] text-white font-black uppercase tracking-tighter rounded-xl hover:scale-105 transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>
    );
  }

  const IconComponent = activity.icon;

  return (
    <div className="min-h-screen bg-[#193441] selection:bg-[#438CAF] selection:text-white">
      {/* Navbar */}
      <header>
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between bg-[#193441]/90 backdrop-blur-xl border-b border-white/5" aria-label="Main navigation">
          <Link
            to="/"
            className="cursor-pointer hover:scale-105 transition-all duration-300 flex-shrink-0 inline-block"
          >
            <img
              src="/logo.png"
              alt="Youth Innovators Hub (YIHUB) — Rwanda youth tech community"
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain select-none"
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-8 text-xs font-black uppercase tracking-widest">
            {[
              { id: 'about', label: 'About' },
              { id: 'build', label: 'What We Do' },
              { id: 'community', label: 'Community' },
            ].map((item) => (
              <Link
                key={item.id}
                to={`/#${item.id}`}
                className="group relative py-2 transition-all text-white hover:text-[#438CAF]"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#438CAF] transform scale-x-0 group-hover:scale-x-100 transition-transform" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://chat.whatsapp.com/DgU4FYHIqltLjGThwEIFZp"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#193441] px-6 md:px-8 py-2.5 font-black uppercase tracking-tighter rounded-full transform hover:scale-105 transition-all shadow-[4px_4px_0px_0px_#438CAF] active:shadow-none active:translate-y-1"
            >
              Join the Hub
            </a>

            <button
              className="lg:hidden p-2 text-white bg-white/10 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <Zap className="text-[#438CAF]" /> : <Terminal />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-[55] bg-[#193441] pt-24 px-6 sm:px-10 flex flex-col lg:hidden"
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 w-12 h-12 bg-[#438CAF] rounded-full flex items-center justify-center text-white hover:bg-[#438CAF]/80 transition-all"
                aria-label="Close menu"
              >
                <Zap size={24} />
              </button>

              <div className="flex flex-col space-y-6 sm:space-y-8 mt-8">
                {[
                  { id: 'about', label: 'About' },
                  { id: 'build', label: 'What We Do' },
                  { id: 'community', label: 'Community' },
                ].map((item) => (
                  <Link
                    key={item.id}
                    to={`/#${item.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-left tracking-tighter hover:text-[#438CAF] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <a
                href="https://chat.whatsapp.com/DgU4FYHIqltLjGThwEIFZp"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto mb-8 w-full py-4 bg-[#438CAF] text-white font-black text-lg uppercase tracking-tighter rounded-xl text-center shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
              >
                Join the Hub
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-4 md:px-8 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            {/* Back link */}
            <Link
              to="/#build"
              className="inline-flex items-center gap-2 text-[#438CAF] font-black uppercase tracking-widest text-xs mb-8 md:mb-12 hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              All Programs
            </Link>

            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10 mb-8 md:mb-12">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-[#438CAF]/20 rounded-2xl md:rounded-3xl flex items-center justify-center flex-shrink-0">
                <IconComponent size={40} className="md:w-14 md:h-14 text-[#438CAF]" />
              </div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-none mb-3 md:mb-4"
                >
                  {activity.title}<span className="text-[#438CAF]">.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-lg sm:text-xl md:text-2xl font-bold text-white/70 max-w-2xl leading-snug"
                >
                  {activity.tagline}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Decorative number */}
          <div className="absolute -top-10 right-0 md:right-10 text-[20rem] md:text-[30rem] font-black opacity-[0.03] pointer-events-none select-none italic leading-none">
            {Object.keys(ACTIVITIES).indexOf(activity.slug) + 1}
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 rounded-2xl md:rounded-[2rem] p-8 md:p-12 lg:p-16 border border-white/10"
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white/80 leading-relaxed">
                {activity.description}
              </p>

              {/* Show "View Projects" CTA only on the Showcase page */}
              {activity.slug === 'showcase' && (
                <Link
                  to="/events"
                  className="mt-8 md:mt-10 inline-flex items-center gap-3 bg-[#438CAF] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg uppercase tracking-tight hover:bg-[#438CAF]/80 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 group"
                >
                  <Trophy size={22} className="md:w-6 md:h-6" />
                  View Projects
                  <ChevronRight size={20} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </motion.div>
          </div>
        </section>

        {/* Highlights Grid */}
        <section className="py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-10 md:mb-16">
              What to <span className="text-[#438CAF]">expect.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {activity.highlights.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="bg-[#438CAF]/10 backdrop-blur-md p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-[#438CAF]/20 hover:-translate-y-2 transition-transform"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-[#438CAF]/20 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                    <item.icon size={24} className="md:w-7 md:h-7 text-[#438CAF]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2 md:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base font-bold text-white/60 leading-snug">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 px-4 md:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-[#438CAF] text-white rounded-xl md:rounded-2xl font-black uppercase tracking-wider md:tracking-widest text-xs md:text-sm mb-8 md:mb-12 shadow-2xl">
                <Rocket size={20} className="md:w-6 md:h-6" />
                <span>Ready?</span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85] mb-6 md:mb-10">
                {activity.cta}<span className="text-[#438CAF]">.</span>
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white/60 mb-10 md:mb-14 leading-snug">
                No applications. No fees. Just show up and build.
              </p>

              <a
                href="https://chat.whatsapp.com/DgU4FYHIqltLjGThwEIFZp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-md sm:w-auto px-8 sm:px-12 md:px-16 py-5 md:py-8 bg-white text-[#193441] font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tighter rounded-2xl md:rounded-[2rem] shadow-[8px_8px_0px_0px_#438CAF] md:shadow-[15px_15px_0px_0px_#438CAF] hover:translate-x-1 hover:-translate-y-1 md:hover:translate-x-2 md:hover:-translate-y-2 transition-all active:shadow-none active:translate-x-0 active:translate-y-0 group inline-flex items-center justify-center"
              >
                JOIN THE HUB
                <ChevronRight className="inline-block ml-2 md:ml-4 group-hover:translate-x-2 transition-transform w-6 h-6 md:w-8 md:h-8" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Other Programs */}
        <section className="py-16 md:py-24 px-4 md:px-8 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase italic mb-8 md:mb-12 text-white/40">
              More from the Hub
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {Object.values(ACTIVITIES)
                .filter((a) => a.slug !== activity.slug)
                .map((a) => (
                  <Link
                    key={a.slug}
                    to={`/${a.slug}`}
                    className="bg-white/5 hover:bg-[#438CAF]/20 p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10 hover:border-[#438CAF]/30 transition-all group"
                  >
                    <a.icon size={20} className="md:w-6 md:h-6 text-[#438CAF] mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-sm md:text-base font-black uppercase tracking-tighter">{a.title}</div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-16 bg-[#193441] border-t-4 md:border-t-8 border-[#438CAF]" role="contentinfo">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-10 md:gap-12 lg:gap-16 mb-12 md:mb-16 lg:mb-20">
            <div className="max-w-md">
              <Link
                to="/"
                className="cursor-pointer hover:scale-105 transition-all duration-300 flex-shrink-0 inline-block"
              >
                <img
                  src="/logo.png"
                  alt="Youth Innovators Hub"
                  className="h-12 sm:h-12 md:h-14 lg:h-16 w-auto object-contain select-none"
                />
              </Link>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white/50 mb-6 md:mb-8 leading-tight italic">
                Youth Innovators Hub — Rwanda's youth tech community where student builders ship real projects.
              </p>
              <div className="flex gap-3 md:gap-4">
                <a href="https://www.instagram.com/youthinnovatorshub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#438CAF] hover:scale-110 transition-all border border-white/10" aria-label="Youth Innovators Hub on Instagram">
                  <Instagram size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </a>
                <a href="https://www.linkedin.com/company/youthinnovatorshub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#438CAF] hover:scale-110 transition-all border border-white/10" aria-label="Youth Innovators Hub on LinkedIn">
                  <Linkedin size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </a>
                <a href="https://wa.me/250791845268" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#438CAF] hover:scale-110 transition-all border border-white/10" aria-label="WhatsApp">
                  <MessageSquare size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </a>
                <a href="https://github.com/Youth-Innovators-Hub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#438CAF] hover:scale-110 transition-all border border-white/10" aria-label="Github">
                  <Github size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider md:tracking-widest">
              <div className="space-y-3 md:space-y-4 lg:space-y-6">
                <span className="text-[#438CAF] block mb-2 md:mb-4 opacity-100">Hub</span>
                <Link to="/#about" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">About</Link>
                <Link to="/#build" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">Programs</Link>
                <Link to="/#community" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">Community</Link>
                <Link to="/#cta" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">Join</Link>
              </div>
              <div className="space-y-3 md:space-y-4 lg:space-y-6 col-span-1 md:col-span-1">
                <span className="text-[#438CAF] block mb-2 md:mb-4 opacity-100">Connect</span>
                <a href="https://www.instagram.com/youthinnovatorshub/" target="_blank" rel="noopener noreferrer" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">Instagram</a>
                <a href="https://www.linkedin.com/company/youthinnovatorshub/" target="_blank" rel="noopener noreferrer" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 md:pt-12 border-t border-white/5 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest md:tracking-[0.3em] opacity-30 italic">
            <div className="md:mt-0">&copy;2026 YOUTH INNOVATORS HUB (YIHUB).</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ActivityPage;
