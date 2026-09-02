import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, X, Check, AlertCircle, CheckCircle2, Delete, Shield } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({ isOpen, onClose }) => {
  const { updateStaffPin, soundEnabled } = useApp();

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [activeField, setActiveField] = useState<'current' | 'new' | 'confirm'>('current');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setActiveField('current');
      setErrorMessage(null);
      setSuccessMessage(null);
      setShake(false);
    }
  }, [isOpen]);

  // Physical keyboard listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (activeField === 'current') setActiveField('new');
        else if (activeField === 'new') setActiveField('confirm');
        else if (activeField === 'confirm') handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeField, currentPin, newPin, confirmPin]);

  if (!isOpen) return null;

  const handleDigitPress = (digit: string) => {
    setErrorMessage(null);

    if (activeField === 'current') {
      if (currentPin.length < 4) {
        const next = currentPin + digit;
        setCurrentPin(next);
        if (next.length === 4) {
          setActiveField('new');
        }
      }
    } else if (activeField === 'new') {
      if (newPin.length < 4) {
        const next = newPin + digit;
        setNewPin(next);
        if (next.length === 4) {
          setActiveField('confirm');
        }
      }
    } else if (activeField === 'confirm') {
      if (confirmPin.length < 4) {
        const next = confirmPin + digit;
        setConfirmPin(next);
      }
    }
  };

  const handleBackspace = () => {
    setErrorMessage(null);
    if (activeField === 'current') {
      setCurrentPin((prev) => prev.slice(0, -1));
    } else if (activeField === 'new') {
      setNewPin((prev) => prev.slice(0, -1));
    } else if (activeField === 'confirm') {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
  };

  const handleClearField = () => {
    setErrorMessage(null);
    if (activeField === 'current') setCurrentPin('');
    else if (activeField === 'new') setNewPin('');
    else if (activeField === 'confirm') setConfirmPin('');
  };

  const handleSubmit = () => {
    setErrorMessage(null);

    if (currentPin.length !== 4) {
      setErrorMessage('Please enter your 4-digit current PIN.');
      setActiveField('current');
      triggerShake();
      return;
    }

    if (newPin.length !== 4) {
      setErrorMessage('Please enter a 4-digit new PIN.');
      setActiveField('new');
      triggerShake();
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMessage('New PIN and Confirmation PIN do not match.');
      setActiveField('confirm');
      triggerShake();
      return;
    }

    const res = updateStaffPin(currentPin, newPin);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to update PIN.');
      triggerShake();
    } else {
      setSuccessMessage('Admin PIN successfully updated!');
      if (soundEnabled) sounds.playPaymentSuccess();
      setTimeout(() => {
        onClose();
      }, 1400);
    }
  };

  const triggerShake = () => {
    setShake(true);
    if (soundEnabled) sounds.playErrorChime();
    setTimeout(() => setShake(false), 500);
  };

  const renderPinDots = (val: string, field: 'current' | 'new' | 'confirm') => {
    const isSelected = activeField === field;
    return (
      <div 
        onClick={() => setActiveField(field)}
        className={`flex items-center justify-center space-x-2.5 p-3 rounded-xl cursor-pointer transition-all border ${
          isSelected 
            ? 'bg-[#1a1a20] border-[#c5a880] ring-1 ring-[#c5a880]/50' 
            : 'bg-[#151518] border-[#2a2a30] hover:border-gray-600'
        }`}
      >
        {[0, 1, 2, 3].map((i) => {
          const filled = i < val.length;
          return (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                filled
                  ? 'bg-[#c5a880] scale-110 shadow-sm'
                  : 'bg-zinc-700/60 border border-zinc-600'
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-md bg-[#0f0f13] text-[#f8f7f4] rounded-3xl border border-[#26262e] shadow-2xl p-6 sm:p-7 space-y-5 transition-transform ${
          shake ? 'animate-shake border-rose-500' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222228] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#c5a880]/15 text-[#c5a880]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                Change Admin PIN
              </h3>
              <p className="text-xs text-gray-400">
                Update security PIN for POS, KDS & Admin Console
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 3 Step Input Visualizer */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-gray-300">
              <span>1. Enter Current PIN</span>
              <span className="font-mono text-[10px] text-gray-500">
                {currentPin.length}/4 digits
              </span>
            </div>
            {renderPinDots(currentPin, 'current')}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-gray-300">
              <span>2. Enter New 4-Digit PIN</span>
              <span className="font-mono text-[10px] text-gray-500">
                {newPin.length}/4 digits
              </span>
            </div>
            {renderPinDots(newPin, 'new')}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-gray-300">
              <span>3. Confirm New PIN</span>
              <span className="font-mono text-[10px] text-gray-500">
                {confirmPin.length}/4 digits
              </span>
            </div>
            {renderPinDots(confirmPin, 'confirm')}
          </div>
        </div>

        {/* On-Screen Keypad */}
        <div className="pt-1">
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitPress(digit)}
                className="h-12 rounded-xl bg-[#17171d] hover:bg-[#24242e] active:scale-95 text-white font-mono font-bold text-lg transition-all border border-[#24242e] flex items-center justify-center shadow-xs"
              >
                {digit}
              </button>
            ))}

            {/* Clear Field */}
            <button
              type="button"
              onClick={handleClearField}
              className="h-12 rounded-xl bg-[#17171d]/60 hover:bg-[#24242e] active:scale-95 text-xs font-mono font-bold text-gray-400 hover:text-white transition-all border border-[#24242e] flex items-center justify-center"
            >
              Clear
            </button>

            {/* Zero */}
            <button
              type="button"
              onClick={() => handleDigitPress('0')}
              className="h-12 rounded-xl bg-[#17171d] hover:bg-[#24242e] active:scale-95 text-white font-mono font-bold text-lg transition-all border border-[#24242e] flex items-center justify-center shadow-xs"
            >
              0
            </button>

            {/* Backspace */}
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 rounded-xl bg-[#17171d]/60 hover:bg-[#24242e] active:scale-95 text-gray-400 hover:text-white transition-all border border-[#24242e] flex items-center justify-center"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-[#2c2c34] bg-transparent hover:bg-zinc-800 text-gray-300 font-bold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 px-4 rounded-xl bg-[#c5a880] hover:bg-[#d5baa0] text-black font-brand font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>Save New PIN</span>
          </button>
        </div>

        {/* Security Note */}
        <div className="text-center text-[10px] text-gray-500 flex items-center justify-center space-x-1 font-mono">
          <Shield className="w-3 h-3 text-[#c5a880]" />
          <span>New PIN persists across browser sessions & staff logins</span>
        </div>

      </div>
    </div>
  );
};
