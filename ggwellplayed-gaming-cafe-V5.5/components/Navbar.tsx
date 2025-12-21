import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Small delay to allow menu close animation
      setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navLinks = [
    { name: 'FACILITIES', id: 'facilities' },
    { name: 'PRICING', id: 'pricing' },
    { name: 'GAMES', id: 'games' },
    // { name: 'TOURNAMENTS', id: 'tournaments' }, // Removed
    { name: 'BOOKING', id: 'booking' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-gg-dark/95 backdrop-blur-md border-gg-cyan/30 py-3 shadow-lg' 
            : 'bg-transparent border-transparent py-4 md:py-6'
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none relative z-50"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-9 h-9 md:w-10 md:h-10 bg-gg-dark border border-gg-cyan flex items-center justify-center overflow-hidden transform skew-x-[-10deg]">
              <Cpu className="text-gg-cyan w-5 h-5 group-hover:animate-spin" />
              <div className="absolute inset-0 bg-gg-cyan/20 animate-pulse" />
            </div>
            <span className="font-heading font-black text-xl md:text-2xl text-white tracking-widest italic flex gap-1">
              GG<span className="text-gg-cyan text-stroke-white">WP</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="relative text-sm font-heading font-bold text-gray-300 hover:text-white transition-colors group py-2 tracking-wider"
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gg-cyan transition-all duration-300 group-hover:w-full" />
                <span className="absolute -top-1 -right-2 text-[8px] text-gg-purple opacity-0 group-hover:opacity-100 transition-opacity font-mono">0{navLinks.indexOf(link) + 1}</span>
              </button>
            ))}
            <button
              onClick={() => scrollToSection('booking')}
              className="px-6 py-2 bg-gg-cyan/10 border border-gg-cyan text-gg-cyan font-heading font-bold rounded hover:bg-gg-cyan hover:text-gg-dark transition-all duration-300 shadow-[0_0_10px_rgba(0,217,255,0.2)] hover:shadow-[0_0_20px_rgba(0,217,255,0.6)] active:scale-95 clip-path-slant text-sm"
            >
              PLAY NOW
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white p-2 focus:outline-none relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} className="text-gg-red" /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-gg-dark flex flex-col items-center justify-center space-y-8 touch-none overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gg-cyan/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gg-purple/10 rounded-full blur-[80px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:30px_30px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full px-8 gap-6 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  onClick={() => scrollToSection(link.id)}
                  className="w-full text-center py-4 text-3xl font-heading font-black text-white active:text-gg-cyan active:scale-95 transition-all border-b border-gray-800/50 tracking-widest uppercase"
                >
                  {link.name}
                </motion.button>
              ))}
              
              <motion.button
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 onClick={() => scrollToSection('booking')}
                 className="w-full py-5 mt-6 bg-gg-cyan text-gg-dark font-heading font-black text-xl rounded-lg uppercase tracking-widest shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:scale-105 transition-transform"
              >
                BOOK SLOT
              </motion.button>
            </div>

            <div className="absolute bottom-10 text-xs font-mono text-gray-500 flex flex-col items-center z-10">
              <span className="text-gg-cyan animate-pulse">SYSTEM_ONLINE // VER 2.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};