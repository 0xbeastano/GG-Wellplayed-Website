import React from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from './TiltCard';

const games = [
  { 
    title: "Valorant", 
    genre: "Tac-Shooter", 
    img: "https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S2_1200x1600-9ebf575033287e2177106da5ff45c1d4" 
  },
  { 
    title: "Counter-Strike 2", 
    genre: "FPS", 
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/library_600x900.jpg" 
  },
  { 
    title: "Grand Theft Auto V", 
    genre: "Open World", 
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg" 
  },
  { 
    title: "Dota 2", 
    genre: "MOBA", 
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/library_600x900.jpg" 
  },
  { 
    title: "Call of Duty: HQ", 
    genre: "FPS / Warzone", 
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1938090/library_600x900.jpg" 
  },
  { 
    title: "Apex Legends", 
    genre: "Battle Royale", 
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/library_600x900.jpg" 
  },
  { 
    title: "Tekken 8", 
    genre: "Fighting", 
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1778820/library_600x900.jpg" 
  },
  { 
    title: "EA SPORTS FC™ 24", 
    genre: "Sports", 
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900.jpg" 
  },
  { 
    title: "Cyberpunk 2077", 
    genre: "RPG", 
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg" 
  }
];

export const GamesLibrary: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-gg-dark overflow-hidden">
      <div className="container mx-auto px-4 mb-8 md:mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">INSTALLED & READY</h2>
        <div className="w-16 md:w-24 h-1 bg-gg-purple mx-auto rounded-full" />
      </div>

      <div className="relative w-full">
        {/* Continuous scroll effect by duplicating list */}
        <motion.div 
          className="flex space-x-4 md:space-x-6 px-4 will-change-transform"
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
              className="relative flex-shrink-0 w-48 h-72 md:w-64 md:h-96 rounded-xl cursor-pointer"
            >
              <TiltCard 
                className="w-full h-full rounded-xl overflow-hidden border border-gray-800 shadow-2xl group hover:border-gg-cyan transition-colors duration-300"
                glowColor="#00D9FF"
              >
                <div className="absolute inset-0 bg-gray-900 animate-pulse" /> {/* Placeholder while loading */}
                <img 
                  src={game.img} 
                  alt={game.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  loading="lazy" 
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gg-dark via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gg-lime mb-1 block">
                    {game.genre}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-tight">
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