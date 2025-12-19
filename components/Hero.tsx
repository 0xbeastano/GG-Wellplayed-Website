import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowDown, Cpu, Wifi, Activity } from 'lucide-react';

interface VideoConfig {
  id: string;
  src: string;
  poster: string;
  alt: string;
  label: string;
}

const VIDEOS: VideoConfig[] = [
  {
    id: 'cs2',
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", 
    poster: "https://picsum.photos/id/1/800/1200", 
    alt: "CS:GO 2 Gameplay",
    label: "CS:GO 2"
  },
  {
    id: 'valorant',
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "https://picsum.photos/id/2/800/1200",
    alt: "Valorant Gameplay",
    label: "VALORANT"
  },
  {
    id: 'gta',
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    poster: "https://picsum.photos/id/3/800/1200",
    alt: "GTA V Gameplay",
    label: "GTA V"
  }
];

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(containerRef);
  
  // Parallax Text
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 200]);
  
  // Performance State
  const [isLowPower, setIsLowPower] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fps, setFps] = useState(60);

  // --- PERFORMANCE MONITORING ENGINE ---
  useEffect(() => {
    // 1. Static Checks
    const mobileCheck = window.innerWidth < 768;
    setIsMobile(mobileCheck);

    const connection = (navigator as any).connection;
    if (connection && ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
      setIsLowPower(true);
    }
    
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      setIsLowPower(true);
    }

    // 2. Live FPS Monitor
    let frameCount = 0;
    let lastTime = performance.now();
    let lowFpsStrikes = 0;
    let rafId: number;

    const monitorFps = () => {
      const now = performance.now();
      frameCount++;
      
      if (now - lastTime >= 1000) {
        const currentFps = frameCount;
        setFps(currentFps);
        
        if (currentFps < 35) {
          lowFpsStrikes++;
          // If FPS is bad for 3 consecutive seconds, trigger low power mode
          if (lowFpsStrikes > 3) {
             setIsLowPower(true);
             console.warn("GG_OPTIMIZER: High latency detected. Switching to Low Power Mode.");
          }
        } else {
          lowFpsStrikes = 0;
        }
        
        frameCount = 0;
        lastTime = now;
      }
      rafId = requestAnimationFrame(monitorFps);
    };

    rafId = requestAnimationFrame(monitorFps);

    return () => cancelAnimationFrame(rafId);
  }, []);

  // --- PARTICLE SYSTEM ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Reduce particle count based on performance mode
    const particleCount = isLowPower ? 15 : isMobile ? 30 : 60; 
    
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      color: ['#00D9FF', '#9D00FF', '#FF006E'][Math.floor(Math.random() * 3)],
      depth: Math.random() * 0.5 + 0.5,
    }));

    let animationId: number;
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (!isMobile) {
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;
      }

      // Pre-calculate visual positions and update physics
      const visualParticles = particles.map(p => {
        // Update physics
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        const px = p.x + (mouseX * p.depth * 40);
        const py = p.y + (mouseY * p.depth * 40);

        ctx.globalAlpha = isLowPower ? 0.4 : 0.8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections only in high perf mode
        if (!isLowPower && !isMobile) {
          particles.forEach(p2 => {
             const dx = px - (p2.x + (mouseX * p2.depth * 40));
             const dy = py - (p2.y + (mouseY * p2.depth * 40));
             const dist = Math.sqrt(dx*dx + dy*dy);
             if (dist < 100) {
               ctx.strokeStyle = `rgba(0, 217, 255, ${0.1 * (1 - dist/100)})`;
               ctx.lineWidth = 0.5;
               ctx.beginPath();
               ctx.moveTo(px, py);
               ctx.lineTo(p2.x + (mouseX * p2.depth * 40), p2.y + (mouseY * p2.depth * 40));
               ctx.stroke();
             }
          });
        }
      });
      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / width) * 2 - 1;
      targetY = (e.clientY / height) * 2 - 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [isLowPower, isMobile]);

  const headline = "GAME HARDER AT GGWELLPLAYED";
  const words = headline.split(" ");

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center text-center bg-gg-dark"
    >
      {/* LAYER 1: VIDEO GRID */}
      <div 
        className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-3 pointer-events-none transition-all duration-1000"
        style={{ opacity: isLowPower ? 0.1 : 0.2 }}
      >
        {VIDEOS.map((video) => (
          <div key={video.id} className="relative w-full h-full overflow-hidden border-r border-gg-dark/50 group">
            {isLowPower ? (
              <img 
                src={video.poster} 
                alt={video.alt}
                className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
              />
            ) : (
              <motion.div
                className="w-full h-full"
                animate={{ scale: [1, 1.15] }}
                transition={{ duration: 40, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                <video
                  className="absolute inset-0 w-full h-full object-cover filter brightness-110 contrast-110 blur-[2px]"
                  poster={video.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  ref={el => {
                    if (el) isInView ? el.play().catch(() => {}) : el.pause();
                  }}
                >
                   {isInView && <source src={video.src} type="video/mp4" />}
                </video>
              </motion.div>
            )}
            
            {/* Tint Overlay */}
            <div className="absolute inset-0 bg-gg-dark/40 mix-blend-multiply" />
            
            {/* Game Label (Desktop Only) */}
            <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-20">
               <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-gg-cyan/30 rounded text-gg-cyan font-bold tracking-[0.2em] text-sm whitespace-nowrap shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                  {video.label}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* LAYER 2: SCANLINES (Animated) */}
      <div className="absolute inset-0 z-[2] pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,black,black_1px,transparent_1px,transparent_3px)] bg-[length:100%_4px] animate-[scan_8s_linear_infinite]" />

      {/* LAYER 3: GRADIENTS */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-b from-gg-dark/90 via-transparent to-gg-dark/90" />
      <div className="absolute inset-0 z-[5] bg-[radial-gradient(circle_at_center,transparent_20%,rgba(5,7,20,0.85)_100%)]" />

      {/* LAYER 4: PARTICLES */}
      <motion.div style={{ y: yText }} className="absolute inset-0 z-[10] pointer-events-none">
         <canvas ref={canvasRef} className="absolute inset-0" />
      </motion.div>

      {/* LAYER 5: CONTENT */}
      <div className="relative z-[20] flex flex-col items-center max-w-7xl mx-auto space-y-6 md:space-y-8 w-full px-4">
        
        {/* Performance Debugger (Optional visual for "tech" feel) */}
        {isLowPower && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono animate-pulse">
            <Cpu size={12} />
            <span>LOW POWER MODE</span>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-2 md:mb-6 relative inline-block group cursor-default max-w-full"
        >
          {/* Main Logo Text */}
          <h2 className="relative z-10 text-5xl sm:text-6xl md:text-8xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-gg-cyan via-white to-gg-purple tracking-tighter filter drop-shadow-[0_0_20px_rgba(0,217,255,0.4)]">
            GG WELLPLAYED
          </h2>
          
          {/* Glitch Layers */}
          <h2 className="absolute top-0 left-0 -z-10 text-5xl sm:text-6xl md:text-8xl font-heading font-black text-gg-cyan opacity-70 animate-glitch-1 tracking-tighter mix-blend-screen translate-x-[2px]" aria-hidden="true">
            GG WELLPLAYED
          </h2>
          <h2 className="absolute top-0 left-0 -z-10 text-5xl sm:text-6xl md:text-8xl font-heading font-black text-gg-pink opacity-70 animate-glitch-2 tracking-tighter mix-blend-screen -translate-x-[2px]" aria-hidden="true">
            GG WELLPLAYED
          </h2>
        </motion.div>

        {/* Animated Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white flex flex-wrap justify-center gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 drop-shadow-xl px-2 max-w-5xl leading-tight">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1), duration: 0.6 }}
              className="cursor-default hover:text-gg-cyan transition-colors duration-300"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="w-full flex justify-center px-4"
        >
           <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-gg-text-sec text-xs sm:text-sm md:text-lg font-mono tracking-wide bg-gg-dark/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 shadow-2xl">
             <span className="text-white font-bold">Pune's Premier Gaming Destination</span>
             <span className="hidden md:inline text-gray-600">|</span>
             <div className="flex gap-3">
               <span className="text-gg-cyan">High-End PCs</span>
               <span className="text-gray-600">/</span>
               <span className="text-gg-purple">PS5</span>
               <span className="text-gray-600">/</span>
               <span className="text-gg-pink">Tournaments</span>
             </div>
           </div>
        </motion.div>

        {/* CTA Button - Reverted to Previous Version */}
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-[20] pointer-events-none mix-blend-screen"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] text-gg-cyan opacity-80 uppercase">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={24} className="text-white drop-shadow-[0_0_10px_#00D9FF]" />
        </motion.div>
      </motion.div>
    </section>
  );
};