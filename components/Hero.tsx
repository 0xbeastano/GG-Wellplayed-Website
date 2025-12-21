import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface VideoConfig {
  id: string;
  src: string;
  poster: string;
  alt: string;
}

const VIDEOS: VideoConfig[] = [
  {
    id: 'fps-gameplay',
    // Abstract HUD video
    src: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-interface-hud-scanning-data-3174-large.mp4",
    // Poster: Tactical FPS View - High Quality Gaming Setup
    poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop", 
    alt: "Tactical FPS Gameplay"
  },
  {
    id: 'racing-gameplay',
    // Abstract Tunnel/Speed video
    src: "https://assets.mixkit.co/videos/preview/mixkit-abstract-tunnel-with-blue-lights-2572-large.mp4",
    // Poster: Racing Cockpit - Steering Wheel
    poster: "https://images.unsplash.com/photo-1547924667-62ca45b7e2a8?q=80&w=1600&auto=format&fit=crop", 
    alt: "High Speed Racing Simulator"
  },
  {
    id: 'rpg-gameplay',
    // Cyberpunk City video
    src: "https://assets.mixkit.co/videos/preview/mixkit-purple-and-blue-lights-in-a-cyberpunk-city-4037-large.mp4", 
    // Poster: Cyberpunk / Neon City Atmosphere
    poster: "https://images.unsplash.com/photo-1533972724312-6eaf65e81882?q=80&w=1600&auto=format&fit=crop", 
    alt: "Open World RPG Atmosphere"
  }
];

// --- SYNCED GLITCH COMPONENT ---
const GlitchTextWrapper = ({ children, className = "", isOutline = false }: { children?: React.ReactNode, className?: string, isOutline?: boolean }) => {
  return (
    <motion.div 
      className={`relative inline-block cursor-default ${className}`}
      initial="initial"
      whileHover="hover"
      whileTap="hover" // Enable glitch on tap for mobile
      style={{ transform: "translateZ(0)" }}
    >
      {/* Base Layer */}
      <motion.div
        variants={{
          initial: { x: 0, skewX: 0, textShadow: "0px 0px 0px transparent" },
          hover: {
            x: [0, -2, 2, 0],
            skewX: [0, 5, -5, 0],
            textShadow: [
              "0px 0px 0px transparent",
              "-2px 0px 0px #00D9FF, 2px 0px 0px #FF006E",
              "0px 0px 0px transparent"
            ],
            transition: { duration: 0.2, repeat: Infinity, repeatType: "mirror" }
          }
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Ghost Layer */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-0 select-none pointer-events-none"
        variants={{
          initial: { opacity: 0, x: 0, display: "none" },
          hover: {
            opacity: [0, 0.6, 0],
            x: [0, -5, 5, 0],
            skewX: [0, 20, -20, 0],
            display: "block",
            transition: { duration: 0.2, repeat: Infinity, repeatType: "mirror" }
          }
        }}
        style={{ 
          color: isOutline ? '#00D9FF' : undefined,
          WebkitTextStroke: isOutline ? '0px' : undefined
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef);
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 200]);
  
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current.forEach(video => {
      if (!video) return;
      if (isInView) {
        // Attempt to play, catch errors (like autoplay policy or network issues)
        video.play().then(() => {
             // If video plays successfully, fade it in
             video.style.opacity = '0.6'; 
        }).catch((e) => {
             console.log("Video autoplay blocked or failed, keeping poster visible.", e);
             // Keep video invisible so background image shows
             video.style.opacity = '0'; 
        });
      } else {
        video.pause();
      }
    });
  }, [isInView]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${clientX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${clientY}px`);
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center text-center bg-gg-dark perspective-1000 px-4 touch-manipulation"
    >
      {/* LAYER 1: BACKGROUND GRID (IMAGES + VIDEOS) */}
      <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-3 pointer-events-none bg-gg-dark">
        {VIDEOS.map((video, idx) => (
          <div key={video.id} className="relative w-full h-full overflow-hidden border-b md:border-b-0 md:border-r border-black/50 group">
            
            {/* 1. Background Image Layer (Uses img tag for reliability) */}
            <img 
              src={video.poster}
              alt={video.alt}
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            
            {/* 2. Video Layer (Starts invisible, fades in if loaded) */}
            <video
              ref={el => { videoRefs.current[idx] = el }}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-10"
              style={{ opacity: 0 }} 
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src={video.src} type="video/mp4" />
            </video>
            
            {/* 3. Gradient Overlays */}
            <div className="absolute inset-0 bg-gg-dark/40 mix-blend-multiply z-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-gg-dark/90 via-transparent to-gg-dark/90 z-20" />
          </div>
        ))}
      </div>

      {/* LAYER 2: SPOTLIGHT (Desktop) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(circle 800px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%)`,
        }}
      />

      {/* LAYER 3: MAIN CONTENT */}
      <motion.div 
        style={{ y: yText, z: 20 }}
        className="relative flex flex-col items-center justify-center w-full max-w-full mx-auto z-20"
      >
        <div className="relative mb-8 w-full flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-8 select-none">
            <GlitchTextWrapper>
              <h1 className="font-heading font-black tracking-tighter leading-none text-white drop-shadow-2xl
                  text-[25vw] sm:text-[20vw] lg:text-[14rem] xl:text-[16rem]
                  bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400
              ">
                GG
              </h1>
            </GlitchTextWrapper>

            <GlitchTextWrapper isOutline>
              <h1 className="font-heading font-black tracking-tighter leading-none
                  text-[12vw] sm:text-[10vw] lg:text-[7rem] xl:text-[8rem]
                  text-transparent relative
              "
              style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.9)' }}
              >
                WELL
                <br className="lg:hidden" />
                PLAYED
              </h1>
            </GlitchTextWrapper>
        </div>
        
        <div className="w-48 md:w-96 h-1 bg-gradient-to-r from-transparent via-gg-cyan to-transparent mb-8 animate-pulse" />

        {/* TAGLINE */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5, duration: 0.8 }}
           className="relative px-4 py-3 md:px-6 md:py-4 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] max-w-[95vw]"
        >
           <p className="font-mono text-[10px] sm:text-sm md:text-lg tracking-wide text-center font-bold flex flex-wrap justify-center items-center gap-x-2 md:gap-x-3 gap-y-2 uppercase">
              <span className="text-gg-cyan drop-shadow-[0_0_8px_rgba(0,217,255,0.6)]">High-End PCs</span>
              <span className="text-gray-600 align-middle">•</span>
              <span className="text-gg-purple drop-shadow-[0_0_8px_rgba(157,0,255,0.6)]">PS5 Consoles</span>
              <span className="hidden sm:inline text-gray-600 align-middle">•</span>
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">240Hz Monitors</span>
           </p>
        </motion.div>

        {/* ACTION BUTTON - OPTIMIZED FOR TOUCH */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 md:mt-12 group relative inline-flex items-center justify-center min-w-[200px] min-h-[56px] px-8 md:px-12 py-3 md:py-4 font-heading font-bold text-gg-dark bg-gg-cyan clip-path-slant hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] transition-all duration-300 touch-manipulation"
        >
            <span className="relative flex items-center gap-3 text-lg md:text-xl tracking-widest uppercase">
                Reserve Slot
                <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
            </span>
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 text-white/70 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase animate-pulse">Scroll</span>
        <div className="w-px h-12 md:h-16 bg-gradient-to-b from-gg-cyan to-transparent" />
      </motion.div>
    </section>
  );
};