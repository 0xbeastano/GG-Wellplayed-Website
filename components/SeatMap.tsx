import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Gamepad, Lock, Tv, Info, Armchair, MoveHorizontal } from 'lucide-react';

interface Seat {
  id: string;
  label: string;
  type: 'PC' | 'CONSOLE';
  tierId: string; // Matches the Pricing Tier ID
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  x: number; // Grid Column (1-12)
  y: number; // Grid Row (1-8)
  rotation?: number; // For icon rotation
}

// Updated Layout Data for 12x8 Grid
const SEAT_LAYOUT: Seat[] = [
  // --- PC ARENA (Left Side) ---
  // High End Row (Facing Wall)
  { id: 'PC-01', label: 'VIP-1', type: 'PC', tierId: 'high', status: 'AVAILABLE', x: 2, y: 2, rotation: 0 },
  { id: 'PC-02', label: 'VIP-2', type: 'PC', tierId: 'high', status: 'OCCUPIED', x: 3, y: 2, rotation: 0 },
  { id: 'PC-03', label: 'VIP-3', type: 'PC', tierId: 'high', status: 'AVAILABLE', x: 4, y: 2, rotation: 0 },
  { id: 'PC-04', label: 'VIP-4', type: 'PC', tierId: 'high', status: 'AVAILABLE', x: 5, y: 2, rotation: 0 },
  
  // Mid End Rows (Island Cluster)
  { id: 'PC-05', label: 'STD-1', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 2, y: 5, rotation: 180 },
  { id: 'PC-06', label: 'STD-2', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 3, y: 5, rotation: 180 },
  { id: 'PC-07', label: 'STD-3', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 4, y: 5, rotation: 180 },
  { id: 'PC-08', label: 'STD-4', type: 'PC', tierId: 'mid', status: 'MAINTENANCE', x: 5, y: 5, rotation: 180 },
  
  { id: 'PC-09', label: 'STD-5', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 2, y: 6, rotation: 0 },
  { id: 'PC-10', label: 'STD-6', type: 'PC', tierId: 'mid', status: 'OCCUPIED', x: 3, y: 6, rotation: 0 },
  { id: 'PC-11', label: 'STD-7', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 4, y: 6, rotation: 0 },
  { id: 'PC-12', label: 'STD-8', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 5, y: 6, rotation: 0 },

  // --- CONSOLE LOUNGE (Right Side) ---
  // TV Screens against the wall
  { id: 'PS-01', label: 'PS5-A', type: 'CONSOLE', tierId: 'ps4', status: 'AVAILABLE', x: 10, y: 2, rotation: -90 },
  { id: 'PS-02', label: 'PS5-B', type: 'CONSOLE', tierId: 'ps4', status: 'OCCUPIED', x: 10, y: 4, rotation: -90 },
  { id: 'PS-03', label: 'PS5-C', type: 'CONSOLE', tierId: 'ps4', status: 'AVAILABLE', x: 10, y: 6, rotation: -90 },
];

