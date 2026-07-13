import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Instagram, Linkedin, MessageSquare, Github, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Section from './components/Section';
import { COMMUNITY_STAT } from './constants';
import { HERO_IMAGE } from './lib/gallery';
import {
  WHATSAPP_JOIN,
  MOMENTS,
  PROGRAMS,
  FOUNDER_STORY,
  COMMUNITY_PHOTOS,
} from './lib/moments';

const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth',
          });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    if (isMenuOpen || showContactModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, showContactModal]);

  useEffect(() => {
    if (!showContactModal) return;
    const modal = modalRef.current;
    const focusable = modal?.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowContactModal(false);
      if (e.key === 'Tab' && focusable && focusable.length) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    first?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showContactModal]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'moments', 'about', 'build', 'community'];
      const scrollPos = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          scrollPos >= element.offsetTop &&
          scrollPos < element.offsetTop + element.offsetHeight
        ) {
          setActiveNav(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${id}`);
      setIsMenuOpen(false);
    }
  };

  const navLinkClass = (id: string) =>
    `py-2 transition-colors font-body text-sm font-semibold ${
      activeNav === id ? 'text-accent' : 'text-white/70 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-navy selection:bg-accent selection:text-white font-body">
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label="Send a message"
              className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative text-navy"
            >
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-lg flex items-center justify-center text-navy/60 hover:bg-navy/5 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <h2 className="font-display text-2xl font-bold mb-4">Send a message</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const phone = '250791845268';
                  const text = encodeURIComponent(
                    `Hi, my name is ${contactName}. ${contactMessage}`
                  );
                  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                  setShowContactModal(false);
                  setContactName('');
                  setContactMessage('');
                }}
                className="flex flex-col gap-4"
              >
                <input
                  type="text"
                  placeholder="Your name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="border border-accent/30 rounded-lg px-4 py-2.5 text-navy font-semibold focus:outline-none focus:border-accent"
                  required
                />
                <textarea
                  placeholder="Your message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="border border-accent/30 rounded-lg px-4 py-2.5 text-navy font-semibold focus:outline-none focus:border-accent min-h-[80px]"
                  required
                />
                <button
                  type="submit"
                  className="bg-accent text-white font-display font-bold py-3 rounded-lg hover:bg-navy transition-colors"
                >
                  Send via WhatsApp
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header>
        <nav
          className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between bg-navy/90 backdrop-blur-xl border-b border-white/5"
          aria-label="Main navigation"
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('home');
            }}
            className="flex-shrink-0 inline-block"
          >
            <img
              src="/logo.png"
              alt="Youth Innovators Hub (YIHUB) — Rwanda youth tech community"
              className="h-9 sm:h-11 md:h-12 w-auto object-contain select-none"
            />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('about');
              }}
              className={navLinkClass('about')}
            >
              About
            </a>
            <a
              href="#build"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('build');
              }}
              className={navLinkClass('build')}
            >
              What we do
            </a>
            <a
              href="#community"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('community');
              }}
              className={navLinkClass('community')}
            >
              Community
            </a>
            <Link
              to="/gallery"
              className="text-white/70 hover:text-white transition-colors text-sm font-semibold"
            >
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
                  { id: 'about', label: 'About' },
                  { id: 'build', label: 'What we do' },
                  { id: 'community', label: 'Community' },
                  { to: '/gallery', label: 'Gallery', isRoute: true },
                ].map((item) =>
                  'isRoute' in item && item.isRoute ? (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="font-display text-3xl sm:text-4xl font-bold tracking-tight hover:text-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(item.id!);
                      }}
                      className="font-display text-3xl sm:text-4xl font-bold tracking-tight hover:text-accent transition-colors"
                    >
                      {item.label}
                    </a>
                  ),
                )}
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

      <main>
        {/* Hero */}
        <Section id="home" className="min-h-screen relative p-0 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-navy/20 to-transparent" />
          </div>

          <div className="relative z-20 min-h-screen max-w-5xl mr-auto w-full pl-10 sm:pl-12 md:pl-16 lg:pl-24 xl:pl-28 pr-6 sm:pr-10 flex flex-col">
            <div className="min-h-[32vh] sm:min-h-[34vh] flex-1" aria-hidden="true" />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-3xl pb-16 md:pb-24"
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-6 md:mb-7">
                Shaping tomorrow
                <br />
                through
                <br />
                <span className="text-accent">tech &amp; innovation.</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/80 font-normal max-w-xl mb-12 leading-relaxed">
                We&apos;re a youth-led tech community in Rwanda — builders who learn by shipping real projects,{' '}
                <span className="text-white border-b-2 border-accent">together.</span>
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
                <a
                  href={WHATSAPP_JOIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent text-white font-display font-bold text-base sm:text-lg rounded-lg hover:bg-white hover:text-navy transition-colors"
                >
                  Start Building
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#build"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('build');
                  }}
                  className="inline-flex items-center justify-center text-white/80 font-semibold text-base sm:text-lg hover:text-accent transition-colors"
                >
                  See our programs
                </a>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Moments — LinkedIn-backed proof */}
        <Section id="moments" className="bg-navy py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <p className="text-accent text-sm font-semibold tracking-wide mb-3">Moments</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 max-w-2xl">
              Real rooms. Real energy.
            </h2>
            <p className="text-white/60 text-lg max-w-xl mb-14 md:mb-16">
              Game Jams, workshops, and outreach — real rooms where young builders across Rwanda show up to learn and ship.
            </p>

            <div className="flex flex-col gap-16 md:gap-24">
              {MOMENTS.map((moment, i) => (
                <motion.article
                  key={moment.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="lg:col-span-7">
                    <div className="photo-frame rounded-sm overflow-hidden group">
                      <div className="overflow-hidden">
                        <img
                          src={moment.image}
                          alt={moment.imageAlt}
                          className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5">
                    <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-3">
                      {moment.label}
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-4 leading-snug">
                      {moment.title}
                    </h3>
                    <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-6">
                      {moment.body}
                    </p>
                    {moment.href && (
                      <Link
                        to={moment.href}
                        className="inline-flex items-center gap-2 text-accent font-semibold hover:text-white transition-colors"
                      >
                        Learn more
                        <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </Section>

        {/* Manifesto */}
        <Section id="about" className="bg-white text-navy py-20 md:py-28" dark={false}>
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
                  This is not a classroom.
                </h2>
                <p className="text-navy/70 text-lg leading-relaxed mb-8">
                  Youth Innovators Hub is a nonprofit space where young people in Rwanda collaborate, learn, and build digital solutions for social good — through mentorship, hackathons, and hands-on work.
                </p>
                <blockquote className="border-l-2 border-accent pl-5 text-navy/80 italic leading-relaxed">
                  &ldquo;The best way to learn to build is by… well, building. Everything else is just noise.&rdquo;
                  <footer className="mt-2 text-sm not-italic font-semibold text-navy/50">
                    — Founder&apos;s note
                  </footer>
                </blockquote>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
                {COMMUNITY_PHOTOS.map((photo, idx) => (
                  <div
                    key={photo.src}
                    className={`photo-frame rounded-sm overflow-hidden ${
                      idx === 0 || idx === 3 ? 'mt-0 sm:mt-8' : ''
                    } ${idx === 1 || idx === 2 ? 'sm:-mt-4' : ''}`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Founder story */}
        <Section id="founder-story" className="bg-navy py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 lg:order-2">
                <div className="photo-frame rounded-sm overflow-hidden group">
                  <div className="overflow-hidden">
                    <img
                      src={FOUNDER_STORY.image}
                      alt={FOUNDER_STORY.imageAlt}
                      className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 lg:order-1">
                <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-3">
                  {FOUNDER_STORY.label}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-snug">
                  {FOUNDER_STORY.title}
                </h2>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-6">
                  {FOUNDER_STORY.body}
                </p>
                <a
                  href="#build"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('build');
                  }}
                  className="inline-flex items-center gap-2 text-accent font-semibold hover:text-white transition-colors"
                >
                  See our programs
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* Programs — editorial list */}
        <Section id="build" className="bg-navy py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-5 md:px-8">
            <p className="text-accent text-sm font-semibold tracking-wide mb-3">What we do</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-12 md:mb-16">
              Programs for people who want to make things.
            </h2>
            <ul className="divide-y divide-white/10 border-t border-b border-white/10">
              {PROGRAMS.map((program) => (
                <li key={program.slug}>
                  <Link
                    to={`/${program.slug}`}
                    className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 py-6 md:py-7 hover:bg-white/[0.03] -mx-2 px-2 transition-colors"
                  >
                    <span className="font-display text-xl sm:text-2xl font-bold tracking-tight group-hover:text-accent transition-colors sm:min-w-[160px]">
                      {program.title}
                    </span>
                    <span className="text-white/55 text-base sm:text-lg flex-1 leading-snug">
                      {program.desc}
                    </span>
                    <ArrowRight
                      size={18}
                      className="hidden sm:block text-white/30 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Community */}
        <Section id="community" className="bg-navy relative py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
                  Find your people.
                </h2>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  Stop learning alone. Join student builders across Rwanda who are just as obsessed with shipping as you are.
                </p>
                <div className="inline-block border border-white/15 rounded-xl px-6 py-5 bg-white/5">
                  <div className="font-display text-4xl sm:text-5xl font-extrabold text-accent mb-1">
                    {COMMUNITY_STAT.value}
                  </div>
                  <div className="text-sm sm:text-base text-white/60 font-semibold">
                    {COMMUNITY_STAT.label}
                  </div>
                </div>
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2 mt-6 text-accent font-semibold hover:text-white transition-colors"
                >
                  View full gallery
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {COMMUNITY_PHOTOS.slice(0, 4).map((photo, idx) => (
                  <div
                    key={`comm-${photo.src}`}
                    className={`overflow-hidden rounded-lg border border-white/10 ${
                      idx % 2 === 1 ? 'translate-y-4 sm:translate-y-6' : ''
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-36 sm:h-44 md:h-48 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Join CTA */}
        <Section id="cta" className="bg-white text-navy py-20 md:py-28" dark={false}>
          <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-[1.1]">
              Ready when you are.
            </h2>
            <p className="text-navy/65 text-lg mb-10 leading-relaxed">
              No applications. No fees. Just you, the work, and a community that builds in public.
            </p>
            <a
              href={WHATSAPP_JOIN}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-navy text-white font-display font-bold text-lg rounded-xl hover:bg-accent transition-colors"
            >
              Join the Hub
              <ArrowRight size={18} />
            </a>
          </div>
        </Section>
      </main>

      <footer
        className="py-14 md:py-20 px-5 md:px-8 lg:px-16 bg-navy border-t border-accent/40"
        role="contentinfo"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
            <div className="max-w-sm">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('home');
                }}
                className="inline-block mb-5"
              >
                <img
                  src="/logo.png"
                  alt="Youth Innovators Hub"
                  className="h-11 w-auto object-contain"
                />
              </a>
              <p className="text-white/50 text-base leading-relaxed mb-6">
                Youth Innovators Hub — Rwanda&apos;s youth tech community where student builders ship real projects.
              </p>
              <div className="flex gap-2">
                {[
                  {
                    href: 'https://www.instagram.com/youthinnovatorshub/',
                    label: 'Instagram',
                    Icon: Instagram,
                  },
                  {
                    href: 'https://www.linkedin.com/company/youthinnovatorshub/',
                    label: 'LinkedIn',
                    Icon: Linkedin,
                  },
                  { href: 'https://wa.me/250791845268', label: 'WhatsApp', Icon: MessageSquare },
                  {
                    href: 'https://github.com/Youth-Innovators-Hub/',
                    label: 'Github',
                    Icon: Github,
                  },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-accent transition-colors border border-white/10"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 text-sm">
              <div className="space-y-3">
                <span className="text-accent font-semibold block mb-3">Hub</span>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('about');
                  }}
                  className="block text-white/55 hover:text-accent transition-colors"
                >
                  About
                </a>
                <a
                  href="#build"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('build');
                  }}
                  className="block text-white/55 hover:text-accent transition-colors"
                >
                  Programs
                </a>
<a
                  href="#community"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('community');
                  }}
                  className="block text-white/55 hover:text-accent transition-colors"
                >
                  Community
                </a>
                <Link
                  to="/gallery"
                  className="block text-white/55 hover:text-accent transition-colors"
                >
                  Gallery
                </Link>
              </div>
              <div className="space-y-3">
                <span className="text-accent font-semibold block mb-3">Connect</span>
                <button
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  className="block text-white/55 hover:text-accent transition-colors text-left"
                >
                  Send a message
                </button>
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
            <div>&copy; 2026 Youth Innovators Hub (YIHUB)</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
