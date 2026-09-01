import React, { useState } from 'react';
import { formatPhp, generateGCashReference } from '../../utils/phCurrency';
import { sounds } from '../../utils/audio';
import { X, Smartphone, QrCode, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GCashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentSuccess: (details: { gcashRef: string; gcashMobile: string }) => void;
}

export const GCashPaymentModal: React.FC<GCashPaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'qr' | 'mobile'>('qr');
  const [mobileNumber, setMobileNumber] = useState('0917');
  const [step, setStep] = useState<'details' | 'otp' | 'mpin' | 'success'>('details');
  const [otp, setOtp] = useState('123456');
  const [mpin, setMpin] = useState('••••');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedRef] = useState(() => generateGCashReference());

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#007DFE', '#c5a880', '#10B981', '#ffffff']
      });
    } catch {}
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 11) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 800);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('mpin');
    }, 800);
  };

  const handleMpinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      sounds.playPaymentSuccess();
      triggerConfetti();
      setTimeout(() => {
        onPaymentSuccess({
          gcashRef: generatedRef,
          gcashMobile: mobileNumber,
        });
      }, 1400);
    }, 1000);
  };

  const handleQrApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      sounds.playPaymentSuccess();
      triggerConfetti();
      setTimeout(() => {
        onPaymentSuccess({
          gcashRef: generatedRef,
          gcashMobile: '0917-SCAN-QR',
        });
      }, 1400);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-blue-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* GCash Top Brand Banner */}
        <div className="bg-[#007DFE] p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#007DFE] font-black text-lg shadow-sm">
              G
            </div>
            <div>
              <div className="font-black text-sm tracking-wide">GCash Checkout</div>
              <div className="text-[10px] text-blue-100 font-medium">Merchant: EXTRACTION POINT CAFE</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Header */}
        <div className="bg-gradient-to-b from-blue-50 to-white px-5 py-4 border-b border-blue-100/60 flex items-center justify-between">
          <span className="text-xs text-gray-600 font-medium">Amount to Pay</span>
          <span className="font-mono text-2xl font-black text-[#007DFE]">
            {formatPhp(totalAmount)}
          </span>
        </div>

        {/* Modal Content */}
        <div className="p-5 flex-1 overflow-y-auto">
          {step === 'details' && (
            <div className="space-y-4">
              
              {/* Payment Mode Selector: QR vs Mobile Number */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-gray-100">
                <button
                  type="button"
                  onClick={() => setMethod('qr')}
                  className={`flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
                    method === 'qr'
                      ? 'bg-[#007DFE] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan GCash QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('mobile')}
                  className={`flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
                    method === 'mobile'
                      ? 'bg-[#007DFE] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Express Pay</span>
                </button>
              </div>

              {method === 'qr' ? (
                <div className="flex flex-col items-center text-center p-3">
                  {/* Dynamic GCash QR Code Mock */}
                  <div className="p-4 bg-white rounded-2xl border-2 border-[#007DFE]/30 shadow-inner my-2 flex flex-col items-center">
                    <svg viewBox="0 0 160 160" className="w-40 h-40">
                      {/* Stylized QR Matrix */}
                      <rect width="160" height="160" fill="#ffffff" />
                      {/* Top Left Marker */}
                      <rect x="10" y="10" width="40" height="40" rx="6" fill="#007DFE" />
                      <rect x="18" y="18" width="24" height="24" rx="3" fill="#ffffff" />
                      <rect x="24" y="24" width="12" height="12" rx="2" fill="#007DFE" />
                      {/* Top Right Marker */}
                      <rect x="110" y="10" width="40" height="40" rx="6" fill="#007DFE" />
                      <rect x="118" y="18" width="24" height="24" rx="3" fill="#ffffff" />
                      <rect x="124" y="24" width="12" height="12" rx="2" fill="#007DFE" />
                      {/* Bottom Left Marker */}
                      <rect x="10" y="110" width="40" height="40" rx="6" fill="#007DFE" />
                      <rect x="18" y="118" width="24" height="24" rx="3" fill="#ffffff" />
                      <rect x="24" y="124" width="12" height="12" rx="2" fill="#007DFE" />
                      {/* Data Pattern Dots */}
                      <rect x="60" y="20" width="10" height="10" rx="2" fill="#333333" />
                      <rect x="80" y="20" width="15" height="10" rx="2" fill="#333333" />
                      <rect x="60" y="40" width="20" height="10" rx="2" fill="#333333" />
                      <rect x="90" y="40" width="10" height="10" rx="2" fill="#333333" />
                      <rect x="20" y="60" width="10" height="20" rx="2" fill="#333333" />
                      <rect x="40" y="60" width="15" height="15" rx="2" fill="#333333" />
                      <rect x="65" y="65" width="30" height="30" rx="6" fill="#007DFE" />
                      <circle cx="80" cy="80" r="10" fill="#ffffff" />
                      <text x="80" y="85" textAnchor="middle" fill="#007DFE" fontSize="14" fontWeight="bold">G</text>
                      <rect x="110" y="60" width="20" height="10" rx="2" fill="#333333" />
                      <rect x="135" y="60" width="15" height="20" rx="2" fill="#333333" />
                      <rect x="20" y="90" width="20" height="10" rx="2" fill="#333333" />
                      <rect x="60" y="110" width="15" height="10" rx="2" fill="#333333" />
                      <rect x="85" y="110" width="20" height="15" rx="2" fill="#333333" />
                      <rect x="115" y="115" width="30" height="10" rx="2" fill="#333333" />
                      <rect x="60" y="130" width="40" height="15" rx="2" fill="#333333" />
                      <rect x="110" y="135" width="20" height="15" rx="2" fill="#333333" />
                    </svg>
                    <span className="text-[11px] font-mono text-gray-500 mt-2 font-medium">
                      Ref: {generatedRef}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Open your GCash app, tap <strong>Scan QR</strong> and confirm payment.
                  </p>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleQrApprove}
                    className="w-full mt-4 py-3 rounded-2xl bg-[#007DFE] text-white font-bold text-xs flex items-center justify-center space-x-2 hover:bg-[#006bd9] active:scale-[0.98] transition-all shadow-md"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying GCash Payment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Simulate Scanned & Paid</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleMobileSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      GCash Registered Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        maxLength={11}
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="09171234567"
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-300 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-[#007DFE] focus:ring-2 focus:ring-[#007DFE]/20"
                      />
                      <Smartphone className="w-4 h-4 text-gray-400 absolute right-4 top-3.5" />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Secured with GCash authentication</span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || mobileNumber.length < 11}
                    className="w-full py-3 rounded-2xl bg-[#007DFE] text-white font-bold text-xs flex items-center justify-center space-x-2 hover:bg-[#006bd9] active:scale-[0.98] transition-all disabled:opacity-50 shadow-md"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Next: Send OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Step 2: Simulated OTP */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#007DFE] flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Enter 6-Digit SMS Code</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sent to {mobileNumber.slice(0, 4)}****{mobileNumber.slice(-3)}
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-3 text-center tracking-[0.5em] font-mono text-xl font-black bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:border-[#007DFE]"
                />
                <div className="text-center mt-2">
                  <span className="text-[11px] text-[#007DFE] font-medium cursor-pointer">
                    Resend Code (30s)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-2xl bg-[#007DFE] text-white font-bold text-xs flex items-center justify-center space-x-2 hover:bg-[#006bd9] transition-all shadow-md"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify & Proceed to MPIN</span>}
              </button>
            </form>
          )}

          {/* Step 3: MPIN */}
          {step === 'mpin' && (
            <form onSubmit={handleMpinSubmit} className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#007DFE] flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Enter 4-Digit GCash MPIN</h4>
                <p className="text-xs text-gray-500 mt-0.5">Do not share your MPIN with anyone</p>
              </div>

              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value)}
                  className="w-full py-3 text-center tracking-[0.8em] font-mono text-2xl font-black bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:border-[#007DFE]"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-2xl bg-[#007DFE] text-white font-bold text-xs flex items-center justify-center space-x-2 hover:bg-[#006bd9] transition-all shadow-md"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Pay {formatPhp(totalAmount)}</span>}
              </button>
            </form>
          )}

          {/* Step 4: Success Receipt */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-3 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-gray-900">Payment Successful!</h4>
              <p className="font-mono text-2xl font-black text-[#007DFE]">
                {formatPhp(totalAmount)}
              </p>
              
              <div className="p-3 bg-gray-50 rounded-2xl text-left text-xs space-y-1.5 border border-gray-200">
                <div className="flex justify-between text-gray-500">
                  <span>Merchant:</span>
                  <span className="font-bold text-gray-800">EXTRACTION POINT CAFE</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GCash Ref:</span>
                  <span className="font-mono font-bold text-[#007DFE]">{generatedRef}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Date & Time:</span>
                  <span className="text-gray-800">{new Date().toLocaleString('en-PH')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
