import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, TrendingUp, Users, Monitor, Search, Trash2 } from 'lucide-react';
import { Booking } from '../types';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCAL_STORAGE_KEY = 'ggwellplayed_bookings';

export const Dashboard: React.FC<DashboardProps> = ({ isOpen, onClose }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topPlatform, setTopPlatform] = useState('-');

  useEffect(() => {
    loadData();
    // Listen for updates from other tabs/components
    window.addEventListener('bookingUpdated', loadData);
    window.addEventListener('storage', loadData);
    
    return () => {
      window.removeEventListener('bookingUpdated', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, [isOpen]);

  const loadData = () => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed: Booking[] = data ? JSON.parse(data) : [];
      // Sort by newest first
      const sorted = parsed.sort((a, b) => b.timestamp - a.timestamp);
      setBookings(sorted);
      calculateStats(sorted);
    } catch (e) {
      console.error("Failed to load bookings");
    }
  };

  const calculateStats = (data: Booking[]) => {
    const revenue = data.reduce((acc, curr) => acc + curr.price, 0);
    setTotalRevenue(revenue);

    if (data.length === 0) {
      setTopPlatform('-');
      return;
    }

    const platforms: {[key: string]: number} = {};
    data.forEach(b => {
      platforms[b.platform] = (platforms[b.platform] || 0) + 1;
    });
    
    const top = Object.entries(platforms).sort((a,b) => b[1] - a[1])[0];
    setTopPlatform(top ? top[0] : '-');
  };

  // Security: Sanitize fields to prevent CSV Injection (Formula Injection)
  const sanitizeForCSV = (value: string | number) => {
    const str = String(value);
    // If the value starts with characters that trigger formulas in Excel/Sheets, prepend a single quote
    if (str.match(/^[=+\-@]/)) {
      return `'${str}`;
    }
    return str;
  };

  const exportCSV = () => {
    if (bookings.length === 0) return;

    const headers = ["ID", "Name", "Phone", "Date", "Platform", "Duration", "Price", "Timestamp"];
    const rows = bookings.map(b => [
      sanitizeForCSV(b.id),
      sanitizeForCSV(b.customerName),
      sanitizeForCSV(b.phoneNumber),
      sanitizeForCSV(b.date),
      sanitizeForCSV(b.platform),
      sanitizeForCSV(b.duration),
      sanitizeForCSV(b.price),
      new Date(b.timestamp).toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ggwellplayed_bookings_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearHistory = () => {
    if(confirm("Are you sure you want to clear all booking history? This cannot be undone.")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      loadData();
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phoneNumber.includes(searchTerm)
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-gg-dark/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 font-sans"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-gg-medium w-full max-w-6xl h-full max-h-[90vh] rounded-2xl border border-gg-cyan/30 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gg-dark/50">
            <div>
               <h2 className="text-2xl font-heading font-bold text-white tracking-wider flex items-center">
                 <span className="w-3 h-3 bg-gg-lime rounded-full mr-3 animate-pulse"/>
                 ADMIN DASHBOARD
               </h2>
               <p className="text-gray-400 text-xs font-mono mt-1">LOCAL STORAGE DATABASE</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors text-white">
              <X />
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gg-medium">
             <div className="bg-gg-dark p-5 rounded-xl border border-gray-800 flex items-center">
                <div className="p-3 bg-gg-cyan/10 rounded-lg mr-4 text-gg-cyan">
                  <TrendingUp />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
                </div>
             </div>
             <div className="bg-gg-dark p-5 rounded-xl border border-gray-800 flex items-center">
                <div className="p-3 bg-gg-purple/10 rounded-lg mr-4 text-gg-purple">
                  <Users />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold">Total Bookings</p>
                  <p className="text-2xl font-bold text-white">{bookings.length}</p>
                </div>
             </div>
             <div className="bg-gg-dark p-5 rounded-xl border border-gray-800 flex items-center">
                <div className="p-3 bg-gg-pink/10 rounded-lg mr-4 text-gg-pink">
                  <Monitor />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold">Top Platform</p>
                  <p className="text-xl font-bold text-white truncate max-w-[150px]">{topPlatform}</p>
                </div>
             </div>
          </div>

          {/* Controls */}
          <div className="px-6 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search by name, ID or phone..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gg-dark border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-gg-cyan outline-none"
                />
             </div>
             <div className="flex gap-3">
                <button 
                  onClick={clearHistory} 
                  className="flex items-center px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/50 rounded-lg text-sm font-bold hover:bg-red-900/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> CLEAR DB
                </button>
                <button 
                  onClick={exportCSV} 
                  className="flex items-center px-4 py-2 bg-gg-cyan/10 text-gg-cyan border border-gg-cyan/30 rounded-lg text-sm font-bold hover:bg-gg-cyan/20 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" /> EXPORT CSV
                </button>
             </div>
          </div>

          {/* Table */}
          <div className="flex-grow overflow-auto px-6 pb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs uppercase border-b border-gray-700">
                  <th className="py-3 px-2">Ref ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Platform</th>
                  <th className="py-3 px-2">Duration</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">Booked At</th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono text-gray-300">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 text-gg-cyan font-bold">{booking.id}</td>
                    <td className="py-3 px-2">
                      <div className="font-bold text-white">{booking.customerName}</div>
                      <div className="text-xs text-gray-500">{booking.phoneNumber}</div>
                    </td>
                    <td className="py-3 px-2">{booking.date}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-xs">
                        {booking.platform}
                      </span>
                    </td>
                    <td className="py-3 px-2">{booking.duration}</td>
                    <td className="py-3 px-2 text-white">₹{booking.price}</td>
                    <td className="py-3 px-2 text-xs text-gray-500">{new Date(booking.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      No bookings found in local storage.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};