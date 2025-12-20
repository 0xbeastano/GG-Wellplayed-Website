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

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'FACILITIES', id: 'facilities' },
    { name: 'PRICING', id: 'pricing' },
    { name: 'GAMES', id: 'games' },
    { name: 'TOURNAMENTS', id: 'tournaments' },
    { name: 'BOOKING', id: 'booking' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-gg-dark/90 backdrop-blur-md border-gg-cyan/30 py-3' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-8 h-8 md:w-10 md:h-10 bg-gg-dark border border-gg-cyan flex items-center justify-center overflow-hidden">
              <Cpu className="text-gg-cyan w-5 h-5 group-hover:animate-spin" />
              <div className="absolute inset-0 bg-gg-cyan/20 animate-pulse" />
            </div>
            <span className="font-heading font-black text-xl md:text-2xl text-white tracking-tighter italic">
              GG<span className="text-gg-cyan">WP</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="relative text-sm font-mono font-bold text-gray-300 hover:text-white transition-colors group py-2"
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gg-cyan transition-all duration-300 group-hover:w-full" />
                <span className="absolute -top-1 -right-2 text-[8px] text-gg-purple opacity-0 group-hover:opacity-100 transition-opacity">0{navLinks.indexOf(link) + 1}</span>
              </button>
            ))}
            <button
              onClick={() => scrollToSection('booking')}
              className="px-6 py-2 bg-gg-cyan/10 border border-gg-cyan/50 text-gg-cyan font-bold rounded hover:bg-gg-cyan hover:text-gg-dark transition-all duration-300 shadow-[0_0_10px_rgba(0,217,255,0.2)] hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]"
            >
              PLAY NOW
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-gg-dark/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center space-y-8"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => scrollToSection(link.id)}
                className="text-2xl font-heading font-black text-white hover:text-gg-cyan tracking-wider"
              >
                {link.name}
              </motion.button>
            ))}
            <div className="absolute bottom-10 text-xs font-mono text-gray-500">
              SYSTEM_READY // VER 2.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};