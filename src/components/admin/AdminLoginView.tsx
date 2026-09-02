import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ShieldAlert, ArrowLeft, Delete } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const AdminLoginView: React.FC = () => {
  const { authenticateStaff, navigateTo, staffPin } = useApp();
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
    <div className="min-h-screen bg-[#0e0e11] text-[#f8f7f4] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Return to Customer Storefront */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigateTo('/')}
          className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#c5a880]/50 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Customer Menu</span>
        </button>
      </div>

      <div className="w-full max-w-sm space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo variant="horizontal" size="md" showTagline={false} />
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#c5a880]/15 text-[#dfcca9] text-xs font-mono font-bold tracking-wider border border-[#c5a880]/30">
            <Lock className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Staff Terminal Authentication</span>
          </div>
        </div>

        {/* PIN Input & Visualizer Box */}
        <div className="p-6 rounded-3xl bg-[#141417] border border-[#222228] shadow-2xl space-y-5">
          <div className="text-center space-y-2">
            <h3 className="font-serif text-base font-bold text-white">
              Enter 4-Digit Staff PIN
            </h3>
            
            {/* PIN Indicator Dots */}
            <div className={`flex items-center justify-center space-x-3.5 py-3 ${shake ? 'animate-shake' : ''}`}>
              {[0, 1, 2, 3].map((i) => {
                const filled = i < pin.length;
                return (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      error
                        ? 'bg-rose-500 border-rose-500 scale-110 shadow-rose-500/50 shadow-md'
                        : filled
                        ? 'bg-[#c5a880] border-[#c5a880] scale-110 shadow-[#c5a880]/40 shadow-sm'
                        : 'bg-zinc-800 border border-zinc-700'
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
                {staffPin === '1234' ? 'Default Staff PIN: 1234' : 'Authorized Staff PIN Required'}
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
