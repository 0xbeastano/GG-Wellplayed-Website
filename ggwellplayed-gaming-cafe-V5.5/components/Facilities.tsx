import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Gamepad, Trophy } from 'lucide-react';

const facilities = [
  {
    title: "HIGH-END PCS",
    icon: Monitor,
    color: "text-gg-cyan",
    // Premium PC Setup with Neon Blue/Pink lighting
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop", 
    fallback: "https://images.unsplash.com/photo-1593305841991-05c29736f87e?q=80&w=800&auto=format&fit=crop",
    features: ["240Hz Monitors", "RTX 4080 Ti Graphics", "32GB RAM"]
  },
  {
    title: "CONSOLE GAMING",
    icon: Gamepad,
    color: "text-gg-purple",
    // Gamer holding controller in neon light
    image: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?q=80&w=800&auto=format&fit=crop", 
    fallback: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop",
    features: ["PS5 & PS4 Pro", "Multiplayer Arena", "Premium Controllers"]
  },
  {
    title: "TOURNAMENT ARENA",
    icon: Trophy,
    color: "text-gg-lime",
    // Esports stage / Crowd vibe
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop", 
    fallback: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    features: ["Bootcamp Room", "LAN Setup", "Live Streaming"]
  }
];

export const Facilities: React.FC = () => {
  // Function to handle image error and switch to fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl: string) => {
    e.currentTarget.src = fallbackUrl;
    e.currentTarget.onerror = null; // Prevent infinite loop if fallback fails
  };

  return (
    <section className="py-16 md:py-24 bg-gg-medium relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-heading font-bold text-center mb-10 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          WORLD CLASS FACILITIES
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-gg-dark rounded-xl border-2 border-transparent relative overflow-hidden group"
              style={{
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)"
              }}
            >
              <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br from-gg-cyan via-gg-purple to-gg-pink animate-[spin_6s_linear_infinite] opacity-30 group-hover:opacity-100 transition-opacity" style={{ zIndex: 0 }} />
              <div className="relative z-10 bg-gg-dark h-full rounded-[10px] overflow-hidden flex flex-col">
                {/* Image Container with Fallback Background */}
                <div className="h-64 md:h-72 overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="absolute inset-0 bg-gg-dark/60 z-10 group-hover:bg-gg-dark/40 transition-colors duration-300" />
                  <img 
                    src={facility.image} 
                    alt={facility.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 relative z-0"
                    loading="eager"
                    onError={(e) => handleImageError(e, facility.fallback)}
                  />
                  {/* Floating Icon */}
                  <div className={`absolute bottom-4 right-4 p-3 bg-gg-dark/90 backdrop-blur rounded-full z-20 ${facility.color} shadow-[0_0_15px_currentColor]`}>
                    <facility.icon size={24} className="group-hover:rotate-[360deg] transition-transform duration-700" />
                  </div>
                </div>
                
                <div className="p-5 md:p-6 flex-grow">
                  <h3 className="text-xl md:text-2xl font-heading font-bold mb-3 md:mb-4">{facility.title}</h3>
                  <ul className="space-y-2 mb-6">
                    {facility.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300 font-mono text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 bg-current ${facility.color}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="text-gg-cyan font-bold text-sm tracking-widest uppercase group/btn relative p-2 md:p-0">
                    Learn More
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gg-cyan transition-all duration-300 group-hover/btn:w-full" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};