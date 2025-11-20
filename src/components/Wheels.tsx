import React, { useEffect, useState, useRef } from 'react';
import type { WheelItem } from '../types';

interface NameTickerProps {
  items: WheelItem[];
  isSpinning: boolean;
  onSpinComplete: () => void;
  winners: WheelItem[];
}

const NameTicker: React.FC<NameTickerProps> = ({ items, isSpinning, onSpinComplete, winners }) => {
  // Default visual state
  const [displayedName, setDisplayedName] = useState<string>("READY TO PICK");
  // Use Red (#ed1c24) as default color
  const [displayColor, setDisplayColor] = useState<string>("#ed1c24");
  const [scale, setScale] = useState(1);
  
  // Animation state refs
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  
  // Data refs
  const itemsRef = useRef(items);
  const winnersRef = useRef(winners);
  const onSpinCompleteRef = useRef(onSpinComplete);

  // Keep refs synced with props
  useEffect(() => {
    itemsRef.current = items;
    winnersRef.current = winners;
    onSpinCompleteRef.current = onSpinComplete;
  }, [items, winners, onSpinComplete]);
  
  // Total spin duration in ms
  const DURATION = 4000; 

  // Reset display
  useEffect(() => {
    if (!isSpinning && items.length > 0 && winners.length === 0) {
      setDisplayedName("READY");
      setDisplayColor("#ed1c24");
      setScale(1);
    }
  }, [items.length, isSpinning, winners.length]);

  // Handle Static Winner Display
  useEffect(() => {
    if (!isSpinning && winners.length > 0) {
       if (winners.length === 1) {
         setDisplayedName(winners[0].label);
         setDisplayColor(winners[0].color);
       } else {
         setDisplayedName(`${winners.length} WINNERS SELECTED`);
         setDisplayColor("#71bf43"); // Green for success
       }
    }
  }, [winners, isSpinning]);

  // Main Animation Loop
  useEffect(() => {
    if (isSpinning) {
      // Start the loop
      startTimeRef.current = performance.now();
      lastUpdateRef.current = 0;
      
      const animate = (time: number) => {
        const elapsed = time - startTimeRef.current;
        const progress = Math.min(elapsed / DURATION, 1); 
        
        // Easing Logic:
        // We want the update INTERVAL to start small (fast speed) and grow large (slow speed).
        // Using EaseIn (Power 3) means the value stays small for a long time and then shoots up at the end.
        const ease = Math.pow(progress, 3); 
        
        // Interval ramps from 16ms (very fast) to ~600ms (very slow)
        const currentInterval = 16 + (ease * 600);
        
        if (elapsed < DURATION) {
          if (time - lastUpdateRef.current > currentInterval) {
            const currentItems = itemsRef.current;
            if (currentItems.length > 0) {
                const randomIndex = Math.floor(Math.random() * currentItems.length);
                const randomItem = currentItems[randomIndex];
                
                setDisplayedName(randomItem.label);
                setDisplayColor(randomItem.color);
                setScale(1.05);
            }
            lastUpdateRef.current = time;
          } else {
            setScale(prev => Math.max(1, prev - 0.01));
          }
          
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Timer finished
          const currentWinners = winnersRef.current;
          
          if (currentWinners.length > 0) {
            // Final State
            if (currentWinners.length === 1) {
                setDisplayedName(currentWinners[0].label);
                setDisplayColor(currentWinners[0].color);
            } else {
                setDisplayedName(`${currentWinners.length} WINNERS SELECTED`);
                setDisplayColor("#71bf43");
            }
            
            setScale(1.2); 
            setTimeout(() => setScale(1), 300); 
            
            onSpinCompleteRef.current();
          } else {
             animationRef.current = requestAnimationFrame(animate);
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpinning]); 

  return (
    <div className="relative w-full max-w-3xl aspect-video flex flex-col items-center justify-center">
      {/* Main Display Card */}
      <div className="relative w-full h-64 md:h-96 bg-white rounded-[2rem] shadow-2xl border-[6px] flex items-center justify-center overflow-hidden p-8 transition-colors duration-300"
           style={{ borderColor: displayColor, boxShadow: `0 30px 60px -15px ${displayColor}50` }}>
        
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: `linear-gradient(${displayColor} 1px, transparent 1px), linear-gradient(90deg, ${displayColor} 1px, transparent 1px)`, 
               backgroundSize: '40px 40px' 
             }} 
        />

        {/* Text Container */}
        <div className="relative z-10 w-full text-center px-4">
          <div className="mb-4">
            {isSpinning ? (
               <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                 Searching...
               </span>
            ) : winners.length > 0 ? (
              <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-[#9d0a0e] text-xs font-bold uppercase tracking-widest">
                 Result
              </span>
            ) : (
              <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-xs font-bold uppercase tracking-widest">
                 Standby
              </span>
            )}
          </div>

          <div 
            className="font-black text-5xl md:text-7xl lg:text-8xl tracking-tight break-words leading-none transition-transform duration-75 will-change-transform"
            style={{ 
              color: '#1F2937',
              transform: `scale(${scale})`,
              textShadow: isSpinning ? '0 0 20px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {displayedName}
          </div>
        </div>
      </div>

      {/* Glow effect behind */}
      <div 
        className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-r from-[#ed1c24] via-[#f5821f] to-[#ffcb04] opacity-30 blur-3xl rounded-full transition-opacity duration-1000"
        style={{ opacity: isSpinning ? 0.6 : 0.2 }}
      />
    </div>
  );
};

export default NameTicker;