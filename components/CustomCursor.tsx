import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'text'>('default');
  const [clicks, setClicks] = useState<{id: number, x: number, y: number}[]>([]);

  // Smooth physics for the reticle
  const springConfig = { damping: 20, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const id = Date.now();
      setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      // Clean up click animation after it runs
      setTimeout(() => {
        setClicks(prev => prev.filter(c => c.id !== id));
      }, 600);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Tactical Target Detection
      const isButton = target.closest('button') || target.closest('a') || target.closest('.cursor-pointer') || target.tagName === 'BUTTON';
      const isText = target.tagName === 'P' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'SPAN' || target.tagName === 'INPUT';

      if (isButton) {
        setCursorVariant('hover');
      } else if (isText) {
        setCursorVariant('text');
      } else {
        setCursorVariant('default');
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block mix-blend-difference">
      {/* 1. Center Dot (Instant Tracking) - RED */}
      <motion.div
        className="absolute top-0 left-0 w-1.5 h-1.5 bg-gg-red rounded-full shadow-[0_0_10px_#FF003C]"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      
      {/* 2. Tactical Reticle (Spring Physics) */}
      <motion.div
        className="absolute top-0 left-0 border border-white/50 flex items-center justify-center rounded-full"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: cursorVariant === 'hover' ? 60 : cursorVariant === 'text' ? 4 : 40,
          height: cursorVariant === 'hover' ? 60 : cursorVariant === 'text' ? 24 : 40,
          borderRadius: cursorVariant === 'hover' ? '50%' : cursorVariant === 'text' ? '2px' : '50%',
          // Color Logic: Red on hover, Purple on text, White/Translucent default
          borderColor: cursorVariant === 'hover' ? '#FF003C' : cursorVariant === 'text' ? '#9D00FF' : 'rgba(255,255,255,0.3)',
          backgroundColor: cursorVariant === 'hover' ? 'rgba(255, 0, 60, 0.05)' : 'transparent',
          rotate: cursorVariant === 'hover' ? 90 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Decorative Crosshair Lines (Only in default mode) */}
        {cursorVariant === 'default' && (
          <>
            <div className="absolute w-[120%] h-[1px] bg-white/20" />
            <div className="absolute h-[120%] w-[1px] bg-white/20" />
          </>
        )}

        {/* Lock-on Corners (Only in hover mode) - RED */}
        {cursorVariant === 'hover' && (
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 w-1 h-2 bg-gg-red transform -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-1 h-2 bg-gg-red transform -translate-x-1/2" />
            <div className="absolute left-0 top-1/2 w-2 h-1 bg-gg-red transform -translate-y-1/2" />
            <div className="absolute right-0 top-1/2 w-2 h-1 bg-gg-red transform -translate-y-1/2" />
          </div>
        )}
      </motion.div>

      {/* 3. Click Shockwave Effect - RED */}
      <AnimatePresence>
        {clicks.map(click => (
          <motion.div
            key={click.id}
            initial={{ opacity: 0.8, scale: 0, borderWidth: "4px" }}
            animate={{ opacity: 0, scale: 2.5, borderWidth: "0px" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute rounded-full bg-transparent shadow-[0_0_20px_#FF003C]"
            style={{ 
              left: click.x, 
              top: click.y, 
              width: 40, 
              height: 40, 
              marginLeft: -20, 
              marginTop: -20,
              borderColor: '#FF003C'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};