import React from 'react';
import type { WheelItem } from '../types';

interface WinnerModalProps {
  winners: WheelItem[];
  onClose: () => void;
  onRemoveWinners?: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winners, onClose, onRemoveWinners }) => {
  if (winners.length === 0) return null;

  const isMultiple = winners.length > 1;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`bg-white rounded-[2rem] shadow-2xl w-full p-8 transform transition-all animate-bounce-in text-center border border-white/20 relative overflow-hidden ${isMultiple ? 'max-w-2xl' : 'max-w-md'}`}>
        
        {/* Background confetti decoration inside modal */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-yellow-50 to-transparent -z-10"></div>

        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#ffcb04] via-[#f5821f] to-[#ed1c24] text-5xl shadow-xl ring-8 ring-yellow-50">
          🎉
        </div>
        
        <h3 className="text-[#9d0a0e] text-sm font-bold uppercase tracking-widest mb-2">
            {isMultiple ? `${winners.length} Winners Selected` : 'Winner Selected'}
        </h3>
        
        {isMultiple ? (
            <div className="mb-8 max-h-[40vh] overflow-y-auto custom-scrollbar border rounded-xl bg-gray-50 p-2 shadow-inner text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {winners.map((winner, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                             <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold shrink-0">
                                 {idx + 1}
                             </span>
                             <span className="font-bold text-gray-800 truncate">{winner.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className="text-5xl font-black text-gray-900 mb-8 break-words leading-tight tracking-tight py-2">
                {winners[0].label}
            </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-[#ed1c24] hover:bg-[#9d0a0e] text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg shadow-[#ed1c24]/30 text-lg active:scale-95 transform duration-100"
          >
            Keep & Spin Again
          </button>
          
          {onRemoveWinners && (
            <button
              onClick={() => {
                onRemoveWinners();
                onClose();
              }}
              className="w-full bg-white hover:bg-gray-50 text-gray-600 font-semibold py-4 px-6 rounded-2xl transition-colors border-2 border-gray-100 hover:border-gray-200 active:scale-95 transform duration-100"
            >
              {isMultiple ? 'Remove All Winners & Spin Again' : 'Remove Winner & Spin Again'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;