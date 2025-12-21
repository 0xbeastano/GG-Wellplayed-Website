import React from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from './TiltCard';

// Professional Gameplay Images (Unsplash High Quality IDs)
const games = [
  { 
    title: "Valorant", 
    genre: "Tac-Shooter", 
    // Neon sci-fi shooter vibe
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Counter-Strike 2", 
    genre: "FPS", 
    // Tactical military vibe
    img: "https://images.unsplash.com/photo-1599933397621-0e7d69b36582?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Forza Horizon 5", 
    genre: "Racing", 
    // Supercar / Racing vibe
    img: "https://images.unsplash.com/photo-1547924667-62ca45b7e2a8?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Dota 2", 
    genre: "MOBA", 
    // Fantasy / Strategy vibe
    img: "https://images.unsplash.com/photo-1548685913-fe6678babe8d?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Call of Duty: MW3", 
    genre: "FPS / Warzone", 
    // War zone / Soldier vibe
    img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Apex Legends", 
    genre: "Battle Royale", 
    // Sci-fi armor vibe
    img: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Tekken 8", 
    genre: "Fighting", 
    // Arcade stick / Fighting vibe
    img: "https://images.unsplash.com/photo-1593305841991-05c29736f87e?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "EA SPORTS FC™ 24", 
    genre: "Sports", 
    // Stadium / Soccer vibe
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Cyberpunk 2077", 
    genre: "RPG", 
    // Neon City / Night vibe
    img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop" 
  }
];

export const GamesLibrary: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-gg-dark overflow-hidden">
      <div className="container mx-auto px-4 mb-8 md:mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">INSTALLED & READY</h2>
        <div className="w-16 md:w-24 h-1 bg-gg-purple mx-auto rounded-full" />
      </div>

      <div className="relative w-full">
        {/* Continuous scroll effect */}
        <motion.div 
          className="flex space-x-4 md:space-x-6 px-4 will-change-transform touch-pan-x"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          style={{ width: "fit-content" }}
          whileHover={{ animationPlayState: "paused" }}
          whileTap={{ animationPlayState: "paused" }}
        >
          {[...games, ...games].map((game, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex-shrink-0 w-36 h-56 md:w-64 md:h-96 rounded-xl cursor-pointer touch-manipulation"
            >
              <TiltCard 
                className="w-full h-full rounded-xl overflow-hidden border border-gray-800 shadow-2xl group hover:border-gg-cyan transition-colors duration-300"
                glowColor="#00D9FF"
              >
                <div className="absolute inset-0 bg-gray-900" />
                <img 
                  src={game.img} 
                  alt={game.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  loading="lazy" 
                  decoding="async"
                />
                {/* Always visible gradient on mobile for readability, dynamic on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-gg-dark via-transparent to-transparent opacity-80 md:opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-gg-lime mb-1 block">
                    {game.genre}
                  </span>
                  <h3 className="text-sm md:text-lg font-bold text-white leading-tight">
                    {game.title}
                  </h3>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};