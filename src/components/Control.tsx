import React, { useState, useMemo } from 'react';
import type { WheelItem, WinnerRecord } from '../types';

interface ControlsProps {
  items: WheelItem[];
  onAddName: (name: string) => void;
  onBulkAdd: (names: string[]) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
  isSpinning: boolean;
  
  // Winner Config
  winnerCount: number;
  setWinnerCount: (count: number) => void;
  
  // History
  winnerHistory: WinnerRecord[];
  onClearHistory: () => void;

  // Settings
  title: string;
  setTitle: (title: string) => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  items, 
  onAddName, 
  onBulkAdd, 
  onClear, 
  onDelete, 
  isSpinning,
  winnerCount,
  setWinnerCount,
  winnerHistory,
  onClearHistory,
  title,
  setTitle
}) => {
  const [inputValue, setInputValue] = useState('');
  const [tab, setTab] = useState<'manual' | 'winners'>('manual');

  const visibleItems = useMemo(() => items.slice(0, 50), [items]);
  const hiddenCount = items.length - visibleItems.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (inputValue.includes('\n')) {
        const names = inputValue.split('\n').map(n => n.trim()).filter(n => n.length > 0);
        onBulkAdd(names);
      } else {
        onAddName(inputValue.trim());
      }
      setInputValue('');
    }
  };

  const maxWinners = items.length > 0 ? items.length : 1;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-100 flex flex-col h-[600px]">
      {/* Tabs */}
      <div className="flex mb-4 bg-gray-100 p-1 rounded-lg shrink-0">
        <button
          type="button"
          onClick={() => setTab('manual')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all ${
            tab === 'manual' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Entries
        </button>
        <button
          type="button"
          onClick={() => setTab('winners')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all flex items-center justify-center gap-1 ${
            tab === 'winners' ? 'bg-white text-[#f5821f] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
           <span>Winners ({winnerHistory.length})</span>
        </button>
      </div>

      {/* CONTENT: MANUAL */}
      {tab === 'manual' && (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="shrink-0 mb-4 space-y-4">
                {/* Title Input */}
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Giveaway Title</label>
                   <input
                     type="text"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#ed1c24] focus:border-transparent outline-none text-sm font-bold text-gray-800 transition-shadow"
                     placeholder="Enter giveaway title..."
                     disabled={isSpinning}
                   />
                </div>

                {/* Winner Count Setting */}
                <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-100">
                    <label className="text-xs font-bold text-[#9d0a0e] uppercase">Winners to Pick:</label>
                    <div className="flex items-center gap-2">
                        <button 
                            type="button"
                            onClick={() => setWinnerCount(Math.max(1, winnerCount - 1))}
                            disabled={winnerCount <= 1 || isSpinning}
                            className="w-6 h-6 rounded bg-white text-[#ed1c24] shadow-sm flex items-center justify-center hover:bg-red-100 disabled:opacity-50 font-bold"
                        >
                            -
                        </button>
                        <span className="text-sm font-bold text-[#9d0a0e] w-8 text-center">{winnerCount}</span>
                        <button 
                            type="button"
                            onClick={() => setWinnerCount(Math.min(maxWinners, winnerCount + 1))}
                            disabled={winnerCount >= maxWinners || isSpinning}
                            className="w-6 h-6 rounded bg-white text-[#ed1c24] shadow-sm flex items-center justify-center hover:bg-red-100 disabled:opacity-50 font-bold"
                        >
                            +
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Add Entries</label>
                    <div className="relative">
                        <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter a name or paste a list..."
                        className="w-full h-20 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#ed1c24] focus:border-transparent outline-none transition-shadow resize-none text-sm"
                        disabled={isSpinning}
                        />
                        <button
                        type="submit"
                        disabled={!inputValue.trim() || isSpinning}
                        className="absolute bottom-2 right-2 bg-[#ed1c24] hover:bg-[#9d0a0e] disabled:bg-gray-300 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                        >
                        Add
                        </button>
                    </div>
                </form>
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2 shrink-0">
                <h3 className="font-semibold text-gray-700 text-sm">Current List</h3>
                <div className="flex items-center gap-3">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                        {items.length}
                    </span>
                    {items.length > 0 && (
                        <button
                        type="button"
                        onClick={onClear}
                        disabled={isSpinning}
                        className="text-xs text-[#ed1c24] hover:text-[#9d0a0e] font-medium disabled:opacity-50"
                        >
                        Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                        <span className="text-2xl">📝</span>
                        <p className="text-sm">List is empty</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                    {visibleItems.map((item) => (
                        <div 
                        key={item.id} 
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-lg group hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div 
                                className="w-2 h-2 rounded-full shrink-0" 
                                style={{ backgroundColor: item.color }}
                                />
                                <span className="text-gray-700 font-medium text-sm truncate">
                                {item.label}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onDelete(item.id)}
                                disabled={isSpinning}
                                className="text-gray-300 hover:text-[#ed1c24] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 px-2"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {hiddenCount > 0 && (
                        <div className="text-center py-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-xs text-gray-500 font-medium">
                                And {hiddenCount.toLocaleString()} more entries...
                            </p>
                        </div>
                    )}
                    </div>
                )}
            </div>
        </div>
      )}

      {/* CONTENT: WINNERS */}
      {tab === 'winners' && (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2 shrink-0">
                <h3 className="font-semibold text-gray-700 text-sm">Past Winners</h3>
                {winnerHistory.length > 0 && (
                     <button
                     type="button"
                     onClick={onClearHistory}
                     className="text-xs text-[#ed1c24] hover:text-[#9d0a0e] font-medium"
                     >
                     Reset History
                     </button>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                {winnerHistory.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                        <span className="text-2xl">🏆</span>
                        <p className="text-sm">No winners yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                         {/* Group by batch based on batchId or just generic grouping. For now, simple reverse list */}
                         {[...winnerHistory].reverse().map((record, idx) => (
                             <div key={record.id} className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex items-center justify-between">
                                 <div>
                                     <p className="font-bold text-gray-800">{record.item.label}</p>
                                     <p className="text-xs text-orange-700/60">
                                         {record.timestamp.toLocaleTimeString()} 
                                         <span className="mx-1">•</span> 
                                         {record.timestamp.toLocaleDateString()}
                                     </p>
                                 </div>
                                 <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center text-xs font-bold text-orange-800">
                                     #{winnerHistory.length - idx}
                                 </div>
                             </div>
                         ))}
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Controls;