
import React, { useEffect, useState } from 'react';
import { 
  Rocket, 
  Code, 
  Users, 
  Zap, 
  Terminal, 
  Heart, 
  Star, 
  Globe, 
  ChevronRight, 
  Instagram, 
  Twitter, 
  Github,
  ArrowUpRight,
  ShieldCheck,
  Hammer,
  Sparkles,
  Trophy,
  Coffee,
  MessageSquare,
  Flame,
  Gamepad,
  Microchip,
  Podcast,
  Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './components/Section';
import Sticker from './components/Sticker';
import { ACHIEVEMENTS, ACTIVITIES, UPCOMING_EVENTS } from './constants';

const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');


  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'build', 'events', 'community'];
      const scrollPos = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
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
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#193441] selection:bg-[#438CAF] selection:text-white">
      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative">
              {/* Close Button */}
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-[#438CAF] rounded-full flex items-center justify-center text-white hover:bg-[#438CAF]/80 transition-all"
                aria-label="Close modal"
              >
                <Zap size={20} />
              </button>
              <h2 className="text-2xl font-black text-[#193441] mb-4">Send a Message</h2>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const phone = '250791845268';
                  const text = encodeURIComponent(`Hi, my name is ${contactName}. ${contactMessage}`);
                  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                  setShowContactModal(false);
                  setContactName('');
                  setContactMessage('');
                }}
                className="flex flex-col gap-4"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="border border-[#438CAF]/30 rounded-lg px-4 py-2 text-[#193441] font-bold focus:outline-none focus:border-[#438CAF]"
                  required
                />
                <textarea
                  placeholder="Your Message"
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  className="border border-[#438CAF]/30 rounded-lg px-4 py-2 text-[#193441] font-bold focus:outline-none focus:border-[#438CAF] min-h-[80px]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#438CAF] text-white font-black py-2 rounded-lg hover:bg-[#193441] transition-all"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between bg-[#193441]/90 backdrop-blur-xl border-b border-white/5">
        {/* Logo inside navbar */}
        <div 
          onClick={() => scrollTo('home')}
          className="cursor-pointer hover:scale-105 transition-all duration-300 flex-shrink-0"
        >
          <img 
            src="/logo.png" 
            alt="YIHUB Logo" 
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain select-none"
          />
        </div>

        <div className="hidden lg:flex items-center space-x-8 text-xs font-black uppercase tracking-widest">
          {['about', 'build','community'].map((id) => (
            <button 
              key={id}
              onClick={() => scrollTo(id)} 
              className={`group relative py-2 transition-all ${activeNav === id ? 'text-[#438CAF]' : 'text-white hover:text-[#438CAF]'}`}
            >
              {id === 'build' ? 'What We Do' : id.charAt(0).toUpperCase() + id.slice(1)}
              <span className={`absolute bottom-0 left-0 w-full h-1 bg-[#438CAF] transform scale-x-0 group-hover:scale-x-100 transition-transform ${activeNav === id ? 'scale-x-100' : ''}`} />
            </button>
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[55] bg-[#193441] pt-24 px-6 sm:px-10 flex flex-col lg:hidden"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-[#438CAF] rounded-full flex items-center justify-center text-white hover:bg-[#438CAF]/80 transition-all"
              aria-label="Close menu"
            >
              <Zap size={24} />
            </button>
            
            <div className="flex flex-col space-y-6 sm:space-y-8 mt-8">
              {['about', 'build','community'].map((id) => (
                <button 
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-left tracking-tighter hover:text-[#438CAF] transition-colors"
                >
                  {id === 'build' ? 'What We Do' : id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Mobile CTA */}
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

      {/* Hero Section */}
      <Section id="home" className="min-h-screen flex flex-col justify-center relative p-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/djxxw3ppc/image/upload/v1769309314/IMG_6025_t1itto.jpg" 
            alt="Hackathon Background" 
            className="w-full h-full object-cover opacity-50 "
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#193441] via-[#193441]/40 to-transparent" />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto text-left px-4 sm:px-8 md:px-16 lg:px-24 pt-24 md:pt-0">
          {/* Sticker Scatter - Repositioned for mobile compatibility */}
          {/* <div className="hidden sm:block">
            
            <Sticker text="practice > theory" Icon={ShieldCheck} className="top-[10%] right-[5%] md:top-[15%] md:right-[10%] -rotate-6" delay="0s" />
            <Sticker text="Built by students" Icon={Hammer} className="bottom-[15%] right-[5%] md:bottom-[20%] md:right-[5%] rotate-12" delay="0.5s" />
            <Sticker text="shipRealProjects()" Icon={Rocket} className="top-[35%] left-[0%] md:top-[40%] md:left-[5%] rotate-2" delay="0.8s" />
            <Sticker text="learnByDoing();" Icon={Sparkles} className="bottom-[5%] left-[10%] md:bottom-[-12%] md:left-[40%] -rotate-12" delay="1.2s" />
          </div> */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            <h1 className="text-4xl sm:text-5xl md:text-2xl lg:text-[5rem] font-black leading-[0.85] md:leading-[0.8] tracking-tighter mb-6 md:mb-8 md:mt-10 italic uppercase max-w-4xl">
             SHAPING <span className="text-white drop-shadow-[3px_3px_0px_#438CAF] md:drop-shadow-[6px_6px_0px_#438CAF]">TOMORROW</span><br/>THROUGH<span className="text-[#438CAF] drop-shadow-[2px_2px_0px_#fff] md:drop-shadow-[4px_4px_0px_#fff]"><br />TECH &  INNOVATION.</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold max-w-2xl mb-8 md:mb-12 text-white/80 leading-snug"
          >
            We're a community of young builders in Rwanda learning tech by actually building things —<span className="text-white border-b-2 md:border-b-4 border-[#438CAF]">together.</span>
          </motion.p>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 md:gap-6">
            <a 
              href="https://chat.whatsapp.com/DgU4FYHIqltLjGThwEIFZp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 sm:px-8 md:px-10 py-4 md:py-5 bg-[#438CAF] text-white font-black text-base sm:text-lg md:text-xl uppercase tracking-tighter rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] md:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]"
            >
              Start Building
              <Zap fill="currentColor" size={20} className="md:w-6 md:h-6" />
            </a>
            <button 
              onClick={() => scrollTo('build')}
              className="px-6 sm:px-8 md:px-10 py-4 md:py-5 bg-white/10 text-white font-black text-base sm:text-lg md:text-xl uppercase tracking-tighter rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2 md:gap-3"
            >
              See Projects
              <Gamepad size={20} className="md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </Section>

      {/* The Manifesto - Card Style */}
      <Section id="about" className="bg-white text-[#193441] !py-16 md:!py-32" dark={false}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-none uppercase italic">
                THIS IS NOT A <br/><span className="text-[#438CAF]">CLASS <br /> ROOM.</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#193441]/70 leading-relaxed mb-6 md:mb-8">
                <span className="text-[#438CAF] border-b-4 md:border-b-8 border-white">Youth Innovators Hub spirit.</span><br />We don't do boring traditional classes. We do high-energy sprints, messy code, and breakthrough moments.
              </p>
              <div className="p-4 md:p-6 bg-[#438CAF]/10 rounded-xl md:rounded-2xl border-2 border-dashed border-[#438CAF]">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 text-[#438CAF]">
                  <MessageSquare size={20} className="md:w-6 md:h-6" />
                  <span className="font-black uppercase tracking-wider md:tracking-widest text-xs md:text-sm">Founder's Note</span>
                </div>
                <p className="font-bold italic text-sm md:text-lg leading-snug">
                  "The best way to learn to build is by... well, building. Everything else is just noise."
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-lg">
              {[
                { t: "Build First", d: "Ship projects while others are still reading documentation.", i: Hammer },
                { t: "Ask Loudly", d: "No stupid questions. Just missing context.", i: MessageSquare },
                { t: "Fail Fast", d: "Breaking things is just learning in disguise.", i: Zap },
                { t: "Grow Together", d: "Build your network by building cool stuff.", i: Users }
              ].map((item, idx) => (
                <div key={idx} className="p-5 md:p-8 bg-[#193441] text-white rounded-2xl md:rounded-[2rem] shadow-xl hover:-translate-y-2 transition-transform border-2 md:border-4 border-[#438CAF]/20">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 ">
                    <item.i size={24} className="md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter mb-1 md:mb-2">{item.t}</h3>
                  <p className="text-white/60 font-bold leading-snug text-sm md:text-base">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 md:mt-16 text-base md:text-xl font-bold italic opacity-60">
            <span className="border-b-2 md:border-b-4 border-[#438CAF]">—"The YIHUB Manifesto"</span>
          </div>
        </div>
      </Section>

      {/* Activities - Asymmetrical Grid */}
      <Section id="build" title="So..... what happens here?">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {[
            { title: "Hackathons", desc: "Pure creation, caffeine, and zero sleep. Build fast, learn faster", icon: Flame, color: "bg-[#438CAF]/30 backdrop-blur-md" },
            { title: "Workshops", desc: "Practical skills for the modern builder. Hands-on, no boring slides", icon: Terminal, color: "bg-[#438CAF]/30 backdrop-blur-md" },
            { title: "CodeLift", desc: "Inspiring students across Rwanda's secondary schools.", icon: Rocket, color: "bg-[#438CAF]/30 backdrop-blur-md" },
            { title: "Showcase", desc: "Flex your projects and get feedback from pros.", icon: Trophy, color: "bg-[#438CAF]/30 backdrop-blur-md" },
            { title: "Meetups", desc: "Hang out with people who get your nerdy jokes.", icon: Coffee, color: "bg-[#438CAF]/30 backdrop-blur-md" },
            { title: "Tech Talks", desc: "Real people, real stories.", icon: Podcast, color: "bg-[#438CAF]/30 backdrop-blur-md" }
          ].map((activity, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className={`${activity.color} p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-[2rem] lg:rounded-[2.5rem] relative group overflow-hidden flex flex-col justify-between min-h-[240px] md:min-h-[280px] lg:min-h-[300px] shadow-xl md:shadow-2xl`}
            >
              <div>
                <activity.icon size={36} className="md:w-10 md:h-10 lg:w-12 lg:h-12 mb-4 md:mb-5 lg:mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-2 md:mb-3 lg:mb-4">{activity.title}</h3>
                <p className="text-base md:text-lg lg:text-xl font-bold opacity-80 leading-snug max-w-sm">{activity.desc}</p>
              </div>
              <div className="flex justify-end mt-4">
                <div className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#193441] transition-all">
                  <ArrowUpRight size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
                </div>
              </div>
              {/* Background Number Accent */}
              <div className="absolute -bottom-6 md:-bottom-8 lg:-bottom-10 -right-2 md:-right-3 lg:-right-4 text-[8rem] md:text-[12rem] lg:text-[15rem] font-black opacity-5 pointer-events-none select-none italic group-hover:opacity-10 transition-opacity">
                {idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Community / Proof Section Combined */}
      <Section id="community" className="bg-[#193441] !py-20 md:!py-40 relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#193441] to-transparent z-10" />
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-7xl mx-auto px-4 md:px-6">
          {/* Text Content - Shows first on mobile */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-xs font-black uppercase mb-6 md:mb-8 shadow-lg">
              <Heart size={16} fill="white" />
              <span>We Love Builders</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-none uppercase italic">
              FIND YOUR <br/><span className="text-[#438CAF] border-b-4 md:border-b-8 border-white">PEOPLE.</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-white/80 mb-8 md:mb-12 leading-snug">
              <span className="text-white border-b-2 md:border-b-4 border-[#438CAF]">Stop learning in a vacuum.</span><br className="hidden sm:block" /><span className="sm:hidden"> </span>Connect with other high-schoolers across Rwanda who are as obsessed with building as you are.
            </p>
            
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              {ACHIEVEMENTS.slice(0, 2).map((stat, i) => (
                <div key={i} className="bg-white/5 p-2 md:p-6 rounded-2xl md:rounded-3xl border-2 border-white/10">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-1">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs font-black uppercase text-[#438CAF] tracking-wider md:tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Images Grid - Shows second on mobile */}
          <div className="relative order-2 lg:order-1 w-full">
             <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 relative">
                <div className="space-y-3 sm:space-y-4 md:space-y-6 pt-6 md:pt-12">
                  <div className="rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 border-white shadow-xl md:shadow-2xl transform -rotate-2 md:-rotate-3 hover:rotate-0 transition-transform">
                    <img src="https://res.cloudinary.com/djxxw3ppc/image/upload/v1769312817/_NIY3042_hikvkv.jpg" alt="Builders" className="w-full h-32 sm:h-40 md:h-48 lg:h-auto object-cover" />
                  </div>
                  <div className="rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 border-[#438CAF] shadow-xl md:shadow-2xl transform rotate-2 md:rotate-3 hover:rotate-0 transition-transform">
                    <img src="https://res.cloudinary.com/djxxw3ppc/image/upload/v1769313717/IMG_5954_ntc9ku.jpg" alt="Builders" className="w-full h-32 sm:h-40 md:h-48 lg:h-auto object-cover" />
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4 md:space-y-6 md:mt-10">
                  <div className="rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 border-[#438CAF] shadow-xl md:shadow-2xl transform rotate-1 md:rotate-2 hover:rotate-0 transition-transform">
                    <img src="https://res.cloudinary.com/djxxw3ppc/image/upload/v1769313728/_NIY3030_2_mdqxob.jpg" alt="Builders" className="w-full h-32 sm:h-40 md:h-48 lg:h-auto object-cover" />
                  </div>
                  <div className="rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 border-white shadow-xl md:shadow-2xl transform -rotate-1 md:-rotate-2 hover:rotate-0 transition-transform md:mt-20  ">
                    <img src="https://res.cloudinary.com/djxxw3ppc/image/upload/v1769313997/_NIY3037_urxedm.jpg" alt="Builders" className="w-full h-32 sm:h-40 md:h-48 lg:h-auto object-cover" />
                  </div>
                </div>
             </div>
             {/* Floating Achievement Badge */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-[#193441] p-4 sm:p-6 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-[8px_8px_0px_0px_#438CAF] md:shadow-[9px_10px_0px_0px_#438CAF] z-10 flex items-center gap-3 sm:gap-4 md:gap-6">
                <div className="text-2xl sm:text-3xl md:text-5xl font-black">120+</div>
                <div className="text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider md:tracking-widest leading-none">Builders<br/>Strong.</div>
             </div>
          </div>
        </div>
      </Section>
      {/* Final Call - The Energy Core */}
      <Section id="cta" className="text-center py-20 md:py-40  text-[#193441] relative overflow-hidden">
        {/* Community Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/community.jfif" 
            alt="Community" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white" />
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="relative z-10 max-w-4xl mx-auto px-4 md:px-6"
        >
          <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-[#438CAF] text-white rounded-xl md:rounded-2xl font-black uppercase tracking-wider md:tracking-widest text-xs md:text-sm mb-8 md:mb-12 shadow-2xl animate-bounce">
            <Rocket size={20} className="md:w-6 md:h-6" />
            <span>Ready to ship?</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[9rem] font-black tracking-tighter mb-6 md:mb-12 uppercase italic leading-[0.85]">
            START YOUR <br/><span className="text-[#438CAF] drop-shadow-[2px_2px_0px_#193441] md:drop-shadow-[4px_4px_0px_#193441]">JOURNEY.</span>
          </h2>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-10 md:mb-16 leading-snug px-2">
            No applications. No fees. No excuses. <br className="hidden sm:block"/><span className="sm:hidden"> </span>Just you and the code.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-6 md:gap-8">
            <a 
              href="https://chat.whatsapp.com/DgU4FYHIqltLjGThwEIFZp"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-md sm:w-auto px-8 sm:px-12 md:px-16 py-5 md:py-8 bg-[#193441] text-white font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tighter rounded-2xl md:rounded-[2rem] shadow-[8px_8px_0px_0px_#438CAF] md:shadow-[15px_15px_0px_0px_#438CAF] hover:translate-x-1 hover:-translate-y-1 md:hover:translate-x-2 md:hover:-translate-y-2 transition-all active:shadow-none active:translate-x-0 active:translate-y-0 group inline-flex items-center justify-center"
            >
              JOIN THE HUB
              <ChevronRight className="inline-block ml-2 md:ml-4 group-hover:translate-x-2 transition-transform w-6 h-6 md:w-8 md:h-8" />
            </a>
          </div>
        </motion.div>
      </Section>

      {/* Footer - Solid & Professional yet Bold */}
      <footer className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-16 bg-[#193441] border-t-4 md:border-t-8 border-[#438CAF]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-10 md:gap-12 lg:gap-16 mb-12 md:mb-16 lg:mb-20">
            <div className="max-w-md">
               <div 
          onClick={() => scrollTo('home')}
          className="cursor-pointer hover:scale-105 transition-all duration-300 flex-shrink-0"
        >
          <img 
            src="/logo.png" 
            alt="YIHUB Logo" 
            className="h-12 sm:h-12 md:h-14 lg:h-16 w-auto object-contain select-none"
          />
        </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white/50 mb-6 md:mb-8 leading-tight italic">
                Rwanda's premier builder community for students and innovators.
              </p>
              <div className="flex gap-3 md:gap-4">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/youthinnovatorshub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#438CAF] hover:scale-110 transition-all border border-white/10"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </a>
                {/* Twitter */}
                <a
                  href="https://twitter.com/yihub_rw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#438CAF] hover:scale-110 transition-all border border-white/10"
                  aria-label="Twitter"
                >
                  <Linkedin size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </a>
                {/* Github */}
                <a
                  href="https://wa.me/250791845268"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#438CAF] hover:scale-110 transition-all border border-white/10"
                  aria-label="WhatsApp"
                >
                  <MessageSquare size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="https://github.com/Youth-Innovators-Hub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#438CAF] hover:scale-110 transition-all border border-white/10"
                  aria-label="Github"
                >
                  <Github size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider md:tracking-widest">
              <div className="space-y-3 md:space-y-4 lg:space-y-6">
                <span className="text-[#438CAF] block mb-2 md:mb-4 opacity-100">Hub</span>
                <button onClick={() => scrollTo('about')} className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">About Hub</button>
                <button onClick={() => scrollTo('build')} className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">What we do</button>
                <button onClick={() => scrollTo('community')} className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all">Community</button>
              </div>
              <div className="space-y-3 md:space-y-4 lg:space-y-6 col-span-1 md:col-span-1">
                <span className="text-[#438CAF] block mb-2 md:mb-4 opacity-100">Get in touch</span>
                <button
                  className="block opacity-60 hover:opacity-100 hover:text-[#438CAF] transition-all"
                  onClick={() => setShowContactModal(true)}
                >
                  Send a message
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 md:pt-12 border-t border-white/5 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest md:tracking-[0.3em] opacity-30 italic">
            <div className="md:mt-0">&copy; 2024 YOUTH INNOVATORS HUB.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
