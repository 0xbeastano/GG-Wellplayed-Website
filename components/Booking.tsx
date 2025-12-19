import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Calendar, Clock, Monitor, Gamepad, Loader2, CheckCircle, AlertCircle, User, Phone } from 'lucide-react';
import { Booking as BookingType } from '../types';

// Configuration constants
const WHATSAPP_NUMBER = "918888237925";
const LOCAL_STORAGE_KEY = 'ggwellplayed_bookings';
const RATE_LIMIT_KEY = 'ggwellplayed_ratelimit';

const TIERS = [
  { id: 'mid', name: 'Mid-End 144Hz', type: 'PC', basePrice: 50, label: 'Mid-End 144Hz PC' },
  { id: 'high', name: 'High-End 240Hz', type: 'PC', basePrice: 70, label: 'High-End 240Hz PC' },
  { id: 'ps4', name: 'Console PS4', type: 'CONSOLE', basePrice: 100, label: 'PlayStation 4' },
];

const DURATIONS = [
  { id: 1, label: '1H', value: 1, multiplier: 1, text: '1 Hour' },
  { id: 3, label: '3H', value: 3, multiplier: 3.0, text: '3 Hours' },
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
  const mountTime = useRef<number>(Date.now()); // Security: Time-based validation

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [date, setDate] = useState('');
  const [honeyPot, setHoneyPot] = useState(''); // Security: Honeypot
  
  const [selectedTier, setSelectedTier] = useState(TIERS[0]);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);
  const [totalPrice, setTotalPrice] = useState(50);
  
  const [errors, setErrors] = useState<{date?: string; name?: string; phone?: string; general?: string}>({});
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'REDIRECTING'>('IDLE');

  // Listen for pricing selection from other components
  useEffect(() => {
    const handleTierSelection = (e: Event) => {
      const customEvent = e as CustomEvent;
      const tierId = customEvent.detail;
      const tier = TIERS.find(t => t.id === tierId);
      if (tier) setSelectedTier(tier);
    };
    window.addEventListener('selectBookingTier', handleTierSelection);
    return () => window.removeEventListener('selectBookingTier', handleTierSelection);
  }, []);

  // Real-time price calculation
  useEffect(() => {
    const calculated = Math.ceil(selectedTier.basePrice * selectedDuration.multiplier);
    setTotalPrice(calculated);
  }, [selectedTier, selectedDuration]);

  // Security: Rate Limiter
  const checkRateLimit = (): boolean => {
    try {
        const history = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
        const now = Date.now();
        const windowTime = 5 * 60 * 1000; // 5 minutes
        const limit = 3;

        // Filter out old timestamps
        const recentAttempts = history.filter((timestamp: number) => now - timestamp < windowTime);
        
        if (recentAttempts.length >= limit) {
            return false;
        }

        recentAttempts.push(now);
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentAttempts));
        return true;
    } catch (e) {
        return true; // Fail open if storage is disabled/error
    }
  };

  // Validation Logic
  const validateForm = (): boolean => {
    const newErrors: {date?: string; name?: string; phone?: string; general?: string} = {};
    let isValid = true;

    // Security: Honeypot check
    if (honeyPot !== '') {
        console.warn("Bot detected: Honeypot filled");
        return false;
    }

    // Security: Time-based check (Minimum 2 seconds)
    if (Date.now() - mountTime.current < 2000) {
        console.warn("Bot detected: Submission too fast");
        return false;
    }

    // Name Validation
    if (!customerName.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Phone Validation
    if (!phoneNumber.trim() || !/^\d{10}$/.test(phoneNumber)) {
      newErrors.phone = "Enter valid 10-digit number";
      isValid = false;
    }

    // Date Validation
    if (!date) {
      newErrors.date = "Please select a booking date";
      isValid = false;
    } else {
      const [year, month, day] = date.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Check past dates
      if (selectedDate.getTime() < today.getTime()) {
        newErrors.date = "Date cannot be in the past";
        isValid = false;
      }
      
      // Check 10 PM cutoff for same-day bookings
      if (selectedDate.getTime() === today.getTime()) {
        if (now.getHours() >= 22) {
          newErrors.date = "Bookings closed for today (after 10 PM)";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const generateBookingID = () => {
    return `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const saveToLocalStorage = (booking: BookingType) => {
    try {
      const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const bookings: BookingType[] = existingData ? JSON.parse(existingData) : [];
      bookings.push(booking);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings));
      
      // Dispatch event to update Dashboard if open
      window.dispatchEvent(new Event('bookingUpdated'));
    } catch (error) {
      console.error("Failed to save booking locally", error);
    }
  };

  // WhatsApp Redirect Handler
  const handleConfirmBooking = () => {
    // 1. Validation & Security Checks
    if (!validateForm()) return;

    if (!checkRateLimit()) {
        setErrors({ general: "Too many attempts. Please try again in 5 minutes." });
        return;
    }

    setStatus('PROCESSING');

    // 2. Generate Data
    const bookingID = generateBookingID();
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    const bookingData: BookingType = {
      id: bookingID,
      customerName,
      phoneNumber,
      date: date,
      platform: selectedTier.name,
      duration: selectedDuration.text,
      price: totalPrice,
      timestamp: Date.now(),
      status: 'PENDING'
    };

    // 3. Save to Local Storage
    saveToLocalStorage(bookingData);

    // 4. Construct WhatsApp Message
    setTimeout(() => {
      setStatus('REDIRECTING');
      
      const message = `*NEW BOOKING REQUEST* 🎮
      
*Ref ID:* ${bookingID}
*Name:* ${customerName}
*Phone:* ${phoneNumber}

*Date:* ${formattedDate}
*Platform:* ${selectedTier.label}
*Duration:* ${selectedDuration.text}
*Total:* ₹${totalPrice}

Please confirm this slot.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setStatus('IDLE');
        // Reset form
        setCustomerName('');
        setPhoneNumber('');
        setDate('');
        setErrors({});
      }, 500);

    }, 1000);
  };

  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMaxDateString = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1); // Restricted to ~30 days as per best practice
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <section id="booking" className="py-12 md:py-24 bg-gg-medium border-t border-gg-cyan/10 relative overflow-hidden">
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
            <div className="space-y-6 md:space-y-8">
              
              {/* Security: Honeypot Field (Hidden) */}
              <input 
                type="text" 
                name="website_url" 
                value={honeyPot}
                onChange={(e) => setHoneyPot(e.target.value)}
                style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-gray-400 font-bold mb-2 text-xs md:text-sm tracking-wider">
                    <User className="mr-2 w-4 h-4" /> NAME
                  </label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if(errors.name) setErrors({...errors, name: undefined});
                    }}
                    // Mobile Opt: Use text-base to prevent iOS zoom
                    className={`w-full bg-gg-medium border rounded-lg p-3 text-base text-white focus:outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-gg-cyan'}`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="flex items-center text-gray-400 font-bold mb-2 text-xs md:text-sm tracking-wider">
                    <Phone className="mr-2 w-4 h-4" /> PHONE
                  </label>
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhoneNumber(val);
                      if(errors.phone) setErrors({...errors, phone: undefined});
                    }}
                    // Mobile Opt: Use text-base to prevent iOS zoom
                    className={`w-full bg-gg-medium border rounded-lg p-3 text-base text-white focus:outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-700 focus:border-gg-cyan'}`}
                    placeholder="10-digit number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Date Selection */}
              <div className="relative">
                <label 
                  onClick={() => dateInputRef.current?.showPicker()}
                  className="flex items-center text-gg-cyan font-bold mb-2 md:mb-4 tracking-wide text-lg md:text-xl cursor-pointer hover:text-white transition-colors"
                >
                  <Calendar className="mr-2 md:mr-3 w-5 h-5 md:w-6 md:h-6" /> SELECT DATE
                </label>
                <motion.div animate={errors.date ? { x: [-5, 5, -5, 5, 0] } : {}}>
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
                    // Mobile Opt: Use text-base/xl to ensure readability and prevent zoom
                    className={`w-full bg-gg-medium border rounded-xl p-3 md:p-5 text-base md:text-xl text-white font-mono cursor-pointer ${errors.date ? 'border-red-500' : 'border-gray-700 focus:border-gg-cyan'}`}
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 flex justify-between items-center group relative overflow-hidden ${selectedTier.id === t.id ? 'border-gg-purple bg-gg-purple/10' : 'border-gray-700 bg-gg-medium/50 hover:border-gray-500'}`}
                    >
                      <div className="relative z-10 flex items-center">
                         {t.type === 'CONSOLE' ? 
                            <Gamepad className={`mr-3 w-6 h-6 ${selectedTier.id === t.id ? 'text-gg-purple' : 'text-gray-500'}`} /> : 
                            <Monitor className={`mr-3 w-6 h-6 ${selectedTier.id === t.id ? 'text-gg-purple' : 'text-gray-500'}`} />
                         }
                         <span className={`text-lg ${selectedTier.id === t.id ? 'text-white font-bold' : 'text-gray-300'}`}>{t.name}</span>
                      </div>
                      <span className={`relative z-10 font-mono ${selectedTier.id === t.id ? 'text-gg-purple' : 'text-gray-500'}`}>₹{t.basePrice}/hr</span>
                      {selectedTier.id === t.id && (
                        <motion.div layoutId="activeTier" className="absolute inset-0 bg-gradient-to-r from-gg-purple/20 to-transparent" />
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
                      className={`flex-1 min-w-[70px] py-3 px-2 rounded-xl border-2 transition-all duration-300 relative ${selectedDuration.id === d.id ? 'border-gg-lime bg-gg-lime/10 text-white' : 'border-gray-700 bg-gg-medium/50 text-gray-400'}`}
                    >
                      <span className="font-bold text-xl">{d.label}</span>
                      {d.multiplier > d.value && (
                        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] bg-gg-lime text-gg-dark px-1.5 py-0.5 rounded font-bold whitespace-nowrap border border-black">
                           SAVE {Math.round(100 - (d.multiplier/d.value)*100)}%
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
                    
                    {errors.general && (
                      <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-xs md:text-sm text-center">
                        {errors.general}
                      </div>
                    )}

                    <motion.button 
                      onClick={handleConfirmBooking}
                      disabled={status !== 'IDLE'}
                      whileHover={status === 'IDLE' ? { scale: 1.02 } : {}}
                      whileTap={status === 'IDLE' ? { scale: 0.98 } : {}}
                      className={`w-full py-4 md:py-5 font-bold text-lg md:text-xl rounded-xl shadow-xl transition-all relative overflow-hidden flex items-center justify-center group/btn ${
                          status === 'IDLE' ? 'bg-gradient-to-r from-gg-cyan to-gg-purple text-white' : status === 'REDIRECTING' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                        <AnimatePresence mode="wait">
                            {status === 'IDLE' && <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>CONFIRM BOOKING</motion.span>}
                            {status === 'PROCESSING' && <motion.span key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center"><Loader2 className="animate-spin mr-3" /> PROCESSING...</motion.span>}
                            {status === 'REDIRECTING' && <motion.span key="redirecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center"><CheckCircle className="mr-3" /> REDIRECTING...</motion.span>}
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