interface SeatMapProps {
  selectedSeatId: string | null;
  onSeatSelect: (seatId: string, tierId: string) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ selectedSeatId, onSeatSelect }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Responsive Legend (Above Map) */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-between items-center bg-gg-dark/50 p-3 rounded-lg border border-gray-800 text-xs font-mono">
         <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-gg-medium border border-gg-cyan/50 shadow-[0_0_5px_rgba(0,217,255,0.3)]" /> 
              <span className="text-gray-400">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-900/30 border border-red-900/50" /> 
              <span className="text-gray-500">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-white border border-white" /> 
              <span className="text-white font-bold">Selected</span>
            </div>
         </div>
         <div className="flex gap-2 text-[10px] uppercase tracking-wider opacity-60">
             <span className="flex items-center text-gg-cyan"><Monitor size={12} className="mr-1"/> PC</span>
             <span className="flex items-center text-gg-purple"><Gamepad size={12} className="mr-1"/> PS5</span>
         </div>
      </div>

      {/* 2. Scrollable Map Container Wrapper */}
      <div className="relative w-full rounded-xl border border-gray-800 bg-[#0B0E1E] shadow-inner overflow-hidden">
        
        {/* Mobile Scroll Hint Overlay */}
        <div className="absolute inset-0 z-30 pointer-events-none md:hidden flex items-center justify-center">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.5, duration: 0.5 }}
               onAnimationComplete={(definition) => {
                  // Optional: fade out after some time if needed, but keeping it visible is often better for UX until interaction
                  // For "subtle", we can use a repeating gentle pulse or fade out
               }}
               className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-white/90 border border-white/10 shadow-xl"
            >
                <MoveHorizontal size={16} className="animate-[pulse_2s_ease-in-out_infinite]" />
                <span className="text-[10px] font-bold tracking-widest">SWIPE TO EXPLORE</span>
            </motion.div>
        </div>

        {/* Scrollable Area */}
        <div className="w-full overflow-x-auto pb-2 custom-scrollbar relative z-10">
            {/* Fixed Width Container ensures seats aren't squashed on mobile */}
            <div className="min-w-[600px] md:min-w-full aspect-[16/9] md:aspect-[21/9] relative p-6 select-none">
                
                {/* Background Texture & Grid */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px] pointer-events-none" />

                {/* --- ZONES --- */}
                
                {/* PC Zone */}
                <div className="absolute left-4 top-4 bottom-16 w-[60%] rounded-2xl border-2 border-gg-cyan/10 bg-gg-cyan/5 pointer-events-none">
                    <div className="absolute -top-3 left-6 px-2 bg-[#0B0E1E] text-gg-cyan/70 text-[10px] font-bold tracking-widest uppercase border border-gg-cyan/20 rounded">
                        BATTLE ARENA (PC)
                    </div>
                </div>

                {/* Console Zone */}
                <div className="absolute right-4 top-4 bottom-16 w-[30%] rounded-2xl border-2 border-gg-purple/10 bg-gg-purple/5 pointer-events-none">
                    <div className="absolute -top-3 right-6 px-2 bg-[#0B0E1E] text-gg-purple/70 text-[10px] font-bold tracking-widest uppercase border border-gg-purple/20 rounded">
                        VIP LOUNGE (PS5)
                    </div>
                    {/* Decorative Couch/TV indicators */}
                    <div className="absolute right-0 top-[20%] w-1 h-[60%] bg-gg-purple/20 blur-sm" />
                </div>

                {/* Entry Point */}
                <div className="absolute bottom-0 left-16 w-24 h-4 bg-gradient-to-t from-gg-cyan/20 to-transparent border-x border-gg-cyan/30 pointer-events-none">
                    <div className="absolute bottom-1 w-full text-center text-[9px] text-gg-cyan tracking-[0.3em]">ENTRY</div>
                </div>


                {/* --- SEAT GRID --- */}
                <div className="relative w-full h-full z-10" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(12, 1fr)', 
                    gridTemplateRows: 'repeat(8, 1fr)', 
                    gap: '8px' 
                }}>
                    {SEAT_LAYOUT.map((seat) => {
                    const isSelected = selectedSeatId === seat.id;
                    const isOccupied = seat.status === 'OCCUPIED';
                    const isMaintenance = seat.status === 'MAINTENANCE';
                    const isDisabled = isOccupied || isMaintenance;

                    return (
                        <motion.button
                        key={seat.id}
                        onClick={() => !isDisabled && onSeatSelect(seat.id, seat.tierId)}
                        whileTap={!isDisabled ? { scale: 0.9 } : {}}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * (seat.x + seat.y), type: 'spring' }}
                        className={`relative flex flex-col items-center justify-center rounded-lg transition-all duration-300 group
                            ${isSelected 
                            ? 'bg-white text-gg-dark ring-4 ring-gg-cyan/30 z-20 shadow-[0_0_20px_white]' 
                            : isDisabled 
                                ? 'bg-red-900/10 border border-red-900/20 text-red-900/50 cursor-not-allowed'
                                : `bg-gg-medium/80 border text-gray-400 hover:text-white hover:border-${seat.tierId === 'high' || seat.type === 'CONSOLE' ? 'gg-purple' : 'gg-cyan'} hover:bg-gg-medium hover:shadow-[0_0_15px_rgba(0,217,255,0.2)]`
                            }
                            ${!isSelected && !isDisabled ? (seat.tierId === 'high' ? 'border-gg-purple/30 text-gg-purple/70' : 'border-gg-cyan/20 text-gg-cyan/70') : ''}
                        `}
                        style={{
                            gridColumn: seat.x,
                            gridRow: seat.y,
                            gridRowEnd: seat.type === 'CONSOLE' ? 'span 2' : undefined, // Consoles take more vertical space
                            minHeight: '40px'
                        }}
                        >
                        {/* Seat Content */}
                        <div className="relative flex flex-col items-center" style={{ transform: `rotate(${seat.rotation}deg)` }}>
                            {isMaintenance ? (
                            <Lock size={14} />
                            ) : seat.type === 'CONSOLE' ? (
                            <div className="flex flex-col items-center">
                                {/* TV Screen representation */}
                                <div className={`w-8 h-1 mb-1 rounded-full ${isSelected ? 'bg-gg-dark' : 'bg-current opacity-50'}`} />
                                <Armchair size={20} strokeWidth={1.5} />
                            </div>
                            ) : (
                            <>
                                <div className={`w-6 h-1 mb-0.5 rounded-full ${isSelected ? 'bg-gg-dark' : 'bg-current opacity-50'}`} />
                                <Monitor size={18} strokeWidth={1.5} />
                                {/* Keyboard hint */}
                                <div className={`w-4 h-0.5 mt-0.5 rounded-full ${isSelected ? 'bg-gg-dark' : 'bg-current opacity-30'}`} />
                            </>
                            )}
                        </div>

                        {/* Tooltip / Label */}
                        <div className={`absolute -bottom-4 md:-bottom-5 text-[8px] md:text-[9px] font-bold font-mono whitespace-nowrap px-1 py-0.5 rounded ${isSelected ? 'bg-gg-dark text-white' : 'bg-gg-dark/80 text-gray-500'} pointer-events-none z-20`}>
                            {seat.label}
                        </div>
                        
                        {/* Connection Line (Decor) */}
                        {!isDisabled && !isSelected && (
                            <div className={`absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-10 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none`} />
                        )}
                        </motion.button>
                    );
                    })}
                </div>
            </div>
        </div>
      </div>
      
    </div>
  );
};