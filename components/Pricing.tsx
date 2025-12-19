import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

type PlanType = 'PC' | 'CONSOLE';

export const Pricing: React.FC = () => {
  const [activeType, setActiveType] = useState<PlanType>('PC');

  const plans = {
    PC: [
      {
        id: 'mid',
        name: "MID-END 144Hz",
        price: 50,
        features: ["144Hz Monitor", "GTX 1660 Ti", "8GB RAM", "Standard Library"],
        color: "border-gg-cyan",
        glow: "shadow-gg-cyan/20"
      },
      {
        id: 'high',
        name: "HIGH-END 240Hz",
        price: 70,
        features: ["240Hz Monitor", "RTX 4080 Ti", "16GB RAM", "Elite Library", "Priority Booking"],
        isBestValue: true,
        color: "border-gg-purple",
        glow: "shadow-gg-purple/40"
      }
    ],
    CONSOLE: [
      {
        id: 'ps4',
        name: "PS4 PRO",
        price: 100,
        features: ["PlayStation 4 Pro", "2 Controllers", "Premium Games", "Private Room"],
        color: "border-gg-pink",
        glow: "shadow-gg-pink/20"
      }
    ]
  };

  const handleSelectPlan = (planId: string) => {
    // Dispatch custom event so Booking component knows what to select
    const event = new CustomEvent('selectBookingTier', { detail: planId });
    window.dispatchEvent(event);
    
    // Smooth scroll to the booking section
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error("Booking section not found");
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gg-dark relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 md:mb-8">PRICING PLANS</h2>
          
          <div className="inline-flex bg-gg-medium rounded-full p-1 border border-gg-cyan/30 cursor-pointer shadow-lg">
            <button
              onClick={() => setActiveType('PC')}
              className={`px-6 py-3 md:px-8 md:py-3 rounded-full font-bold transition-all duration-300 relative z-20 min-w-[120px] md:min-w-[150px] text-sm md:text-base ${activeType === 'PC' ? 'bg-gg-cyan text-gg-dark shadow-[0_0_15px_#00D9FF]' : 'text-gray-400 hover:text-white'}`}
            >
              PC GAMING
            </button>
            <button
              onClick={() => setActiveType('CONSOLE')}
              className={`px-6 py-3 md:px-8 md:py-3 rounded-full font-bold transition-all duration-300 relative z-20 min-w-[120px] md:min-w-[150px] text-sm md:text-base ${activeType === 'CONSOLE' ? 'bg-gg-purple text-white shadow-[0_0_15px_#9D00FF]' : 'text-gray-400 hover:text-white'}`}
            >
              CONSOLE
            </button>
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center"
        >
          <AnimatePresence mode='wait'>
            {plans[activeType].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: plan.isBestValue ? 1.02 : 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: plan.isBestValue ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gg-medium rounded-2xl p-6 md:p-8 border-2 ${plan.color} relative ${plan.isBestValue ? `shadow-xl ${plan.glow}` : ''}`}
                data-hover // Trigger hover effect on cursor
              >
                {plan.isBestValue && (
                  <div className="absolute -top-4 right-4 bg-gradient-to-r from-gg-purple to-gg-pink px-4 py-1 rounded-full text-xs font-bold animate-pulse">
                    BEST VALUE
                  </div>
                )}
                
                <h3 className="text-xl font-heading font-bold mb-4 text-gray-200">{plan.name}</h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl md:text-5xl font-bold text-white">₹{plan.price}</span>
                  <span className="text-gray-400 ml-2 mb-2 text-sm md:text-base">/ hour</span>
                </div>

                <ul className="space-y-3 md:space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-300">
                      <Check size={16} className={`mr-3 flex-shrink-0 ${plan.isBestValue ? 'text-gg-purple' : 'text-gg-cyan'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 md:py-4 rounded-lg font-bold transition-all duration-300 relative z-20 cursor-pointer active:scale-95
                    ${plan.isBestValue 
                      ? 'bg-gradient-to-r from-gg-purple to-gg-pink hover:shadow-[0_0_20px_#9D00FF] text-white' 
                      : 'border border-gg-cyan text-gg-cyan hover:bg-gg-cyan hover:text-gg-dark'
                    }`}
                  data-hover // Ensure cursor expands
                >
                  SELECT
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-8 md:mt-12 text-center px-4">
            <p className="text-gg-lime font-mono text-xs md:text-sm animate-pulse">
              *Bulk Discounts: 5 Hours (10% OFF) | Full Day (20% OFF)
            </p>
        </div>
      </div>
    </section>
  );
};