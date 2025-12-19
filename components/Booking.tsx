import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Calendar, Clock, Monitor, Gamepad, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Configuration constants
const WHATSAPP_NUMBER = "918888237925";

const TIERS = [
  { id: 'mid', name: 'Mid-End 144Hz', type: 'PC', basePrice: 50, label: 'Mid-End 144Hz PC' },
  { id: 'high', name: 'High-End 240Hz', type: 'PC', basePrice: 70, label: 'High-End 240Hz PC' },
  { id: 'ps4', name: 'Console PS4', type: 'CONSOLE', basePrice: 100, label: 'PlayStation 4' },
];

const DURATIONS = [
  { id: 1, label: '1H', value: 1, multiplier: 1, text: '1 Hour' },
  { id: 3, label: '3H', value: 3, multiplier: 2.8, text: '3 Hours' },
  { id: 5, label: '5H', value: 5, multiplier: 4.5, text: '5 Hours' },
  { id: 8, label: '8H', value: 8, multiplier: 6.8, text: '8 Hours' },
];

// Helper component for the animated number
const AnimatedCounter = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    // Trigger animation
    const controls = animate(count, value, { duration: 0.8, ease: "circOut" });
    
    // Trigger glow effect
    setGlow(true);
    const timeout = setTimeout(() => setGlow(false), 800);

    return () => {
      controls.stop();
      clearTimeout(timeout);
    };
  }, [value, count]);

  return (
    <motion.span 
      className={`inline-block transition-colors duration-300 ${glow ? 'text-gg-lime drop-shadow-[0_0_15px_rgba(204,255,0,0.6)]' : 'text-white'}`}
    >
      {rounded}
    </motion.span>
  );
};

