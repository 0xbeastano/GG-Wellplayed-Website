import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface VideoConfig {
  id: string;
  src: string;
  poster: string;
  alt: string;
}

// Updated VIDEOS with "Gaming Screenplay" aesthetics (Cyberpunk, HUD, Speed)
const VIDEOS: VideoConfig[] = [
  {
    id: 'cyberpunk-gameplay',
    src: "https://assets.mixkit.co/videos/preview/mixkit-purple-and-blue-lights-in-a-cyberpunk-city-4037-large.mp4", 
    poster: "https://images.unsplash.com/photo-1533972724312-6eaf65e81882?q=80&w=2070", 
    alt: "Cyberpunk City RPG Atmosphere"
  },
  {
    id: 'fps-hud',
    src: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-interface-hud-scanning-data-3174-large.mp4",
    poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
    alt: "Tactical Shooter HUD"
  },
  {
    id: 'racing-speed',
    src: "https://assets.mixkit.co/videos/preview/mixkit-abstract-tunnel-with-blue-lights-2572-large.mp4",
    poster: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071",
    alt: "High Speed Racing Gameplay"
  }
];

// --- NEW ANIMATION COMPONENT: CYPHER DECODE ---
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

interface DecodeCharProps {
  char: string;
  index: number;
}

const DecodeChar: React.FC<DecodeCharProps> = ({ char, index }) => {
  const [displayText, setDisplayText] = useState(char);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Track animation state to prevent overlapping intervals
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const triggerDecode = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setDisplayText(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
      
      iteration += 1;
      if (iteration > 10) { // 10 frames of scrambling
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(char);
      }
    }, 50); // Speed of scramble
  };

  // Auto-play for mobile (Ripple effect)
  useEffect(() => {
    if (isMobile) {
      const delay = 1000 + (index * 200); // Staggered start
      const loop = setInterval(() => {
        triggerDecode();
      }, 5000 + (index * 100)); // Loop every 5-6 seconds

      const initialTimeout = setTimeout(() => {
        triggerDecode();
      }, delay);

      return () => {
        clearInterval(loop);
        clearTimeout(initialTimeout);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isMobile, index, char]);

  return (
    <motion.span
      onMouseEnter={() => {
        setIsHovered(true);
        triggerDecode();
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-block whitespace-pre cursor-default transition-colors duration-300 ${
        isHovered ? 'text-gg-cyan drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]' : 'text-white'
      }`}
      style={{ display: 'inline-block', minWidth: char === " " ? '0.5em' : 'auto' }}
    >
      {displayText}
    </motion.span>
  );
};

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef);
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 200]);
  
  // Video Refs to manage playback
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current.forEach(video => {
      if (!video) return;
      if (isInView) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play was prevented
          });
        }
      } else {
        video.pause();
      }
    });
  }, [isInView]);

  // Mouse Logic for Spotlight
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${clientX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${clientY}px`);
    }
  };

  const title1 = "GG";
  const title2 = "WELLPLAYED";
  const subtext = "Pune's Premier Gaming Destination | High-End PCs | PS5 | Tournaments";

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center text-center bg-gg-dark perspective-1000 px-4"
    >
      {/* LAYER 1: GAMING SCREENPLAYS - High Visibility */}
      <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-3 pointer-events-none bg-black">
        {VIDEOS.map((video, idx) => (
          <div key={video.id} className="relative w-full h-full overflow-hidden border-r border-black/50">
            <video
              ref={el => { videoRefs.current[idx] = el }}
              className="absolute inset-0 w-full h-full object-cover"
              poster={video.poster}
              autoPlay
              muted
              loop
              playsInline
              style={{ opacity: 0.85 }} // 85% Opacity for high visibility
            >
              <source src={video.src} type="video/mp4" />
            </video>
            
            {/* Polished Overlay: Lighter than before to show gameplay */}
            {/* 1. Subtle tint to unify colors without hiding content */}
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
            
            {/* 2. Gradient Vignette only at edges for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            
            {/* 3. Tech Grid Overlay (Very subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px] opacity-20" />
          </div>
        ))}
      </div>

      {/* LAYER 2: INTERACTIVE SPOTLIGHT (Desktop Only) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(circle 800px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)`,
        }}
      />

      {/* LAYER 3: MAIN CONTENT */}
      <motion.div 
        style={{ y: yText, z: 20 }}
        className="relative flex flex-col items-center justify-center w-full max-w-7xl mx-auto"
      >
        {/* NEW TITLE ANIMATION: CYPHER DECODE */}
        <div className="relative mb-10 w-full flex flex-col items-center">
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 z-10 select-none">
                {/* 'GG' */}
                <h1 className="font-heading font-black text-6xl md:text-9xl text-white tracking-tighter drop-shadow-2xl">
                    <div className="flex">
                        {title1.split("").map((char, i) => (
                            <DecodeChar key={`gg-${i}`} char={char} index={i} />
                        ))}
                    </div>
                </h1>

                {/* 'WELLPLAYED' */}
                <h1 className="font-heading font-black text-5xl md:text-9xl text-transparent tracking-tighter drop-shadow-2xl"
                     style={{ WebkitTextStroke: '2px rgba(255,255,255,0.9)' }}
                >
                    <div className="flex flex-wrap justify-center">
                        {title2.split("").map((char, i) => (
                            <DecodeChar key={`wp-${i}`} char={char} index={i + 2} />
                        ))}
                    </div>
                </h1>
            </div>
            
            {/* Decorative Divider */}
            <div className="w-64 md:w-96 h-1 bg-gradient-to-r from-transparent via-gg-cyan to-transparent mt-8 animate-pulse" />
        </div>

        {/* SUBHEADING */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1, duration: 0.8 }}
           className="relative px-8 py-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        >
           <div className="flex items-center gap-4">
               <span className="w-2 h-2 bg-gg-lime rounded-full animate-pulse shadow-[0_0_10px_#CCFF00]" />
               <p className="text-white font-mono text-xs md:text-lg tracking-widest text-center uppercase">
                  {subtext}
               </p>
               <span className="w-2 h-2 bg-gg-lime rounded-full animate-pulse shadow-[0_0_10px_#CCFF00]" />
           </div>
        </motion.div>

        {/* ACTION BUTTON */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-16 group relative inline-flex items-center justify-center px-10 py-4 font-heading font-bold text-gg-dark bg-gg-cyan clip-path-slant hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] transition-all duration-300"
        >
            <span className="relative flex items-center gap-3 text-xl tracking-widest uppercase">
                Reserve Slot
                <ArrowDown size={24} className="group-hover:translate-y-1 transition-transform" />
            </span>
        </motion.button>

      </motion.div>

      {/* SCROLL INDICATOR */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-white/70 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase animate-pulse">Scroll to Start</span>
        <div className="w-px h-16 bg-gradient-to-b from-gg-cyan to-transparent" />
      </motion.div>
      
    </section>
  );
};