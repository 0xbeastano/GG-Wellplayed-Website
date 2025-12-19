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

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Simulate page load with scan line effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gg-dark flex items-center justify-center z-50 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center relative z-20 px-4"
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-gg-cyan to-gg-purple animate-glitch">
            GG WELLPLAYED
          </h1>
          <motion.div 
            className="h-1 bg-gg-cyan mt-4 w-0 mx-auto"
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <p className="text-gg-lime font-mono mt-2 animate-pulse text-sm md:text-base">INITIALIZING SYSTEM...</p>
        </motion.div>
        <div className="absolute inset-0 bg-gg-cyan/10 animate-scan pointer-events-none h-full" />
      </div>
    );
  }

  return (
    <div className="bg-gg-dark text-white relative md:cursor-none overflow-x-hidden selection:bg-gg-cyan selection:text-gg-dark">
      <CustomCursor />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gg-cyan to-gg-pink origin-left z-50"
        style={{ scaleX }}
      />

      <main className="relative z-10 w-full overflow-hidden">
        <Hero />
        <Facilities />
        <Pricing />
        <Features />
        <GamesLibrary />
        <Tournaments />
        <Testimonials />
        <Booking />
        <LocationContact />
      </main>

      <Footer />
    </div>
  );
};

export default App;