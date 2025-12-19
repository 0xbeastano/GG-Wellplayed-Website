import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Gamepad, Trophy } from 'lucide-react';

const facilities = [
  {
    title: "HIGH-END PCS",
    icon: Monitor,
    color: "text-gg-cyan",
    image: "https://picsum.photos/400/300?random=1",
    features: ["240Hz Monitors", "RTX 4080 Ti Graphics", "32GB RAM"]
  },
  {
    title: "CONSOLE GAMING",
    icon: Gamepad,
    color: "text-gg-purple",
    image: "https://picsum.photos/400/300?random=2",
    features: ["PS5 & PS4 Pro", "Multiplayer Arena", "Premium Controllers"]
  },
  {
    title: "TOURNAMENT ARENA",
    icon: Trophy,
    color: "text-gg-lime",
    image: "https://picsum.photos/400/300?random=3",
    features: ["Bootcamp Room", "LAN Setup", "Live Streaming"]
  }
];

export const Facilities: React.FC = () => {
  return (
    <section className="py-20 bg-gg-medium relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-heading font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          WORLD CLASS FACILITIES
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="bg-gg-dark rounded-xl border-2 border-transparent relative overflow-hidden group"
              style={{
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)"
              }}
            >
              <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br from-gg-cyan via-gg-purple to-gg-pink animate-[spin_6s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity" style={{ zIndex: 0 }} />
              <div className="relative z-10 bg-gg-dark h-full rounded-[10px] overflow-hidden">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gg-dark/60 z-10 group-hover:bg-gg-dark/40 transition-colors duration-300" />
                  <img 
                    src={facility.image} 
                    alt={facility.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute bottom-4 right-4 p-3 bg-gg-dark/90 backdrop-blur rounded-full z-20 ${facility.color} shadow-[0_0_15px_currentColor]`}>
                    <facility.icon size={24} className="group-hover:rotate-[360deg] transition-transform duration-700" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-heading font-bold mb-4">{facility.title}</h3>
                  <ul className="space-y-2 mb-6">
                    {facility.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300 font-mono text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 bg-current ${facility.color}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="text-gg-cyan font-bold text-sm tracking-widest uppercase group/btn relative">
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