import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring configuration for the trailing ring - faster and snappier
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Update motion values directly for performance (bypassing React render loop)
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Enhanced hover detection
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.cursor-pointer') ||
        target.hasAttribute('data-hover');

      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main Cursor Dot - Instant tracking (Standard Speed) */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-gg-cyan pointer-events-none z-[100] hidden md:block mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: isHovering ? 0 : 1, // Shrink dot when hovering
        }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Follower Ring - Smooth spring physics */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-gg-purple pointer-events-none z-[99] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          borderColor: isHovering ? '#00D9FF' : '#9D00FF',
          backgroundColor: isHovering ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
          borderWidth: isHovering ? '1px' : '2px'
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
};