import React, { useState, useCallback, useEffect } from 'react';
import NameTicker from './components/Wheels';
import Controls from './components/Control';
import WinnerModal from './components/WinnerModal';
import Confetti from './components/Confetti';
import type { WheelItem, WinnerRecord } from './types';

// Updated palette: Bright Red, Yellow, Green, Orange, Dark Red
const COLORS = ['#ed1c24', '#ffcb04', '#71bf43', '#f5821f', '#9d0a0e', '#ed1c24', '#ffcb04', '#71bf43'];

const App: React.FC = () => {
  const [items, setItems] = useState<WheelItem[]>([
    { id: '1', label: 'Tacos', color: COLORS[0] },
    { id: '2', label: 'Pizza', color: COLORS[1] },
    { id: '3', label: 'Sushi', color: COLORS[2] },
  ]);

  const [isSpinning, setIsSpinning] = useState(false);
  const [winners, setWinners] = useState<WheelItem[]>([]); // Current batch of winners
  const [winnerHistory, setWinnerHistory] = useState<WinnerRecord[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Configuration
  const [winnerCount, setWinnerCount] = useState<number>(1);
  const [title, setTitle] = useState<string>("Grand Giveaway");

  // Fullscreen Logic
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const assignColors = (items: WheelItem[]) => {
    return items.map((item, index) => ({
      ...item,
      color: item.color || COLORS[index % COLORS.length]
    }));
  };

  const handleAddName = (name: string) => {
    const newItem: WheelItem = {
      id: Math.random().toString(36).substring(7),
      label: name,
      color: COLORS[items.length % COLORS.length]
    };
    setItems(prev => assignColors([...prev, newItem]));
  };

  const handleBulkAdd = (names: string[]) => {
    const newItems = names.map((name, index) => ({
      id: Math.random().toString(36).substring(7) + index,
      label: name,
      color: COLORS[(items.length + index) % COLORS.length]
    }));
    setItems(prev => [...prev, ...newItems]);
  };

  const handleClear = () => {
    setItems([]);
    setWinnerCount(1);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };
  
  const handleClearHistory = () => {
      setWinnerHistory([]);
  };

  const handleRemoveWinners = () => {
    if (winners.length > 0) {
      const winnerIds = new Set(winners.map(w => w.id));
      setItems(prev => prev.filter(i => !winnerIds.has(i.id)));
      setWinners([]);
    }
  };

  const spinWheel = () => {
    if (items.length === 0 || isSpinning) return;
    
    // Validation
    const safeCount = Math.min(winnerCount, items.length);
    if (safeCount <= 0) return;

    setIsSpinning(true);
    setWinners([]);
    setShowConfetti(false);

    // Logic: Pick N unique winners
    // Fisher-Yates Shuffle copy to not mutate original array immediately
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const selectedWinners = shuffled.slice(0, safeCount);
    setWinners(selectedWinners);
  };

  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false);
    setShowConfetti(true);
    
    // Add to history
    setWinners(currentWinners => {
        if (currentWinners.length > 0) {
            const batchId = Math.random().toString(36).substring(7);
            const historyRecords: WinnerRecord[] = currentWinners.map(w => ({
                id: Math.random().toString(36),
                item: w,
                timestamp: new Date(),
                batchId
            }));
            
            // Functional update to avoid dependency cycles
            setWinnerHistory(prev => [...prev, ...historyRecords]);
        }
        return currentWinners;
    });
  }, []);

  const handleCloseModal = () => {
    setShowConfetti(false);
    setWinners([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800">
      {showConfetti && <Confetti />}
      
      {/* Header - Hidden in Fullscreen */}
      {!isFullscreen && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/trip-turbo-logo.png" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
                alt="Trip Turbo Picker" 
                className="h-10 w-auto object-contain drop-shadow-md" 
              />
              {/* Fallback if image missing */}
              <div id="logo-fallback" className="hidden w-10 h-10 rounded-lg bg-gradient-to-br from-[#ed1c24] to-[#9d0a0e] items-center justify-center text-white font-black text-xl shadow-md">
                T
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ed1c24] to-[#9d0a0e] tracking-tight">
                Trip Turbo Picker
              </h1>
            </div>
            <div className="flex items-center gap-2">
               <button 
                 onClick={toggleFullscreen}
                 className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#ed1c24] bg-gray-100 hover:bg-red-50 rounded-lg transition-colors"
                 title="Enter Fullscreen Presentation Mode"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                 </svg>
                 <span>Fullscreen</span>
               </button>
              {items.length > 0 && (
                 <span className="w-2 h-2 rounded-full bg-[#71bf43] animate-pulse ml-2" title="System Ready"></span>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Layout: Adjusts for Fullscreen */}
      <main className={
          isFullscreen 
          ? "fixed inset-0 z-40 bg-gray-50 flex flex-col items-center justify-center p-4 overflow-hidden"
          : "flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 flex flex-col lg:flex-row gap-8 items-start justify-center"
      }>
        
        {/* Exit Button (Visible only in Fullscreen) */}
        {isFullscreen && (
            <button 
              onClick={toggleFullscreen}
              className="absolute top-6 right-6 z-50 bg-white/90 backdrop-blur text-gray-500 hover:text-[#ed1c24] p-2 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200"
              title="Exit Fullscreen"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        )}

        {/* Left Column: Controls - Hidden in Fullscreen */}
        {!isFullscreen && (
          <div className="w-full lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
            <Controls 
              items={items}
              onAddName={handleAddName} 
              onBulkAdd={handleBulkAdd} 
              onClear={handleClear}
              onDelete={handleDelete}
              isSpinning={isSpinning}
              winnerCount={winnerCount}
              setWinnerCount={setWinnerCount}
              winnerHistory={winnerHistory}
              onClearHistory={handleClearHistory}
              title={title}
              setTitle={setTitle}
            />
          </div>
        )}

        {/* Right Column: Ticker Display - Centered and Scaled in Fullscreen */}
        <div className={
            isFullscreen
            ? "w-full max-w-6xl flex flex-col items-center animate-fade-in scale-110"
            : "w-full lg:w-2/3 flex flex-col items-center order-1 lg:order-2 min-h-[400px]"
        }>
          
          {/* Title Display */}
          <div className="w-full text-center mb-6 px-4">
             <h1 className={`font-black text-gray-900 mb-3 tracking-tighter uppercase drop-shadow-sm break-words ${isFullscreen ? 'text-6xl lg:text-8xl' : 'text-4xl md:text-5xl lg:text-6xl'}`}>
                {title}
             </h1>
             <div className={`bg-[#ed1c24] rounded-full mx-auto ${isFullscreen ? 'h-2 w-32' : 'h-1.5 w-24'}`}></div>
          </div>

          {/* Ticker */}
          <div className="w-full flex flex-col items-center justify-center mb-10">
            {items.length < 2 ? (
              <div className="text-center p-12 bg-white rounded-3xl shadow-xl border-2 border-dashed border-gray-200 w-full max-w-lg flex flex-col items-center justify-center">
                <span className="text-6xl mb-4 opacity-50 text-[#ed1c24]">🎰</span>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Ready to Pick?</h2>
                <p className="text-gray-500 font-medium">Add at least 2 entries to start the shuffle.</p>
              </div>
            ) : (
              <NameTicker 
                items={items} 
                isSpinning={isSpinning}
                onSpinComplete={handleSpinComplete}
                winners={winners}
              />
            )}
          </div>
          
          {/* Action Button */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <button
              onClick={spinWheel}
              disabled={isSpinning || items.length < 2}
              className={`w-full bg-gradient-to-r from-[#ed1c24] to-[#9d0a0e] hover:from-[#ff4d53] hover:to-[#b81b20] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-xl shadow-[#ed1c24]/30 transform hover:-translate-y-1 transition-all duration-200 active:translate-y-0 active:scale-95 uppercase tracking-wider flex items-center justify-center gap-3 ${isFullscreen ? 'py-6 text-3xl' : 'py-5 text-2xl'}`}
            >
              {isSpinning ? (
                <>
                   <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Choosing {winnerCount} {winnerCount > 1 ? 'Winners' : 'Winner'}...
                </>
              ) : (
                `PICK ${winnerCount} ${winnerCount > 1 ? 'WINNERS' : 'WINNER'}`
              )}
            </button>
            
            {!isFullscreen && (
                <p className="text-xs text-center text-gray-400 font-medium">
                Pro Tip: Use the bulk entry to paste thousands of names at once.
                </p>
            )}
          </div>
        </div>

      </main>

      {/* Winner Modal - Only show when NOT spinning */}
      <WinnerModal 
        winners={isSpinning ? [] : winners} 
        onClose={handleCloseModal} 
        onRemoveWinners={handleRemoveWinners}
      />
    </div>
  );
};

export default App;