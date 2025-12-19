import React from 'react';
import { motion } from 'framer-motion';

const games = [
  { title: "Valorant", genre: "FPS", img: "https://picsum.photos/300/400?random=11" },
  { title: "CS2", genre: "FPS", img: "https://picsum.photos/300/400?random=12" },
  { title: "Dota 2", genre: "MOBA", img: "https://picsum.photos/300/400?random=13" },
  { title: "Tekken 8", genre: "Fighting", img: "https://picsum.photos/300/400?random=14" },
  { title: "Apex Legends", genre: "Battle Royale", img: "https://picsum.photos/300/400?random=15" },
  { title: "Cyberpunk 2077", genre: "RPG", img: "https://picsum.photos/300/400?random=16" },
  { title: "GTA V", genre: "Open World", img: "https://picsum.photos/300/400?random=17" }
];

export const GamesLibrary: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-gg-dark overflow-hidden">
      <div className="container mx-auto px-4 mb-8 md:mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">HOTTEST GAMES</h2>
        <div className="w-16 md:w-24 h-1 bg-gg-purple mx-auto rounded-full" />
      </div>

      <div className="relative w-full">
        {/* Continuous scroll effect by duplicating list */}
        <motion.div 
          className="flex space-x-4 md:space-x-6 px-4 will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          style={{ width: "fit-content" }}
          whileHover={{ animationPlayState: "paused" }}
          whileTap={{ animationPlayState: "paused" }}
        >
          {[...games, ...games, ...games].map((game, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex-shrink-0 w-48 h-64 md:w-64 md:h-80 rounded-lg overflow-hidden border-2 border-gg-purple group cursor-pointer transition-colors duration-300 hover:border-gg-cyan"
            >
              <img src={game.img} alt={game.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] md:text-xs font-mono text-gg-lime bg-black/50 px-2 py-1 rounded mb-1 md:mb-2 inline-block backdrop-blur-sm">
                  {game.genre}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {game.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};