import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Calendar, Clock, Monitor, Gamepad, Loader2, CheckCircle, AlertCircle, User, Phone, Map } from 'lucide-react';
import { Booking as BookingType } from '../types';
import { SeatMap } from './SeatMap';

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

const AnimatedCounter = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [glow, setGlow] = useState(false);

  useEffect(() => {
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
  const dateInputRef = useRef<HTMLInputElement>(null);
  const mountTime = useRef<number>(Date.now());

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [date, setDate] = useState('');
  const [honeyPot, setHoneyPot] = useState('');
  
  const [selectedTier, setSelectedTier] = useState(TIERS[0]);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(50);
  
  const [errors, setErrors] = useState<{date?: string; name?: string; phone?: string; general?: string}>({});
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'REDIRECTING'>('IDLE');

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

  useEffect(() => {
    const calculated = Math.ceil(selectedTier.basePrice * selectedDuration.multiplier);
    setTotalPrice(calculated);
  }, [selectedTier, selectedDuration]);

  const handleSeatSelect = (seatId: string, tierId: string) => {
    setSelectedSeatId(seatId);
    const tier = TIERS.find(t => t.id === tierId);
    if (tier) setSelectedTier(tier);
  };

  const checkRateLimit = (): boolean => {
    try {
        const stored = localStorage.getItem(RATE_LIMIT_KEY);
        const history = stored ? JSON.parse(stored) : [];
        const now = Date.now();
        const windowTime = 5 * 60 * 1000;
        const limit = 3;
        const recentAttempts = history.filter((timestamp: number) => now - timestamp < windowTime);
        if (recentAttempts.length >= limit) return false;
        recentAttempts.push(now);
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentAttempts));
        return true;
    } catch (e) {
        return true; 
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {date?: string; name?: string; phone?: string; general?: string} = {};
    let isValid = true;
    if (honeyPot !== '') return false;
    if (Date.now() - mountTime.current < 2000) return false;
    if (!customerName.trim()) { newErrors.name = "Name is required"; isValid = false; }
    if (!phoneNumber.trim() || !/^\d{10}$/.test(phoneNumber)) { newErrors.phone = "Enter valid 10-digit number"; isValid = false; }
    if (!date) {
      newErrors.date = "Please select a booking date"; isValid = false;
    } else {
      const [year, month, day] = date.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (selectedDate.getTime() < today.getTime()) { newErrors.date = "Date cannot be in the past"; isValid = false; }
      if (selectedDate.getTime() === today.getTime() && now.getHours() >= 22) { newErrors.date = "Bookings closed for today (after 10 PM)"; isValid = false; }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleConfirmBooking = () => {
    if (!validateForm()) return;
    if (!checkRateLimit()) { setErrors({ general: "Too many attempts. Please try again in 5 minutes." }); return; }
    setStatus('PROCESSING');
    
    const bookingID = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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

    try {
      const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const bookings: BookingType[] = existingData ? JSON.parse(existingData) : [];
      bookings.push(bookingData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings));
      window.dispatchEvent(new Event('bookingUpdated'));
    } catch (error) {}

    setTimeout(() => {
      setStatus('REDIRECTING');
      const message = `*NEW BOOKING REQUEST* 🎮\n\n*Ref ID:* ${bookingID}\n*Name:* ${customerName}\n*Phone:* ${phoneNumber}\n*Date:* ${formattedDate}\n*Platform:* ${selectedTier.label}\n${selectedSeatId ? `*Seat Preference:* ${selectedSeatId}` : ''}\n*Duration:* ${selectedDuration.text}\n*Total:* ₹${totalPrice}\n\nPlease confirm this slot.`;
      window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`, '_blank');
      setTimeout(() => {
        setStatus('IDLE');
        setCustomerName('');
        setPhoneNumber('');
        setDate('');
        setSelectedSeatId(null);
        setErrors({});
      }, 500);
    }, 1000);
  };

  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
          <p className="text-gray-400 font-mono text-xs md:text-lg">Select your rig from the map below or fill out the form directly.</p>
        </motion.div>

        <div className="bg-gg-dark rounded-xl md:rounded-2xl p-4 md:p-8 shadow-2xl border border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Visual Seat Map */}
            <div className="flex flex-col">
              <h3 className="flex items-center text-gg-cyan font-bold mb-4 tracking-wide text-sm md:text-base">
                <Map className="mr-2 w-4 h-4" /> INTERACTIVE FLOOR PLAN
              </h3>
              <SeatMap 
                selectedSeatId={selectedSeatId}
                onSeatSelect={handleSeatSelect}
              />
              <p className="text-xs text-gray-500 mt-3 font-mono">
                *Click a seat to automatically select platform and tier.
              </p>
            </div>

            {/* Form Section */}
            <div className="space-y-6 md:space-y-8">
              
              <input 
                type="text" 
                value={honeyPot}
                onChange={(e) => setHoneyPot(e.target.value)}
                style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }}
                tabIndex={-1}
              />

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="booking-name" className="flex items-center text-gray-400 font-bold mb-2 text-xs md:text-sm tracking-wider">
                    <User className="mr-2 w-4 h-4" /> NAME
                  </label>
                  <input 
                    id="booking-name"
                    type="text" 
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if(errors.name) setErrors({...errors, name: undefined});
                    }}
                    // 'text-base' is critical for preventing iOS zoom on focus
                    className={`w-full bg-gg-medium border rounded-lg p-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-gg-cyan/50 transition-all ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-gg-cyan'}`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="booking-phone" className="flex items-center text-gray-400 font-bold mb-2 text-xs md:text-sm tracking-wider">
                    <Phone className="mr-2 w-4 h-4" /> PHONE
                  </label>
                  <input 
                    id="booking-phone"
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhoneNumber(val);
                      if(errors.phone) setErrors({...errors, phone: undefined});
                    }}
                    className={`w-full bg-gg-medium border rounded-lg p-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-gg-cyan/50 transition-all ${errors.phone ? 'border-red-500' : 'border-gray-700 focus:border-gg-cyan'}`}
                    placeholder="10-digit number"
                  />
                   {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label 
                  htmlFor="booking-date"
                  className="flex items-center text-gg-cyan font-bold mb-2 md:mb-4 tracking-wide text-lg md:text-xl"
                >
                  <Calendar className="mr-2 md:mr-3 w-5 h-5 md:w-6 md:h-6" /> SELECT DATE
                </label>
                <input 
                    id="booking-date"
                    ref={dateInputRef}
                    type="date" 
                    min={getTodayString()}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if(errors.date) setErrors({...errors, date: undefined});
                    }}
                    style={{ colorScheme: 'dark' }}
                    className={`w-full bg-gg-medium border rounded-xl p-4 md:p-5 text-base md:text-xl text-white font-mono cursor-pointer focus:outline-none focus:ring-2 focus:ring-gg-cyan/50 touch-manipulation ${errors.date ? 'border-red-500' : 'border-gray-700 focus:border-gg-cyan'}`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date}</p>}
              </div>

              {/* Platform Selection */}
              <div>
                <h3 className="flex items-center text-gg-purple font-bold mb-2 md:mb-4 tracking-wide text-lg md:text-xl">
                  <Monitor className="mr-2 md:mr-3 w-5 h-5 md:w-6 md:h-6" /> PLATFORM
                </h3>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {TIERS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                         setSelectedTier(t);
                         if (selectedSeatId) setSelectedSeatId(null);
                      }}
                      className={`p-4 md:p-4 rounded-xl border text-left transition-all duration-300 flex justify-between items-center group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-gg-purple touch-manipulation active:scale-[0.98] ${selectedTier.id === t.id ? 'border-gg-purple bg-gg-purple/10' : 'border-gray-700 bg-gg-medium/50 hover:border-gray-500'}`}
                    >
                      <div className="relative z-10 flex items-center overflow-hidden">
                         {t.type === 'CONSOLE' ? 
                            <Gamepad className={`mr-3 w-6 h-6 flex-shrink-0 ${selectedTier.id === t.id ? 'text-gg-purple' : 'text-gray-500'}`} /> : 
                            <Monitor className={`mr-3 w-6 h-6 flex-shrink-0 ${selectedTier.id === t.id ? 'text-gg-purple' : 'text-gray-500'}`} />
                         }
                         <span className={`text-sm md:text-lg truncate ${selectedTier.id === t.id ? 'text-white font-bold' : 'text-gray-300'}`}>{t.name}</span>
                      </div>
                      <span className={`relative z-10 font-mono text-sm md:text-base ml-2 flex-shrink-0 ${selectedTier.id === t.id ? 'text-gg-purple' : 'text-gray-500'}`}>₹{t.basePrice}/hr</span>
                      {selectedTier.id === t.id && (
                        <motion.div layoutId="activeTier" className="absolute inset-0 bg-gradient-to-r from-gg-purple/20 to-transparent" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <h3 className="flex items-center text-gg-lime font-bold mb-2 md:mb-4 tracking-wide text-lg md:text-xl">
                  <Clock className="mr-2 md:mr-3 w-5 h-5 md:w-6 md:h-6" /> DURATION
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDuration(d)}
                      className={`py-4 px-2 rounded-xl border-2 transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-gg-lime touch-manipulation active:scale-95 ${selectedDuration.id === d.id ? 'border-gg-lime bg-gg-lime/10 text-white' : 'border-gray-700 bg-gg-medium/50 text-gray-400'}`}
                    >
                      <span className="font-bold text-lg md:text-xl">{d.label}</span>
                      {d.multiplier > d.value && (
                        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] bg-gg-lime text-gg-dark px-1.5 py-0.5 rounded font-bold whitespace-nowrap border border-black shadow-lg z-20">
                           SAVE {Math.round(100 - (d.multiplier/d.value)*100)}%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Receipt / Total Section */}
            <div className="flex flex-col h-full mt-4 lg:mt-0 lg:col-span-2">
               <div className="flex-grow flex flex-col justify-center bg-gg-medium rounded-2xl p-6 md:p-10 border border-gray-800 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                  
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-gray-400 font-mono mb-2 text-base md:text-lg tracking-widest uppercase">Estimated Total</h3>
                        <div className="flex items-baseline mb-4">
                            <span className="text-3xl md:text-5xl font-bold text-gg-cyan mr-2">₹</span>
                            <div className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tighter">
                            <AnimatedCounter value={totalPrice} />
                            </div>
                        </div>
                        <div className="space-y-3 md:space-y-4 text-sm md:text-lg text-gray-300 font-mono">
                            <div className="flex justify-between">
                                <span>Platform Rate</span>
                                <span>₹{selectedTier.basePrice}/hr</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Duration</span>
                                <span>{selectedDuration.text}</span>
                            </div>
                            {selectedSeatId && (
                                <div className="flex justify-between text-gg-purple font-bold">
                                    <span>Selected Seat</span>
                                    <span>{selectedSeatId}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gg-lime font-bold">
                                <span>Multiplier</span>
                                <span>x{selectedDuration.multiplier}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        {errors.general && (
                        <div role="alert" className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-xs md:text-sm text-center">
                            {errors.general}
                        </div>
                        )}

                        <motion.button 
                        onClick={handleConfirmBooking}
                        disabled={status !== 'IDLE'}
                        whileHover={status === 'IDLE' ? { scale: 1.02 } : {}}
                        whileTap={status === 'IDLE' ? { scale: 0.98 } : {}}
                        className={`w-full py-5 font-bold text-xl rounded-xl shadow-xl transition-all relative overflow-hidden flex items-center justify-center group/btn focus:outline-none focus:ring-2 focus:ring-white touch-manipulation ${
                            status === 'IDLE' ? 'bg-gradient-to-r from-gg-cyan to-gg-purple text-white' : status === 'REDIRECTING' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                        >
                            <AnimatePresence mode="wait">
                                {status === 'IDLE' && <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>CONFIRM BOOKING</motion.span>}
                                {status === 'PROCESSING' && <motion.span key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center"><Loader2 className="animate-spin mr-3" /> PROCESSING...</motion.span>}
                                {status === 'REDIRECTING' && <motion.span key="redirecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center"><CheckCircle className="mr-3" /> REDIRECTING...</motion.span>}
                            </AnimatePresence>
                        </motion.button>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            By clicking confirm, you will be redirected to WhatsApp to finalize your payment and slot.
                        </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};