import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, Linkedin, MessageSquare, Github } from 'lucide-react';
import { WHATSAPP_JOIN } from '../lib/moments';

/**
 * Shared page shell for showcase pages (events, projects, schools).
 * Matches the redesigned landing chrome.
 */
const ShowcaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-navy selection:bg-accent selection:text-white text-white font-body">
      <header>
        <nav
          className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between bg-navy/90 backdrop-blur-xl border-b border-white/5"
          aria-label="Main navigation"
        >
          <Link to="/" className="flex-shrink-0 inline-block">
            <img
              src="/logo.png"
              alt="Youth Innovators Hub (YIHUB) — Rwanda youth tech community"
              className="h-9 sm:h-11 md:h-12 w-auto object-contain select-none"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold">
            <Link to="/#about" className="text-white/70 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/#build" className="text-white/70 hover:text-white transition-colors">
              What we do
            </Link>
<Link to="/#community" className="text-white/70 hover:text-white transition-colors">
              Community
            </Link>
            <Link to="/gallery" className="text-white/70 hover:text-white transition-colors">
              Gallery
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_JOIN}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex bg-white text-navy px-5 py-2.5 text-sm font-display font-bold rounded-lg hover:bg-accent hover:text-white transition-colors"
            >
              Join the Hub
            </a>
            <button
              className="lg:hidden p-2.5 text-white bg-white/10 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="fixed inset-0 z-[55] bg-navy pt-24 px-6 flex flex-col lg:hidden"
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 w-11 h-11 bg-accent rounded-lg flex items-center justify-center text-white"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
              <div className="flex flex-col gap-5 mt-6">
                {[
                  { to: '/#about', label: 'About' },
                  { to: '/#build', label: 'What we do' },
                  { to: '/#community', label: 'Community' },
                  { to: '/gallery', label: 'Gallery' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-display text-3xl sm:text-4xl font-bold tracking-tight hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <a
                href={WHATSAPP_JOIN}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto mb-10 w-full py-4 bg-accent text-white font-display font-bold text-lg rounded-xl text-center"
              >
                Join the Hub
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-20 md:pt-24">{children}</main>

      <footer
        className="py-14 md:py-20 px-5 md:px-8 lg:px-16 bg-navy border-t border-accent/40"
        role="contentinfo"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
            <div className="max-w-sm">
              <Link to="/" className="inline-block mb-5">
                <img
                  src="/logo.png"
                  alt="Youth Innovators Hub"
                  className="h-11 w-auto object-contain"
                />
              </Link>
              <p className="text-white/50 text-base leading-relaxed mb-6">
                Youth Innovators Hub — Rwanda&apos;s youth tech community where student builders ship
                real projects.
              </p>
              <div className="flex gap-2">
                <a
                  href="https://www.instagram.com/youthinnovatorshub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-accent transition-colors border border-white/10"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/company/youthinnovatorshub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-accent transition-colors border border-white/10"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://wa.me/250791845268"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-accent transition-colors border border-white/10"
                  aria-label="WhatsApp"
                >
                  <MessageSquare size={18} />
                </a>
                <a
                  href="https://github.com/Youth-Innovators-Hub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-accent transition-colors border border-white/10"
                  aria-label="Github"
                >
                  <Github size={18} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 text-sm">
              <div className="space-y-3">
                <span className="text-accent font-semibold block mb-3">Hub</span>
                <Link to="/#about" className="block text-white/55 hover:text-accent transition-colors">
                  About
                </Link>
                <Link to="/#build" className="block text-white/55 hover:text-accent transition-colors">
                  Programs
                </Link>
<Link
                  to="/#community"
                  className="block text-white/55 hover:text-accent transition-colors"
                >
                  Community
                </Link>
                <Link
                  to="/gallery"
                  className="block text-white/55 hover:text-accent transition-colors"
                >
                  Gallery
                </Link>
              </div>
              <div className="space-y-3">
                <span className="text-accent font-semibold block mb-3">Connect</span>
                <a
                  href="https://www.instagram.com/youthinnovatorshub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/55 hover:text-accent transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/youthinnovatorshub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/55 hover:text-accent transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-xs text-white/30">
            &copy; 2026 Youth Innovators Hub (YIHUB)
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShowcaseLayout;
