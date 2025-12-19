import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowDown, WifiOff, Cpu } from 'lucide-react';

// Video Configuration Interface
interface VideoConfig {
  id: string;
  src: string; // Using placeholders for demo, replace with local assets
  poster: string;
  alt: string;
}

const VIDEOS: VideoConfig[] = [
  {
    id: 'cs2',
    // Using high-quality optimized external placeholders for demonstration. 
    // In production, replace src with: "/videos/csgo-gameplay-optimized.mp4"
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", 
    poster: "https://picsum.photos/id/1/800/1200", 
    alt: "CS:GO 2 Tactical Gameplay"
  },
  {
    id: 'valorant',
    // In production: "/videos/valorant-gameplay-optimized.mp4"
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "https://picsum.photos/id/2/800/1200",
    alt: "Valorant Ability Usage"
  },
  {
    id: 'gta',
    // In production: "/videos/gta-gameplay-optimized.mp4"
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    poster: "https://picsum.photos/id/3/800/1200",
    alt: "GTA V High Speed Action"
  }
];

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(containerRef);
  
  // Parallax Text
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 200]);
  
  // Device Capabilities State
  const [isLowPower, setIsLowPower] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- PERFORMANCE OPTIMIZATION ENGINE ---
  useEffect(() => {
    const checkSystem = () => {
      // 1. Detect Mobile
      const mobileCheck = window.innerWidth < 768;
      setIsMobile(mobileCheck);

      // 2. Network Speed Detection (Experimental API)
      const connection = (navigator as any).connection;
      const slowConnection = connection ? ['slow-2g', '2g', '3g'].includes(connection.effectiveType) : false;

      // 3. Hardware Concurrency (Low-end device detection)
      const cores = navigator.hardwareConcurrency || 4;
      const lowCores = cores < 4;

      // 4. Reduced Motion Preference
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (slowConnection || lowCores || reducedMotion) {
        setIsLowPower(true);
        console.log("GG_OPTIMIZER: Low power mode enabled");
      }
    };

    checkSystem();
  }, []);

  // --- PARTICLE SYSTEM (Layer 3) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }); // Optimize for transparency
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const colors = ['#00D9FF', '#9D00FF', '#FF006E'];
    // Reduce particle count significantly on mobile/low-power
    const particleCount = isMobile || isLowPower ? 20 : 60; 

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; depth: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        depth: Math.random() * 0.5 + 0.5,
      });
    }

    let animationFrameId: number;
    let targetMouseX = 0; 
    let targetMouseY = 0;
    let currentMouseX = 0; 
    let currentMouseY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Smooth mouse parallax (disabled on mobile)
      if (!isMobile) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      }

      // Pre-calculate visual positions and update physics
      const visualParticles = particles.map(p => {
        // Update physics
        p.x += p.vx;
        p.y += p.vy;

        // Wrap logic
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Parallax calc
        const px = p.x + (currentMouseX * p.depth * 40);
        const py = p.y + (currentMouseY * p.depth * 40);

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Connections (Only on high-end desktop)
        if (!isMobile && !isLowPower) {
           particles.forEach(p2 => {
             const dx = px - (p2.x + (currentMouseX * p2.depth * 40));
             const dy = py - (p2.y + (currentMouseY * p2.depth * 40));
             const dist = Math.sqrt(dx*dx + dy*dy);
             if (dist < 100) {
               ctx.strokeStyle = `rgba(0, 217, 255, ${1 - dist/100})`;
               ctx.lineWidth = 0.2;
               ctx.beginPath();
               ctx.moveTo(px, py);
               ctx.lineTo(p2.x + (currentMouseX * p2.depth * 40), p2.y + (currentMouseY * p2.depth * 40));
               ctx.stroke();
             }
           });
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile, isLowPower]);

  const headline = "GAME HARDER AT GGWELLPLAYED";
  const words = headline.split(" ");

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center text-center bg-gg-dark"
    >
      {/* LAYER 1: VIDEO BACKGROUND GRID */}
      <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-3 pointer-events-none">
        {VIDEOS.map((video, index) => (
          <div key={video.id} className="relative w-full h-full overflow-hidden border-r border-gg-dark/50">
            {!isLowPower ? (
              <video
                className="absolute inset-0 w-full h-full object-cover opacity-20 md:opacity-25 blur-[2px] md:blur-[1px] scale-110"
                poster={video.poster}
                autoPlay
                muted
                loop
                playsInline
                // Optimization: Pause when hero is not in view
                ref={el => {
                  if (el) {
                    isInView ? el.play().catch(() => {}) : el.pause();
                  }
                }}
              >
                {/* Lazy load source */}
                {isInView && <source src={video.src} type="video/mp4" />}
              </video>
            ) : (
              // Fallback for Low Power Mode
              <img 
                src={video.poster} 
                alt={video.alt}
                className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
              />
            )}
            {/* Individual Video Tint */}
            <div className="absolute inset-0 bg-gg-dark/30 mix-blend-multiply" />
          </div>
        ))}
      </div>

      {/* LAYER 2: GRADIENT OVERLAYS (For Text Readability) */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-b from-gg-dark/80 via-transparent to-gg-dark" />
      <div className="absolute inset-0 z-[5] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,7,20,0.8)_100%)]" />
      
      {/* LAYER 3: PARTICLES */}
      <motion.div style={{ y: yText }} className="absolute inset-0 z-[10] pointer-events-none">
         <canvas ref={canvasRef} className="absolute inset-0" />
      </motion.div>

      {/* LAYER 4: SCANLINES & FX */}
      <div className="absolute inset-0 z-[15] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />

      {/* LAYER 5: CONTENT */}
      <div className="relative z-[20] flex flex-col items-center max-w-7xl mx-auto space-y-6 md:space-y-8 w-full px-4">
        
        {/* Hardware Status Indicators (Visible only on low power) */}
        {isLowPower && (
          <div className="absolute top-4 right-4 flex gap-2">
            <div title="Low Power Mode Active" className="bg-red-500/10 border border-red-500/30 p-2 rounded text-red-500 animate-pulse">
              <Cpu size={16} />
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-2 md:mb-6 relative inline-block group cursor-default max-w-full"
        >
          {/* Main Logo Text */}
          <h2 className="relative z-10 text-5xl sm:text-6xl md:text-8xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-gg-cyan via-white to-gg-purple tracking-tighter filter drop-shadow-[0_0_15px_rgba(0,217,255,0.3)]">
            GG WELLPLAYED
          </h2>
          
          {/* Optimized Glitch Layers - Only animate transform, avoid clip-path on mobile if possible */}
          <h2 className="absolute top-0 left-0 -z-10 text-5xl sm:text-6xl md:text-8xl font-heading font-black text-gg-cyan opacity-60 animate-glitch-1 tracking-tighter mix-blend-screen translate-x-[2px]" aria-hidden="true">
            GG WELLPLAYED
          </h2>
          <h2 className="absolute top-0 left-0 -z-10 text-5xl sm:text-6xl md:text-8xl font-heading font-black text-gg-pink opacity-60 animate-glitch-2 tracking-tighter mix-blend-screen -translate-x-[2px]" aria-hidden="true">
            GG WELLPLAYED
          </h2>
        </motion.div>

        {/* Animated Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white flex flex-wrap justify-center gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 drop-shadow-lg px-2 max-w-5xl leading-tight">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1), duration: 0.4 }}
              className="cursor-default"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Responsive Subheading */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="w-full flex justify-center px-4"
        >
           <p className="text-gg-text-sec text-xs sm:text-sm md:text-xl font-mono text-gray-300 leading-relaxed md:whitespace-nowrap text-center bg-gg-dark/40 backdrop-blur-sm px-4 py-2 rounded border border-white/5">
            <span className="md:hidden block mb-1 text-white font-bold">Pune's Premier Gaming Destination</span>
            <span className="hidden md:inline">Pune's Premier Gaming Destination | </span>
            <span className="inline-block text-gg-cyan">High-End PCs</span> 
            <span className="mx-2 text-gray-500">|</span> 
            <span className="inline-block text-gg-purple">PS5</span> 
            <span className="mx-2 text-gray-500">|</span> 
            <span className="inline-block text-gg-pink">Tournaments</span>
          </p>
        </motion.div>

        {/* CTA Button - High Accessibility & Touch Target */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,217,255,0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-8 py-4 md:px-10 md:py-5 bg-transparent overflow-hidden rounded-sm border-2 border-gg-cyan mt-6 md:mt-8 touch-manipulation"
          onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Book your gaming session now"
        >
          <div className="absolute inset-0 w-0 bg-gg-cyan transition-all duration-[250ms] ease-out group-hover:w-full opacity-100" />
          <span className="relative text-gg-cyan group-hover:text-gg-dark font-heading font-black text-lg md:text-xl tracking-widest uppercase transition-colors duration-200">
            Book Your Session
          </span>
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 text-gg-cyan flex flex-col items-center gap-2 z-[20] pointer-events-none"
      >
        <span className="text-[10px] md:text-xs font-mono tracking-widest opacity-80 uppercase">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={20} className="md:w-6 md:h-6 drop-shadow-[0_0_5px_#00D9FF]" />
        </motion.div>
      </motion.div>
    </section>
  );
};