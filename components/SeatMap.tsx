import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Gamepad, Lock } from 'lucide-react';

interface Seat {
  id: string;
  label: string;
  type: 'PC' | 'CONSOLE';
  tierId: string; // Matches the Pricing Tier ID
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  x: number; // Grid Position X (1-12)
  y: number; // Grid Position Y (1-8)
}

// Mock Layout Data
const SEAT_LAYOUT: Seat[] = [
  // High End Row (Top)
  { id: 'PC-01', label: 'VIP-1', type: 'PC', tierId: 'high', status: 'AVAILABLE', x: 2, y: 1 },
  { id: 'PC-02', label: 'VIP-2', type: 'PC', tierId: 'high', status: 'OCCUPIED', x: 3, y: 1 },
  { id: 'PC-03', label: 'VIP-3', type: 'PC', tierId: 'high', status: 'AVAILABLE', x: 4, y: 1 },
  { id: 'PC-04', label: 'VIP-4', type: 'PC', tierId: 'high', status: 'AVAILABLE', x: 5, y: 1 },
  
  // Mid End Rows (Center)
  { id: 'PC-05', label: 'STD-1', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 2, y: 3 },
  { id: 'PC-06', label: 'STD-2', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 3, y: 3 },
  { id: 'PC-07', label: 'STD-3', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 4, y: 3 },
  { id: 'PC-08', label: 'STD-4', type: 'PC', tierId: 'mid', status: 'MAINTENANCE', x: 5, y: 3 },
  
  { id: 'PC-09', label: 'STD-5', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 2, y: 4 },
  { id: 'PC-10', label: 'STD-6', type: 'PC', tierId: 'mid', status: 'OCCUPIED', x: 3, y: 4 },
  { id: 'PC-11', label: 'STD-7', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 4, y: 4 },
  { id: 'PC-12', label: 'STD-8', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 5, y: 4 },

  // Console Lounge (Right Side)
  { id: 'PS-01', label: 'PS5-A', type: 'CONSOLE', tierId: 'ps4', status: 'AVAILABLE', x: 7, y: 1 },
  { id: 'PS-02', label: 'PS5-B', type: 'CONSOLE', tierId: 'ps4', status: 'OCCUPIED', x: 7, y: 2 },
  { id: 'PS-03', label: 'PS5-C', type: 'CONSOLE', tierId: 'ps4', status: 'AVAILABLE', x: 7, y: 3 },
];

interface SeatMapProps {
  selectedSeatId: string | null;
  onSeatSelect: (seatId: string, tierId: string) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ selectedSeatId, onSeatSelect }) => {
  return (
    <div className="w-full overflow-x-auto p-4 bg-gg-dark rounded-xl border border-gray-800 shadow-inner">
      <div className="min-w-[300px] md:min-w-[500px] aspect-[16/9] relative bg-[radial-gradient(circle_at_center,#0F1229_0%,#050714_100%)] p-8">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(0,217,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />
        
        {/* Map Header */}
        <div className="absolute top-2 left-4 text-xs font-mono text-gg-cyan/50 tracking-widest">
          FLOOR_PLAN_V2.1 // KOJAGIRI_BLDG
        </div>
        
        {/* Entrance Indicator */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 text-xs font-mono text-gray-600 flex flex-col items-center">
          <div className="w-12 h-1 bg-gray-700 mb-1" />
          ENTRANCE
        </div>

        {/* Seats Container using CSS Grid for positioning */}
        <div className="relative w-full h-full" style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: '10px' }}>
          
          {/* Legend */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 p-2 bg-black/40 rounded border border-gray-800 z-10">
             <div className="flex items-center gap-2 text-[10px] text-gray-400">
               <div className="w-2 h-2 rounded-full bg-gg-cyan shadow-[0_0_5px_#00D9FF]" /> AVAILABLE
             </div>
             <div className="flex items-center gap-2 text-[10px] text-gray-400">
               <div className="w-2 h-2 rounded-full bg-red-500/50" /> OCCUPIED
             </div>
             <div className="flex items-center gap-2 text-[10px] text-gray-400">
               <div className="w-2 h-2 rounded-full bg-white border border-gg-cyan" /> SELECTED
             </div>
          </div>

          {SEAT_LAYOUT.map((seat) => {
            const isSelected = selectedSeatId === seat.id;
            const isOccupied = seat.status === 'OCCUPIED';
            const isMaintenance = seat.status === 'MAINTENANCE';
            const isDisabled = isOccupied || isMaintenance;

            return (
              <motion.button
                key={seat.id}
                onClick={() => !isDisabled && onSeatSelect(seat.id, seat.tierId)}
                whileHover={!isDisabled ? { scale: 1.1 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                className={`relative flex flex-col items-center justify-center rounded-lg border transition-all duration-300
                  ${isSelected 
                    ? 'bg-white text-gg-dark border-gg-cyan shadow-[0_0_15px_#00D9FF] z-20' 
                    : isDisabled 
                      ? 'bg-red-900/10 border-red-900/30 text-red-900 cursor-not-allowed grayscale opacity-50'
                      : 'bg-gg-medium border-gg-cyan/30 text-gg-cyan hover:border-gg-cyan hover:bg-gg-cyan/10'
                  }
                `}
                style={{
                  gridColumn: seat.x,
                  gridRow: seat.y,
                  width: '100%',
                  height: '100%',
                  minHeight: '40px'
                }}
              >
                {/* Icon */}
                {isMaintenance ? (
                  <Lock size={14} />
                ) : seat.type === 'PC' ? (
                  <Monitor size={16} className={seat.tierId === 'high' ? 'text-gg-purple' : ''} />
                ) : (
                  <Gamepad size={16} />
                )}
                
                {/* Label */}
                <span className="text-[8px] font-bold mt-1 font-mono">{seat.label}</span>
                
                {/* Status Dot */}
                {!isDisabled && !isSelected && (
                   <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${seat.tierId === 'high' ? 'bg-gg-purple' : 'bg-gg-cyan'} animate-pulse`} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};