export const Booking: React.FC = () => {
  // State
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState('');
  const [selectedTier, setSelectedTier] = useState(TIERS[0]);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);
  const [totalPrice, setTotalPrice] = useState(50);
  const [errors, setErrors] = useState<{date?: string}>({});
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'REDIRECTING'>('IDLE');

  // Listen for pricing selection from other components
  useEffect(() => {
    const handleTierSelection = (e: Event) => {
      const customEvent = e as CustomEvent;
      const tierId = customEvent.detail;
      const tier = TIERS.find(t => t.id === tierId);
      if (tier) {
        setSelectedTier(tier);
      }
    };

    window.addEventListener('selectBookingTier', handleTierSelection);
    return () => window.removeEventListener('selectBookingTier', handleTierSelection);
  }, []);

  // Real-time price calculation
  useEffect(() => {
    // Logic: Base Price * Multiplier (where multiplier accounts for hours + discount)
    const calculated = Math.ceil(selectedTier.basePrice * selectedDuration.multiplier);
    setTotalPrice(calculated);
  }, [selectedTier, selectedDuration]);

  // Validation Logic
  const validateForm = (): boolean => {
    const newErrors: {date?: string} = {};
    let isValid = true;

    if (!date) {
      newErrors.date = "Please select a booking date";
      isValid = false;
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Compare timestamps
      if (selectedDate.getTime() < today.getTime()) {
        newErrors.date = "Date cannot be in the past";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // WhatsApp Redirect Handler
  const handleConfirmBooking = () => {
    if (!validateForm()) return;

    setStatus('PROCESSING');

    // Artificial delay for better UX (showing processing state)
    setTimeout(() => {
      setStatus('REDIRECTING');
      
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      let message = "";

      if (selectedTier.type === 'PC') {
        message = `Hi GGwellplayed! 🎮\n\nI want to book a gaming session:\n\n📅 *Date:* ${formattedDate}\n⚡ *Platform:* ${selectedTier.label}\n⏱️ *Duration:* ${selectedDuration.text}\n💰 *Estimated Total:* ₹${totalPrice}\n\nPlease confirm available slots for this booking.\n\nThank you!`;
      } else {
        message = `Hi GGwellplayed! 🎮\n\nI want to book a console gaming session:\n\n📅 *Date:* ${formattedDate}\n🎯 *Console:* PlayStation 4\n⏱️ *Duration:* ${selectedDuration.text}\n💰 *Estimated Total:* ₹${totalPrice}\n\nPlease confirm available slots for this booking.\n\nThank you!`;
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

      // Short delay before opening to show "Redirecting" state
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setStatus('IDLE');
      }, 1000);

    }, 1500);
  };

  // Helper to get today's date string for min attribute
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Helper to get max date (e.g., 3 months from now to prevent year 60000)
  const getMaxDateString = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  };

  return (
    <section id="booking" className="py-12 md:py-24 bg-gg-medium border-t border-gg-cyan/10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gg-purple/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gg-cyan/5 rounded-full blur-3xl pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">BOOK YOUR <span className="text-gg-cyan">SESSION</span></h2>
          <p className="text-gray-400 font-mono text-sm md:text-lg">Select your rig, choose your time, and get gaming.</p>
        </motion.div>

        <div className="bg-gg-dark rounded-xl md:rounded-2xl p-4 md:p-12 shadow-2xl border border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form Section */}
            <div className="space-y-6 md:space-y-10">
              {/* Date Selection */}
              <div className="relative">
                <label 
                  onClick={() => dateInputRef.current?.showPicker()}
                  className="flex items-center text-gg-cyan font-bold mb-2 md:mb-4 tracking-wide text-lg md:text-xl cursor-pointer hover:text-white transition-colors"
                >
                  <Calendar className="mr-2 md:mr-3 w-5 h-5 md:w-6 md:h-6" /> SELECT DATE
                </label>
                <motion.div
                  animate={errors.date ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <input 
                    ref={dateInputRef}
                    type="date" 
                    min={getTodayString()}
                    max={getMaxDateString()}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if(errors.date) setErrors({...errors, date: undefined});
                    }}
                    style={{ colorScheme: 'dark' }}
                    className={`w-full bg-gg-medium border rounded-xl p-3 md:p-5 text-lg md:text-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-mono cursor-pointer ${errors.date ? 'border-red-500 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-gray-700 focus:border-gg-cyan focus:shadow-[0_0_10px_rgba(0,217,255,0.1)]'}`}
                  />
                </motion.div>
                <AnimatePresence>
                  {errors.date && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-0 -bottom-8 text-red-500 text-sm flex items-center font-bold"
                    >
                      <AlertCircle className="mr-2 w-4 h-4" /> {errors.date}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="flex items-center text-gg-purple font-bold mb-2 md:mb-4 tracking-wide text-lg md:text-xl">
                  <Monitor className="mr-2 md:mr-3 w-5 h-5 md:w-6 md:h-6" /> PLATFORM
                </label>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {TIERS.map((t) => (
                    <motion.button
                      key={t.id}
                      onClick={() => setSelectedTier(t)}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 md:p-5 rounded-xl border text-left transition-all duration-300 flex justify-between items-center group relative overflow-hidden ${selectedTier.id === t.id ? 'border-gg-purple bg-gg-purple/10' : 'border-gray-700 bg-gg-medium/50 hover:border-gray-500'}`}
                    >
                      <div className="relative z-10 flex items-center">
                         {t.type === 'CONSOLE' ? 
                            <Gamepad className={`mr-3 md:mr-4 w-6 h-6 md:w-7 md:h-7 ${selectedTier.id === t.id ? 'text-gg-purple' : 'text-gray-500'}`} /> : 
                            <Monitor className={`mr-3 md:mr-4 w-6 h-6 md:w-7 md:h-7 ${selectedTier.id === t.id ? 'text-gg-purple' : 'text-gray-500'}`} />
                         }
                         <span className={`text-lg md:text-xl ${selectedTier.id === t.id ? 'text-white font-bold' : 'text-gray-300'}`}>{t.name}</span>
                      </div>
                      <span className={`relative z-10 font-mono text-base md:text-lg ${selectedTier.id === t.id ? 'text-gg-purple' : 'text-gray-500'}`}>₹{t.basePrice}/hr</span>
                      
                      {/* Active Background Effect */}
                      {selectedTier.id === t.id && (
                        <motion.div 
                          layoutId="activeTier"
                          className="absolute inset-0 bg-gradient-to-r from-gg-purple/20 to-transparent" 
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="flex items-center text-gg-lime font-bold mb-2 md:mb-4 tracking-wide text-lg md:text-xl">
                  <Clock className="mr-2 md:mr-3 w-5 h-5 md:w-6 md:h-6" /> DURATION
                </label>
                <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {DURATIONS.map((d) => (
                    <motion.button
                      key={d.id}
                      onClick={() => setSelectedDuration(d)}
                      whileHover={{ y: -4 }}
                      whileTap={{ y: 0 }}
                      className={`flex-1 min-w-[70px] md:min-w-[80px] py-3 px-2 md:py-4 md:px-3 rounded-xl border-2 transition-all duration-300 relative ${selectedDuration.id === d.id ? 'border-gg-lime bg-gg-lime/10 text-white shadow-[0_0_15px_rgba(204,255,0,0.2)]' : 'border-gray-700 bg-gg-medium/50 text-gray-400 hover:border-gray-500'}`}
                    >
                      <span className="font-bold text-xl md:text-2xl">{d.label}</span>
                      {d.multiplier > d.value && (
                        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] md:text-xs bg-gg-lime text-gg-dark px-1.5 py-0.5 rounded font-bold whitespace-nowrap border border-black">
                          SAVE {(100 - (d.multiplier/d.value)*100).toFixed(0)}%
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Receipt / Total Section */}
            <div className="flex flex-col h-full mt-4 lg:mt-0">
               <div className="flex-grow flex flex-col justify-center bg-gg-medium rounded-2xl p-6 md:p-10 border border-gray-800 relative overflow-hidden group">
                  
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-gg-cyan/20 rounded-full blur-3xl group-hover:bg-gg-cyan/30 transition-colors duration-500" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gg-purple/20 rounded-full blur-3xl group-hover:bg-gg-purple/30 transition-colors duration-500" />

                  <div className="relative z-10">
                    <h3 className="text-gray-400 font-mono mb-2 text-base md:text-lg tracking-widest uppercase">Estimated Total</h3>
                    
                    <div className="flex items-baseline mb-4">
                        <span className="text-3xl md:text-5xl font-bold text-gg-cyan mr-2">₹</span>
                        <div className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tighter">
                          <AnimatedCounter value={totalPrice} />
                        </div>
                    </div>

                    <div className="h-px w-full bg-gray-700 my-4 md:my-6" />

                    <div className="space-y-3 md:space-y-4 text-base md:text-lg text-gray-300 font-mono mb-8 md:mb-10">
                        <div className="flex justify-between">
                            <span>Platform Rate</span>
                            <span>₹{selectedTier.basePrice}/hr</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Duration</span>
                            <span>{selectedDuration.text}</span>
                        </div>
                        <div className="flex justify-between text-gg-lime font-bold">
                            <span>Multiplier</span>
                            <span>x{selectedDuration.multiplier}</span>
                        </div>
                    </div>
                    
                    <motion.button 
                      onClick={handleConfirmBooking}
                      disabled={status !== 'IDLE'}
                      whileHover={status === 'IDLE' ? { scale: 1.02, boxShadow: "0 0 30px rgba(0, 217, 255, 0.4)" } : {}}
                      whileTap={status === 'IDLE' ? { scale: 0.98 } : {}}
                      className={`w-full py-4 md:py-5 font-bold text-lg md:text-xl rounded-xl shadow-xl transition-all relative overflow-hidden flex items-center justify-center ${
                          status === 'IDLE' 
                            ? 'bg-gradient-to-r from-gg-cyan to-gg-purple text-white' 
                            : status === 'REDIRECTING' 
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                        <AnimatePresence mode="wait">
                            {status === 'IDLE' && (
                                <motion.span 
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center tracking-wider"
                                >
                                    CONFIRM BOOKING
                                </motion.span>
                            )}
                            {status === 'PROCESSING' && (
                                <motion.span 
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center"
                                >
                                    <Loader2 className="animate-spin mr-3 w-5 h-5 md:w-6 md:h-6" /> PROCESSING...
                                </motion.span>
                            )}
                            {status === 'REDIRECTING' && (
                                <motion.span 
                                    key="redirecting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center"
                                >
                                    <CheckCircle className="mr-3 w-5 h-5 md:w-6 md:h-6" /> REDIRECTING...
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};