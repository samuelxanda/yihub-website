import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Terminal,
  Instagram,
  Linkedin,
  MessageSquare,
  Github,
} from 'lucide-react';

/**
 * Shared page shell for showcase pages (events, projects, schools).
 * Reuses the same navbar and footer styling from the main site.
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
    <div className="min-h-screen bg-[#193441] selection:bg-[#438CAF] selection:text-white text-white">
      {/* Navbar */}
      <header>
        <nav
          className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between bg-[#193441]/90 backdrop-blur-xl border-b border-white/5"
          aria-label="Main navigation"
        >
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
            <Link to="/#about" className="group relative py-2 transition-all text-white hover:text-[#438CAF]">
              About
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#438CAF] transform scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Link to="/#build" className="group relative py-2 transition-all text-white hover:text-[#438CAF]">
              What We Do
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#438CAF] transform scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Link to="/events" className="group relative py-2 transition-all text-white hover:text-[#438CAF]">
              Events
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#438CAF] transform scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Link to="/#community" className="group relative py-2 transition-all text-white hover:text-[#438CAF]">
              Community
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#438CAF] transform scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
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
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <Zap className="text-[#438CAF]" /> : <Terminal />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
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
                  { to: '/#about', label: 'About' },
                  { to: '/#build', label: 'What We Do' },
                  { to: '/events', label: 'Events' },
                  { to: '/#community', label: 'Community' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
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

      {/* Page content */}
      <main className="pt-20 md:pt-24">{children}</main>

      {/* Footer */}
      <footer
        className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-16 bg-[#193441] border-t-4 md:border-t-8 border-[#438CAF]"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-10 md:gap-12 lg:gap-16 mb-12 md:mb-16 lg:mb-20">
            <div className="max-w-md">
              <Link to="/" className="inline-block hover:scale-105 transition-all duration-300">
                <img src="/logo.png" alt="Youth Innovators Hub" className="h-12 md:h-14 lg:h-16 w-auto object-contain select-none" />
              </Link>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white/50 mb-6 md:mb-8 leading-tight italic">
                Youth Innovators Hub — Rwanda's youth tech community where student builders ship real projects.
              </p>
              <div className="flex gap-3 md:gap-4">
                <a href="https://www.instagram.com/youthinnovatorshub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#438CAF] hover:scale-110 transition-all border border-white/10" aria-label="Instagram">
                  <Instagram size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </a>
                <a href="https://www.linkedin.com/company/youthinnovatorshub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#438CAF] hover:scale-110 transition-all border border-white/10" aria-label="LinkedIn">
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
                <span className="text-[#438CAF] block mb-2 md:mb-4">Hub</span>
                <Link to="/#about" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">About</Link>
                <Link to="/#build" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">Programs</Link>
                <Link to="/events" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">Events</Link>
                <Link to="/#community" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">Community</Link>
              </div>
              <div className="space-y-3 md:space-y-4 lg:space-y-6">
                <span className="text-[#438CAF] block mb-2 md:mb-4">Connect</span>
                <a href="https://www.instagram.com/youthinnovatorshub/" target="_blank" rel="noopener noreferrer" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">Instagram</a>
                <a href="https://www.linkedin.com/company/youthinnovatorshub/" target="_blank" rel="noopener noreferrer" className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 md:pt-12 border-t border-white/5 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest md:tracking-[0.3em] opacity-30 italic">
            <div>&copy;2026 YOUTH INNOVATORS HUB (YIHUB).</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShowcaseLayout;
