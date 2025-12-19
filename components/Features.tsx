import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const featureList = [
  "1000MBPS Internet Backup",
  "Air-Conditioned Environment",
  "Professional Gaming Chairs",
  "RGB Lighting Setup",
  "ASUS ROG Certified Rigs",
  "NVIDIA GeForce Gaming PCs",
  "Free Snacks & Beverages",
  "Bootcamp Room Available"
];

export const Features: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-gg-dark overflow-hidden">
      {/* Left Image Side */}
      <div className="w-full md:w-3/5 relative min-h-[50vh] md:min-h-screen group">
        <img 
          src="https://picsum.photos/1200/1000?random=10" 
          alt="Gaming Interior" 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gg-dark/50" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,217,255,0.1)_50%,transparent_100%)] bg-[length:100%_200%] animate-scan pointer-events-none" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQgMEgwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwgMjE3LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')] opacity-30" />
      </div>

      {/* Right Content Side */}
      <div className="w-full md:w-2/5 p-8 md:p-16 flex flex-col justify-center bg-gg-medium relative z-10 border-l border-gg-cyan/20">
        <motion.h2 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-heading font-bold mb-10 text-white"
        >
          PREMIUM <span className="text-gg-cyan">AMENITIES</span>
        </motion.h2>

        <div className="space-y-6">
          {featureList.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ x: 10, scale: 1.02 }}
              className="flex items-center group cursor-default"
            >
              <CheckCircle2 className="text-gg-lime mr-4 w-6 h-6 group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]" />
              <span className="text-lg text-gray-300 font-sans group-hover:text-gg-cyan transition-colors duration-300">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};