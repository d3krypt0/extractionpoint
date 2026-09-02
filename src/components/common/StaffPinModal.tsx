import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, X, Delete, CheckCircle2, ShieldAlert } from 'lucide-react';

export const StaffPinModal: React.FC = () => {
  const { 
    isStaffPinModalOpen, 
    setIsStaffPinModalOpen, 
    authenticateStaff,
    staffPin
  } = useApp();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isStaffPinModalOpen) {
      setPin('');
      setError(false);
      setShake(false);
    }
  }, [isStaffPinModalOpen]);

  // Physical keyboard listener
  useEffect(() => {
    if (!isStaffPinModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 4) {
          handleDigitPress(e.key);
        }
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        setIsStaffPinModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStaffPinModalOpen, pin]);

  if (!isStaffPinModalOpen) return null;

  const handleDigitPress = (digit: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    setError(false);

    if (nextPin.length === 4) {
      // Auto-validate once 4 digits entered
      setTimeout(() => {
        const success = authenticateStaff(nextPin);
        if (!success) {
          setError(true);
          setShake(true);
          setTimeout(() => {
            setPin('');
            setShake(false);
          }, 600);
        }
      }, 150);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className={`relative w-full max-w-sm bg-[#121215] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-[#2b2b32] space-y-6 select-none ${
          shake ? 'animate-shake' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#c5a880]/15 text-[#c5a880] flex items-center justify-center border border-[#c5a880]/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Staff Authentication
              </h3>
              <p className="text-[11px] text-gray-400">Restricted Staff & Admin Portal</p>
            </div>
          </div>
          <button
            onClick={() => setIsStaffPinModalOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Indicators */}
        <div className="space-y-2 text-center py-2">
          <div className="flex justify-center items-center space-x-3">
            {[0, 1, 2, 3].map((idx) => {
              const filled = idx < pin.length;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    filled
                      ? 'bg-[#c5a880] scale-125 shadow-md shadow-[#c5a880]/50'
                      : 'border-2 border-gray-600 bg-transparent'
                  }`}
                />
              );
            })}
          </div>

          {error ? (
            <p className="text-xs text-rose-400 font-bold flex items-center justify-center space-x-1 animate-pulse pt-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Incorrect PIN. Please try again.</span>
            </p>
          ) : (
            <p className="text-[11px] text-gray-400 pt-1">
              Enter your 4-digit staff terminal PIN
            </p>
          )}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitPress(digit)}
              className="h-14 rounded-2xl bg-[#1b1b20] hover:bg-[#26262e] active:scale-95 text-xl font-bold font-mono text-white transition-all border border-[#2e2e38] shadow-sm flex items-center justify-center"
            >
              {digit}
            </button>
          ))}

          {/* Clear */}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-[#1b1b20]/60 hover:bg-[#26262e] text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all border border-[#2e2e38] flex items-center justify-center"
          >
            Clear
          </button>

          {/* Zero */}
          <button
            type="button"
            onClick={() => handleDigitPress('0')}
            className="h-14 rounded-2xl bg-[#1b1b20] hover:bg-[#26262e] active:scale-95 text-xl font-bold font-mono text-white transition-all border border-[#2e2e38] shadow-sm flex items-center justify-center"
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-[#1b1b20]/60 hover:bg-[#26262e] text-gray-400 hover:text-white transition-all border border-[#2e2e38] flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Hint & Return */}
        <div className="text-center pt-2 space-y-2 border-t border-[#222228]">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 text-[10px] text-gray-400 font-mono">
            <CheckCircle2 className="w-3 h-3 text-[#c5a880]" />
            <span>{staffPin === '1234' ? 'Default Staff PIN: 1234' : 'Authorized Staff PIN Required'}</span>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsStaffPinModalOpen(false)}
              className="text-xs text-gray-400 hover:text-white underline font-medium"
            >
              Return to Customer Menu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
