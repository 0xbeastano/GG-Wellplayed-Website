import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: "Arjun K.",
    role: "Verified Gamer",
    quote: "Best gaming cafe in Pune! The 240Hz setups are incredible for competitive gaming. Staff is friendly and the atmosphere is perfect!",
    rating: 5
  },
  {
    name: "Priya S.",
    role: "Valorant Player",
    quote: "Amazing tournaments and community vibe here! Finally found a place where I can practice Valorant seriously.",
    rating: 5
  },
  {
    name: "Rahul P.",
    role: "Casual Gamer",
    quote: "Worth every rupee. Tournament ready setup with zero lag. The booking system is so convenient!",
    rating: 5
  }
];

export const Testimonials: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) {
      next();
    } else if (info.offset.x > 50) {
      prev();
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gg-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(157,0,255,0.1),transparent_70%)]" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center mb-10 md:mb-16">WHAT GAMERS LOVE</h2>

        <div className="relative min-h-[350px] md:min-h-[300px]">
          <AnimatePresence mode='wait'>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              // CRITICAL FIX: touch-pan-y allows vertical scrolling of the page while swiping horizontally
              className="bg-gg-medium p-6 md:p-12 rounded-2xl border border-gg-purple/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing touch-pan-y"
            >
              <div className="flex gap-1 mb-6 text-gg-lime justify-center md:justify-start">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} fill="currentColor" size={20} />
                ))}
              </div>
              
              <p className="text-lg md:text-2xl font-sans italic text-gray-200 mb-8 leading-relaxed text-center md:text-left">
                "{testimonials[current].quote}"
              </p>
              
              <div className="flex items-center justify-center md:justify-start">
                <div className="w-12 h-12 rounded-full bg-gg-cyan/20 border border-gg-cyan flex items-center justify-center text-gg-cyan font-bold text-xl mr-4">
                  {testimonials[current].name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{testimonials[current].name}</h4>
                  <p className="text-sm text-gg-cyan">{testimonials[current].role}</p>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-6 text-xs text-gray-500 font-mono md:hidden">
                Swipe for more
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={prev} className="absolute top-1/2 -left-2 md:-left-16 transform -translate-y-1/2 p-3 bg-gg-medium rounded-full border border-gray-700 hover:border-gg-cyan hover:text-gg-cyan transition-all hidden md:block">
            <ChevronLeft />
          </button>
          <button onClick={next} className="absolute top-1/2 -right-2 md:-right-16 transform -translate-y-1/2 p-3 bg-gg-medium rounded-full border border-gray-700 hover:border-gg-cyan hover:text-gg-cyan transition-all hidden md:block">
            <ChevronRight />
          </button>
          
          {/* Mobile Dots */}
          <div className="flex justify-center mt-6 gap-2 md:hidden">
             {testimonials.map((_, i) => (
               <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-gg-cyan w-6' : 'bg-gray-600'}`} 
               />
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};