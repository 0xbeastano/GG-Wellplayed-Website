import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqData = [
  {
    question: "Do I need to bring my own peripherals?",
    answer: "No! We provide high-end mechanical keyboards (Logitech/Razer), gaming mice, and headsets. However, you are welcome to bring your own mouse or controller if you prefer."
  },
  {
    question: "Can I log in to my own Steam/Epic account?",
    answer: "Yes, absolutely. We recommend using your own accounts to track progress. We also have 'Cafe Accounts' with premium games if you just want to try something new."
  },
  {
    question: "Is there food available?",
    answer: "We serve energy drinks, coffee, sodas, and packaged snacks (chips, noodles). For larger meals, we allow ordering from outside delivery apps to the lounge area."
  },
  {
    question: "How do I book for a tournament?",
    answer: "Tournament registrations are handled separately. Check our 'Tournaments' section or join our Discord server for registration links and bracket details."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gg-dark relative">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-white flex items-center justify-center gap-3">
            <HelpCircle className="text-gg-cyan" /> FREQUENTLY ASKED
          </h2>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={index}
              className="border border-gray-800 rounded-lg overflow-hidden bg-gg-medium hover:border-gg-purple/50 transition-colors duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <span className="font-bold text-white text-lg">{item.question}</span>
                <ChevronDown 
                  className={`text-gg-cyan transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-gray-400 font-mono text-sm leading-relaxed border-t border-gray-800/50">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};