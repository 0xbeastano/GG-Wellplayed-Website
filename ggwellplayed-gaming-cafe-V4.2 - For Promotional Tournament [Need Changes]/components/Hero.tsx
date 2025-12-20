import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowDown, Crosshair, Gamepad2, Car, Trophy, Users, Zap, MousePointer2, Monitor, Disc } from 'lucide-react';

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

  // Social Proof Counter
  const [onlinePlayers, setOnlinePlayers] = useState(8);

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

    // Fake live counter update
    const interval = setInterval(() => {
      setOnlinePlayers(prev => Math.min(Math.max(prev + Math.floor(Math.random() * 3) - 1, 8), 16));
    }, 4000);

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
      clearInterval(interval);
    };
  }, []);

  const headline = "GAME HARDER AT GGWELLPLAYED";
  const taglineItems = [
    { text: "High-End PCs", color: "text-gg-cyan" },
    { text: "PS5 Consoles", color: "text-gg-purple" },
    { text: "240Hz Monitors", color: "text-gg-lime" },
    { text: "Esports Tournaments", color: "text-gg-pink" },
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
        
        {/* 1. SOCIAL PROOF PILL */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mb-8 md:mb-12 flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 shadow-lg"
        >
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
          <span className="text-gray-300 font-mono text-xs md:text-sm tracking-wide">
            <strong className="text-white">{onlinePlayers} Players</strong> Online Now
          </span>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <div className="flex text-yellow-400 gap-0.5">
            {[1,2,3,4,5].map(s => <span key={s} className="text-[10px]">★</span>)}
          </div>
          <span className="text-[10px] text-gray-400 font-bold hidden sm:inline">4.9/5 RATING</span>
        </motion.div>

        {/* 2. LOGO WITH GLITCH */}
        <div className="relative mb-4 md:mb-8 group cursor-default">
          <motion.h2 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="relative z-10 text-5xl sm:text-7xl md:text-9xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gg-cyan to-white tracking-tighter filter drop-shadow-[0_0_25px_rgba(0,217,255,0.3)]"
          >
            GG WELLPLAYED
          </motion.h2>
          {/* Glitch Duplicates */}
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-70 animate-glitch-1 mix-blend-screen text-5xl sm:text-7xl md:text-9xl font-heading font-black text-gg-pink left-[2px] pointer-events-none">
            GG WELLPLAYED
          </div>
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-70 animate-glitch-2 mix-blend-screen text-5xl sm:text-7xl md:text-9xl font-heading font-black text-gg-lime -left-[2px] pointer-events-none">
            GG WELLPLAYED
          </div>
          <div className="absolute -inset-8 bg-gg-cyan/20 blur-[100px] rounded-full opacity-20 animate-pulse-slow pointer-events-none" />
        </div>

        {/* 3. TYPEWRITER TITLE */}
        <h1 className="h-16 md:h-24 flex items-center justify-center text-xl sm:text-3xl md:text-6xl font-heading font-bold text-white tracking-tight drop-shadow-2xl">
          {headline.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, display: "none" }}
              animate={{ opacity: 1, display: "inline" }}
              transition={{ delay: 0.8 + (index * 0.04) }}
              className={index > 14 ? "text-gg-cyan" : ""} // Color 'GGWELLPLAYED' part
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-1 w-2 md:w-4 h-6 md:h-12 bg-gg-cyan inline-block align-middle"
          />
        </h1>

        {/* 4. TAGLINE (Color Coded & Bulleted) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-6 md:mt-8 flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-2 max-w-4xl"
        >
          {taglineItems.map((item, idx) => (
            <div key={idx} className="flex items-center">
              {idx > 0 && <span className="text-gray-600 mr-4 md:mr-6 text-xs">•</span>}
              <span className={`font-mono text-xs sm:text-sm md:text-lg font-bold tracking-wide ${item.color} drop-shadow-md`}>
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>

        {/* 5. MEGA CTA BUTTON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 2.6, type: "spring" }}
          className="mt-12 md:mt-16 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-gg-cyan via-gg-purple to-gg-pink rounded-xl opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
          <button
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative w-full sm:w-auto min-w-[300px] px-8 py-5 md:px-12 md:py-6 bg-gg-dark rounded-xl leading-none flex flex-col items-center justify-center overflow-hidden transform transition-transform duration-200 active:scale-95 border border-white/10"
          >
             {/* Shine Sweep */}
             <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] animate-[shimmer_3s_infinite]" />
             
             <div className="relative z-10 flex items-center gap-3">
               <span className="font-heading font-black text-xl md:text-3xl text-white tracking-widest uppercase group-hover:text-gg-cyan transition-colors">
                 BOOK NOW
               </span>
               <span className="bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded animate-pulse">
                 LIMITED SLOTS
               </span>
             </div>
             
             <div className="relative z-10 mt-2 flex items-center gap-4 text-[10px] md:text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1 text-gg-lime">
                  <Monitor size={10} /> 5 Rigs Available
                </span>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span>Walk-ins Welcome</span>
             </div>
          </button>
        </motion.div>

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
            Explore The Arena
          </span>
          <ArrowDown size={16} className="text-gg-cyan mt-1" />
        </motion.div>
      </motion.div>

    </section>
  );
};