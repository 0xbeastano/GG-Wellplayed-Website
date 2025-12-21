import React from 'react';
import { motion } from 'framer-motion';

const events = [
  {
    status: "ONGOING",
    title: "Weekly Valorant Tournament",
    prize: "₹50,000",
    date: "Live Now",
    color: "bg-gg-pink",
    badgeColor: "text-gg-pink border-gg-pink"
  },
  {
    status: "UPCOMING",
    title: "Tekken 8 Championship",
    prize: "₹10,000",
    date: "Dec 25, 2025",
    color: "bg-gg-cyan",
    badgeColor: "text-gg-cyan border-gg-cyan"
  },
  {
    status: "UPCOMING",
    title: "LAN Gaming Night",
    prize: "Free Entry",
    date: "Jan 2, 2026",
    color: "bg-gg-lime",
    badgeColor: "text-gg-lime border-gg-lime"
  },
  {
    status: "COMPLETED",
    title: "CS2 Pro League Finals",
    prize: "₹100,000",
    date: "Winner: Team Liquid",
    color: "bg-gray-500",
    badgeColor: "text-gray-400 border-gray-500"
  }
];

export const Tournaments: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gg-medium relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10 md:mb-16 text-white">TOURNAMENTS & EVENTS</h2>

        <div className="relative">
          {/* Vertical Line - Hidden on Mobile */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-gg-cyan via-gg-purple to-gg-pink opacity-30 hidden md:block" />
          
          <div className="space-y-6 md:space-y-12">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Spacer for Desktop Layout */}
                <div className="w-full md:w-5/12 hidden md:block"></div>
                
                {/* Center Dot - Hidden on Mobile */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white z-10 hidden md:block shadow-[0_0_10px_white]">
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${event.color}`} />
                </div>

                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="w-full md:w-5/12 bg-gg-dark p-6 rounded-xl border border-gray-800 hover:border-gg-purple transition-all duration-300 shadow-xl relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${event.color === 'bg-gray-500' ? 'from-gray-700' : event.color.replace('bg-', 'from-')}/20 to-transparent rounded-bl-full`} />
                  
                  <div className={`inline-block px-3 py-1 rounded border text-xs font-bold mb-3 ${event.badgeColor} ${event.status === 'ONGOING' ? 'animate-pulse' : ''}`}>
                    {event.status}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <div className="flex justify-between items-center text-sm font-mono text-gray-400">
                    <span className="flex items-center gap-1">🏆 {event.prize}</span>
                    <span>{event.date}</span>
                  </div>
                  {event.status !== 'COMPLETED' && (
                    <button className="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded font-bold transition-colors text-sm border border-white/10">
                      {event.status === 'ONGOING' ? 'JOIN NOW' : 'REGISTER'}
                    </button>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};