import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Cyberpunk Theme Colors
    const colors = ['#00D9FF', '#9D00FF', '#FF006E'];

    // Detect mobile for performance optimization
    const isMobile = window.innerWidth < 768;

    // Mouse state tracking for parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      depth: number; // For parallax effect
    }

    const particles: Particle[] = [];
    
    // Particle count setup
    const particleCount = isMobile ? 30 : 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        depth: Math.random() * 0.5 + 0.2, // Depth factor between 0.2 and 0.7
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Smooth interpolation of mouse movement
      if (!isMobile) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      }

      // Pre-calculate visual positions and update physics
      const visualParticles = particles.map(p => {
        // Update physics
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        // Calculate parallax visual position
        const px = p.x + (currentMouseX * p.depth * 60);
        const py = p.y + (currentMouseY * p.depth * 60);

        return { ...p, px, py };
      });

      // Draw connections (Constellation effect)
      if (!isMobile) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < visualParticles.length; i++) {
          const p1 = visualParticles[i];
          for (let j = i + 1; j < visualParticles.length; j++) {
            const p2 = visualParticles[j];
            const dx = p1.px - p2.px;
            const dy = p1.py - p2.py;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const connectionDist = 120;

            if (dist < connectionDist) {
               // Calculate opacity based on distance
               const opacity = (1 - dist / connectionDist) * 0.15;
               ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
               ctx.beginPath();
               ctx.moveTo(p1.px, p1.py);
               ctx.lineTo(p2.px, p2.py);
               ctx.stroke();
            }
          }
        }
      }

      // Draw particles
      visualParticles.forEach(p => {
        ctx.globalAlpha = 0.6 + (p.depth * 0.4);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2);
        
        // Subtle glow effect
        ctx.shadowBlur = 10 + (p.depth * 5); 
        ctx.shadowColor = p.color;
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for lines
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      // Normalize coordinates (-1 to 1) relative to center
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
      
      // Invert for parallax feel (background moves opposite to mouse)
      targetMouseX = -targetMouseX;
      targetMouseY = -targetMouseY;
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
  }, []);

  const headline = "GAME HARDER AT GGWELLPLAYED";
  const words = headline.split(" ");
  const subheadingText = "Pune's Premier Gaming Destination | High-End PCs | PS5 | Tournaments";

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-4 md:px-6">
      {/* Background Particles Canvas */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
         <canvas ref={canvasRef} className="absolute inset-0" />
         <div className="absolute inset-0 bg-gradient-to-b from-gg-dark/60 via-transparent to-gg-dark pointer-events-none" />
      </motion.div>

      {/* Improved Soft Scan Light Effect */}
      <motion.div
        initial={{ top: "-30%", opacity: 0 }}
        animate={{ top: "130%", opacity: [0, 0.5, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1
        }}
        className="absolute left-0 right-0 h-[40vh] bg-gradient-to-b from-transparent via-gg-cyan/10 to-transparent z-[5] pointer-events-none blur-xl mix-blend-overlay"
      />

      <div className="relative z-10 flex flex-col items-center max-w-6xl mx-auto space-y-6 md:space-y-8 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-2 md:mb-4 relative inline-block group cursor-default"
          data-hover
        >
          <h2 className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-gg-cyan to-gg-purple tracking-tighter">
            GG WELLPLAYED
          </h2>
          {/* Glitch Layers */}
          <h2 className="absolute top-0 left-0 -z-10 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-gg-cyan opacity-70 animate-glitch-1 tracking-tighter mix-blend-screen translate-x-[2px]" aria-hidden="true">
            GG WELLPLAYED
          </h2>
          <h2 className="absolute top-0 left-0 -z-10 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-gg-pink opacity-70 animate-glitch-2 tracking-tighter mix-blend-screen -translate-x-[2px]" aria-hidden="true">
            GG WELLPLAYED
          </h2>
        </motion.div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white flex flex-wrap justify-center gap-x-3 md:gap-x-4 gap-y-2 drop-shadow-[0_0_10px_#00D9FF]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.5 + (i * 0.15), duration: 0.6 }}
              className="cursor-default"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="h-8 md:h-12 flex justify-center w-full overflow-hidden"
        >
           <motion.p
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, delay: 2, ease: "linear" }}
            className="text-gg-text-sec text-xs sm:text-sm md:text-xl font-mono text-gray-300 border-r-2 border-gg-cyan whitespace-nowrap overflow-hidden max-w-fit px-1"
          >
            {subheadingText}
          </motion.p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #00D9FF" }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 md:px-8 md:py-4 border-2 border-gg-cyan text-gg-cyan font-bold text-base md:text-lg rounded-sm hover:bg-gg-cyan hover:text-gg-dark transition-colors duration-300 animate-pulse-slow relative group overflow-hidden active:bg-gg-cyan/20"
          onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          data-hover
        >
          <span className="relative z-10">BOOK YOUR SESSION NOW</span>
          <div className="absolute inset-0 bg-gg-cyan opacity-0 group-hover:opacity-10 transition-opacity" />
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 text-gg-cyan flex flex-col items-center gap-2"
      >
        <span className="text-[10px] md:text-xs font-mono tracking-widest opacity-80">SCROLL TO EXPLORE</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={20} className="md:w-6 md:h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
};