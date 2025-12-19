import React from 'react';
import { Twitter, Instagram, Youtube, Twitch, Disc, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const triggerDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event('toggleAdminDashboard'));
  };

  return (
    <footer className="bg-gg-medium pt-20 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-white tracking-tighter">GG WELLPLAYED</h2>
            <div className="flex space-x-4">
              {[Instagram, Twitter, Youtube, Twitch, Disc].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gg-dark flex items-center justify-center text-gray-400 hover:text-gg-cyan hover:scale-110 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4 text-gray-400">
              {['Home', 'Pricing', 'Tournaments', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-gg-cyan transition-colors relative group">
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gg-cyan transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>Satara Rd, Pune, MH</li>
              <li>hello@ggwellplayed.in</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider">Newsletter</h3>
            <div className="flex flex-col space-y-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gg-dark border border-gray-700 p-3 rounded text-sm text-white focus:border-gg-cyan outline-none"
              />
              <button className="bg-gg-cyan text-gg-dark font-bold py-3 rounded hover:bg-white transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2025 GGwellplayed Gaming Cafe. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            {/* Staff Access Button */}
            <button 
              onClick={triggerDashboard}
              className="flex items-center hover:text-gg-cyan transition-colors opacity-50 hover:opacity-100"
            >
              <Lock size={12} className="mr-1" /> Staff
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};