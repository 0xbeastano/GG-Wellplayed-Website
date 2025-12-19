import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowDown, Crosshair, Gamepad2, Trophy, Zap, MousePointer2, Cpu, Wifi } from 'lucide-react';

interface VideoConfig {
  id: string;
  src: string;
  poster: string;
  label: string;
  genre: string;
}

// Optimized video assets
const VIDEOS: VideoConfig[] = [
  {
    id: 'fps',
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", 
    poster: "https://picsum.photos/id/1/800/1200", 
    label: "CS:GO 2",
    genre: "SHOOTER"
  },
  {
    id: 'moba',
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 
    poster: "https://picsum.photos/id/2/800/1200",
    label: "DOTA 2",
    genre: "STRATEGY"
  },
  {
    id: 'action',
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    poster: "https://picsum.photos/id/3/800/1200",
    label: "GTA V",
    genre: "OPEN WORLD"
  }
];

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  // Mouse Interaction for Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Parallax Text
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 250]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  // Performance State
  const [isLowPower, setIsLowPower] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Typewriter Effect State
  const [titleVisible, setTitleVisible] = useState(false);

  // --- MOUSE TRACKING ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // --- PERFORMANCE MONITOR & SETUP ---
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setTitleVisible(true);

    // FPS Monitor
    let frameCount = 0;
    let lastTime = performance.now();
    const monitorFps = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        if (frameCount < 30) setIsLowPower(true);
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(monitorFps);
    };
    const raf = requestAnimationFrame(monitorFps);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  // COPYWRITING UPDATE: More aggressive, hardware-focused
  const headline = "DEFY LIMITS. PLAY GODLIKE.";
  
  const taglineItems = [
    { text: "RTX 4090 OC EDITION", color: "text-gg-cyan", icon: Cpu },
    { text: "360Hz DYAC+ PANELS", color: "text-gg-lime", icon: Zap },
    { text: "PS5 PRO IMMERSION", color: "text-gg-purple", icon: Gamepad2 },
    { text: "GIGABIT FIBER LAN", color: "text-gg-pink", icon: Wifi },
  ];

  // Floating Icons Configuration
  const floatingIcons = [
    { Icon: Crosshair, x: '10%', y: '20%', delay: 0 },
    { Icon: Gamepad2, x: '85%', y: '15%', delay: 1 },
    { Icon: Trophy, x: '15%', y: '70%', delay: 2 },
    { Icon: Zap, x: '80%', y: '65%', delay: 1.5 },
  ];

  return (
    <section 
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center bg-gg-dark perspective-1000"
    >
      {/* ==================== BACKGROUND LAYERS ==================== */}

      {/* LAYER 1: Base */}
      <div className="absolute inset-0 bg-[#050714] z-0" />

      {/* LAYER 2: Video Grid (Cinematic Loop) */}
      <div className="absolute inset-0 z-[1] grid grid-cols-1 md:grid-cols-3 opacity-20 md:opacity-30 pointer-events-none">
        {VIDEOS.map((video, idx) => (
          <div key={video.id} className={`relative w-full h-full overflow-hidden border-r border-gg-dark/50 ${isMobile && idx > 0 ? 'hidden' : 'block'}`}>
            <motion.div
              className="w-full h-full"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1.25 }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                repeatType: "reverse", 
                ease: "linear",
                delay: idx * 5 
              }}
            >
              {!isLowPower ? (
                <video
                  className="w-full h-full object-cover filter blur-[2px] contrast-125 saturate-0 md:saturate-50"
                  poster={video.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                   <source src={video.src} type="video/mp4" />
                </video>
              ) : (
                <img src={video.poster} alt={video.label} className="w-full h-full object-cover blur-[1px]" />
              )}
            </motion.div>
            {/* Genre Badge overlay on video */}
            <div className="absolute top-4 left-4 text-[10px] font-mono font-bold tracking-widest text-white/40 border border-white/20 px-2 py-1 uppercase hidden md:block">
              {video.genre} CAM
            </div>
          </div>
        ))}
      </div>

      {/* LAYER 3: Hex Grid Pattern */}
      <div 
        className="absolute inset-0 z-[2] opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444),
            linear-gradient(150deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444),
            linear-gradient(30deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444),
            linear-gradient(150deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444),
            linear-gradient(60deg, #777 25%, transparent 25.5%, transparent 75%, #777 75%, #777),
            linear-gradient(60deg, #777 25%, transparent 25.5%, transparent 75%, #777 75%, #777)
          `,
          backgroundSize: '40px 70px',
          backgroundPosition: '0 0, 0 0, 20px 35px, 20px 35px, 0 0, 20px 35px' 
        }}
      />

      {/* LAYER 4: Interactive Spotlight (Desktop Only) */}
      <motion.div
        className="absolute inset-0 z-[3] pointer-events-none hidden md:block mix-blend-overlay"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(0, 217, 255, 0.15), transparent 80%)`,
        }}
      />

      {/* LAYER 5: Retro Scanlines */}
      <div className="absolute inset-0 z-[4] pointer-events-none bg-[url('https://media.giphy.com/media/xT9IgN8YKQnCg8T5V6/giphy.gif')] opacity-[0.02] bg-repeat mix-blend-screen" />
      <div className="absolute inset-0 z-[4] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />

      {/* LAYER 6: Vignette & Gradient Overlay */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-b from-gg-dark/90 via-gg-dark/50 to-gg-dark" />
      <div className="absolute inset-0 z-[5] bg-[radial-gradient(circle_at_center,transparent_0%,#050714_110%)]" />

      {/* ==================== CONTENT LAYER ==================== */}
      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-[20] flex flex-col items-center w-full max-w-7xl px-4 text-center"
      >
        
        {/* 1. LOGO WITH GLITCH */}
        <div className="relative mb-6 md:mb-10 group cursor-default mt-16 md:mt-0">
          <motion.h2 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="relative z-10 text-6xl sm:text-7xl md:text-[10rem] font-heading font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 tracking-tighter filter drop-shadow-[0_0_10px_rgba(0,217,255,0.2)] leading-[0.85]"
          >
            GG WELLPLAYED
          </motion.h2>
          
          {/* Glitch Duplicates - Adjusted for new size */}
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-70 animate-glitch-1 mix-blend-screen text-6xl sm:text-7xl md:text-[10rem] font-heading font-black italic text-gg-pink left-[3px] pointer-events-none leading-[0.85]">
            GG WELLPLAYED
          </div>
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-70 animate-glitch-2 mix-blend-screen text-6xl sm:text-7xl md:text-[10rem] font-heading font-black italic text-gg-lime -left-[3px] pointer-events-none leading-[0.85]">
            GG WELLPLAYED
          </div>
          <div className="absolute -inset-8 bg-gg-cyan/10 blur-[100px] rounded-full opacity-30 animate-pulse-slow pointer-events-none" />
        </div>

        {/* 2. TYPEWRITER TITLE - Updated to Monospace for "System" look */}
        <h1 className="h-12 md:h-20 flex items-center justify-center text-lg sm:text-2xl md:text-5xl font-mono font-bold text-white tracking-widest drop-shadow-2xl uppercase">
          <span className="text-gg-cyan mr-2 md:mr-4">{">"}</span>
          {headline.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, display: "none" }}
              animate={{ opacity: 1, display: "inline" }}
              transition={{ delay: 0.8 + (index * 0.04) }}
              className={index < 4 || index > 12 ? "text-white" : "text-gg-cyan"} 
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-2 w-2 md:w-3 h-4 md:h-8 bg-gg-cyan inline-block align-middle"
          />
        </h1>

        {/* 3. TAGLINE - Tech Specs with Icons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-8 md:mt-10 flex flex-wrap justify-center items-center gap-x-4 md:gap-x-8 gap-y-4 max-w-5xl"
        >
          {taglineItems.map((item, idx) => (
            <div key={idx} className="flex items-center group">
              {idx > 0 && <span className="text-gray-700 mr-4 md:mr-8 text-lg font-thin">/</span>}
              <item.icon size={16} className={`mr-2 ${item.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
              <span className={`font-mono text-xs sm:text-sm md:text-base font-bold tracking-widest ${item.color} drop-shadow-md border-b border-transparent group-hover:border-current transition-all pb-0.5`}>
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>

        {/* 4. CTA BUTTON */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,217,255,0.3)" }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-10 py-5 md:px-14 md:py-6 bg-transparent overflow-hidden rounded-sm border-2 border-gg-cyan mt-12 md:mt-20 touch-manipulation cursor-pointer"
          onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Book your gaming session now"
        >
          {/* Scanline effect inside button */}
          <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/xT9IgN8YKQnCg8T5V6/giphy.gif')] opacity-10 mix-blend-overlay pointer-events-none" />
          
          <div className="absolute inset-0 w-0 bg-gg-cyan transition-all duration-[250ms] ease-out group-hover:w-full opacity-100" />
          
          <span className="relative z-10 text-gg-cyan group-hover:text-gg-dark font-heading font-black text-xl md:text-2xl tracking-[0.2em] uppercase transition-colors duration-200 italic flex items-center gap-3">
             Start Game
          </span>
        </motion.button>

      </motion.div>

      {/* ==================== FLOATING ELEMENTS (Icons) ==================== */}
      <div className="absolute inset-0 z-[10] pointer-events-none overflow-hidden">
        {floatingIcons.map((item, idx) => (
          <motion.div
            key={idx}
            className="absolute text-gg-cyan/20 hidden md:block"
            style={{ left: item.x, top: item.y }}
            animate={{ 
              y: [0, -20, 0], 
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 5, 
              delay: item.delay, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <item.Icon size={64} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      {/* ==================== SCROLL INDICATOR ==================== */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 z-[20] pointer-events-none cursor-pointer"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <motion.div
           animate={{ y: [0, 10, 0] }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           className="flex flex-col items-center"
        >
          <MousePointer2 size={24} className="text-gg-cyan mb-2" />
          <span className="text-[10px] font-heading font-bold tracking-[0.2em] text-white uppercase bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur">
            Enter The Arena
          </span>
          <ArrowDown size={16} className="text-gg-cyan mt-1" />
        </motion.div>
      </motion.div>

    </section>
  );
};