import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Hero } from './components/Hero';
import { Facilities } from './components/Facilities';
import { Pricing } from './components/Pricing';
import { Features } from './components/Features';
import { GamesLibrary } from './components/GamesLibrary';
import { Tournaments } from './components/Tournaments';
import { Testimonials } from './components/Testimonials';
import { Booking } from './components/Booking';
import { LocationContact } from './components/LocationContact';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/Navbar';
import { FAQ } from './components/FAQ';

// Wrapper component for reveal on scroll animation
const SectionWrapper: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingPercent(prev => {
        if (prev >= 100) return 100;
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 50);

    const timer = setTimeout(() => {
      setLoading(false);
      clearInterval(interval);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Listen for Admin Toggle Event (dispatched from Footer)
  useEffect(() => {
    const handleToggle = () => setIsDashboardOpen(true);
    window.addEventListener('toggleAdminDashboard', handleToggle);
    return () => window.removeEventListener('toggleAdminDashboard', handleToggle);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#050714] flex flex-col items-center justify-center z-50 overflow-hidden font-mono">
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        
        {/* Moving Laser Scan Line */}
        <motion.div 
            className="absolute left-0 right-0 h-1 bg-gg-cyan/30 z-30 shadow-[0_0_20px_rgba(0,217,255,0.5)]"
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
        />

        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(transparent 98%, #00D9FF 98%),
                              linear-gradient(90deg, transparent 98%, #9D00FF 98%)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative z-40 text-center">
          {/* Glitchy Text Container */}
          <div className="relative mb-8 inline-block">
             <motion.h1 
               className="text-4xl md:text-7xl font-heading font-black text-white tracking-tighter"
               animate={{ 
                 textShadow: [
                   "2px 2px 0px #FF006E, -2px -2px 0px #00D9FF",
                   "-2px -2px 0px #FF006E, 2px 2px 0px #00D9FF", 
                   "0px 0px 0px transparent" 
                 ],
                 x: [0, -2, 2, 0],
                 skewX: [0, 5, -5, 0]
               }}
               transition={{ 
                 duration: 0.2, 
                 repeat: Infinity, 
                 repeatType: "mirror", 
                 repeatDelay: 1.5 
               }}
             >
               GG WELLPLAYED
             </motion.h1>
             <h1 className="absolute top-0 left-0 text-4xl md:text-7xl font-heading font-black text-gg-cyan opacity-50 animate-pulse translate-x-[2px] -z-10 tracking-tighter">
               GG WELLPLAYED
             </h1>
             <h1 className="absolute top-0 left-0 text-4xl md:text-7xl font-heading font-black text-gg-pink opacity-50 animate-pulse -translate-x-[2px] -z-10 tracking-tighter">
               GG WELLPLAYED
             </h1>
          </div>

          {/* Loading Bar */}
          <div className="w-64 md:w-96 h-1 bg-gray-800 rounded-full mx-auto relative overflow-hidden mb-4">
             <motion.div 
               className="absolute top-0 left-0 h-full bg-gradient-to-r from-gg-cyan to-gg-purple"
               style={{ width: `${Math.min(loadingPercent, 100)}%` }}
               transition={{ ease: "linear" }}
             />
          </div>

          <div className="flex justify-between w-64 md:w-96 mx-auto text-xs font-mono text-gg-cyan/80">
            <span className="animate-pulse">SYSTEM_INITIALIZING...</span>
            <span>{Math.min(loadingPercent, 100)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gg-dark text-white relative md:cursor-none overflow-x-hidden selection:bg-gg-cyan selection:text-gg-dark font-sans">
      
      {/* GLOBAL BACKGROUND GRID ANIMATION */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,217,255,0.05)_50%,transparent_100%)] bg-[length:100%_100px] animate-grid-move" />
        <div 
          className="absolute inset-0" 
          style={{
             backgroundImage: 'linear-gradient(rgba(157, 0, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(157, 0, 255, 0.05) 1px, transparent 1px)',
             backgroundSize: '50px 50px',
             transform: 'perspective(500px) rotateX(20deg)',
             transformOrigin: 'top'
          }}
        />
      </div>

      <CustomCursor />
      <Navbar />
      <Dashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
      
      <main className="relative z-10 w-full overflow-hidden">
        <Hero />
        
        <SectionWrapper id="facilities">
          <Facilities />
        </SectionWrapper>
        
        <SectionWrapper id="pricing">
          <Pricing />
        </SectionWrapper>
        
        <SectionWrapper>
          <Features />
        </SectionWrapper>
        
        <SectionWrapper id="games">
          <GamesLibrary />
        </SectionWrapper>
        
        <SectionWrapper id="tournaments">
          <Tournaments />
        </SectionWrapper>
        
        <SectionWrapper>
          <Testimonials />
        </SectionWrapper>
        
        <SectionWrapper>
          <FAQ />
        </SectionWrapper>
        
        <SectionWrapper>
          <Booking />
        </SectionWrapper>
        
        <SectionWrapper>
          <LocationContact />
        </SectionWrapper>
      </main>

      <Footer />

      {/* Scroll Progress Bar - Refined for best theme integration */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gg-cyan via-gg-purple to-gg-pink origin-left z-[9999] shadow-[0_0_20px_rgba(0,217,255,0.6)]"
        style={{ scaleX }}
      />
    </div>
  );
};

export default App;