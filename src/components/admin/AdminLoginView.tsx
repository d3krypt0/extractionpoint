import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ShieldAlert, ArrowLeft, Delete } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const AdminLoginView: React.FC = () => {
  const { authenticateStaff, navigateTo } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  // Keyboard support for typing PIN
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 4) {
          handleDigitPress(e.key);
        }
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        navigateTo('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, navigateTo]);

  const handleDigitPress = (digit: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    setError(false);

    if (nextPin.length === 4) {
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
    <div className="min-h-screen bg-[#0c0c0e] flex flex-col items-center justify-center p-4 text-white select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#c5a880]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md space-y-6">
        
        {/* Top Brand */}
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo variant="stacked" size="md" showTagline={false} />
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#c5a880]">
            <Lock className="w-3.5 h-3.5" />
            <span>Staff & Management Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <div 
          className={`p-6 sm:p-8 rounded-3xl bg-[#141417] border border-[#26262b] shadow-2xl space-y-6 ${
            shake ? 'animate-shake' : ''
          }`}
        >
          <div className="text-center space-y-1">
            <h2 className="font-serif text-xl font-bold text-white">
              Enter Staff Terminal PIN
            </h2>
            <p className="text-xs text-gray-400">
              Access Kitchen KDS, Counter POS, Inventory & Z-Report
            </p>
          </div>

          {/* PIN Indicators */}
          <div className="space-y-2 text-center py-1">
            <div className="flex justify-center items-center space-x-4">
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
              <p className="text-xs text-rose-400 font-bold flex items-center justify-center space-x-1 animate-pulse pt-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Incorrect PIN. Please try again.</span>
              </p>
            ) : (
              <p className="text-[11px] text-gray-500 pt-2 font-mono">
                Default Staff PIN: <strong>1234</strong>
              </p>
            )}
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitPress(digit)}
                className="h-14 rounded-2xl bg-[#1e1e24] hover:bg-[#282830] active:scale-95 text-xl font-bold font-mono text-white transition-all border border-[#2a2a32] shadow-sm flex items-center justify-center"
              >
                {digit}
              </button>
            ))}

            {/* Clear */}
            <button
              type="button"
              onClick={handleClear}
              className="h-14 rounded-2xl bg-[#1e1e24]/60 hover:bg-[#282830] text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all border border-[#2a2a32] flex items-center justify-center"
            >
              Clear
            </button>

            {/* Zero */}
            <button
              type="button"
              onClick={() => handleDigitPress('0')}
              className="h-14 rounded-2xl bg-[#1e1e24] hover:bg-[#282830] active:scale-95 text-xl font-bold font-mono text-white transition-all border border-[#2a2a32] shadow-sm flex items-center justify-center"
            >
              0
            </button>

            {/* Backspace */}
            <button
              type="button"
              onClick={handleBackspace}
              className="h-14 rounded-2xl bg-[#1e1e24]/60 hover:bg-[#282830] text-gray-400 hover:text-white transition-all border border-[#2a2a32] flex items-center justify-center"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Return to Customer Portal */}
          <div className="pt-2 border-t border-[#222228] text-center">
            <button
              type="button"
              onClick={() => navigateTo('/')}
              className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-[#c5a880] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Online Customer Menu (Order & Reserve)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
