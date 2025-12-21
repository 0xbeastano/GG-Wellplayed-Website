import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Map as MapIcon } from 'lucide-react';

export const LocationContact: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-gg-dark">
      {/* Map Side */}
      <div className="w-full md:w-1/2 h-[300px] md:h-auto relative overflow-hidden border-b md:border-b-0 md:border-r border-gray-800 order-2 md:order-1">
         {/* Updated to use a Search Query Embed for better accuracy with dynamic addresses */}
         <iframe 
           src="https://maps.google.com/maps?q=GGwellplayed%20Gaming%20Cafe%2C%20Satara%20Rd%2C%20Pune&t=&z=16&ie=UTF8&iwloc=&output=embed"
           width="100%" 
           height="100%" 
           style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(85%)' }} 
           allowFullScreen 
           loading="lazy"
           title="Location Map showing GGwellplayed Gaming Cafe"
         ></iframe>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative">
               <div className="absolute inset-0 bg-gg-cyan rounded-full animate-ping opacity-75 h-12 w-12" />
               <div className="relative bg-gg-cyan rounded-full h-4 w-4 border-2 border-white shadow-[0_0_15px_#00D9FF]" />
            </div>
         </div>
         <div className="absolute bottom-4 left-4 right-4 bg-gg-dark/90 p-3 md:p-4 rounded border border-gg-cyan/30 backdrop-blur-md">
            <p className="text-xs md:text-sm font-mono text-gg-cyan font-bold">LOCATED AT: SATARA ROAD, PUNE</p>
            <p className="text-[10px] text-gray-400 mt-1 font-mono flex items-center gap-1">
                <MapIcon size={10} /> PLUS CODE: FV65+F8
            </p>
         </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-gg-dark order-1 md:order-2">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 md:mb-8">CONTACT US</h2>
        
        <form className="space-y-6 md:space-y-6 mb-8 md:mb-12">
          <div>
            <label htmlFor="contact-name" className="sr-only">Your Name</label>
            <input 
              id="contact-name"
              type="text" 
              placeholder="YOUR NAME" 
              className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:border-gg-cyan focus:outline-none transition-colors placeholder-gray-500 font-mono text-base"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="sr-only">Your Email</label>
            <input 
              id="contact-email"
              type="email" 
              placeholder="YOUR EMAIL" 
              className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:border-gg-cyan focus:outline-none transition-colors placeholder-gray-500 font-mono text-base"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="sr-only">Message</label>
            <textarea 
              id="contact-message"
              placeholder="MESSAGE" 
              rows={4}
              className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:border-gg-cyan focus:outline-none transition-colors placeholder-gray-500 font-mono text-base"
            ></textarea>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full md:w-auto px-8 py-3 border border-gg-cyan text-gg-cyan font-bold hover:bg-gg-cyan hover:text-gg-dark transition-all focus:outline-none focus:ring-2 focus:ring-gg-cyan rounded-sm"
          >
            SEND MESSAGE
          </motion.button>
        </form>

        <div className="grid grid-cols-1 gap-4 text-sm text-gray-400">
          <div className="flex items-start">
            <MapPin className="mr-3 text-gg-purple flex-shrink-0 mt-1" size={20} aria-hidden="true" />
            <p className="leading-relaxed">
              Sr. No 25, 2nd Floor, Kojagiri Building, Satara Rd,<br />
              opp. Canera Bank, Shridharnagar, Vivek Nagar,<br />
              Chaitanya Nagar, Pune, Maharashtra 411043
            </p>
          </div>
          <div className="flex items-center">
            <Phone className="mr-3 text-gg-purple flex-shrink-0" size={20} aria-hidden="true" />
            <p>+91 98765 43210</p>
          </div>
          <div className="flex items-center">
            <Mail className="mr-3 text-gg-purple flex-shrink-0" size={20} aria-hidden="true" />
            <p>hello@ggwellplayed.in</p>
          </div>
          <div className="flex items-center">
            <Clock className="mr-3 text-gg-purple flex-shrink-0" size={20} aria-hidden="true" />
            <p>9:00 AM - 10:00 PM Daily</p>
          </div>
        </div>
      </div>
    </section>
  );
};